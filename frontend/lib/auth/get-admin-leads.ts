import { createClient } from "../supabase/server";

export type AdminLead = {
  id: string;
  contact_fields: Record<string, unknown>;
  service: string | null;
  budget: string | null;
  message: string;
  source: string | null;
  landing_page: string | null;
  utm: Record<string, unknown>;
  status: string;
  assigned_user_id: string | null;
  crm_external_id: string | null;
  created_at: string;
  updated_at: string;
};

export async function getAdminLeads(): Promise<AdminLead[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
  "get_admin_leads",
);

  if (error) {
    console.error(
      "Failed to load leads:",
      error,
    );

    throw new Error(
      "Failed to load leads",
    );
  }

  return (data ?? []) as AdminLead[];
}