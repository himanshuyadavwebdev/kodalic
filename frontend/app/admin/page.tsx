import { requirePermission } from "../../lib/auth/require-permission";
import { requireAAL2 } from "../../lib/auth/require-aal2";
import { getAdminUser } from "../../lib/auth/get-admin-user";
import AdminSidebar from "../../components/admin/sidebar";
import { getAdminNavigation } from "../../lib/auth/get-admin-navigation";
import { getAdminDashboardMetrics } from "../../lib/auth/get-admin-dashboard-metrics";
import { getAdminRecentLeads } from "../../lib/auth/get-admin-recent-leads";
import LeadOverviewChart from "../../components/admin/lead-overview-chart";
import { getAdminLeadOverview } from "../../lib/auth/get-admin-lead-overview";
import { getAdminProjectStatus } from "../../lib/auth/get-admin-project-status";
import { getAdminTopPages } from "../../lib/auth/get-admin-top-pages";
import { getAdminSystemHealth } from "../../lib/auth/get-admin-system-health";

type MetricCardProps = {
  label: string;
  value: number | string;
  description: string;
};

function MetricCard({ label, value, description }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111528] p-5">
      <p className="text-sm text-white/45">{label}</p>

      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>

      <p className="mt-2 text-xs text-white/35">{description}</p>
    </div>
  );
}

