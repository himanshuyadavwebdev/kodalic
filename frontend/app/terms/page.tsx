import type { Metadata } from "next";
import LegalDocument from "../components/LegalDocument";
import { LEGAL_DOCUMENTS } from "../data/legalDocuments";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read Kodalic's Terms & Conditions governing website use and service delivery.",
  alternates: { canonical: "/terms" },
  openGraph: { title: "Terms & Conditions | Kodalic", description: "Read Kodalic's Terms & Conditions governing website use and service delivery.", url: "/terms", type: "website" },
  twitter: { card: "summary_large_image", title: "Terms & Conditions | Kodalic", description: "Read Kodalic's Terms & Conditions governing website use and service delivery." },
};

export default function TermsPage() {
  return <LegalDocument document={LEGAL_DOCUMENTS.terms} />;
}
