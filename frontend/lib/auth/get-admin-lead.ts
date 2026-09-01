    import { createClient } from "../supabase/server";

    export type AdminLeadDetail = {
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

    export async function getAdminLead(
    leadId: string,
    ): Promise<AdminLeadDetail | null> {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc(
    "get_admin_lead",
    {
        p_lead_id: leadId,
    },
    );
    if (error) {
        console.error(
        "Failed to load lead:",
        error,
        );

        throw new Error(
        "Failed to load lead",
        );
    }

    const rows = (data ?? []) as AdminLeadDetail[];

  return rows[0] ?? null;
    }   