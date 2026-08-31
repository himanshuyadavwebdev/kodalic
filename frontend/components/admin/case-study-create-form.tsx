"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCaseStudy } from "../../app/admin/case-studies/actions";

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

const SERVICES = [
  "Web Development",
  "Web Design",
  "UI/UX Design",
  "Backend Development",
  "AI Integration",
  "Automation",
  "API Development",
  "Database Development",
];

export default function CaseStudyCreateForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [domain, setDomain] = useState("Websites");
  const [description, setDescription] = useState("");
  const [story, setStory] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [clientName, setClientName] = useState("");
  const [completedAt, setCompletedAt] = useState("");
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState("999");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  const [services, setServices] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [error, setError] = useState<string | null>(null);

  function toggleService(service: string) {
    setServices((current) =>
      current.includes(service)
        ? current.filter((item) => item !== service)
        : [...current, service],
    );
  }

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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    startTransition(async () => {
      try {
        const result = await createCaseStudy({
          title,
          slug,
          domain,
          description,
          story,
          websiteUrl,
          heroMediaId: null,
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
          setError(result.error ?? "Failed to create case study.");
          return;
        }

        router.push(`/admin/case-studies/${result.caseStudyId}`);
      } catch (err) {
        console.error("Failed to create case study:", err);

        setError(
          err instanceof Error ? err.message : "Failed to create case study.",
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-[#111528]">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-base font-semibold">Basic Information</h2>

          <p className="mt-1 text-xs text-white/40">
            The core information displayed on your Case Study page.
          </p>
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
              placeholder="Property Investment Platform"
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
              placeholder="property-investment-platform"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#7357ff]/50"
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
              placeholder="A concise description used on the Case Studies listing."
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-[#7357ff]/50"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-xs text-white/45">Client / Company</label>

              <input
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
                disabled={isPending}
                placeholder="Optional"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#7357ff]/50"
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
            Write the complete story of the project.
          </p>
        </div>

        <div className="p-6">
          <textarea
            value={story}
            onChange={(event) => setStory(event.target.value)}
            required
            disabled={isPending}
            rows={16}
            placeholder={`Tell the complete story here...

What was the client's situation?
What problem were they facing?
What did Kodalic build?
How was the solution designed?
What was the outcome?`}
            className="w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-white/20 focus:border-[#7357ff]/50"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#111528]">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-base font-semibold">Services</h2>

          <p className="mt-1 text-xs text-white/40">
            What did Kodalic deliver?
          </p>
        </div>

        <div className="grid gap-3 p-6 sm:grid-cols-2">
          {SERVICES.map((service) => (
            <label
              key={service}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
            >
              <input
                type="checkbox"
                checked={services.includes(service)}
                onChange={() => toggleService(service)}
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
            Add flexible tags for filtering and discovery.
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

            <span className="text-sm text-white/65">
              Publish this Case Study
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={(event) => setFeatured(event.target.checked)}
              disabled={isPending}
              className="h-4 w-4 rounded"
            />

            <span className="text-sm text-white/65">
              Feature this Case Study
            </span>
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

          <p className="text-xs leading-5 text-white/30">
            Only 5 Case Studies can be published at the same time.
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
              placeholder="Optional"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#7357ff]/50"
            />
          </div>

          <div>
            <label className="text-xs text-white/45">SEO Description</label>

            <textarea
              value={seoDescription}
              onChange={(event) => setSeoDescription(event.target.value)}
              disabled={isPending}
              rows={3}
              placeholder="Optional search-engine description"
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-[#7357ff]/50"
            />
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3">
          <p className="text-sm text-red-300">{error}</p>
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
          {isPending ? "Creating..." : "Create Case Study"}
        </button>
      </div>
    </form>
  );
}
