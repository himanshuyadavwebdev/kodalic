"use client";

import React from "react";
import { DEMO_MODE, DEMO_TECHNOLOGIES } from "../data/demoData";

interface VerifiedTech {
  name: string;
  logo?: string;
}

const VERIFIED_TECHNOLOGIES: VerifiedTech[] = [];

export default function TechMarquee() {
  const technologies = DEMO_MODE && VERIFIED_TECHNOLOGIES.length === 0 ? DEMO_TECHNOLOGIES : VERIFIED_TECHNOLOGIES;
  if (technologies.length === 0) return null;

  const items = [...technologies, ...technologies];

  return (
    <section className="relative w-full overflow-hidden border-y border-black/[0.04] bg-white py-6" aria-label="Technologies we work with">
      {DEMO_MODE && VERIFIED_TECHNOLOGIES.length === 0 && (
        <div className="relative z-20 mb-4 flex justify-center">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">DEMO TECHNOLOGY STACK — Replace with verified Kodalic technologies</span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" aria-hidden />
      <div className="relative z-0 flex flex-col gap-4">
        <div className="relative flex overflow-hidden">
          <div className="flex items-center gap-10 whitespace-nowrap will-change-transform" style={{ animation: "marquee 32s linear infinite" }}>
            {items.map((tech, i) => (
              <div key={`${tech.name}-${i}`} className="flex items-center gap-2 px-4 py-2 rounded-full border border-black/[0.06] bg-white text-sm font-medium text-black/60">
                {"logo" in tech && tech.logo ? (   <img src={tech.logo} alt={tech.name} className="h-4 w-4 object-contain grayscale opacity-60" /> ) : null}
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex overflow-hidden">
          <div className="flex items-center gap-10 whitespace-nowrap will-change-transform" style={{ animation: "marquee 40s linear infinite reverse" }}>
            {items.map((tech, i) => (
              <div key={`${tech.name}-r-${i}`} className="flex items-center gap-2 px-4 py-2 rounded-full border border-black/[0.06] bg-white text-sm font-medium text-black/60">
                {tech.logo ? <img src={tech.logo} alt={tech.name} className="h-4 w-4 object-contain grayscale opacity-60" /> : null}
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          div[style*="animation: marquee"] { animation: none !important; transform: none !important; }
        }
      `}</style>
    </section>
  );
}
