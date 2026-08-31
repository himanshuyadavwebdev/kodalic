import { NextResponse } from "next/server";

import { createClient } from "../../../../../lib/supabase/server";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
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

  const { data: signedUrl, error: signedUrlError } =
    await supabase.storage
      .from("case-study-media")
      .createSignedUrl(
        caseStudy.hero_storage_key,
        60 * 10,
      );

  if (
    signedUrlError ||
    !signedUrl?.signedUrl
  ) {
    console.error(
      "Failed to create signed Case Study image URL:",
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