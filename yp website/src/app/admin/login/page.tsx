import { login } from "./actions";
import { SubmitButton } from "@/components/admin/SubmitButton";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string; expired?: string }>;
}) {
  const params = await searchParams;

  return (
    <main style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="wrap" style={{ maxWidth: 380, width: "100%" }}>
        <form action={login} className="admin-login-card">
          <span className="eyebrow" style={{ marginBottom: 6 }}>
            // task force only
          </span>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Admin login</h1>
          <p style={{ color: "var(--board-muted)", fontSize: 13.5, margin: "0 0 18px" }}>
            Enter the shared admin password to manage pinned opportunities.
          </p>
          <input type="hidden" name="from" value={params.from ?? "/admin"} />
          <label htmlFor="password" className="admin-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            className="admin-input"
          />
          {params.error && <p className="admin-error">Wrong password. Try again.</p>}
          {params.expired && !params.error && (
            <p className="admin-error">Your session expired. Log in again to keep going.</p>
          )}
          <SubmitButton pendingLabel="Logging in…" style={{ marginTop: 16, width: "100%", justifyContent: "center" }}>
            Log in
          </SubmitButton>
        </form>
      </div>
    </main>
  );
}
