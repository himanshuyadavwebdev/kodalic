"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Globe, Cog, Sparkles, LayoutGrid, Wrench, type LucideIcon } from "lucide-react";
import { DEMO_MODE, DEMO_STATS } from "../data/demoData";
import "../components/MagicBento.css";
import VariableProximity from "../components/VariableProximity";

interface ServicesProps {
  isDark: boolean;
}

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  image: string;
}

const SERVICES: Service[] = [
  {
    icon: Globe,
    title: "Website Development",
    description:
      "Fast, modern sites built to convert. Launch in weeks, not months. Optimized for speed and search from day one.",
    image: "/services/website-development.webp",
  },
  {
    icon: Cog,
    title: "Business Automation",
    description:
      "Workflows that run themselves. Cut manual work, reduce errors, and free your team to focus on what matters.",
    image: "/services/business-automation.webp",
  },
  {
    icon: Sparkles,
    title: "AI Solutions",
    description:
      "Practical AI, built into your product. From chatbots to smart automations, deployed where it actually helps.",
    image: "/services/ai-solutions.webp",
  },
  {
    icon: LayoutGrid,
    title: "Digital Solutions",
    description:
      "Tools tailored to how you work. Custom dashboards, internal apps, and integrations built around your process.",
    image: "/services/digital-solutions.webp",
  },
  {
    icon: Wrench,
    title: "Maintenance & Support",
    description:
      "Ongoing updates, monitoring, and support so your product keeps running smoothly. Coverage depends on plan and scope.",
    image: "/services/maintenance-support.webp",
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

interface StatCardProps {
  stat: (typeof DEMO_STATS)[number];
  isDark: boolean;
  textMuted: string;
}

const StatCard: React.FC<StatCardProps> = ({ stat, isDark, textMuted }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || hasAnimated) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(stat.value);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasAnimated(true);
        const start = performance.now();
        const duration = 1100;
        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(eased * stat.value));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        observer.unobserve(card);
      },
      { threshold: 0.3 }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, [hasAnimated, stat.value]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    const dx = x - rect.width / 2;
    const dy = y - rect.height / 2;
    const rotY = (dx / (rect.width / 2)) * 3.2;
    const rotX = -(dy / (rect.height / 2)) * 3.2;

    card.style.setProperty("--stat-glow-x", `${px}%`);
    card.style.setProperty("--stat-glow-y", `${py}%`);
    gsap.to(card, {
      rotationY: Math.max(-6, Math.min(6, rotY)),
      rotationX: Math.max(-6, Math.min(6, rotX)),
      transformPerspective: 850,
      duration: 0.42,
      ease: "power3.out",
      transformOrigin: "center center",
      overwrite: "auto",
    });
  };

  const resetTilt = () => {
    const card = cardRef.current;
    if (!card) return;
    gsap.to(card, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.62,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  return (
    <div
      ref={cardRef}
      className="group relative isolate overflow-hidden rounded-[20px] border bg-white px-5 py-6 text-center transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_22px_42px_rgba(109,40,217,0.11)] dark:bg-white/[0.03] last:col-span-2 last:mx-auto last:w-full lg:last:col-span-1 lg:last:mx-0 lg:last:w-auto"
      style={{
        borderColor: isDark ? "rgba(167,139,250,0.14)" : "rgba(109,40,217,0.10)",
        backgroundImage: isDark
          ? "radial-gradient(circle at var(--stat-glow-x, 50%) var(--stat-glow-y, 50%), rgba(167,139,250,0.14), transparent 48%), linear-gradient(rgba(196,181,253,0.01375) 1px, transparent 1px), linear-gradient(90deg, rgba(196,181,253,0.01375) 1px, transparent 1px)"
          : "radial-gradient(circle at var(--stat-glow-x, 50%) var(--stat-glow-y, 50%), rgba(196,181,253,0.20), transparent 48%), linear-gradient(rgba(167,139,250,0.02875) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.02875) 1px, transparent 1px)",
        backgroundSize: "100% 100%, 24px 24px, 24px 24px",
        backgroundPosition: "center",
        willChange: "transform",
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
      onBlur={resetTilt}
      tabIndex={0}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[-1] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{
          background: isDark
            ? "radial-gradient(circle at var(--stat-glow-x, 50%) var(--stat-glow-y, 50%), rgba(167,139,250,0.18), transparent 58%)"
            : "radial-gradient(circle at var(--stat-glow-x, 50%) var(--stat-glow-y, 50%), rgba(196,181,253,0.24), transparent 58%)",
        }}
      />

      <div
        className="relative text-[34px] font-extrabold leading-none"
        style={{ color: isDark ? "#c4b5fd" : "#6d28d9" }}
      >
        <VariableProximity
          label={`${display}${stat.suffix}`}
          containerRef={cardRef}
          radius={220}
          falloff="linear"
          fromFontVariationSettings="'wght' 260, 'opsz' 8"
          toFontVariationSettings="'wght' 1000, 'opsz' 144"
        />
      </div>

      <div
        className="relative mt-3 text-[15px] font-semibold uppercase tracking-wide"
        style={{ color: textMuted }}
      >
        <VariableProximity
          label={stat.label}
          containerRef={cardRef}
          radius={205}
          falloff="linear"
          fromFontVariationSettings="'wght' 260, 'opsz' 8"
          toFontVariationSettings="'wght' 1000, 'opsz' 144"
        />
      </div>
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mqHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setCanHover(mqHover.matches && !mqMotion.matches && window.innerWidth >= 768);
    };
    update();
    mqHover.addEventListener("change", update);
    mqMotion.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      mqHover.removeEventListener("change", update);
      mqMotion.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (!canHover || !wrapperRef.current) return;
    const wrapper = wrapperRef.current;
    const cards = Array.from(wrapper.querySelectorAll<HTMLElement>("[data-magic-card]"));
    if (!cards.length) return;
    const glowColor = isDark ? "rgba(167,139,250,0.144)" : "rgba(109,40,217,0.12)";
    const spotlightColor = isDark ? "rgba(167,139,250,0.096)" : "rgba(109,40,217,0.072)";
    cards.forEach((c) => {
      c.style.setProperty("--glow-radius", "420px");
      c.style.setProperty("--glow-color", glowColor);
    });
    if (spotlightRef.current) spotlightRef.current.style.setProperty("--spotlight-color", spotlightColor);
    let raf = 0;
    let mx = 0;
    let my = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const rect = wrapper.getBoundingClientRect();
        const sxPx = mx - rect.left + 320;
        const syPx = my - rect.top + 320;
        if (spotlightRef.current) {
          spotlightRef.current.style.setProperty("--spotlight-x", `${sxPx}px`);
          spotlightRef.current.style.setProperty("--spotlight-y", `${syPx}px`);
        }
        cards.forEach((card) => {
          const r = card.getBoundingClientRect();
          const x = mx - r.left;
          const y = my - r.top;
          const px = (x / r.width) * 100;
          const py = (y / r.height) * 100;
          card.style.setProperty("--glow-x", `${px}%`);
          card.style.setProperty("--glow-y", `${py}%`);
          const dx = x - r.width / 2;
          const dy = y - r.height / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const max = Math.sqrt((r.width / 2) ** 2 + (r.height / 2) ** 2) + 420;
          const intensity = Math.max(0, 1 - dist / max);
          card.style.setProperty("--glow-intensity", String(intensity * 0.57));
          const rotY = (dx / (r.width / 2)) * 1.5;
          const rotX = -(dy / (r.height / 2)) * 1.5;
          gsap.to(card, { rotationY: Math.max(-3, Math.min(3, rotY)), rotationX: Math.max(-3, Math.min(3, rotX)), transformPerspective: 900, duration: 0.6, ease: "power3.out", transformOrigin: "center center" });
        });
      });
    };
    const onLeave = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      cards.forEach((card) => {
        card.style.setProperty("--glow-intensity", "0");
        gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.7, ease: "power3.out" });
      });
    };
    const particleCleanups: (() => void)[] = [];
    const rippleCleanups: (() => void)[] = [];
    cards.forEach((card) => {
      let particleTimeout: number | null = null;
      const onEnter = () => {
        if (particleTimeout !== null) return;
        const count = 8 + Math.floor(Math.random() * 5);
        for (let i = 0; i < count; i++) {
          const p = document.createElement("span");
          p.className = "magic-particle";
          p.style.left = `${20 + Math.random() * 60}%`;
          p.style.top = `${20 + Math.random() * 60}%`;
          p.style.setProperty("--glow-color", glowColor);
          card.appendChild(p);
          gsap.fromTo(p, { scale: 0, opacity: 0.51, y: 0 }, { scale: 1.1, y: -10 - Math.random() * 10, opacity: 0, duration: 0.65 + Math.random() * 0.3, ease: "power2.out", delay: Math.random() * 0.12, onComplete: () => p.remove() });
        }
        particleTimeout = window.setTimeout(() => {
          particleTimeout = null;
        }, 700) as unknown as number;
      };
      const onClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest("a")) return;
        const rect = card.getBoundingClientRect();
        const x = (e as MouseEvent & { clientX: number }).clientX - rect.left;
        const y = (e as MouseEvent & { clientY: number }).clientY - rect.top;
        const ripple = document.createElement("span");
        ripple.className = "magic-ripple";
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.width = "12px";
        ripple.style.height = "12px";
        ripple.style.setProperty("--glow-color", glowColor);
        card.appendChild(ripple);
        gsap.fromTo(ripple, { scale: 0, opacity: 0.27 }, { scale: 20, opacity: 0, duration: 0.6, ease: "power2.out", onComplete: () => ripple.remove() });
      };
      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("click", onClick as unknown as EventListener);
      particleCleanups.push(() => card.removeEventListener("mouseenter", onEnter));
      rippleCleanups.push(() => card.removeEventListener("click", onClick as unknown as EventListener));
    });
    wrapper.addEventListener("mousemove", onMove);
    wrapper.addEventListener("mouseleave", onLeave);
    return () => {
      wrapper.removeEventListener("mousemove", onMove);
      wrapper.removeEventListener("mouseleave", onLeave);
      particleCleanups.forEach((fn) => fn());
      rippleCleanups.forEach((fn) => fn());
      if (raf) cancelAnimationFrame(raf);
      cards.forEach((c) => gsap.killTweensOf(c));
      wrapper.querySelectorAll(".magic-particle, .magic-ripple").forEach((el) => el.remove());
    };
  }, [canHover, isDark]);

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

      <div ref={wrapperRef} className="magic-bento-wrapper flex flex-col gap-10 px-6 sm:px-10 lg:px-20 pb-32 max-w-6xl mx-auto">
        <div ref={spotlightRef} className="magic-bento-spotlight" aria-hidden />
        {SERVICES.map(({ title, description, image }, i) => {
          const reversed = i % 2 === 1;
          return (
            <RevealOnScroll key={title}>
              <div
                data-magic-card
                className="magic-card group relative w-full rounded-[32px] overflow-hidden border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 will-change-transform"
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
                <div className={`magic-card-content relative flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 md:gap-4 p-8 md:p-12`}>
                  <div className="w-full md:w-1/2 flex flex-col items-start">
                    <h3 className="font-bold text-2xl sm:text-3xl mb-3 tracking-tight leading-tight" style={{ color: textPrimary }}>
                      {title}
                    </h3>
                    <p className="text-[15px] sm:text-base leading-relaxed max-w-md" style={{ color: textMuted }}>
                      {description}
                    </p>
                  </div>

                  <div className="w-full md:w-1/2 flex items-center justify-center">
                    <div
                      className="relative w-full max-w-sm rounded-[28px] overflow-hidden flex flex-col items-center justify-center h-[208px] transition-colors duration-300"
                      style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}` }}
                    >
                      <img src={image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
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
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {DEMO_STATS.map((stat) => (
              <StatCard
                key={stat.label}
                stat={stat}
                isDark={isDark}
                textMuted={textMuted}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}