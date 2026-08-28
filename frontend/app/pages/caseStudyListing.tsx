"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Globe, Cog, Sparkles, LayoutGrid, BarChart3 } from "lucide-react";
import { DEMO_MODE, DEMO_CASE_STUDIES } from "../data/demoData";

interface CaseStudyItem {
  slug: string;
  heading: string;
  description: string;
  image: string;
  verified: boolean;
  category?: string;
  technologies?: string[];
  tech?: string[];
  outcome?: string;
  demo?: boolean;
  label?: string;
}

interface CaseStudyListingProps {
  isDark: boolean;
}

const VERIFIED_CASE_STUDIES: CaseStudyItem[] = [];

const DemoVisual: React.FC<{ category?: string }> = ({ category }) => {
  const Icon = category === "AI" ? Sparkles : category === "Automation" ? Cog : category === "Websites" ? Globe : category === "Web Applications" || category === "Web Application" ? LayoutGrid : BarChart3;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#080c1e] p-4 text-white">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/10">
        <Icon size={18} color="white" />
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-wide text-white/50">{category || "Demo"}</span>
      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">DEMO UI</span>
    </div>
  );
};

const CASE_STUDIES: CaseStudyItem[] = DEMO_MODE
  ? DEMO_CASE_STUDIES.map((d) => ({
      slug: d.slug,
      heading: d.name,
      description: d.description,
      image: "",
      verified: d.verified,
      category: d.category,
      technologies: d.technologies,
      tech: d.technologies,
      outcome: d.outcome,
      demo: d.demo,
      label: d.label,
    }))
  : VERIFIED_CASE_STUDIES.length > 0
  ? VERIFIED_CASE_STUDIES
  : [];

