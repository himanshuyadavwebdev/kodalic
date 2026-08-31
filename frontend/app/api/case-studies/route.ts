import { NextResponse } from "next/server";

import { getPublicCaseStudies } from "../../../lib/get-public-case-studies";

export async function GET() {
  try {
    const caseStudies = await getPublicCaseStudies();

    return NextResponse.json(caseStudies, {
      headers: {
        "Cache-Control":
          "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error(
      "Failed to load public Case Studies:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to load Case Studies.",
      },
      {
        status: 500,
      },
    );
  }
}