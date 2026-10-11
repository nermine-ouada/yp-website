"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LinkChainIcon } from "./icons";

export function LinktreeFab() {
  const pathname = usePathname();
  if (pathname === "/links") return null;

  return (
    <Link href="/links" className="fab-linktree" aria-label="More links from the flyer">
      <LinkChainIcon />
    </Link>
  );
}
