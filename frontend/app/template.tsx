"use client";

import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="animate-[fadeIn_260ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none will-change-[opacity]">
      {children}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          div[class*="animate-[fadeIn"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
