import { createClient } from "../supabase/server";

export type AdminCaseStudy = {
  id: string;
  title: string;
  slug: string;
  domain: string;
  description: string;
  story: string;
  website_url: string | null;
  hero_media_id: string | null;
  client_name: string | null;
  completed_at: string | null;
  published: boolean;
  featured: boolean;
  order: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
};

export async function getAdminCaseStudies(): Promise<
  AdminCaseStudy[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_admin_case_studies",
  );

  if (error) {
    console.error(
      "Failed to load case studies:",
      error,
    );

    throw new Error(
      "Failed to load case studies",
    );
  }

  return (data ?? []) as AdminCaseStudy[];
}