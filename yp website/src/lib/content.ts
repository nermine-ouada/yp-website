import "server-only";
import { cache } from "react";
import type { Event as DbEvent, Person as DbPerson } from "@prisma/client";
import { prisma } from "./prisma";
import { mergeSite, type SiteContent } from "@/data/site";
import type { EventType, Person as Speaker, YPEvent } from "@/data/events";
import type { Membership, Member } from "@/data/ypTunisia";

// ---------- Site text ----------

// cache(): one query per request even when several components ask.
export const getSite = cache(async (): Promise<SiteContent> => {
  const row = await prisma.setting.findUnique({ where: { key: "site" } });
  return mergeSite(row?.value as Partial<SiteContent> | undefined);
});

// ---------- Events ----------

const opt = (v: string | null) => v ?? undefined;

export function toEvent(row: DbEvent): YPEvent {
  return {
    slug: row.slug,
    title: row.title,
    type: row.type as EventType,
    date: opt(row.date),
    time: opt(row.time),
    format: opt(row.format) as YPEvent["format"],
    venue: opt(row.venue),
    partOf: opt(row.partOf),
    hosts: row.hosts,
    coHosts: row.coHosts,
    speakers: (row.speakers as unknown as Speaker[]) ?? [],
    moderator: (row.moderator as unknown as Speaker | null) ?? undefined,
    summary: row.summary,
    description: opt(row.description),
    images: row.images,
    registrationUrl: opt(row.registrationUrl),
    initiative: row.initiative,
  };
}

export async function getEvents(): Promise<YPEvent[]> {
  const rows = await prisma.event.findMany({ where: { hidden: false, deletedAt: null }, orderBy: { createdAt: "asc" } });
  return rows.map(toEvent);
}

export const getEventBySlug = cache(async (slug: string): Promise<YPEvent | null> => {
  const row = await prisma.event.findFirst({ where: { slug, hidden: false, deletedAt: null } });
  return row ? toEvent(row) : null;
});

// ---------- People ----------

export type PersonGroup = "officer" | "taskforce" | "ambassador";
export const PERSON_GROUPS: { key: PersonGroup; label: string }[] = [
  { key: "officer", label: "Officers" },
  { key: "taskforce", label: "Task Force" },
  { key: "ambassador", label: "Ambassadors" },
];

export function toMember(row: DbPerson): Member & { facebook?: string; committee?: string } {
  return {
    name: row.name,
    role: opt(row.role),
    branch: opt(row.branch),
    photo: opt(row.photo),
    membership: opt(row.membership) as Membership | undefined,
    facebook: opt(row.facebook),
    committee: opt(row.committee),
  };
}

export async function getTeam() {
  const rows = await prisma.person.findMany({
    where: { hidden: false, deletedAt: null },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  const people = rows.map((r) => ({ group: r.group as PersonGroup, ...toMember(r) }));

  // Committees keep the order in which they first appear.
  const committees: { committee: string; members: Member[] }[] = [];
  for (const p of people.filter((p) => p.group === "taskforce")) {
    const name = p.committee || "Other";
    let c = committees.find((x) => x.committee === name);
    if (!c) committees.push((c = { committee: name, members: [] }));
    c.members.push(p);
  }

  return {
    officers: people.filter((p) => p.group === "officer").map((p) => ({ ...p, role: p.role ?? "" })),
    taskForce: committees,
    ambassadors: people.filter((p) => p.group === "ambassador"),
  };
}
