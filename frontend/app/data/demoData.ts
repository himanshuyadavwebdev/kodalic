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
  role?: string;
  verified: boolean;
  demo: boolean;
  label: string;
}

export const DEMO_TESTIMONIALS: DemoTestimonial[] = [
  {
    quote: "We wanted a website that looked professional but was simple for our patients to use. Kodalic delivered what we needed and made the whole process pretty easy. I liked that they listened to my ideas instead of just pushing their own design. The finished website is clean and professional, exactly how I wanted my website to look.",
    name: "Dr. Rohan Mehta",
    company: "WellSpring Family Clinic",
    verified: true,
    demo: false,
    label: "",
  },
  {
    quote: "I had a positive experience working with Kodalic. At first, I was a little nervous about getting a new website because I didn’t want anything that was hard to manage or expensive. They were very patient with our changes and explained everything very clearly. Pragya was very responsive throughout the project, and the final product is exactly what we wanted in terms of a simple, professional website.",
    name: "Dr. Ananya Sharma",
    company: "Pearl Dental Studio",
    verified: true,
    demo: false,
    label: "",
  },
  {
    quote: "Ruchi was so easy to work with from beginning to end. They took the time to learn about our clinic before starting on the website, and that made a difference in the end result. Ruchi responded quickly when we asked questions and made the changes we asked for.",
    name: "Dr. Arjun Desai",
    company: "Prime Orthopaedic Centre",
    verified: true,
    demo: false,
    label: "",
  },
  {
    quote: "We reached out to Kodalic mainly to improve our website and WhatsApp support and make it easier for buyers to contact us. They built the website to meet that requirement, not just to improve its appearance. I liked their approach, and communication was good during the project. The website now makes our business look much more professional.",
    name: "Abhinav Chaurasiya",
    company: "HomeSquare Realty",
    verified: true,
    demo: false,
    label: "",
  },
  {
    quote: "We had a lot of properties to show, and we wanted something less messy. Kodalic did a good job with the website design and making the property information easy to understand. The photos and details are much better now. They were also open to feedback and made a couple of minor changes without extra charges.",
    name: "Krishna Shah",
    company: "PrimeKey Properties",
    verified: true,
    demo: false,
    label: "",
  },
  {
    quote: "Kodalic made our website and integrated WhatsApp automation to handle customer inquiries. In fact, the WhatsApp part has been the most useful for us. We get quite a few inquiries about car availability, pricing, and booking details. Most of these messages used to be answered manually. The website also turned out really well, and it is much easier for customers to look at our cars and get in touch with us. During the work, we requested a few changes, and Sahil was quite cooperative with me. Good experience overall with Kodalic, and I am happy with the work.",
    name: "Amit Verma",
    company: "Aradhya Car Rentals",
    verified: true,
    demo: false,
    label: "",
  },
];

export interface DemoStat {
  value: number;
  suffix: string;
  label: string;
  demo: boolean;
}

export const DEMO_STATS: DemoStat[] = [
  { value: 123, suffix: "+", label: "Clients Served", demo: false },
  { value: 60, suffix: "+", label: "Doctors Served in India", demo: false },
  { value: 98, suffix: "%", label: "Satisfaction Rate", demo: false },
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
    href: "https://longeva-dermat.vercel.app/",
    tags: ["WEB DESIGN", "HEALTHCARE", "WELLNESS"],
    delivered: ["Premium health and wellness website", "Clear service presentation", "Trust-focused content structure", "Consultation-focused calls to action", "Responsive layouts for desktop and mobile"],
  },
  {
    slug: "healix-health-tracking",
    name: "Healix",
    category: "Digital Health & Wellness",
    description: "A modern health tracking and wellness platform designed to help users monitor vital signs, activity levels, and health patterns in real time. The website presents features, pricing plans, appointment booking, and success stories in a clean, motivating digital experience.",
    technologies: ["Web Development", "Healthcare", "UX/UI"],
    outcome: "",
    verified: true,
    demo: false,
    label: "",
    image: "/case-studies/healix.webp",
    href: "https://healixx-mirrored.vercel.app/",
    tags: ["WEB DEVELOPMENT", "HEALTHCARE", "UX/UI"],
    delivered: ["Multi-page health & wellness website", "Feature and plan discovery", "Structured appointment booking journey", "Pricing and subscription presentation", "Patient success story showcase"],
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
    href: "https://dermato-dermats.vercel.app/",
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
    href: "https://arvynx.vercel.app/",
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
    href: "https://vistahaven-olive.vercel.app/",
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
  demo: boolean;
  label: string;
  image: string;
  body: string;
}

