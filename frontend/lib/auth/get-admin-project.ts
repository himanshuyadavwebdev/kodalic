import { createClient } from "../supabase/server";

export type AdminProjectDetail = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category_id: string | null;
  featured: boolean;
  status: string;
  live_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  solution_type: string | null;
  project_order: number;
};

export async function getAdminProject(
  projectId: string,
): Promise<AdminProjectDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_admin_project",
    {
      p_project_id: projectId,
    },
  );

  if (error) {
    console.error(
      "Failed to load project:",
      error,
    );

    throw new Error(
      "Failed to load project",
    );
  }

  const rows = (data ?? []) as AdminProjectDetail[];

  return rows[0] ?? null;
}