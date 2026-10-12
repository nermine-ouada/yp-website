import type { Impact as ImpactData, Kpi } from "@/data/site";
import { CountUpText, GrowOnView } from "./ImpactMotion";

// "$3 000" / "+2 500" -> 3000 / 2500, for bar lengths only; labels keep the text.
const amount = (v: string) => Number(v.replace(/[^0-9.]/g, "")) || 0;

// Badge text: the note if one was written, otherwise the change worked out
// from the numbers. Decreases are left unbadged rather than shown in red.
function change(kpi: Kpi) {
  if (kpi.note) return kpi.note;
  const a = amount(kpi.before);
  const b = amount(kpi.after);
  if (!a || b <= a) return null;
  return `+${Math.round(((b - a) / a) * 100)}%`;
}

const ICONS: Record<string, React.ReactNode> = {
  financial: <path d="M12 3v18M16.5 7.5c0-1.7-2-3-4.5-3S7.5 5.8 7.5 7.5 9.5 10.4 12 11s4.5 1.8 4.5 3.5-2 3-4.5 3-4.5-1.3-4.5-3" />,
  round: (
    <>
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="3.5" r="1.6" />
      <circle cx="12" cy="20.5" r="1.6" />
      <circle cx="3.5" cy="12" r="1.6" />
      <circle cx="20.5" cy="12" r="1.6" />
    </>
  ),
  mentor: (
    <>
      <circle cx="8" cy="7" r="3" />
      <path d="M2.5 20c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5M16 9l2 2 4-4" />
    </>
  ),
  contest: <path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM8 6H4.5c0 3 1.5 4.5 3.5 4.5M16 6h3.5c0 3-1.5 4.5-3.5 4.5M12 13v4M8.5 20h7" />,
  interview: <path d="M4 5h11v8H8l-4 3V5ZM15 9h5v8l-3-2h-6v-2" />,
  presentation: <path d="M3 4h18M5 4v10h14V4M12 14v3M8 21l4-4 4 4" />,
  meetup: (
    <>
      <circle cx="12" cy="5" r="2.2" />
      <circle cx="5" cy="17" r="2.2" />
      <circle cx="19" cy="17" r="2.2" />
      <path d="M12 7.2v4.3M12 11.5 6.6 15.4M12 11.5l5.4 3.9" />
    </>
  ),
};

function activityIcon(name: string) {
  const n = name.toLowerCase();
  const key = n.includes("financ")
    ? "financial"
    : n.includes("round")
      ? "round"
      : n.includes("mentor")
        ? "mentor"
        : n.includes("contest") || n.includes("challenge")
          ? "contest"
          : n.includes("interview")
            ? "interview"
            : n.includes("present")
              ? "presentation"
              : "meetup";
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[key]}
    </svg>
  );
}

// One KPI as two bars (earlier year, current year) on a shared baseline.
// Single measure per chart and every bar direct-labeled, so no legend.
function KpiChart({ kpi, yearBefore, yearAfter }: { kpi: Kpi; yearBefore: string; yearAfter: string }) {
  const a = amount(kpi.before);
  const b = amount(kpi.after);
  const max = Math.max(a, b, 1);
  const badge = change(kpi);
  const bars = [
    { year: yearBefore, value: kpi.before, pct: (a / max) * 100, cls: "before" },
    { year: yearAfter, value: kpi.after, pct: (b / max) * 100, cls: "after" },
  ];

  return (
    <figure className="pro-card kpi-card">
      <figcaption className="kpi-title">
        <span>{kpi.label}</span>
        {badge && (
          <span className="kpi-badge">
            <span aria-hidden="true">↑</span> {badge}
          </span>
        )}
      </figcaption>
      <GrowOnView className="kpi-bars">
        <div role="img" aria-label={`${kpi.label}: ${yearBefore} ${kpi.before}, ${yearAfter} ${kpi.after}`} className="kpi-bars-inner">
          {bars.map((bar, i) => (
            <div className="kpi-col" key={bar.year} title={`${bar.year}: ${bar.value}`}>
              <span className="kpi-value">{bar.value}</span>
              <div className="kpi-track">
                <div
                  className={`kpi-bar ${bar.cls}`}
                  style={{ ["--h" as string]: `${Math.max(bar.pct, 4)}%`, transitionDelay: `${i * 120}ms` }}
                />
              </div>
              <span className="kpi-year">{bar.year}</span>
            </div>
          ))}
        </div>
      </GrowOnView>
    </figure>
  );
}

export function Impact({ data }: { data: ImpactData }) {
  // "+75% compared with +400 in October 2024" -> 400, for the growth bar.
  const earlier = Number((data.membersNote.match(/\+?([\d\s,]+)\s+in/)?.[1] ?? "").replace(/[\s,]/g, ""));
  const now = amount(data.membersValue);
  const growthPct = earlier && now > earlier ? Math.round((earlier / now) * 100) : 0;

  return (
    <section className="pro-section">
      <div className="pro-section-head">
        <div>
          <span className="pro-kicker">
            Impact {data.yearBefore}–{data.yearAfter}
          </span>
          <h2>{data.title}</h2>
        </div>
      </div>

      <div className="impact-grid">
        <div className="impact-hero">
          <span className="impact-hero-label">{data.membersLabel}</span>
          <CountUpText value={data.membersValue} className="impact-hero-number" />
          {growthPct > 0 && (
            <GrowOnView className="impact-growth">
              <div className="impact-growth-track" title={data.membersNote}>
                <div className="impact-growth-then" style={{ width: `${growthPct}%` }} />
                <div className="impact-growth-now" />
              </div>
            </GrowOnView>
          )}
          <span className="impact-hero-note">{data.membersNote}</span>
          {data.award && (
            <p className="impact-award">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="12" cy="9" r="5.5" />
                <path d="M8.5 13.5 7 21l5-2.5 5 2.5-1.5-7.5" />
              </svg>
              <span>{data.award}</span>
            </p>
          )}
        </div>
        {data.kpis.map((k) => (
          <KpiChart key={k.label} kpi={k} yearBefore={data.yearBefore} yearAfter={data.yearAfter} />
        ))}
      </div>

      {data.activities.length > 0 && (
        <div className="impact-activities">
          <span className="impact-activities-label">Support and activities</span>
          <ul>
            {data.activities.map((a) => (
              <li key={a}>
                {activityIcon(a)}
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
