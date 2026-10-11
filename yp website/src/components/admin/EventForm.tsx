import type { Event } from "@prisma/client";
import { EVENT_TYPES } from "@/data/events";
import { SubmitButton } from "./SubmitButton";

type Speaker = { name: string; title?: string };
const personLine = (p: Speaker) => (p.title ? `${p.name} | ${p.title}` : p.name);

function Field({ label, htmlFor, help, children }: { label: string; htmlFor: string; help?: string; children: React.ReactNode }) {
  return (
    <div className="admin-form-row">
      <label htmlFor={htmlFor} className="admin-label">
        {label}
      </label>
      {children}
      {help && <p className="admin-help">{help}</p>}
    </div>
  );
}

// One column: the fields most events need, then everything else under
// "More details" (closed unless the event already uses one of those fields).
export function EventForm({
  action,
  initial,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  initial?: Event;
  submitLabel: string;
}) {
  const speakers = (initial?.speakers as Speaker[] | undefined) ?? [];
  const moderator = initial?.moderator as Speaker | null | undefined;
  const hasExtras = Boolean(
    initial &&
      (initial.description || initial.format || initial.partOf || initial.hosts.length || initial.coHosts.length || moderator || initial.initiative || initial.hidden)
  );

  return (
    <form action={action} className="admin-form-card">
      <Field label="Title *" htmlFor="title">
        <input id="title" name="title" required defaultValue={initial?.title} className="admin-input" />
      </Field>

      <Field label="Type *" htmlFor="type">
        <input id="type" name="type" required list="event-types" defaultValue={initial?.type ?? "Webinar"} className="admin-input" autoComplete="off" />
        <datalist id="event-types">
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
      </Field>

      <Field label="Date" htmlFor="date">
        <input id="date" name="date" type="date" defaultValue={initial?.date ?? ""} className="admin-input" />
      </Field>

      <Field label="Time" htmlFor="time">
        <input id="time" name="time" defaultValue={initial?.time ?? ""} className="admin-input" placeholder="e.g. 8:00 PM (GMT+1)" />
      </Field>

      <Field label="Place or platform" htmlFor="venue">
        <input id="venue" name="venue" defaultValue={initial?.venue ?? ""} className="admin-input" placeholder="e.g. Microsoft Teams, or Gammarth, Tunis" />
      </Field>

      <Field label="Summary *" htmlFor="summary" help="One line, shown on the event cards.">
        <input id="summary" name="summary" required defaultValue={initial?.summary} className="admin-input" />
      </Field>

      <Field label="Speakers" htmlFor="speakers" help="One per line, as: Name | Title">
        <textarea id="speakers" name="speakers" defaultValue={speakers.map(personLine).join("\n")} className="admin-textarea" rows={2} />
      </Field>

      {initial && initial.images.length > 0 && (
        <div className="admin-thumbs">
          {initial.images.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" />
          ))}
        </div>
      )}
      <Field label="Images" htmlFor="imageFiles" help="JPEG, PNG, WebP or GIF, up to 3 MB each. The first image is the cover.">
        <input id="imageFiles" name="imageFiles" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple />
      </Field>

      <Field label="Registration link" htmlFor="registrationUrl">
        <input id="registrationUrl" name="registrationUrl" type="url" defaultValue={initial?.registrationUrl ?? ""} className="admin-input" placeholder="https://…" />
      </Field>

      <details className="admin-more" open={hasExtras}>
        <summary>More details</summary>
        <div className="admin-more-body">
          <Field label="Description" htmlFor="description" help="Longer text shown on the event page.">
            <textarea id="description" name="description" defaultValue={initial?.description ?? ""} className="admin-textarea" rows={4} />
          </Field>
          <Field label="Format" htmlFor="format">
            <select id="format" name="format" defaultValue={initial?.format ?? ""} className="admin-select">
              <option value="">Not set</option>
              <option value="Online">Online</option>
              <option value="In person">In person</option>
            </select>
          </Field>
          <Field label="Part of" htmlFor="partOf" help="The wider programme or congress, e.g. TSYP 13.">
            <input id="partOf" name="partOf" defaultValue={initial?.partOf ?? ""} className="admin-input" />
          </Field>
          <Field label="Hosts" htmlFor="hosts" help="One per line.">
            <textarea id="hosts" name="hosts" defaultValue={initial?.hosts.join("\n")} className="admin-textarea" rows={2} />
          </Field>
          <Field label="Co-hosts" htmlFor="coHosts" help="One per line.">
            <textarea id="coHosts" name="coHosts" defaultValue={initial?.coHosts.join("\n")} className="admin-textarea" rows={2} />
          </Field>
          <Field label="Moderator" htmlFor="moderator" help="Name | Title">
            <input id="moderator" name="moderator" defaultValue={moderator ? personLine(moderator) : ""} className="admin-input" />
          </Field>
          <Field label="Image links" htmlFor="images" help="One per line, used before uploaded images. Delete a line to remove that image.">
            <textarea id="images" name="images" defaultValue={initial?.images.join("\n")} className="admin-textarea" rows={3} />
          </Field>
          <Field label="Web address" htmlFor="slug" help="Leave empty to build it from the title.">
            <input id="slug" name="slug" defaultValue={initial?.slug} className="admin-input" placeholder="auto" />
          </Field>
          <label className="admin-check">
            <input type="checkbox" name="initiative" defaultChecked={initial?.initiative} /> List under “Collaborations and initiatives”
          </label>
          <label className="admin-check">
            <input type="checkbox" name="hidden" defaultChecked={initial?.hidden} /> Hidden from the public site
          </label>
        </div>
      </details>

      <SubmitButton pendingLabel="Saving…" style={{ alignSelf: "flex-start" }}>
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
