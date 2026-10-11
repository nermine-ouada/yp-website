"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// No visible UI — just silently sends you back to login the moment the
// session cookie expires, so an idle open tab doesn't sit on stale content
// until your next click.
export function SessionWatcher({ expiresAt }: { expiresAt: number }) {
  const router = useRouter();

  useEffect(() => {
    const msLeft = expiresAt - Date.now();
    if (msLeft <= 0) {
      router.push("/admin/login?expired=1");
      return;
    }
    const id = setTimeout(() => router.push("/admin/login?expired=1"), msLeft);
    return () => clearTimeout(id);
  }, [expiresAt, router]);

  return null;
}
