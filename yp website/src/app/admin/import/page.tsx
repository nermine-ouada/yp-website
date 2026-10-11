import Link from "next/link";
import { ImportWizard } from "@/components/admin/ImportWizard";

export default function ImportPage() {
  return (
    <main>
      <div className="wrap">
        <div className="admin-bar">
          <div>
            <span className="eyebrow" style={{ marginBottom: 4 }}>
              // admin
            </span>
            <h1>Import from Excel</h1>
          </div>
          <Link href="/admin" className="admin-link-btn">
            ← back to list
          </Link>
        </div>

        <ImportWizard />
      </div>
    </main>
  );
}
