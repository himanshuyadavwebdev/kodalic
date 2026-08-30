import Link from "next/link";

import { requirePermission } from "../../../../lib/auth/require-permission";
import CaseStudyCreateForm from "../../../../components/admin/case-study-create-form";

export default async function NewCaseStudyPage() {
  await requirePermission("case_studies.create");

  return (
    <main className="min-h-screen bg-[#080c1e] px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/case-studies"
          className="text-sm text-white/50 transition hover:text-white"
        >
          ← Back to Case Studies
        </Link>

        <div className="mt-8">
          <p className="text-sm text-white/50">
            Case Studies
          </p>

          <h1 className="mt-2 text-4xl font-semibold">
            New Case Study
          </h1>

          <p className="mt-4 text-white/60">
            Create a production-ready case study for the
            Kodalic website.
          </p>
        </div>

        <div className="mt-10">
          <CaseStudyCreateForm />
        </div>
      </div>
    </main>
  );
}