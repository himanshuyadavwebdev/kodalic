"use client";
import React, { useLayoutEffect, useRef, useCallback, useState } from "react";
import type { ReactNode } from "react";
import Lenis from "lenis";
import { Sparkles, Cog, Globe, type LucideIcon } from "lucide-react";
import ScrollFloat from "../components/scrollFloat";

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
  const cardBg = isDark ? "rgba(20, 16, 32, 0.92)" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";

  return (
    <div
      className={`scroll-stack-card relative w-full h-[26rem] my-8 p-10 sm:p-12 rounded-[32px] box-border origin-top will-change-transform ${itemClassName}`.trim()}
      style={{
        backgroundColor: cardBg,
        border: `1px solid ${cardBorder}`,
        boxShadow: isDark
          ? "0 30px 80px rgba(0,0,0,0.45)"
          : "0 30px 80px rgba(109,40,217,0.08)",
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
  const lastTransformsRef = useRef(new Map<number, any>());
  const isUpdatingRef = useRef(false);

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
  ]);

  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  const setupLenis = useCallback(() => {
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
  }, [handleScroll, useWindowScroll]);

  useLayoutEffect(() => {
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
  ]);

  if (useWindowScroll) {
    return (
      <div className={`relative w-full ${className}`.trim()} ref={scrollerRef}>
        <div className="scroll-stack-inner pt-[20vh] px-20 pb-[70rem]">
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
      <div className="scroll-stack-inner pt-[20vh] px-20 pb-[70rem] min-h-screen">
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
}

interface BlogProps {
  isDark: boolean;
}

const BLOG_POSTS: BlogPost[] = [
  {
    icon: Sparkles,
    tag: "AI",
    title: "Where AI actually earns its keep in a product",
    excerpt:
      "Most AI features are gimmicks. Here's how we decide which ones are worth shipping — and which ones we skip.",
    readTime: "6 min read",
  },
  {
    icon: Cog,
    tag: "Automation",
    title: "The workflows we automate first for every client",
    excerpt:
      "A breakdown of the highest-leverage automations we build, and why they usually pay for themselves in weeks.",
    readTime: "5 min read",
  },
  {
    icon: Globe,
    tag: "Engineering",
    title: "What makes a website actually fast in 2026",
    excerpt:
      "Speed isn't one metric. Here's the real checklist we run through before calling a build production-ready.",
    readTime: "7 min read",
  },
];

export default function Blog({ isDark }: BlogProps) {
  const textPrimary = isDark ? "#f5f3ff" : "#161221";
  const textMuted = isDark ? "rgba(245,243,255,0.6)" : "rgba(22,18,33,0.6)";
  const accent = isDark ? "#a78bfa" : "#6d28d9";
  const tagBg = isDark ? "rgba(167,139,250,0.14)" : "rgba(109,40,217,0.08)";
  const iconBg = isDark
    ? "linear-gradient(135deg, #a78bfa, #7c3aed)"
    : "linear-gradient(135deg, #a78bfa, #6d28d9)";

  return (
    <div className="relative w-full isolate" style={{ zIndex: 0 }}>
      {/* Section heading */}
      <div className="flex flex-col items-center justify-center px-6 pt-32 pb-4 text-center" style={{ color: textPrimary }}>
        <ScrollFloat
          containerClassName="max-w-2xl"
          textClassName="font-bold tracking-tight text-[clamp(1.75rem,4vw,3rem)]"
          scrollStart="top bottom-=10%"
          scrollEnd="top center+=10%"
          animationDuration={1}
        >
          A few thoughts from behind the  build.
        </ScrollFloat>
      </div>

      {/* Scroll stack of blog posts */}
      <div className="w-full h-[320vh]">
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
          {BLOG_POSTS.map(({ icon: Icon, tag, title, excerpt, readTime }) => (
            <ScrollStackItem key={title} isDark={isDark}>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 h-full">
                {/* Icon */}
                <div
                  className="flex items-center justify-center w-14 h-14 rounded-2xl flex-shrink-0"
                  style={{
                    background: iconBg,
                    boxShadow: "0 12px 30px rgba(109,40,217,0.3)",
                  }}
                >
                  <Icon size={24} color="#ffffff" />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide"
                      style={{ color: accent, backgroundColor: tagBg }}
                    >
                      {tag}
                    </span>
                    <span className="text-xs" style={{ color: textMuted }}>
                      {readTime}
                    </span>
                  </div>
                  <h3
                    className="font-bold text-xl sm:text-2xl leading-snug mb-2"
                    style={{ color: textPrimary }}
                  >
                    {title}
                  </h3>
                  <p
                    className="text-sm sm:text-[15px] leading-relaxed max-w-xl"
                    style={{ color: textMuted }}
                  >
                    {excerpt}
                  </p>
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </div>
  );
}