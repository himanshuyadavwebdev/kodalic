import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";

export async function requireAAL2(): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data, error } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (error) {
    redirect("/admin/login");
  }

  if (data.currentLevel !== "aal2") {
    redirect("/admin/security/mfa/challenge");
  }
}