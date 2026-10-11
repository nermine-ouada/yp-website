"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/login/actions";

const ICONS = {
  overview: <path d="M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z" />,
  opportunities: <path d="M4 4h16v16H4zM9 4v16M4 9h5" />,
  events: <path d="M3 5h18v16H3zM3 10h18M8 3v4M16 3v4" />,
  team: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16.2 3.6c1.8.5 3 2.1 3 4.1s-1.4 3.6-3.1 4.1M21.5 20c0-3-1.9-5.2-4.5-5.8" />
    </>
  ),
  site: <path d="M4 5h16M4 10h16M4 15h10M4 20h7" />,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />,
  logout: <path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11" />,
};

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

const NAV: { href: string; label: string; icon: keyof typeof ICONS; match: (p: string) => boolean }[] = [
  { href: "/admin", label: "Overview", icon: "overview", match: (p) => p === "/admin" },
  {
    href: "/admin/opportunities",
    label: "Opportunities",
    icon: "opportunities",
    match: (p) => p.startsWith("/admin/opportunities") || /^\/admin\/(new|import|c[a-z0-9]{20,})/.test(p),
  },
  { href: "/admin/events", label: "Events", icon: "events", match: (p) => p.startsWith("/admin/events") },
  { href: "/admin/team", label: "Team", icon: "team", match: (p) => p.startsWith("/admin/team") },
  { href: "/admin/site", label: "Site content", icon: "site", match: (p) => p.startsWith("/admin/site") },
  { href: "/admin/trash", label: "Trash", icon: "trash", match: (p) => p.startsWith("/admin/trash") },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="dash-sidebar">
      <Link href="/admin" className="dash-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/yp-tunisia-logo.png" alt="IEEE YP Tunisia" />
        <span>Dashboard</span>
      </Link>

      <nav className="dash-nav" aria-label="Dashboard">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className={`dash-nav-link${n.match(pathname) ? " active" : ""}`}>
            <Icon name={n.icon} />
            {n.label}
          </Link>
        ))}
      </nav>

      <div className="dash-sidebar-foot">
        <Link href="/" target="_blank" className="dash-nav-link">
          <Icon name="external" />
          View site
        </Link>
        <form action={logout}>
          <button type="submit" className="dash-nav-link">
            <Icon name="logout" />
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
