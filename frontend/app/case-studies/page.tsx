"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DEMO_CASE_STUDIES } from "../data/demoData";

const CATEGORIES = ["All", "Websites", "Web Apps", "AI", "Automation"] as const;

function normalizeCategory(cat: string) {
  if (cat === "Web Application") return "Web Apps";
  return cat;
}

export default function CaseStudiesIndex() {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered =
    active === "All"
      ? DEMO_CASE_STUDIES
      : DEMO_CASE_STUDIES.filter((c) => normalizeCategory(c.category) === active);

  const categoriesToShow = CATEGORIES.filter(
    (cat) => cat === "All" || DEMO_CASE_STUDIES.some((c) => normalizeCategory(c.category) === cat)
  );

  return (
    <main className="min-h-screen w-full bg-background font-[Inter]">
      <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-20 pt-10 pb-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          ← Back to homepage
        </Link>

        <div className="mt-8 text-center">
          <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-foreground">Case Studies</h1>
          <p className="mt-3 mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground">
            Selected work from Kodalic.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter case studies">
          {categoriesToShow.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={active === cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-offset-2 ${
                active === cat ? "bg-black text-white" : "bg-black/5 dark:bg-white/10 dark:bg-white/10 text-muted-foreground hover:bg-black/10 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6">
          {filtered.map((project) => (
            <Link
              key={project.slug}
              href={`/case-studies/${project.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-[20px] border border-black/[0.06] dark:border-white/10 bg-background p-4 sm:p-6 transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-offset-2"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="rounded-full bg-black/5 dark:bg-white/10 dark:bg-white/10 px-2.5 py-1 text-xs text-muted-foreground">{project.category}</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">{project.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span key={t} className="rounded-full border border-black/10 bg-black/5 dark:bg-white/10 dark:bg-white/10 px-2 py-1 text-xs text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs font-medium text-amber-700">{project.outcome}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground group-hover:text-foreground">
                View Case Study <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-10 text-center text-sm text-muted-foreground">No projects for this category.</p>
        )}
      </div>
    </main>
  );
}
