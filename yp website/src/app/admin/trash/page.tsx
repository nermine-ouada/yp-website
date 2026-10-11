import { prisma } from "@/lib/prisma";
import { recoverOpportunity, permanentlyDeleteOpportunity } from "../actions";
import { emptyAllTrash, permanentlyDeleteEvent, permanentlyDeletePerson, recoverEvent, recoverPerson } from "../content-actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export const dynamic = "force-dynamic";

const GROUP_LABEL: Record<string, string> = { officer: "Officer", taskforce: "Task Force", ambassador: "Ambassador" };

type Row = { id: string; title: string; detail: string; deletedAt: Date | null };

function TrashTable({
  title,
  rows,
  recover,
  remove,
}: {
  title: string;
  rows: Row[];
  recover: (fd: FormData) => Promise<void>;
  remove: (fd: FormData) => Promise<void>;
}) {
  if (rows.length === 0) return null;
  return (
    <section style={{ marginBottom: 24 }}>
      <h2 className="dash-section-title">
        {title} ({rows.length})
      </h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th></th>
              <th>Deleted</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.title}</td>
                <td style={{ color: "var(--dash-muted)" }}>{r.detail}</td>
                <td style={{ whiteSpace: "nowrap" }}>{r.deletedAt?.toLocaleDateString("en-GB")}</td>
                <td>
                  <div className="admin-row-actions">
                    <form action={recover}>
                      <input type="hidden" name="id" value={r.id} />
                      <button type="submit" className="admin-link-btn">
                        Restore
                      </button>
                    </form>
                    <form action={remove}>
                      <input type="hidden" name="id" value={r.id} />
                      <ConfirmButton className="admin-link-btn danger" confirmMessage={`Permanently delete "${r.title}"? This cannot be undone.`}>
                        Delete for good
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default async function TrashPage() {
  const trashed = { deletedAt: { not: null } };
  const order = { deletedAt: "desc" as const };
  const [opps, events, people] = await Promise.all([
    prisma.opportunity.findMany({ where: trashed, orderBy: order }),
    prisma.event.findMany({ where: trashed, orderBy: order }),
    prisma.person.findMany({ where: trashed, orderBy: order }),
  ]);
  const total = opps.length + events.length + people.length;

  return (
    <main>
      <div className="wrap">
        <div className="admin-bar">
          <h1>Trash</h1>
          {total > 0 && (
            <form action={emptyAllTrash}>
              <ConfirmButton className="admin-link-btn danger" confirmMessage={`Permanently delete all ${total} items in the trash? This cannot be undone.`}>
                Empty trash
              </ConfirmButton>
            </form>
          )}
        </div>

        {total === 0 ? (
          <p className="count-line">The trash is empty.</p>
        ) : (
          <>
            <p className="count-line">Deleted items stay here until you restore them or empty the trash.</p>
            <TrashTable
              title="Opportunities"
              rows={opps.map((o) => ({ id: o.id, title: o.title, detail: o.sheet, deletedAt: o.deletedAt }))}
              recover={recoverOpportunity}
              remove={permanentlyDeleteOpportunity}
            />
            <TrashTable
              title="Events"
              rows={events.map((e) => ({ id: e.id, title: e.title, detail: e.type, deletedAt: e.deletedAt }))}
              recover={recoverEvent}
              remove={permanentlyDeleteEvent}
            />
            <TrashTable
              title="Team"
              rows={people.map((p) => ({ id: p.id, title: p.name, detail: GROUP_LABEL[p.group] ?? p.group, deletedAt: p.deletedAt }))}
              recover={recoverPerson}
              remove={permanentlyDeletePerson}
            />
          </>
        )}
      </div>
    </main>
  );
}
