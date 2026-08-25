"use client";

import React, { useEffect, useState, useRef } from "react";
import { DEMO_MODE, DEMO_TESTIMONIALS } from "../data/demoData";

interface VerifiedTestimonial {
  quote: string;
  name: string;
  company: string;
  role: string;
  avatar?: string;
  logo?: string;
  verified: boolean;
  demo?: boolean;
  label?: string;
}

const TESTIMONIALS: VerifiedTestimonial[] = [];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);

  const source = DEMO_MODE && TESTIMONIALS.length === 0 ? DEMO_TESTIMONIALS : TESTIMONIALS;
  if (source.length === 0) return null;
  const list = DEMO_MODE ? source : source.filter((t) => t.verified);
  if (list.length === 0) return null;

  const current = list[index % list.length];

  const prev = () => setIndex((i) => (i - 1 + list.length) % list.length);
  const next = () => setIndex((i) => (i + 1) % list.length);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) prev();
      else next();
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-white py-16 sm:py-24"
      aria-label="Testimonials"
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="mx-auto max-w-3xl px-6 sm:px-8 lg:px-10 text-center">
        {current.demo && (
          <div className="mb-4 flex justify-center">
            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
              DEMO TESTIMONIAL — Replace with verified client feedback
            </span>
          </div>
        )}
        <div
          className="rounded-[32px] border bg-white p-8 sm:p-12"
          style={{ borderColor: "rgba(0,0,0,0.06)", boxShadow: "0 20px 50px rgba(0,0,0,0.04)" }}
        >
          <div className="mb-6 text-5xl font-serif leading-none text-black/10" aria-hidden>
            “
          </div>
          <blockquote className="text-lg sm:text-xl leading-relaxed" style={{ color: "#161221" }}>
            {current.quote}
          </blockquote>
          <div className="mt-8 flex flex-col items-center gap-3">
            {current.avatar ? (
              <img src={current.avatar} alt={current.name} className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-xs font-semibold text-white" aria-hidden>
                {current.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
            )}
            <div>
              <div className="text-sm font-semibold" style={{ color: "#161221" }}>
                {current.name}
              </div>
              <div className="text-xs" style={{ color: "rgba(22,18,33,0.55)" }}>
                {current.role} {current.company ? `· ${current.company}` : ""}
              </div>
              {current.demo && <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-amber-600">DEMO CLIENT</div>}
            </div>
            {current.logo ? <img src={current.logo} alt={current.company} className="mt-2 h-6 object-contain grayscale opacity-60" /> : null}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-offset-2"
          >
            ←
          </button>
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-offset-2"
          >
            →
          </button>
        </div>
      </div>
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          div { transition: none !important; }
        }
      `}</style>
    </section>
  );
}
