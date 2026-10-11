import Link from "next/link";
import type { Member, Officer } from "@/data/ypTunisia";
import type { YPEvent } from "@/data/events";
import { SafeImage } from "./SafeImage";

export function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 3)
    .join("")
    .toUpperCase();
}

// Event card: cover image, type, date and title, linking to /events/<slug>.
export function EventCard({ event: e }: { event: YPEvent }) {
  return (
    <Link className="pro-card pro-media event-card" href={`/events/${e.slug}`}>
      <SafeImage src={e.images[0]} alt={e.title} label="Image coming soon" />
      <div className="pro-media-body">
        <span className="pro-meta">
          <span className="pro-tag">{e.type}</span>
          {e.date && <> · {formatDate(e.date)}</>}
        </span>
        <h3>{e.title}</h3>
        <p>{e.summary}</p>
      </div>
    </Link>
  );
}

export function EventGrid({ events, cols = 3 }: { events: YPEvent[]; cols?: 2 | 3 }) {
  return (
    <div className={`pro-grid${cols === 3 ? " cols-3" : ""}`}>
      {events.map((e) => (
        <EventCard key={e.slug} event={e} />
      ))}
    </div>
  );
}

export function OfficerGrid({ officers }: { officers: Officer[] }) {
  return (
    <div className="pro-grid cols-4">
      {officers.map((o) => {
        const body = (
          <>
            {o.photo ? (
              <SafeImage className="officer-photo" src={o.photo} alt={o.name} label={initials(o.name)} />
            ) : (
              <div className="img-fallback officer-photo" aria-hidden="true">
                <span>{initials(o.name)}</span>
              </div>
            )}
            <h3>{o.name}</h3>
            <span className="pro-tag">{o.role}</span>
            {o.membership && <span className="pro-grade">{o.membership}</span>}
          </>
        );
        return o.facebook ? (
          <a className="pro-card pro-officer" key={o.name} href={o.facebook} target="_blank" rel="noopener noreferrer">
            {body}
          </a>
        ) : (
          <div className="pro-card pro-officer" key={o.name}>
            {body}
          </div>
        );
      })}
    </div>
  );
}

// Task Force members and ambassadors, in the same full card as the officers.
// Shows initials until a photo is added in the data file.
export function MemberGrid({ members }: { members: Member[] }) {
  return (
    <div className="pro-grid cols-4">
      {members.map((m) => (
        <div className="pro-card pro-officer" key={m.name}>
          {m.photo ? (
            <SafeImage className="officer-photo" src={m.photo} alt={m.name} label={initials(m.name)} />
          ) : (
            <div className="img-fallback officer-photo" aria-hidden="true">
              <span>{initials(m.name)}</span>
            </div>
          )}
          <h3>{m.name}</h3>
          {(m.role || m.branch) && <span className="pro-tag">{m.role ?? m.branch}</span>}
          {m.membership && <span className="pro-grade">{m.membership}</span>}
        </div>
      ))}
    </div>
  );
}