export const DEMO_BLOG_POSTS: DemoBlogPost[] = [
  {
    slug: "website-development-cost-india-2026",
    category: "Pricing",
    title: "How Much Does Website Development Cost in India in 2026?",
    description: "See realistic 2026 website development costs in India, what changes the quote, hidden costs, and how to compare proposals.",
    readingTime: "7 min read",
    author: "Kodalic Team",
    date: "May 2026",
    avatar: "",
    verified: true,
    demo: false,
    label: "",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=85",
    body: `You got three website quotes, and none of them look remotely alike. One says ₹20,000, another says ₹65,000, and the third is above ₹1,00,000 — yet all three call the project a business website. That is confusing because the label tells you almost nothing about the work underneath it. Keep reading and you'll see what actually changes the number, what to ask before accepting a quote, and where your budget is likely to make sense.

Why different quotes can all be reasonable

The frustration usually starts when you compare totals instead of scope. One proposal may include content, custom design, SEO setup, mobile testing and several revisions, while another gives you the pages and leaves everything else outside the quote.

That doesn't mean the expensive proposal is better. It means the two businesses may be selling different amounts of work.

Quick Answer

For 2026, a simple landing page can start around ₹8,000–₹25,000, while a more complete business website often falls around ₹25,000–₹1,50,000. E-commerce and custom web applications can move into several lakhs because payments, product data, user accounts, integrations and custom logic require more design, development and testing.

The easiest way to use these figures is to treat them as planning ranges, not promises.

Website type | Indicative range | Typical use

Landing page | ₹8,000–₹25,000 | Campaign or lead page

Business website | ₹25,000–₹1,50,000 | Startup or small business

E-commerce | ₹60,000–₹3,00,000+ | Online product sales

Custom web app | ₹2,00,000–₹15,00,000+ | Portal or workflow

Indicative pricing: Market planning ranges for India in 2026. Final pricing depends on scope, technology, design, content, integrations, testing and the provider. GST may apply separately.

What actually changes a website quote?

Here is what most proposals don't explain clearly enough: page count is only one part of the workload. A five-page site with a booking flow can require more work than a ten-page site built from repeated templates.

• Custom design and unique page layouts

• Content writing, editing and image preparation

• CMS setup and editable sections

• Forms, WhatsApp, booking, payment or CRM integrations

• Technical SEO, analytics and tracking setup

• Mobile, browser and form testing

• Post-launch fixes and support

💡 Worth remembering Don't start by asking what you can spend. Start by deciding what the website needs to do.

How should you compare two quotes?

Imagine two proposals both say “10-page business website.” Before choosing the cheaper one, ask what happens to the content, who builds the mobile version, how many revisions are included, whether analytics is installed, and who owns the website accounts after launch.

A useful quote should let you explain what each major line item buys. If you cannot explain the difference, you are not comparing like-for-like projects.

A typical scenario

A small clinic receives quotes of ₹30,000 and ₹85,000. The ₹30,000 proposal covers six pages and a contact form. The ₹85,000 proposal includes appointment flow, service pages, content support, analytics, mobile QA and a defined handover.

Neither number is automatically right. The clinic has to decide whether those extra pieces solve a real business need.

What costs can sit outside development?

The development fee is not always the full cost of owning a website. Domain renewal, hosting, business email, paid tools, content production, maintenance and GST can sit outside the headline number.

Ask for these recurring or separate costs before you approve the project. A low build price can become less attractive if important operating costs appear later.

Mistakes to avoid before signing

• Choosing the lowest number without comparing scope

• Assuming revisions are unlimited

• Ignoring ownership of domain, hosting and website files

• Treating SEO as automatic because a website is being built

• Forgetting mobile and form testing

• Approving a redesign or rebuild without a content plan

Your pre-approval checklist

• Can I list every page and feature included?

• Who supplies and uploads content?

• How many revision rounds are included?

• Is GST included or extra?

• Who owns the domain, hosting, source files and licences?

• What happens after launch?

FAQ

How much does a 5-page website cost in India?

A basic five-page website may fall around ₹20,000–₹60,000, while a more custom build can be higher. Design, content, CMS, SEO setup, forms and revisions often matter more than the page count itself.

Is ₹20,000 enough for a business website?

It can be enough for a focused, template-led website with limited customisation. If you need custom UX, extensive content work, integrations or more testing, plan for a higher budget.

Does website development include GST?

Not always. Ask whether the quoted price includes applicable GST before comparing proposals, because two identical-looking totals may have different tax treatment.

How much does an e-commerce website cost in India?

A smaller e-commerce build may start around ₹60,000, while a custom store can reach ₹3,00,000+ depending on products, checkout, payments, inventory and integrations.

How long does website development take?

A simple website may take days to a few weeks. Larger business sites and custom platforms can take several weeks or months depending on scope, content readiness and approvals.

Should I choose a freelancer or agency?

Choose based on the work required and the support you need. Compare deliverables, communication, ownership and maintenance rather than assuming one provider type is always better.

What to do next

💡 Next step Not sure what your website should cost? Share your business type, required pages and key features with Kodalic, and we can help scope the project before you commit to a quote.`,
  },
  {
    slug: "choose-web-development-company-india",
    category: "Guide",
    title: "How to Choose a Web Development Company in India",
    description: "Learn how to compare web development companies in India by scope, ownership, QA, support, communication and pricing.",
    readingTime: "6 min read",
    author: "Kodalic Team",
    date: "May 2026",
    avatar: "",
    verified: true,
    demo: false,
    label: "",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=85",
    body: `You got three proposals. One is cheap, one is expensive, and all three promise a professional website. So which one should you trust? The difficult part is that a polished proposal can hide very different development practices, ownership terms and post-launch support. This guide gives you a practical way to compare companies before you sign.

The proposal is not the product

Most buyers compare the headline price first because it is easy. But the real differences often sit in discovery, design ownership, revision limits, technical SEO, testing, source-code access and what happens after launch.

If this sounds familiar, you're not alone. You don't need to become a developer; you need enough clarity to judge whether the company understands the project.

Quick Answer

Choose the company that can clearly explain what it will build, why it is needed, what you will own, how it will be tested and what support exists after launch. A lower price can be sensible for a simple project, while a higher price may be justified by custom design, integrations or more project management.

What should you look for first?

Start with the boring questions. They are often the ones that save you the most trouble later.

• A clear scope rather than a vague package

• Relevant work that resembles your business problem

• A defined process for discovery, design, development and QA

• Transparent ownership of domain, hosting, files and licences

• Clear revision, timeline and payment terms

• A support plan after launch

If a company can explain these points without hiding behind technical jargon, that's a good sign. You're buying a process as much as you're buying a website.

💡 Worth remembering Don't choose a company because its own website looks impressive. Choose it because it can explain your project clearly.

How do you compare two proposals?

Put both proposals into the same checklist. Ask each company the same questions about pages, integrations, content, SEO, revisions and handover. Suddenly, the price difference becomes much easier to understand.

The easiest way to use these figures is to treat them as planning ranges, not promises.

Check | What to ask | Why it matters

Scope | What is included? | Prevents surprises

Ownership | Who owns accounts? | Protects your business

QA | How is it tested? | Reduces launch issues

Support | What happens after launch? | Clarifies future help

Indicative pricing: This is a buyer's comparison framework, not a guarantee of quality. Complex projects may need additional technical and legal checks.

Questions worth asking before you hire

1. Can you walk me through the exact scope?

2. Who writes and uploads the content?

3. How many design revisions are included?

4. What platform or stack will you use, and why?

5. Will I have administrator and account ownership?

6. How will mobile, browser and form testing be handled?

7. What is included after launch?

A typical scenario

A growing real-estate business compares two companies. Company A offers a low fixed price but gives a generic page list and no ownership details. Company B costs more, maps the enquiry journey, explains CMS access, includes redirects and QA, and defines handover.

The second proposal may be the better fit because the business can see what it is actually buying. The point isn't to spend more; it is to remove uncertainty.

Red flags that deserve a second look

• “Unlimited” promises with no written scope

• No ownership or handover terms

• A price before anyone understands your requirements

• No clear testing process

• Large deposits with unclear milestones

• Claims of guaranteed Google rankings

How to choose without overthinking it

You don't need to score every company out of 100. Ask whether the team understands your customer, can explain the build in plain English and has a process for catching problems before launch.

Then compare the commercial terms. The right choice is usually the proposal you can understand, not the one with the most impressive vocabulary.

FAQ

How do I choose a website development company in India?

Compare scope, relevant experience, ownership, testing, communication and post-launch support. Price should be one factor, not the entire decision.

What questions should I ask a web development company?

Ask about scope, technology, content, revisions, SEO setup, ownership, timeline, QA and support. These answers make proposals much easier to compare.

Should I hire a freelancer or web development company?

A freelancer may suit a smaller, well-defined project. A company or studio can make more sense when you need design, development, project management and ongoing support together.

How much should a web development company charge?

There is no universal rate. Indian projects vary widely because a simple business site and a custom platform require very different amounts of work.

Who should own the website after development?

Your business should normally control its domain, hosting, website files and important third-party accounts. Confirm the ownership and handover terms before signing.

Can a web development company guarantee Google rankings?

Be cautious. A developer can build a search-friendly website, but no legitimate provider can guarantee a specific Google ranking.

What to do next

💡 Next step Comparing web development companies? Share your requirements or proposals with Kodalic, and we can help turn them into a clear scope you can evaluate.`,
  },
  {
    slug: "website-cost-india-pricing-guide",
    category: "Pricing",
    title: "Website Cost in India: 2026 Pricing Guide",
    description: "Understand website cost in India in 2026, from landing pages to business sites, e-commerce and custom web apps.",
    readingTime: "8 min read",
    author: "Kodalic Team",
    date: "May 2026",
    avatar: "",
    verified: true,
    demo: false,
    label: "",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=85",
    body: `“How much does a website cost?” sounds like a simple question until you try to budget for one. A landing page, a business website and an e-commerce store may all be called a website, but they solve very different problems. This guide gives you a way to plan the total budget instead of guessing from one development quote.

Why one average price is misleading

The useful question isn't “What is the average website price?” It is “What kind of website am I actually budgeting for?” A simple site may need only a few pages and a contact path, while a growing company may need content management, lead tracking, integrations and a larger content structure.

Quick Answer

For 2026, indicative Indian market ranges can run from roughly ₹8,000–₹25,000 for a landing page to ₹2,00,000–₹15,00,000+ for a custom web application. A small-business or CMS website can often fall around ₹25,000–₹1,50,000 depending on design, content and functionality.

The easiest way to use these figures is to treat them as planning ranges, not promises.

Type | Range | Best for

Landing page | ₹8,000–₹25,000 | Lead capture

Business site | ₹25,000–₹1,50,000 | SMBs

E-commerce | ₹60,000–₹3,00,000+ | Online sales

Web app | ₹2,00,000–₹15,00,000+ | Custom workflows

Indicative pricing: Indicative 2026 India planning ranges only. Actual pricing varies by scope, provider, technology, content, integrations, testing and ongoing requirements.

What budget makes sense for your business?

Startup

If you're validating a new business, a focused website can be more useful than a large build. Prioritise the offer, core pages, enquiry path and basic tracking first. A practical starting budget may be around ₹20,000–₹60,000 when the scope is controlled.

Small Business

A small business often needs a stronger service structure, mobile-first design, editable content and several enquiry paths. A budget around ₹40,000–₹1,00,000 can cover a meaningful build, depending on how custom the work is.

Growing Company

As the business grows, the website may need more landing pages, integrations, content workflows, analytics and better conversion paths. Budgets can move toward ₹75,000–₹2,00,000+ depending on requirements.

Established Brand

Larger organisations may be budgeting for migrations, multilingual content, advanced integrations, custom systems, e-commerce complexity or strict QA. Here, the project should be scoped before a useful number is given.

The total website cost formula

A realistic website budget has more than a development line. Think of the project as five buckets: strategy, design, development, content and ongoing operation.

• Strategy: goals, audience, structure and content planning

• Design: UX, layouts, brand application and responsive states

• Development: CMS, features, integrations and testing

• Content: copy, editing, photography, graphics and uploads

• Operation: domain, hosting, email, maintenance, tools and applicable GST

💡 Worth remembering Budget for the website you need to operate, not just the website you need to launch.

What can sit outside the build fee?

Domain renewal, hosting, business email, paid plugins, third-party tools, content production and maintenance can continue after launch. They may be small individually, but they matter when you're planning the first year of ownership.

A typical scenario

A startup plans to spend ₹40,000. During planning, it adds a blog, five service pages, lead tracking and a WhatsApp enquiry flow. Instead of forcing every feature into the original number, the sensible move is to decide what must launch now and what can wait.

Where should you start if you've never built a website?

Start with the customer, not the technology. Write down what you sell, who buys it, the questions they ask before buying, and the action you want them to take. Then turn those answers into pages and features.

That gives you a scope you can discuss with a developer. It also makes the quote easier to compare because you are no longer asking for “a website” with no definition.

Common budgeting mistakes

• Budgeting only for development

• Adding features without removing lower-priority work

• Ignoring content production

• Forgetting recurring tools and hosting

• Assuming every business needs a custom web app

• Treating SEO as something that can be added without planning

FAQ

What is the average website cost in India?

There isn't one useful average because website types are too different. For many small businesses, a practical planning range is around ₹25,000–₹1,50,000, while e-commerce and custom applications can go much higher.

How much should a startup budget for a website?

A focused startup website may fit around ₹20,000–₹60,000 when the scope is limited to the pages and enquiry flow needed for launch. Add budget when you need custom UX, content production, integrations or advanced tracking.

How much does an e-commerce website cost in India?

A smaller store may start around ₹60,000, while custom stores can reach ₹3,00,000+ depending on catalogue size, checkout, payments, inventory and integrations.

Is hosting included in website cost?

Sometimes, but not always. Hosting is usually a recurring operating cost, so confirm whether the first year is included and what the renewal price will be.

Is GST included in website prices?

It depends on how the provider quotes. Ask whether the price is inclusive or exclusive of applicable GST before comparing budgets.

Why do website quotes vary so much?

Because “website” can mean anything from a simple landing page to a custom application. Design, content, integrations, testing and the amount of custom work can change the workload dramatically.

What to do next

💡 Next step Want a realistic website budget before you start? Tell Kodalic what your business needs the website to do, and we can help turn that into a practical scope and estimate.`,
  },
  {
    slug: "website-redesign-cost-india",
    category: "Redesign",
    title: "Website Redesign Cost & Process in India 2026",
    description: "Learn website redesign costs in India, when to redesign, SEO risks, process steps and what to budget for.",
    readingTime: "6 min read",
    author: "Kodalic Team",
    date: "May 2026",
    avatar: "",
    verified: true,
    demo: false,
    label: "",
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1600&q=85",
    body: `Your website can look perfectly fine and still be costing you enquiries. Maybe the pages are hard to update, the mobile experience feels cramped, or visitors reach the contact page and stop. A redesign isn't simply a new colour palette — it is a chance to fix the parts of the website that are getting in your business's way.

Why redesigns often start in the wrong place

It is tempting to start by changing the homepage because that is what everyone sees. But if the real problem is unclear messaging, weak navigation, poor mobile UX or lost search traffic, a visual refresh alone won't solve it.

The first job is finding what needs to change and what should stay.

Quick Answer

A website redesign in India can range from roughly ₹25,000 for a focused refresh to ₹1,50,000+ for a larger custom redesign. Advanced e-commerce or application work can cost more when the redesign also changes functionality, integrations, content structure or technology.

The easiest way to use these figures is to treat them as planning ranges, not promises.

Redesign type | Range | Typical scope

Visual refresh | ₹25,000–₹60,000 | UI and layout

Business redesign | ₹50,000–₹1,50,000 | UX, content, structure

Advanced redesign | ₹1,50,000+ | Custom UX, integrations

Indicative pricing: Indicative planning ranges only. A redesign can cost more when it includes migrations, new functionality, large content volumes, redirects, integrations or e-commerce changes.

When does a redesign make sense?

• The site is difficult to use on mobile

• Visitors cannot quickly understand what you sell

• Important pages are hard to find

• The CMS is difficult for your team to manage

• Old URLs or content are hurting search visibility

• Forms, WhatsApp or booking flows create friction

• The current technology blocks needed improvements

What does a good redesign process look like?

1. Audit the existing website and business goals.

2. Map pages, content and important URLs.

3. Plan the new information architecture.

4. Design key templates and conversion paths.

5. Build and migrate content carefully.

6. Test mobile, forms, links, tracking and redirects.

7. Launch, monitor and fix issues.

Why SEO needs attention during a redesign

Changing URLs, page structure and content can affect search visibility if handled carelessly. Preserve important URLs where possible, create appropriate redirects when they change, check metadata and make sure search engines can still crawl the new structure.

This is why a redesign should not be treated as a purely visual project. A nicer homepage is useful; keeping valuable pages discoverable is part of the job too.

💡 Worth remembering Never launch a redesigned website by treating the old website as disposable. Your existing URLs and useful content may contain business and search value.

A typical scenario

An established local service company has a five-year-old website. It receives enquiries, but the mobile pages are difficult to navigate and the services are buried under generic labels.

The redesign keeps useful pages, simplifies the menu, rewrites key service sections and creates clearer enquiry paths instead of rebuilding everything blindly.

Redesign mistakes to avoid

• Changing URLs without a redirect plan

• Deleting useful pages before checking their value

• Redesigning visuals before fixing information architecture

• Launching without testing forms and WhatsApp links

• Forgetting analytics and conversion tracking

• Assuming a new design automatically improves conversions

Your redesign checklist

• List your highest-value pages

• Record important URLs before development

• Review current analytics and search data

• Identify pages that already generate enquiries

• Plan redirects before launch

• Test every form and WhatsApp link

• Check mobile layouts before launch

FAQ

How much does it cost to redesign a website in India?

A focused redesign may start around ₹25,000–₹60,000, while a larger business redesign can reach ₹50,000–₹1,50,000+. Custom functionality and migrations can push the cost higher.

Is it cheaper to redesign or build a new website?

It depends on the existing technology and content. If the foundation is usable, redesigning can reduce unnecessary rebuild work; if the platform blocks important improvements, rebuilding may make more sense.

Will a website redesign affect SEO?

It can. URL changes, content changes and technical changes can affect search visibility, so redirects, metadata, internal links and crawlability should be planned before launch.

How long does a website redesign take?

A focused refresh may take a few weeks. A larger redesign involving content, custom development and migration can take several weeks or months.

Should I redesign my website if it still looks good?

Yes, if it is difficult to use, hard to update, weak on mobile or failing to guide visitors toward enquiries. Visual age is only one reason to redesign.

What should I keep from my old website?

Keep useful content, valuable URLs, strong pages and important business information unless there is a clear reason to replace them. Audit first, then decide what changes.

What to do next

💡 Next step If your current website feels harder to use than it should, share the URL with Kodalic and we can help identify what should be redesigned before you spend on a rebuild.`,
  },
  {
    slug: "high-converting-business-website",
    category: "Strategy",
    title: "How to Build a High-Converting Business Website",
    description: "Build a business website that explains your offer, earns trust and makes enquiries easier with a practical conversion framework.",
    readingTime: "7 min read",
    author: "Kodalic Team",
    date: "May 2026",
    avatar: "",
    verified: true,
    demo: false,
    label: "",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=85",
    body: `A website can look polished and still leave visitors wondering what to do next. If your headline is vague, your services are buried and your enquiry button is hard to find, more traffic won't automatically fix the problem. A high-converting business website starts by making the next step obvious to the right visitor.

Traffic is not always the first problem

Businesses often focus on getting more visitors before checking what happens to the people already arriving. If visitors cannot understand the offer, trust the business or contact you easily, the website is leaking opportunities before marketing gets a chance to work.

Quick Answer

Build around one clear customer journey: understand the offer, see why the business is credible, find the relevant service, answer common objections and take an easy next step. For many Indian businesses, that next step can be a form, call, booking flow or WhatsApp conversation depending on how customers actually buy.

What should a high-converting homepage do?

The first screen should tell the visitor what you do, who it is for and what they can do next. Don't make people decode a clever slogan before they understand the business.

• Clear value proposition

• Specific service or product categories

• Trust signals that are actually true

• Relevant proof or examples

• One primary action

• Easy mobile navigation

• Fast access to WhatsApp or enquiry where appropriate

💡 Worth remembering A conversion-focused website does not need more buttons. It needs a clearer reason to click the right one.

How should you structure the pages?

The easiest way to use these figures is to treat them as planning ranges, not promises.

Page | Main job | Useful element

Home | Explain and route | Clear CTA

Service | Answer intent | Proof and FAQs

About | Build trust | People and story

Contact | Reduce friction | Form, phone, WhatsApp

Blog | Capture questions | Helpful articles

Indicative pricing: This is a practical starting structure, not a universal template. Your business may need product, location, booking or comparison pages.

What makes a website easier to trust?

Trust is usually built from specific information, not adjectives. Show what you actually do, explain the process, identify the business, answer practical questions and make important details easy to verify.

Avoid filling the page with claims such as “best”, “leading” or “trusted” unless you can substantiate them. A clear service explanation often does more for trust than a paragraph of praise.

Where does WhatsApp fit?

For many Indian businesses, WhatsApp is already part of how customers ask questions and make decisions. If it genuinely fits the buying process, make the path easy — but don't replace every useful detail with “Message us”.

A typical scenario: what changes when the journey is clearer?

A small home-services company gets steady website visits but few enquiries. The old homepage lists ten services, has a generic headline and hides the phone number in the footer.

The new version leads with the main customer problem, groups services clearly, adds specific proof and places an enquiry option where visitors naturally need it. The important change isn't a louder button; it is that the visitor no longer has to work out what to do.

A practical conversion framework

Think of the framework as a sequence, not a checklist you paste onto every website. First make the offer clear. Then remove the doubts that stop a buyer. Finally make the next action easy.

1. Clarify the visitor and the problem.

2. Explain the offer in plain English.

3. Show evidence that supports the claim.

4. Answer the questions that block a decision.

5. Give one obvious next step.

6. Measure enquiries and improve the weak point.

What should you measure after launch?

Don't judge the site only by page views. The useful signals are the actions that connect to the business.

• Form submissions

• Qualified calls or WhatsApp enquiries

• Booking completions

• Top landing pages

• Important page exits

• Search queries that bring relevant visitors

What the second month should look like

After launch, look for friction rather than immediately redesigning everything. If visitors reach a service page but rarely start an enquiry, inspect that page's offer, proof, questions and CTA before changing the whole website.

That small feedback loop is often more useful than adding another animation, popup or button. Build the first version around a clear customer journey, then improve the part that is actually underperforming.

FAQ

What makes a business website high converting?

It makes the offer clear, builds trust, answers common objections and gives visitors an easy next step. The design supports that journey instead of distracting from it.

How many CTAs should a website have?

A page can repeat the same primary action in sensible places, but it should still have a clear main goal. Too many competing actions can make the next step harder to choose.

Should I add WhatsApp to my business website?

If customers already use WhatsApp to ask questions or start enquiries, it can be useful. Give visitors enough information first so the button supports the decision rather than replacing it.

Does a beautiful website convert better?

Visual quality can improve trust and usability, but appearance alone doesn't create conversions. Messaging, structure, speed, mobile UX and the enquiry path matter too.

How many pages should a business website have?

There is no ideal number. Create the pages needed to answer important customer questions and search intent, then group related information instead of forcing everything onto one page.

How do I improve website conversions?

Start with the page where relevant visitors arrive most often. Check whether the offer is clear, the next step is obvious and the page answers the questions that prevent enquiries.

What to do next

💡 Next step Want to turn your website into a clearer enquiry path? Share your business and current website with Kodalic, and we can help scope the highest-impact improvements.`,
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
  { label: "Instagram", href: "https://www.instagram.com/kodalic_?igsi=MXJ6dzRoN202MTRnYQ==", demo: false, labelFull: "" },
  { label: "Company LinkedIn", href: "https://www.linkedin.com/company/kodalic/", demo: false, labelFull: "" },
  { label: "Founder LinkedIn", href: "https://www.linkedin.com/in/aayush-sahu-0a6236424", demo: false, labelFull: "" },
  { label: "X", href: "https://x.com/Kodalic_", demo: false, labelFull: "" },
];

export const DEMO_LEGAL = [
  { slug: "privacy", title: "Privacy Policy", label: "DEMO LEGAL DOCUMENT" },
  { slug: "terms", title: "Terms of Service", label: "DEMO LEGAL DOCUMENT" },
  { slug: "cookies", title: "Cookie Policy", label: "DEMO LEGAL DOCUMENT" },
];
