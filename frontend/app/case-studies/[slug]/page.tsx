"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Home, RefreshCw, LineChart } from "lucide-react";
import { useTheme } from "../../theme-provider";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface CaseStudyDetail {
  heading: string;
  subheading: string;
  heroImage: string;
  intro: string;
  sections: { title: string; body: string }[];
  stats: { label: string; value: string }[];
}

const CASE_STUDY_DETAILS: Record<string, CaseStudyDetail> = {
  "property-investment-platform": {
    heading: "Property Investment Platform",
    subheading: "Making UAE real estate accessible from your phone",
    heroImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
    intro:
      "We partnered with a fintech client to build a fractional real-estate investment platform, letting users invest in vetted UAE properties starting from AED 500.",
    sections: [
      {
        title: "The Challenge",
        body: "Traditional real estate investing required large capital, paperwork, and local presence — locking out most retail investors from a high-performing market.",
      },
      {
        title: "The Solution",
        body: "We designed a mobile-first platform with instant KYC, fractional ownership, and automated rental income distribution, backed by a vetted property pipeline.",
      },
      {
        title: "The Result",
        body: "Users can now go from signup to their first investment in under 3 minutes, with full transparency into rental yield and portfolio growth in real time.",
      },
    ],
    stats: [
      { label: "Time to invest", value: "< 3 min" },
      { label: "Minimum investment", value: "AED 500" },
      { label: "Properties vetted", value: "120+" },
    ],
  },
  "business-automation-suite": {
    heading: "Business Automation Suite",
    subheading: "Cutting 32 hours of manual work per week",
    heroImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
    intro:
      "A mid-size operations team was spending most of their week on repetitive data entry across disconnected tools. We built a unified automation layer to fix that.",
    sections: [
      {
        title: "The Challenge",
        body: "Data lived in five different tools with no sync between them, causing constant manual re-entry and reporting errors.",
      },
      {
        title: "The Solution",
        body: "We built lightweight integrations connecting every tool, with automated workflows replacing manual handoffs end-to-end.",
      },
      {
        title: "The Result",
        body: "The team reclaimed 32 hours per week, and reporting errors dropped to near zero with live dashboards replacing manual spreadsheets.",
      },
    ],
    stats: [
      { label: "Hours saved / week", value: "32 hrs" },
      { label: "Tools integrated", value: "5" },
      { label: "Error reduction", value: "94%" },
    ],
  },
};

export default function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const { isDark, toggleDark } = useTheme();
  const data = CASE_STUDY_DETAILS[slug];

  const textPrimary = isDark ? "#f5f3ff" : "#161221";
  const textMuted = isDark ? "rgba(245,243,255,0.6)" : "rgba(22,18,33,0.6)";
  const accent = isDark ? "#a78bfa" : "#6d28d9";
  const cardBg = isDark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";

  if (!data) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
      >
        <p style={{ color: textPrimary }} className="text-xl font-semibold mb-4">
          Case study not found.
        </p>
        <Link href="/" className="underline" style={{ color: accent }}>
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full transition-colors duration-500"
      style={{ backgroundColor: isDark ? "#0a0a0a" : "#ffffff" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 sm:px-10 lg:px-20 pt-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium transition-colors"
          style={{ color: textMuted }}
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        <button
          onClick={toggleDark}
          aria-label="Toggle dark mode"
          className="w-11 h-11 rounded-full flex items-center justify-center transition-shadow"
          style={{
            backgroundColor: isDark ? "#1a2238" : "#ffffff",
            boxShadow: isDark
              ? "0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)"
              : "0 4px 16px rgba(0,0,0,0.15)",
          }}
        >
          <span className="text-lg">{isDark ? "🌙" : "☀️"}</span>
        </button>
      </div>

      {/* Hero */}
      <div className="px-6 sm:px-10 lg:px-20 pt-10 pb-16 max-w-5xl mx-auto">
        <span
          className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase"
          style={{
            color: accent,
            backgroundColor: isDark ? "rgba(167,139,250,0.14)" : "rgba(109,40,217,0.08)",
          }}
        >
          Case Study
        </span>
        <h1
          className="font-extrabold uppercase tracking-tight text-3xl sm:text-5xl leading-tight mb-4"
          style={{ color: textPrimary }}
        >
          {data.heading}
        </h1>
        <p className="text-lg sm:text-xl mb-8" style={{ color: textMuted }}>
          {data.subheading}
        </p>

        <div className="relative w-full aspect-[16/9] rounded-[28px] overflow-hidden mb-12">
          <img
            src={data.heroImage}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        </div>

        <p
          className="text-base sm:text-lg leading-relaxed mb-12 max-w-3xl"
          style={{ color: textMuted }}
        >
          {data.intro}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
          {data.stats.map((stat: { label: string; value: string }) => (
            <div
              key={stat.label}
              className="rounded-[20px] p-6"
              style={{ backgroundColor: cardBg, border: `1px solid ${border}` }}
            >
              <div
                className="font-extrabold text-3xl mb-1"
                style={{ color: accent }}
              >
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: textMuted }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-10">
          {data.sections.map((section: { title: string; body: string }) => (
            <div key={section.title}>
              <h2
                className="font-bold text-xl sm:text-2xl mb-3"
                style={{ color: textPrimary }}
              >
                {section.title}
              </h2>
              <p
                className="text-base leading-relaxed max-w-3xl"
                style={{ color: textMuted }}
              >
                {section.body}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="inline-block mt-16 px-7 py-3.5 rounded-full font-semibold text-sm sm:text-base text-white transition-transform duration-200 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #a78bfa, #6d28d9)",
            boxShadow: "0 12px 30px rgba(109,40,217,0.35)",
          }}
        >
          Back to case studies
        </Link>
      </div>
    </div>
  );
}