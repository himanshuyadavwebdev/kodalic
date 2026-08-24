"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface HeroProps {
  isDark?: boolean;
}

export default function Hero({ isDark = false }: HeroProps) {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false
  );

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    m.addEventListener("change", onChange);
    const id = requestAnimationFrame(() => setMounted(true));
    return () => {
      m.removeEventListener("change", onChange);
      cancelAnimationFrame(id);
    };
  }, []);

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const base = "will-change-[opacity,transform] transition-[opacity,transform] duration-[640ms]";
  const ease = "ease-[cubic-bezier(0.16,1,0.3,1)]";
  const enter = (delay: number) =>
    reduced
      ? {}
      : {
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(18px)",
          transitionDelay: `${delay}ms`,
        };

  return (
    <section className="relative z-10 w-full overflow-hidden bg-[#080c1e] text-white font-[Inter]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#080c1e]" />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(700px 520px at 18% 18%, rgba(79,70,229,0.22) 0%, transparent 62%),
              radial-gradient(640px 480px at 84% 16%, rgba(20,184,166,0.10) 0%, transparent 58%),
              radial-gradient(900px 700px at 50% 115%, rgba(79,70,229,0.14) 0%, transparent 62%),
              linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 28%, transparent 100%)
            `,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.9'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#080c1e]/40" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-10">
        <div className="flex min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-68px)] flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12 pt-[84px] sm:pt-[88px] pb-12 lg:py-16">
          <div className="flex max-w-[640px] flex-col items-center lg:items-start text-center lg:text-left">
            <div
              className={`${base} ${ease}`}
              style={enter(0)}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                <span className="text-xs font-medium tracking-wide text-white/85">ESTD 2019 — Engineering partner for growing businesses</span>
              </div>
            </div>

            <h1
              className={`${base} ${ease} mt-6 text-[clamp(2.4rem,6vw,4.5rem)] font-[650] leading-[0.95] tracking-[-0.04em] text-white`}
              style={enter(80)}
            >
              Engineering what
              <br />
              <span className="inline-flex items-baseline gap-2">
                businesses
                <span className="relative inline-flex h-[0.72em] w-[1.05em] items-center justify-center overflow-hidden rounded-xl bg-white/[0.08] ring-1 ring-white/10 backdrop-blur">
                  <img
                    src="/stack.png"
                    alt=""
                    aria-hidden
                    className="h-full w-full object-cover opacity-90"
                  />
                </span>
              </span>
              <br />
              <span className="text-white/90">become next.</span>
            </h1>

            <p
              className={`${base} ${ease} mt-5 max-w-[520px] text-[15px] sm:text-[17px] leading-[1.65] text-white/65`}
              style={enter(160)}
            >
              Kodalic builds intelligent technology solutions — websites, AI, automation, and
              digital products — that help businesses evolve, automate, and compete in a
              digital-first world.
            </p>

            <div className={`${base} ${ease} mt-8 flex flex-col sm:flex-row items-center gap-3`} style={enter(240)}>
              <a
                href="#contact"
                onClick={scrollToContact}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14.5px] font-semibold tracking-[-0.01em] text-[#0a0a0a] shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_14px_36px_rgba(0,0,0,0.28)] active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60 focus-visible:outline-offset-2"
              >
                Get a Quote
                <ArrowUpRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#case-studies"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("case-studies")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-[14.5px] font-medium text-white/85 backdrop-blur transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
              >
                View work
              </a>
            </div>

            <div className={`${base} ${ease} mt-8 flex items-center gap-3 text-xs text-white/45`} style={enter(320)}>
              <span className="h-px w-8 bg-white/15" aria-hidden />
              <span className="tracking-wide">Websites • Automation • AI • Digital products</span>
            </div>
          </div>

          <div
            className={`${base} ${ease} flex w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[480px] shrink-0 items-center justify-center`}
            style={enter(280)}
          >
            <div className="relative w-full">
              <div
                aria-hidden
                className="absolute -inset-6 -z-10 rounded-[36px] blur-2xl"
                style={{
                  background:
                    "radial-gradient(520px 420px at 50% 50%, rgba(79,70,229,0.18), transparent 70%), radial-gradient(420px 320px at 80% 20%, rgba(20,184,166,0.12), transparent 70%)",
                }}
              />
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl shadow-[0_24px_64px_rgba(0,0,0,0.35),0_1px_0_0_rgba(255,255,255,0.06)_inset]">
                <div className="overflow-hidden rounded-[20px] bg-[#0a0a0a]">
                  <img
                    src="/Kodalic.png"
                    alt="Kodalic — technology solutions"
                    className="h-auto w-full object-contain"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
              <div className="absolute -bottom-4 left-4 right-4 hidden sm:flex items-center justify-between rounded-2xl border border-white/10 bg-[#0f1220]/80 px-4 py-3 backdrop-blur-xl">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-white/45">Build focus</div>
                  <div className="text-sm font-medium text-white">Reliable • Fast • Maintainable</div>
                </div>
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                  <ArrowUpRight size={14} className="text-black" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
