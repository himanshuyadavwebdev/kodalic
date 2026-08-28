"use client";

import React, { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import NewsletterDemo from "./NewsletterDemo";
import { DEMO_MODE, DEMO_SOCIALS, DEMO_LEGAL } from "../data/demoData";

const TwitterIcon = ({ size, color, style }: { size: number; color?: string; style?: React.CSSProperties }) => {
  const strokeColor = color || style?.color || "currentColor";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
};

const InstagramIcon = ({ size, color, style }: { size: number; color?: string; style?: React.CSSProperties }) => {
  const strokeColor = color || style?.color || "currentColor";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
};

const FacebookIcon = ({ size, color, style }: { size: number; color?: string; style?: React.CSSProperties }) => {
  const strokeColor = color || style?.color || "currentColor";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
};

const YoutubeIcon = ({ size, color, style }: { size: number; color?: string; style?: React.CSSProperties }) => {
  const strokeColor = color || style?.color || "currentColor";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
      <polygon points="9.7 9 9.7 15 14.5 12 9.7 9" />
    </svg>
  );
};

const LinkedinIcon = ({ size, color, style }: { size: number; color?: string; style?: React.CSSProperties }) => {
  const strokeColor = color || style?.color || "currentColor";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
};

interface FooterProps {
  isDark: boolean;
  onHeightChange?: (height: number) => void;
  onToggleDark: () => void;
}

const PRODUCT_LINKS = ["Website Development", "Business Automation", "AI Solutions", "Digital Solutions"];

const COMPANY_LINKS: { label: string; id: string }[] = [
  { label: "About Us", id: "about" },
  { label: "Case Studies", id: "case-studies" },
];

const LEARN_LINKS: { label: string; id: string }[] = [
  { label: "Blog", id: "blog" },
  { label: "FAQ", id: "faq" },
];

const CONTACT_LINKS: { label: string; id: string }[] = [{ label: "Contact", id: "contact" }];

