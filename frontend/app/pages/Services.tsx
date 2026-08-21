"use client";

import React, { useEffect, useRef, useState } from "react";
import { Globe, Cog, Sparkles, LayoutGrid, Wrench, type LucideIcon } from "lucide-react";

interface ServicesProps {
  isDark: boolean;
}

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  chipLabel: string;
  chipValue: string;
}

const SERVICES: Service[] = [
  {
    icon: Globe,
    title: "Website Development",
    description:
      "Fast, modern sites built to convert. Launch in weeks, not months. Optimized for speed and search from day one.",
    chipLabel: "Live",
    chipValue: "99.9% Uptime",
  },
  {
    icon: Cog,
    title: "Business Automation",
    description:
      "Workflows that run themselves. Cut manual work, reduce errors, and free your team to focus on what matters.",
    chipLabel: "Saved",
    chipValue: "32 hrs/week",
  },
  {
    icon: Sparkles,
    title: "AI Solutions",
    description:
      "Practical AI, built into your product. From chatbots to smart automations, deployed where it actually helps.",
    chipLabel: "Powered by",
    chipValue: "AI Engine",
  },
  {
    icon: LayoutGrid,
    title: "Digital Solutions",
    description:
      "Tools tailored to how you work. Custom dashboards, internal apps, and integrations built around your process.",
    chipLabel: "Custom",
    chipValue: "Built for you",
  },
  {
    icon: Wrench,
    title: "Maintenance & Support",
    description:
      "Always on, always covered. Ongoing updates, monitoring, and support so your product keeps running smoothly.",
    chipLabel: "Response",
    chipValue: "< 2 hrs",
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(true);
      return;
    }

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
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Services                                                                   */
/* -------------------------------------------------------------------------- */

export default function Services({ isDark }: ServicesProps) {
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";
  const textPrimary = isDark ? "#f5f3ff" : "#161221";
  const textMuted = isDark ? "rgba(245,243,255,0.55)" : "rgba(22,18,33,0.55)";

  const iconTileBg = isDark ? "rgba(167,139,250,0.14)" : "rgba(109,40,217,0.08)";
  const chipBg = isDark ? "rgba(255,255,255,0.06)" : "#ffffff";
  const chipBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";

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

      {/* Service rows — split card layout, alternating sides */}
      <div className="flex flex-col gap-10 px-6 sm:px-10 lg:px-20 pb-32 max-w-6xl mx-auto">
        {SERVICES.map(({ icon: Icon, title, description, chipLabel, chipValue }, i) => {
          const reversed = i % 2 === 1;
          return (
            <RevealOnScroll key={title}>
              <div
                className="relative w-full rounded-[32px] overflow-hidden"
              >
                <div
                  className={`flex flex-col ${
                    reversed ? "md:flex-row-reverse" : "md:flex-row"
                  } items-center gap-8 md:gap-4 p-8 md:p-12`}
                >
                  {/* Left: text content */}
                  <div className="w-full md:w-1/2 flex flex-col items-start">
                    <span
                      className="mb-4 px-4 py-1.5 rounded-full text-xs font-semibold"
                      style={{
                  
                        backgroundColor: iconTileBg,
                      }}
                    >
                    </span>
                    <h3
                      className="font-bold text-2xl sm:text-3xl mb-3 tracking-tight leading-tight"
                      style={{ color: textPrimary }}
                    >
                      {title}
                    </h3>
                    <p
                      className="text-[15px] sm:text-base leading-relaxed max-w-md"
                      style={{ color: textMuted }}
                    >
                      {description}
                    </p>
                  </div>

                  {/* Right: visual panel with floating chip */}
                  <div className="w-full md:w-1/2 flex items-center justify-center">
                    <div
                      className="relative w-full max-w-sm rounded-[28px] flex flex-col items-center justify-center py-14 px-6 bg-white"
                    >
                      <div
                        className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium shadow-md"
                        style={{
                          backgroundColor: chipBg,
                          border: `1px solid ${chipBorder}`,
                          color: textPrimary,
                        }}
                      >
                        <span
                          className="flex items-center justify-center w-6 h-6 rounded-full"
                          style={{ backgroundColor: iconTileBg }}
                        >
                          <Icon size={13}  />
                        </span>
                        <span style={{ color: textMuted }}>{chipLabel}</span>
                        <span style={{ color: textPrimary }} className="font-semibold">
                          {chipValue}
                        </span>
                      </div>

                      <div
                        className="flex items-center justify-center w-24 h-24 rounded-3xl mt-10"
                        style={{
                          backgroundColor: iconTileBg,
                          boxShadow: isDark
                            ? "0 20px 50px rgba(167,139,250,0.15)"
                            : "0 20px 50px rgba(109,40,217,0.15)",
                        }}
                      >
                        <Icon size={40}      />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </div>
  );
}