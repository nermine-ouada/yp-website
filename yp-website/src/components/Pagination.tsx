"use client";
import { useState } from "react";
import type { Member } from "@/data/ypTunisia";
import type { YPEvent } from "@/data/events";
import { EventGrid, MemberGrid } from "./Gallery";

function usePaged<T>(items: T[], perPage: number) {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(items.length / perPage);
  return { page, pages, setPage, shown: items.slice(page * perPage, page * perPage + perPage) };
}

// Previous / page numbers / next. Hidden when everything fits on one page.
function Pager({ page, pages, setPage, label }: { page: number; pages: number; setPage: (p: number) => void; label: string }) {
  if (pages <= 1) return null;
  return (
    <nav className="pager" aria-label={label}>
      <button type="button" className="pager-btn" onClick={() => setPage(page - 1)} disabled={page === 0}>
        ← Previous
      </button>
      <div className="pager-pages">
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`pager-num${i === page ? " active" : ""}`}
            aria-current={i === page ? "page" : undefined}
            aria-label={`Page ${i + 1}`}
            onClick={() => setPage(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <button type="button" className="pager-btn" onClick={() => setPage(page + 1)} disabled={page === pages - 1}>
        Next →
      </button>
    </nav>
  );
}

export function PagedMembers({ members, perPage = 4 }: { members: Member[]; perPage?: number }) {
  const p = usePaged(members, perPage);
  return (
    <div>
      <MemberGrid members={p.shown} />
      <Pager {...p} label="Ambassadors pages" />
    </div>
  );
}

export function PagedEvents({
  events,
  perPage = 6,
  cols = 3,
  label = "Events pages",
}: {
  events: YPEvent[];
  perPage?: number;
  cols?: 2 | 3;
  label?: string;
}) {
  const p = usePaged(events, perPage);
  return (
    <div>
      <EventGrid events={p.shown} cols={cols} />
      <Pager {...p} label={label} />
    </div>
  );
}
