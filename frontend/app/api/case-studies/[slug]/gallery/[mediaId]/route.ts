import { NextResponse } from "next/server";

import { createClient } from "../../../../../../lib/supabase/server";

type RouteContext = {
  params: Promise<{
    slug: string;
    mediaId: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  const { slug, mediaId } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_public_case_study",
    {
      p_slug: slug,
    },
  );

  if (error) {
    console.error(
      "Failed to load Case Study gallery:",
      error,
    );

    return new NextResponse("Not Found", {
      status: 404,
    });
  }

  const caseStudy = data?.[0];

  if (!caseStudy || !caseStudy.published) {
    return new NextResponse("Not Found", {
      status: 404,
    });
  }

  const media = Array.isArray(caseStudy.gallery)
    ? caseStudy.gallery.find(
        (item: { id: string }) =>
          item.id === mediaId,
      )
    : null;

  if (!media?.storage_key) {
    return new NextResponse("Not Found", {
      status: 404,
    });
  }

  const { data: signedUrl, error: signedUrlError } =
    await supabase.storage
      .from("case-study-media")
      .createSignedUrl(
        media.storage_key,
        60 * 10,
      );

  if (
    signedUrlError ||
    !signedUrl?.signedUrl
  ) {
    console.error(
      "Failed to create gallery signed URL:",
      signedUrlError,
    );

    return new NextResponse("Not Found", {
      status: 404,
    });
  }

  return NextResponse.redirect(
    signedUrl.signedUrl,
    302,
  );
}