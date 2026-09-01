import { createClient } from "../supabase/server";

export type AdminLeadOverviewPoint = {
  day: string;
  lead_count: number;
};

type AdminLeadOverviewRow = {
  day: string;
  lead_count: number | string;
};

export async function getAdminLeadOverview(
  days = 7,
): Promise<AdminLeadOverviewPoint[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_admin_lead_overview",
    {
      p_days: days,
    },
  );

  if (error) {
    console.error(
      "Failed to load lead overview:",
      error,
    );

    throw new Error(
      "Failed to load lead overview",
    );
  }

  const rows = (data ?? []) as AdminLeadOverviewRow[];

  return rows.map((item) => ({
    day: String(item.day),
    lead_count: Number(item.lead_count),
  }));
}