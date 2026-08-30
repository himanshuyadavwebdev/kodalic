"use client";

import { useState, useTransition } from "react";
import { addLeadNote } from "../../app/admin/leads/actions";

type LeadNote = {
  id: string;
  author_name: string;
  note: string;
  created_at: string;
};

type LeadNotesProps = {
  leadId: string;
  notes: LeadNote[];
};

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function LeadNotes({
  leadId,
  notes,
}: LeadNotesProps) {
  const [noteText, setNoteText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedNote = noteText.trim();

    if (!trimmedNote) {
      setError("Write a note before saving.");
      return;
    }

    setError(null);

    startTransition(() => {
      addLeadNote(leadId, trimmedNote)
        .then(() => {
          setNoteText("");
          window.location.reload();
        })
        .catch((err) => {
          console.error("Failed to add note:", err);

          setError(
            err instanceof Error
              ? err.message
              : "Failed to add note.",
          );
        });
    });
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-[#111528]">
      <div className="border-b border-white/10 px-6 py-5">
        <h2 className="text-base font-semibold">
          Internal Notes
        </h2>

        <p className="mt-1 text-xs text-white/40">
          Private notes for the Kodalic team.
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <textarea
            value={noteText}
            onChange={(event) =>
              setNoteText(event.target.value)
            }
            placeholder="Write an internal note..."
            rows={4}
            disabled={isPending}
            className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#7357ff]/50 disabled:opacity-50"
          />

          {error && (
            <p className="mt-2 text-xs text-red-300">
              {error}
            </p>
          )}

          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={
                isPending || !noteText.trim()
              }
              className="rounded-xl bg-[#7357ff] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#8066ff] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isPending ? "Saving..." : "Add note"}
            </button>
          </div>
        </form>

        <div className="mt-6 space-y-4">
          {notes.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-8 text-center">
              <p className="text-sm text-white/35">
                No internal notes yet.
              </p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-medium text-white/70">
                    {note.author_name}
                  </p>

                  <p className="shrink-0 text-[11px] text-white/30">
                    {formatDate(note.created_at)}
                  </p>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/60">
                  {note.note}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}