"use client";

import React, { useEffect, useRef, useState } from "react";
import { DEMO_MODE, DEMO_TESTIMONIALS } from "../data/demoData";

interface VerifiedTestimonial {
  quote: string;
  name: string;
  company: string;
  role?: string;
  avatar?: string;
  logo?: string;
  verified: boolean;
  demo?: boolean;
  label?: string;
}

const TESTIMONIALS: VerifiedTestimonial[] = [];

type Direction = "next" | "prev";
type TransitionPhase = "idle" | "leaving" | "entering";

export default function Testimonials({ isDark = false }: { isDark?: boolean }) {
  const [displayIndex, setDisplayIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>("next");
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [reduced, setReduced] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const source =
    DEMO_MODE && TESTIMONIALS.length === 0 ? DEMO_TESTIMONIALS : TESTIMONIALS;

  if (source.length === 0) return null;

  const list = DEMO_MODE ? source : source.filter((testimonial) => testimonial.verified);
  if (list.length === 0) return null;

  const current = list[displayIndex % list.length];

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  };

  const changeTestimonial = (nextDirection: Direction) => {
    if (phase !== "idle" || list.length < 2) return;

    const nextIndex =
      nextDirection === "next"
        ? (displayIndex + 1) % list.length
        : (displayIndex - 1 + list.length) % list.length;

    setDirection(nextDirection);

    if (reduced) {
      setDisplayIndex(nextIndex);
      return;
    }

    clearTimers();
    setPhase("leaving");

    const leaveTimer = window.setTimeout(() => {
      setDisplayIndex(nextIndex);
      setPhase("entering");

      const enterTimer = window.setTimeout(() => {
        setPhase("idle");
      }, 460);

      timers.current.push(enterTimer);
    }, 260);

    timers.current.push(leaveTimer);
  };

  const prev = () => changeTestimonial("prev");
  const next = () => changeTestimonial("next");

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") prev();
    if (event.key === "ArrowRight") next();
  };

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const difference = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(difference) > 40) {
      if (difference > 0) prev();
      else next();
    }

    touchStartX.current = null;
  };

  const contentAnimation = reduced
    ? ""
    : phase === "leaving"
      ? direction === "next"
        ? "testimonial-leave-next"
        : "testimonial-leave-prev"
      : phase === "entering"
        ? direction === "next"
          ? "testimonial-enter-next"
          : "testimonial-enter-prev"
        : "";

  const isTransitioning = phase !== "idle";

  return (
    <section
      className="relative w-full overflow-hidden bg-background py-16 sm:py-24"
      aria-label="Testimonials"
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="mx-auto max-w-3xl px-6 text-center sm:px-8 lg:px-10">
        <div
          className="group rounded-[32px] border bg-card p-8 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_24px_60px_rgba(15,23,42,0.08)] active:scale-[1.01] sm:p-12"
          style={{
            borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.04)",
          }}
        >
          <div className={contentAnimation} aria-live="polite">
            <div
              className="mb-6 text-5xl font-serif leading-none text-black/10 dark:text-white/10"
              aria-hidden
            >
              “
            </div>

            <blockquote
              className="text-lg leading-relaxed transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:text-xl group-hover:translate-y-[-1px]"
              style={{ color: isDark ? "#ffffff" : "#161221" }}
            >
              {current.quote}
            </blockquote>

            <div className="mt-8 flex flex-col items-center gap-3">
              {"avatar" in current && current.avatar ? (
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="h-10 w-10 rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-xs font-semibold text-white transition-transform duration-500 group-hover:scale-105"
                  aria-hidden
                >
                  {current.name
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .slice(0, 2)}
                </div>
              )}

              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: isDark ? "#ffffff" : "#161221" }}
                >
                  {current.name}
                </div>
                <div
                  className="text-xs"
                  style={{
                    color: isDark
                      ? "rgba(255,255,255,0.6)"
                      : "rgba(22,18,33,0.55)",
                  }}
                >
                  {current.role ? `${current.role} · ` : ""}
                  {current.company}
                </div>
              </div>

              {"logo" in current && current.logo ? (
                <img
                  src={current.logo}
                  alt={current.company}
                  className="mt-2 h-6 object-contain grayscale opacity-60"
                />
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            disabled={isTransitioning}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-black hover:text-white focus-visible:outline-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          >
            ←
          </button>

          <button
            onClick={next}
            aria-label="Next testimonial"
            disabled={isTransitioning}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-black hover:text-white focus-visible:outline-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          >
            →
          </button>
        </div>
      </div>

      <style jsx>{`
        .testimonial-enter-next,
        .testimonial-enter-prev,
        .testimonial-leave-next,
        .testimonial-leave-prev {
          will-change: opacity, transform;
        }

        .testimonial-enter-next {
          animation: testimonialEnterNext 460ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .testimonial-enter-prev {
          animation: testimonialEnterPrev 460ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .testimonial-leave-next {
          animation: testimonialLeaveNext 260ms cubic-bezier(0.4, 0, 0.2, 1) both;
        }

        .testimonial-leave-prev {
          animation: testimonialLeavePrev 260ms cubic-bezier(0.4, 0, 0.2, 1) both;
        }

        @keyframes testimonialEnterNext {
          0% {
            opacity: 0;
            transform: translate3d(26px, 12px, 0) scale(0.975);
          }
          62% {
            opacity: 1;
            transform: translate3d(-2px, -1px, 0) scale(1.008);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @keyframes testimonialEnterPrev {
          0% {
            opacity: 0;
            transform: translate3d(-26px, 12px, 0) scale(0.975);
          }
          62% {
            opacity: 1;
            transform: translate3d(2px, -1px, 0) scale(1.008);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @keyframes testimonialLeaveNext {
          to {
            opacity: 0;
            transform: translate3d(-16px, -5px, 0) scale(0.99);
          }
        }

        @keyframes testimonialLeavePrev {
          to {
            opacity: 0;
            transform: translate3d(16px, -5px, 0) scale(0.99);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .testimonial-enter-next,
          .testimonial-enter-prev,
          .testimonial-leave-next,
          .testimonial-leave-prev {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
