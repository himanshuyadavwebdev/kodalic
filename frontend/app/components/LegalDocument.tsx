import Link from "next/link";
import type { LegalDocument as LegalDocumentType } from "../data/legalDocuments";

function getSectionLabel(section: string) {
  const match = section.match(/^((?:\d+(?:[A-Z]|\.\d+)?|[A-Z])\.)/);
  return match ? match[1] : "";
}

function formatIntro(intro: string, title: string) {
  return intro
    .replace(/^Privacy Policy:\s*Privacy Policy\s*/i, "")
    .replace(/^Terms & Conditions:\s*Terms & Conditions\s*/i, "")
    .replace(/^Cookie Policy:\s*COOKIE POLICY\s*Kodalic\s*·\s*www\.kodalic\.com\s*/i, "")
    .replace(new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*`, "i"), "")
    .trim();
}

export default function LegalDocument({ document }: { document: LegalDocumentType }) {
  const intro = formatIntro(document.intro, document.title);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-5 pb-20 pt-8 sm:px-8 sm:pt-12 lg:px-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to homepage
        </Link>

        <header className="mt-10 border-b border-border pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Kodalic legal</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
            {document.title}
          </h1>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span>Effective Date: {document.effectiveDate}</span>
            <span>Last Updated: {document.lastUpdated}</span>
          </div>
        </header>

        <div className="mt-8 rounded-2xl border border-border bg-card/60 p-5 text-[15px] leading-8 text-muted-foreground sm:p-6 sm:text-base">
          {intro}
        </div>

        <div className="mt-10 space-y-8">
          {document.sections.map((section, index) => {
            const isEnd = /^—?\s*End of /i.test(section);
            const label = getSectionLabel(section);

            return (
              <section key={index} className={isEnd ? "border-t border-border pt-8" : ""}>
                {label && (
                  <div className="mb-3 inline-flex rounded-full border border-border px-3 py-1 text-xs font-semibold tracking-wide text-muted-foreground">
                    Section {label.replace(".", "")}
                  </div>
                )}
                <p className="whitespace-pre-wrap text-[15px] leading-8 text-muted-foreground sm:text-base">
                  {section}
                </p>
              </section>
            );
          })}
        </div>

        <div className="mt-14 border-t border-border pt-8">
          <Link
            href="/"
            className="inline-flex rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
