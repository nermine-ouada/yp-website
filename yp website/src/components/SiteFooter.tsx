import Link from "next/link";
import { NAV } from "@/data/nav";
import { contact, footerLinks, site, usefulLinks } from "@/data/ypTunisia";

export function SiteFooter({ note }: { note?: React.ReactNode }) {
  return (
    <footer>
      <div className="wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="footer-logo" src="/yp-tunisia-logo.png" alt="IEEE Young Professionals Tunisia Section" />
        <span className="tape-strip">{site.name}</span>

        <div className="footer-cols">
          <div>
            <p className="footer-col-label">Pages</p>
            <ul>
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/links">All links</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="footer-col-label">IEEE</p>
            <ul>
              {footerLinks.map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="footer-col-label">Useful links</p>
            <ul>
              {usefulLinks.map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="fine-print">
          {note && (
            <>
              {note}{" "}
            </>
          )}
          Questions or ideas?{" "}
          <a className="contact" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          <br />
          {site.copyright}
        </p>
      </div>
    </footer>
  );
}
