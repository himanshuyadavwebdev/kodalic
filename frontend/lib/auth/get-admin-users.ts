import { createClient } from "../supabase/server";

export type AdminUserOption = {
  id: string;
  name: string;
  email: string;
};

export async function getAdminUsers(): Promise<
  AdminUserOption[]
> {
  const supabase = await createClient();

    const { data, error } = await supabase.rpc(
    "get_admin_users",
  );

  if (error) {
    console.error(
      "Failed to load admin users:",
      error,
    );

    throw new Error(
      "Failed to load admin users",
    );
  }

  return (data ?? []) as AdminUserOption[];
}