import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getPublicCaseStudies } from "../../lib/get-public-case-studies";

const CATEGORIES = [
  "All",
  "Websites",
  "Web Apps",
  "AI",
  "Automation",
] as const;

function normalizeCategory(category: string) {
  if (category === "Web Application") {
    return "Web Apps";
  }

  return category;
}

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Explore Kodalic projects and the stories behind their design, development, and delivery.",
  alternates: { canonical: "/case-studies" },
  openGraph: { title: "Case Studies | Kodalic", description: "Explore Kodalic projects and the stories behind their design, development, and delivery.", url: "/case-studies", type: "website" },
  twitter: { card: "summary_large_image", title: "Case Studies | Kodalic", description: "Explore Kodalic projects and the stories behind their design, development, and delivery." },
};

export default async function CaseStudiesIndex() {
  const caseStudies = await getPublicCaseStudies();

  const categoriesToShow = CATEGORIES.filter(
    (category) =>
      category === "All" ||
      caseStudies.some(
        (caseStudy) =>
          normalizeCategory(caseStudy.domain) === category,
      ),
  );

  return (
    <main className="min-h-screen w-full bg-background font-[Inter]">
      <div className="mx-auto max-w-5xl px-6 pt-10 pb-16 sm:px-10 lg:px-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          ← Back to homepage
        </Link>

        <div className="mt-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Case Studies
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Explore selected projects and the stories behind how
            they were designed, developed, and delivered.
          </p>
        </div>

        {caseStudies.length > 0 ? (
          <>
            <div
              className="mt-8 flex flex-wrap justify-center gap-2"
              role="tablist"
              aria-label="Filter case studies"
            >
              {categoriesToShow.map((category) => (
                <Link
                  key={category}
                  href={
                    category === "All"
                      ? "/case-studies"
                      : `/case-studies?category=${encodeURIComponent(
                          category,
                        )}`
                  }
                  className="rounded-full bg-black/5 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-black/10 hover:text-foreground dark:bg-white/10 dark:hover:bg-white/15"
                >
                  {category}
                </Link>
              ))}
            </div>

            <div className="mt-10 grid gap-6">
              {caseStudies.map((caseStudy) => (
                <Link
                  key={caseStudy.id}
                  href={`/case-studies/${caseStudy.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-[20px] border border-black/[0.06] bg-background p-4 transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-offset-2 dark:border-white/10 sm:p-6"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-300">
                      Case Study
                    </span>

                    <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs text-muted-foreground dark:bg-white/10">
                      {caseStudy.domain}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold tracking-tight text-foreground">
                    {caseStudy.title}
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {caseStudy.description}
                  </p>

                  {caseStudy.services.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {caseStudy.services.map((service) => (
                        <span
                          key={service}
                          className="rounded-full border border-black/10 bg-black/5 px-2 py-1 text-xs text-muted-foreground dark:border-white/10 dark:bg-white/10"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  )}

                  {caseStudy.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {caseStudy.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-muted-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground group-hover:text-foreground">
                    View Case Study
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">
              No published case studies yet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}