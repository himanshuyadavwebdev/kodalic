import { createClient } from "./supabase/server";

export interface PublicCaseStudy {
  id: string;
  title: string;
  slug: string;
  domain: string;
  description: string;
  client_name: string | null;
  completed_at: string | null;
  published: boolean;
  featured: boolean;
  order: number;
  hero_media_id: string | null;
  hero_storage_key: string | null;
  hero_filename: string | null;
  hero_alt_text: string | null;
  hero_caption: string | null;
  website_url: string | null;
  services: string[];
  tags: string[];
}

export async function getPublicCaseStudies(): Promise<
  PublicCaseStudy[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_public_case_studies",
  );

  if (error) {
    console.error(
      "Failed to load public Case Studies:",
      error,
    );

    return [];
  }

  return (data ?? []).map((item: PublicCaseStudy) => ({
    ...item,
    services: Array.isArray(item.services)
      ? item.services
      : [],
    tags: Array.isArray(item.tags)
      ? item.tags
      : [],
  }));
}