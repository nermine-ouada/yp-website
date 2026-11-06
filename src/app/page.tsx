import Link from "next/link";
import { Carousel } from "@/components/Carousel";
import { EventCard, EventGrid } from "@/components/Gallery";
import { SafeImage } from "@/components/SafeImage";
import { Impact } from "@/components/Impact";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArrowIcon } from "@/components/icons";
import { getOpportunities } from "@/lib/opportunities";
import { getEvents, getSite, getTeam } from "@/lib/content";
import { isNews, sortByDate } from "@/data/events";

// Shows a few live opportunities, so keep the same cadence as the board.
export const revalidate = 60;

const PILLARS = [
  { title: "Connect", body: "Mentors, global peers and real-world advice on your career path." },
  { title: "Learn", body: "Workshops and skill-building that keep pace with your field." },
  { title: "Lead", body: "Volunteer, run initiatives and get recognized for the work." },
  { title: "Thrive", body: "Build the career and community you actually want." },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

export default async function Home() {
  const [opportunities, site, events, team] = await Promise.all([getOpportunities(), getSite(), getEvents(), getTeam()]);
  const { about, contact, officersTerm } = site;
  const { officers, taskForce, ambassadors } = team;
  const open = opportunities.filter((o) => /open/i.test(o.status));
  const featured = (open.length >= 4 ? open : opportunities).slice(0, 4);
  const recent = sortByDate(events.filter((e) => !isNews(e) && !e.initiative)).slice(0, 6);
  const initiatives = sortByDate(events.filter((e) => e.initiative));
  const activities = sortByDate(events).slice(0, 8);
  const taskForceCount = taskForce.reduce((n, c) => n + c.members.length, 0);

  return (
    <div className="pro-page">
      <SiteHeader />

      <section className="pro-band">
        <div className="wrap pro-hero home-hero">
          <div>
            <span className="pro-kicker">IEEE Young Professionals Tunisia Affinity Group</span>
            <h1>{site.heroTitle}</h1>
            <p>{site.heroText}</p>
            <div className="pro-actions">
              <Link className="pro-btn" href="/opportunities">
                Browse opportunities <ArrowIcon />
              </Link>
              <a className="pro-btn secondary" href={site.joinUrl} target="_blank" rel="noopener noreferrer">
                Join IEEE
              </a>
            </div>
          </div>
          <div className="pro-video">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${site.introVideoId}`}
              title="Know more about IEEE Young Professionals"
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <main>
        <div className="wrap">
          <section className="pro-section">
            <div className="pro-stats">
              {site.stats.map((st) => (
                <div className="pro-stat" key={st.label}>
                  <b>{st.value.replace("{opportunities}", String(opportunities.length))}</b>
                  <span>{st.label}</span>
                </div>
              ))}
            </div>
          </section>

          <Impact data={site.impact} />

          <section className="pro-section split split-5-7">
            <div>
              <span className="pro-kicker">What we offer</span>
              <h2 className="pro-h2">Connect, learn, lead, thrive</h2>
              <p className="pro-lead">{about.missionSummary}</p>
              <p className="pro-lead">{about.missionConclusion}</p>
              <Link href="/about" className="pro-link" style={{ marginTop: 18 }}>
                About us →
              </Link>
            </div>
            <div className="pro-grid">
              {PILLARS.map((p) => (
                <div className="pro-card" key={p.title}>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="pro-section split split-7-5">
            <div>
              <div className="pro-section-head">
                <div>
                  <span className="pro-kicker">Opportunities</span>
                  <h2>Scholarships, fellowships and internships</h2>
                </div>
                <Link href="/opportunities" className="pro-link">
                  View all {opportunities.length} →
                </Link>
              </div>
              <div className="pro-list">
                {featured.map((o) => (
                  <div className="pro-row" key={o.id}>
                    <div>
                      <span className="pro-tag">{o.sheet}</span>
                      <h3>{o.title}</h3>
                      <p className="pro-meta">
                        {o.level} · Deadline: {o.deadline}
                      </p>
                    </div>
                    <a className="pro-btn secondary" href={o.link} target="_blank" rel="noopener noreferrer">
                      Details
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="pro-section-head">
                <div>
                  <span className="pro-kicker">Activities</span>
                  <h2>Recent events</h2>
                </div>
                <Link href="/events" className="pro-link">
                  All events →
                </Link>
              </div>
              <Carousel label="Recent events" autoplay={5000}>
                {recent.map((e) => (
                  <EventCard key={e.slug} event={e} />
                ))}
              </Carousel>
            </div>
          </section>

          <section className="pro-section">
            <div className="pro-section-head">
              <div>
                <span className="pro-kicker">Activities</span>
                <h2>Our activities</h2>
                <p className="pro-lead">Webinars, workshops, talks and challenges from the past year.</p>
              </div>
              <Link href="/events" className="pro-link">
                See all {events.length} →
              </Link>
            </div>
            <EventGrid events={activities} cols={4} />
          </section>

          <section className="pro-section">
            <div className="pro-section-head">
              <div>
                <span className="pro-kicker">Collaborations</span>
                <h2>Collaborations and initiatives</h2>
              </div>
              <Link href="/events" className="pro-link">
                All events →
              </Link>
            </div>
            <Carousel label="Collaborations and initiatives" perView={3} autoplay={6000}>
              {initiatives.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </Carousel>
          </section>

          <section className="pro-section split split-5-7">
            <div>
              <span className="pro-kicker">Our team {officersTerm}</span>
              <h2 className="pro-h2">The people behind YP Tunisia</h2>
              <p className="pro-lead">
                An executive committee, a YP Task Force organized in committees, and ambassadors in
                student branches across the country.
              </p>
              <div className="team-figures">
                <div>
                  <b>{officers.length}</b>
                  <span>Officers</span>
                </div>
                <div>
                  <b>{taskForceCount}</b>
                  <span>Task Force volunteers</span>
                </div>
                <div>
                  <b>{ambassadors.length}</b>
                  <span>Ambassadors</span>
                </div>
              </div>
              <Link href="/officers" className="pro-btn" style={{ marginTop: 22 }}>
                Meet the team <ArrowIcon />
              </Link>
            </div>
            <div className="mini-team">
              {officers.map((o) => (
                <div className="mini-person" key={o.name}>
                  {o.photo ? (
                    <SafeImage src={o.photo} alt={o.name} label={initials(o.name)} />
                  ) : (
                    <div className="img-fallback" aria-hidden="true">
                      <span>{initials(o.name)}</span>
                    </div>
                  )}
                  <div>
                    <strong>{o.name}</strong>
                    <span>{o.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="pro-section">
            <div className="pro-cta">
              <div>
                <h2>Get in touch</h2>
                <p>
                  Volunteering, partnerships or questions: write to{" "}
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>.
                </p>
              </div>
              <Link className="pro-btn" href="/contact">
                Contact us
              </Link>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
