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
  demo: boolean;
  label: string;
  image: string;
  href: string;
  tags: string[];
  delivered: string[];
}

export const DEMO_CASE_STUDIES: DemoCaseStudy[] = [
  {
    slug: "longeva-health-wellness",
    name: "Longeva Health & Wellness",
    category: "Health & Wellness",
    description: "A modern health and wellness website designed to present services, expertise, and consultation options with a calm, trustworthy visual experience. The project focuses on clear information architecture, professional presentation, and guiding visitors toward booking a consultation.",
    technologies: ["Web Design", "Healthcare", "Wellness"],
    outcome: "",
    verified: true,
    demo: false,
    label: "",
    image: "/case-studies/longeva.webp",
    href: "https://longeva-wbs.webflow.io/",
    tags: ["WEB DESIGN", "HEALTHCARE", "WELLNESS"],
    delivered: ["Premium health and wellness website", "Clear service presentation", "Trust-focused content structure", "Consultation-focused calls to action", "Responsive layouts for desktop and mobile"],
  },
  {
    slug: "athelas-private-care",
    name: "Athelas Private Care",
    category: "Private Healthcare",
    description: "A refined private healthcare platform built to make specialist care easier to explore and book. The website organizes medical specialties, doctors, appointments, packages, and patient information into a clear and approachable digital experience.",
    technologies: ["Web Development", "Healthcare", "UX/UI"],
    outcome: "",
    verified: true,
    demo: false,
    label: "",
    image: "/case-studies/athelas.webp",
    href: "https://athelas-template.webflow.io/",
    tags: ["WEB DEVELOPMENT", "HEALTHCARE", "UX/UI"],
    delivered: ["Multi-page private healthcare website", "Specialty and doctor discovery", "Structured appointment journey", "Service and package presentation", "Editorial content and healthcare resources"],
  },
  {
    slug: "dermato-skin-clinic",
    name: "Dermato Skin Clinic",
    category: "Dermatology & Aesthetics",
    description: "A modern dermatology website created to showcase advanced skin treatments and aesthetic services in a professional, visually engaging way. The experience makes it easy for visitors to explore treatments and move toward booking an appointment.",
    technologies: ["Web Design", "Dermatology", "Branding"],
    outcome: "",
    verified: true,
    demo: false,
    label: "",
    image: "/case-studies/dermato.webp",
    href: "https://dermato-wbs.webflow.io/",
    tags: ["WEB DESIGN", "DERMATOLOGY", "BRANDING"],
    delivered: ["Modern dermatology website", "Structured treatment and service pages", "Appointment-focused user journey", "Professional healthcare and aesthetic branding", "Responsive experience across devices"],
  },
  {
    slug: "arvynx-architecture-studio",
    name: "Arvynx Architecture Studio",
    category: "Architecture & Design",
    description: "A bold architecture and design website built to showcase projects, services, and the studio's creative approach. The experience combines strong visual storytelling with structured project discovery and service information.",
    technologies: ["Web Design", "Architecture", "Portfolio"],
    outcome: "",
    verified: true,
    demo: false,
    label: "",
    image: "/case-studies/arvynx.webp",
    href: "https://arvynx.webflow.io/",
    tags: ["WEB DESIGN", "ARCHITECTURE", "PORTFOLIO"],
    delivered: ["High-impact architecture portfolio", "Project showcase and gallery experience", "Service and expertise presentation", "Strong visual storytelling", "Responsive portfolio layouts"],
  },
  {
    slug: "vistahaven-real-estate",
    name: "VistaHaven Real Estate",
    category: "Real Estate",
    description: "A comprehensive real estate platform designed to help visitors explore luxury residences, sustainable properties, vacation homes, and investment opportunities. The website combines property discovery, agent information, and service content into one polished experience.",
    technologies: ["Web Development", "Real Estate", "UX/UI"],
    outcome: "",
    verified: true,
    demo: false,
    label: "",
    image: "/case-studies/vistahaven.webp",
    href: "https://vistahaven.webflow.io/",
    tags: ["WEB DEVELOPMENT", "REAL ESTATE", "UX/UI"],
    delivered: ["Real estate website and property discovery experience", "Property listing layouts", "Agent and service sections", "Investment and rental information", "Responsive design for all screen sizes"],
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
