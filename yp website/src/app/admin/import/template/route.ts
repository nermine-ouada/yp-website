import * as XLSX from "xlsx";
import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/auth";

// One template per importable section. Headers match the import wizard's
// field keys; the example row shows the expected format and should be deleted.
const TEMPLATES: Record<string, { sheet: string; file: string; headers: string[]; example: string[] }> = {
  opportunities: {
    sheet: "Opportunities",
    file: "yp-opportunities-template.xlsx",
    headers: ["sheet", "title", "category", "level", "who", "award", "deadline", "status", "membership", "notes", "link"],
    example: [
      "Scholarships",
      "IEEE Example Society Scholarship",
      "Scholarship",
      "Undergraduate",
      "IEEE student members, any engineering field, GPA ≥ 3.0.",
      "$1,000",
      "March 31 annually",
      "Open",
      "Yes",
      "Delete this example row before importing.",
      "https://example.com",
    ],
  },
  events: {
    sheet: "Events",
    file: "yp-events-template.xlsx",
    headers: [
      "title", "type", "date", "time", "venue", "summary", "speakers", "description",
      "format", "partOf", "hosts", "coHosts", "images", "registrationUrl", "initiative",
    ],
    example: [
      "CV Writing",
      "Workshop",
      "2026-05-27",
      "8:00 PM",
      "Microsoft Teams",
      "How to write a CV that shows your competences.",
      "Hajer Kammoun | JCI Tunisia National Awards Counselor",
      "Delete this example row before importing.",
      "Online",
      "",
      "IEEE YP Tunisia Section; IEEE Tunisia Section MAC",
      "",
      "https://example.com/poster.png",
      "https://example.com/register",
      "no",
    ],
  },
  people: {
    sheet: "Team",
    file: "yp-team-template.xlsx",
    headers: ["group", "name", "role", "committee", "branch", "membership", "photo", "facebook"],
    example: [
      "Task Force",
      "Example Name",
      "Member",
      "Logistics",
      "",
      "Student Member",
      "",
      "",
    ],
  },
};

export async function GET(request: Request) {
  await assertAdmin();
  const kind = new URL(request.url).searchParams.get("kind") ?? "opportunities";
  const t = TEMPLATES[kind] ?? TEMPLATES.opportunities;

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([t.headers, t.example]);
  ws["!cols"] = t.headers.map((h) => ({ wch: Math.max(14, h.length + 4) }));
  XLSX.utils.book_append_sheet(wb, ws, t.sheet);
  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${t.file}"`,
    },
  });
}
