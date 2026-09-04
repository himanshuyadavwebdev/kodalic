import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicCaseStudy } from "../../../lib/get-public-case-study";
import { SITE_URL } from "../../seo";
import CaseStudyClient from "./CaseStudyClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPublicCaseStudy(slug);
  if (!data) {
    return {
      title: "Case Study Not Found",
      robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    };
  }
  const title = data.seo_title || data.title;
  const description = data.seo_description || data.description;
  const canonical = `/case-studies/${encodeURIComponent(data.slug)}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getPublicCaseStudy(slug);
  if (!data) {
    notFound();
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Case Studies", item: `${SITE_URL}/case-studies` },
      { "@type": "ListItem", position: 3, name: data.title, item: `${SITE_URL}/case-studies/${encodeURIComponent(data.slug)}` },
    ],
  };

  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    headline: data.seo_title || data.title,
    description: data.seo_description || data.description,
    url: `${SITE_URL}/case-studies/${encodeURIComponent(data.slug)}`,
    datePublished: data.completed_at || undefined,
    author: { "@type": "Organization", name: "Kodalic", url: SITE_URL },
    publisher: { "@type": "Organization", name: "Kodalic", url: SITE_URL },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }} />
      <CaseStudyClient data={data} />
    </>
  );
}