const CaseStudyListing = ({ isDark }: CaseStudyListingProps) => {
  const [order, setOrder] = useState<number[]>(
    CASE_STUDIES.map((_, i) => i)
  );

  // Cursor-follow "Open Work" circle state
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  const textPrimary = isDark ? "#f5f3ff" : "#161221";
  const textMuted = isDark ? "rgba(245,243,255,0.55)" : "rgba(22,18,33,0.55)";
  const accent = isDark ? "#a78bfa" : "#6d28d9";
  const badgeBg = isDark ? "rgba(167,139,250,0.14)" : "rgba(109,40,217,0.08)";
  const cardBg = isDark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";

  const bigIndex = order[0];
  const smallIndices = order.slice(1);
  const big = CASE_STUDIES[bigIndex];

  const promote = (index: number) => {
    setOrder((prev) => [index, ...prev.filter((i) => i !== index)]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = gridRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
        <div className="relative w-full overflow-x-hidden overflow-y-visible">
      {/* Heading */}
      <div className="flex flex-col items-center justify-center px-6 pt-24 pb-8 text-center">
        <h2
          className="font-bold tracking-tight text-[clamp(1.75rem,4vw,3rem)] max-w-2xl"
          style={{ color: textPrimary }}
        >
          Real results, real businesses.
        </h2>
        <p className="mt-3 text-xs font-medium uppercase tracking-widest" style={{ color: textMuted }}>
          Illustrative examples — replace images and copy with verified projects
        </p>
      </div>

      {/* Showcase */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        {/* Featured case study — browser mockup placeholder */}
        <div
          key={big.slug}
          className="relative w-full rounded-[20px] sm:rounded-[28px] overflow-hidden mb-5 animate-[fadeIn_0.4s_ease]"
          style={{
            backgroundColor: cardBg,
            border: `1px solid ${cardBorder}`,
            boxShadow: isDark ? "0 24px 60px rgba(0,0,0,0.4)" : "0 24px 60px rgba(109,40,217,0.08)",
          }}
        >
          <div className="flex flex-col lg:flex-row items-stretch">
            <div className="w-full lg:w-[54%] p-4 sm:p-6">
              <div className="relative overflow-hidden rounded-[14px] border bg-[#0a0a0a] shadow-[0_20px_50px_rgba(0,0,0,0.18)]" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-1.5 px-4 py-3 bg-[#1a1a1a] border-b border-white/10">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f56]" aria-hidden />
                  <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" aria-hidden />
                  <span className="h-3 w-3 rounded-full bg-[#27c93f]" aria-hidden />
                  <span className="ml-3 hidden sm:block flex-1 rounded-full bg-white/10 px-3 py-1 text-xs text-white/40 truncate">
                    {big.verified ? `${big.slug}.kodalic.com` : "placeholder — replace with verified project UI"}
                  </span>
                </div>
                <div className="relative aspect-[16/10] bg-[#0a0a0a]">
                  {big.demo ? (
                    <DemoVisual category={big.category} />
                  ) : (
                    <img src={big.image} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-60" />
                  )}
                  {big.demo ? (
                    <span className="absolute left-3 top-3 rounded-full bg-amber-500/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-black">
                      DEMO PROJECT
                    </span>
                  ) : (
                    !big.verified && (
                      <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
                        Placeholder — replace with verified UI
                      </span>
                    )
                  )}
                  {big.demo ? null : (
                    !big.verified && (
                      <div className="absolute inset-0 flex items-center justify-center p-6">
                        <div className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-center backdrop-blur">
                          <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Illustrative placeholder</p>
                          <p className="mt-1 text-xs text-white/50">Replace with actual project screenshot when verified</p>
                        </div>
                      </div>
                    )
                  )}
                  {big.demo && (
                    <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-black">DEMO UI</span>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[46%] flex flex-col justify-center p-5 sm:p-7 md:p-9">
              {!big.verified && (
                <span className="mb-3 inline-flex w-fit rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">Illustrative — unverified</span>
              )}
              {big.verified && big.category && (
                <span className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: accent }}>
                  {big.category}
                </span>
              )}
              <h3 className="font-extrabold text-xl sm:text-2xl md:text-3xl leading-tight mb-3" style={{ color: textPrimary }}>
                {big.heading}
              </h3>
              <p className="text-sm sm:text-[15px] leading-relaxed mb-6 max-w-md" style={{ color: textMuted }}>
                {big.description}
              </p>
              {big.verified && big.tech && big.tech.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {big.tech.map((t) => (
                    <span key={t} className="rounded-full border px-2.5 py-1 text-xs" style={{ borderColor: cardBorder, color: textMuted }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {big.verified && big.outcome && <p className="mb-4 text-sm font-medium" style={{ color: accent }}>{big.outcome}</p>}
              <Link
                href={`/case-studies/${big.slug}`}
                className={`inline-flex items-center gap-2 w-fit px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm transition-colors duration-200 active:scale-95 ${isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/85"}`}
              >
                View Case Study
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Small cards row — with cursor-follow "Open Work" circle */}
        <div
          ref={gridRef}
          onMouseMove={handleMouseMove}
          className="relative grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3"
        >
          {smallIndices.map((index) => {
            const item = CASE_STUDIES[index];
            return (
              <button
                key={item.slug}
                onClick={() => promote(index)}
                onMouseEnter={() => setCursorVisible(true)}
                onMouseLeave={() => setCursorVisible(false)}
                className="group relative flex flex-col w-full min-w-0 text-left rounded-[14px] overflow-hidden transition-transform duration-200 hover:-translate-y-1 active:scale-[0.98] cursor-none"
                style={{
                  backgroundColor: cardBg,
                  border: `1px solid ${cardBorder}`,
                  boxShadow: isDark ? "0 14px 36px rgba(0,0,0,0.35)" : "0 14px 36px rgba(109,40,217,0.06)",
                }}
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#080c1e]">
                  {item.demo ? (
                    <div className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]">
                      <DemoVisual category={item.category} />
                    </div>
                  ) : (
                    <img src={item.image} alt="" aria-hidden="true" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                    {item.demo ? "DEMO PROJECT" : "Placeholder"}
                  </span>
                  <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/20" aria-hidden />
                  <div className="pointer-events-none absolute inset-0 flex items-end p-3 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-black">
                      View <ArrowUpRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
                <div className="p-2.5 sm:p-3">
                  {!item.verified && (
                    <span className="mb-1 inline-block text-[10px] font-semibold uppercase tracking-wide text-amber-600">Illustrative</span>
                  )}
                  <h3 className="font-semibold text-xs sm:text-sm leading-snug line-clamp-2" style={{ color: textPrimary }}>
                    {item.heading}
                  </h3>
                  {item.verified && item.category && (
                    <p className="mt-1 text-xs" style={{ color: textMuted }}>
                      {item.category}
                    </p>
                  )}
                </div>
              </button>
            );
          })}

          {/* Cursor-follow circle */}
          <div
            className="pointer-events-none absolute z-50 hidden md:flex items-center justify-center rounded-full text-white text-[10px] font-semibold uppercase tracking-wide"
            style={{
              left: cursorPos.x,
              top: cursorPos.y,
              width: 70,
              height: 70,
              backgroundColor: "#000000",
              transform: `translate(-50%, -50%) scale(${cursorVisible ? 1 : 0})`,
              opacity: cursorVisible ? 1 : 0,
              transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease",
            }}
          >
            Open
          </div>
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
      `}</style>
    </div>
  );
};

export default CaseStudyListing;