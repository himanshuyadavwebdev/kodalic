import { createClient } from "../supabase/server";

export async function getPublicBlogPostsForSitemap() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, published_at, updated_at")
    .eq("status", "published")
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString());
  if (error) throw error;
  return data ?? [];
}
