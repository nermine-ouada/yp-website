"use client";
import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { bulkCreateOpportunities, type BulkOpportunityRow } from "@/app/admin/actions";

const FIELDS: { key: keyof BulkOpportunityRow; label: string; area?: boolean }[] = [
  { key: "sheet", label: "Category (tab)" },
  { key: "title", label: "Title" },
  { key: "category", label: "Sub-category label" },
  { key: "level", label: "Level" },
  { key: "who", label: "Who qualifies", area: true },
  { key: "award", label: "Award / value" },
  { key: "deadline", label: "Deadline" },
  { key: "status", label: "Status" },
  { key: "membership", label: "IEEE membership" },
  { key: "notes", label: "Notes", area: true },
  { key: "link", label: "Link" },
];

const HEADER_ALIASES: Record<string, keyof BulkOpportunityRow> = Object.fromEntries(
  FIELDS.map((f) => [f.key, f.key])
) as Record<string, keyof BulkOpportunityRow>;

function normalizeRow(raw: Record<string, unknown>): BulkOpportunityRow {
  const row = {} as BulkOpportunityRow;
  for (const [key, value] of Object.entries(raw)) {
    const normalizedKey = HEADER_ALIASES[key.trim().toLowerCase()];
    if (normalizedKey) row[normalizedKey] = String(value ?? "").trim();
  }
  for (const f of FIELDS) if (row[f.key] === undefined) row[f.key] = "";
  return row;
}

function validateRow(row: BulkOpportunityRow): string[] {
  const errors: string[] = [];
  for (const f of FIELDS) {
    if (f.key === "notes") continue; // optional
    if (!row[f.key]) errors.push(`${f.label} is required`);
  }
  if (row.link && !/^https?:\/\//i.test(row.link)) {
    errors.push("Link should start with http:// or https://");
  }
  return errors;
}

export function ImportWizard() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<BulkOpportunityRow[]>([]);
  const [index, setIndex] = useState(0);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ count: number } | null>(null);

  const errorsByRow = useMemo(() => rows.map(validateRow), [rows]);
  const totalErrors = errorsByRow.filter((e) => e.length > 0).length;
  const current = rows[index];
  const currentErrors = errorsByRow[index] ?? [];

  async function handleFile(file: File) {
    setParseError(null);
    setResult(null);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const sheetName = wb.SheetNames[0];
      if (!sheetName) throw new Error("The file has no sheets.");
      const ws = wb.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
      if (json.length === 0) throw new Error("No rows found in that file.");
      const parsed = json.map(normalizeRow);
      setRows(parsed);
      setIndex(0);
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Couldn't read that file.");
    }
  }

  function updateCurrent(key: keyof BulkOpportunityRow, value: string) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [key]: value } : r)));
  }

  function removeCurrent() {
    setRows((prev) => prev.filter((_, i) => i !== index));
    setIndex((i) => Math.max(0, Math.min(i, rows.length - 2)));
  }

  function handleSaveAll() {
    startTransition(async () => {
      const res = await bulkCreateOpportunities(rows);
      setResult(res);
    });
  }

  if (result) {
    return (
      <div className="admin-form-card">
        <h2 style={{ fontSize: 18 }}>Pinned {result.count} new opportunities</h2>
        <p style={{ color: "var(--board-muted)", fontSize: 13.5 }}>
          They&apos;re live on the board now.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            className="apply-btn"
            style={{ ["--accent" as string]: "var(--blue)" }}
            onClick={() => router.push("/admin")}
          >
            Back to list
          </button>
          <button
            type="button"
            className="admin-link-btn"
            onClick={() => {
              setRows([]);
              setResult(null);
            }}
          >
            Import more
          </button>
        </div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="admin-form-card">
        <div className="admin-form-row">
          <a href="/admin/import/template" className="admin-link-btn" style={{ alignSelf: "flex-start" }}>
            ↓ Download the template (.xlsx)
          </a>
          <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "6px 0 0" }}>
            Fill it out, then upload it below. Every column from the template maps directly onto
            the opportunity form — you&apos;ll get a chance to review and fix each row before
            anything is saved.
          </p>
        </div>
        <div className="admin-form-row">
          <label htmlFor="import-file" className="admin-label">
            Upload filled spreadsheet
          </label>
          <input
            id="import-file"
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="admin-input"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          {parseError && <p className="admin-error">{parseError}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-form-card" style={{ maxWidth: 680 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <p className="count-line" style={{ margin: 0 }}>
          Row {index + 1} of {rows.length}
          {totalErrors > 0 ? ` · ${totalErrors} row${totalErrors === 1 ? "" : "s"} need attention` : " · all rows look good"}
        </p>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            type="button"
            className="admin-link-btn"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            aria-label="Previous row"
          >
            ← Prev
          </button>
          <button
            type="button"
            className="admin-link-btn"
            disabled={index === rows.length - 1}
            onClick={() => setIndex((i) => Math.min(rows.length - 1, i + 1))}
            aria-label="Next row"
          >
            Next →
          </button>
        </div>
      </div>

      {/* jump strip: dots colored by row validity, click to jump */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {rows.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            title={`Row ${i + 1}${errorsByRow[i].length ? " (has errors)" : ""}`}
            style={{
              width: 22,
              height: 22,
              borderRadius: 4,
              border: i === index ? "2px solid var(--blue)" : "1px solid var(--line)",
              background: errorsByRow[i].length > 0 ? "var(--stamp-open)" : "var(--paper)",
              color: errorsByRow[i].length > 0 ? "#fff" : "var(--muted)",
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10,
              cursor: "pointer",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {current &&
        FIELDS.map((f) => (
          <div className="admin-form-row" key={f.key}>
            <label className="admin-label">{f.label}</label>
            {f.area ? (
              <textarea
                className="admin-textarea"
                value={current[f.key]}
                onChange={(e) => updateCurrent(f.key, e.target.value)}
              />
            ) : (
              <input
                className="admin-input"
                value={current[f.key]}
                onChange={(e) => updateCurrent(f.key, e.target.value)}
              />
            )}
          </div>
        ))}

      {currentErrors.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: 18, color: "var(--stamp-open)", fontSize: 12.5 }}>
          {currentErrors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          type="button"
          className="apply-btn"
          style={{ ["--accent" as string]: "var(--blue)" }}
          disabled={totalErrors > 0 || isPending}
          onClick={handleSaveAll}
        >
          {isPending ? "Saving…" : `Save all ${rows.length} rows`}
        </button>
        <button type="button" className="admin-link-btn danger" onClick={removeCurrent}>
          Discard this row
        </button>
        <button
          type="button"
          className="admin-link-btn"
          onClick={() => {
            setRows([]);
            setParseError(null);
          }}
        >
          Start over
        </button>
      </div>
      {totalErrors > 0 && (
        <p style={{ fontSize: 12, color: "var(--muted)" }}>
          Fix every highlighted row (use the numbered jumps above) before saving — nothing is
          written to the board until then.
        </p>
      )}
    </div>
  );
}
