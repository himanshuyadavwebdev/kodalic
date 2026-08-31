import Link from "next/link";

import { requirePermission } from "../../../../lib/auth/require-permission";
import { createClient } from "../../../../lib/supabase/server";
import CaseStudyEditForm from "../../../../components/admin/case-study-edit-form";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CaseStudyEditPage({ params }: PageProps) {
  await requirePermission("case_studies.view");

  const { id } = await params;

  const supabase = await createClient();

  const { data: caseStudy, error } = await supabase
    .from("case_studies")
    .select(
      "id, title, slug, domain, description, story, website_url, hero_media_id, client_name, completed_at, published, featured, order, seo_title, seo_description",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load case study:", error);

    throw new Error("Failed to load case study.");
  }

  if (!caseStudy) {
    return (
      <main className="min-h-screen bg-[#080c1e] px-6 py-16 text-white">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/admin/case-studies"
            className="text-sm text-white/50 hover:text-white"
          >
            ← Back to Case Studies
          </Link>

          <div className="mt-12 rounded-2xl border border-white/10 bg-[#111528] p-8 text-center">
            <h1 className="text-xl font-semibold">Case Study not found</h1>

            <p className="mt-2 text-sm text-white/40">
              The requested Case Study does not exist.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const { data: caseStudyServices, error: servicesError } = await supabase
    .from("case_study_services")
    .select("service")
    .eq("case_study_id", id)
    .order("created_at", {
      ascending: true,
    });

  if (servicesError) {
    console.error("Failed to load case study services:", servicesError);

    throw new Error("Failed to load case study services.");
  }

  const { data: caseStudyTags, error: tagsError } = await supabase
    .from("case_study_tags")
    .select("tag")
    .eq("case_study_id", id)
    .order("created_at", {
      ascending: true,
    });

  if (tagsError) {
    console.error("Failed to load case study tags:", tagsError);

    throw new Error("Failed to load case study tags.");
  }

  const services = caseStudyServices?.map((item) => item.service) ?? [];

  const tags = caseStudyTags?.map((item) => item.tag) ?? [];
  const { data: caseStudyMedia, error: mediaError } = await supabase
    .from("case_study_media")
    .select(
      `
          media_id,
          "order",
          media (
            id,
            storage_key,
            filename,
            mime,
            size,
            dimensions,
            alt_text,
            caption
          )
        `,
    )
    .eq("case_study_id", id)
    .order("order", {
      ascending: true,
    });

  if (mediaError) {
    console.error("Failed to load case study media:", mediaError);

    throw new Error("Failed to load case study media.");
  }
  return (
    <main className="min-h-screen bg-[#080c1e] px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/case-studies"
          className="text-sm text-white/50 transition hover:text-white"
        >
          ← Back to Case Studies
        </Link>

        <div className="mt-8">
          <p className="text-sm text-white/50">Case Studies</p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-semibold">Edit Case Study</h1>

            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${
                caseStudy.published
                  ? "bg-emerald-400/10 text-emerald-300"
                  : "bg-white/[0.06] text-white/40"
              }`}
            >
              {caseStudy.published ? "Published" : "Draft"}
            </span>
          </div>

          <p className="mt-4 text-white/60">
            Update the content and publishing settings for{" "}
            <span className="text-white/80">{caseStudy.title}</span>.
          </p>
        </div>

        <div className="mt-10">
          <CaseStudyEditForm
            caseStudy={{
              ...caseStudy,
              services,
              tags,
            }}
            media={caseStudyMedia ?? []}
          />
        </div>
      </div>
    </main>
  );
}
