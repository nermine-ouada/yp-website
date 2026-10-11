import { Opportunity, CATEGORY_ACCENT } from "@/data/opportunities";
import { CalIcon, UsersIcon, AwardIcon, ArrowIcon, BadgeIcon } from "./icons";

const ROTATIONS = ["-2.2deg", "1.6deg", "-1.1deg", "2deg", "-1.6deg", "1.1deg", "-2deg", "1.4deg"];

function statusInfo(status: string) {
  if (/open/i.test(status)) return { cls: "open", label: "Open now" };
  return { cls: "ongoing", label: "Annual" };
}

export function OpportunityCard({ item, index, motionOK }: { item: Opportunity; index: number; motionOK: boolean }) {
  const accent = CATEGORY_ACCENT[item.sheet] ?? "var(--blue)";
  const st = statusInfo(item.status);
  const memberReq = /yes/i.test(item.membership);
  const rot = ROTATIONS[index % ROTATIONS.length];

  return (
    <article
      className="card"
      style={{
        ["--accent" as string]: accent,
        ...(motionOK
          ? {
              animation: "pinIn .4s cubic-bezier(.2,.8,.2,1) both",
              animationDelay: `${Math.min(index * 30, 360)}ms`,
            }
          : {}),
      }}
    >
      <span className="pushpin" />
      <div className="card-surface" style={{ ["--rot" as string]: rot }}>
        <div className="card-top">
          <span className="cat-label">{item.category}</span>
          <span className={`stamp ${st.cls}`}>{st.label}</span>
        </div>
        <h3>{item.title}</h3>
        <div className="meta">
          <div className="meta-row">
            <UsersIcon />
            <span>
              <span className="who-label">{item.level}.</span> {item.who}
            </span>
          </div>
          <div className="meta-row">
            <AwardIcon />
            <span className="award-value">{item.award}</span>
          </div>
          <div className="meta-row">
            <CalIcon />
            <span>{item.deadline}</span>
          </div>
        </div>
        {item.notes && (
          <details>
            <summary>More info</summary>
            <p>{item.notes}</p>
          </details>
        )}
        <div className="card-foot">
          <span className="member-note">
            <BadgeIcon />
            {memberReq ? "IEEE req'd" : "Open to all"}
          </span>
          <a className="apply-btn" href={item.link} target="_blank" rel="noopener noreferrer">
            Apply <ArrowIcon />
          </a>
        </div>
      </div>
    </article>
  );
}
