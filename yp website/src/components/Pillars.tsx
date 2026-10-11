import { DecryptText } from "./DecryptText";

const PILLARS = [
  { label: "CONNECT", accent: "var(--blue)", copy: "Mentors, global peers, real-world advice on your career path." },
  { label: "LEARN", accent: "var(--green)", copy: "Workshops and skill-building that keep pace with your field." },
  { label: "LEAD", accent: "var(--orange)", copy: "Volunteer, run initiatives, get recognized for the work." },
  { label: "THRIVE", accent: "var(--blue)", copy: "Build the career and community you actually want." },
];

export function Pillars() {
  return (
    <section className="pillars" aria-label="Why IEEE Young Professionals">
      <div className="wrap">
        <div className="pillar-row">
          {PILLARS.map((p, i) => (
            <div className="pillar" key={p.label} style={{ ["--accent" as string]: p.accent }}>
              <DecryptText
                as="span"
                className="pillar-label"
                text={p.label}
                delay={200 + i * 140}
                duration={500}
              />
              <p>{p.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
