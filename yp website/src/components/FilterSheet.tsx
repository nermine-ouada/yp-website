"use client";
import { useEffect } from "react";

export type OptionDef = { key: string; label: string; count: number; accent?: string };

function OptionTile({
  option,
  selected,
  onToggle,
}: {
  option: OptionDef;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className={`option-tile${selected ? " selected" : ""}`}
      style={option.accent ? ({ ["--accent" as string]: option.accent }) : undefined}
      aria-pressed={selected}
      onClick={onToggle}
    >
      <span className="option-check" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <span className="option-label">{option.label}</span>
      <span className="option-count">{option.count}</span>
    </button>
  );
}

export function FilterSheet({
  open,
  onClose,
  categoryOptions,
  levelOptions,
  selectedCategories,
  selectedLevels,
  onToggleCategory,
  onToggleLevel,
  onClear,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;
  categoryOptions: OptionDef[];
  levelOptions: OptionDef[];
  selectedCategories: string[];
  selectedLevels: string[];
  onToggleCategory: (key: string) => void;
  onToggleLevel: (key: string) => void;
  onClear: () => void;
  resultCount: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const activeCount = selectedCategories.length + selectedLevels.length;

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Set your preferences"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-handle" />
        <div className="sheet-header">
          <div>
            <span className="eyebrow" style={{ marginBottom: 4 }}>
              // your preferences
            </span>
            <h2>What are you into?</h2>
          </div>
          <button type="button" className="sheet-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <p className="sheet-section-label">Category · pick as many as you like</p>
        <div className="option-grid">
          {categoryOptions.map((opt) => (
            <OptionTile
              key={opt.key}
              option={opt}
              selected={selectedCategories.includes(opt.key)}
              onToggle={() => onToggleCategory(opt.key)}
            />
          ))}
        </div>

        <p className="sheet-section-label">Level</p>
        <div className="option-grid">
          {levelOptions.map((opt) => (
            <OptionTile
              key={opt.key}
              option={opt}
              selected={selectedLevels.includes(opt.key)}
              onToggle={() => onToggleLevel(opt.key)}
            />
          ))}
        </div>

        <div className="sheet-footer">
          <button type="button" className="sheet-clear" onClick={onClear} disabled={activeCount === 0}>
            Clear all
          </button>
          <button type="button" className="sheet-apply" onClick={onClose}>
            Show {resultCount} {resultCount === 1 ? "pin" : "pins"}
          </button>
        </div>
      </div>
    </div>
  );
}
