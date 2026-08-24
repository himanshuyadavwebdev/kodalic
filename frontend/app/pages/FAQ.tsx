"use client";

import React, { useRef, useState } from "react";
import { Plus } from "lucide-react";

interface FAQProps {
  isDark: boolean;
}

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What does Kodalic actually do?",
    answer:
      "We're a technology solutions company. We design and build websites, automate internal workflows, ship practical AI features, and provide ongoing support — so you get one team instead of juggling five vendors.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Most website builds launch in 2–4 weeks. Automation and AI projects vary depending on scope, but we always start with a scoping call and give you a clear timeline before any work begins.",
  },
  {
    question: "Do you work with early-stage startups or only established companies?",
    answer:
      "Both. We work with founders shipping their first product and with established businesses automating years of manual process. Pricing and scope flex to match where you are.",
  },
  {
    question: "What's included in ongoing maintenance & support?",
    answer:
      "Monitoring, security updates, bug fixes, and small iterative improvements. Coverage and response times depend on the plan and scope — we outline specifics before work begins, with no surprise invoices.",
  },
  {
    question: "Can you integrate with tools we already use?",
    answer:
      "Yes — we regularly connect CRMs, payment processors, spreadsheets, internal databases, and third-party APIs into a single automated workflow. If it has an API (or even just a spreadsheet), we can likely wire it in.",
  },
  {
    question: "How does pricing work?",
    answer:
      "Every engagement starts with a free scoping call where we understand your goals and give you a fixed quote or a monthly retainer, depending on the type of work. No hourly surprises.",
  },
  {
    question: "Do you offer AI solutions even if we're not a tech company?",
    answer:
      "Absolutely — most of our AI work is for non-technical teams. Think automated customer replies, smart document processing, or internal copilots. We handle the engineering; you get the outcome.",
  },
  {
    question: "What happens after the project launches?",
    answer:
      "We don't disappear. Every build includes a handoff walkthrough, documentation, and the option to move into an ongoing maintenance & support plan so your product keeps improving after launch.",
  },
];

interface FAQRowProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  isDark: boolean;
  isLast: boolean;
}

const FAQRow: React.FC<FAQRowProps> = ({ item, isOpen, onToggle, isDark, isLast }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const textPrimary = isDark ? "#ffffff" : "#000000";
  const textMuted = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const iconBg = isOpen
    ? isDark
      ? "#ffffff"
      : "#000000"
    : isDark
    ? "rgba(255,255,255,0.06)"
    : "rgba(0,0,0,0.04)";
  const iconColor = isOpen ? (isDark ? "#000000" : "#ffffff") : textPrimary;

  return (
    <div style={{ borderBottom: isLast ? "none" : `1px solid ${border}` }}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-6 py-5 sm:py-6 text-left"
      >
        <span
          className="text-sm sm:text-base font-medium leading-snug"
          style={{ color: isOpen ? textPrimary : textMuted }}
        >
          {item.question}
        </span>
        <span
          className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0 transition-all duration-300"
          style={{ background: iconBg }}
        >
          <Plus
            size={15}
            color={iconColor}
            style={{
              transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </span>
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          opacity: isOpen ? 1 : 0,
          overflow: "hidden",
          transition:
            "grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
        }}
      >
        <div className="overflow-hidden">
          <div ref={contentRef} className="pb-5 sm:pb-6 pr-10 sm:pr-14">
            <p
              className="text-sm sm:text-[15px] leading-relaxed"
              style={{ color: textMuted }}
            >
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function FAQ({ isDark }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const textPrimary = isDark ? "#ffffff" : "#000000";
  const textMuted = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)";

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="relative w-full font-[Inter]">
      {/* Section heading */}
      <div className="flex flex-col items-center justify-center px-6 pt-32 pb-14 text-center">
        <h2
          className={`font-bold tracking-[-0.04em] uppercase text-4xl sm:text-5xl lg:text-6xl leading-[1.02] max-w-2xl text-center`}
          style={{ color: textPrimary }}
        >
          Frequently Asked Questions
        </h2>
        <p
          className={`mt-4 text-base sm:text-lg max-w-lg leading-relaxed text-center`}
          style={{ color: textMuted }}
        >
          Everything you need to know before we start building together.
        </p>
      </div>

      {/* Accordion list */}
      <div className="w-full max-w-3xl mx-auto px-6 sm:px-10 pb-24">
        {FAQ_ITEMS.map((item, i) => (
          <FAQRow
            key={item.question}
            item={item}
            isOpen={openIndex === i}
            onToggle={() => toggle(i)}
            isDark={isDark}
            isLast={i === FAQ_ITEMS.length - 1}
          />
        ))}
      </div>
    </div>
  );
}