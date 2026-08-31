import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

type RouteContext = {
  params: Promise<{
    mediaId: string;
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
  const { mediaId } = await params;

  if (!mediaId) {
    return new NextResponse("Media ID is required", { status: 400 });
  }

  const supabase = await createClient();

  const { data: media, error } = await supabase
    .from("media")
    .select("storage_key, mime")
    .eq("id", mediaId)
    .maybeSingle();

  if (error || !media?.storage_key) {
    console.error("Failed to load media database record:", error);
    return new NextResponse("Not Found", { status: 404 });
  }

  // Download the file directly instead of redirecting to a signed URL.
  // Redirects to Supabase signed URLs break on many mobile browsers
  // because img tags don't reliably follow 302 redirects across origins.
  const { data: fileData, error: downloadError } = await supabase.storage
    .from("case-study-media")
    .download(media.storage_key);

  if (downloadError || !fileData) {
    console.error("Failed to download media file:", downloadError);
    return new NextResponse("Not Found", { status: 404 });
  }

  // Determine the content type from the stored mime, or fall back to the extension.
  const extension = media.storage_key.split(".").pop()?.toLowerCase() ?? "";
  const contentType =
    media.mime || MIME_EXTENSIONS[extension] || "application/octet-stream";

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
