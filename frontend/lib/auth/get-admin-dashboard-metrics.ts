import { createClient } from "../supabase/server";

export type AdminDashboardMetrics = {
  leads_total: number;
  leads_new: number;
  projects_total: number;
  projects_published: number;
};

export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_admin_dashboard_metrics"
  );

  if (error) {
    console.error("Failed to load dashboard metrics:", error);
    throw new Error("Failed to load dashboard metrics");
  }

  return {
    leads_total: Number(data?.leads_total ?? 0),
    leads_new: Number(data?.leads_new ?? 0),
    projects_total: Number(data?.projects_total ?? 0),
    projects_published: Number(data?.projects_published ?? 0),
  };
}