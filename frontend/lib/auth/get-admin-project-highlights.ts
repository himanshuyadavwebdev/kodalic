import { createClient } from "../supabase/server";

export type AdminProjectHighlight = {
  id: string;
  project_id: string;
  text: string;
  highlight_order: number;
  created_at: string;
  updated_at: string;
};

export async function getAdminProjectHighlights(
  projectId: string,
): Promise<AdminProjectHighlight[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_admin_project_highlights",
    {
      p_project_id: projectId,
    },
  );

  if (error) {
    console.error(
      "Failed to load project highlights:",
      error,
    );

    throw new Error(
      "Failed to load project highlights",
    );
  }

  return (data ?? []) as AdminProjectHighlight[];
}