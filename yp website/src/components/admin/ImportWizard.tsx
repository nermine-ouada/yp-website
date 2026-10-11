"use client";
import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { bulkCreateOpportunities } from "@/app/admin/actions";
import { bulkCreateEvents, bulkCreatePeople } from "@/app/admin/content-actions";

export type ImportKind = "opportunities" | "events" | "people";

type Row = Record<string, string>;
type Field = { key: string; label: string; area?: boolean; required?: boolean; aliases?: string[]; help?: string };
type Config = {
  noun: string;
  fields: Field[];
  check?: (row: Row) => string[];
  prepare?: (row: Row, defaults: { group: string }) => Row;
  save: (rows: Row[]) => Promise<{ count: number }>;
  backHref: string;
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");
const isUrl = (v: string) => !v || /^https?:\/\//i.test(v) || v.startsWith("/");

const GROUP_ALIASES: Record<string, string> = {
  officer: "officer", officers: "officer",
  taskforce: "taskforce", committee: "taskforce", member: "taskforce",
  ambassador: "ambassador", ambassadors: "ambassador",
};
const GRADES: Record<string, string> = {
  member: "Member",
  graduatestudentmember: "Graduate Student Member",
  undergraduatestudentmember: "Student Member",
  studentmember: "Student Member",
};

export const IMPORTS: Record<ImportKind, Config> = {
  opportunities: {
    noun: "opportunities",
    backHref: "/admin/opportunities",
    fields: [
      { key: "sheet", label: "Category (tab)", required: true },
      { key: "title", label: "Title", required: true },
      { key: "category", label: "Sub-category label", required: true },
      { key: "level", label: "Level", required: true },
      { key: "who", label: "Who qualifies", area: true, required: true },
      { key: "award", label: "Award / value", required: true },
      { key: "deadline", label: "Deadline", required: true },
      { key: "status", label: "Status", required: true },
      { key: "membership", label: "IEEE membership", required: true },
      { key: "notes", label: "Notes", area: true },
      { key: "link", label: "Link", required: true },
    ],
    check: (r) => (r.link && !/^https?:\/\//i.test(r.link) ? ["Link should start with http:// or https://"] : []),
    save: (rows) => bulkCreateOpportunities(rows as never),
  },
  events: {
    noun: "events",
    backHref: "/admin/events",
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "type", label: "Type", help: "e.g. Webinar, Workshop, Talk" },
      { key: "date", label: "Date", help: "yyyy-mm-dd" },
      { key: "time", label: "Time" },
      { key: "venue", label: "Place or platform", aliases: ["place", "platform", "location"] },
      { key: "summary", label: "Summary", required: true },
      { key: "speakers", label: "Speakers", help: "Name | Title; Name | Title" },
      { key: "description", label: "Description", area: true },
      { key: "format", label: "Format", help: "Online or In person" },
      { key: "partOf", label: "Part of" },
      { key: "hosts", label: "Hosts", help: "Separated by ;" },
      { key: "coHosts", label: "Co-hosts", help: "Separated by ;" },
      { key: "images", label: "Image links", help: "Separated by ;" },
      { key: "registrationUrl", label: "Registration link", aliases: ["registration", "link"] },
      { key: "initiative", label: "Collaboration / initiative", help: "yes or no" },
    ],
    check: (r) => {
      const errors: string[] = [];
      if (r.date && !/^\d{4}-\d{2}-\d{2}$/.test(r.date)) errors.push("Date should look like 2025-12-23");
      if (!isUrl(r.registrationUrl)) errors.push("Registration link should start with https://");
      return errors;
    },
    save: (rows) => bulkCreateEvents(rows as never),
  },
  people: {
    noun: "people",
    backHref: "/admin/team",
    fields: [
      { key: "group", label: "Section", required: true, aliases: ["type"], help: "Officer, Task Force or Ambassador" },
      { key: "name", label: "Full name", required: true, aliases: ["fullname"] },
      { key: "role", label: "Role", aliases: ["position"] },
      { key: "committee", label: "Committee" },
      { key: "branch", label: "Student branch", aliases: ["ieeestudentbranch", "studentbranch"] },
      { key: "membership", label: "IEEE membership grade", aliases: ["ieeemembership", "grade"] },
      { key: "photo", label: "Photo link" },
      { key: "facebook", label: "Facebook" },
    ],
    // Accepts the Task Force sheet as it is: names split in two columns,
    // "Officer" in the committee column, long membership grade names.
    prepare: (r, defaults) => {
      const row = { ...r };
      if (!row.name && (row.firstname || row.lastname)) row.name = `${row.firstname ?? ""} ${row.lastname ?? ""}`.trim();
      if (!row.group && /^officers?$/i.test(row.committee ?? "")) {
        row.group = "officer";
        row.committee = "";
      }
      row.group = GROUP_ALIASES[norm(row.group || "")] ?? (row.group ? row.group : defaults.group);
      row.membership = GRADES[norm(row.membership || "")] ?? row.membership ?? "";
      if (row.branch && /^n\/?a$/i.test(row.branch)) row.branch = "";
      return row;
    },
    check: (r) => {
      const errors: string[] = [];
      if (!["officer", "taskforce", "ambassador"].includes(r.group)) errors.push("Section should be Officer, Task Force or Ambassador");
      if (r.membership && !Object.values(GRADES).includes(r.membership)) errors.push("Grade should be Member, Graduate Student Member or Student Member");
      if (!isUrl(r.photo) || !isUrl(r.facebook)) errors.push("Links should start with https://");
      return errors;
    },
    save: (rows) => bulkCreatePeople(rows as never),
  },
};

