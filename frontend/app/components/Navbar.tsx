"use client";

import { useEffect, useState, useRef } from "react";

const NAV_MAP = [
  { label: "Home", id: "home" },
  { label: "About us", id: "about" },
  { label: "Services", id: "services" },
  { label: "Case Studies", id: "case-studies" },
  { label: "Blog", id: "blog" },
  { label: "Contact", id: "contact" },
];

interface NavbarProps {
  isDark?: boolean;
}

export default function Navbar({ isDark = false }: NavbarProps) {
  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_MAP.map((n) => n.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (navOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const panel = panelRef.current;
      const trigger = closeBtnRef.current;
      const focusable = panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      focusable?.[0]?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setNavOpen(false);
          trigger?.focus();
          return;
        }
        if (e.key === "Tab" && panel && focusable && focusable.length > 0) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = prev;
        window.removeEventListener("keydown", onKey);
      };
    } else {
      const trigger = closeBtnRef.current;
      if (document.activeElement instanceof HTMLElement && panelRef.current?.contains(document.activeElement)) {
        trigger?.focus();
      }
    }
  }, [navOpen]);

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  const handleQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  const isTransparent = !scrolled && !navOpen;

  const headerBg = isTransparent
    ? "bg-transparent border-transparent"
    : isDark
    ? "bg-[#0a0a0f]/70 backdrop-blur-[16px] border-white/[0.08] shadow-[0_1px_0_0_rgba(255,255,255,0.06)]"
    : "bg-white/72 backdrop-blur-[16px] border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.03)]";

  const linkBase = "relative inline-flex items-center py-2 text-[14px] font-[450] tracking-[-0.01em] transition-colors duration-200";
  const linkColor = isTransparent
    ? "text-white/80 hover:text-white"
    : isDark
    ? "text-white/70 hover:text-white"
    : "text-[#161221]/65 hover:text-[#161221]";

  const activeColor = isTransparent ? "text-white" : isDark ? "text-white" : "text-[#161221]";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${headerBg}`}
      style={{
        WebkitBackdropFilter: isTransparent ? undefined : "blur(16px) saturate(180%)",
        backdropFilter: isTransparent ? undefined : "blur(16px) saturate(180%)",
      }}
    >
      <nav
        className="mx-auto max-w-[1280px] px-8 sm:px-8 lg:px-10 h-[64px] sm:h-[68px] flex items-center justify-between gap-6"
        aria-label="Primary"
      >
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "home")}
          className="flex items-center gap-2.5 shrink-0 focus-visible:outline-offset-4"
          aria-label="Kodalic — home"
        >
          <img src="/logo.png" alt="Kodalic" className="h-8 w-8 rounded-lg object-contain" />
          <span
            className={`text-[17px] font-semibold tracking-[-0.02em] hidden sm:inline ${isTransparent ? "text-white" : isDark ? "text-white" : "text-[#0a0a0a]"}`}
          >
            Kodalic
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-1">
          {NAV_MAP.map((link) => {
            const isActive = activeSection === link.id;
            const isHover = hovered === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                onMouseEnter={() => setHovered(link.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(link.id)}
                onBlur={() => setHovered(null)}
                className={`${linkBase} px-3 ${isActive ? activeColor : linkColor}`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
                <span
                  className="pointer-events-none absolute left-3 right-3 -bottom-[1px] h-px origin-left transition-[transform,opacity] duration-200"
                  style={{
                    background: isTransparent ? "white" : isDark ? "white" : "#161221",
                    transform: `scaleX(${isActive || isHover ? 1 : 0})`,
                    opacity: isActive ? 1 : isHover ? 0.7 : 0,
                  }}
                />
              </a>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center">
          <a
            href="#contact"
            onClick={handleQuote}
            className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[13.5px] font-semibold tracking-[-0.01em] transition-all duration-200 will-change-transform hover:-translate-y-px active:translate-y-0 active:scale-[0.98] focus-visible:outline-offset-2 ${
              isTransparent
                ? "bg-white text-[#0a0a0a] hover:bg-white/90"
                : isDark
                ? "bg-white text-black hover:bg-white/90"
                : "bg-[#0a0a0a] text-white hover:bg-black/85"
            }`}
            style={{
              boxShadow: isTransparent ? "0 8px 24px rgba(0,0,0,0.18)" : isDark ? "0 8px 24px rgba(0,0,0,0.3)" : "0 8px 20px rgba(0,0,0,0.10)",
            }}
          >
            Get a Quote
          </a>
        </div>

        <button
          ref={closeBtnRef}
          onClick={() => setNavOpen((v) => !v)}
          aria-expanded={navOpen}
          aria-controls="mobile-nav"
          aria-label={navOpen ? "Close menu" : "Open menu"}
          className={`lg:hidden relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 focus-visible:outline-offset-2 mr-[25px] ${
            isTransparent
              ? "border-white/15 bg-white/10 text-white hover:bg-white/15 backdrop-blur"
              : isDark
              ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
              : "border-black/10 bg-black/[0.04] text-[#0a0a0a] hover:bg-black/[0.06]"
          }`}
        >
          <span className="sr-only">Toggle menu</span>
          <span className="relative block h-4 w-4">
            <span
              className="absolute left-0 top-0 h-0.5 w-4 rounded-full bg-current transition-[transform,top,opacity] duration-200"
              style={{
                top: navOpen ? "7px" : "0px",
                transform: navOpen ? "rotate(45deg)" : "rotate(0)",
              }}
            />
            <span
              className="absolute left-0 top-[7px] h-0.5 w-4 rounded-full bg-current transition-opacity duration-150"
              style={{ opacity: navOpen ? 0 : 1 }}
            />
            <span
              className="absolute left-0 top-[14px] h-0.5 w-4 rounded-full bg-current transition-[transform,top] duration-200"
              style={{
                top: navOpen ? "7px" : "14px",
                transform: navOpen ? "rotate(-45deg)" : "rotate(0)",
              }}
            />
          </span>
        </button>
      </nav>

      <div
        id="mobile-nav"
        ref={panelRef}
        inert={navOpen ? undefined : true as unknown as boolean}
        aria-hidden={!navOpen}
        className={`lg:hidden overflow-hidden border-t transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          navOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        } ${isDark ? "bg-[#0a0a0f]/90 backdrop-blur-xl border-white/[0.06]" : "bg-white/95 backdrop-blur-xl border-black/[0.06]"}`}
        style={{
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          backdropFilter: "blur(16px) saturate(180%)",
        }}
      >
        <div className="px-6 sm:px-8 py-6 flex flex-col gap-1">
          {NAV_MAP.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium transition-colors duration-200 ${
                  isActive
                    ? isDark
                      ? "bg-white text-black"
                      : "bg-[#0a0a0a] text-white"
                    : isDark
                    ? "text-white/75 hover:bg-white/10 hover:text-white"
                    : "text-[#161221]/70 hover:bg-black/[0.04] hover:text-[#161221]"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
                <span className={`h-2 w-2 rounded-full transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`} style={{ background: isActive ? (isDark ? "black" : "white") : "transparent" }} />
              </a>
            );
          })}
          <a
            href="#contact"
            onClick={handleQuote}
            className={`mt-3 inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[15px] font-semibold transition-all duration-200 active:scale-[0.98] ${
              isDark ? "bg-white text-black hover:bg-white/90" : "bg-[#0a0a0a] text-white hover:bg-black/85"
            }`}
          >
            Get a Quote
          </a>
        </div>
      </div>
    </header>
  );
}
