"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteBlogPost } from "../../app/admin/blog/action";

type BlogDeleteButtonProps = {
  postId: string;
  postTitle: string;
};

export default function BlogDeleteButton({
  postId,
  postTitle,
}: BlogDeleteButtonProps) {
  const router = useRouter();

  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${postTitle}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setDeleting(true);

    const result = await deleteBlogPost(postId);

    if (!result.success) {
      setError(result.error);
      setDeleting(false);
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="inline-flex rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-xs font-medium text-red-300 transition hover:bg-red-400/20 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>

      {error && (
        <p className="max-w-xs text-right text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}