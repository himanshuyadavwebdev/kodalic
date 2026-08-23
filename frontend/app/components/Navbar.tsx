"use client";

import { useState, useEffect } from "react";

const NAV_MAP = [
  { label: "Home", id: "home" },
  { label: "About us", id: "about" },
  { label: "Services", id: "services" },
  { label: "Case Studies", id: "case-studies" },
  { label: "Blog", id: "blog" },
  { label: "Contact", id: "contact" },
];

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");

  useEffect(() => {
    const ids = ["home", "about", "services", "case-studies", "blog", "contact"];
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const matched = NAV_MAP.find((link) => link.id === entry.target.id);
            if (matched) {
              setActiveSection(matched.label);
            }
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setNavOpen(false);
  };

  return (
    <header className="fixed top-6 right-4 sm:top-10 sm:right-12 lg:right-20 z-50 font-[Inter]">
      <div className="relative h-12 sm:h-16">
        <div
          className="absolute top-0 right-0 w-[260px] sm:w-[260px] bg-neutral-900/65 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ease-out"
          style={{
            maxHeight: navOpen ? "500px" : "64px",
            transform: "translate3d(0,0,0)",
            willChange: "max-height, transform",
          }}
        >
          <button
            onClick={() => setNavOpen((prev) => !prev)}
            className="flex h-[64px] w-full items-center justify-between gap-4 pl-6 sm:pl-7 pr-6 sm:pr-8 text-white"
          >
            <span className="text-base sm:text-xl font-normal">{activeSection}</span>
            <div
              className="relative h-6 w-6 shrink-0 transition-transform duration-300 ease-in-out"
              style={{
                transform: navOpen ? "rotate(45deg)" : "rotate(0deg)",
              }}
            >
              {/* Vertical bar */}
              <span
                className="absolute left-1/2 top-1/2 h-6 w-[2px] -translate-x-1/2 -translate-y-1/2 bg-current"
              />

              {/* Horizontal bar */}
              <span
                className="absolute left-1/2 top-1/2 h-[2px] w-6 -translate-x-1/2 -translate-y-1/2 bg-current"
              />
            </div>
          </button>

          <div
            className="flex flex-col gap-1 pl-6 sm:pl-7 pr-6 sm:pr-8 transition-all duration-300 ease-out overflow-hidden"
            style={{
              maxHeight: navOpen ? "400px" : "0px",
              paddingBottom: navOpen ? "20px" : "0px",
              opacity: navOpen ? 1 : 0,
            }}
          >
            {NAV_MAP.map((link) => (
              <a
                key={link.label}
                href={`#${link.id}`}
                onClick={(e) => handleClick(e, link.id)}
                className={`text-sm sm:text-lg font-normal py-1.5 transition-colors ${
                  activeSection === link.label
                    ? "text-white underline underline-offset-4"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;