"use client";

import React, { useLayoutEffect, useRef } from "react";

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

const COMPANY_LINKS: { label: string; id?: string; href?: string }[] = [
    { label: "About Us", id: "about" },
    { label: "Case Studies", id: "case-studies" },
    { label: "Careers", href: "#" },
];

const LEARN_LINKS: { label: string; id?: string; href?: string }[] = [
    { label: "Blog", id: "blog" },
    { label: "FAQ", id: "faq" },
    { label: "Help Center", href: "#" },
];

const LEGAL_LINKS = ["Terms of Use", "Privacy Policy", "Cookies Notice"];

const SOCIALS = [
    { icon: TwitterIcon, href: "#", label: "Twitter" },
    { icon: InstagramIcon, href: "#", label: "Instagram" },
    { icon: FacebookIcon, href: "#", label: "Facebook" },
    { icon: YoutubeIcon, href: "#", label: "YouTube" },
    { icon: LinkedinIcon, href: "#", label: "LinkedIn" },
];

export default function Footer({ isDark, onHeightChange, onToggleDark }: FooterProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Report actual rendered height so page.tsx can reserve exactly that much
    // scroll space at the bottom of the document. Without this, the reveal
    // "shutter" effect won't have the right amount of runway to fully expose
    // the footer before the page runs out of scroll.
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

    const bg = isDark ? "#ffffff" : "#0a0a0a";
    const textPrimary = isDark ? "#000000" : "#ffffff";
    const textMuted = isDark ? "#525252" : "#a3a3a3";
    const border = isDark ? "#e5e5e5" : "#262626";
    const iconBg = isDark ? "#f5f5f5" : "#171717";
    const iconBorder = isDark ? "#e5e5e5" : "#262626";

    const scrollTo = (id?: string) => (e: React.MouseEvent) => {
        if (!id) return;
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <footer
            ref={ref}
            className="fixed bottom-0 left-0 w-full font-[Inter]"
            style={{ backgroundColor: bg, zIndex: 1 }}
        >
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 pt-16 pb-10">
                {/* Top row: logo + socials & theme toggle */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-10">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Kodalic" className="h-9 w-9 rounded-lg object-contain" />
                        <span className="text-xl font-bold tracking-tight" style={{ color: textPrimary }}>
                            Kodalic
                        </span>
                    </div>
                    <div className="flex items-center gap-6 self-stretch sm:self-auto justify-between sm:justify-start">
                        <div className="flex items-center gap-3">
                            {SOCIALS.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="flex items-center justify-center w-9 h-9 rounded-full transition-transform hover:-translate-y-0.5"
                                    style={{ backgroundColor: iconBg, border: `1px solid ${iconBorder}` }}
                                >
                                    <Icon size={15} style={{ color: textPrimary }} />
                                </a>
                            ))}
                        </div>

                        {/* Custom Theme Toggle Pill */}
                        <button
                            onClick={onToggleDark}
                            className={`relative flex items-center justify-between w-[72px] h-[36px] rounded-full p-1 transition-all duration-300 cursor-pointer shrink-0 ${isDark ? "bg-[#181d2a]" : "bg-[#f1f5f9]"
                                }`}
                            style={{
                                border: isDark ? "1px solid rgba(0,0,0,0.15)" : "1px solid rgba(255,255,255,0.15)",
                                boxShadow: isDark
                                    ? "inset 0 2px 4px rgba(0,0,0,0.2)"
                                    : "inset 0 2px 4px rgba(0,0,0,0.05)"
                            }}
                            aria-label="Toggle theme"
                        >
                            {/* Sliding Indicator */}
                            <div
                                className={`absolute top-[2px] bottom-[2px] w-[30px] rounded-full transition-all duration-300 ease-out ${isDark
                                    ? "left-[38px] bg-[#2a354f]"
                                    : "left-[2px] bg-[#dbeafe]"
                                    }`}
                                style={{
                                    boxShadow: isDark
                                        ? "0 2px 4px rgba(0,0,0,0.4)"
                                        : "0 2px 4px rgba(0,0,0,0.1)"
                                }}
                            />

                            {/* Sun icon */}
                            <div className="z-10 flex items-center justify-center w-7 h-7">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={!isDark ? "#1e293b" : "#475569"}
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                >
                                    <circle cx="12" cy="12" r="5" fill={!isDark ? "#1e293b" : "#475569"} />
                                    <line x1="12" y1="2" x2="12" y2="5" />
                                    <line x1="12" y1="19" x2="12" y2="22" />
                                    <line x1="2" y1="12" x2="5" y2="12" />
                                    <line x1="19" y1="12" x2="22" y2="12" />
                                    <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" />
                                    <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" />
                                    <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" />
                                    <line x1="16.95" y1="4.93" x2="19.07" y2="7.05" />
                                </svg>
                            </div>

                            {/* Moon icon */}
                            <div className="z-10 flex items-center justify-center w-7 h-7">
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={isDark ? "#ffffff" : "#94a3b8"}
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="w-full h-px" style={{ backgroundColor: border }} />

                {/* Link columns */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 py-10">
                    <FooterColumn title="Product" textPrimary={textPrimary}>
                        {PRODUCT_LINKS.map((l) => (
                            <a
                                key={l}
                                href="#services"
                                onClick={scrollTo("services")}
                                className="text-sm hover:underline"
                                style={{ color: textMuted }}
                            >
                                {l}
                            </a>
                        ))}
                    </FooterColumn>

                    <FooterColumn title="Company" textPrimary={textPrimary}>
                        {COMPANY_LINKS.map((l) => (
                            <a
                                key={l.label}
                                href={l.id ? `#${l.id}` : l.href}
                                onClick={scrollTo(l.id)}
                                className="text-sm hover:underline"
                                style={{ color: textMuted }}
                            >
                                {l.label}
                            </a>
                        ))}
                    </FooterColumn>

                    <FooterColumn title="Learn" textPrimary={textPrimary}>
                        {LEARN_LINKS.map((l) => (
                            <a
                                key={l.label}
                                href={l.id ? `#${l.id}` : l.href}
                                onClick={scrollTo(l.id)}
                                className="text-sm hover:underline"
                                style={{ color: textMuted }}
                            >
                                {l.label}
                            </a>
                        ))}
                    </FooterColumn>

                    <FooterColumn title="Legal" textPrimary={textPrimary}>
                        {LEGAL_LINKS.map((l) => (
                            <a key={l} href="#" className="text-sm hover:underline" style={{ color: textMuted }}>
                                {l}
                            </a>
                        ))}
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
                        At Kodalic, we believe great technology should be accessible to every business, not
                        just the well-funded. That&apos;s why we build fast websites, practical AI, and
                        reliable automation for teams at every stage — so you can focus on growth while we
                        handle the engineering.
                    </p>
                    <div className="text-xs italic leading-relaxed" style={{ color: textMuted }}>
                        <p className="font-semibold not-italic mb-1" style={{ color: textPrimary }}>
                            Note:
                        </p>
                        <p>
                            Kodalic delivers software, automation, and AI engineering services. Timelines and
                            outcomes vary by project scope. Nothing on this site constitutes a guarantee of
                            specific results.
                        </p>
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
        <span
            className="text-xs font-semibold uppercase tracking-wide mb-1"
            style={{ color: textPrimary, opacity: 0.5 }}
        >
            {title}
        </span>
        {children}
    </div>
);