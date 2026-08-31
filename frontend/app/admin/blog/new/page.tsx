import Link from "next/link";

import { requirePermission } from "../../../../lib/auth/require-permission";
import { getAdminBlogOptions } from "../../../../lib/auth/get-admin-blog-options";
import { createClient } from "../../../../lib/supabase/server";
import BlogCreateForm from "../../../../components/admin/blog-create-form";

export default async function NewBlogPostPage() {
  await requirePermission("blog.create");

  const [{ categories, tags }, supabase] = await Promise.all([
    getAdminBlogOptions(),
    createClient(),
  ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-[#080c1e] px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/blog"
          className="text-sm text-white/50 transition hover:text-white"
        >
          ← Back to Blog
        </Link>

        <div className="mt-8">
          <p className="text-sm text-white/50">
            Blog
          </p>

          <h1 className="mt-2 text-4xl font-semibold">
            New Blog Post
          </h1>

          <p className="mt-4 text-white/60">
            Create a new article for the Kodalic website.
          </p>
        </div>

        <BlogCreateForm
          categories={categories}
          tags={tags}
          authorId={user?.id ?? null}
        />
      </div>
    </main>
  );
}