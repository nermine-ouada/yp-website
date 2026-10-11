import Link from "next/link";
import { ImportWizard } from "@/components/admin/ImportWizard";

export default function ImportPage() {
  return (
    <main>
      <div className="wrap">
        <div className="admin-bar">
          <div>
            <h1>Import opportunities</h1>
          </div>
          <Link href="/admin/opportunities" className="admin-link-btn">
            ← back to list
          </Link>
        </div>

        <ImportWizard kind="opportunities" />
      </div>
    </main>
  );
}