function normalizeRow(raw: Record<string, unknown>, config: Config, defaults: { group: string }): Row {
  const lookup: Record<string, string> = {};
  for (const f of config.fields) {
    lookup[norm(f.key)] = f.key;
    lookup[norm(f.label)] = f.key;
    for (const a of f.aliases ?? []) lookup[norm(a)] = f.key;
  }
  const row: Row = {};
  for (const [key, value] of Object.entries(raw)) {
    const k = lookup[norm(key)] ?? (["firstname", "lastname"].includes(norm(key)) ? norm(key) : null);
    if (k) row[k] = String(value ?? "").trim();
  }
  const prepared = config.prepare ? config.prepare(row, defaults) : row;
  const out: Row = {};
  for (const f of config.fields) out[f.key] = prepared[f.key] ?? "";
  return out;
}

function validate(row: Row, config: Config) {
  const errors = config.fields.filter((f) => f.required && !row[f.key]).map((f) => `${f.label} is required`);
  return [...errors, ...(config.check?.(row) ?? [])];
}

export function ImportWizard({ kind }: { kind: ImportKind }) {
  const config = IMPORTS[kind];
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [index, setIndex] = useState(0);
  const [defaultGroup, setDefaultGroup] = useState("taskforce");
  const [parseError, setParseError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ count: number } | null>(null);

  const errorsByRow = useMemo(() => rows.map((r) => validate(r, config)), [rows, config]);
  const totalErrors = errorsByRow.filter((e) => e.length > 0).length;
  const current = rows[index];
  const currentErrors = errorsByRow[index] ?? [];

  async function handleFile(file: File) {
    setParseError(null);
    setResult(null);
    try {
      const wb = XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: true });
      const sheetName = wb.SheetNames[0];
      if (!sheetName) throw new Error("The file has no sheets.");
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(wb.Sheets[sheetName], {
        defval: "",
        raw: false,
        dateNF: "yyyy-mm-dd",
      });
      if (json.length === 0) throw new Error("No rows found in that file.");
      setRows(json.map((r) => normalizeRow(r, config, { group: defaultGroup })).filter((r) => Object.values(r).some(Boolean)));
      setIndex(0);
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Couldn't read that file.");
    }
  }

  function updateCurrent(key: string, value: string) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [key]: value } : r)));
  }

  function removeCurrent() {
    setRows((prev) => prev.filter((_, i) => i !== index));
    setIndex((i) => Math.max(0, Math.min(i, rows.length - 2)));
  }

  function handleSaveAll() {
    setSaveError(null);
    startTransition(async () => {
      try {
        setResult(await config.save(rows));
      } catch (e) {
        setSaveError(e instanceof Error ? e.message : "Saving failed.");
      }
    });
  }

  if (result) {
    return (
      <div className="admin-form-card">
        <h2 style={{ fontSize: 18 }}>
          Imported {result.count} {config.noun}
        </h2>
        <p className="admin-help">They are live on the site now.</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" className="apply-btn" onClick={() => router.push(config.backHref)}>
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
          <a href={`/admin/import/template?kind=${kind}`} className="admin-link-btn" style={{ alignSelf: "flex-start" }}>
            Download the template (.xlsx)
          </a>
          <p className="admin-help">
            Fill it in and upload it below. You can review and fix every row before anything is saved.
            Columns that aren&apos;t in the template are ignored.
          </p>
        </div>
        {kind === "people" && (
          <div className="admin-form-row">
            <label htmlFor="default-group" className="admin-label">
              Section for rows that don&apos;t say
            </label>
            <select id="default-group" className="admin-select" value={defaultGroup} onChange={(e) => setDefaultGroup(e.target.value)}>
              <option value="officer">Officers</option>
              <option value="taskforce">Task Force</option>
              <option value="ambassador">Ambassadors</option>
            </select>
          </div>
        )}
        <div className="admin-form-row">
          <label htmlFor="import-file" className="admin-label">
            Spreadsheet (.xlsx, .xls or .csv)
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
          <button type="button" className="admin-link-btn" disabled={index === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))}>
            ← Prev
          </button>
          <button
            type="button"
            className="admin-link-btn"
            disabled={index === rows.length - 1}
            onClick={() => setIndex((i) => Math.min(rows.length - 1, i + 1))}
          >
            Next →
          </button>
        </div>
      </div>

      <div className="import-jumps">
        {rows.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            title={`Row ${i + 1}${errorsByRow[i].length ? " (needs attention)" : ""}`}
            className={`import-jump${i === index ? " current" : ""}${errorsByRow[i].length ? " bad" : ""}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {current &&
        config.fields.map((f) => (
          <div className="admin-form-row" key={f.key}>
            <label className="admin-label">{f.label}</label>
            {f.area ? (
              <textarea className="admin-textarea" value={current[f.key]} onChange={(e) => updateCurrent(f.key, e.target.value)} />
            ) : (
              <input className="admin-input" value={current[f.key]} onChange={(e) => updateCurrent(f.key, e.target.value)} />
            )}
            {f.help && <p className="admin-help">{f.help}</p>}
          </div>
        ))}

      {currentErrors.length > 0 && (
        <ul className="admin-error" style={{ margin: 0, paddingLeft: 18 }}>
          {currentErrors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button type="button" className="apply-btn" disabled={totalErrors > 0 || isPending} onClick={handleSaveAll}>
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
      {saveError && <p className="admin-error">{saveError}</p>}
      {totalErrors > 0 && <p className="admin-help">Fix the highlighted rows before saving. Nothing is saved until then.</p>}
    </div>
  );
}