export default function Footer({ isDark, onHeightChange, onToggleDark }: FooterProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !onHeightChange) return;
    const ro = new ResizeObserver((entries) => {
      const h = entries[0]?.contentRect.height;
      if (h) onHeightChange(h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [onHeightChange]);

  const bg = isDark ? "#0a0f1e" : "#ffffff";
  const textPrimary = isDark ? "#ffffff" : "#000000";
  const textMuted = isDark ? "#a3a3a3" : "#525252";
  const border = isDark ? "rgba(255,255,255,0.1)" : "#e5e5e5";

  const scrollTo = (id?: string) => (e: React.MouseEvent) => {
    if (!id) return;
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer ref={ref} className="fixed bottom-0 left-0 w-full font-[Inter]" style={{ backgroundColor: bg, zIndex: 1 }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pt-16 pb-10">
        <div className="pb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight max-w-2xl" style={{ color: textPrimary }}>
            Let&apos;s build what&apos;s next.
          </h2>
          <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed" style={{ color: textMuted }}>
            Kodalic is a technology partner for teams that want reliable websites, practical automation, and applied AI — built around real business needs, not trends.
          </p>
          <a
            href="#contact"
            onClick={scrollTo("contact")}
            className={`mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors ${isDark ? "bg-black text-white hover:bg-black/85" : "bg-white text-black hover:bg-white/90"}`}
          >
            Start a project <span aria-hidden>→</span>
          </a>
        </div>

        <div className="mt-8">
          <NewsletterDemo isDark={isDark} />
        </div>

        <div className="w-full h-px mt-8" style={{ backgroundColor: border }} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 py-8">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Kodalic" className="h-9 w-9 rounded-lg object-contain" />
            <span className="text-xl font-bold tracking-tight" style={{ color: textPrimary }}>
              Kodalic
            </span>
            <span className="ml-2 hidden sm:inline text-xs font-medium uppercase tracking-wide" style={{ color: textMuted }}>
              ESTD 2019
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: textMuted }}>
              Theme
            </span>
            <button
              onClick={onToggleDark}
              className={`relative flex items-center justify-between w-[72px] h-[36px] rounded-full p-1 transition-all duration-300 cursor-pointer shrink-0 ${isDark ? "bg-[#181d2a]" : "bg-[#f1f5f9]"}`}
              style={{
                border: isDark ? "1px solid rgba(0,0,0,0.15)" : "1px solid rgba(255,255,255,0.15)",
                boxShadow: isDark ? "inset 0 2px 4px rgba(0,0,0,0.2)" : "inset 0 2px 4px rgba(0,0,0,0.05)",
              }}
              aria-label="Toggle theme"
            >
              <div
                className={`absolute top-[2px] bottom-[2px] w-[30px] rounded-full transition-all duration-300 ease-out ${isDark ? "left-[38px] bg-[#2a354f]" : "left-[2px] bg-[#dbeafe]"}`}
                style={{ boxShadow: isDark ? "0 2px 4px rgba(0,0,0,0.4)" : "0 2px 4px rgba(0,0,0,0.1)" }}
              />
              <div className="z-10 flex items-center justify-center w-7 h-7">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={!isDark ? "#1e293b" : "#475569"} strokeWidth="3" strokeLinecap="round">
                  <circle cx="12" cy="12" r="5" fill={!isDark ? "#1e293b" : "#475569"} />
                  <line x1="12" y1="2" x2="12" y2="5" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="5" y2="12" />
                  <line x1="19" y1="12" x2="22" y2="12" />
                </svg>
              </div>
              <div className="z-10 flex items-center justify-center w-7 h-7">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={isDark ? "#ffffff" : "#94a3b8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {DEMO_MODE && (
          <div className="flex flex-wrap items-center gap-3 py-6">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: textMuted }}>
              DEMO SOCIAL — Replace with verified profiles:
            </span>
            {DEMO_SOCIALS.map((s) => (
              <Link key={s.label} href={s.href} className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium hover:bg-white hover:text-black" style={{ borderColor: border, color: textMuted }}>
                {s.label} <span className="rounded bg-amber-500/10 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-700">DEMO</span>
              </Link>
            ))}
          </div>
        )}

        <div className="w-full h-px" style={{ backgroundColor: border }} />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 py-10">
          <FooterColumn title="Product" textPrimary={textPrimary}>
            {PRODUCT_LINKS.map((l) => (
              <a key={l} href="#services" onClick={scrollTo("services")} className="text-sm hover:underline" style={{ color: textMuted }}>
                {l}
              </a>
            ))}
          </FooterColumn>

          <FooterColumn title="Company" textPrimary={textPrimary}>
            {COMPANY_LINKS.map((l) => (
              <a key={l.label} href={`#${l.id}`} onClick={scrollTo(l.id)} className="text-sm hover:underline" style={{ color: textMuted }}>
                {l.label}
              </a>
            ))}
          </FooterColumn>

          <FooterColumn title="Learn" textPrimary={textPrimary}>
            {LEARN_LINKS.map((l) => (
              <a key={l.label} href={`#${l.id}`} onClick={scrollTo(l.id)} className="text-sm hover:underline" style={{ color: textMuted }}>
                {l.label}
              </a>
            ))}
          </FooterColumn>

          <FooterColumn title="Contact" textPrimary={textPrimary}>
            {CONTACT_LINKS.map((l) => (
              <a key={l.label} href={`#${l.id}`} onClick={scrollTo(l.id)} className="text-sm hover:underline" style={{ color: textMuted }}>
                {l.label}
              </a>
            ))}
            <a href="mailto:info@kodalic.com" className="text-xs leading-relaxed mt-2 hover:underline" style={{ color: textMuted }}>
              info@kodalic.com
            </a>
            <span className="text-xs leading-relaxed mt-1" style={{ color: textMuted }}>
              Founder: Aayush Sahu
            </span>
            <a href="mailto:aayushsahu35491@gmail.com" className="text-xs leading-relaxed hover:underline" style={{ color: textMuted }}>
              aayushsahu35491@gmail.com
            </a>
            <span className="text-xs leading-relaxed mt-1" style={{ color: textMuted }}>
              Manager: Mukul Joshi
            </span>
            <a href="mailto:mukuljoshi318@gmail.com" className="text-xs leading-relaxed hover:underline" style={{ color: textMuted }}>
              mukuljoshi318@gmail.com
            </a>
          </FooterColumn>
        </div>

        <div className="w-full h-px" style={{ backgroundColor: border }} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-8">
          <p className="text-sm" style={{ color: textMuted }}>
            © Kodalic {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-10">
          <p className="text-xs italic leading-relaxed" style={{ color: textMuted }}>
            At Kodalic, we believe great technology should be accessible to every business, not just the well-funded. That&apos;s why we build fast websites, practical AI, and reliable automation for teams at every stage.
          </p>
          <div className="text-xs italic leading-relaxed" style={{ color: textMuted }}>
            <p className="font-semibold not-italic mb-1" style={{ color: textPrimary }}>
              Note:
            </p>
            <p>Kodalic delivers software, automation, and AI engineering services. Timelines and outcomes vary by project scope. Nothing on this site constitutes a guarantee of specific results.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FooterColumnProps {
  title: string;
  textPrimary: string;
  children: React.ReactNode;
}

const FooterColumn: React.FC<FooterColumnProps> = ({ title, textPrimary, children }) => (
  <div className="flex flex-col gap-3">
    <span className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: textPrimary, opacity: 0.5 }}>
      {title}
    </span>
    {children}
  </div>
);
