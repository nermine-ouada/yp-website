// Minimal signed-cookie session for the /admin portal. There's one shared
// admin password (ADMIN_PASSWORD), not per-user accounts, so there's no
// users table — just a cookie that proves "someone who knows the password
// logged in before <expiry>", signed with SESSION_SECRET so it can't be
// forged. Uses Web Crypto (not node:crypto) so it also works in middleware,
// which runs on the Edge runtime.

const COOKIE_NAME = "admin_session";
const SESSION_MINUTES = 15;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return secret;
}

async function hmac(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(): Promise<{ value: string; maxAge: number }> {
  const maxAge = SESSION_MINUTES * 60;
  const expires = Math.floor(Date.now() / 1000) + maxAge;
  const signature = await hmac(String(expires));
  return { value: `${expires}.${signature}`, maxAge };
}

export async function isValidSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [expiresStr, signature] = token.split(".");
  if (!expiresStr || !signature) return false;
  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || expires < Date.now() / 1000) return false;
  const expected = await hmac(expiresStr);
  return expected === signature;
}

export const ADMIN_SESSION_COOKIE = COOKIE_NAME;

/**
 * Defense in depth for Server Actions: middleware already gates page
 * navigation to /admin/*, but actions get their own check too rather than
 * relying solely on the request having come from a matched route.
 */
export async function assertAdmin() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!(await isValidSessionToken(token))) {
    throw new Error("Not authorized");
  }
}

/** Returns the session's expiry time in ms epoch, or null if not logged in. */
export async function getSessionExpiry(): Promise<number | null> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!(await isValidSessionToken(token))) return null;
  const [expiresStr] = (token as string).split(".");
  return Number(expiresStr) * 1000;
}
