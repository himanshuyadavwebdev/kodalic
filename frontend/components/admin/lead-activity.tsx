type LeadActivity = {
  id: string;
  actor_name: string;
  action: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

type LeadActivityProps = {
  activities: LeadActivity[];
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

function getActivityText(
  action: string,
  metadata: Record<string, unknown>,
): string {
  switch (action) {
    case "status_changed": {
      const from =
        typeof metadata.from === "string"
          ? metadata.from.replaceAll("_", " ")
          : "unknown";

      const to =
        typeof metadata.to === "string"
          ? metadata.to.replaceAll("_", " ")
          : "unknown";

      return `Status changed from ${from} to ${to}`;
    }

    case "assignment_changed": {
      const from =
        metadata.from === null
          ? "Unassigned"
          : "Assigned user changed";

      const to =
        metadata.to === null
          ? "Unassigned"
          : "Assigned user changed";

      return `Assignment changed: ${from} → ${to}`;
    }

    case "note_added":
      return "Added an internal note";

    default:
      return action.replaceAll("_", " ");
  }
}

export default function LeadActivity({
  activities,
}: LeadActivityProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#111528]">
      <div className="border-b border-white/10 px-6 py-5">
        <h2 className="text-base font-semibold">
          Activity
        </h2>

        <p className="mt-1 text-xs text-white/40">
          History of actions taken on this lead.
        </p>
      </div>

      <div className="p-6">
        {activities.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-8 text-center">
            <p className="text-sm text-white/35">
              No activity yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#7357ff]" />

                  <span className="mt-2 h-full w-px bg-white/10" />
                </div>

                <div className="min-w-0 flex-1 pb-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white/80">
                      {getActivityText(
                        activity.action,
                        activity.metadata,
                      )}
                    </p>

                    <p className="text-[11px] text-white/30">
                      {formatDate(activity.created_at)}
                    </p>
                  </div>

                  <p className="mt-1 text-xs text-white/35">
                    by {activity.actor_name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}