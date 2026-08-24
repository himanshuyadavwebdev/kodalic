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
        {SERVICES.map(({ icon: Icon, title, description }, i) => {
          const reversed = i % 2 === 1;
          return (
            <RevealOnScroll key={title}>
              <div className="relative w-full rounded-[32px] overflow-hidden border" style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", background: isDark ? "rgba(255,255,255,0.02)" : "#ffffff" }}>
                <div
                  className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 md:gap-4 p-8 md:p-12`}
                >
                  <div className="w-full md:w-1/2 flex flex-col items-start">
                    <h3 className="font-bold text-2xl sm:text-3xl mb-3 tracking-tight leading-tight" style={{ color: textPrimary }}>
                      {title}
                    </h3>
                    <p className="text-[15px] sm:text-base leading-relaxed max-w-md" style={{ color: textMuted }}>
                      {description}
                    </p>
                  </div>

                  <div className="w-full md:w-1/2 flex items-center justify-center">
                    <div className="relative w-full max-w-sm rounded-[28px] flex flex-col items-center justify-center py-14 px-6" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#f9f9fb", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}` }}>
                      <div
                        className="flex items-center justify-center w-24 h-24 rounded-3xl"
                        style={{
                          backgroundColor: iconTileBg,
                          boxShadow: isDark ? "0 20px 50px rgba(167,139,250,0.15)" : "0 20px 50px rgba(109,40,217,0.12)",
                        }}
                      >
                        <Icon size={36} />
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