import { createClient } from "../supabase/server";

export type AdminLeadActivity = {
  id: string;
  lead_id: string;
  actor_id: string | null;
  actor_name: string;
  action: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

type AdminLeadActivityRow = AdminLeadActivity;

export async function getAdminLeadActivity(
  leadId: string,
): Promise<AdminLeadActivity[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_admin_lead_activity",
    {
      p_lead_id: leadId,
    },
  );

  if (error) {
    console.error(
      "Failed to load lead activity:",
      error,
    );

    throw new Error(
      "Failed to load lead activity",
    );
  }

  return (data ?? []) as AdminLeadActivityRow[];
}