import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/components/Gallery";
import { SafeImage } from "@/components/SafeImage";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArrowIcon } from "@/components/icons";
import { events, getEvent } from "@/data/events";

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  return event ? { title: event.title, description: event.summary } : {};
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const facts: [string, string | undefined][] = [
    ["Date", event.date && formatDate(event.date)],
    ["Time", event.time],
    ["Format", event.format],
    [event.format === "Online" ? "Platform" : "Place", event.venue],
    ["Part of", event.partOf],
    ["Hosted by", event.hosts?.join(", ")],
    ["Co-hosted by", event.coHosts?.join(", ")],
  ];

  return (
    <div className="pro-page">
      <SiteHeader />

      <section className="pro-band">
        <div className="wrap pro-hero" style={{ paddingBlock: "40px 36px" }}>
          <Link href="/events" className="pro-link" style={{ marginBottom: 14 }}>
            ← All events
          </Link>
          <span className="pro-kicker">{event.type}</span>
          <h1>{event.title}</h1>
          <p>{event.summary}</p>
        </div>
      </section>

      <main>
        <div className="wrap pro-section event-layout">
          <div className="event-main">
            {event.images.map((src, i) => (
              <div className="event-image" key={src}>
                <SafeImage src={src} alt={i === 0 ? event.title : `${event.title}, image ${i + 1}`} label="Image coming soon" />
              </div>
            ))}
            {event.description && <p className="pro-text">{event.description}</p>}
          </div>

          <aside className="event-side">
            <div className="pro-card">
              <dl className="event-facts">
                {facts
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
              </dl>
              {event.registrationUrl && (
                <a className="pro-btn" href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                  Register <ArrowIcon />
                </a>
              )}
            </div>

            {(event.speakers?.length || event.moderator) && (
              <div className="pro-card">
                <span className="pro-tag">{event.speakers && event.speakers.length > 1 ? "Speakers" : "Speaker"}</span>
                {event.speakers?.map((s) => (
                  <div className="event-person" key={s.name}>
                    <strong>{s.name}</strong>
                    {s.title && <span>{s.title}</span>}
                  </div>
                ))}
                {event.moderator && (
                  <div className="event-person">
                    <span className="pro-tag" style={{ display: "block", marginTop: 6 }}>
                      Moderator
                    </span>
                    <strong>{event.moderator.name}</strong>
                    {event.moderator.title && <span>{event.moderator.title}</span>}
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
