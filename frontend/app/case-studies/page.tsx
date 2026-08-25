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
    <main className="min-h-screen w-full bg-white font-[Inter]">
      <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-20 pt-10 pb-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-black/60 hover:text-black">
          ← Back to homepage
        </Link>

        <div className="mt-8 text-center">
          <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
            DEMO PROJECTS — Replace with verified projects
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-[#161221]">Case Studies</h1>
          <p className="mt-3 mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-black/60">
            Five demonstration projects showing how Kodalic could present verified work. All content is DEMO and replaceable.
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
                active === cat ? "bg-black text-white" : "bg-black/5 text-black/60 hover:bg-black/10 hover:text-black"
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
              className="group relative flex flex-col overflow-hidden rounded-[20px] border bg-white p-4 sm:p-6 transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-offset-2"
              style={{ borderColor: "rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">DEMO PROJECT</span>
                <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs text-black/60">{project.category}</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[#161221]">{project.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-black/60">{project.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span key={t} className="rounded-full border border-black/10 bg-black/5 px-2 py-1 text-xs text-black/60">
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs font-medium text-amber-700">{project.outcome}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-black/60 group-hover:text-black">
                View Case Study <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
              <span className="absolute right-4 top-4 rounded-full bg-black/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">DEMO UI</span>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-10 text-center text-sm text-black/60">No demo projects for this category.</p>
        )}
      </div>
    </main>
  );
}
