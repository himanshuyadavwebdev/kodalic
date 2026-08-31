"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "./theme-provider";
import Navbar from "./components/Navbar";
import Hero from "./pages/Hero";
import About from "./pages/About";
import Services from "./pages/Services";
import CaseStudyListing from "./pages/caseStudyListing";
import ContactUs from "./pages/contactUs";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import Footer from "./components/Footer";
import TechMarquee from "./components/TechMarquee";
import Testimonials from "./components/Testimonials";
import ScrollProgress from "./components/ScrollProgress";

// Light mode corner colors
const LIGHT_COLORS = {
  topLeft: "rgba(251, 240, 240, 1)",
  topRight: "rgba(245, 236, 236, 1)",
  bottomLeft: "rgba(255, 255, 255, 1)",
  bottomRight: "rgba(255, 255, 255, 1)",
};

// Dark mode corner colors — deep navy / near-black only (no purple/maroon)
const DARK_COLORS = {
  topRight: "rgba(14, 20, 45, 1)",
  topLeft: "rgba(10, 15, 35, 1)",
  bottomLeft: "rgba(8, 8, 12, 1)",
  bottomRight: "rgba(10, 12, 26, 1)",
};

import type { PublicBlogPost } from "./../lib/blog/get-public-blog-posts";

type HomeClientProps = {
  blogPosts: PublicBlogPost[];
};

export default function HomeClient({ blogPosts }: HomeClientProps) {
  const dotsRef = useRef<HTMLDivElement>(null);
  const { isDark, toggleDark } = useTheme();
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;

      const moveX = x * 20;
      const moveY = y * 20;

      if (dotsRef.current) {
        dotsRef.current.style.backgroundPosition = `${moveX}px ${moveY}px`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const cornerColors = isDark ? DARK_COLORS : LIGHT_COLORS;

  return (
    <>
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          // Sits above the fixed Footer (zIndex 1) so this opaque content
          // layer fully covers it while scrolling — the footer is only
          // revealed once the page reaches the spacer at the very end,
          // producing the "curtain reveal" effect.
          zIndex: 2,
          // NOTE: don't set overflowX/overflowY here. Per the CSS Overflow
          // spec, if overflow-x is anything other than "visible" while
          // overflow-y is explicitly "visible", the browser silently
          // promotes overflow-y to "auto" too — turning this div into its
          // OWN scrollable box, layered on top of the real document scroll.
          // That's what was producing a second scrollbar across every
          // section (not just Blog). Horizontal overflow is handled at the
          // html/body level in globals.css instead, which doesn't have this
          // problem since it controls the actual viewport scrollbar rather
          // than creating a nested one.
          backgroundColor: isDark ? "#0a0f1e" : "#ffffff",
          transition: "background-color 0.5s ease",
        }}
      >
        {/* Blended 4-color corners */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
            radial-gradient(circle at 0% 0%, ${cornerColors.topLeft} 0%, transparent 55%),
            radial-gradient(circle at 100% 0%, ${cornerColors.topRight} 0%, transparent 55%),
            radial-gradient(circle at 0% 100%, ${cornerColors.bottomLeft} 0%, transparent 55%),
            radial-gradient(circle at 100% 100%, ${cornerColors.bottomRight} 0%, transparent 55%)
          `,
            filter: "blur(40px)",
            transition: "background-image 0.5s ease",
            zIndex: 0,
            pointerEvents: "none",
            transform: "translate3d(0,0,0)",
            willChange: "transform",
          }}
        />

        {/* Dotted overlay - moves with mouse */}
        <div
          ref={dotsRef}
          style={{
            position: "absolute",
            inset: "-40px",
            backgroundImage: `radial-gradient(${
              isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)"
            } 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
            opacity: 0.9,
            transition:
              "background-position 0.2s ease-out, background-image 0.5s ease",
            zIndex: 0,
            pointerEvents: "none",
            transform: "translate3d(0,0,0)",
            willChange: "transform",
          }}
        />

        <Navbar isDark={isDark} />
        <ScrollProgress />

        {/* Page content goes here */}
        <div id="home" style={{ scrollMarginTop: "28px" }}>
          <Hero isDark={isDark} />
        </div>
        <div id="about" style={{ scrollMarginTop: "28px" }}>
          <About isDark={isDark} />
        </div>
        <TechMarquee isDark={isDark} />
        <div id="services" style={{ scrollMarginTop: "-80px" }}>
          <Services isDark={isDark} />
        </div>
        <div id="case-studies" style={{ scrollMarginTop: "0px" }}>
          <CaseStudyListing isDark={isDark} />
        </div>
        <Testimonials isDark={isDark} />
        <div id="blog" style={{ scrollMarginTop: "-60px" }}>
          <Blog isDark={isDark} posts={blogPosts} />
        </div>
        <div id="faq" style={{ scrollMarginTop: "28px" }}>
          <FAQ isDark={isDark} />
        </div>
        <div id="contact" style={{ scrollMarginTop: "-40px" }}>
          <ContactUs isDark={isDark} />
        </div>
      </div>

      {/* Reserves exactly as much scroll space as the footer's real height,
        so the footer (fixed at the viewport bottom, zIndex 1, behind this
        whole content layer at zIndex 2) only becomes visible once the
        page scrolls into this empty region — the "curtain reveal". */}
      <div
        className="hidden sm:block"
        style={{ height: footerHeight }}
        aria-hidden="true"
      />

      <Footer
        isDark={isDark}
        onHeightChange={setFooterHeight}
        onToggleDark={toggleDark}
      />
    </>
  );
}
