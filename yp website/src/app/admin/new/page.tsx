import Link from "next/link";
import { OpportunityForm } from "@/components/admin/OpportunityForm";
import { createOpportunity } from "../actions";
import { getDistinctSheets, getDistinctLevels, getDistinctDeadlines } from "@/lib/opportunities";

export default async function NewOpportunityPage() {
  const [existingSheets, existingLevels, existingDeadlines] = await Promise.all([
    getDistinctSheets(),
    getDistinctLevels(),
    getDistinctDeadlines(),
  ]);
  return (
    <main>
      <div className="wrap">
        <div className="admin-bar">
          <div>
            <span className="eyebrow" style={{ marginBottom: 4 }}>
              // admin
            </span>
            <h1>Add an opportunity</h1>
          </div>
          <Link href="/admin" className="admin-link-btn">
            ← back to list
          </Link>
        </div>

        <OpportunityForm
          action={createOpportunity}
          submitLabel="Pin it"
          existingSheets={existingSheets}
          existingLevels={existingLevels}
          existingDeadlines={existingDeadlines}
        />
      </div>
    </main>
  );
}
