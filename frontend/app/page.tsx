"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./pages/Hero";
import About from "./pages/About";
import Services from "./pages/Services";
// Light mode corner colors
const LIGHT_COLORS = {
  topLeft: "rgba(255, 229, 235, 1)",
  topRight: "rgba(255, 255, 255, 1)",
  bottomLeft: "rgba(255, 255, 255, 1)",
  bottomRight: "rgba(228, 247, 252, 1)",
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
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
        overflowY: "visible",
        backgroundColor: isDark ? "#0a0a0a" : "#ffffff",
        transition: "background-color 0.5s ease",
      }}
    >
      {/* Blended 4-color corners */}
      <div
        style={{
          position: "fixed",
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
          position: "fixed",
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

      {/* Theme toggle button */}
      <button
        onClick={() => setIsDark((prev) => !prev)}
        aria-label="Toggle dark mode"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          backgroundColor: "#ffffff",
          boxShadow: isDark
            ? "0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)"
            : "0 4px 16px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "box-shadow 0.3s ease, transform 0.2s ease",
          zIndex: 100,
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "scale(0.92)";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {isDark ? (
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4a5568" />
                <stop offset="100%" stopColor="#1a202c" />
              </linearGradient>
            </defs>
            <path
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 1020.354 15.354z"
              fill="url(#moonGradient)"
            />
            <circle cx="14.5" cy="9.5" r="1" fill="#2d3748" opacity="0.6" />
            <circle cx="17" cy="14" r="0.7" fill="#2d3748" opacity="0.5" />
            <circle cx="12.5" cy="14.5" r="0.5" fill="#2d3748" opacity="0.5" />
          </svg>
        ) : (
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFE066" />
                <stop offset="100%" stopColor="#FFA500" />
              </radialGradient>
            </defs>
            <circle cx="12" cy="12" r="5" fill="url(#sunGradient)" />
            <g stroke="#FFA500" strokeWidth="1.8" strokeLinecap="round">
              <line x1="12" y1="1.5" x2="12" y2="4" />
              <line x1="12" y1="20" x2="12" y2="22.5" />
              <line x1="1.5" y1="12" x2="4" y2="12" />
              <line x1="20" y1="12" x2="22.5" y2="12" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </g>
          </svg>
        )}
      </button>

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
    </div>
  );
}