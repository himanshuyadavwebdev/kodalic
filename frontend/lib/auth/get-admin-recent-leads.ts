import { createClient } from "../supabase/server";

export type AdminRecentLead = {
  id: string;
  contact_fields: Record<string, unknown>;
  service: string | null;
  budget: string | null;
  status: string;
  source: string | null;
  created_at: string;
};

export async function getAdminRecentLeads(
  limit = 5
): Promise<AdminRecentLead[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_admin_recent_leads",
    {
      p_limit: limit,
    }
  );

  if (error) {
    console.error("Failed to load recent leads:", error);
    throw new Error("Failed to load recent leads");
  }

  return (data ?? []) as AdminRecentLead[];
}