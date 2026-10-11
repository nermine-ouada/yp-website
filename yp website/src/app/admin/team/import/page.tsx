import Link from "next/link";
import { ImportWizard } from "@/components/admin/ImportWizard";

export default function ImportTeamPage() {
  return (
    <main>
      <div className="wrap">
        <div className="admin-bar">
          <h1>Import team</h1>
          <Link href="/admin/team" className="admin-link-btn">
            ← back to team
          </Link>
        </div>
        <ImportWizard kind="people" />
      </div>
    </main>
  );
}
