"use client";

import React, { useEffect, useState, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { DEMO_CASE_STUDIES } from "../data/demoData";

interface CaseStudyItem {
  slug: string;
  heading: string;
  description: string;
  image: string;
  href: string;
  tags: string[];
  delivered: string[];
  verified: boolean;
  category: string;
}

interface CaseStudyListingProps {
  isDark: boolean;
}

const DEMO_CASE_STUDY_ITEMS: CaseStudyItem[] =
  DEMO_CASE_STUDIES.map((d) => ({
    slug: d.slug,
    heading: d.name,
    description: d.description,
    image: d.image,
    href: d.href,
    tags: d.tags,
    delivered: d.delivered,
    verified: d.verified,
    category: d.category,
  }));

const CaseStudyListing = ({ isDark }: CaseStudyListingProps) => {
  const [caseStudies, setCaseStudies] = useState<CaseStudyItem[]>(
    DEMO_CASE_STUDY_ITEMS,
  );

  const [order, setOrder] = useState<number[]>(
    DEMO_CASE_STUDY_ITEMS.map((_, i) => i),
  );
  useEffect(() => {
  let cancelled = false;

  async function loadCaseStudies() {
    try {
      const response = await fetch(
        "/api/case-studies",
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load Case Studies.",
        );
      }

      const data = await response.json();

      if (cancelled) {
        return;
      }

      const realCaseStudies: CaseStudyItem[] =
        Array.isArray(data)
          ? data.map((item) => ({
              slug: item.slug,
              heading: item.title,
              description: item.description,
              image: item.hero_storage_key
                ? `/api/case-studies/${item.slug}/image`
                : "/case-studies/placeholder.webp",
              href:
                item.website_url ||
                `/case-studies/${item.slug}`,
              tags: item.tags ?? [],
              delivered: item.services ?? [],
              verified: true,
              category: item.domain,
            }))
          : [];

      const combined = [
        ...realCaseStudies,
        ...DEMO_CASE_STUDY_ITEMS,
      ].slice(0, 5);

      setCaseStudies(combined);
      setOrder(combined.map((_, i) => i));
    } catch (error) {
      console.error(
        "Failed to load public Case Studies:",
        error,
      );
    }
  }

  loadCaseStudies();

  return () => {
    cancelled = true;
  };
}, []);
  const featuredCardRef = useRef<HTMLDivElement | null>(null);

  const textPrimary = isDark ? "#f5f3ff" : "#161221";
  const textMuted = isDark ? "rgba(245,243,255,0.55)" : "rgba(22,18,33,0.55)";
  const accent = isDark ? "#a78bfa" : "#6d28d9";
  const cardBg = isDark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";
const bigIndex = order[0];
const smallIndices = order.slice(1);
const big = caseStudies[bigIndex];
  const promote = (index: number) => {
    setOrder((previous) => [index, ...previous.filter((itemIndex) => itemIndex !== index)]);

    // Wait for React to promote the selected project, then return the visitor to
    // the main case-study presentation. This keeps the mobile interaction clear.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        featuredCardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  };

  return (
    <div className="relative w-full overflow-x-hidden overflow-y-visible">
      <div className="flex flex-col items-center justify-center px-6 pt-24 pb-8 text-center">
        <h2
          className="font-bold tracking-tight text-[clamp(1.75rem,4vw,3rem)] max-w-2xl"
          style={{ color: textPrimary }}
        >
          Real results, real businesses.
        </h2>
        <p className="mt-3 text-xs font-medium uppercase tracking-widest" style={{ color: textMuted }}>
          Selected work — real websites built for real businesses
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div
          ref={featuredCardRef}
          key={big.slug}
          className="relative w-full scroll-mt-24 rounded-[20px] sm:rounded-[28px] overflow-hidden mb-5 animate-[fadeIn_0.4s_ease]"
          style={{
            backgroundColor: cardBg,
            border: `1px solid ${cardBorder}`,
            boxShadow: isDark
              ? "0 24px 60px rgba(0,0,0,0.4)"
              : "0 24px 60px rgba(109,40,217,0.08)",
          }}
        >
          <div className="flex flex-col lg:flex-row items-stretch">
            <div className="w-full lg:w-[54%] p-4 sm:p-6">
              <div
                className="relative overflow-hidden rounded-[14px] border"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <div className="relative aspect-[16/10] bg-[#0a0a0a] overflow-hidden">
                  <img
                    src={big.image}
                    alt={`${big.heading} homepage screenshot`}
                    className="h-full w-full object-cover object-top"
                    loading="eager"
                  />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[46%] flex flex-col justify-center p-5 sm:p-7 md:p-9">
              <span className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: accent }}>
                {big.category}
              </span>
              <h3
                className="font-extrabold text-xl sm:text-2xl md:text-3xl leading-tight mb-3"
                style={{ color: textPrimary }}
              >
                {big.heading}
              </h3>
              <p className="text-sm sm:text-[15px] leading-relaxed mb-4 max-w-md" style={{ color: textMuted }}>
                {big.description}
              </p>
              <ul className="mb-4 flex flex-col gap-1.5">
                {big.delivered.map((item) => (
                  <li key={item} className="flex gap-2 text-xs sm:text-sm" style={{ color: textMuted }}>
                    <span style={{ color: accent }}>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mb-6 flex flex-wrap gap-2">
                {big.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide"
                    style={{ borderColor: cardBorder, color: textMuted }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={big.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 w-fit px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm transition-colors duration-200 active:scale-95 ${
                  isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/85"
                }`}
              >
                View Website <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {smallIndices.map((index) => {
            const item = caseStudies[index];
            return (
              <button
                key={item.slug}
                type="button"
                onClick={() => promote(index)}
                className="group relative flex w-full min-w-0 flex-col overflow-hidden rounded-[14px] text-left transition-transform duration-200 hover:-translate-y-1 active:scale-[0.98]"
                style={{
                  backgroundColor: cardBg,
                  border: `1px solid ${cardBorder}`,
                  boxShadow: isDark
                    ? "0 14px 36px rgba(0,0,0,0.35)"
                    : "0 14px 36px rgba(109,40,217,0.06)",
                }}
              >
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#0a0a0a]">
                  <img
                    src={item.image}
                    alt={`${item.heading} homepage screenshot`}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/20"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute inset-0 flex items-end p-3 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2"
                  >
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-black">
                      View <ArrowUpRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
                <div className="p-3 sm:p-3 flex flex-col gap-2 flex-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: accent }}>
                    {item.category}
                  </span>
                  <h3 className="font-semibold text-xs sm:text-sm leading-snug line-clamp-2" style={{ color: textPrimary }}>
                    {item.heading}
                  </h3>
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: textMuted }}>
                    {item.description}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide"
                        style={{ borderColor: cardBorder, color: textMuted }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-mt-24 {
            scroll-behavior: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default CaseStudyListing;
