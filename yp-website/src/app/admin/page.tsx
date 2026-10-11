import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function timeAgo(d: Date) {
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminOverview() {
  const today = new Date().toISOString().slice(0, 10);
  const [opps, oppsHidden, events, upcoming, people, recentOpps, recentEvents, recentPeople] = await Promise.all([
    prisma.opportunity.count({ where: { deletedAt: null } }),
    prisma.opportunity.count({ where: { deletedAt: null, hidden: true } }),
    prisma.event.count({ where: { deletedAt: null } }),
    prisma.event.count({ where: { deletedAt: null, date: { gte: today } } }),
    prisma.person.groupBy({ by: ["group"], where: { deletedAt: null }, _count: true }),
    prisma.opportunity.findMany({ where: { deletedAt: null }, orderBy: { updatedAt: "desc" }, take: 8, select: { id: true, title: true, updatedAt: true } }),
    prisma.event.findMany({ where: { deletedAt: null }, orderBy: { updatedAt: "desc" }, take: 8, select: { id: true, title: true, updatedAt: true } }),
    prisma.person.findMany({ where: { deletedAt: null }, orderBy: { updatedAt: "desc" }, take: 8, select: { id: true, name: true, updatedAt: true } }),
  ]);
  const count = (g: string) => people.find((p) => p.group === g)?._count ?? 0;

  const recent = [
    ...recentOpps.map((r) => ({ kind: "Opportunity", title: r.title, at: r.updatedAt, href: `/admin/${r.id}` })),
    ...recentEvents.map((r) => ({ kind: "Event", title: r.title, at: r.updatedAt, href: `/admin/events/${r.id}` })),
    ...recentPeople.map((r) => ({ kind: "Team", title: r.name, at: r.updatedAt, href: `/admin/team/${r.id}` })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 8);

  const cards = [
    { label: "Opportunities", value: opps, sub: oppsHidden ? `${oppsHidden} hidden` : "", href: "/admin/opportunities" },
    { label: "Events", value: events, sub: upcoming ? `${upcoming} upcoming` : "", href: "/admin/events" },
    { label: "Officers", value: count("officer"), sub: "", href: "/admin/team?group=officer" },
    { label: "Task Force", value: count("taskforce"), sub: "", href: "/admin/team?group=taskforce" },
    { label: "Ambassadors", value: count("ambassador"), sub: "", href: "/admin/team?group=ambassador" },
  ];

  return (
    <main>
      <div className="wrap">
        <div className="admin-bar">
          <h1>Overview</h1>
          <div className="admin-bar-actions">
            <Link href="/admin/new" className="admin-link-btn">
              New opportunity
            </Link>
            <Link href="/admin/events/new" className="admin-link-btn">
              New event
            </Link>
            <Link href="/admin/team/new?group=taskforce" className="admin-link-btn">
              New person
            </Link>
          </div>
        </div>

        <div className="dash-cards">
          {cards.map((c) => (
            <Link key={c.label} href={c.href} className="dash-card">
              <span className="dash-card-label">{c.label}</span>
              <b>{c.value}</b>
              {c.sub && <span className="dash-card-sub">{c.sub}</span>}
            </Link>
          ))}
        </div>

        <h2 className="dash-section-title">Recent changes</h2>
        <div className="admin-table-wrap">
          <table className="admin-table" style={{ minWidth: 0 }}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Section</th>
                <th>Edited</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.href}>
                  <td>
                    <Link href={r.href} style={{ color: "inherit" }}>
                      {r.title}
                    </Link>
                  </td>
                  <td style={{ color: "var(--dash-muted)" }}>{r.kind}</td>
                  <td style={{ color: "var(--dash-muted)", whiteSpace: "nowrap" }}>{timeAgo(r.at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
