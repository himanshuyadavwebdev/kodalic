import { createClient } from "../supabase/server";

export async function hasPermission(
  permission: string
): Promise<boolean> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return false;
  }

  const { data, error } = await supabase.rpc(
    "has_permission",
    {
      p_permission_key: permission,
    }
  );

  if (error) {
    console.error("Permission check failed:", error);
    return false;
  }

  return data === true;
}