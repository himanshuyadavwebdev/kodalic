export const DEMO_MODE = true;

export interface DemoTech {
  name: string;
  demo: true;
  label: string;
}

export const DEMO_TECHNOLOGIES: DemoTech[] = [
  { name: "Next.js", demo: true, label: "DEMO TECHNOLOGY" },
  { name: "React", demo: true, label: "DEMO TECHNOLOGY" },
  { name: "TypeScript", demo: true, label: "DEMO TECHNOLOGY" },
  { name: "Node.js", demo: true, label: "DEMO TECHNOLOGY" },
  { name: "Tailwind CSS", demo: true, label: "DEMO TECHNOLOGY" },
  { name: "PostgreSQL", demo: true, label: "DEMO TECHNOLOGY" },
  { name: "Supabase", demo: true, label: "DEMO TECHNOLOGY" },
  { name: "OpenAI", demo: true, label: "DEMO TECHNOLOGY" },
  { name: "GitHub", demo: true, label: "DEMO TECHNOLOGY" },
  { name: "Vercel", demo: true, label: "DEMO TECHNOLOGY" },
  { name: "Figma", demo: true, label: "DEMO TECHNOLOGY" },
  { name: "Docker", demo: true, label: "DEMO TECHNOLOGY" },
];

export interface DemoTestimonial {
  quote: string;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  demo: true;
  label: string;
}

export const DEMO_TESTIMONIALS: DemoTestimonial[] = [
  {
    quote: "DEMO TESTIMONIAL — Replace with real client feedback. This placeholder shows how testimonials will appear when verified.",
    name: "Demo Client One",
    company: "Demo Company One",
    role: "Demo Founder",
    verified: false,
    demo: true,
    label: "DEMO TESTIMONIAL",
  },
  {
    quote: "DEMO TESTIMONIAL — Replace with approved client feedback. Demonstrates carousel interaction and layout.",
    name: "Demo Client Two",
    company: "Demo Company Two",
    role: "Demo CEO",
    verified: false,
    demo: true,
    label: "DEMO TESTIMONIAL",
  },
  {
    quote: "DEMO TESTIMONIAL — Placeholder text for design testing. Will be replaced with genuine testimonial when available.",
    name: "Demo Client Three",
    company: "Demo Company Three",
    role: "Demo CTO",
    verified: false,
    demo: true,
    label: "DEMO TESTIMONIAL",
  },
  {
    quote: "DEMO TESTIMONIAL — Illustrative feedback showing role, company and quote hierarchy.",
    name: "Demo Client Four",
    company: "Demo Company Four",
    role: "Demo Product Lead",
    verified: false,
    demo: true,
    label: "DEMO TESTIMONIAL",
  },
  {
    quote: "DEMO TESTIMONIAL — Final placeholder demonstrating responsive and reduced-motion behavior.",
    name: "Demo Client Five",
    company: "Demo Company Five",
    role: "Demo Operations Head",
    verified: false,
    demo: true,
    label: "DEMO TESTIMONIAL",
  },
];

export interface DemoStat {
  value: number;
  suffix: string;
  label: string;
  demo: true;
}

export const DEMO_STATS: DemoStat[] = [
  { value: 120, suffix: "+", label: "DEMO PROJECTS — Replace with verified number", demo: true },
  { value: 94, suffix: "%", label: "DEMO SATISFACTION — Replace with verified number", demo: true },
  { value: 32, suffix: "", label: "DEMO HOURS SAVED — Replace with verified number", demo: true },
  { value: 5, suffix: "", label: "DEMO INTEGRATIONS — Replace with verified number", demo: true },
];

export interface DemoCaseStudy {
  slug: string;
  name: string;
  category: string;
  description: string;
  technologies: string[];
  outcome: string;
  verified: boolean;
  demo: true;
  label: string;
}

