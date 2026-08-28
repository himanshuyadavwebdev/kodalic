"use client";
import React, { useLayoutEffect, useEffect, useRef, useCallback, useState } from "react";
import type { ReactNode } from "react";
import Lenis from "lenis";
import Link from "next/link";
import { Sparkles, Cog, Globe, type LucideIcon } from "lucide-react";
import ScrollFloat from "../components/scrollFloat";
import { DEMO_MODE, DEMO_BLOG_POSTS } from "../data/demoData";

/* -------------------------------------------------------------------------- */
/*  ScrollStack Components                                                    */
/* -------------------------------------------------------------------------- */

interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
  isDark?: boolean;
}

const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  itemClassName = "",
  isDark = false,
}) => {
  const cardBg = isDark ? "#0a0a0a" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";

  return (
    <div
      className={`scroll-stack-card relative w-full min-h-[22rem] sm:min-h-[26rem] my-8 p-6 sm:p-10 lg:p-12 rounded-[32px] box-border origin-top will-change-transform ${itemClassName}`.trim()}
      style={{
        backgroundColor: cardBg,
        border: `1px solid ${cardBorder}`,
        boxShadow: isDark
          ? "0 30px 80px rgba(0,0,0,0.45)"
          : "0 30px 80px rgba(0,0,0,0.05)",
      }}
    >
      {children}
    </div>
  );
};

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef(new Map<number, { translateY: number; scale: number; rotation: number; blur: number }>());
  const isUpdatingRef = useRef(false);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false
  );

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(m.matches);
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === "string" && value.includes("%")) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value as string);
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement,
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller ? scroller.scrollTop : 0,
        containerHeight: scroller ? scroller.clientHeight : 0,
        scrollContainer: scroller,
      };
    }
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    (element: HTMLElement) => {
      if (useWindowScroll) {
        let offsetTop = 0;
        let el: HTMLElement | null = element;
        while (el) {
          offsetTop += el.offsetTop;
          el = el.offsetParent as HTMLElement | null;
        }
        return offsetTop;
      } else {
        return element.offsetTop;
      }
    },
    [useWindowScroll]
  );

  const updateCardTransforms = useCallback(() => {
    if (reducedMotion) return;
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const endElement = useWindowScroll
      ? (document.querySelector(".scroll-stack-end") as HTMLElement | null)
      : (scrollerRef.current?.querySelector(".scroll-stack-end") as HTMLElement | null);

    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = getElementOffset(card);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = getElementOffset(cardsRef.current[j]);
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }

        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : "";

        card.style.transform = transform;
        card.style.filter = filter;

        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
    getElementOffset,
    reducedMotion,
  ]);

  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  const setupLenis = useCallback(() => {
    if (reducedMotion) return;
    if (useWindowScroll) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
      });

      lenis.on("scroll", handleScroll);

      const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    } else {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      const lenis = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector(".scroll-stack-inner") as HTMLElement,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        gestureOrientation: "vertical",
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
      });

      lenis.on("scroll", handleScroll);

      const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    }
  }, [handleScroll, useWindowScroll, reducedMotion]);

  useLayoutEffect(() => {
    if (reducedMotion) {
      const cards = Array.from(
        useWindowScroll
          ? document.querySelectorAll(".scroll-stack-card")
          : (scrollerRef.current?.querySelectorAll(".scroll-stack-card") ?? [])
      ) as HTMLElement[];
      cardsRef.current = cards;
      cards.forEach((card, i) => {
        card.style.marginBottom = `${itemDistance}px`;
        card.style.transform = "none";
        card.style.filter = "none";
        card.style.willChange = "auto";
      });
      return;
    }
    if (!useWindowScroll && !scrollerRef.current) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll(".scroll-stack-card")
        : (scrollerRef.current?.querySelectorAll(".scroll-stack-card") ?? [])
    ) as HTMLElement[];
    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.zIndex = String(i + 1);
      card.style.position = "relative";
      card.style.willChange = "transform";
      card.style.transformOrigin = "top center";
      card.style.transform = "translateZ(0)";
      card.style.webkitTransform = "translateZ(0)";
    });

    setupLenis();
    updateCardTransforms();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      transformsCache.clear();
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    setupLenis,
    updateCardTransforms,
    reducedMotion,
  ]);

  if (useWindowScroll) {
    return (
      <div className={`relative w-full ${className}`.trim()} ref={scrollerRef}>
        <div className="scroll-stack-inner -mt-[120px] pt-[calc(20vh-120px)] px-6 sm:px-10 lg:px-20 pb-32 sm:pb-48 lg:pb-64">
          {children}
          <div className="scroll-stack-end w-full h-px" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full overflow-y-auto overflow-x-visible ${className}`.trim()}
      ref={scrollerRef}
      style={{
        overscrollBehavior: "contain",
        WebkitOverflowScrolling: "touch",
        scrollBehavior: "smooth",
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
        willChange: "scroll-position",
      }}
    >
      <div className="scroll-stack-inner pt-[20vh] px-6 sm:px-10 lg:px-20 pb-32 sm:pb-48 lg:pb-64 min-h-screen">
        {children}
        <div className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Blog Component                                                           */
/* -------------------------------------------------------------------------- */

interface BlogPost {
  icon: LucideIcon;
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  author?: string;
  date?: string;
  avatar?: string;
  verified?: boolean;
  demo?: boolean;
  label?: string;
  slug?: string;
}

interface BlogProps {
  isDark: boolean;
}

const VERIFIED_BLOG_POSTS: BlogPost[] = [];

const DEMO_ICON_MAP: Record<string, LucideIcon> = {
  AI: Sparkles,
  Automation: Cog,
  Engineering: Globe,
  "Web Application": Globe,
  Websites: Globe,
};

const BLOG_POSTS: BlogPost[] =
  DEMO_MODE && DEMO_BLOG_POSTS.length > 0
    ? DEMO_BLOG_POSTS.map((post) => ({
        icon: DEMO_ICON_MAP[post.category] || Globe,
        tag: post.category,
        title: post.title,
        excerpt: post.description,
        readTime: post.readingTime,
        author: post.author,
        date: post.date,
        avatar: post.avatar,
        verified: post.verified,
        demo: post.demo,
        label: post.label,
        slug: (post as any).slug,
      }))
    : VERIFIED_BLOG_POSTS.length > 0
    ? VERIFIED_BLOG_POSTS
    : [
        {
          icon: Sparkles,
          tag: "AI",
          title: "Where AI actually earns its keep in a product",
          excerpt: "Most AI features are gimmicks. Here's how we decide which ones are worth shipping — and which ones we skip.",
          readTime: "6 min read",
        },
        {
          icon: Cog,
          tag: "Automation",
          title: "The workflows we automate first for every client",
          excerpt: "A breakdown of the highest-leverage automations we build, and why they usually pay for themselves in weeks.",
          readTime: "5 min read",
        },
        {
          icon: Globe,
          tag: "Engineering",
          title: "What makes a website actually fast in 2026",
          excerpt: "Speed isn't one metric. Here's the real checklist we run through before calling a build production-ready.",
          readTime: "7 min read",
        },
      ];

export default function Blog({ isDark }: BlogProps) {
  const textPrimary = isDark ? "#ffffff" : "#000000";
  const textMuted = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)";
  const accent = isDark ? "#ffffff" : "#000000";
  const tagBg = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";
  const iconBg = isDark ? "#ffffff" : "#000000";
  const iconColor = isDark ? "#000000" : "#ffffff";

  return (
    <div className="relative w-full isolate font-[Inter]" style={{ zIndex: 0 }}>
      {/* Section heading */}
      <div
        className="flex flex-col items-center justify-center px-6 pt-32 pb-4 text-center"
        style={{ color: textPrimary }}
      >
        <ScrollFloat
          containerClassName="max-w-2xl"
          textClassName="font-bold tracking-[-0.04em] uppercase text-4xl sm:text-5xl lg:text-6xl leading-[1.02]"
          scrollStart="top bottom-=10%"
          scrollEnd="top center+=10%"
          animationDuration={1}
        >
          A few thoughts from behind the build.
        </ScrollFloat>
      </div>

      {/* Scroll stack of blog posts */}
      <div className="w-full h-[1800px]">
        <ScrollStack
          useWindowScroll
          itemDistance={60}
          itemScale={0.04}
          itemStackDistance={45}
          stackPosition="18%"
          scaleEndPosition="8%"
          baseScale={0.92}
          rotationAmount={0}
          blurAmount={0}
        >
          {BLOG_POSTS.map(({ icon: Icon, tag, title, excerpt, readTime, author, date, avatar, verified, demo, label, slug }) => {
            const CardInner = (
              <div className="group flex h-full flex-col gap-6">
                <div className="relative h-40 sm:h-44 w-full overflow-hidden rounded-2xl border bg-[#080c1e] transition-transform duration-300 will-change-transform group-hover:scale-[1.01]" style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }} aria-hidden="true">
                  <div className="absolute inset-0" style={{ background: "radial-gradient(400px 280px at 20% 20%, rgba(79,70,229,0.18) 0%, transparent 60%), radial-gradient(320px 240px at 85% 15%, rgba(20,184,166,0.10) 0%, transparent 55%)" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur border border-white/10">
                      <Icon size={24} color="white" />
                    </div>
                  </div>
                  {demo && <span className="absolute left-3 top-3 rounded-full bg-amber-500/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-black">DEMO ARTICLE</span>}
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide border" style={{ color: textPrimary, backgroundColor: tagBg, borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}>
                      {tag}
                    </span>
                    <span className="text-xs" style={{ color: textMuted }}>
                      {readTime}
                    </span>
                    {verified && author && date ? (
                      <span className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                        {avatar ? <img src={avatar} alt={author} className="h-5 w-5 rounded-full object-cover" /> : null}
                        {author} · {date}
                      </span>
                    ) : demo && author ? (
                      <span className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                        {avatar ? <img src={avatar} alt={author} className="h-5 w-5 rounded-full object-cover" /> : <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${isDark ? "bg-white/15 text-white" : "bg-black/10"}`}>DA</span>}
                        {author} · {date} <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${isDark ? "bg-amber-500/20 text-amber-300" : "bg-amber-500/10 text-amber-700"}`}>DEMO</span>
                      </span>
                    ) : null}
                  </div>
                  <h3 className={`font-bold text-xl sm:text-2xl leading-snug mb-2 transition-colors duration-200 ${isDark ? "group-hover:text-white/90" : "group-hover:text-black"}`} style={{ color: textPrimary }}>
                    {title}
                  </h3>
                  <p className="text-sm sm:text-[15px] leading-relaxed max-w-xl" style={{ color: textMuted }}>
                    {excerpt}
                  </p>
                  <span className={`mt-4 inline-flex items-center gap-1 text-sm font-medium transition-all duration-200 group-hover:gap-2 ${isDark ? "text-white/50 group-hover:text-white/90" : "text-black/40 group-hover:text-black/80"}`}>
                    Read article <span aria-hidden>→</span>
                  </span>
                </div>
              </div>
            );
            return (
              <ScrollStackItem key={title} isDark={isDark}>
                {slug ? (
                  <Link href={`/blog/${slug}`} className="block focus-visible:outline-offset-2">
                    {CardInner}
                  </Link>
                ) : (
                  CardInner
                )}
              </ScrollStackItem>
            );
          })}
        </ScrollStack>
      </div>
      {DEMO_MODE && (
        <div className="mt-8 mb-[72px] flex justify-center">
          <Link href="/blog" className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-offset-2">
            Read the blog <span aria-hidden>→</span>
          </Link>
        </div>
      )}
    </div>
  );
}