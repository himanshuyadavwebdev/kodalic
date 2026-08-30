import { createClient } from "../supabase/server";

export type AdminProjectStatus = {
  status: string;
  project_count: number;
};

type AdminProjectStatusRow = {
  status: string;
  project_count: number | string;
};

export async function getAdminProjectStatus(): Promise<
  AdminProjectStatus[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_admin_project_status",
  );

  if (error) {
    console.error(
      "Failed to load project status:",
      error,
    );

    throw new Error(
      "Failed to load project status",
    );
  }

  const rows =
    (data ?? []) as AdminProjectStatusRow[];

  return rows.map((item) => ({
    status: String(item.status),
    project_count: Number(item.project_count),
  }));
}