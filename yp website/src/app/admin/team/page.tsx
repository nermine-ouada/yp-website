import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PERSON_GROUPS, type PersonGroup } from "@/lib/content";
import { deletePerson, setPersonHidden } from "../content-actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { SubmitButton } from "@/components/admin/SubmitButton";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage({ searchParams }: { searchParams: Promise<{ group?: string }> }) {
  const params = await searchParams;
  const group: PersonGroup = PERSON_GROUPS.some((g) => g.key === params.group) ? (params.group as PersonGroup) : "officer";

  const [people, counts] = await Promise.all([
    prisma.person.findMany({ where: { group, deletedAt: null }, orderBy: [{ committee: "asc" }, { sortOrder: "asc" }, { name: "asc" }] }),
    prisma.person.groupBy({ by: ["group"], where: { deletedAt: null }, _count: true }),
  ]);
  const countOf = (g: string) => counts.find((c) => c.group === g)?._count ?? 0;

  return (
    <main>
      <div className="wrap">
        <div className="admin-bar">
          <div>
            <h1>Team</h1>
          </div>
          <div className="admin-bar-actions">
            <Link href="/admin/team/import" className="admin-link-btn">
              Import
            </Link>
            <Link href={`/admin/team/new?group=${group}`} className="apply-btn" style={{ ["--accent" as string]: "var(--blue)" }}>
              New person
            </Link>
          </div>
        </div>

        <div className="admin-filter-bar">
          {PERSON_GROUPS.map((g) => (
            <Link
              key={g.key}
              href={`/admin/team?group=${g.key}`}
              className="admin-link-btn"
              style={g.key === group ? { borderColor: "var(--blue)", color: "var(--blue)" } : undefined}
            >
              {g.label} ({countOf(g.key)})
            </Link>
          ))}
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>{group === "ambassador" ? "Student branch" : "Role"}</th>
                {group === "taskforce" && <th>Committee</th>}
                <th>Grade</th>
                <th>Order</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {people.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ color: "var(--muted)" }}>
                    Nobody here yet.
                  </td>
                </tr>
              ) : (
                people.map((p) => (
                  <tr key={p.id} className={p.hidden ? "admin-row-hidden" : undefined}>
                    <td>
                      {p.photo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.photo} alt="" className="admin-avatar" />
                      )}
                      {p.name}
                      {p.hidden && <span className="admin-hidden-badge">Hidden</span>}
                    </td>
                    <td>{(group === "ambassador" ? p.branch : p.role) ?? ""}</td>
                    {group === "taskforce" && <td>{p.committee ?? ""}</td>}
                    <td>{p.membership ?? ""}</td>
                    <td>{p.sortOrder}</td>
                    <td>
                      <div className="admin-row-actions">
                        <Link href={`/admin/team/${p.id}`} className="admin-link-btn">
                          Edit
                        </Link>
                        <form action={setPersonHidden}>
                          <input type="hidden" name="id" value={p.id} />
                          <input type="hidden" name="hidden" value={p.hidden ? "false" : "true"} />
                          <SubmitButton className="admin-link-btn" pendingLabel="Saving…">
                            {p.hidden ? "Show" : "Hide"}
                          </SubmitButton>
                        </form>
                        <form action={deletePerson}>
                          <input type="hidden" name="id" value={p.id} />
                          <ConfirmButton className="admin-link-btn danger" confirmMessage={`Remove ${p.name} permanently?`}>
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