export const DEMO_CASE_STUDIES: DemoCaseStudy[] = [
  {
    slug: "demo-commerce-platform",
    name: "Demo Commerce Platform",
    category: "Web Application",
    description: "A demonstration commerce experience showing product discovery, checkout flow, and account management. DEMO PROJECT — Replace with verified Kodalic project.",
    technologies: ["Next.js", "React", "TypeScript"],
    outcome: "DEMO RESULT — Replace with verified outcome",
    verified: false,
    demo: true,
    label: "DEMO PROJECT",
  },
  {
    slug: "demo-business-automation-suite",
    name: "Demo Business Automation Suite",
    category: "Automation",
    description: "A demo automation workflow showing trigger, action, and approval steps for business operations.",
    technologies: ["Node.js", "PostgreSQL", "Tailwind CSS"],
    outcome: "DEMO RESULT — Replace with verified outcome",
    verified: false,
    demo: true,
    label: "DEMO PROJECT",
  },
  {
    slug: "demo-ai-operations-dashboard",
    name: "Demo AI Operations Dashboard",
    category: "AI",
    description: "A demo AI dashboard showing model status, data pipeline, and insights overview.",
    technologies: ["OpenAI", "Supabase", "TypeScript"],
    outcome: "DEMO RESULT — Replace with verified outcome",
    verified: false,
    demo: true,
    label: "DEMO PROJECT",
  },
  {
    slug: "demo-digital-product",
    name: "Demo Digital Product",
    category: "Websites",
    description: "A demo marketing website with CMS, analytics, and performance illustrations.",
    technologies: ["Next.js", "Tailwind CSS", "Vercel"],
    outcome: "DEMO RESULT — Replace with verified outcome",
    verified: false,
    demo: true,
    label: "DEMO PROJECT",
  },
  {
    slug: "demo-analytics-workspace",
    name: "Demo Analytics Workspace",
    category: "Web Application",
    description: "A demo analytics workspace showing charts, tables, and collaboration features.",
    technologies: ["React", "PostgreSQL", "Docker"],
    outcome: "DEMO RESULT — Replace with verified outcome",
    verified: false,
    demo: true,
    label: "DEMO PROJECT",
  },
];

export interface DemoBlogPost {
  slug: string;
  category: string;
  title: string;
  description: string;
  readingTime: string;
  author: string;
  date: string;
  avatar: string;
  verified: boolean;
  demo: true;
  label: string;
  body: string;
}

export const DEMO_BLOG_POSTS: DemoBlogPost[] = [
  {
    slug: "demo-ai-workflows",
    category: "AI",
    title: "DEMO: How AI Can Improve Business Workflows",
    description: "DEMO ARTICLE CONTENT — Replace with approved Kodalic editorial content. Shows AI workflow concepts.",
    readingTime: "6 min read",
    author: "Demo Author One",
    date: "January 10, 2026",
    avatar: "",
    verified: false,
    demo: true,
    label: "DEMO ARTICLE",
    body: "## Introduction\nDEMO ARTICLE BODY — Replace with verified content.\n\n### Key Points\n- Point one for demo\n- Point two for demo\n\n```js\n// demo code\nconsole.log('hello');\n```\n\nConclusion paragraph for demo.",
  },
  {
    slug: "demo-automation-first",
    category: "Automation",
    title: "DEMO: Automation First — Where to Start",
    description: "DEMO ARTICLE CONTENT — Replace with approved Kodalic editorial content.",
    readingTime: "5 min read",
    author: "Demo Author Two",
    date: "February 2, 2026",
    avatar: "",
    verified: false,
    demo: true,
    label: "DEMO ARTICLE",
    body: "## Overview\nDemo body content.\n\n- Item one\n- Item two\n\nMore paragraph.",
  },
  {
    slug: "demo-website-speed",
    category: "Engineering",
    title: "DEMO: What Makes a Website Fast in 2026",
    description: "DEMO ARTICLE CONTENT — Replace with approved Kodalic editorial content.",
    readingTime: "7 min read",
    author: "Demo Author Three",
    date: "March 15, 2026",
    avatar: "",
    verified: false,
    demo: true,
    label: "DEMO ARTICLE",
    body: "## Speed Checklist\nDemo content with list and code.\n\n```html\n<div>demo</div>\n```",
  },
];

export const DEMO_CONTACT = {
  email: "info@kodalic.com",
  phone: "+91 00000 00000",
  location: "Remote-first, working worldwide",
  availability: "We respond within one business day.",
  responseTime: "Typical reply time is under 24 hours on business days.",
  demo: true as const,
  label: "DEMO CONTACT",
};

export const DEMO_SOCIALS = [
  { label: "LinkedIn", href: "/demo/social/linkedin", demo: true, labelFull: "DEMO SOCIAL" },
  { label: "GitHub", href: "/demo/social/github", demo: true, labelFull: "DEMO SOCIAL" },
  { label: "Instagram", href: "/demo/social/instagram", demo: true, labelFull: "DEMO SOCIAL" },
  { label: "X", href: "/demo/social/x", demo: true, labelFull: "DEMO SOCIAL" },
  { label: "YouTube", href: "/demo/social/youtube", demo: true, labelFull: "DEMO SOCIAL" },
];

export const DEMO_LEGAL = [
  { slug: "privacy", title: "Privacy Policy", label: "DEMO LEGAL DOCUMENT" },
  { slug: "terms", title: "Terms of Service", label: "DEMO LEGAL DOCUMENT" },
  { slug: "cookies", title: "Cookie Policy", label: "DEMO LEGAL DOCUMENT" },
];
