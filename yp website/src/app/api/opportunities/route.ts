import type { NextRequest } from "next/server";
import { findOpportunities } from "@/lib/opportunities";

const MAX_LIMIT = 500;

// Public read-only data, so any site or automation tool may fetch it.
const HEADERS = { "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" };

function error(status: number, message: string) {
  return Response.json({ error: message }, { status, headers: HEADERS });
}

// Repeat a param to match any of several values: ?level=A&level=B. (No comma
// splitting: some values, e.g. "Graduate (Master's, 1st year)", contain commas.)
function list(params: URLSearchParams, key: string): string[] | undefined {
  const values = params
    .getAll(key)
    .map((v) => v.trim())
    .filter(Boolean);
  return values.length ? values : undefined;
}

function text(params: URLSearchParams, key: string): string | undefined {
  return params.get(key)?.trim() || undefined;
}

// undefined = not given, null = invalid
function nonNegativeInt(params: URLSearchParams, key: string): number | undefined | null {
  const raw = text(params, key);
  if (raw === undefined) return undefined;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

function date(params: URLSearchParams, key: string): Date | undefined | null {
  const raw = text(params, key);
  if (raw === undefined) return undefined;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const rawLimit = nonNegativeInt(params, "limit");
  const rawOffset = nonNegativeInt(params, "offset");
  const updatedSince = date(params, "updatedSince");
  if (rawLimit === null || (rawLimit !== undefined && (rawLimit < 1 || rawLimit > MAX_LIMIT))) {
    return error(400, `limit must be an integer between 1 and ${MAX_LIMIT}`);
  }
  if (rawOffset === null) return error(400, "offset must be a non-negative integer");
  const limit = rawLimit ?? MAX_LIMIT;
  const offset = rawOffset ?? 0;
  if (updatedSince === null) return error(400, "updatedSince must be an ISO 8601 date, e.g. 2026-10-01T00:00:00Z");

  try {
    const { total, data } = await findOpportunities({
      q: text(params, "q"),
      sheet: list(params, "sheet"),
      category: list(params, "category"),
      level: list(params, "level"),
      status: list(params, "status"),
      membership: list(params, "membership"),
      deadline: text(params, "deadline"),
      updatedSince,
      limit,
      offset,
    });
    return Response.json({ total, count: data.length, limit, offset, data }, { headers: HEADERS });
  } catch (e) {
    console.error("GET /api/opportunities failed", e);
    return error(500, "Internal server error");
  }
}