export default async function AdminPage() {
  const adminUser = await getAdminUser();

  await requirePermission("admin.access");
  await requireAAL2();

  const navigation = await getAdminNavigation();

  const metrics = await getAdminDashboardMetrics();

  /*
   * Check whether this user has permission to view leads.
   *
   * This is important because Developers should not even
   * request lead-specific data from the server.
   */
  const canViewLeads = navigation.some(
    (item) => item.permission === "leads.view",
  );

  const canViewAnalytics = navigation.some(
    (item) => item.permission === "analytics.view",
  );

  /*
   * Only fetch lead data when the user has leads.view.
   */
  const recentLeads = canViewLeads ? await getAdminRecentLeads(5) : [];

  const leadOverview = canViewLeads ? await getAdminLeadOverview(7) : [];

  const projectStatus = await getAdminProjectStatus();

  const topPages = canViewAnalytics ? await getAdminTopPages(30, 5) : [];

  const systemHealth = await getAdminSystemHealth();

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
      {/* MAIN CONTENT */}
      {/* ================================================== */}

      <main className="min-h-screen ml-64 px-8 py-8">
        <div className="mx-auto max-w-7xl">
          {/* ================================================== */}
          {/* HEADER */}
          {/* ================================================== */}

          <div className="mb-8">
            <p className="text-xs uppercase tracking-wider text-white/35">
              Dashboard
            </p>

            <div className="mt-2 flex items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                  Welcome back, {adminUser.name}
                </h1>

                <p className="mt-2 text-sm text-white/45">
                  Here's what's happening with Kodalic today.
                </p>
              </div>

              <div className="hidden text-right sm:block">
                <p className="text-xs text-white/35">Role</p>

                <p className="mt-1 text-sm font-medium text-white/75">
                  {adminUser.role}
                </p>
              </div>
            </div>
          </div>

          {/* ================================================== */}
          {/* METRIC CARDS */}
          {/* ================================================== */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Total Leads"
              value={metrics.leads_total}
              description="All leads received"
            />

            <MetricCard
              label="New Leads"
              value={metrics.leads_new}
              description="Currently awaiting review"
            />

            <MetricCard
              label="Total Projects"
              value={metrics.projects_total}
              description="All portfolio projects"
            />

            <MetricCard
              label="Published Projects"
              value={metrics.projects_published}
              description="Currently visible publicly"
            />
          </div>

          {/* ================================================== */}
          {/* DASHBOARD WORKSPACE */}
          {/* ================================================== */}

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            {/* ================================================== */}
            {/* LEADS OVERVIEW */}
            {/* ================================================== */}

            {canViewLeads && (
              <section className="rounded-2xl border border-white/10 bg-[#111528]">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                  <div>
                    <h2 className="text-base font-semibold">Leads Overview</h2>

                    <p className="mt-1 text-xs text-white/40">
                      Lead activity over the last 7 days
                    </p>
                  </div>

                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/55">
                    Last 7 days
                  </span>
                </div>

                <LeadOverviewChart data={leadOverview} />
              </section>
            )}

            {/* ================================================== */}
            {/* RECENT LEADS */}
            {/* ================================================== */}

            {canViewLeads && (
              <section className="rounded-2xl border border-white/10 bg-[#111528]">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                  <div>
                    <h2 className="text-base font-semibold">Recent Leads</h2>

                    <p className="mt-1 text-xs text-white/40">
                      Latest enquiries
                    </p>
                  </div>

                  <a
                    href="/admin/leads"
                    className="text-xs font-medium text-[#a78bfa] transition hover:text-white"
                  >
                    View all
                  </a>
                </div>

                {recentLeads.length === 0 ? (
                  <div className="flex min-h-[280px] items-center justify-center px-6">
                    <p className="text-sm text-white/35">No leads yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {recentLeads.map((lead) => {
                      const name =
                        typeof lead.contact_fields?.name === "string"
                          ? lead.contact_fields.name
                          : "Unknown";

                      const email =
                        typeof lead.contact_fields?.email === "string"
                          ? lead.contact_fields.email
                          : null;

                      return (
                        <div
                          key={lead.id}
                          className="flex items-center gap-4 px-6 py-4"
                        >
                          {/* Avatar */}

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7357ff]/15 text-xs font-semibold text-[#b8a8ff]">
                            {name.charAt(0).toUpperCase()}
                          </div>

                          {/* Lead information */}

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-white">
                              {name}
                            </p>

                            {email && (
                              <p className="mt-1 truncate text-xs text-white/35">
                                {email}
                              </p>
                            )}

                            <p className="mt-1 truncate text-xs text-white/45">
                              {lead.service || "No service specified"}
                            </p>
                          </div>

                          {/* Status */}

                          <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium capitalize text-white/60">
                            {lead.status.replaceAll("_", " ")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}
          </div>

          {/* ================================================== */}
          {/* PROJECT STATUS */}
          {/* ================================================== */}

          <section className="mt-6 rounded-2xl border border-white/10 bg-[#111528]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-base font-semibold">Projects Status</h2>

                <p className="mt-1 text-xs text-white/40">
                  Current portfolio project distribution
                </p>
              </div>

              <a
                href="/admin/projects"
                className="text-xs font-medium text-[#a78bfa] transition hover:text-white"
              >
                View projects
              </a>
            </div>

            {projectStatus.length === 0 ? (
              <div className="flex min-h-[180px] items-center justify-center px-6">
                <p className="text-sm text-white/35">No projects yet.</p>
              </div>
            ) : (
              <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
                {projectStatus.map((item) => (
                  <div
                    key={item.status}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-medium capitalize text-white/70">
                        {item.status.replaceAll("_", " ")}
                      </p>

                      <p className="text-2xl font-semibold">
                        {item.project_count}
                      </p>
                    </div>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[#7357ff]"
                        style={{
                          width: `${
                            projectStatus.reduce(
                              (total, current) => total + current.project_count,
                              0,
                            ) > 0
                              ? (item.project_count /
                                  projectStatus.reduce(
                                    (total, current) =>
                                      total + current.project_count,
                                    0,
                                  )) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          {/* ================================================== */}
{/* TOP PAGES */}
{/* ================================================== */}

{canViewAnalytics && (
  <section className="mt-6 rounded-2xl border border-white/10 bg-[#111528]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-base font-semibold">Top Pages</h2>

                <p className="mt-1 text-xs text-white/40">
                  Most visited pages over the last 30 days
                </p>
              </div>

              <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/55">
                Last 30 days
              </span>
            </div>

            {topPages.length === 0 ? (
              <div className="flex min-h-[180px] items-center justify-center px-6">
                <p className="text-sm text-white/35">No page views yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {topPages.map((page, index) => {
                  const maxViews = Math.max(
                    ...topPages.map((item) => item.view_count),
                    1,
                  );

                  const percentage = (page.view_count / maxViews) * 100;

                  return (
                    <div key={page.path} className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <span className="w-6 text-xs text-white/30">
                          {index + 1}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-4">
                            <p className="truncate text-sm font-medium text-white/80">
                              {page.path}
                            </p>

                            <p className="shrink-0 text-sm font-semibold text-white">
                              {page.view_count.toLocaleString("en-IN")}
                            </p>
                          </div>

                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-[#7357ff] transition-all"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
)}
          {/* ================================================== */}
          {/* SYSTEM OVERVIEW */}
          {/* ================================================== */}

          <section className="mt-6 rounded-2xl border border-white/10 bg-[#111528]">
            <div className="border-b border-white/10 px-6 py-5">
              <h2 className="text-base font-semibold">System Overview</h2>

              <p className="mt-1 text-xs text-white/40">
                Current application service health
              </p>
            </div>

            {systemHealth.length === 0 ? (
              <div className="flex min-h-[180px] items-center justify-center px-6">
                <p className="text-sm text-white/35">
                  No system health information available.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
                {systemHealth.map((system) => {
                  const isOperational = system.system_status === "operational";

                  return (
                    <div
                      key={system.system_name}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              isOperational ? "bg-emerald-400" : "bg-amber-400"
                            }`}
                          />

                          <p className="text-sm font-medium text-white/80">
                            {system.system_name}
                          </p>
                        </div>

                        <span
                          className={`text-xs font-medium capitalize ${
                            isOperational
                              ? "text-emerald-300"
                              : "text-amber-300"
                          }`}
                        >
                          {system.system_status}
                        </span>
                      </div>

                      <p className="mt-3 text-xs leading-5 text-white/35">
                        {system.status_message}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
