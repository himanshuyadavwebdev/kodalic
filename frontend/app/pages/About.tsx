"use client";

import React from "react";

interface AboutProps {
  isDark?: boolean;
}

export default function About({ isDark = false }: AboutProps) {
  const textPrimary = isDark ? "#ffffff" : "#0a1128";
  const textMuted = isDark ? "rgba(255,255,255,0.65)" : "#52525b";
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const subtleBg = isDark ? "#0f0f12" : "#f9f9fb";

  return (
    <section className="relative z-10 w-full bg-white font-[Inter] dark:bg-[#0a0a0a]" style={{ background: isDark ? "#0a0a0a" : "#ffffff" }}>
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-10">
        <div className="flex flex-col md:flex-row items-stretch gap-10 md:gap-12 py-16 md:py-24 lg:py-28">
          <div className="w-full md:w-[48%]">
            <div
              className="relative overflow-hidden rounded-[28px] border p-6 sm:p-8"
              style={{ background: subtleBg, borderColor: cardBorder }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-24 h-[320px] w-[320px] rounded-full blur-3xl opacity-60"
                style={{
                  background: isDark
                    ? "radial-gradient(closest-side, rgba(79,70,229,0.18), transparent 70%)"
                    : "radial-gradient(closest-side, rgba(79,70,229,0.10), transparent 70%)",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-24 -left-24 h-[280px] w-[280px] rounded-full blur-3xl opacity-60"
                style={{
                  background: isDark
                    ? "radial-gradient(closest-side, rgba(20,184,166,0.14), transparent 70%)"
                    : "radial-gradient(closest-side, rgba(20,184,166,0.08), transparent 70%)",
                }}
              />

              <div className="relative flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#0a1128] dark:bg-white" style={{ background: isDark ? "#ffffff" : "#0a1128" }} />
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: textMuted }}>
                    How we work
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-2">
                  {[
                    { k: "Discover", d: "Understand goals, constraints, and real business impact." },
                    { k: "Build", d: "Ship fast, practical systems with long-term maintainability." },
                    { k: "Evolve", d: "Iterate and support so technology keeps improving." },
                  ].map((s) => (
                    <div
                      key={s.k}
                      className="rounded-2xl border px-5 py-5"
                      style={{ background: cardBg, borderColor: cardBorder }}
                    >
                      <div className="text-sm font-semibold tracking-[-0.01em]" style={{ color: textPrimary }}>
                        {s.k}
                      </div>
                      <div className="mt-1 text-sm leading-relaxed" style={{ color: textMuted }}>
                        {s.d}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-2 rounded-2xl border px-5 py-4 flex items-center justify-between"
                  style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", borderColor: cardBorder }}
                >
                  <span className="text-xs font-medium" style={{ color: textMuted }}>
                    Real work lives in Case Studies — no placeholder imagery.
                  </span>
                  <span className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: isDark ? "#ffffff" : "#0a1128", color: isDark ? "#0a0a0a" : "#ffffff" }}>
                    →
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 w-full md:w-[52%] flex flex-col justify-center">
            <h2
              className="text-[clamp(2rem,4.5vw,2.75rem)] font-[750] leading-[1.05] tracking-[-0.03em] uppercase"
              style={{ color: textPrimary }}
            >
              Technology solutions
              <br />
              built around real
              <br />
              business needs.
            </h2>
            <div className="mt-6 w-14 h-1 bg-cyan-400 rounded-full" />
            <p className="mt-8 text-[15px] md:text-base leading-relaxed" style={{ color: textMuted }}>
              Kodalic is a technology solutions company helping businesses turn ideas, challenges,
              and opportunities into practical digital solutions.
            </p>
            <p className="mt-4 text-[15px] md:text-base leading-relaxed" style={{ color: textMuted }}>
              We combine software engineering, AI, automation, and product development to create
              reliable technology that improves how businesses operate, connect, and grow.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
