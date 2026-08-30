import LegalDocument from "../components/LegalDocument";
import { LEGAL_DOCUMENTS } from "../data/legalDocuments";

export default function TermsPage() {
  return <LegalDocument document={LEGAL_DOCUMENTS.terms} />;
}
