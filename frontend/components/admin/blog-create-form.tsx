"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createBlogPost, uploadBlogCoverImage } from "../../app/admin/blog/action";

type BlogCategory = {
  id: string;
  name: string;
  slug: string;
};

type BlogTag = {
  id: string;
  name: string;
  slug: string;
};

type BlogCreateFormProps = {
  categories: BlogCategory[];
  tags: BlogTag[];
  authorId: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function BlogCreateForm({
  categories,
  tags,
  authorId,
}: BlogCreateFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const [slugEdited, setSlugEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [coverMediaId, setCoverMediaId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleCoverImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadBlogCoverImage(formData);

      if (!result.success) {
        setError(result.error ?? "Failed to upload cover image.");
        return;
      }

      setCoverMediaId(result.mediaId);
    } catch (uploadError) {
      console.error("Cover image upload failed:", uploadError);
      setError("Cover image upload failed.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  const selectedTagNames = useMemo(
    () =>
      tags
        .filter((tag) => selectedTags.includes(tag.id))
        .map((tag) => tag.name),
    [tags, selectedTags],
  );

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slugEdited) {
      setSlug(slugify(value));
    }
  }

  function toggleTag(tagId: string) {
    setSelectedTags((current) =>
      current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId],
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);
    setSaving(true);

    const result = await createBlogPost({
      title,
      slug,
      excerpt,
      content,
      authorId,
      status,
      publishedAt:
        status === "published"
          ? new Date().toISOString()
          : null,
      categoryId: categoryId || null,
      coverMediaId: coverMediaId,
      featured,
      tagIds: selectedTags,
    });

    if (!result.success) {
      setError(result.error);
      setSaving(false);
      return;
    }

    router.push(`/admin/blog/${result.postId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-8">
      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <section className="rounded-2xl border border-white/10 bg-[#111528] p-6">
        <h2 className="text-lg font-semibold">
          Basic Information
        </h2>

        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm text-white/60"
            >
              Title
            </label>

            <input
              id="title"
              value={title}
              onChange={(event) =>
                handleTitleChange(event.target.value)
              }
              placeholder="Enter blog title"
              required
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#7357ff]"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="mb-2 block text-sm text-white/60"
            >
              Slug
            </label>

            <input
              id="slug"
              value={slug}
              onChange={(event) => {
                setSlug(event.target.value);
                setSlugEdited(true);
              }}
              placeholder="my-blog-post"
              required
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#7357ff]"
            />

            <p className="mt-2 text-xs text-white/30">
              URL: /blog/{slug || "your-post-slug"}
            </p>
          </div>

          <div>
            <label
              htmlFor="excerpt"
              className="mb-2 block text-sm text-white/60"
            >
              Excerpt
            </label>

            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(event) =>
                setExcerpt(event.target.value)
              }
              rows={3}
              placeholder="Short description shown on the blog listing..."
              className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#7357ff]"
            />
          </div>
        </div>
      </section>

      {/* Cover Image Section */}
      <section className="rounded-2xl border border-white/10 bg-[#111528] p-6">
        <h2 className="text-lg font-semibold">Cover Image</h2>
        <p className="mt-1 text-xs text-white/40">
          Upload a high-quality cover image for this blog post. This will be displayed on the blog cards.
        </p>

        <div className="mt-6 space-y-6">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/10 px-6 py-10 text-center transition hover:border-[#7357ff]/50 hover:bg-white/[0.02]">
            <span className="text-sm font-medium text-white/70">
              {isUploading ? "Uploading..." : "Upload Cover Image"}
            </span>
            <span className="mt-2 text-xs text-white/35">
              JPG, PNG, WebP or AVIF · Maximum 10 MB
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleCoverImageUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>

          {coverMediaId && (
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/10 p-4">
              <div className="relative h-48 w-full overflow-hidden rounded-lg">
                <img
                  src={`/api/media/${coverMediaId}`}
                  alt="Cover image preview"
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => setCoverMediaId(null)}
                className="mt-3 text-xs font-semibold text-red-400 hover:text-red-300 transition"
              >
                Remove Cover Image
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="rounded-2xl border border-white/10 bg-[#111528] p-6">
        <h2 className="text-lg font-semibold">
          Content
        </h2>

        <div className="mt-6">
          <label
            htmlFor="content"
            className="mb-2 block text-sm text-white/60"
          >
            Article Content
          </label>

          <textarea
            id="content"
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            rows={18}
            placeholder="Write your article here..."
            required
            className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-white outline-none transition placeholder:text-white/25 focus:border-[#7357ff]"
          />

          <p className="mt-2 text-xs text-white/30">
            Rich text / Markdown support can be added after the
            core publishing workflow is working.
          </p>
        </div>
      </section>

      {/* Organization */}
      <section className="rounded-2xl border border-white/10 bg-[#111528] p-6">
        <h2 className="text-lg font-semibold">
          Organization
        </h2>

        <div className="mt-6 space-y-6">
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm text-white/60"
            >
              Category
            </label>

            <select
              id="category"
              value={categoryId}
              onChange={(event) =>
                setCategoryId(event.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-[#111528] px-4 py-3 text-sm text-white outline-none focus:border-[#7357ff]"
            >
              <option value="">
                No category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-3 text-sm text-white/60">
              Tags
            </p>

            {tags.length === 0 ? (
              <p className="text-sm text-white/30">
                No tags available yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const selected = selectedTags.includes(tag.id);

                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition ${
                        selected
                          ? "border-[#7357ff] bg-[#7357ff]/20 text-[#c0b7ff]"
                          : "border-white/10 bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white"
                      }`}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            )}

            {selectedTagNames.length > 0 && (
              <p className="mt-3 text-xs text-white/30">
                Selected: {selectedTagNames.join(", ")}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Publishing */}
      <section className="rounded-2xl border border-white/10 bg-[#111528] p-6">
        <h2 className="text-lg font-semibold">
          Publishing
        </h2>

        <div className="mt-6 space-y-5">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={(event) =>
                setFeatured(event.target.checked)
              }
              className="h-4 w-4 accent-[#7357ff]"
            />

            <span className="text-sm text-white/70">
              Featured post
            </span>
          </label>

          <div>
            <p className="mb-3 text-sm text-white/60">
              Status
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setStatus("draft")}
                className={`rounded-xl border px-4 py-2.5 text-sm transition ${
                  status === "draft"
                    ? "border-[#7357ff] bg-[#7357ff]/15 text-white"
                    : "border-white/10 bg-white/[0.04] text-white/50"
                }`}
              >
                Save as Draft
              </button>

              <button
                type="button"
                onClick={() => setStatus("published")}
                className={`rounded-xl border px-4 py-2.5 text-sm transition ${
                  status === "published"
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                    : "border-white/10 bg-white/[0.04] text-white/50"
                }`}
              >
                Publish
              </button>
            </div>

            {status === "published" && (
              <p className="mt-3 text-xs text-white/30">
                Publishing requires the blog.publish permission.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/60 transition hover:bg-white/[0.08] hover:text-white"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#7357ff] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#8066ff] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : status === "published"
              ? "Publish Post"
              : "Save Draft"}
        </button>
      </div>
    </form>
  );
}