"use client";

import { useState, useTransition } from "react";
import {
  addProjectHighlight,
  deleteProjectHighlight,
} from "../../app/admin/projects/actions";

type Highlight = {
  id: string;
  project_id: string;
  text: string;
  highlight_order: number;
  created_at: string;
  updated_at: string;
};

type ProjectHighlightsProps = {
  projectId: string;
  highlights: Highlight[];
};

export default function ProjectHighlights({
  projectId,
  highlights,
}: ProjectHighlightsProps) {
  const [text, setText] = useState("");
  const [order, setOrder] = useState("999");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAdd(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText) {
      setError("Highlight text is required.");
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        const result = await addProjectHighlight({
          projectId,
          text: trimmedText,
          order: Number(order),
        });

        if (!result.success) {
          setError(
            result.error ?? "Failed to add highlight.",
          );
          return;
        }

        setText("");
        setOrder("999");

        window.location.reload();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to add highlight.",
        );
      }
    });
  }

  function handleDelete(highlightId: string) {
    setError(null);

    startTransition(async () => {
      try {
        const result =
          await deleteProjectHighlight(highlightId);

        if (!result.success) {
          setError(
            result.error ??
              "Failed to delete highlight.",
          );
          return;
        }

        window.location.reload();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete highlight.",
        );
      }
    });
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-[#111528]">
      <div className="border-b border-white/10 px-6 py-5">
        <h2 className="text-base font-semibold">
          Highlights
        </h2>

        <p className="mt-1 text-xs text-white/40">
          Add the key points you want to show for this project.
        </p>
      </div>

      <div className="p-6">
        <form
          onSubmit={handleAdd}
          className="space-y-4"
        >
          <div>
            <label className="text-xs text-white/45">
              Highlight
            </label>

            <input
              value={text}
              onChange={(event) =>
                setText(event.target.value)
              }
              placeholder="e.g. Built a scalable admin dashboard"
              disabled={isPending}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#7357ff]/50 disabled:opacity-50"
            />
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div className="w-32">
              <label className="text-xs text-white/45">
                Order
              </label>

              <input
                type="number"
                value={order}
                onChange={(event) =>
                  setOrder(event.target.value)
                }
                disabled={isPending}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-[#7357ff]/50 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-[#7357ff] px-4 py-3 text-xs font-medium text-white transition hover:bg-[#8066ff] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isPending
                ? "Saving..."
                : "Add highlight"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3">
            <p className="text-xs text-red-300">
              {error}
            </p>
          </div>
        )}

        <div className="mt-6 space-y-3">
          {highlights.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-8 text-center">
              <p className="text-sm text-white/35">
                No highlights yet.
              </p>
            </div>
          ) : (
            highlights.map((highlight) => (
              <div
                key={highlight.id}
                className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#7357ff]/10 text-xs font-medium text-[#a99cff]">
                  {highlight.highlight_order}
                </div>

                <p className="min-w-0 flex-1 text-sm leading-6 text-white/65">
                  {highlight.text}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(highlight.id)
                  }
                  disabled={isPending}
                  className="shrink-0 text-xs text-red-300/70 transition hover:text-red-300 disabled:opacity-40"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}