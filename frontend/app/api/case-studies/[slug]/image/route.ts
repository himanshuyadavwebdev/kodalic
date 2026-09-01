import { NextResponse } from "next/server";

import { createClient } from "../../../../../lib/supabase/server";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

const MIME_EXTENSIONS: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  svg: "image/svg+xml",
};

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_public_case_study",
    {
      p_slug: slug,
    },
  );

  if (error) {
    console.error(
      "Failed to load Case Study image:",
      error,
    );

    return new NextResponse("Not Found", {
      status: 404,
    });
  }

  const caseStudy = data?.[0];

  if (
    !caseStudy ||
    !caseStudy.published ||
    !caseStudy.hero_storage_key
  ) {
    return new NextResponse("Not Found", {
      status: 404,
    });
  }

  const { data: fileData, error: downloadError } =
    await supabase.storage
      .from("case-study-media")
      .download(caseStudy.hero_storage_key);

  if (downloadError || !fileData) {
    console.error(
      "Failed to download Case Study image:",
      downloadError,
    );

    return new NextResponse("Not Found", {
      status: 404,
    });
  }

  const extension = caseStudy.hero_storage_key
    .split(".")
    .pop()
    ?.toLowerCase() ?? "";
  const contentType =
    MIME_EXTENSIONS[extension] || "application/octet-stream";

  const bytes = new Uint8Array(await fileData.arrayBuffer());

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(bytes.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}