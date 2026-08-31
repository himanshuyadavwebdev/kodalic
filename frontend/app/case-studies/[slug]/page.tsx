"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "../../theme-provider";
import type { PublicCaseStudyDetail } from "../../../lib/get-public-case-study";

interface PageProps {
  params: Promise<{ slug: string }>;
}



export default function CaseStudyDetailPage({
  params,
}: PageProps) {
  const { slug } = use(params);
  const { isDark, toggleDark } = useTheme();

  const [data, setData] =
    React.useState<PublicCaseStudyDetail | null>(null);

  const [loading, setLoading] =
    React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    async function loadCaseStudy() {
      try {
        const response = await fetch(
          `/api/case-studies/${encodeURIComponent(slug)}`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          if (!cancelled) {
            setData(null);
          }

          return;
        }

        const result =
          (await response.json()) as PublicCaseStudyDetail;

        if (!cancelled) {
          setData(result);
        }
      } catch (error) {
        console.error(
          "Failed to load Case Study:",
          error,
        );

        if (!cancelled) {
          setData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCaseStudy();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const textPrimary = isDark ? "#f5f3ff" : "#161221";
  const textMuted = isDark ? "rgba(245,243,255,0.6)" : "rgba(22,18,33,0.6)";
  const accent = isDark ? "#a78bfa" : "#6d28d9";
  const cardBg = isDark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";

    if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{
          backgroundColor: isDark
            ? "#0a0a0a"
            : "#ffffff",
        }}
      >
        <p
          className="text-sm"
          style={{ color: textMuted }}
        >
          Loading case study...
        </p>
      </div>
    );
  }

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
          {data.title}
        </h1>
        <p className="text-lg sm:text-xl mb-8" style={{ color: textMuted }}>
          {data.description}
        </p>

        <div className="relative w-full aspect-[16/9] rounded-[28px] overflow-hidden mb-12">
          <img
  src={`/api/case-studies/${encodeURIComponent(
    data.slug,
  )}/image`}
  alt={data.hero_alt_text || data.title}
  className="w-full h-full object-cover"
/>
        </div>

        <p
          className="text-base sm:text-lg leading-relaxed mb-12 max-w-3xl"
          style={{ color: textMuted }}
        >
          {data.story}
        </p>

        <div className="mb-16" />

        {/* Sections */}
        <div className="flex flex-col gap-10">
  {data.services.length > 0 && (
    <section>
      <h2
        className="font-bold text-xl sm:text-2xl mb-4"
        style={{ color: textPrimary }}
      >
        Services
      </h2>

      <div className="flex flex-wrap gap-2">
        {data.services.map((service) => (
          <span
            key={service}
            className="rounded-full border px-3 py-1.5 text-sm"
            style={{
              borderColor: border,
              color: textMuted,
            }}
          >
            {service}
          </span>
        ))}
      </div>
    </section>
  )}

  {data.tags.length > 0 && (
    <section>
      <h2
        className="font-bold text-xl sm:text-2xl mb-4"
        style={{ color: textPrimary }}
      >
        Technologies & Tags
      </h2>

      <div className="flex flex-wrap gap-2">
        {data.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border px-3 py-1.5 text-sm"
            style={{
              borderColor: border,
              color: textMuted,
            }}
          >
            #{tag}
          </span>
        ))}
      </div>
    </section>
  )}
</div>

{data.gallery.length > 0 && (
  <section className="mt-16">
    <h2
      className="font-bold text-xl sm:text-2xl mb-5"
      style={{ color: textPrimary }}
    >
      Project Gallery
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {data.gallery.map((media) => (
        <div
          key={media.id}
          className="overflow-hidden rounded-[20px]"
          style={{
            backgroundColor: cardBg,
            border: `1px solid ${border}`,
          }}
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-black/5 dark:bg-white/5">
            <img
              src={`/api/case-studies/${encodeURIComponent(
                data.slug,
              )}/gallery/${encodeURIComponent(
                media.id,
              )}`}
              alt={
                media.alt_text ||
                media.filename ||
                data.title
              }
              className="h-full w-full object-cover object-top"
              loading="lazy"
            />
          </div>

          {media.caption && (
            <p
              className="px-4 py-3 text-sm leading-relaxed"
              style={{ color: textMuted }}
            >
              {media.caption}
            </p>
          )}
        </div>
      ))}
    </div>
  </section>
)}

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