export type AdminNavigationItem = {
  label: string;
  href: string;
  permission: string;
  icon: string;
};

export const adminNavigation: AdminNavigationItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    permission: "admin.access",
    icon: "dashboard",
  },
  {
    label: "Leads",
    href: "/admin/leads",
    permission: "leads.view",
    icon: "leads",
  },
  {
    label: "Projects",
    href: "/admin/projects",
    permission: "projects.view",
    icon: "projects",
  },
  {
  label: "Case Studies",
  href: "/admin/case-studies",
  permission: "case_studies.view",
  icon: "case-studies",
},
  {
    label: "Blog",
    href: "/admin/blog",
    permission: "blog.view",
    icon: "blog",
  },
  {
    label: "Content",
    href: "/admin/content",
    permission: "content.view",
    icon: "content",
  },
  {
    label: "Media",
    href: "/admin/media",
    permission: "media.view",
    icon: "media",
  },
  {
    label: "SEO",
    href: "/admin/seo",
    permission: "seo.view",
    icon: "seo",
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    permission: "analytics.view",
    icon: "analytics",
  },
];