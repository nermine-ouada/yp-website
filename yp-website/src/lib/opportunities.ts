import "server-only";
import { prisma } from "./prisma";
import type { Opportunity as DbOpportunity, Prisma } from "@prisma/client";
import type { Opportunity, Sheet } from "@/data/opportunities";

function toOpportunity(row: DbOpportunity): Opportunity {
  return {
    id: row.id,
    sheet: row.sheet as Sheet,
    title: row.title,
    category: row.category,
    level: row.level,
    who: row.who,
    award: row.award,
    deadline: row.deadline,
    status: row.status,
    membership: row.membership,
    notes: row.notes,
    link: row.link,
  };
}

export async function getOpportunities(): Promise<Opportunity[]> {
  const rows = await prisma.opportunity.findMany({
    where: { deletedAt: null, hidden: false },
    orderBy: [{ sheet: "asc" }, { sortOrder: "asc" }],
  });
  return rows.map(toOpportunity);
}

export type OpportunityFilters = {
  q?: string;
  sheet?: string[];
  category?: string[];
  level?: string[];
  status?: string[];
  membership?: string[];
  deadline?: string;
  updatedSince?: Date;
  limit?: number;
  offset?: number;
};

// Public, filterable listing used by GET /api/opportunities. Trashed and
// hidden rows are never returned. Every filter is a case-insensitive "contains" match; list
// filters match if any of their values does.
export async function findOpportunities(filters: OpportunityFilters) {
  const anyOf = (field: "sheet" | "category" | "level" | "status" | "membership", values?: string[]) =>
    values?.length
      ? [{ OR: values.map((v) => ({ [field]: { contains: v, mode: "insensitive" as const } })) }]
      : [];

  const where: Prisma.OpportunityWhereInput = {
    deletedAt: null,
    hidden: false,
    AND: [
      ...anyOf("sheet", filters.sheet),
      ...anyOf("category", filters.category),
      ...anyOf("level", filters.level),
      ...anyOf("status", filters.status),
      ...anyOf("membership", filters.membership),
      ...(filters.updatedSince ? [{ updatedAt: { gte: filters.updatedSince } }] : []),
      ...(filters.deadline ? [{ deadline: { contains: filters.deadline, mode: "insensitive" as const } }] : []),
      ...(filters.q
        ? [
            {
              OR: (["title", "category", "level", "who", "notes"] as const).map((field) => ({
                [field]: { contains: filters.q, mode: "insensitive" as const },
              })),
            },
          ]
        : []),
    ],
  };

  const [total, rows] = await Promise.all([
    prisma.opportunity.count({ where }),
    prisma.opportunity.findMany({
      where,
      // id as a tiebreaker keeps limit/offset pages stable.
      orderBy: [{ sheet: "asc" }, { sortOrder: "asc" }, { id: "asc" }],
      take: filters.limit,
      skip: filters.offset,
    }),
  ]);
  return {
    total,
    data: rows.map((row) => ({
      ...toOpportunity(row),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    })),
  };
}

export async function countOpportunities(): Promise<number> {
  return prisma.opportunity.count({ where: { deletedAt: null, hidden: false } });
}

export async function getOpportunity(id: string) {
  return prisma.opportunity.findUnique({ where: { id } });
}

export async function getDistinctSheets(): Promise<string[]> {
  const rows = await prisma.opportunity.findMany({
    distinct: ["sheet"],
    select: { sheet: true },
    orderBy: { sheet: "asc" },
  });
  return rows.map((r) => r.sheet);
}

export async function getDistinctLevels(): Promise<string[]> {
  const rows = await prisma.opportunity.findMany({
    distinct: ["level"],
    select: { level: true },
    orderBy: { level: "asc" },
  });
  return rows.map((r) => r.level).filter(Boolean);
}

export async function getDistinctDeadlines(): Promise<string[]> {
  const rows = await prisma.opportunity.findMany({
    distinct: ["deadline"],
    select: { deadline: true },
    orderBy: { deadline: "asc" },
  });
  return rows.map((r) => r.deadline).filter(Boolean);
}
