import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { deleteOpportunity, setOpportunityHidden } from "../actions";
import { getDistinctSheets } from "@/lib/opportunities";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { SubmitButton } from "@/components/admin/SubmitButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sheet?: string; status?: string; visibility?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const sheet = params.sheet ?? "";
  const status = params.status ?? "";
  const visibility = params.visibility === "visible" || params.visibility === "hidden" ? params.visibility : "";

  const where: Prisma.OpportunityWhereInput = { deletedAt: null };
  if (sheet) where.sheet = sheet;
  if (status) where.status = status;
  if (visibility) where.hidden = visibility === "hidden";
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
      { level: { contains: q, mode: "insensitive" } },
      { who: { contains: q, mode: "insensitive" } },
    ];
  }

  const [opportunities, trashedCount, allSheets, allStatuses, totalActive, hiddenCount] = await Promise.all([
    prisma.opportunity.findMany({ where, orderBy: [{ sheet: "asc" }, { sortOrder: "asc" }] }),
    prisma.opportunity.count({ where: { deletedAt: { not: null } } }),
    getDistinctSheets(),
    prisma.opportunity
      .findMany({ where: { deletedAt: null }, distinct: ["status"], select: { status: true }, orderBy: { status: "asc" } })
      .then((rows) => rows.map((r) => r.status)),
    prisma.opportunity.count({ where: { deletedAt: null } }),
    prisma.opportunity.count({ where: { deletedAt: null, hidden: true } }),
  ]);

  const hasFilters = Boolean(q || sheet || status || visibility);

  return (
    <main>
      <div className="wrap">
        <div className="admin-bar">
          <div>
            <h1>Opportunities</h1>
          </div>
          <div className="admin-bar-actions">
            <Link href="/opportunities" target="_blank" className="admin-link-btn">
              View board ↗
            </Link>
            <Link href="/admin/trash" className="admin-link-btn">
              Trash{trashedCount > 0 ? ` (${trashedCount})` : ""}
            </Link>
            <Link href="/admin/import" className="admin-link-btn">
              Import from Excel
            </Link>
            <Link href="/admin/new" className="apply-btn" style={{ ["--accent" as string]: "var(--blue)" }}>
              New opportunity
            </Link>
          </div>
        </div>

        <form className="admin-filter-bar" method="get">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search title, level, who qualifies…"
            className="admin-input"
            style={{ maxWidth: 280 }}
          />
          <select name="sheet" defaultValue={sheet} className="admin-select" style={{ maxWidth: 200 }}>
            <option value="">All categories</option>
            {allSheets.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select name="status" defaultValue={status} className="admin-select" style={{ maxWidth: 160 }}>
            <option value="">All statuses</option>
            {allStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select name="visibility" defaultValue={visibility} className="admin-select" style={{ maxWidth: 160 }}>
            <option value="">Visible &amp; hidden</option>
            <option value="visible">Visible only</option>
            <option value="hidden">Hidden only</option>
          </select>
          <button type="submit" className="admin-link-btn">
            Filter
          </button>
          {hasFilters && (
            <Link href="/admin/opportunities" className="admin-link-btn">
              Clear
            </Link>
          )}
        </form>

        <p className="count-line">
          {hasFilters ? `Showing ${opportunities.length} of ${totalActive}` : `${totalActive} opportunities pinned`}
          {hiddenCount > 0 && ` · ${hiddenCount} hidden from the public board`}
        </p>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Title</th>
                <th>Level</th>
                <th>Status</th>
                <th>Deadline</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {opportunities.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ color: "var(--muted)" }}>
                    Nothing matches those filters.
                  </td>
                </tr>
              ) : (
                opportunities.map((item) => (
                  <tr key={item.id} className={item.hidden ? "admin-row-hidden" : undefined}>
                    <td>{item.sheet}</td>
                    <td>
                      {item.title}
                      {item.hidden && <span className="admin-hidden-badge">Hidden</span>}
                    </td>
                    <td>{item.level}</td>
                    <td>{item.status}</td>
                    <td>{item.deadline}</td>
                    <td>
                      <div className="admin-row-actions">
                        <Link href={`/admin/${item.id}`} className="admin-link-btn">
                          Edit
                        </Link>
                        <form action={setOpportunityHidden}>
                          <input type="hidden" name="id" value={item.id} />
                          <input type="hidden" name="hidden" value={item.hidden ? "false" : "true"} />
                          <SubmitButton className="admin-link-btn" pendingLabel="Saving…">
                            {item.hidden ? "Show" : "Hide"}
                          </SubmitButton>
                        </form>
                        <form action={deleteOpportunity}>
                          <input type="hidden" name="id" value={item.id} />
                          <ConfirmButton
                            className="admin-link-btn danger"
                            confirmMessage={`Move "${item.title}" to trash?`}
                          >
                            Delete
                          </ConfirmButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
