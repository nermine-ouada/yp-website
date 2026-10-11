"use client";
import { useState } from "react";
import type { Member } from "@/data/ypTunisia";
import { MemberGrid } from "./Gallery";

// One committee at a time, switched with tabs.
export function CommitteeTabs({ committees }: { committees: { committee: string; members: Member[] }[] }) {
  const [active, setActive] = useState(0);
  const current = committees[active];

  return (
    <div>
      <div className="team-tabs" role="tablist" aria-label="Committees">
        {committees.map((c, i) => (
          <button
            key={c.committee}
            type="button"
            role="tab"
            id={`committee-tab-${i}`}
            aria-selected={i === active}
            aria-controls="committee-panel"
            className={`team-tab${i === active ? " active" : ""}`}
            onClick={() => setActive(i)}
          >
            {c.committee}
            <span className="team-tab-count">{c.members.length}</span>
          </button>
        ))}
      </div>
      <div id="committee-panel" role="tabpanel" aria-labelledby={`committee-tab-${active}`}>
        <MemberGrid members={current.members} />
      </div>
    </div>
  );
}
