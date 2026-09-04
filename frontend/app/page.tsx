import type { Metadata } from "next";
import { getPublicBlogPosts } from "../lib/blog/get-public-blog-posts";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const blogPosts = await getPublicBlogPosts();
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "What does Kodalic actually do?", acceptedAnswer: { "@type": "Answer", text: "We're a technology solutions company. We design and build websites, automate internal workflows, ship practical AI features, and provide ongoing support — so you get one team instead of juggling five vendors." } },
      { "@type": "Question", name: "How long does a typical project take?", acceptedAnswer: { "@type": "Answer", text: "Most website builds launch in 2–4 weeks. Automation and AI projects vary depending on scope, but we always start with a scoping call and give you a clear timeline before any work begins." } },
      { "@type": "Question", name: "Do you work with early-stage startups or only established companies?", acceptedAnswer: { "@type": "Answer", text: "Both. We work with founders shipping their first product and with established businesses automating years of manual process. Pricing and scope flex to match where you are." } },
      { "@type": "Question", name: "What's included in ongoing maintenance & support?", acceptedAnswer: { "@type": "Answer", text: "Monitoring, security updates, bug fixes, and small iterative improvements. Coverage and response times depend on the plan and scope — we outline specifics before work begins, with no surprise invoices." } },
      { "@type": "Question", name: "Can you integrate with tools we already use?", acceptedAnswer: { "@type": "Answer", text: "Yes — we regularly connect CRMs, payment processors, spreadsheets, internal databases, and third-party APIs into a single automated workflow. If it has an API (or even just a spreadsheet), we can likely wire it in." } },
      { "@type": "Question", name: "How does pricing work?", acceptedAnswer: { "@type": "Answer", text: "Every engagement starts with a free scoping call where we understand your goals and give you a fixed quote or a monthly retainer, depending on the type of work. No hourly surprises." } },
      { "@type": "Question", name: "Do you offer AI solutions even if we're not a tech company?", acceptedAnswer: { "@type": "Answer", text: "Absolutely — most of our AI work is for non-technical teams. Think automated customer replies, smart document processing, or internal copilots. We handle the engineering; you get the outcome." } },
      { "@type": "Question", name: "What happens after the project launches?", acceptedAnswer: { "@type": "Answer", text: "We don't disappear. Every build includes a handoff walkthrough, documentation, and the option to move into an ongoing maintenance & support plan so your product keeps improving after launch." } },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <HomeClient blogPosts={blogPosts} />
    </>
  );
}