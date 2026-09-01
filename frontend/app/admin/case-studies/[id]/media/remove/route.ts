import { NextResponse } from "next/server";

import { createClient } from "../../../../../../lib/supabase/server";
import { requirePermission } from "../../../../../../lib/auth/require-permission";
type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: RouteContext,
) {
  await requirePermission("media.update");

  const { id } = await params;

  const body = await request.json();

  const mediaId = body?.mediaId;

  if (!mediaId) {
    return NextResponse.json(
      { error: "Media ID is required." },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.rpc(
    "remove_admin_case_study_media",
    {
      p_case_study_id: id,
      p_media_id: mediaId,
    },
  );

  if (error) {
    console.error(
      "Failed to remove Case Study media:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Failed to remove media.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
  });
}