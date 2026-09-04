import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#080c1e] px-6 py-16 font-[Inter] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#080c1e]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(600px 400px at 20% 15%, rgba(79,70,229,0.16) 0%, transparent 60%), radial-gradient(500px 380px at 85% 10%, rgba(20,184,166,0.08) 0%, transparent 55%)",
          }}
        />
      </div>

      <div className="relative flex flex-col items-center text-center">
        <Link href="/" className="mb-10 flex items-center gap-2 focus-visible:outline-offset-4" aria-label="Kodalic — home">
          <img src="/logo.png" alt="Kodalic" className="h-8 w-8 rounded-lg object-contain" />
          <span className="text-[17px] font-semibold tracking-[-0.02em] text-white">Kodalic</span>
        </Link>

        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium tracking-wide text-white/80 backdrop-blur"
          aria-hidden="true"
        >
          404
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight max-w-xl">Page not found</h1>
        <p className="mt-4 max-w-md text-sm sm:text-base leading-relaxed text-white/60">
          The page you&apos;re looking for doesn&apos;t exist or was moved. Let&apos;s get you back to where you need to be.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#0a0a0a] shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_14px_36px_rgba(0,0,0,0.28)] active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60 focus-visible:outline-offset-2 motion-reduce:transition-none motion-reduce:hover:transform-none"
        >
          Back to homepage <span aria-hidden>→</span>
        </Link>

        <p className="mt-8 text-xs text-white/40">If you believe this is an error, please contact us via the homepage.</p>
      </div>
    </main>
  );
}
