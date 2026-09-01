import Link from "next/link";
import { notFound } from "next/navigation";

import { requirePermission } from "../../../../lib/auth/require-permission";
import { requireAAL2 } from "../../../../lib/auth/require-aal2";
import { getAdminUser } from "../../../../lib/auth/get-admin-user";
import { getAdminNavigation } from "../../../../lib/auth/get-admin-navigation";
import { getAdminProject } from "../../../../lib/auth/get-admin-project";
import { getAdminProjectHighlights } from "../../../../lib/auth/get-admin-project-highlights";
import AdminSidebar from "../../../../components/admin/sidebar";
import ProjectEditForm from "../../../../components/admin/project-edit-form";
import ProjectHighlights from "../../../../components/admin/project-highlights";

type ProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  await requirePermission("projects.update");
  await requireAAL2();

  const { id } = await params;

  const project = await getAdminProject(id);
  const highlights = await getAdminProjectHighlights(id);
  if (!project) {
    notFound();
  }

  const adminUser = await getAdminUser();
  const navigation = await getAdminNavigation();

  return (
    <div className="min-h-screen bg-[#080c1e] text-white">
      <AdminSidebar
        name={adminUser.name}
        email={adminUser.email}
        role={adminUser.role}
        navigation={navigation}
      />

      <main className="min-h-screen ml-64 px-8 py-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/admin/projects"
            className="inline-flex text-sm text-white/45 transition hover:text-white"
          >
            ← Back to projects
          </Link>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-wider text-white/35">
              Portfolio
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Edit Project
            </h1>

            <p className="mt-2 text-sm text-white/45">
              Update the project information and publishing state.
            </p>
          </div>

          <div className="mt-8">
            <div className="space-y-6">
              <ProjectEditForm project={project} />

              <ProjectHighlights
                projectId={project.id}
                highlights={highlights}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
