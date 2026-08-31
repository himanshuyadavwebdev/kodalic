import { createClient } from "./supabase/server";

export interface PublicCaseStudyDetail {
  id: string;
  title: string;
  slug: string;
  domain: string;
  description: string;
  story: string;
  website_url: string | null;
  client_name: string | null;
  completed_at: string | null;
  published: boolean;
  featured: boolean;
  order: number;
  seo_title: string | null;
  seo_description: string | null;

  hero_media_id: string | null;
  hero_storage_key: string | null;
  hero_filename: string | null;
  hero_alt_text: string | null;
  hero_caption: string | null;

  services: string[];
  tags: string[];

  gallery: {
    id: string;
    storage_key: string;
    filename: string;
    mime: string;
    size: number;
    dimensions: unknown;
    alt_text: string | null;
    caption: string | null;
    order: number;
  }[];
}

export async function getPublicCaseStudy(
  slug: string,
): Promise<PublicCaseStudyDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_public_case_study",
    {
      p_slug: slug,
    },
  );

  if (error) {
    console.error(
      "Failed to load public Case Study:",
      error,
    );

    return null;
  }

  const item = data?.[0];

  if (!item) {
    return null;
  }

  return {
    ...item,
    services: Array.isArray(item.services)
      ? item.services
      : [],
    tags: Array.isArray(item.tags)
      ? item.tags
      : [],
    gallery: Array.isArray(item.gallery)
      ? item.gallery
      : [],
  };
}