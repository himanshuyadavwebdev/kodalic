"use client";

import { useState, useTransition } from "react";
import { updateLead } from "../../app/admin/leads/actions";

type LeadUser = {
  id: string;
  name: string;
  email: string;
};

type LeadActionsProps = {
  leadId: string;
  currentStatus: string;
  currentAssignedUserId: string | null;
  users: LeadUser[];
};

const statuses = [
  {
    value: "new",
    label: "New",
  },
  {
    value: "reviewed",
    label: "Reviewed",
  },
  {
    value: "transferred_to_crm",
    label: "Transferred to CRM",
  },
  {
    value: "archived",
    label: "Archived",
  },
  {
    value: "spam",
    label: "Spam",
  },
];

export default function LeadActions({
  leadId,
  currentStatus,
  currentAssignedUserId,
  users,
}: LeadActionsProps) {
  const [status, setStatus] = useState(currentStatus);

  const [assignedUserId, setAssignedUserId] =
    useState(currentAssignedUserId ?? "");

  const [isPending, startTransition] =
    useTransition();

  const [message, setMessage] =
    useState<string | null>(null);

  function saveChanges() {
    setMessage(null);

    startTransition(async () => {
      try {
        await updateLead(
          leadId,
          status,
          assignedUserId || null,
        );

        setMessage("Changes saved.");
      } catch (error) {
        console.error(error);

        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to save changes.",
        );
      }
    });
  }

  return (
    <div className="space-y-5">

      {/* ================================================== */}
      {/* STATUS */}
      {/* ================================================== */}

      <div>
        <label
          htmlFor="lead-status"
          className="text-xs text-white/35"
        >
          Status
        </label>

        <select
          id="lead-status"
          value={status}
          disabled={isPending}
          onChange={(event) =>
            setStatus(event.target.value)
          }
          className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c1e] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#7357ff]/50 disabled:opacity-50"
        >
          {statuses.map((item) => (
            <option
              key={item.value}
              value={item.value}
              className="bg-[#111528]"
            >
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* ================================================== */}
      {/* ASSIGNED USER */}
      {/* ================================================== */}

      <div>
        <label
          htmlFor="lead-assignee"
          className="text-xs text-white/35"
        >
          Assigned User
        </label>

        <select
          id="lead-assignee"
          value={assignedUserId}
          disabled={isPending}
          onChange={(event) =>
            setAssignedUserId(event.target.value)
          }
          className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c1e] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#7357ff]/50 disabled:opacity-50"
        >
          <option
            value=""
            className="bg-[#111528]"
          >
            Unassigned
          </option>

          {users.map((user) => (
            <option
              key={user.id}
              value={user.id}
              className="bg-[#111528]"
            >
              {user.name} — {user.email}
            </option>
          ))}
        </select>

        {users.length === 0 && (
          <p className="mt-2 text-xs text-white/30">
            No active users available.
          </p>
        )}
      </div>

      {/* ================================================== */}
      {/* SAVE */}
      {/* ================================================== */}

      <button
        type="button"
        disabled={isPending}
        onClick={saveChanges}
        className="w-full rounded-xl bg-[#7357ff] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#846cff] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending
          ? "Saving..."
          : "Save changes"}
      </button>

      {message && (
        <p className="text-xs text-white/45">
          {message}
        </p>
      )}

    </div>
  );
}