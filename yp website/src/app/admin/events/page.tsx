import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteEvent, setEventHidden } from "../content-actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { SubmitButton } from "@/components/admin/SubmitButton";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({ where: { deletedAt: null }, orderBy: [{ date: { sort: "desc", nulls: "last" } }, { createdAt: "asc" }] });

  return (
    <main>
      <div className="wrap">
        <div className="admin-bar">
          <div>
            <h1>Events</h1>
          </div>
          <div className="admin-bar-actions">
            <Link href="/admin/events/import" className="admin-link-btn">
              Import
            </Link>
            <Link href="/admin/events/new" className="apply-btn" style={{ ["--accent" as string]: "var(--blue)" }}>
              New event
            </Link>
          </div>
        </div>

        <p className="count-line">{events.length} events</p>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Type</th>
                <th>Section</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ color: "var(--muted)" }}>
                    No events yet.
                  </td>
                </tr>
              ) : (
                events.map((e) => (
                  <tr key={e.id} className={e.hidden ? "admin-row-hidden" : undefined}>
                    <td style={{ whiteSpace: "nowrap" }}>{e.date ?? "No date"}</td>
                    <td>
                      <Link href={`/events/${e.slug}`} target="_blank" style={{ color: "inherit" }}>
                        {e.title}
                      </Link>
                      {e.hidden && <span className="admin-hidden-badge">Hidden</span>}
                    </td>
                    <td>{e.type}</td>
                    <td>{e.initiative ? "Initiatives" : ["Announcement", "Award", "Partnership"].includes(e.type) ? "News" : "Events"}</td>
                    <td>
                      <div className="admin-row-actions">
                        <Link href={`/admin/events/${e.id}`} className="admin-link-btn">
                          Edit
                        </Link>
                        <form action={setEventHidden}>
                          <input type="hidden" name="id" value={e.id} />
                          <input type="hidden" name="hidden" value={e.hidden ? "false" : "true"} />
                          <SubmitButton className="admin-link-btn" pendingLabel="Saving…">
                            {e.hidden ? "Show" : "Hide"}
                          </SubmitButton>
                        </form>
                        <form action={deleteEvent}>
                          <input type="hidden" name="id" value={e.id} />
                          <ConfirmButton className="admin-link-btn danger" confirmMessage={`Delete "${e.title}" permanently?`}>
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
