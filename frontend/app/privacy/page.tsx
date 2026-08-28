import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen w-full bg-background font-[Inter]">
      <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-20 pt-10 pb-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          ← Back to homepage
        </Link>
        <div className="mt-8">
          <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
            DEMO LEGAL DOCUMENT — Replace with approved legal text
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted-foreground">DEMO CONTENT — This is placeholder legal content for design testing.</p>
        </div>
        <div className="prose prose-sm mt-8 max-w-none text-muted-foreground">
          <p>This is demo placeholder content. Replace with verified Kodalic privacy policy. No real data collection is described here.</p>
          <h2 className="text-lg font-semibold text-foreground">1. Demo Section</h2>
          <p>Placeholder text for privacy policy. Add real clauses when verified.</p>
          <h2 className="text-lg font-semibold text-foreground">2. Demo Section</h2>
          <p>More placeholder content. Ensure legal review before publishing.</p>
        </div>
          <Link href="/" className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/85">
          Back to homepage →
        </Link>
      </div>
    </main>
  );
}
