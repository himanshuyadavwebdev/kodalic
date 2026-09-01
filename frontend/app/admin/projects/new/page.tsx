import Link from "next/link";
import { requirePermission } from "../../../../lib/auth/require-permission";
import { requireAAL2 } from "../../../../lib/auth/require-aal2";
import { getAdminUser } from "../../../../lib/auth/get-admin-user";
import { getAdminNavigation } from "../../../../lib/auth/get-admin-navigation";
import AdminSidebar from "../../../../components/admin/sidebar";
import ProjectCreateForm from "../../../../components/admin/project-create-form";

export default async function NewProjectPage() {
  await requirePermission("projects.create");
  await requireAAL2();

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
              New Project
            </h1>

            <p className="mt-2 text-sm text-white/45">
              Create a new project for the Kodalic portfolio.
            </p>
          </div>

          <div className="mt-8">
            <ProjectCreateForm />
          </div>

        </div>
      </main>
    </div>
  );
}