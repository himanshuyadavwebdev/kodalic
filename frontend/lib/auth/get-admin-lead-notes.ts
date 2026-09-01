import { createClient } from "../supabase/server";

export type AdminLeadNote = {
  id: string;
  lead_id: string;
  author_id: string | null;
  author_name: string;
  note: string;
  created_at: string;
};

type AdminLeadNoteRow = AdminLeadNote;

export async function getAdminLeadNotes(
  leadId: string,
): Promise<AdminLeadNote[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_admin_lead_notes",
    {
      p_lead_id: leadId,
    },
  );

  if (error) {
    console.error(
      "Failed to load lead notes:",
      error,
    );

    throw new Error(
      "Failed to load lead notes",
    );
  }

  return (data ?? []) as AdminLeadNoteRow[];
}