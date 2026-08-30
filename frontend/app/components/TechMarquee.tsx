"use client";

import React, { useEffect, useState } from "react";
import { DEMO_MODE, DEMO_TECHNOLOGIES } from "../data/demoData";

interface VerifiedTech {
  name: string;
  logo?: string;
}

const VERIFIED_TECHNOLOGIES: VerifiedTech[] = [];

export default function TechMarquee({ isDark = false }: { isDark?: boolean }) {
  const technologies = DEMO_MODE && VERIFIED_TECHNOLOGIES.length === 0 ? DEMO_TECHNOLOGIES : VERIFIED_TECHNOLOGIES;
  const [ready, setReady] = useState(false);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    // Start after hydration. A double rAF prevents some browsers from keeping
    // the animation at its initial frame after a hard reload.
    let frameOne = requestAnimationFrame(() => {
      let frameTwo = requestAnimationFrame(() => setReady(true));
      return () => cancelAnimationFrame(frameTwo);
    });

    const restart = () => setRunId((id) => id + 1);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") restart();
    };

    window.addEventListener("pageshow", restart);
    window.addEventListener("focus", restart);
    window.addEventListener("resize", restart);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(frameOne);
      window.removeEventListener("pageshow", restart);
      window.removeEventListener("focus", restart);
      window.removeEventListener("resize", restart);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  if (technologies.length === 0) return null;

  const items = [...technologies, ...technologies];
  const trackBase = "tech-marquee-track flex min-w-max shrink-0 items-center gap-10 whitespace-nowrap will-change-transform";

  return (
    <section
      className="relative w-full overflow-hidden border-y border-black/[0.04] py-6 dark:border-white/[0.06]"
      style={{ backgroundColor: isDark ? "#0a0f1e" : "#ffffff" }}
      aria-label="Technologies we work with"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent dark:from-[#0a0f1e]" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent dark:from-[#0a0f1e]" aria-hidden />
      <div className="relative z-0 flex flex-col gap-4">
        <div className="relative flex overflow-hidden">
          <div key={`forward-${runId}`} className={`${trackBase} ${ready ? "tech-marquee-forward" : ""}`}>
            {items.map((tech, i) => (
              <div key={`${tech.name}-${i}`} className="flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-4 py-2 text-sm font-medium text-black/60 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
                {"logo" in tech && tech.logo ? <img src={tech.logo} alt={tech.name} className="h-4 w-4 object-contain grayscale opacity-60" /> : null}
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex overflow-hidden">
          <div key={`reverse-${runId}`} className={`${trackBase} ${ready ? "tech-marquee-reverse" : ""}`}>
            {items.map((tech, i) => (
              <div key={`${tech.name}-r-${i}`} className="flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-4 py-2 text-sm font-medium text-black/60 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
                {"logo" in tech && tech.logo ? <img src={tech.logo} alt={tech.name} className="h-4 w-4 object-contain grayscale opacity-60" /> : null}
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        .tech-marquee-forward { animation: tech-marquee-forward 32s linear infinite; animation-play-state: running; }
        .tech-marquee-reverse { animation: tech-marquee-reverse 40s linear infinite; animation-play-state: running; }
        @keyframes tech-marquee-forward { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); } }
        @keyframes tech-marquee-reverse { from { transform: translate3d(-50%,0,0); } to { transform: translate3d(0,0,0); } }
        @media (prefers-reduced-motion: reduce) { .tech-marquee-forward, .tech-marquee-reverse { animation: none !important; transform: none !important; } }
      `}</style>
    </section>
  );
}
