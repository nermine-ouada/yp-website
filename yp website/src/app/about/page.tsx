import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { about, site } from "@/data/ypTunisia";

export const metadata: Metadata = {
  title: "About",
  description: "Who IEEE Young Professionals Tunisia is, our mission, and what the global YP community offers early-career engineers.",
};

const WHO_WE_ARE = [
  {
    title: "A Community of Innovators",
    accent: "var(--blue)",
    body: "A community of forward-thinking individuals, bound by a shared passion for technology and a commitment to pushing the boundaries of innovation. Our members, volunteers, and initiatives span the globe, creating a rich tapestry of perspectives and experiences.",
  },
  {
    title: "Guidance for Early-Career Professionals",
    accent: "var(--orange)",
    body: "Get the insight you need to navigate the exciting and challenging early stages of your career. IEEE Young Professionals is your compass: evaluating your career goals, polishing your professional image, and setting the foundation for a lifelong and diverse network.",
  },
  {
    title: "Accessible to All IEEE Members",
    accent: "var(--green)",
    body: "Take your membership even further with opportunities you'll only find with IEEE Young Professionals. Our resources and events are available to all members, ensuring you have the support you need to thrive in your career.",
  },
];

const PILLARS = [
  {
    key: "CONNECT",
    accent: "var(--blue)",
    tagline: "Connect with peers, experts, and mentorship programs",
    points: [
      "Explore mentorship opportunities for guidance and development",
      "Expand your professional network on a global scale",
      "Seek advice from people with real-world experience across a variety of career paths",
    ],
  },
  {
    key: "LEARN",
    accent: "var(--green)",
    tagline: "Learn skills and knowledge to expand your horizons",
    points: [
      "Participate in skill-building challenges and workshops",
      "Stay current through curated educational resources",
      "Develop leadership, project management, event planning, presentation, communication and problem-solving skills through hands-on experience",
    ],
  },
  {
    key: "LEAD",
    accent: "var(--orange)",
    tagline: "Lead with impact and volunteer with purpose",
    points: [
      "Engage in impactful volunteer experiences and shape the next generation",
      "Showcase your abilities in IEEE contests, challenges, and volunteering initiatives",
      "Gain recognition and visibility, contributing to your personal and professional advancement",
    ],
  },
  {
    key: "THRIVE",
    accent: "var(--blue)",
    tagline: "Thrive in your career and community",
    points: [
      "Build a reputation as an active, engaged IEEE professional",
      "Discover new career and entrepreneurial possibilities",
      "Secure not just a job, but the career that aligns with your aspirations",
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="pro-page">
      <SiteHeader />
      <PageHero kicker="About us" title="IEEE Young Professionals Tunisia">
        {about.intro}
      </PageHero>

      <main>
        <div className="wrap">
          <section className="pro-section">
            <div className="pro-section-head">
              <div>
                <span className="pro-kicker">Mission</span>
                <h2>Our mission</h2>
                <p className="pro-lead">{about.mission.summary}</p>
              </div>
            </div>
            <div className="pro-grid cols-3">
              {about.mission.points.map((pt) => (
                <div className="pro-card" key={pt}>
                  <p>{pt}</p>
                </div>
              ))}
            </div>
            <p className="pro-text" style={{ marginTop: 24 }}>
              {about.mission.conclusion}
            </p>
          </section>

          <section className="pro-section">
            <div className="pro-section-head">
              <div>
                <span className="pro-kicker">Values</span>
                <h2>What we value</h2>
                <p className="pro-lead">{about.values.intro}</p>
              </div>
            </div>
            <div className="pro-card">
              <ul>
                {about.values.points.map((pt) => (
                  <li key={pt}>{pt[0].toUpperCase() + pt.slice(1)}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="pro-section">
            <div className="pro-section-head">
              <div>
                <span className="pro-kicker">IEEE Young Professionals</span>
                <h2>Who are the IEEE Young Professionals?</h2>
              </div>
            </div>
            <div className="pro-grid cols-3">
              {WHO_WE_ARE.map((w) => (
                <div className="pro-card" key={w.title}>
                  <h3>{w.title}</h3>
                  <p>{w.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="pro-section">
            <div className="pro-section-head">
              <div>
                <span className="pro-kicker">Connect · Learn · Lead · Thrive</span>
                <h2>Where your passion meets a global community</h2>
              </div>
            </div>
            <div className="pro-grid">
              {PILLARS.map((p) => (
                <div className="pro-card" key={p.key}>
                  <span className="pro-tag">{p.key}</span>
                  <h3>{p.tagline}</h3>
                  <ul>
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="pro-section">
            <div className="pro-cta">
              <div>
                <h2>Get involved</h2>
                <p>
                  {about.invitation} Watch{" "}
                  <a href={site.aboutVideo} target="_blank" rel="noopener noreferrer">
                    our video
                  </a>{" "}
                  or visit{" "}
                  <a href="https://yp.ieee.org" target="_blank" rel="noopener noreferrer">
                    yp.ieee.org
                  </a>
                  .
                </p>
              </div>
              <Link className="pro-btn" href="/contact">
                Contact us
              </Link>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter note="Global YP content sourced from the official IEEE YP brochure." />
    </div>
  );
}
