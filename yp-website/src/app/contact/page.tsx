import type { Metadata } from "next";
import { PageHero, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the IEEE Young Professionals Tunisia Affinity Group.",
};

export const revalidate = 60;

export default async function ContactPage() {
  const { contact, joinUrl } = await getSite();
  const facebookHandle = contact.facebook.replace(/\/+$/, "").split("/").pop() || contact.facebook;
  const CARDS: { tag: string; value: string; href?: string }[] = [
    { tag: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { tag: "Phone", value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}` },
    { tag: "Facebook", value: facebookHandle, href: contact.facebook },
    { tag: "LinkedIn", value: "ieee-yp-tunisia", href: contact.linkedin },
    { tag: "Instagram", value: "ieee_yp_tunisia_affinity_group", href: contact.instagram },
    { tag: "Location", value: contact.location },
  ].filter((c) => c.value);
  return (
    <div className="pro-page">
      <SiteHeader />
      <PageHero kicker="Contact" title="Get in touch">
        Questions, partnership proposals, or interest in joining our team of volunteers. We
        are happy to hear from you.
      </PageHero>

      <main>
        <div className="wrap">
          <section className="pro-section">
            <div className="pro-grid cols-3">
              {CARDS.map((c) => {
                const body = (
                  <>
                    <span className="pro-tag">{c.tag}</span>
                    <h3>{c.value}</h3>
                  </>
                );
                if (!c.href) {
                  return (
                    <div key={c.tag} className="pro-card">
                      {body}
                    </div>
                  );
                }
                const external = c.href.startsWith("http");
                return (
                  <a
                    key={c.tag}
                    className="pro-card"
                    href={c.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                  >
                    {body}
                  </a>
                );
              })}
            </div>
          </section>

          <section className="pro-section">
            <div className="pro-cta">
              <div>
                <h2>Not an IEEE member yet?</h2>
                <p>Everyone is welcome at our meetings, and membership unlocks most opportunities.</p>
              </div>
              <a className="pro-btn" href={joinUrl} target="_blank" rel="noopener noreferrer">
                Join IEEE
              </a>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
