import Link from "next/link";
import { requirePermission } from "../../../lib/auth/require-permission";
import { requireAAL2 } from "../../../lib/auth/require-aal2";
import { getAdminUser } from "../../../lib/auth/get-admin-user";
import { getAdminNavigation } from "../../../lib/auth/get-admin-navigation";
import { getAdminLeads } from "../../../lib/auth/get-admin-leads";
import AdminSidebar from "../../../components/admin/sidebar";

function getLeadName(
  contactFields: Record<string, unknown>,
): string {
  return typeof contactFields.name === "string" &&
    contactFields.name.trim()
    ? contactFields.name
    : "Unknown";
}

function getLeadEmail(
  contactFields: Record<string, unknown>,
): string | null {
  return typeof contactFields.email === "string" &&
    contactFields.email.trim()
    ? contactFields.email
    : null;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getStatusClasses(status: string): string {
  switch (status) {
    case "new":
      return "border-blue-400/20 bg-blue-400/10 text-blue-200";

    case "reviewed":
      return "border-amber-400/20 bg-amber-400/10 text-amber-200";

    case "transferred_to_crm":
      return "border-purple-400/20 bg-purple-400/10 text-purple-200";

    case "archived":
      return "border-white/10 bg-white/[0.05] text-white/50";

    case "spam":
      return "border-red-400/20 bg-red-400/10 text-red-200";

    default:
      return "border-white/10 bg-white/[0.05] text-white/60";
  }
}

export default async function LeadsPage() {
  await requirePermission("leads.view");
  await requireAAL2();

  const adminUser = await getAdminUser();
  const navigation = await getAdminNavigation();
  const leads = await getAdminLeads();

  return (
    <div className="min-h-screen bg-[#080c1e] text-white">

      {/* ================================================== */}
      {/* SIDEBAR */}
      {/* ================================================== */}

      <AdminSidebar
        name={adminUser.name}
        email={adminUser.email}
        role={adminUser.role}
        navigation={navigation}
      />

      {/* ================================================== */}
      {/* MAIN */}
      {/* ================================================== */}

      <main className="min-h-screen ml-64 px-8 py-8">

        <div className="mx-auto max-w-7xl">

          {/* ================================================== */}
          {/* HEADER */}
          {/* ================================================== */}

          <div className="mb-8">

            <div className="flex items-center justify-between gap-6">

              <div>

                <p className="text-xs uppercase tracking-wider text-white/35">
                  CRM
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                  Leads
                </h1>

                <p className="mt-2 text-sm text-white/45">
                  Manage enquiries and follow-ups received by Kodalic.
                </p>

              </div>

              <div className="hidden rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-right sm:block">

                <p className="text-xs text-white/35">
                  Total Leads
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {leads.length}
                </p>

              </div>

            </div>

          </div>

          {/* ================================================== */}
          {/* FILTER BAR */}
          {/* ================================================== */}

          <div className="mb-5 flex flex-wrap items-center gap-2">

            <button
              type="button"
              className="rounded-lg border border-white/15 bg-white/[0.08] px-3 py-2 text-xs font-medium text-white"
            >
              All
            </button>

            <button
              type="button"
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/50"
            >
              New
            </button>

            <button
              type="button"
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/50"
            >
              Reviewed
            </button>

            <button
              type="button"
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/50"
            >
              Transferred
            </button>

            <button
              type="button"
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/50"
            >
              Archived
            </button>

            <button
              type="button"
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/50"
            >
              Spam
            </button>

          </div>

          {/* ================================================== */}
          {/* LEADS TABLE */}
          {/* ================================================== */}

          <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#111528]">

            <div className="border-b border-white/10 px-6 py-5">

              <h2 className="text-base font-semibold">
                All Leads
              </h2>

              <p className="mt-1 text-xs text-white/40">
                Most recent enquiries appear first.
              </p>

            </div>

            {leads.length === 0 ? (

              <div className="flex min-h-[300px] items-center justify-center px-6">

                <div className="text-center">

                  <p className="text-sm font-medium text-white/70">
                    No leads yet
                  </p>

                  <p className="mt-2 text-xs text-white/35">
                    New enquiries will appear here automatically.
                  </p>

                </div>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[800px]">

                  <thead>

                    <tr className="border-b border-white/10 text-left">

                      <th className="px-6 py-4 text-xs font-medium text-white/35">
                        Lead
                      </th>

                      <th className="px-6 py-4 text-xs font-medium text-white/35">
                        Service
                      </th>

                      <th className="px-6 py-4 text-xs font-medium text-white/35">
                        Budget
                      </th>

                      <th className="px-6 py-4 text-xs font-medium text-white/35">
                        Source
                      </th>

                      <th className="px-6 py-4 text-xs font-medium text-white/35">
                        Status
                      </th>

                      <th className="px-6 py-4 text-xs font-medium text-white/35">
                        Date
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-white/10">

                    {leads.map((lead) => {

                      const name = getLeadName(
                        lead.contact_fields,
                      );

                      const email = getLeadEmail(
                        lead.contact_fields,
                      );

                      return (

                        <tr
                          key={lead.id}
                          className="transition hover:bg-white/[0.025]"
                        >

                          {/* Lead */}

                          <td className="px-6 py-5">

                            <Link
                              href={`/admin/leads/${lead.id}`}
                              className="group flex items-center gap-3"
                            >

                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7357ff]/15 text-xs font-semibold text-[#b8a8ff]">
                                {name
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div className="min-w-0">

                                <p className="truncate text-sm font-medium text-white group-hover:text-[#b8a8ff]">
                                  {name}
                                </p>

                                {email && (
                                  <p className="mt-1 truncate text-xs text-white/35">
                                    {email}
                                  </p>
                                )}

                              </div>

                            </Link>

                          </td>

                          {/* Service */}

                          <td className="px-6 py-5">

                            <p className="text-sm text-white/65">
                              {lead.service ||
                                "Not specified"}
                            </p>

                          </td>

                          {/* Budget */}

                          <td className="px-6 py-5">

                            <p className="text-sm text-white/55">
                              {lead.budget ||
                                "Not specified"}
                            </p>

                          </td>

                          {/* Source */}

                          <td className="px-6 py-5">

                            <p className="text-sm text-white/55">
                              {lead.source ||
                                "Unknown"}
                            </p>

                          </td>

                          {/* Status */}

                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${getStatusClasses(
                                lead.status,
                              )}`}
                            >
                              {lead.status.replaceAll(
                                "_",
                                " ",
                              )}
                            </span>

                          </td>

                          {/* Date */}

                          <td className="px-6 py-5">

                            <p className="whitespace-nowrap text-xs text-white/40">
                              {formatDate(
                                lead.created_at,
                              )}
                            </p>

                          </td>

                        </tr>

                      );
                    })}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        </div>

      </main>

    </div>
  );
}