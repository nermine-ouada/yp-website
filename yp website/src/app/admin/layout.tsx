import { getSessionExpiry } from "@/lib/auth";
import { SessionWatcher } from "@/components/admin/SessionWatcher";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const expiresAt = await getSessionExpiry();

  return (
    <>
      {expiresAt !== null && <SessionWatcher expiresAt={expiresAt} />}
      {children}
    </>
  );
}
