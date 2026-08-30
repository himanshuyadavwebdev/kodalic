import { createClient } from "../supabase/server";

export type AdminTopPage = {
  path: string;
  view_count: number;
};

type AdminTopPageRow = {
  path: string;
  view_count: number | string;
};

export async function getAdminTopPages(
  days = 30,
  limit = 5,
): Promise<AdminTopPage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_admin_top_pages",
    {
      p_days: days,
      p_limit: limit,
    },
  );

  if (error) {
    console.error(
      "Failed to load top pages:",
      error,
    );

    throw new Error(
      "Failed to load top pages",
    );
  }

  const rows =
    (data ?? []) as AdminTopPageRow[];

  return rows.map((item) => ({
    path: String(item.path),
    view_count: Number(item.view_count),
  }));
}