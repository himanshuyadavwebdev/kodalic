"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DEMO_BLOG_POSTS } from "../../data/demoData";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleCheck,
  Clock3,
  Globe,
  Lightbulb,
  ListChecks,
  Minus,
  Sparkles,
  Cog,
} from "lucide-react";

type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[]; ordered: boolean }
  | { type: "table"; rows: string[][] }
  | { type: "callout"; text: string }
  | { type: "faq"; question: string; answer: string };

const iconMap: Record<string, typeof Globe> = {
  AI: Sparkles,
  Automation: Cog,
  Engineering: Globe,
};

const headingLabels = new Set([
  "Quick Answer",
  "FAQ",
  "What to do next",
]);

function cleanListItem(value: string) {
  return value
    .replace(/^[•●·]\s*/, "")
    .replace(/^\d+\.\s*/, "")
    .trim();
}

function isListItem(value: string) {
  return /^[•●·]\s+/.test(value) || /^\d+\.\s+/.test(value);
}

function isLikelyHeading(value: string, next?: string) {
  if (headingLabels.has(value)) return true;
  if (!next) return false;
  if (value.length > 76 || /[.!?]$/.test(value) || value.includes("|")) return false;
  if (isListItem(value) || value.startsWith("💡")) return false;
  return next.length > 55 && !isListItem(next) && !next.includes("|");
}


function parseArticleBody(body: string): ContentBlock[] {
  const chunks = body
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  const blocks: ContentBlock[] = [];
  let i = 0;
  let faqMode = false;

  while (i < chunks.length) {
    const current = chunks[i];
    const next = chunks[i + 1];

    if (current === "FAQ") {
      faqMode = true;
      blocks.push({ type: "heading", text: current });
      i += 1;
      continue;
    }

    if (faqMode && next && current.length < 120 && !isListItem(current) && !next.startsWith("💡")) {
      blocks.push({ type: "faq", question: current, answer: next });
      i += 2;
      continue;
    }

    if (current.startsWith("💡")) {
      blocks.push({ type: "callout", text: current.replace(/^💡\s*/, "") });
      i += 1;
      continue;
    }

    if (current.includes("|")) {
      const rows: string[][] = [];
      while (i < chunks.length && chunks[i].includes("|")) {
        rows.push(chunks[i].split("|").map((cell) => cell.trim()));
        i += 1;
      }
      blocks.push({ type: "table", rows });
      continue;
    }

    if (isListItem(current)) {
      const ordered = /^\d+\.\s+/.test(current);
      const items: string[] = [];
      while (i < chunks.length && isListItem(chunks[i])) {
        items.push(cleanListItem(chunks[i]));
        i += 1;
      }
      blocks.push({ type: "list", items, ordered });
      continue;
    }

    if (isLikelyHeading(current, next)) {
      blocks.push({ type: "heading", text: current });
      i += 1;
      continue;
    }

    blocks.push({ type: "paragraph", text: current });
    i += 1;
  }

  return blocks;
}

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const timer = window.setTimeout(() => setVisible(true), delay);
        observer.unobserve(entry.target);
        return () => window.clearTimeout(timer);
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={elementRef} className={visible ? "article-reveal article-reveal-visible" : "article-reveal"}>
      {children}
    </div>
  );
}

function ArticleProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return <div className="article-progress" style={{ transform: `scaleX(${progress / 100})` }} />;
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`faq-item ${open ? "faq-item-open" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left sm:px-6"
        aria-expanded={open}
      >
        <span className="text-base font-semibold leading-snug text-foreground sm:text-lg">{question}</span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground transition-transform duration-300">
          {open ? <Minus size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      <div className={open ? "faq-answer faq-answer-open" : "faq-answer"} aria-hidden={!open}>
        <div className="faq-answer-inner text-[15px] leading-8 text-muted-foreground">{answer}</div>
      </div>
    </div>
  );
}

export default function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const post = DEMO_BLOG_POSTS.find((p) => p.slug === slug);
  const blocks = useMemo(() => (post ? parseArticleBody(post.body) : []), [post]);

  if (!post) notFound();

  const Icon = iconMap[post.category] || Globe;
  const firstParagraphIndex = blocks.findIndex((block) => block.type === "paragraph");
  const related = DEMO_BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <main className="min-h-screen overflow-hidden bg-background font-[Inter] text-foreground">
      <ArticleProgress />

      <style jsx global>{`
        .article-progress {
          position: fixed;
          inset: 0 auto auto 0;
          z-index: 80;
          height: 3px;
          width: 100%;
          transform-origin: left;
          background: linear-gradient(90deg, #4f46e5, #14b8a6, #818cf8);
          box-shadow: 0 0 20px rgba(79, 70, 229, 0.55);
        }
        .article-reveal {
          opacity: 0;
          transform: translateY(28px) scale(0.985);
          filter: blur(5px);
          transition: opacity 800ms cubic-bezier(.16,1,.3,1), transform 800ms cubic-bezier(.16,1,.3,1), filter 800ms ease;
        }
        .article-reveal-visible { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        .hero-pop { animation: heroPop 900ms cubic-bezier(.16,1,.3,1) both; }
        .hero-title { animation: titleIn 900ms 130ms cubic-bezier(.16,1,.3,1) both; }
        .hero-copy { animation: titleIn 900ms 240ms cubic-bezier(.16,1,.3,1) both; }
        .hero-meta { animation: titleIn 800ms 360ms cubic-bezier(.16,1,.3,1) both; }
        .hero-orb-one { animation: driftOne 9s ease-in-out infinite alternate; }
        .hero-orb-two { animation: driftTwo 11s ease-in-out infinite alternate; }
        .icon-float { animation: iconFloat 4s ease-in-out infinite; }
        .faq-answer { display: grid; grid-template-rows: 0fr; max-height: 0; overflow: hidden; opacity: 0; visibility: hidden; transition: grid-template-rows 350ms ease, max-height 350ms ease, opacity 220ms ease, visibility 0s linear 350ms; }
        .faq-answer-inner { min-height: 0; overflow: hidden; padding: 0 1.25rem; transform: translateY(-6px); transition: padding 350ms ease, transform 350ms ease; }
        .faq-answer-open { grid-template-rows: 1fr; max-height: 1200px; opacity: 1; visibility: visible; transition: grid-template-rows 350ms ease, max-height 350ms ease, opacity 260ms ease, visibility 0s; }
        .faq-answer-open .faq-answer-inner { padding-bottom: 1.25rem; transform: translateY(0); }
        @media (min-width: 640px) { .faq-answer-inner { padding-left: 1.5rem; padding-right: 1.5rem; } .faq-answer-open .faq-answer-inner { padding-bottom: 1.5rem; } }
        .faq-item { border: 1px solid color-mix(in srgb, var(--border) 90%, transparent); border-radius: 1rem; background: color-mix(in srgb, var(--background) 96%, #4f46e5 4%); transition: border-color .3s ease, transform .3s ease, box-shadow .3s ease; }
        .faq-item:hover { transform: translateY(-2px); box-shadow: 0 18px 45px rgba(15, 23, 42, .06); }
        .faq-item-open { border-color: rgba(79, 70, 229, .25); }
        @keyframes heroPop { from { opacity: 0; transform: translateY(22px) scale(.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes titleIn { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes driftOne { from { transform: translate3d(-2%, -3%, 0) scale(1); } to { transform: translate3d(7%, 6%, 0) scale(1.15); } }
        @keyframes driftTwo { from { transform: translate3d(4%, 3%, 0) scale(1.05); } to { transform: translate3d(-7%, -6%, 0) scale(.94); } }
        @keyframes iconFloat { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-8px) rotate(4deg); } }
        @media (prefers-reduced-motion: reduce) {
          .article-reveal, .article-reveal-visible, .hero-pop, .hero-title, .hero-copy, .hero-meta, .hero-orb-one, .hero-orb-two, .icon-float { animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; filter: none !important; }
        }
      `}</style>

      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-8 sm:px-8 lg:px-12 lg:pt-12">
        <ScrollReveal>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition-transform duration-300 group-hover:-translate-x-1">
              <ArrowLeft size={16} />
            </span>
            Back to blog
          </Link>
        </ScrollReveal>

        <section className="hero-pop relative mt-7 overflow-hidden rounded-[2rem] border border-border/80 bg-[#0a1024] px-6 py-10 text-white shadow-[0_30px_100px_rgba(15,23,42,0.16)] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(79,70,229,0.24),transparent_42%,rgba(20,184,166,0.12))]" />
          <div className="hero-orb-one absolute -left-20 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="hero-orb-two absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]" />

          <div className="relative max-w-4xl">
            <div className="hero-meta flex flex-wrap items-center gap-3 text-xs font-medium text-white/65">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
                {post.category}
              </span>
              <span className="inline-flex items-center gap-1.5"><Clock3 size={14} /> {post.readingTime}</span>
              <span className="hidden h-1 w-1 rounded-full bg-white/40 sm:block" />
              <span>{post.date}</span>
            </div>

            <div className="mt-8 flex items-start justify-between gap-6">
              <div>
                <h1 className="hero-title max-w-4xl font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                  {post.title}
                </h1>
                <p className="hero-copy mt-6 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
                  {post.description}
                </p>
              </div>
              <div className="icon-float hidden shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-md sm:flex">
                <Icon size={28} className="text-white" />
              </div>
            </div>

            <div className="hero-meta mt-8 flex items-center gap-3 text-sm text-white/65">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-[10px] font-bold text-white">DA</span>
              <span>Written by <strong className="font-medium text-white/90">{post.author}</strong></span>
            </div>
          </div>
        </section>

        <div className="mx-auto mt-10 grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_180px]">
          <article className="min-w-0">
            {blocks.map((block, index) => {
              if (block.type === "paragraph") {
                const isLead = index === firstParagraphIndex;
                return (
                  <ScrollReveal key={`p-${index}`} delay={Math.min(index * 25, 180)}>
                    <p className={isLead ? "mb-8 border-l-2 border-indigo-500 pl-5 text-lg leading-9 text-foreground/85 sm:text-xl" : "mb-6 text-[15px] leading-8 text-foreground/80 sm:text-base"}>
                      {block.text}
                    </p>
                  </ScrollReveal>
                );
              }

              if (block.type === "heading") {
                const special = ["Quick Answer", "FAQ", "What to do next"].includes(block.text);
                return (
                  <ScrollReveal key={`h-${index}`}>
                    <div className={special ? "mb-5 mt-12 flex items-center gap-3" : "mb-4 mt-10"}>
                      {special && <span className="h-8 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-cyan-400" />}
                      <h2 className={special ? "text-2xl font-bold tracking-tight sm:text-3xl" : "text-xl font-semibold tracking-tight sm:text-2xl"}>{block.text}</h2>
                    </div>
                  </ScrollReveal>
                );
              }

              if (block.type === "callout") {
                return (
                  <ScrollReveal key={`callout-${index}`}>
                    <div className="my-8 rounded-2xl border border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.08] via-background to-cyan-500/[0.06] p-5 sm:p-6">
                      <div className="flex gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"><Lightbulb size={20} /></span>
                        <div><p className="text-sm font-semibold uppercase tracking-[0.12em] text-indigo-600 dark:text-indigo-300">Worth remembering</p><p className="mt-2 leading-7 text-foreground/80">{block.text.replace(/^Worth remembering\s*/i, "")}</p></div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              }

              if (block.type === "list") {
                return (
                  <ScrollReveal key={`list-${index}`}>
                    <div className="my-7 grid gap-3">
                      {block.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="group flex items-start gap-3 rounded-xl border border-border/70 bg-background/70 px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/[0.04]">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                            {block.ordered ? <span className="text-xs font-bold">{itemIndex + 1}</span> : <Check size={14} strokeWidth={2.5} />}
                          </span>
                          <span className="leading-7 text-foreground/80">{item}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollReveal>
                );
              }

              if (block.type === "table") {
                const [header, ...rows] = block.rows;
                return (
                  <ScrollReveal key={`table-${index}`}>
                    <div className="my-8 overflow-hidden rounded-2xl border border-border bg-background shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[580px] border-collapse text-left text-sm">
                          <thead className="bg-gradient-to-r from-indigo-500/[0.09] to-cyan-500/[0.07] text-foreground">
                            <tr>{header.map((cell, cellIndex) => <th key={cellIndex} className="px-5 py-4 font-semibold">{cell}</th>)}</tr>
                          </thead>
                          <tbody>
                            {rows.map((row, rowIndex) => (
                              <tr key={rowIndex} className="border-t border-border/70 transition-colors hover:bg-indigo-500/[0.025]">
                                {row.map((cell, cellIndex) => <td key={cellIndex} className="px-5 py-4 leading-6 text-foreground/75">{cell}</td>)}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              }

              if (block.type === "faq") {
                return (
                  <ScrollReveal key={`faq-${index}`}>
                    <div className="mb-3"><FaqItem question={block.question} answer={block.answer} /></div>
                  </ScrollReveal>
                );
              }

              return null;
            })}
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl border border-border bg-background/80 p-5 shadow-sm backdrop-blur-sm">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"><ListChecks size={15} /> Article</p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                <p>{post.readingTime}</p>
                <div className="h-px bg-border" />
                <p>Scroll to explore the full guide.</p>
                <div className="flex items-center gap-2 pt-1 text-foreground/75"><CircleCheck size={16} className="text-indigo-500" /> Updated for 2026</div>
              </div>
            </div>
          </aside>
        </div>

        <ScrollReveal>
          <section className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-[1.75rem] border border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.10] via-background to-cyan-500/[0.07] p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600 dark:text-indigo-300">Connect with us</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Let&apos;s figure out the next step.</h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  Not sure what to do next? Connect with us, tell us what you have in mind, and we&apos;ll help you figure out the next step.
                </p>
              </div>
              <Link
                href="/#contact"
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Connect with us
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="mx-auto mt-16 max-w-5xl rounded-[1.75rem] border border-border bg-gradient-to-br from-indigo-500/[0.07] via-background to-cyan-500/[0.06] p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600 dark:text-indigo-300">Keep reading</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight">More from the Kodalic blog</h3>
              </div>
              <Link href="/blog" className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground">View all articles <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {related.map((item) => (
                <Link key={item.slug} href={`/blog/${item.slug}`} className="group rounded-2xl border border-border bg-background p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/[0.05]">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{item.category}</p>
                  <p className="mt-2 font-semibold leading-6 text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-300">{item.title}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">Read article <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></div>
                </Link>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mx-auto mt-10 flex max-w-5xl flex-row items-center justify-between gap-3 border-t border-border pt-6 text-sm">
            <Link href="/blog" className="group inline-flex items-center gap-2 font-medium text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Back to blog</Link>
            <Link href="/" className="group inline-flex items-center gap-2 font-medium text-muted-foreground transition-colors hover:text-foreground">Back to homepage <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
