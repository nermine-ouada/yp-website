"use client";
import { useEffect, useMemo, useState } from "react";
import { Opportunity, CATEGORY_ACCENT, Sheet } from "@/data/opportunities";
import { OpportunityCard } from "./OpportunityCard";
import { SearchBar } from "./SearchBar";
import { FilterSheet, OptionDef } from "./FilterSheet";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { usePersistentState } from "@/hooks/usePersistentState";

// The three original categories keep their brand colors; anything an admin
// adds beyond those (a brand-new "sheet") still shows up as its own filter
// tab automatically, just without a hand-picked accent color.
const KNOWN_ORDER: Sheet[] = ["Scholarships", "PhD & Fellowships", "Internships"];
const LEVEL_DEFS: { key: string; label: string; test: (level: string) => boolean }[] = [
  { key: "Undergraduate", label: "Undergrad", test: (l) => /undergrad/i.test(l) },
  {
    key: "Graduate",
    label: "Grad / Master's",
    test: (l) => /graduate|master/i.test(l) && !/postdoc/i.test(l),
  },
  { key: "PhD", label: "PhD", test: (l) => /phd/i.test(l) },
  { key: "Postdoc", label: "Postdoctoral", test: (l) => /postdoc/i.test(l) },
  {
    key: "Early Career",
    label: "Early career",
    test: (l) => /early career|young professional/i.test(l),
  },
];

export function Board({ opportunities }: { opportunities: Opportunity[] }) {
  const motionOK = !useReducedMotion();
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [categories, setCategories] = usePersistentState<string[]>("ypboard:categories", []);
  const [levels, setLevels] = usePersistentState<string[]>("ypboard:levels", []);

  // First visit: invite people to pick their preferences before they see the board.
  useEffect(() => {
    const seen = typeof window !== "undefined" && localStorage.getItem("ypboard:onboarded");
    if (!seen) setSheetOpen(true);
  }, []);

  const closeSheet = () => {
    setSheetOpen(false);
    try {
      localStorage.setItem("ypboard:onboarded", "1");
    } catch {
      /* storage blocked — fine to skip */
    }
  };

  const toggleCategory = (key: string) =>
    setCategories((prev) => (prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]));
  const toggleLevel = (key: string) =>
    setLevels((prev) => (prev.includes(key) ? prev.filter((l) => l !== key) : [...prev, key]));
  const clearAll = () => {
    setCategories([]);
    setLevels([]);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return opportunities.filter((it) => {
      if (categories.length && !categories.includes(it.sheet)) return false;
      if (levels.length) {
        const matchesAny = levels.some((lv) => LEVEL_DEFS.find((d) => d.key === lv)?.test(it.level));
        if (!matchesAny) return false;
      }
      if (q) {
        const hay = [it.title, it.category, it.level, it.who, it.notes, it.award].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, categories, levels]);

  const categories_ = useMemo(() => {
    const present = new Set(opportunities.map((o) => o.sheet));
    const known = KNOWN_ORDER.filter((c) => present.has(c));
    const extra = [...present].filter((c) => !KNOWN_ORDER.includes(c as Sheet)).sort();
    return [...known, ...extra];
  }, [opportunities]);

  const categoryOptions: OptionDef[] = categories_.map((cat) => ({
    key: cat,
    label: cat,
    count: opportunities.filter((o) => o.sheet === cat).length,
    accent: CATEGORY_ACCENT[cat as Sheet] ?? "var(--blue)",
  }));
  const levelOptions: OptionDef[] = LEVEL_DEFS.map((d) => ({
    key: d.key,
    label: d.label,
    count: opportunities.filter((o) => d.test(o.level)).length,
  }));

  const activeCount = categories.length + levels.length;

  return (
    <>
      <div className="toolbar">
        <div className="search-row">
          <SearchBar value={query} onChange={setQuery} />
          <button type="button" className="filter-trigger" onClick={() => setSheetOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
            Preferences
            {activeCount > 0 && <span className="filter-badge">{activeCount}</span>}
          </button>
        </div>

        {activeCount > 0 && (
          <div className="active-chip-row">
            {categories.map((c) => (
              <button key={c} className="active-chip" onClick={() => toggleCategory(c)}>
                {c} ✕
              </button>
            ))}
            {levels.map((l) => (
              <button key={l} className="active-chip" onClick={() => toggleLevel(l)}>
                {LEVEL_DEFS.find((d) => d.key === l)?.label ?? l} ✕
              </button>
            ))}
            <button className="active-chip clear" onClick={clearAll}>
              Clear all
            </button>
          </div>
        )}
      </div>

      <p className="count-line">
        // showing {filtered.length} of {opportunities.length}
      </p>

      <div className="grid">
        {filtered.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
            <strong>Nothing pinned here yet</strong>
            Try a different search term or loosen your preferences.
          </div>
        ) : (
          filtered.map((item, i) => (
            <OpportunityCard key={item.id} item={item} index={i} motionOK={motionOK} />
          ))
        )}
      </div>

      <FilterSheet
        open={sheetOpen}
        onClose={closeSheet}
        categoryOptions={categoryOptions}
        levelOptions={levelOptions}
        selectedCategories={categories}
        selectedLevels={levels}
        onToggleCategory={toggleCategory}
        onToggleLevel={toggleLevel}
        onClear={clearAll}
        resultCount={filtered.length}
      />
    </>
  );
}
