import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventGrid, formatDate } from "@/components/Gallery";
import { SafeImage } from "@/components/SafeImage";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArrowIcon } from "@/components/icons";
import { getEventBySlug, getEvents } from "@/lib/content";
import { isUpcoming, sortByDate, type YPEvent } from "@/data/events";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  return {
    title: event.title,
    description: event.summary,
    openGraph: { title: event.title, description: event.summary, images: event.images.slice(0, 1) },
  };
}

const Icon = ({ d }: { d: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);
const ICON = {
  date: <path d="M3 5h18v16H3zM3 10h18M8 3v4M16 3v4" />,
  time: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  place: (
    <>
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  online: <path d="M3 5h18v11H3zM8 20h8M12 16v4" />,
};

function initials(name: string) {
  return name
    .replace(/^(dr\.?|mr\.?|ms\.?|mrs\.?)\s+/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// Google Calendar "add event" link for an all-day event on the given date.
function calendarLink(e: YPEvent) {
  if (!e.date) return null;
  const start = e.date.replace(/-/g, "");
  const next = new Date(`${e.date}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  const end = next.toISOString().slice(0, 10).replace(/-/g, "");
  const details = [e.summary, e.time && `Time: ${e.time}`, e.registrationUrl && `Register: ${e.registrationUrl}`].filter(Boolean).join("\n");
  const q = new URLSearchParams({ action: "TEMPLATE", text: e.title, dates: `${start}/${end}`, details, location: e.venue ?? "" });
  return `https://calendar.google.com/calendar/render?${q}`;
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [event, all] = await Promise.all([getEventBySlug(slug), getEvents()]);
  if (!event) notFound();

  const upcoming = isUpcoming(event);
  const [cover, ...gallery] = event.images;
  const people = [
    ...(event.speakers ?? []).map((s) => ({ ...s, role: "Speaker" })),
    ...(event.moderator ? [{ ...event.moderator, role: "Moderator" }] : []),
  ];
  const calendar = upcoming ? calendarLink(event) : null;

  // Same type first, then the most recent others.
  const others = sortByDate(all.filter((e) => e.slug !== event.slug));
  const related = [...others.filter((e) => e.type === event.type), ...others.filter((e) => e.type !== event.type)].slice(0, 3);

  const chips = [
    event.date && { icon: ICON.date, text: formatDate(event.date) },
    event.time && { icon: ICON.time, text: event.time },
    event.venue && { icon: event.format === "Online" ? ICON.online : ICON.place, text: event.venue },
    !event.venue && event.format && { icon: event.format === "Online" ? ICON.online : ICON.place, text: event.format },
  ].filter(Boolean) as { icon: React.ReactNode; text: string }[];

  const facts: [string, string | undefined][] = [
    ["Format", event.format],
    ["Part of", event.partOf],
    ["Hosted by", event.hosts?.join(", ")],
    ["Co-hosted by", event.coHosts?.join(", ")],
  ];

  return (
    <div className="pro-page">
      <SiteHeader />

      <section className="pro-band">
        <div className="wrap event-hero">
          <div className="event-hero-text">
            <Link href="/events" className="pro-link">
              ← All events
            </Link>
            <div className="event-hero-tags">
              <span className="event-type">{event.type}</span>
              <span className={`event-status ${upcoming ? "upcoming" : "past"}`}>{upcoming ? "Upcoming" : "Past event"}</span>
              {event.partOf && <span className="event-partof">{event.partOf}</span>}
            </div>
            <h1>{event.title}</h1>
            <p>{event.summary}</p>
            {chips.length > 0 && (
              <ul className="event-chips">
                {chips.map((c) => (
                  <li key={c.text}>
                    <Icon d={c.icon} />
                    {c.text}
                  </li>
                ))}
              </ul>
            )}
            {(event.registrationUrl || calendar) && (
              <div className="pro-actions" style={{ marginTop: 22 }}>
                {event.registrationUrl && upcoming && (
                  <a className="pro-btn" href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                    Register <ArrowIcon />
                  </a>
                )}
                {calendar && (
                  <a className="pro-btn secondary" href={calendar} target="_blank" rel="noopener noreferrer">
                    Add to Google Calendar
                  </a>
                )}
              </div>
            )}
          </div>
          {cover && (
            <a className="event-poster" href={cover} target="_blank" rel="noopener noreferrer" aria-label="Open the poster full size">
              <SafeImage src={cover} alt={event.title} label="Image coming soon" />
            </a>
          )}
        </div>
      </section>

      <main>
        <div className="wrap pro-section event-layout">
          <div className="event-main">
            <section>
              <h2 className="event-h2">About this event</h2>
              <p className="pro-text">{event.description || event.summary}</p>
            </section>

            {people.length > 0 && (
              <section>
                <h2 className="event-h2">{people.length > 1 ? "Speakers and moderator" : "Speaker"}</h2>
                <div className="event-people">
                  {people.map((p) => (
                    <div className="event-person-card" key={p.name + p.role}>
                      <span className="event-avatar" aria-hidden="true">
                        {initials(p.name)}
                      </span>
                      <div>
                        <span className="pro-tag">{p.role}</span>
                        <strong>{p.name}</strong>
                        {p.title && <span className="event-person-title">{p.title}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {gallery.length > 0 && (
              <section>
                <h2 className="event-h2">Photos</h2>
                <div className="event-gallery">
                  {gallery.map((src, i) => (
                    <a key={src} href={src} target="_blank" rel="noopener noreferrer">
                      <SafeImage src={src} alt={`${event.title}, photo ${i + 2}`} label="Image coming soon" />
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="event-side">
            <div className="pro-card">
              <span className="pro-tag">Event details</span>
              <dl className="event-facts">
                {event.date && (
                  <div>
                    <dt>Date</dt>
                    <dd>{formatDate(event.date)}</dd>
                  </div>
                )}
                {event.time && (
                  <div>
                    <dt>Time</dt>
                    <dd>{event.time}</dd>
                  </div>
                )}
                {event.venue && (
                  <div>
                    <dt>{event.format === "Online" ? "Platform" : "Place"}</dt>
                    <dd>{event.venue}</dd>
                  </div>
                )}
                {facts
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="wrap pro-section">
            <div className="pro-section-head">
              <h2>More events</h2>
              <Link href="/events" className="pro-link">
                All events →
              </Link>
            </div>
            <EventGrid events={related} />
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
