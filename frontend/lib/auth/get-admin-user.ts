import { createClient } from "../supabase/server";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

type AdminCurrentUserRow = {
  id: string;
  email: string;
  name: string;
  role: string | null;
};

export async function getAdminUser(): Promise<AdminUser> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase.rpc(
    "get_admin_current_user",
  );

  if (error) {
    console.error(
      "Failed to load admin user:",
      error,
    );

    throw new Error(
      "Failed to load admin user",
    );
  }

  const rows = (data ?? []) as AdminCurrentUserRow[];

  const currentUser = rows[0];

  if (!currentUser) {
    throw new Error(
      "Admin user profile not found",
    );
  }

  return {
    id: currentUser.id,
    email: currentUser.email,
    name: currentUser.name,
    role: currentUser.role ?? "unknown",
  };
}