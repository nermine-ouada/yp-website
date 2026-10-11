import { GlobeIcon, ExternalLinkIcon } from "./icons";

const LINKS = [
  { href: "https://www.ieee.org/index.html", label: "IEEE.org", icon: "globe" as const, external: false },
  { href: "https://ieeexplore.ieee.org/Xplore/home.jsp", label: "IEEE Xplore®", icon: "link" as const, external: true },
  { href: "https://standards.ieee.org/", label: "IEEE Standards", icon: "link" as const, external: true },
];

export function MetaNav() {
  return (
    <div className="meta-nav">
      <div className="wrap meta-nav-inner">
        <div className="meta-links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="meta-link">
              {l.icon === "globe" ? <GlobeIcon /> : <ExternalLinkIcon />}
              <span>
                {l.label}
                <i />
              </span>
              {l.external && <ExternalLinkIcon />}
            </a>
          ))}
        </div>
        <div className="meta-actions">
          <a
            href="https://www.ieee.org/membership/join/index.html?WT.mc_id=hc_join"
            target="_blank"
            rel="noopener noreferrer"
            className="meta-btn meta-btn-join"
          >
            Join IEEE
          </a>
          <a href="https://www.ieee.org/give" target="_blank" rel="noopener noreferrer" className="meta-btn meta-btn-donate">
            Donate
          </a>
        </div>
      </div>
    </div>
  );
}
