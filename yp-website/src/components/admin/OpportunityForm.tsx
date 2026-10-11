import { SubmitButton } from "./SubmitButton";

export type OpportunityFormValues = {
  sheet?: string;
  title?: string;
  category?: string;
  level?: string;
  who?: string;
  award?: string;
  deadline?: string;
  status?: string;
  membership?: string;
  notes?: string;
  link?: string;
};

export function OpportunityForm({
  action,
  initial,
  submitLabel,
  existingSheets,
  existingLevels,
  existingDeadlines,
}: {
  action: (formData: FormData) => void | Promise<void>;
  initial?: OpportunityFormValues;
  submitLabel: string;
  existingSheets: string[];
  existingLevels: string[];
  existingDeadlines: string[];
}) {
  return (
    <form action={action} className="admin-form-card">
      <div className="admin-form-row">
        <label htmlFor="sheet" className="admin-label">
          Category (tab on the board) *
        </label>
        <input
          id="sheet"
          name="sheet"
          required
          list="sheet-options"
          defaultValue={initial?.sheet}
          placeholder="Pick an existing one, or type a brand new category"
          className="admin-input"
          autoComplete="off"
        />
        <datalist id="sheet-options">
          {existingSheets.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
        <p style={{ fontSize: 11.5, color: "var(--muted)", margin: "4px 0 0" }}>
          Typing something new here creates a new category tab on the board automatically.
        </p>
      </div>

      <div className="admin-form-row">
        <label htmlFor="title" className="admin-label">
          Title *
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={initial?.title}
          placeholder="e.g. IEEE PES Scholarship Plus Initiative"
          className="admin-input"
        />
      </div>

      <div className="admin-form-grid">
        <div className="admin-form-row">
          <label htmlFor="category" className="admin-label">
            Sub-category label *
          </label>
          <input
            id="category"
            name="category"
            required
            defaultValue={initial?.category}
            placeholder="e.g. Scholarship (Regional)"
            className="admin-input"
          />
        </div>
        <div className="admin-form-row">
          <label htmlFor="level" className="admin-label">
            Level *
          </label>
          <input
            id="level"
            name="level"
            required
            list="level-options"
            defaultValue={initial?.level}
            placeholder="e.g. Undergraduate & Graduate"
            className="admin-input"
            autoComplete="off"
          />
          <datalist id="level-options">
            {existingLevels.map((l) => (
              <option key={l} value={l} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="admin-form-row">
        <label htmlFor="who" className="admin-label">
          Who qualifies *
        </label>
        <textarea
          id="who"
          name="who"
          required
          defaultValue={initial?.who}
          placeholder="e.g. IEEE student members, any engineering field, GPA 3.0 or above"
          className="admin-textarea"
        />
      </div>

      <div className="admin-form-grid">
        <div className="admin-form-row">
          <label htmlFor="award" className="admin-label">
            Award / value *
          </label>
          <input
            id="award"
            name="award"
            required
            defaultValue={initial?.award}
            placeholder="e.g. $1,000 + plaque"
            className="admin-input"
          />
        </div>
        <div className="admin-form-row">
          <label htmlFor="deadline" className="admin-label">
            Deadline *
          </label>
          <input
            id="deadline"
            name="deadline"
            required
            list="deadline-options"
            defaultValue={initial?.deadline}
            placeholder="e.g. March 31 annually"
            className="admin-input"
            autoComplete="off"
          />
          <datalist id="deadline-options">
            {existingDeadlines.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="admin-form-grid">
        <div className="admin-form-row">
          <label htmlFor="status" className="admin-label">
            Status *
          </label>
          <input
            id="status"
            name="status"
            required
            defaultValue={initial?.status ?? "Open"}
            placeholder="Open, Ongoing/Annual…"
            className="admin-input"
          />
        </div>
        <div className="admin-form-row">
          <label htmlFor="membership" className="admin-label">
            IEEE membership *
          </label>
          <input
            id="membership"
            name="membership"
            required
            defaultValue={initial?.membership ?? "Yes"}
            className="admin-input"
          />
        </div>
      </div>

      <div className="admin-form-row">
        <label htmlFor="notes" className="admin-label">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          defaultValue={initial?.notes}
          placeholder="e.g. Renewable for up to 4 years if GPA is maintained."
          className="admin-textarea"
        />
      </div>

      <div className="admin-form-row">
        <label htmlFor="link" className="admin-label">
          Link *
        </label>
        <input
          id="link"
          name="link"
          type="url"
          required
          defaultValue={initial?.link}
          placeholder="https://…"
          className="admin-input"
        />
      </div>

      <SubmitButton pendingLabel="Saving…" style={{ alignSelf: "flex-start" }}>
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
