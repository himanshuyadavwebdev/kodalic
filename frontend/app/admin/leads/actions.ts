"use server";

import { requirePermission } from "../../../lib/auth/require-permission";
import { createClient } from "../../../lib/supabase/server";

const VALID_STATUSES = [
  "new",
  "reviewed",
  "transferred_to_crm",
  "archived",
  "spam",
] as const;

export async function updateLead(
  leadId: string,
  status: string,
  assignedUserId: string | null,
) {
  await requirePermission("leads.update");

  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    throw new Error("Invalid lead status");
  }

  const supabase = await createClient();

  const { error } = await supabase.rpc("update_admin_lead", {
    p_lead_id: leadId,
    p_status: status,
    p_assigned_user_id: assignedUserId,
  });

  if (error) {
    console.error("Failed to update lead:", error);

    throw new Error(error.message || "Failed to update lead");
  }

  return {
    success: true,
  };
}

export async function addLeadNote(leadId: string, note: string) {
  await requirePermission("leads.update");

  const trimmedNote = note.trim();

  if (!trimmedNote) {
    throw new Error("Note cannot be empty");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("add_admin_lead_note", {
    p_lead_id: leadId,
    p_note: trimmedNote,
  });

  if (error) {
    console.error("Failed to add lead note:", error);

    throw new Error(error.message || "Failed to add lead note");
  }

  return {
    success: true,
    noteId: data,
  };
}
