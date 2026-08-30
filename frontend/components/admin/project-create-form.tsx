"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "../../app/admin/projects/actions";

const STATUSES = [
  "draft",
  "published",
  "archived",
] as const;

export default function ProjectCreateForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [solutionType, setSolutionType] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [status, setStatus] =
    useState<(typeof STATUSES)[number]>("draft");
  const [featured, setFeatured] = useState(false);
  const [projectOrder, setProjectOrder] = useState("999");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);

    startTransition(async () => {
      try {
        const result = await createProject({
          title,
          slug,
          description,
          solutionType,
          liveUrl,
          status,
          featured,
          projectOrder: Number(projectOrder),
        });

        if (!result.success) {
          setError(
            result.error ?? "Failed to create project.",
          );
          return;
        }

        router.push(
          `/admin/projects/${result.projectId}`,
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to create project.",
        );
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-[#111528]"
    >
      <div className="border-b border-white/10 px-6 py-5">
        <h2 className="text-base font-semibold">
          Project Information
        </h2>

        <p className="mt-1 text-xs text-white/40">
          Add the core information for this project.
        </p>
      </div>

      <div className="space-y-6 p-6">
        <div>
          <label className="text-xs text-white/45">
            Title
          </label>

          <input
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="e.g. Kodalic Website"
            disabled={isPending}
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#7357ff]/50"
          />
        </div>

        <div>
          <label className="text-xs text-white/45">
            Slug
          </label>

          <input
            value={slug}
            onChange={(event) =>
              setSlug(event.target.value)
            }
            placeholder="e.g. kodalic-website"
            disabled={isPending}
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#7357ff]/50"
          />

          <p className="mt-2 text-[11px] text-white/25">
            Must be unique.
          </p>
        </div>

        <div>
          <label className="text-xs text-white/45">
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Describe the project..."
            rows={5}
            disabled={isPending}
            required
            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-[#7357ff]/50"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="text-xs text-white/45">
              Solution Type
            </label>

            <input
              value={solutionType}
              onChange={(event) =>
                setSolutionType(event.target.value)
              }
              placeholder="Website Development"
              disabled={isPending}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#7357ff]/50"
            />
          </div>

          <div>
            <label className="text-xs text-white/45">
              Live URL
            </label>

            <input
              type="url"
              value={liveUrl}
              onChange={(event) =>
                setLiveUrl(event.target.value)
              }
              placeholder="https://example.com"
              disabled={isPending}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#7357ff]/50"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="text-xs text-white/45">
              Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as (typeof STATUSES)[number],
                )
              }
              disabled={isPending}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1022] px-4 py-3 text-sm text-white outline-none focus:border-[#7357ff]/50"
            >
              {STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-white/45">
              Display Order
            </label>

            <input
              type="number"
              value={projectOrder}
              onChange={(event) =>
                setProjectOrder(event.target.value)
              }
              disabled={isPending}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-[#7357ff]/50"
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={featured}
            onChange={(event) =>
              setFeatured(event.target.checked)
            }
            disabled={isPending}
            className="h-4 w-4 rounded border-white/20 bg-black/20"
          />

          <span className="text-sm text-white/65">
            Feature this project
          </span>
        </label>

        {error && (
          <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3">
            <p className="text-xs text-red-300">
              {error}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={() =>
              router.push("/admin/projects")
            }
            disabled={isPending}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-xs font-medium text-white/60 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-[#7357ff] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#8066ff] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPending ? "Creating..." : "Create project"}
          </button>
        </div>
      </div>
    </form>
  );
}