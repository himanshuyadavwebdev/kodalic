import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "../../seo";

import { getPublicBlogPost } from "../../../lib/blog/get-public-blog-post";

 

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
    month: "long",
    year: "numeric",
  }).format(date);
}

function getReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return `${minutes} min read`;
}

function renderContent(content: string) {
  const blocks = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const firstLine = lines[0];

    if (
      firstLine &&
      firstLine !== "FAQ" &&
      !firstLine.includes("|") &&
      lines.length === 1 &&
      !firstLine.endsWith(".") &&
      !firstLine.startsWith("-") &&
      !/^\d+\./.test(firstLine) &&
      firstLine.length < 100
    ) {
      return (
        <h2
          key={index}
          className="mt-10 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          {firstLine}
        </h2>
      );
    }

    if (lines.every((line) => line.startsWith("- "))) {
      return (
        <ul
          key={index}
          className="my-5 list-disc space-y-2 pl-6 text-base leading-8 text-muted-foreground"
        >
          {lines.map((line, lineIndex) => (
            <li key={lineIndex}>
              {line.slice(2)}
            </li>
          ))}
        </ul>
      );
    }

    if (lines.every((line) => /^\d+\.\s/.test(line))) {
      return (
        <ol
          key={index}
          className="my-5 list-decimal space-y-2 pl-6 text-base leading-8 text-muted-foreground"
        >
          {lines.map((line, lineIndex) => (
            <li key={lineIndex}>
              {line.replace(/^\d+\.\s*/, "")}
            </li>
          ))}
        </ol>
      );
    }

    if (lines.every((line) => line.includes("|"))) {
      const rows = lines.map((line) =>
        line
          .split("|")
          .map((cell) => cell.trim()),
      );

      return (
        <div
          key={index}
          className="my-6 overflow-x-auto rounded-2xl border border-black/[0.06] dark:border-white/10"
        >
          <table className="w-full min-w-[600px] text-left text-sm">
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={
                    rowIndex === 0
                      ? "border-b border-black/[0.08] bg-black/[0.03] font-semibold dark:border-white/10 dark:bg-white/[0.04]"
                      : "border-b border-black/[0.06] last:border-b-0 dark:border-white/10"
                  }
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-3 align-top text-muted-foreground"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <p
        key={index}
        className="my-5 text-base leading-8 text-muted-foreground"
      >
        {lines.join(" ")}
      </p>
    );
  });
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicBlogPost(slug);
  if (!post) {
    return { title: "Article Not Found", robots: { index: false, follow: false, googleBot: { index: false, follow: false } } };
  }
  const description = post.excerpt || post.content.replace(/\s+/g, " ").slice(0, 155);
  const canonical = `/blog/${encodeURIComponent(post.slug)}`;
  return {
    title: post.title,
    description,
    alternates: { canonical },
    openGraph: { type: "article", url: canonical, title: post.title, description, publishedTime: post.published_at || undefined, modifiedTime: post.updated_at || undefined },
    twitter: { card: "summary_large_image", title: post.title, description },
  };
}

export default async function BlogPostPage({
  params,
}: PageProps) {
  const { slug } = await params;

   const blogPost = await getPublicBlogPost(slug);

  if (!blogPost) {
    notFound();
  }

  const category = blogPost.category;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: blogPost.title, item: `${SITE_URL}/blog/${encodeURIComponent(blogPost.slug)}` },
    ],
  };

  return (
    <main className="min-h-screen w-full bg-background font-[Inter]">
      <article className="mx-auto max-w-4xl px-6 pb-20 pt-10 sm:px-10 lg:px-12">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BlogPosting", headline: blogPost.title, description: blogPost.excerpt || undefined, datePublished: blogPost.published_at || undefined, dateModified: blogPost.updated_at || blogPost.published_at || undefined, mainEntityOfPage: `${SITE_URL}/blog/${blogPost.slug}`, author: { "@type": "Organization", name: SITE_NAME }, publisher: { "@type": "Organization", name: SITE_NAME } }) }} />
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          ← Back to Blog
        </Link>

        <header className="mt-10">
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-muted-foreground dark:bg-white/10">
                {category.name}
              </span>
            )}

            {blogPost.featured && (
              <span className="rounded-full bg-[#7357ff]/10 px-3 py-1 text-xs font-medium text-[#7357ff]">
                Featured
              </span>
            )}

            <span className="text-xs text-muted-foreground">
              {getReadingTime(blogPost.content)}
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {blogPost.title}
          </h1>

          {blogPost.excerpt && (
            <p className="mt-5 text-lg leading-8 text-muted-foreground sm:text-xl">
              {blogPost.excerpt}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-[11px] font-semibold dark:bg-white/15">
              KT
            </span>

            <span>Kodalic Team</span>

            {blogPost.published_at && (
              <>
                <span>·</span>
                <span>
                  {formatDate(blogPost.published_at)}
                </span>
              </>
            )}
          </div>
        </header>

        <div className="mt-12 rounded-3xl border border-black/[0.06] bg-black/[0.02] p-6 dark:border-white/10 dark:bg-white/[0.02] sm:p-10">
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            {renderContent(blogPost.content)}
          </div>
        </div>

        <div className="mt-12 border-t border-black/[0.06] pt-8 dark:border-white/10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            ← Read more articles
          </Link>
        </div>
      </article>
    </main>
  );
}