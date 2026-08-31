import { createClient } from "../supabase/server";

export type PublicBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  author_id: string | null;
  status: string;
  published_at: string | null;
  category_id: string | null;
  cover_media_id: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

export async function getPublicBlogPost(
  slug: string,
): Promise<PublicBlogPost | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      id,
      slug,
      title,
      excerpt,
      content,
      author_id,
      status,
      published_at,
      category_id,
      cover_media_id,
      featured,
      created_at,
      updated_at,
      category:blog_categories (
        id,
        name,
        slug
      )
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load blog post: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  return {
    ...data,
    category: Array.isArray(data.category)
      ? data.category[0] ?? null
      : data.category ?? null,
  } as unknown as PublicBlogPost;
}