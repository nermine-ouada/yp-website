import { getSessionExpiry } from "@/lib/auth";
import { SessionWatcher } from "@/components/admin/SessionWatcher";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const expiresAt = await getSessionExpiry();

  // Logged out (the login page): no dashboard chrome.
  if (expiresAt === null) return <>{children}</>;

  return (
    <div className="dash">
      <SessionWatcher expiresAt={expiresAt} />
      <Sidebar />
      <div className="dash-main">{children}</div>
    </div>
  );
}
