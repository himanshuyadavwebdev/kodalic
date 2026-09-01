"use client";

import React, { useState } from "react";
import { DEMO_MODE } from "../data/demoData";

export default function NewsletterDemo({ isDark }: { isDark: boolean }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const textPrimary = isDark ? "#000000" : "#ffffff";
  const textMuted = isDark ? "#525252" : "#a3a3a3";
  const border = isDark ? "#e5e5e5" : "#262626";
  const inputBg = isDark ? "#f5f5f5" : "#171717";
  const inputBorder = isDark ? "#e5e5e5" : "#262626";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    if (DEMO_MODE) {
      setSuccess(true);
      setEmail("");
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border p-6 text-center" style={{ borderColor: border, backgroundColor: isDark ? "#f5f5f5" : "#171717" }}>
        <p className="text-sm font-semibold" style={{ color: textPrimary }}>
          Thank you — subscription received.
        </p>
        <button onClick={() => setSuccess(false)} className="mt-4 text-xs font-semibold underline" style={{ color: textMuted }}>
          Subscribe again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-6" style={{ borderColor: border, backgroundColor: isDark ? "#ffffff" : "#0a0a0a" }}>
      <h3 className="text-base font-semibold" style={{ color: textPrimary }}>
        Stay in the loop
      </h3>
      <p className="mt-1 text-xs leading-relaxed" style={{ color: textMuted }}>
        Subscribe for updates and insights.
      </p>
      <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col sm:flex-row gap-3">
        <label htmlFor="newsletter-email" className="sr-only">
          Email
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
            if (success) setSuccess(false);
          }}
          placeholder="demo@example.com"
          className="flex-1 rounded-full px-4 py-3 text-sm outline-none"
          style={{ backgroundColor: inputBg, border: `1px solid ${error ? "#ef4444" : inputBorder}`, color: textPrimary }}
          aria-invalid={!!error}
          aria-describedby={error ? "newsletter-error" : undefined}
        />
        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors ${isDark ? "bg-black text-white hover:bg-black/85" : "bg-white text-black hover:bg-white/90"} disabled:opacity-70`}
        >
          {submitting ? "Subscribing…" : "Subscribe"}
        </button>
      </form>
      {error && (
        <p id="newsletter-error" role="alert" className="mt-2 text-xs" style={{ color: "#ef4444" }}>
          {error}
        </p>
      )}
    </div>
  );
}
