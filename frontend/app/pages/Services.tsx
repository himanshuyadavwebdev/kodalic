"use client";

import React, { useEffect, useRef, useState } from "react";
import { Globe, Cog, Sparkles, LayoutGrid, Wrench, type LucideIcon } from "lucide-react";
import { DEMO_MODE, DEMO_STATS } from "../data/demoData";

interface ServicesProps {
  isDark: boolean;
}

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
}

const SERVICES: Service[] = [
  {
    icon: Globe,
    title: "Website Development",
    description:
      "Fast, modern sites built to convert. Launch in weeks, not months. Optimized for speed and search from day one.",
  },
  {
    icon: Cog,
    title: "Business Automation",
    description:
      "Workflows that run themselves. Cut manual work, reduce errors, and free your team to focus on what matters.",
  },
  {
    icon: Sparkles,
    title: "AI Solutions",
    description:
      "Practical AI, built into your product. From chatbots to smart automations, deployed where it actually helps.",
  },
  {
    icon: LayoutGrid,
    title: "Digital Solutions",
    description:
      "Tools tailored to how you work. Custom dashboards, internal apps, and integrations built around your process.",
  },
  {
    icon: Wrench,
    title: "Maintenance & Support",
    description:
      "Ongoing updates, monitoring, and support so your product keeps running smoothly. Coverage depends on plan and scope.",
  },
];

/* -------------------------------------------------------------------------- */
/*  RevealOnScroll — IntersectionObserver based reveal, no scroll-jacking.    */
/*  Subtle rise in/out, reversible both scroll directions.                   */
/* -------------------------------------------------------------------------- */

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({ children, className = "", delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false
  );

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.93)",
        transition: `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};

const DemoCountUp: React.FC<{ value: number }> = ({ value }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      setHasAnimated(true);
      return;
    }
    const el = ref.current?.parentElement;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const start = performance.now();
          const duration = 1100;
          const ease = (t: number) => 1 - Math.pow(1 - t, 3);
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            setDisplay(Math.round(ease(progress) * value));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <span ref={ref} aria-hidden="true">
      {display}
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/*  Services                                                                   */
/* -------------------------------------------------------------------------- */

export default function Services({ isDark }: ServicesProps) {
  const textPrimary = isDark ? "#f5f3ff" : "#161221";
  const textMuted = isDark ? "rgba(245,243,255,0.55)" : "rgba(22,18,33,0.55)";
  const iconTileBg = isDark ? "rgba(167,139,250,0.14)" : "rgba(109,40,217,0.08)";

  return (
    <div className="relative w-full">
      {/* Section heading */}
      <div className="flex flex-col items-center justify-center px-6 pt-40 pb-16">

        <h2
          className="text-center font-bold tracking-tight text-[clamp(2rem,5vw,3.5rem)] max-w-2xl mt-4"
          style={{ color: textPrimary }}
        >
          Everything you need, under one roof.
        </h2>
      </div>

      <div className="flex flex-col gap-10 px-6 sm:px-10 lg:px-20 pb-32 max-w-6xl mx-auto">
        {SERVICES.map(({ icon: Icon, title, description, href }, i) => {
          const reversed = i % 2 === 1;
          return (
            <RevealOnScroll key={title}>
              <div
                className="group relative w-full rounded-[32px] overflow-hidden border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 will-change-transform"
                style={{
                  borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                  background: isDark ? "rgba(255,255,255,0.02)" : "#ffffff",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = isDark ? "rgba(167,139,250,0.18)" : "rgba(109,40,217,0.12)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = isDark ? "0 20px 50px rgba(167,139,250,0.12)" : "0 20px 50px rgba(109,40,217,0.10)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                <div className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 md:gap-4 p-8 md:p-12`}>
                  <div className="w-full md:w-1/2 flex flex-col items-start">
                    <h3 className="font-bold text-2xl sm:text-3xl mb-3 tracking-tight leading-tight" style={{ color: textPrimary }}>
                      {title}
                    </h3>
                    <p className="text-[15px] sm:text-base leading-relaxed max-w-md" style={{ color: textMuted }}>
                      {description}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="mt-4 inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200 focus-visible:outline-offset-2"
                        style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}
                      >
                        <span className="group-hover:text-black/80">Learn more</span>
                        <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden>
                          →
                        </span>
                      </a>
                    ) : (
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }} aria-hidden="true">
                        Learn more <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden>→</span>
                      </span>
                    )}
                  </div>

                  <div className="w-full md:w-1/2 flex items-center justify-center">
                    <div
                      className="relative w-full max-w-sm rounded-[28px] flex flex-col items-center justify-center py-14 px-6 transition-colors duration-300"
                      style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#f9f9fb", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}` }}
                    >
                      <div
                        className="flex items-center justify-center w-24 h-24 rounded-3xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] group-hover:rotate-[1.5deg]"
                        style={{
                          backgroundColor: iconTileBg,
                          boxShadow: isDark ? "0 20px 50px rgba(167,139,250,0.15)" : "0 20px 50px rgba(109,40,217,0.12)",
                        }}
                      >
                        <Icon size={36} className="transition-transform duration-300 group-hover:scale-105" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
      {DEMO_MODE && (
        <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-20 pb-20">
          <div className="mb-6 flex justify-center">
            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
              DEMO STATISTICS — Replace with verified Kodalic numbers
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {DEMO_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[20px] border bg-white p-6 text-center"
                style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}
              >
                <div className="text-3xl font-extrabold" style={{ color: isDark ? "#a78bfa" : "#6d28d9" }}>
                  <DemoCountUp value={stat.value} />
                  {stat.suffix}
                </div>
                <div className="mt-2 text-xs font-semibold uppercase tracking-wide" style={{ color: textMuted }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}