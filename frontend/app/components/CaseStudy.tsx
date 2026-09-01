    "use client";

    import React from "react";
    import Link from "next/link";
    import { type LucideIcon } from "lucide-react";

    export interface CaseStudyFeature {
    icon: LucideIcon;
    title: string;
    description: string;
    }

    export interface CaseStudyData {
    slug: string;
    eyebrow: string;
    heading: string;
    description: string;
    image: string;
    ctaLabel: string;
    features: CaseStudyFeature[];
    }

    interface CaseStudyProps {
    data: CaseStudyData;
    isDark: boolean;
    }

    const CaseStudy = ({ data, isDark }: CaseStudyProps) => {
    const panelBg = isDark ? "rgba(20, 16, 32, 0.85)" : "#ffffff";
    const cardBg = isDark ? "rgba(255,255,255,0.04)" : "#ffffff";
    const textPrimary = isDark ? "#f5f3ff" : "#161221";
    const textMuted = isDark ? "rgba(245,243,255,0.6)" : "rgba(22,18,33,0.6)";
    const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";
    const iconBg = isDark
        ? "linear-gradient(135deg, #a78bfa, #7c3aed)"
        : "linear-gradient(135deg, #a78bfa, #7c3aed)";

    return (
        <div className="relative w-full max-w-6xl mx-auto px-6 py-16">
        {/* Top hero panel */}
        <div
            className="relative w-full rounded-[32px] overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-10 p-8 md:p-12"
            style={{
            backgroundColor: panelBg,
            border: `1px solid ${border}`,
            boxShadow: isDark
                ? "0 30px 80px rgba(0,0,0,0.45)"
                : "0 30px 80px rgba(109,40,217,0.08)",
            }}
        >
            {/* Left: copy */}
            <div className="w-full md:w-2/5 flex flex-col items-start">
            <h2
                className="font-extrabold uppercase tracking-tight text-3xl sm:text-4xl leading-[1.1] mb-4"
                style={{ color: textPrimary }}
            >
                {data.eyebrow}
            </h2>
            <p
                className="text-[15px] sm:text-base leading-relaxed mb-8 max-w-sm"
                style={{ color: textMuted }}
            >
                {data.description}
            </p>
            <Link
                href={`/case-studies/${data.slug}`}
                className="px-7 py-3.5 rounded-full font-semibold text-sm sm:text-base text-white transition-transform duration-200 active:scale-95"
                style={{
                background: "linear-gradient(135deg, #a78bfa, #6d28d9)",
                boxShadow: "0 12px 30px rgba(109,40,217,0.35)",
                }}
            >
                {data.ctaLabel}
            </Link>
            </div>

            {/* Right: image */}
            <div className="w-full md:w-3/5">
            <div className="relative w-full aspect-[16/10] rounded-[24px] overflow-hidden">
                <img
                src={data.image}
                alt={data.heading}
                className="w-full h-full object-cover"
                />
            </div>
            </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
            {data.features.map(({ icon: Icon, title, description }, i) => (
            <div
                key={i}
                className="rounded-[24px] p-6 flex flex-col items-start"
                style={{
                backgroundColor: cardBg,
                border: `1px solid ${border}`,
                boxShadow: isDark
                    ? "0 20px 50px rgba(0,0,0,0.35)"
                    : "0 20px 50px rgba(109,40,217,0.06)",
                }}
            >
                <div
                className="flex items-center justify-center w-11 h-11 rounded-full mb-5"
                style={{ background: iconBg }}
                >
                <Icon size={20} color="#ffffff" />
                </div>
                <h3
                className="font-bold text-base sm:text-lg uppercase leading-snug mb-2"
                style={{ color: textPrimary }}
                >
                {title}
                </h3>
                <p
                className="text-sm leading-relaxed"
                style={{ color: textMuted }}
                >
                {description}
                </p>
            </div>
            ))}
        </div>
        </div>
    );
    };

    export default CaseStudy;