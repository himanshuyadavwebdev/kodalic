"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface CaseStudyItem {
  slug: string;
  heading: string;
  description: string;
  image: string;
}

interface CaseStudyListingProps {
  isDark: boolean;
}

const CASE_STUDIES: CaseStudyItem[] = [
  {
    slug: "property-investment-platform",
    heading: "Property Investment Platform",
    description:
      "Invest in the world's best performing residential market, the UAE. Tap into liquid, more flexible real estate ownership.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "business-automation-suite",
    heading: "Business Automation Suite",
    description:
      "Replace manual busywork with reliable, always-on workflows that scale with your team.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "ai-support-copilot",
    heading: "AI Support Copilot",
    description:
      "A support assistant that resolves common tickets instantly, freeing the team for complex cases.",
    image:
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "ecommerce-storefront-rebuild",
    heading: "E-commerce Storefront Rebuild",
    description:
      "A ground-up rebuild that cut load times in half and lifted conversion across every device.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "internal-analytics-dashboard",
    heading: "Internal Analytics Dashboard",
    description:
      "A unified dashboard giving leadership live visibility into revenue, churn, and ops health.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
  },
];

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
  const cardBg = isDark ? "rgba(20, 16, 32, 0.85)" : "#ffffff";
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
        <h1
          className="font-bold tracking-tight text-[clamp(1.75rem,4vw,3rem)] max-w-2xl"
          style={{ color: textPrimary }}
        >
          Real results, real businesses.
        </h1>
      </div>

      {/* Showcase */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        {/* Big featured card */}
        <div
          key={big.slug}
          className="relative w-full rounded-[20px] sm:rounded-[28px] overflow-hidden mb-5 animate-[fadeIn_0.4s_ease]"
          style={{
            backgroundColor: cardBg,
            border: `1px solid ${cardBorder}`,
            boxShadow: isDark
              ? "0 24px 60px rgba(0,0,0,0.4)"
              : "0 24px 60px rgba(109,40,217,0.08)",
          }}
        >
          <div className="flex flex-col md:flex-row items-stretch">
            {/* Image */}
            <div className="w-full md:w-1/2 aspect-[16/9] md:aspect-auto md:h-[320px]">
              <img
                src={big.image}
                alt={big.heading}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="w-full md:w-1/2 flex flex-col justify-center p-5 sm:p-7 md:p-9">
              <h2
                className="font-extrabold text-xl sm:text-2xl md:text-3xl leading-tight mb-3"
                style={{ color: textPrimary }}
              >
                {big.heading}
              </h2>
              <p
                className="text-sm sm:text-[15px] leading-relaxed mb-6 max-w-md"
                style={{ color: textMuted }}
              >
                {big.description}
              </p>

              <Link
                href={`/case-studies/${big.slug}`}
                className={`inline-flex items-center gap-2 w-fit px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm transition-colors duration-200 active:scale-95 ${
                  isDark
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-black text-white hover:bg-black/85"
                }`}
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
                  boxShadow: isDark
                    ? "0 14px 36px rgba(0,0,0,0.35)"
                    : "0 14px 36px rgba(109,40,217,0.06)",
                }}
              >
                <div className="w-full aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.heading}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-2.5 sm:p-3">
                  <h3
                    className="font-semibold text-xs sm:text-sm leading-snug line-clamp-2"
                    style={{ color: textPrimary }}
                  >
                    {item.heading}
                  </h3>
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