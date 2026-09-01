"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { createClient } from "../../lib/supabase/client";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

type ServerNavItem = {
  label: string;
  href: string;
  permission: string;
  icon: string;
};

function DashboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-full w-full"
    >
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10.5V20h14v-9.5" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

function LeadsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-full w-full"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20c.5-3.5 2.4-5.5 5.5-5.5s5 2 5.5 5.5" />
      <circle cx="17" cy="9" r="2.3" />
      <path d="M15 14.5c2.8.2 4.5 2 5 4.5" />
    </svg>
  );
}

function ProjectsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-full w-full"
    >
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M8 6V4h8v2" />
      <path d="M3 11h18" />
    </svg>
  );
}

function BlogIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-full w-full"
    >
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

function ContentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-full w-full"
    >
      <path d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16v4Z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  );
}

function MediaIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-full w-full"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8" cy="9" r="1.5" />
      <path d="m4 17 5-5 3.5 3.5 2.5-2.5 5 5" />
    </svg>
  );
}

function SeoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-full w-full"
    >
      <path d="M4 19V10" />
      <path d="M10 19V5" />
      <path d="M16 19v-8" />
      <path d="M22 19V3" />
      <path d="m4 7 6-2 6 3 6-5" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-full w-full"
    >
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 15 3-4 3 2 5-7" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-full w-full"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-2.6V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.6-1H6v-2.6h.4A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h2.6V5a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2V14h-.2a1.7 1.7 0 0 0-1.6 1Z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-full w-full"
    >
      <path d="M10 5H5v14h5" />
      <path d="M13 8l4 4-4 4" />
      <path d="M17 12H9" />
    </svg>
  );
}

const mainNavigation: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <DashboardIcon />,
  },
  {
    label: "Leads",
    href: "/admin/leads",
    icon: <LeadsIcon />,
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: <ProjectsIcon />,
  },
  {
    label: "Blog",
    href: "/admin/blog",
    icon: <BlogIcon />,
  },
  {
    label: "Content",
    href: "/admin/content",
    icon: <ContentIcon />,
  },
  {
    label: "Media",
    href: "/admin/media",
    icon: <MediaIcon />,
  },
  {
    label: "SEO",
    href: "/admin/seo",
    icon: <SeoIcon />,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: <AnalyticsIcon />,
  },
];

const settingsNavigation: NavItem[] = [
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <SettingsIcon />,
  },
];

type AdminSidebarProps = {
  name: string;
  email: string;
  role: string;
  navigation: ServerNavItem[];
};
function NavigationIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "dashboard":
      return <DashboardIcon />;

    case "leads":
      return <LeadsIcon />;

    case "projects":
      return <ProjectsIcon />;

    case "blog":
      return <BlogIcon />;

    case "content":
      return <ContentIcon />;

    case "media":
      return <MediaIcon />;

    case "seo":
      return <SeoIcon />;

    case "analytics":
      return <AnalyticsIcon />;

    default:
      return null;
  }
}
export default function AdminSidebar({
  name,
  email,
  role,
  navigation,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    if (signingOut) {
      return;
    }

    setSigningOut(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out failed:", error);
      setSigningOut(false);
      return;
    }

    router.replace("/admin/login");
    router.refresh();
  }

  const avatarLetter = name?.trim() ? name.trim().charAt(0).toUpperCase() : "A";

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-[#0b1120] text-white">
      {/* Brand */}
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-10 w-10 items-center justify-center">
          <div className="text-4xl font-bold italic leading-none text-[#6d7cff]">
            K
          </div>
        </div>

        <span className="text-xl font-semibold tracking-tight">KODALIC</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-6">
        {/* Main Navigation */}
        <p className="mb-3 px-3 text-[11px] font-medium uppercase tracking-wider text-white/40">
          Main
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#5b3df5]/30 text-white shadow-sm"
                    : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <span
                  className={`h-5 w-5 shrink-0 ${
                    isActive ? "text-[#a78bfa]" : "text-white/60"
                  }`}
                >
                  <NavigationIcon icon={item.icon} />
                </span>

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Settings Navigation */}
        <p className="mb-3 mt-8 px-3 text-[11px] font-medium uppercase tracking-wider text-white/40">
          Settings
        </p>

        <nav className="space-y-1">
          {settingsNavigation.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#5b3df5]/30 text-white"
                    : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <span
                  className={`h-5 w-5 shrink-0 ${
                    isActive ? "text-[#a78bfa]" : "text-white/60"
                  }`}
                >
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User + Sign Out */}
      <div className="border-t border-white/10 p-3">
        {/* User */}
        <div className="mb-2 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6845e8] text-sm font-semibold uppercase">
            {avatarLetter}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{name || "Admin"}</p>

            <p className="truncate text-xs text-white/45">
              {role || "Administrator"}
            </p>

            <p className="truncate text-[10px] text-white/30">{email}</p>
          </div>
        </div>

        {/* Sign Out */}
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          aria-label="Sign out"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/70 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="h-5 w-5 shrink-0">
            <LogoutIcon />
          </span>

          <span>{signingOut ? "Signing out..." : "Sign out"}</span>
        </button>
      </div>
    </aside>
  );
}
