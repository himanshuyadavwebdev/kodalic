import Link from "next/link";
import { createClient } from "../../lib/supabase/server";

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  status: string;
  published_at: string | null;
  category_id: string | null;
  cover_media_id: string | null;
  featured: boolean;
};

type BlogCategory = {
  id: string;
  name: string;
  slug: string;
};

function formatDate(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return `${minutes} min read`;
}

export default async function BlogIndex() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select(
      `
        slug,
        title,
        excerpt,
        content,
        status,
        published_at,
        category_id,
        cover_media_id,
        featured
      `,
    )
    .eq("status", "published")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error(
      `Failed to load blog posts: ${error.message}`,
    );
  }

  const postRows = (posts ?? []) as BlogPost[];

  const categoryIds = [
    ...new Set(
      postRows
        .map((post) => post.category_id)
        .filter(
          (id): id is string => Boolean(id),
        ),
    ),
  ];

  let categories: BlogCategory[] = [];

  if (categoryIds.length > 0) {
    const { data: categoryRows, error: categoryError } =
      await supabase
        .from("blog_categories")
        .select("id, name, slug")
        .in("id", categoryIds);

    if (categoryError) {
      throw new Error(
        `Failed to load blog categories: ${categoryError.message}`,
      );
    }

    categories = (categoryRows ?? []) as BlogCategory[];
  }

  const categoryMap = new Map(
    categories.map((category) => [
      category.id,
      category,
    ]),
  );

  return (
    <main className="min-h-screen w-full bg-background font-[Inter]">
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-16 sm:px-10 lg:px-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          ← Back to homepage
        </Link>

        <div className="mt-8 text-center">
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Blog
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Insights and guides from Kodalic.
          </p>
        </div>

        {postRows.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-black/[0.06] bg-background p-12 text-center dark:border-white/10">
            <p className="text-sm text-muted-foreground">
              No published articles yet.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {postRows.map((post) => {
              const category = post.category_id
                ? categoryMap.get(post.category_id)
                : null;

              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[20px] border border-black/[0.06] bg-background p-5 transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-offset-2 dark:border-white/10"
                >
                  <div className="relative h-40 w-full overflow-hidden rounded-xl border border-black/5 bg-[#080c1e] dark:border-white/10">
                    {post.cover_media_id ? (
                      <img
                        src={`/api/media/${post.cover_media_id}`}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-6 text-center">
                        <span className="text-sm font-medium text-white/40">
                          Kodalic
                        </span>
                      </div>
                    )}

                    {post.featured && (
                      <span className="absolute left-3 top-3 rounded-full bg-[#7357ff]/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-1 flex-col">
                    <div className="mb-2 flex items-center gap-2">
                      {category && (
                        <span className="rounded-full bg-black/5 px-2 py-1 text-xs text-muted-foreground dark:bg-white/10">
                          {category.name}
                        </span>
                      )}

                      <span className="text-xs text-muted-foreground">
                        {getReadingTime(post.content)}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold leading-tight text-foreground">
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10 text-[10px] font-semibold dark:bg-white/15">
                        KT
                      </span>

                      <span>Kodalic Team</span>

                      {post.published_at && (
                        <>
                          <span>·</span>
                          <span>
                            {formatDate(post.published_at)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}