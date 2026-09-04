import type { Metadata } from "next";
import LegalDocument from "../components/LegalDocument";
import { LEGAL_DOCUMENTS } from "../data/legalDocuments";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Read Kodalic's Cookie Policy — how we use cookies and similar technologies and how you can manage them.",
  alternates: { canonical: "/cookies" },
  openGraph: { title: "Cookie Policy | Kodalic", description: "Read Kodalic's Cookie Policy — how we use cookies and similar technologies.", url: "/cookies", type: "website" },
  twitter: { card: "summary_large_image", title: "Cookie Policy | Kodalic", description: "Read Kodalic's Cookie Policy — how we use cookies and similar technologies." },
};

export default function CookiesPage() {
  return <LegalDocument document={LEGAL_DOCUMENTS.cookies} />;
}
