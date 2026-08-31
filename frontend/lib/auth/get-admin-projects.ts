import { createClient } from "../supabase/server";

export type AdminProject = {
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

export async function getAdminProjects(): Promise<
  AdminProject[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_admin_projects",
  );

  if (error) {
    console.error(
      "Failed to load projects:",
      error,
    );

    throw new Error(
      "Failed to load projects",
    );
  }

  return (data ?? []) as AdminProject[];
}