"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DEMO_BLOG_POSTS } from "../../data/demoData";
import { Globe, Sparkles, Cog } from "lucide-react";

const iconMap: Record<string, any> = {
  AI: Sparkles,
  Automation: Cog,
  Engineering: Globe,
};

export default function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const post = DEMO_BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const Icon = iconMap[post.category] || Globe;

  return (
    <main className="min-h-screen w-full bg-background font-[Inter]">
      <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-20 pt-10 pb-16">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          ← Back to blog
        </Link>

        <span className="mt-8 inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
          DEMO ARTICLE — Replace with approved Kodalic editorial content
        </span>

        <div className="mt-4 relative h-64 w-full overflow-hidden rounded-2xl border bg-[#080c1e]" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(600px 400px at 20% 20%, rgba(79,70,229,0.18) 0%, transparent 60%), radial-gradient(400px 300px at 80% 20%, rgba(20,184,166,0.10) 0%, transparent 55%)" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background/10 border border-white/10">
              <Icon size={28} color="white" />
            </div>
          </div>
          <span className="absolute left-4 top-4 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black">DEMO ARTICLE</span>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-black/5 dark:bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{post.category}</span>
          <span className="text-xs text-muted-foreground">{post.readingTime}</span>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10 dark:bg-white/15 text-[10px] font-semibold">DA</span>
            {post.author} · {post.date}
          </span>
        </div>

        <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{post.title}</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{post.description}</p>

        <div className="prose prose-sm sm:prose-base mt-8 max-w-none text-foreground">
          <div className="whitespace-pre-wrap leading-relaxed">{post.body}</div>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-black/5 dark:border-white/10 pt-6">
          <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            ← Back to blog
          </Link>
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Back to homepage →
          </Link>
        </div>

        <div className="mt-10">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Related demo articles</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {DEMO_BLOG_POSTS.filter((p) => p.slug !== slug)
              .slice(0, 2)
              .map((related) => (
                  <Link key={related.slug} href={`/blog/${related.slug}`} className="rounded-xl border border-black/[0.06] dark:border-white/10 bg-background p-4 hover:border-black/10 dark:hover:border-white/20">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{related.category}</div>
                  <div className="mt-1 text-sm font-semibold text-foreground">{related.title}</div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
