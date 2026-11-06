import Link from "next/link";
import { SiteNav } from "./SiteNav";

// Brand row + main nav shared by every public page. Page-specific hero
// content goes in as children.
export function SiteHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header>
      <div className="wrap">
        <div className="brand-row">
          <Link href="/" aria-label="IEEE YP Tunisia home" className="site-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/yp-tunisia-logo.png" alt="IEEE Young Professionals Tunisia Section" />
          </Link>
          <SiteNav />
        </div>
        {children}
      </div>
    </header>
  );
}

// Plain title block for the inner pages.
export function PageHero({ kicker, title, children }: { kicker: string; title: string; children?: React.ReactNode }) {
  return (
    <section className="pro-band">
      <div className="wrap pro-hero" style={{ paddingBlock: "48px 44px" }}>
        <span className="pro-kicker">{kicker}</span>
        <h1>{title}</h1>
        {children && <p>{children}</p>}
      </div>
    </section>
  );
}
