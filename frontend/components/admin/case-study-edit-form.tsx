"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateCaseStudy } from "../../app/admin/case-studies/actions";
import { uploadCaseStudyMedia } from "../../app/admin/case-studies/media-actions";

const DOMAINS = [
  "Websites",
  "Web Apps",
  "AI",
  "Automation",
  "E-commerce",
  "FinTech",
  "Healthcare",
  "Education",
  "SaaS",
  "Other",
];

export type EditableCaseStudy = {
  id: string;
  title: string;
  slug: string;
  domain: string;
  description: string;
  story: string;
  website_url: string | null;
  hero_media_id: string | null;
  client_name: string | null;
  completed_at: string | null;
  published: boolean;
  featured: boolean;
  order: number;
  seo_title: string | null;
  seo_description: string | null;
  services: string[];
  tags: string[];
};

type CaseStudyMedia = {
  media_id: string;
  order: number;
  media:
    | {
        id: string;
        storage_key: string;
        filename: string;
        mime: string;
        size: number;
        dimensions: unknown;
        alt_text: string | null;
        caption: string | null;
      }[]
    | null;
};

type Props = {
  caseStudy: EditableCaseStudy;
  media: CaseStudyMedia[];
};

export default function CaseStudyEditForm({ caseStudy, media }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(caseStudy.title);
  const [slug, setSlug] = useState(caseStudy.slug);
  const [domain, setDomain] = useState(caseStudy.domain);
  const [description, setDescription] = useState(caseStudy.description);
  const [story, setStory] = useState(caseStudy.story);
  const [websiteUrl, setWebsiteUrl] = useState(caseStudy.website_url ?? "");
  const [clientName, setClientName] = useState(caseStudy.client_name ?? "");
  const [completedAt, setCompletedAt] = useState(caseStudy.completed_at ?? "");
  const [published, setPublished] = useState(caseStudy.published);
  const [featured, setFeatured] = useState(caseStudy.featured);
  const [order, setOrder] = useState(String(caseStudy.order));
  const [seoTitle, setSeoTitle] = useState(caseStudy.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(
    caseStudy.seo_description ?? "",
  );
  const [services, setServices] = useState<string[]>(caseStudy.services);

  const [tags, setTags] = useState<string[]>(caseStudy.tags);

  const [tagInput, setTagInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [mediaItems, setMediaItems] = useState<CaseStudyMedia[]>(media);
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState<
    Record<string, string>
  >({});
  const [heroMediaId, setHeroMediaId] = useState<string | null>(
    caseStudy.hero_media_id,
  );
  function addTag() {
    const value = tagInput.trim();

    if (!value) {
      return;
    }

    if (!tags.includes(value)) {
      setTags((current) => [...current, value]);
    }

    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags((current) => current.filter((item) => item !== tag));
  }
  async function handleMediaUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const result = await uploadCaseStudyMedia(caseStudy.id, formData);

      if (!result.success) {
        setError(result.error ?? "Failed to upload image.");
        return;
      }

      const refreshedMedia = await fetch(
        `/api/admin/case-studies/${caseStudy.id}/media`,
        {
          cache: "no-store",
        },
      ).then((response) => {
        if (!response.ok) {
          throw new Error("Failed to refresh media.");
        }

        return response.json();
      });

      setMediaItems(refreshedMedia);
    } catch (uploadError) {
      console.error("Media upload failed:", uploadError);

      setError("Image uploaded, but the media list could not be refreshed.");
    } finally {
      setIsUploading(false);

      event.target.value = "";
    }
  }
  async function loadMediaPreview(mediaId: string) {
    try {
      const response = await fetch(
        `/api/admin/case-studies/${caseStudy.id}/media/preview?mediaId=${mediaId}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to load media preview.");
      }

      const data = await response.json();

      if (data.url) {
        setMediaPreviewUrls((current) => ({
          ...current,
          [mediaId]: data.url,
        }));
      }
    } catch (error) {
      console.error("Failed to load media preview:", error);
    }
  }
  async function moveMedia(mediaId: string, direction: "up" | "down") {
    try {
      setError(null);

      const response = await fetch(
        `/api/admin/case-studies/${caseStudy.id}/media/reorder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mediaId,
            direction,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to reorder media.");
      }

      const refreshedMedia = await fetch(
        `/api/admin/case-studies/${caseStudy.id}/media`,
        {
          cache: "no-store",
        },
      ).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to refresh media.");
        }

        return res.json();
      });

      setMediaItems(refreshedMedia);
    } catch (error) {
      console.error("Failed to reorder media:", error);

      setError(
        error instanceof Error ? error.message : "Failed to reorder media.",
      );
    }
  }

  async function removeMedia(mediaId: string) {
    if (!window.confirm("Remove this image from the Case Study?")) {
      return;
    }

    try {
      setError(null);

      const response = await fetch(
        `/api/admin/case-studies/${caseStudy.id}/media/remove`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mediaId,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to remove media.");
      }

      setMediaItems((current) =>
        current.filter((item) => item.media_id !== mediaId),
      );

      setMediaPreviewUrls((current) => {
        const next = { ...current };

        delete next[mediaId];

        return next;
      });

      if (heroMediaId === mediaId) {
        setHeroMediaId(null);
      }
    } catch (error) {
      console.error("Failed to remove media:", error);

      setError(
        error instanceof Error ? error.message : "Failed to remove media.",
      );
    }
  }
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await updateCaseStudy(caseStudy.id, {
        title,
        slug,
        domain,
        description,
        story,
        websiteUrl,
        heroMediaId,
        clientName,
        completedAt: completedAt || null,
        published,
        featured,
        order: Number(order),
        seoTitle,
        seoDescription,
        services,
        tags,
      });

      if (!result.success) {
        setError(result.error ?? "Failed to update case study.");
        return;
      }

      setSuccess(true);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-[#111528]">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-base font-semibold">Basic Information</h2>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <label className="text-xs text-white/45">
              Website / Product Name
            </label>

            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              disabled={isPending}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#7357ff]/50"
            />
          </div>

          <div>
            <label className="text-xs text-white/45">Slug</label>

            <input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              required
              disabled={isPending}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-[#7357ff]/50"
            />
          </div>

          <div>
            <label className="text-xs text-white/45">Domain / Industry</label>

            <select
              value={domain}
              onChange={(event) => setDomain(event.target.value)}
              disabled={isPending}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1022] px-4 py-3 text-sm text-white outline-none focus:border-[#7357ff]/50"
            >
              {!DOMAINS.includes(domain) && (
                <option value={domain}>{domain}</option>
              )}

              {DOMAINS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-white/45">Short Description</label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              disabled={isPending}
              rows={4}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-[#7357ff]/50"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-xs text-white/45">Client / Company</label>

              <input
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
                disabled={isPending}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-[#7357ff]/50"
              />
            </div>

            <div>
              <label className="text-xs text-white/45">Completed Date</label>

              <input
                type="date"
                value={completedAt}
                onChange={(event) => setCompletedAt(event.target.value)}
                disabled={isPending}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-[#7357ff]/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-white/45">Live Website URL</label>

            <input
              type="url"
              value={websiteUrl}
              onChange={(event) => setWebsiteUrl(event.target.value)}
              disabled={isPending}
              placeholder="https://example.com"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#7357ff]/50"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#111528]">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-base font-semibold">Case Study Story</h2>

          <p className="mt-1 text-xs text-white/40">
            Write the complete project story.
          </p>
        </div>

        <div className="p-6">
          <textarea
            value={story}
            onChange={(event) => setStory(event.target.value)}
            required
            disabled={isPending}
            rows={18}
            className="w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-7 text-white outline-none focus:border-[#7357ff]/50"
          />
        </div>
      </section>
      <section className="rounded-2xl border border-white/10 bg-[#111528]">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-base font-semibold">Services</h2>

          <p className="mt-1 text-xs text-white/40">
            Services delivered as part of this project.
          </p>
        </div>

        <div className="grid gap-3 p-6 sm:grid-cols-2">
          {[
            "Web Development",
            "Web Design",
            "UI/UX Design",
            "Backend Development",
            "AI Integration",
            "Automation",
            "API Development",
            "Database Development",
          ].map((service) => (
            <label
              key={service}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
            >
              <input
                type="checkbox"
                checked={services.includes(service)}
                onChange={() => {
                  setServices((current) =>
                    current.includes(service)
                      ? current.filter((item) => item !== service)
                      : [...current, service],
                  );
                }}
                disabled={isPending}
                className="h-4 w-4 rounded"
              />

              <span className="text-sm text-white/60">{service}</span>
            </label>
          ))}
        </div>
      </section>
      <section className="rounded-2xl border border-white/10 bg-[#111528]">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-base font-semibold">Tags</h2>

          <p className="mt-1 text-xs text-white/40">
            Technologies, categories, and searchable keywords.
          </p>
        </div>

        <div className="p-6">
          <div className="flex gap-3">
            <input
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addTag();
                }
              }}
              disabled={isPending}
              placeholder="e.g. Next.js"
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#7357ff]/50"
            />

            <button
              type="button"
              onClick={addTag}
              disabled={isPending}
              className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-xs font-medium text-white/60 hover:bg-white/[0.08] hover:text-white"
            >
              Add
            </button>
          </div>

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="rounded-full bg-[#7357ff]/10 px-3 py-1.5 text-xs text-[#b7aaff]"
                >
                  {tag} ×
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#111528]">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-base font-semibold">Media</h2>

          <p className="mt-1 text-xs text-white/40">
            Upload screenshots and images for this Case Study.
          </p>
        </div>

        <div className="space-y-6 p-6">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/10 px-6 py-10 text-center transition hover:border-[#7357ff]/50 hover:bg-white/[0.02]">
            <span className="text-sm font-medium text-white/70">
              {isUploading ? "Uploading..." : "Upload Case Study Image"}
            </span>

            <span className="mt-2 text-xs text-white/35">
              JPG, PNG, WebP or AVIF · Maximum 10 MB
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleMediaUpload}
              disabled={isUploading || isPending}
              className="hidden"
            />
          </label>

          {mediaItems.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {mediaItems.map((item) => {
                const mediaRecord = Array.isArray(item.media)
                  ? item.media[0]
                  : item.media;

                if (!mediaRecord) {
                  return null;
                }
                const previewUrl = mediaPreviewUrls[item.media_id];

                return (
                  <div
                    key={item.media_id}
                    className="rounded-xl border border-white/10 bg-black/10 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white/70">
                          {mediaRecord.filename}
                        </p>

                        <p className="mt-1 text-xs text-white/35">
                          {(mediaRecord.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-white/[0.05] px-2 py-1 text-[10px] uppercase tracking-wide text-white/40">
                        Image
                      </span>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt={mediaRecord.alt_text || mediaRecord.filename}
                          className="aspect-video w-full object-cover"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => loadMediaPreview(item.media_id)}
                          className="flex aspect-video w-full items-center justify-center text-xs text-white/40 hover:text-white/70"
                        >
                          Load Preview
                        </button>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      {heroMediaId === item.media_id ? (
                        <span className="rounded-full bg-[#7357ff]/15 px-3 py-1.5 text-xs font-medium text-[#b7aaff]">
                          ⭐ Hero Image
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setHeroMediaId(item.media_id)}
                          disabled={isPending}
                          className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/60 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-40"
                        >
                          Set as Hero
                        </button>
                      )}

                      {heroMediaId === item.media_id && (
                        <button
                          type="button"
                          onClick={() => setHeroMediaId(null)}
                          disabled={isPending}
                          className="text-xs text-white/35 transition hover:text-white"
                        >
                          Remove Hero
                        </button>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2">
  <div className="flex gap-2">
    <button
      type="button"
      onClick={() =>
        moveMedia(item.media_id, "up")
      }
      disabled={
        isPending ||
        item.order === mediaItems[0]?.order
      }
      className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/50 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
      title="Move up"
    >
      ↑
    </button>

    <button
      type="button"
      onClick={() =>
        moveMedia(item.media_id, "down")
      }
      disabled={
        isPending ||
        item.order ===
          mediaItems[mediaItems.length - 1]?.order
      }
      className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/50 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
      title="Move down"
    >
      ↓
    </button>
  </div>

  <button
    type="button"
    onClick={() =>
      removeMedia(item.media_id)
    }
    disabled={isPending}
    className="rounded-lg border border-red-400/10 bg-red-400/5 px-3 py-2 text-xs text-red-300/70 hover:bg-red-400/10 hover:text-red-300 disabled:opacity-40"
  >
    Remove
  </button>
</div>
                  </div>
                );
              })}
            </div>
          )}

          {mediaItems.length === 0 && !isUploading && (
            <p className="text-center text-xs text-white/30">
              No images attached to this Case Study yet.
            </p>
          )}
        </div>
      </section>
      <section className="rounded-2xl border border-white/10 bg-[#111528]">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-base font-semibold">Publishing</h2>
        </div>

        <div className="space-y-5 p-6">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={published}
              onChange={(event) => setPublished(event.target.checked)}
              disabled={isPending}
              className="h-4 w-4 rounded"
            />

            <span className="text-sm text-white/65">Published</span>
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={(event) => setFeatured(event.target.checked)}
              disabled={isPending}
              className="h-4 w-4 rounded"
            />

            <span className="text-sm text-white/65">Featured</span>
          </label>

          <div className="max-w-xs">
            <label className="text-xs text-white/45">Display Order</label>

            <input
              type="number"
              value={order}
              onChange={(event) => setOrder(event.target.value)}
              disabled={isPending}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-[#7357ff]/50"
            />
          </div>

          <p className="text-xs text-white/30">
            Maximum 5 Case Studies can be published.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#111528]">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-base font-semibold">SEO</h2>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <label className="text-xs text-white/45">SEO Title</label>

            <input
              value={seoTitle}
              onChange={(event) => setSeoTitle(event.target.value)}
              disabled={isPending}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-[#7357ff]/50"
            />
          </div>

          <div>
            <label className="text-xs text-white/45">SEO Description</label>

            <textarea
              value={seoDescription}
              onChange={(event) => setSeoDescription(event.target.value)}
              disabled={isPending}
              rows={4}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-[#7357ff]/50"
            />
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3">
          <p className="text-sm text-emerald-300">
            Case Study updated successfully.
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/case-studies")}
          disabled={isPending}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/60 hover:bg-white/[0.08] hover:text-white"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-[#7357ff] px-6 py-3 text-sm font-medium text-white hover:bg-[#8066ff] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
