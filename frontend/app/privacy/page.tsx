import type { Metadata } from "next";
import LegalDocument from "../components/LegalDocument";
import { LEGAL_DOCUMENTS } from "../data/legalDocuments";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read Kodalic's Privacy Policy — how we collect, use, and protect your personal data in accordance with applicable Indian law.",
  alternates: { canonical: "/privacy" },
  openGraph: { title: "Privacy Policy | Kodalic", description: "Read Kodalic's Privacy Policy — how we collect, use, and protect your personal data.", url: "/privacy", type: "website" },
  twitter: { card: "summary_large_image", title: "Privacy Policy | Kodalic", description: "Read Kodalic's Privacy Policy — how we collect, use, and protect your personal data." },
};

export default function PrivacyPage() {
  return <LegalDocument document={LEGAL_DOCUMENTS.privacy} />;
}
