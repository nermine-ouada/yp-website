import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { recoverOpportunity, emptyTrash, permanentlyDeleteOpportunity } from "../actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export const dynamic = "force-dynamic";

export default async function TrashPage() {
  const trashed = await prisma.opportunity.findMany({
    where: { deletedAt: { not: null } },
    orderBy: { deletedAt: "desc" },
  });

  return (
    <main>
      <div className="wrap">
        <div className="admin-bar">
          <div>
            <span className="eyebrow" style={{ marginBottom: 4 }}>
              // admin
            </span>
            <h1>Trash</h1>
          </div>
          <div className="admin-bar-actions">
            <Link href="/admin" className="admin-link-btn">
              ← back to list
            </Link>
            {trashed.length > 0 && (
              <form action={emptyTrash}>
                <ConfirmButton
                  className="admin-link-btn danger"
                  confirmMessage={`Permanently delete all ${trashed.length} trashed opportunities? This cannot be undone.`}
                >
                  Empty trash ({trashed.length})
                </ConfirmButton>
              </form>
            )}
          </div>
        </div>

        {trashed.length === 0 ? (
          <p style={{ color: "var(--board-muted)" }}>Nothing in the trash.</p>
        ) : (
          <>
            <p className="count-line">
              Deleted opportunities stay here until you empty the trash — nothing is gone for good yet.
            </p>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Title</th>
                    <th>Deleted</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {trashed.map((item) => (
                    <tr key={item.id}>
                      <td>{item.sheet}</td>
                      <td>{item.title}</td>
                      <td>{item.deletedAt?.toLocaleDateString()}</td>
                      <td>
                        <div className="admin-row-actions">
                          <form action={recoverOpportunity}>
                            <input type="hidden" name="id" value={item.id} />
                            <ConfirmButton
                              className="admin-link-btn"
                              confirmMessage={`Recover "${item.title}" back to the active board?`}
                            >
                              Recover
                            </ConfirmButton>
                          </form>
                          <form action={permanentlyDeleteOpportunity}>
                            <input type="hidden" name="id" value={item.id} />
                            <ConfirmButton
                              className="admin-link-btn danger"
                              confirmMessage={`Permanently delete "${item.title}"? This cannot be undone.`}
                            >
                              Delete permanently
                            </ConfirmButton>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
