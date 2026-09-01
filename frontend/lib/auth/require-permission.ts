import { redirect } from "next/navigation";
import { hasPermission } from "./permissions";

export async function requirePermission(
  permission: string
): Promise<void> {
  const allowed = await hasPermission(permission);

  if (!allowed) {
    redirect("/admin/unauthorized");
  }
}