import { createClient } from "../supabase/server";

export type AdminSystemHealth = {
  system_name: string;
  system_status: string;
  status_message: string;
};

type AdminSystemHealthRow = {
  system_name: string;
  system_status: string;
  status_message: string;
};

export async function getAdminSystemHealth(): Promise<
  AdminSystemHealth[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_admin_system_health",
  );

  if (error) {
    console.error(
      "Failed to load system health:",
      error,
    );

    throw new Error(
      "Failed to load system health",
    );
  }

  const rows =
    (data ?? []) as AdminSystemHealthRow[];

  return rows.map((item) => ({
    system_name: String(item.system_name),
    system_status: String(item.system_status),
    status_message: String(item.status_message),
  }));
}