"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./pages/Hero";
import About from "./pages/About";
import Services from "./pages/Services";
import CaseStudyListing from "./pages/caseStudyListing";
import ContactUs from "./pages/contactUs";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import Footer from "./components/Footer";
// Light mode corner colors
const LIGHT_COLORS = {
  topLeft: "rgba(251, 240, 240, 1)",
  topRight: "rgba(245, 236, 236, 1)",
  bottomLeft: "rgba(255, 255, 255, 1)",
  bottomRight: "rgba(255, 255, 255, 1)",
};

// Dark mode corner colors — set these to whatever you want
const DARK_COLORS = {
  topRight: "rgba(70, 7, 99, 1)",
  topLeft: "rgba(32, 7, 32, 1)",
  bottomLeft: "rgba(10, 15, 30, 1)",
  bottomRight: "rgba(15, 20, 40, 1)",
};

export default function Home() {
  const dotsRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
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
        backgroundColor: isDark ? "#0a0a0a" : "#ffffff",
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
          backgroundImage: `radial-gradient(${isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)"
            } 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          opacity: 0.9,
          transition: "background-position 0.2s ease-out, background-image 0.5s ease",
          zIndex: 0,
          pointerEvents: "none",
          transform: "translate3d(0,0,0)",
          willChange: "transform",
        }}
      />

      <Navbar />

      {/* Logo */}
      <img
        src="/logo.png"
        alt="Logo"
        className="fixed top-8 left-6 h-13 w-auto object-contain z-[100] rounded-[40px]"
      />

      {/* Page content goes here */}
      <div id="home">
        <Hero isDark={isDark} />
      </div>
      <div id="about">
        <About isDark={isDark} />
      </div>
      <div id="services">
        <Services isDark={isDark} />
      </div>
      <div id="case-studies">
        <CaseStudyListing isDark={isDark} />
      </div>
      <div id="blog">
        <Blog isDark={isDark} />
      </div>
      <div id="faq">
        <FAQ isDark={isDark} />
      </div>
      <div id="contact">
        <ContactUs isDark={isDark} />
      </div>
    </div>

    {/* Reserves exactly as much scroll space as the footer's real height,
        so the footer (fixed at the viewport bottom, zIndex 1, behind this
        whole content layer at zIndex 2) only becomes visible once the
        page scrolls into this empty region — the "curtain reveal". */}
    <div style={{ height: footerHeight }} aria-hidden="true" />

    <Footer isDark={isDark} onHeightChange={setFooterHeight} onToggleDark={() => setIsDark((prev) => !prev)} />
    </>
  );
}