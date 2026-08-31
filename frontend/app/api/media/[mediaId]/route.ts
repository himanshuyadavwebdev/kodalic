import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

type RouteContext = {
  params: Promise<{
    mediaId: string;
  }>;
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
    .select("storage_key")
    .eq("id", mediaId)
    .maybeSingle();

  if (error || !media?.storage_key) {
    console.error("Failed to load media database record:", error);
    return new NextResponse("Not Found", { status: 404 });
  }

  const { data: signedUrl, error: signedUrlError } =
    await supabase.storage
      .from("case-study-media")
      .createSignedUrl(media.storage_key, 60 * 60); // 1 hour expiration

  if (signedUrlError || !signedUrl?.signedUrl) {
    console.error("Failed to create signed URL:", signedUrlError);
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.redirect(signedUrl.signedUrl, 302);
}
