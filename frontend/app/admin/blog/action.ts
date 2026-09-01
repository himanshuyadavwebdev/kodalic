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

export type UploadBlogCoverResult = {
  success: boolean;
  mediaId: string | null;
  error: string | null;
};

export async function uploadBlogCoverImage(
  formData: FormData,
): Promise<UploadBlogCoverResult> {
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
      error: "Unsupported image type. Use JPG, PNG, WebP, or AVIF.",
    };
  }

  const supabase = await createClient();

  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const mediaId = randomUUID();
  const storageKey = `blog/${mediaId}.${extension}`;

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("case-study-media")
    .upload(storageKey, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Blog cover upload failed:", uploadError);
    return {
      success: false,
      mediaId: null,
      error: uploadError.message || "Failed to upload image.",
    };
  }

  const { error: mediaError } = await supabase.from("media").insert({
    id: mediaId,
    storage_key: storageKey,
    filename: file.name,
    mime: file.type,
    size: file.size,
  });

  if (mediaError) {
    console.error("Failed to create media record for blog cover:", mediaError);
    await supabase.storage.from("case-study-media").remove([storageKey]);
    return {
      success: false,
      mediaId: null,
      error: mediaError.message || "Failed to create media record.",
    };
  }

  return {
    success: true,
    mediaId,
    error: null,
  };
}


export type BlogInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorId: string | null;
  status: "draft" | "published";
  publishedAt: string | null;
  categoryId: string | null;
  coverMediaId: string | null;
  featured: boolean;
  tagIds: string[];
};

export async function createBlogPost(input: BlogInput) {
  const allowed = await hasPermission("blog.create");

  if (!allowed) {
    return {
      success: false,
      postId: null,
      error: "You do not have permission to create blog posts.",
    };
  }

  if (input.status === "published") {
    const canPublish = await hasPermission("blog.publish");

    if (!canPublish) {
      return {
        success: false,
        postId: null,
        error: "You do not have permission to publish blog posts.",
      };
    }
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "create_admin_blog_post",
    {
      p_slug: input.slug.trim(),
      p_title: input.title.trim(),
      p_excerpt: input.excerpt.trim() || null,
      p_content: input.content.trim(),
      p_author_id: input.authorId,
      p_status: input.status,
      p_published_at: input.publishedAt || null,
      p_category_id: input.categoryId,
      p_cover_media_id: input.coverMediaId,
      p_featured: input.featured,
    },
  );

  if (error) {
    console.error("Blog post creation failed:", error);

    return {
      success: false,
      postId: null,
      error: error.message || "Unable to create blog post.",
    };
  }

  const postId = data as string;

  const { error: relationshipError } = await supabase.rpc(
    "update_admin_blog_relationships",
    {
      p_post_id: postId,
      p_tag_ids: input.tagIds,
    },
  );

  if (relationshipError) {
    console.error(
      "Blog post relationships update failed:",
      relationshipError,
    );

    return {
      success: false,
      postId,
      error:
        relationshipError.message ||
        "Blog post created, but tags could not be saved.",
    };
  }

  return {
    success: true,
    postId,
    error: null,
  };
}


export async function updateBlogPost(
  postId: string,
  input: BlogInput,
) {
  if (!postId) {
    return {
      success: false,
      error: "Blog post ID is required.",
    };
  }

  const allowed = await hasPermission("blog.update");

  if (!allowed) {
    return {
      success: false,
      error: "You do not have permission to update blog posts.",
    };
  }

  if (input.status === "published") {
    const canPublish = await hasPermission("blog.publish");

    if (!canPublish) {
      return {
        success: false,
        error: "You do not have permission to publish blog posts.",
      };
    }
  }

  const supabase = await createClient();

  const { error } = await supabase.rpc(
    "update_admin_blog_post",
    {
      p_post_id: postId,
      p_slug: input.slug.trim(),
      p_title: input.title.trim(),
      p_excerpt: input.excerpt.trim() || null,
      p_content: input.content.trim(),
      p_author_id: input.authorId,
      p_status: input.status,
      p_published_at: input.publishedAt || null,
      p_category_id: input.categoryId,
      p_cover_media_id: input.coverMediaId,
      p_featured: input.featured,
    },
  );

  if (error) {
    console.error("Blog post update failed:", error);

    return {
      success: false,
      error: error.message || "Unable to update blog post.",
    };
  }

  const { error: relationshipError } = await supabase.rpc(
    "update_admin_blog_relationships",
    {
      p_post_id: postId,
      p_tag_ids: input.tagIds,
    },
  );

  if (relationshipError) {
    console.error(
      "Blog post relationships update failed:",
      relationshipError,
    );

    return {
      success: false,
      error:
        relationshipError.message ||
        "Blog post updated, but tags could not be saved.",
    };
  }

  return {
    success: true,
    error: null,
  };
}


export async function deleteBlogPost(postId: string) {
  if (!postId) {
    return {
      success: false,
      error: "Blog post ID is required.",
    };
  }

  const allowed = await hasPermission("blog.delete");

  if (!allowed) {
    return {
      success: false,
      error: "You do not have permission to delete blog posts.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.rpc(
    "delete_admin_blog_post",
    {
      p_post_id: postId,
    },
  );

  if (error) {
    console.error("Blog post deletion failed:", error);

    return {
      success: false,
      error: error.message || "Unable to delete blog post.",
    };
  }

  return {
    success: true,
    error: null,
  };
}