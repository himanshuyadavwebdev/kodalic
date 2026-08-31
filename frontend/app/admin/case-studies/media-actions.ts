"use server";

import { randomUUID } from "crypto";

import { createClient } from "../../../lib/supabase/server";
import { hasPermission } from "../../../lib/auth/permissions";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

type UploadCaseStudyMediaResult = {
  success: boolean;
  mediaId: string | null;
  error: string | null;
};

export async function uploadCaseStudyMedia(
  caseStudyId: string,
  formData: FormData,
): Promise<UploadCaseStudyMediaResult> {
  if (!caseStudyId) {
    return {
      success: false,
      mediaId: null,
      error: "Case Study ID is required.",
    };
  }

  const allowed = await hasPermission("media.create");

  if (!allowed) {
    return {
      success: false,
      mediaId: null,
      error: "You do not have permission to upload media.",
    };
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return {
      success: false,
      mediaId: null,
      error: "No image file was provided.",
    };
  }

  if (file.size <= 0) {
    return {
      success: false,
      mediaId: null,
      error: "The selected file is empty.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      mediaId: null,
      error: "Image must be smaller than 10 MB.",
    };
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return {
      success: false,
      mediaId: null,
      error:
        "Unsupported image type. Use JPG, PNG, WebP, or AVIF.",
    };
  }

  const supabase = await createClient();

  const { data: caseStudy, error: caseStudyError } =
    await supabase
      .from("case_studies")
      .select("id")
      .eq("id", caseStudyId)
      .maybeSingle();

  if (caseStudyError) {
    console.error(
      "Failed to verify case study:",
      caseStudyError,
    );

    return {
      success: false,
      mediaId: null,
      error: "Unable to verify the Case Study.",
    };
  }

  if (!caseStudy) {
    return {
      success: false,
      mediaId: null,
      error: "Case Study not found.",
    };
  }

  const extension =
    file.name.split(".").pop()?.toLowerCase() || "bin";

  const mediaId = randomUUID();

  const storageKey =
    `case-studies/${caseStudyId}/${mediaId}.${extension}`;

  const fileBuffer = Buffer.from(
    await file.arrayBuffer(),
  );

  const { error: uploadError } =
    await supabase.storage
      .from("case-study-media")
      .upload(storageKey, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

  if (uploadError) {
    console.error(
      "Case Study media upload failed:",
      uploadError,
    );

    return {
      success: false,
      mediaId: null,
      error:
        uploadError.message ||
        "Failed to upload image.",
    };
  }

  const { error: mediaError } = await supabase
    .from("media")
    .insert({
      id: mediaId,
      storage_key: storageKey,
      filename: file.name,
      mime: file.type,
      size: file.size,
    });

  if (mediaError) {
    console.error(
      "Failed to create media record:",
      mediaError,
    );

    await supabase.storage
      .from("case-study-media")
      .remove([storageKey]);

    return {
      success: false,
      mediaId: null,
      error:
        mediaError.message ||
        "Failed to create media record.",
    };
  }

  const { error: relationError } = await supabase
    .from("case_study_media")
    .insert({
      case_study_id: caseStudyId,
      media_id: mediaId,
      order: 999,
    });

  if (relationError) {
    console.error(
      "Failed to attach media to Case Study:",
      relationError,
    );

    await supabase
      .from("media")
      .delete()
      .eq("id", mediaId);

    await supabase.storage
      .from("case-study-media")
      .remove([storageKey]);

    return {
      success: false,
      mediaId: null,
      error:
        relationError.message ||
        "Failed to attach image to Case Study.",
    };
  }

  return {
    success: true,
    mediaId,
    error: null,
  };
}