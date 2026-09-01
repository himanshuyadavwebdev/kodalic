import { NextResponse } from "next/server";

import { getPublicCaseStudy } from "../../../../lib/get-public-case-study";

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

  const caseStudy = await getPublicCaseStudy(slug);

  if (!caseStudy) {
    return NextResponse.json(
      {
        error: "Case Study not found.",
      },
      {
        status: 404,
      },
    );
  }

  return NextResponse.json(caseStudy, {
    headers: {
      "Cache-Control":
        "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}