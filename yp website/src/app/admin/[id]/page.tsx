import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OpportunityForm } from "@/components/admin/OpportunityForm";
import { updateOpportunity } from "../actions";
import { getDistinctSheets, getDistinctLevels, getDistinctDeadlines } from "@/lib/opportunities";

export default async function EditOpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, existingSheets, existingLevels, existingDeadlines] = await Promise.all([
    prisma.opportunity.findUnique({ where: { id } }),
    getDistinctSheets(),
    getDistinctLevels(),
    getDistinctDeadlines(),
  ]);
  if (!item) notFound();

  const boundUpdate = updateOpportunity.bind(null, id);

  return (
    <main>
      <div className="wrap">
        <div className="admin-bar">
          <div>
            <span className="eyebrow" style={{ marginBottom: 4 }}>
              // admin
            </span>
            <h1>Edit opportunity</h1>
          </div>
          <Link href="/admin" className="admin-link-btn">
            ← back to list
          </Link>
        </div>

        <OpportunityForm
          action={boundUpdate}
          initial={item}
          submitLabel="Save changes"
          existingSheets={existingSheets}
          existingLevels={existingLevels}
          existingDeadlines={existingDeadlines}
        />
      </div>
    </main>
  );
}
