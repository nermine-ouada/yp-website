import * as XLSX from "xlsx";
import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/auth";

const HEADERS = [
  "sheet",
  "title",
  "category",
  "level",
  "who",
  "award",
  "deadline",
  "status",
  "membership",
  "notes",
  "link",
];

const EXAMPLE_ROW = [
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
];

export async function GET() {
  await assertAdmin();

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([HEADERS, EXAMPLE_ROW]);
  ws["!cols"] = HEADERS.map((h) => ({ wch: Math.max(14, h.length + 4) }));
  XLSX.utils.book_append_sheet(wb, ws, "Opportunities");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="yp-board-import-template.xlsx"',
    },
  });
}
