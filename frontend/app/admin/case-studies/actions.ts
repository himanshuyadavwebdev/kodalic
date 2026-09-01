"use server";

import { createClient } from "../../../lib/supabase/server";
import { hasPermission } from "../../../lib/auth/permissions";

type CaseStudyInput = {
  title: string;
  slug: string;
  domain: string;
  description: string;
  story: string;
  websiteUrl: string;
  heroMediaId: string | null;
  clientName: string;
  completedAt: string | null;
  published: boolean;
  featured: boolean;
  order: number;
  seoTitle: string;
  seoDescription: string;
    services: string[];
  tags: string[];
};

export async function createCaseStudy(input: CaseStudyInput) {
  const allowed = await hasPermission("case_studies.create");

  if (!allowed) {
    return {
      success: false,
      caseStudyId: null,
      error: "You do not have permission to create case studies.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "create_admin_case_study",
    {
      p_title: input.title.trim(),
      p_slug: input.slug.trim(),
      p_domain: input.domain.trim(),
      p_description: input.description.trim(),
      p_story: input.story.trim(),
      p_website_url: input.websiteUrl.trim() || null,
      p_hero_media_id: input.heroMediaId,
      p_client_name: input.clientName.trim() || null,
      p_completed_at: input.completedAt || null,
      p_published: input.published,
      p_featured: input.featured,
      p_order: Number.isFinite(input.order)
        ? input.order
        : 999,
      p_seo_title: input.seoTitle.trim() || null,
      p_seo_description:
        input.seoDescription.trim() || null,
    },
  );

  if (error) {
    console.error("Case study creation failed:", error);

    return {
      success: false,
      caseStudyId: null,
      error: error.message || "Unable to create case study.",
    };
  }

  return {
    success: true,
    caseStudyId: data as string,
    error: null,
  };
}

export async function updateCaseStudy(
  caseStudyId: string,
  input: CaseStudyInput,
) {
  if (!caseStudyId) {
    return {
      success: false,
      error: "Case study ID is required.",
    };
  }

  const allowed = await hasPermission("case_studies.update");

  if (!allowed) {
    return {
      success: false,
      error: "You do not have permission to update case studies.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.rpc(
    "update_admin_case_study",
    {
      p_case_study_id: caseStudyId,
      p_title: input.title.trim(),
      p_slug: input.slug.trim(),
      p_domain: input.domain.trim(),
      p_description: input.description.trim(),
      p_story: input.story.trim(),
      p_website_url: input.websiteUrl.trim() || null,
      p_hero_media_id: input.heroMediaId,
      p_client_name: input.clientName.trim() || null,
      p_completed_at: input.completedAt || null,
      p_published: input.published,
      p_featured: input.featured,
      p_order: Number.isFinite(input.order)
        ? input.order
        : 999,
      p_seo_title: input.seoTitle.trim() || null,
      p_seo_description:
        input.seoDescription.trim() || null,
    },
  );

   if (error) {
    console.error("Case study update failed:", error);

    return {
      success: false,
      error: error.message || "Unable to update case study.",
    };
  }

  const { error: relationshipError } = await supabase.rpc(
    "update_admin_case_study_relationships",
    {
      p_case_study_id: caseStudyId,
      p_services: input.services,
      p_tags: input.tags,
    },
  );

  if (relationshipError) {
    console.error(
      "Case study relationships update failed:",
      relationshipError,
    );

    return {
      success: false,
      error:
        relationshipError.message ||
        "Unable to update case study services and tags.",
    };
  }

  return {
    success: true,
    error: null,
  };
}