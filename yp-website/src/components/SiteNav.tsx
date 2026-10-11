"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/data/nav";

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="site-nav" aria-label="Main">
      {NAV.map((n) => {
        const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`site-nav-link${active ? " active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
