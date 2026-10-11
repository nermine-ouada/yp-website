import { Opportunity, CATEGORY_ACCENT } from "@/data/opportunities";
import { CalIcon, UsersIcon, AwardIcon, ArrowIcon, BadgeIcon } from "./icons";

function statusInfo(status: string) {
  if (/open/i.test(status)) return { cls: "open", label: "Open now" };
  return { cls: "annual", label: "Annual" };
}

export function OpportunityCard({ item }: { item: Opportunity }) {
  const accent = CATEGORY_ACCENT[item.sheet] ?? "var(--blue)";
  const st = statusInfo(item.status);
  const memberReq = /yes/i.test(item.membership);

  return (
    <article className="pro-card opp-card" style={{ ["--card-accent" as string]: accent }}>
      <div className="opp-top">
        <span className="pro-tag">{item.category}</span>
        <span className={`opp-status ${st.cls}`}>{st.label}</span>
      </div>
      <h3>{item.title}</h3>
      <div className="opp-meta">
        <div>
          <UsersIcon />
          <span>
            <strong>{item.level}.</strong> {item.who}
          </span>
        </div>
        <div>
          <AwardIcon />
          <span>{item.award}</span>
        </div>
        <div>
          <CalIcon />
          <span>{item.deadline}</span>
        </div>
      </div>
      {item.notes && (
        <details className="opp-more">
          <summary>More info</summary>
          <p>{item.notes}</p>
        </details>
      )}
      <div className="opp-foot">
        <span className="opp-member">
          <BadgeIcon />
          {memberReq ? "IEEE membership required" : "Open to all"}
        </span>
        <a className="pro-btn" href={item.link} target="_blank" rel="noopener noreferrer">
          Apply <ArrowIcon />
        </a>
      </div>
    </article>
  );
}
