import type { Metadata } from "next";
import { PageHero, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { countOpportunities } from "@/lib/opportunities";

export const metadata: Metadata = {
  title: "YP Tunisia AG Task Force Links",
  description: "Quick links from the IEEE YP Tunisia AG Task Force flyer.",
};

// Same cadence as the board, so the pinned count stays current.
export const revalidate = 60;

const LINKS = [
  {
    href: "/opportunities",
    accent: "var(--blue)",
    title: "The YP Pinboard",
    sub: "{count} scholarships, fellowships & internships",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M9 4v16M4 9h5" />
      </svg>
    ),
  },
  {
    href: "/events",
    accent: "var(--orange)",
    title: "Events and highlights",
    sub: "Webinars, TSYP challenges, workshops and collaborations",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </svg>
    ),
  },
  {
    href: "/officers",
    accent: "var(--green)",
    title: "Meet the officers",
    sub: "The 2025-2026 executive committee",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5" />
      </svg>
    ),
  },
  {
    href: "https://www.facebook.com/ieee.yp.tunisia",
    accent: "var(--blue)",
    title: "IEEE YP Tunisia on Facebook",
    sub: "News, event posts and photos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z" />
      </svg>
    ),
  },
  {
    href: "https://yp.ieee.org",
    accent: "var(--green)",
    title: "IEEE Young Professionals",
    sub: "yp.ieee.org · the global YP community",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 4 6 4 9s-1.5 6.4-4 9c-2.5-2.6-4-6-4-9s1.5-6.4 4-9Z" />
      </svg>
    ),
  },
  {
    href: "/about",
    accent: "var(--orange)",
    title: "About YP Tunisia",
    sub: "Our mission, and what Connect · Learn · Lead · Thrive means",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="8" r="3.2" />
        <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
        <path d="M16.2 3.6c1.8.5 3 2.1 3 4.1 0 2-1.4 3.6-3.1 4.1" />
        <path d="M21.5 20c0-3-1.9-5.2-4.5-5.8" />
      </svg>
    ),
  },
  {
    href: "mailto:yp@ieee.tn",
    accent: "var(--green)",
    title: "Get in touch",
    sub: "yp@ieee.tn · questions, new leads, feedback",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3.5 6.5 8.5 6 8.5-6" />
      </svg>
    ),
  },
];

export default async function LinksPage() {
  const count = await countOpportunities();
  const links = LINKS.map((l) => ({ ...l, sub: l.sub.replace("{count}", String(count)) }));

  return (
    <div className="pro-page">
      <SiteHeader />
      <PageHero kicker="Quick links" title="Everything in one place">
        The opportunities board, our events, the team, and a direct line to us.
      </PageHero>

      <main>
        <div className="wrap pro-section">
          <div className="link-stack">
            {links.map((l) => (
              <a
                key={l.href}
                className="link-card"
                href={l.href}
                style={{ ["--accent" as string]: l.accent }}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                <span className="link-icon">{l.icon}</span>
                <span>
                  <span className="link-title">{l.title}</span>
                  <div className="link-sub">{l.sub}</div>
                </span>
              </a>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
