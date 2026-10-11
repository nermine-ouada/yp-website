import Link from "next/link";
import { ImportWizard } from "@/components/admin/ImportWizard";

export default function ImportEventsPage() {
  return (
    <main>
      <div className="wrap">
        <div className="admin-bar">
          <h1>Import events</h1>
          <Link href="/admin/events" className="admin-link-btn">
            ← back to events
          </Link>
        </div>
        <ImportWizard kind="events" />
      </div>
    </main>
  );
}
