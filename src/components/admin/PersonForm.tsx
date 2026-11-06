import type { Person } from "@prisma/client";
import { SubmitButton } from "./SubmitButton";

export function PersonForm({
  action,
  initial,
  defaultGroup,
  committees,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  initial?: Person;
  defaultGroup: string;
  committees: string[];
  submitLabel: string;
}) {
  return (
    <form action={action} className="admin-form-card">
      <div className="admin-form-grid">
        <div className="admin-form-row">
          <label htmlFor="group" className="admin-label">
            Section *
          </label>
          <select id="group" name="group" defaultValue={initial?.group ?? defaultGroup} className="admin-select">
            <option value="officer">Officers</option>
            <option value="taskforce">Task Force</option>
            <option value="ambassador">Ambassadors</option>
          </select>
        </div>
        <div className="admin-form-row">
          <label htmlFor="name" className="admin-label">
            Full name *
          </label>
          <input id="name" name="name" required defaultValue={initial?.name} className="admin-input" />
        </div>
      </div>

      <div className="admin-form-grid">
        <div className="admin-form-row">
          <label htmlFor="role" className="admin-label">
            Role
          </label>
          <input id="role" name="role" defaultValue={initial?.role ?? ""} className="admin-input" placeholder="e.g. Chair, Member, Treasurer" />
        </div>
        <div className="admin-form-row">
          <label htmlFor="membership" className="admin-label">
            IEEE membership grade
          </label>
          <select id="membership" name="membership" defaultValue={initial?.membership ?? ""} className="admin-select">
            <option value="">Not set</option>
            <option value="Member">Member</option>
            <option value="Graduate Student Member">Graduate Student Member</option>
            <option value="Student Member">Student Member</option>
          </select>
        </div>
      </div>

      <div className="admin-form-grid">
        <div className="admin-form-row">
          <label htmlFor="committee" className="admin-label">
            Committee (Task Force only)
          </label>
          <input
            id="committee"
            name="committee"
            list="committee-options"
            defaultValue={initial?.committee ?? ""}
            className="admin-input"
            autoComplete="off"
          />
          <datalist id="committee-options">
            {committees.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <p className="admin-help">Typing a new name creates a new committee tab.</p>
        </div>
        <div className="admin-form-row">
          <label htmlFor="branch" className="admin-label">
            Student branch (ambassadors only)
          </label>
          <input id="branch" name="branch" defaultValue={initial?.branch ?? ""} className="admin-input" placeholder="e.g. IEEE ENIS SB" />
        </div>
      </div>

      <fieldset className="admin-fieldset">
        <legend>Photo</legend>
        {initial?.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={initial.photo} alt="" className="admin-avatar" style={{ width: 72, height: 72 }} />
        )}
        <div className="admin-form-row">
          <label htmlFor="photo" className="admin-label">
            Photo link
          </label>
          <input id="photo" name="photo" defaultValue={initial?.photo ?? ""} className="admin-input" placeholder="/yp/photo.png or https://…" />
          <p className="admin-help">Leave empty to show initials.</p>
        </div>
        <div className="admin-form-row">
          <label htmlFor="photoFile" className="admin-label">
            Or upload a photo
          </label>
          <input id="photoFile" name="photoFile" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
          <p className="admin-help">JPEG, PNG, WebP or GIF, up to 3 MB. Replaces the link above.</p>
        </div>
      </fieldset>

      <div className="admin-form-grid">
        <div className="admin-form-row">
          <label htmlFor="facebook" className="admin-label">
            Facebook profile
          </label>
          <input
            id="facebook"
            name="facebook"
            type="url"
            defaultValue={initial?.facebook ?? ""}
            className="admin-input"
            placeholder="https://www.facebook.com/…"
          />
        </div>
        <div className="admin-form-row">
          <label htmlFor="sortOrder" className="admin-label">
            Order
          </label>
          <input id="sortOrder" name="sortOrder" type="number" defaultValue={initial?.sortOrder ?? 0} className="admin-input" />
          <p className="admin-help">Lower numbers show first. Task Force and ambassadors are also sorted graduates first.</p>
        </div>
      </div>

      <label className="admin-check">
        <input type="checkbox" name="hidden" defaultChecked={initial?.hidden} /> Hidden from the public site
      </label>

      <SubmitButton pendingLabel="Saving…" style={{ alignSelf: "flex-start" }}>
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
