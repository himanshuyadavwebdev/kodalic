"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle2, type LucideIcon } from "lucide-react";
import { DEMO_MODE, DEMO_CONTACT, DEMO_SOCIALS } from "../data/demoData";

interface ContactUsProps {
  isDark: boolean;
}

/* -------------------------------------------------------------------------- */
/*  RevealOnScroll — same pattern used across Services/Blog for consistency  */
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
        transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.96)",
        transition: `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Contact info                                                              */
/* -------------------------------------------------------------------------- */

interface ContactDetail {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
  verified: boolean;
}

const CONTACT_DETAILS: ContactDetail[] = [
  {
    icon: Mail,
    label: "Email us",
    value: "hello@kodalic.com",
    href: "mailto:hello@kodalic.com",
    verified: false,
  },
  {
    icon: MapPin,
    label: "Find us",
    value: "Remote-first, working worldwide",
    href: "#",
    verified: false,
  },
];

/* -------------------------------------------------------------------------- */
/*  ContactUs                                                                  */
/* -------------------------------------------------------------------------- */

type FormState = {
  name: string;
  email: string;
  company: string;
  message: string;
};

const INITIAL_FORM: FormState = { name: "", email: "", company: "", message: "" };

export default function ContactUs({ isDark }: ContactUsProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [configError, setConfigError] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const textPrimary = isDark ? "#ffffff" : "#000000";
  const textMuted = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)";
  const accent = isDark ? "#ffffff" : "#000000";
  const cardBg = isDark ? "rgba(255, 255, 255, 0.02)" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const iconBg = isDark ? "#ffffff" : "#000000";
  const iconColor = isDark ? "#000000" : "#ffffff";
  const inputBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)";
  const inputBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const placeholderClass = isDark
    ? "placeholder:text-white/35"
    : "placeholder:text-black/35";

  const handleChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (configError) setConfigError(false);
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.email.trim()) {
      next.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }
    if (!form.message.trim()) next.message = "Tell us a bit about your project.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setConfigError(false);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      if (DEMO_MODE) {
        setSubmitted(true);
        setForm(INITIAL_FORM);
      } else {
        setConfigError(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fieldStyle: React.CSSProperties = {
    backgroundColor: inputBg,
    border: `1px solid ${inputBorder}`,
    color: textPrimary,
  };

  return (
    <div className="relative w-full font-[Inter]">
      {/* Section heading */}
      <div className="flex flex-col items-center justify-center px-6 pt-32 pb-14 text-center">
        <span
          className={`mb-5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${
            isDark ? "text-white/80 border-white/20" : "text-black/80 border-black/20"
          }`}
        >
          Get in touch
        </span>
        <h2
          className={`font-bold tracking-[-0.04em] uppercase text-4xl sm:text-5xl lg:text-6xl leading-[1.02] max-w-2xl text-center`}
          style={{ color: textPrimary }}
        >
          Let&apos;s build what&apos;s next.
        </h2>
        <p
          className={`mt-4 text-base sm:text-lg max-w-lg leading-relaxed text-center`}
          style={{ color: textMuted }}
        >
          Tell us about your project and we&apos;ll get back to you within one business day.
        </p>
      </div>

      {/* Content */}
      <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-20 pb-32">
        <RevealOnScroll>
          <div
            className="relative w-full rounded-[32px] overflow-hidden flex flex-col lg:flex-row"
            style={{
              backgroundColor: cardBg,
              border: `1px solid ${border}`,
              boxShadow: isDark
                ? "0 30px 80px rgba(0,0,0,0.45)"
                : "0 30px 80px rgba(0,0,0,0.05)",
            }}
          >
            {/* Left: contact details */}
            <div
              className="w-full lg:w-2/5 flex flex-col justify-between p-8 sm:p-10 lg:p-12"
              style={{
                background: isDark
                  ? "linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))"
                  : "linear-gradient(160deg, rgba(0,0,0,0.02), rgba(0,0,0,0.005))",
              }}
            >
              <div>
                <h3
                  className="font-bold text-xl sm:text-2xl mb-3 tracking-tight"
                  style={{ color: textPrimary }}
                >
                  Reach out directly
                </h3>
                <p className="text-sm sm:text-[15px] leading-relaxed mb-10" style={{ color: textMuted }}>
                  Prefer email or a quick call? We&apos;re reachable directly, no forms required.
                </p>

                <div className="flex flex-col gap-6">
                  {DEMO_MODE ? (
                    <>
                      <a href={`mailto:${DEMO_CONTACT.email}`} className="flex items-start gap-4 group">
                        <div className="flex items-center justify-center w-11 h-11 rounded-2xl flex-shrink-0 transition-transform duration-200 group-hover:scale-105" style={{ backgroundColor: iconBg, boxShadow: isDark ? "0 12px 30px rgba(255,255,255,0.15)" : "0 12px 30px rgba(0,0,0,0.1)" }}>
                          <Mail size={18} color={iconColor} />
                        </div>
                        <div>
                          <div className="text-xs font-medium uppercase tracking-wide mb-0.5" style={{ color: textMuted }}>
                            DEMO EMAIL <span className="rounded bg-amber-500/10 px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">DEMO</span>
                          </div>
                          <div className="text-sm sm:text-[15px] font-semibold" style={{ color: textPrimary }}>
                            {DEMO_CONTACT.email}
                          </div>
                        </div>
                      </a>
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-11 h-11 rounded-2xl flex-shrink-0" style={{ backgroundColor: iconBg, boxShadow: isDark ? "0 12px 30px rgba(255,255,255,0.15)" : "0 12px 30px rgba(0,0,0,0.1)" }}>
                          <Phone size={18} color={iconColor} />
                        </div>
                        <div>
                          <div className="text-xs font-medium uppercase tracking-wide mb-0.5" style={{ color: textMuted }}>
                            DEMO PHONE <span className="rounded bg-amber-500/10 px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">DEMO</span>
                          </div>
                          <div className="text-sm sm:text-[15px] font-semibold" style={{ color: textPrimary }}>
                            {DEMO_CONTACT.phone}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-11 h-11 rounded-2xl flex-shrink-0" style={{ backgroundColor: iconBg, boxShadow: isDark ? "0 12px 30px rgba(255,255,255,0.15)" : "0 12px 30px rgba(0,0,0,0.1)" }}>
                          <MapPin size={18} color={iconColor} />
                        </div>
                        <div>
                          <div className="text-xs font-medium uppercase tracking-wide mb-0.5" style={{ color: textMuted }}>
                            DEMO LOCATION <span className="rounded bg-amber-500/10 px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">DEMO</span>
                          </div>
                          <div className="text-sm sm:text-[15px] font-semibold" style={{ color: textPrimary }}>
                            {DEMO_CONTACT.location}
                          </div>
                        </div>
                      </div>
                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">DEMO CONTACT — Replace with verified details</p>
                        <p className="mt-1 text-xs leading-relaxed" style={{ color: textMuted }}>
                          {DEMO_CONTACT.availability}
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: textMuted }}>
                          {DEMO_CONTACT.responseTime}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {DEMO_SOCIALS.map((s) => (
                          <a key={s.label} href={s.href} className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium hover:bg-black hover:text-white" style={{ borderColor: border, color: textMuted }}>
                            {s.label} <span className="ml-1 rounded bg-amber-500/10 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-700">DEMO</span>
                          </a>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      {CONTACT_DETAILS.filter((d) => d.verified).map(({ icon: Icon, label, value, href }) => (
                        <a key={label} href={href} className="flex items-start gap-4 group">
                          <div className="flex items-center justify-center w-11 h-11 rounded-2xl flex-shrink-0 transition-transform duration-200 group-hover:scale-105" style={{ backgroundColor: iconBg, boxShadow: isDark ? "0 12px 30px rgba(255,255,255,0.15)" : "0 12px 30px rgba(0,0,0,0.1)" }}>
                            <Icon size={18} color={iconColor} />
                          </div>
                          <div>
                            <div className="text-xs font-medium uppercase tracking-wide mb-0.5" style={{ color: textMuted }}>
                              {label}
                            </div>
                            <div className="text-sm sm:text-[15px] font-semibold" style={{ color: textPrimary }}>
                              {value}
                            </div>
                          </div>
                        </a>
                      ))}
                      {CONTACT_DETAILS.filter((d) => d.verified).length === 0 && (
                        <p className="text-xs leading-relaxed" style={{ color: textMuted }}>
                          Contact details will appear here once verified. Use the form to start a conversation — no placeholder information is shown.
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="mt-12 pt-8 text-xs sm:text-sm leading-relaxed" style={{ color: textMuted, borderTop: `1px solid ${border}` }}>
                {DEMO_MODE ? (
                  <>
                    <span className="rounded bg-amber-500/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">DEMO AVAILABILITY</span>
                    <span className="ml-2">{DEMO_CONTACT.availability}</span>
                    <br />
                    <span className="rounded bg-amber-500/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">DEMO RESPONSE TIME</span>
                    <span className="ml-2">{DEMO_CONTACT.responseTime}</span>
                  </>
                ) : (
                  <>We aim to respond within one business day. Timelines vary by inquiry.</>
                )}
              </div>
            </div>

            {/* Right: form */}
            <div className="w-full lg:w-3/5 p-8 sm:p-10 lg:p-12">
              {DEMO_MODE && (
                <div className="mb-6 flex justify-center">
                  <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">DEMO CONTACT FORM — No message was sent</span>
                </div>
              )}
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div
                    className="flex items-center justify-center w-16 h-16 rounded-full mb-6"
                    style={{
                      backgroundColor: iconBg,
                      boxShadow: isDark ? "0 20px 50px rgba(255,255,255,0.15)" : "0 20px 50px rgba(0,0,0,0.1)",
                    }}
                  >
                    <CheckCircle2 size={28} color={iconColor} />
                  </div>
                  <h3 className="font-bold text-xl sm:text-2xl mb-2" style={{ color: textPrimary }}>
                    {DEMO_MODE ? "DEMO MODE — Submission simulated successfully." : "Message sent."}
                  </h3>
                  <p className="text-sm sm:text-base max-w-xs" style={{ color: textMuted }}>
                    {DEMO_MODE ? "No message was sent. This is a demo success state for UI testing. Replace with verified backend." : "Thanks for reaching out — we'll be in touch shortly."}
                  </p>
                  <button onClick={() => setSubmitted(false)} className="mt-8 text-sm font-semibold underline underline-offset-4" style={{ color: textPrimary }}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-semibold uppercase tracking-wide mb-2"
                        style={{ color: textMuted }}
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange("name")}
                        placeholder="Jane Doe"
                        className={`w-full rounded-xl px-4 py-3 text-sm sm:text-[15px] outline-none transition-colors ${placeholderClass}`}
                        style={{
                          ...fieldStyle,
                          borderColor: errors.name ? "#ef4444" : inputBorder,
                        }}
                      />
                      {errors.name && (
                        <p className="mt-1.5 text-xs" style={{ color: "#ef4444" }}>
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-semibold uppercase tracking-wide mb-2"
                        style={{ color: textMuted }}
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange("email")}
                        placeholder="jane@company.com"
                        className={`w-full rounded-xl px-4 py-3 text-sm sm:text-[15px] outline-none transition-colors ${placeholderClass}`}
                        style={{
                          ...fieldStyle,
                          borderColor: errors.email ? "#ef4444" : inputBorder,
                        }}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-xs" style={{ color: "#ef4444" }}>
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-5">
                    <label
                      htmlFor="company"
                      className="block text-xs font-semibold uppercase tracking-wide mb-2"
                      style={{ color: textMuted }}
                    >
                      Company <span style={{ color: textMuted, fontWeight: 400 }}>(optional)</span>
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={form.company}
                      onChange={handleChange("company")}
                      placeholder="Acme Inc."
                      className={`w-full rounded-xl px-4 py-3 text-sm sm:text-[15px] outline-none transition-colors ${placeholderClass}`}
                      style={fieldStyle}
                    />
                  </div>

                  <div className="mb-7">
                    <label
                      htmlFor="message"
                      className="block text-xs font-semibold uppercase tracking-wide mb-2"
                      style={{ color: textMuted }}
                    >
                      Project details
                    </label>
                    <textarea
                      id="message"
                      value={form.message}
                      onChange={handleChange("message")}
                      placeholder="Tell us what you're building, your timeline, and any specifics we should know."
                      rows={5}
                      className={`w-full rounded-xl px-4 py-3 text-sm sm:text-[15px] outline-none transition-colors resize-none ${placeholderClass}`}
                      style={{
                        ...fieldStyle,
                        borderColor: errors.message ? "#ef4444" : inputBorder,
                      }}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-xs" style={{ color: "#ef4444" }}>
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {configError && (
                    <div role="alert" aria-live="polite" className="mb-5 rounded-xl border px-4 py-3 text-sm leading-relaxed" style={{ borderColor: "rgba(245,158,11,0.25)", backgroundColor: "rgba(245,158,11,0.08)", color: textPrimary }}>
                      Submission is not yet connected to a verified backend. TODO: wire this form to <code className="rounded bg-black/5 px-1 py-0.5">POST /api/contact</code> or email service. Your message was not sent — this is an intentional non-success state.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    aria-busy={submitting}
                    className={`inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:active:scale-100 ${isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/85"}`}
                    style={{
                      boxShadow: isDark ? "0 12px 30px rgba(255,255,255,0.15)" : "0 12px 30px rgba(0,0,0,0.1)",
                    }}
                  >
                    {submitting ? "Sending..." : <>Send message <Send size={16} /></>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}