import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DemoSocialPage({ params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  const name = platform.charAt(0).toUpperCase() + platform.slice(1);

  return (
    <main className="min-h-screen w-full bg-background font-[Inter] flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
        DEMO SOCIAL LINK
      </span>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Demo {name}</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Replace this route with the verified Kodalic social profile for {name}. This is a demo placeholder for design testing — not a real social profile.
      </p>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/85">
        Back to homepage →
      </Link>
    </main>
  );
}
