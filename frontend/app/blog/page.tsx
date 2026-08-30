import Link from "next/link";
import { DEMO_BLOG_POSTS } from "../data/demoData";

export default function BlogIndex() {
  return (
    <main className="min-h-screen w-full bg-background font-[Inter]">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-20 pt-10 pb-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          ← Back to homepage
        </Link>

        <div className="mt-8 text-center">
          <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-foreground">Blog</h1>
          <p className="mt-3 mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground">
            Insights and guides from Kodalic.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-[20px] border border-black/[0.06] dark:border-white/10 bg-background p-4 transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-offset-2"
            >
              <div className="relative h-40 w-full overflow-hidden rounded-xl border border-black/5 bg-[#080c1e]">
                <img
                  src={post.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {post.demo && <span className="absolute left-3 top-3 rounded-full bg-amber-500/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-black">DEMO ARTICLE</span>}
              </div>
              <div className="mt-4 flex flex-1 flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-full bg-black/5 dark:bg-white/10 px-2 py-1 text-xs text-muted-foreground">{post.category}</span>
                  <span className="text-xs text-muted-foreground">{post.readingTime}</span>
                </div>
                <h2 className="text-lg font-bold leading-tight text-foreground group-hover:text-foreground">{post.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">{post.description}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10 dark:bg-white/15 text-[10px] font-semibold">DA</span>
                  {post.author} · {post.date} {post.demo && <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">DEMO</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
