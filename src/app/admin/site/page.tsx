import { getSite } from "@/lib/content";
import { updateSite } from "../content-actions";
import { SubmitButton } from "@/components/admin/SubmitButton";

export const dynamic = "force-dynamic";

function Row({ label, name, value, help, area, rows = 3 }: { label: string; name: string; value: string; help?: string; area?: boolean; rows?: number }) {
  return (
    <div className="admin-form-row">
      <label htmlFor={name} className="admin-label">
        {label}
      </label>
      {area ? (
        <textarea id={name} name={name} defaultValue={value} className="admin-textarea" rows={rows} />
      ) : (
        <input id={name} name={name} defaultValue={value} className="admin-input" />
      )}
      {help && <p className="admin-help">{help}</p>}
    </div>
  );
}

const pairLines = (items: { label: string; url: string }[]) => items.map((l) => `${l.label} | ${l.url}`).join("\n");

export default async function AdminSitePage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [site, { saved }] = await Promise.all([getSite(), searchParams]);
  const { about, contact, impact } = site;

  return (
    <main>
      <div className="wrap">
        <div className="admin-bar">
          <h1>Site content</h1>
        </div>

        {saved && <p className="dash-notice">Saved. The public site is updated.</p>}

        <form action={updateSite} className="admin-form-card wide">
          <fieldset className="admin-fieldset">
            <legend>Home page</legend>
            <Row label="Headline" name="heroTitle" value={site.heroTitle} />
            <Row label="Intro paragraph" name="heroText" value={site.heroText} area rows={4} />
            <Row
              label="Key figures"
              name="stats"
              value={site.stats.map((s) => `${s.label} | ${s.value}`).join("\n")}
              help='One per line, as: Label | Value. Use {opportunities} as the value to show the live count.'
              area
              rows={4}
            />
            <div className="admin-form-grid">
              <Row label="YouTube video id (Home and About)" name="introVideoId" value={site.introVideoId} help="The part after watch?v= in the YouTube link." />
              <Row label="Team term" name="officersTerm" value={site.officersTerm} help="e.g. 2025-2026" />
            </div>
          </fieldset>

          <fieldset className="admin-fieldset">
            <legend>Impact (home page KPIs)</legend>
            <Row label="Section title" name="impact.title" value={impact.title} />
            <div className="admin-form-grid">
              <Row label="Earlier year" name="impact.yearBefore" value={impact.yearBefore} />
              <Row label="Current year" name="impact.yearAfter" value={impact.yearAfter} />
            </div>
            <div className="admin-form-grid">
              <Row label="Members figure" name="impact.membersValue" value={impact.membersValue} />
              <Row label="Members label" name="impact.membersLabel" value={impact.membersLabel} />
            </div>
            <Row label="Members note" name="impact.membersNote" value={impact.membersNote} />
            <Row
              label="Charts"
              name="impact.kpis"
              value={impact.kpis.map((k) => [k.label, k.before, k.after, k.note].filter(Boolean).join(" | ")).join("\n")}
              help="One chart per line, as: Label | earlier value | current value | note (optional). Bars are sized from the numbers."
              area
              rows={5}
            />
            <Row label="Support and activities" name="impact.activities" value={impact.activities.join("\n")} help="One per line." area rows={4} />
            <Row label="Award" name="impact.award" value={impact.award} />
          </fieldset>

          <fieldset className="admin-fieldset">
            <legend>About page</legend>
            <Row label="Intro" name="about.intro" value={about.intro} area />
            <Row label="Mission summary" name="about.missionSummary" value={about.missionSummary} area rows={2} />
            <Row label="Mission points" name="about.missionPoints" value={about.missionPoints.join("\n")} help="One per line." area rows={4} />
            <Row label="Mission conclusion" name="about.missionConclusion" value={about.missionConclusion} area />
            <Row label="Values intro" name="about.valuesIntro" value={about.valuesIntro} area rows={2} />
            <Row label="Values" name="about.valuesPoints" value={about.valuesPoints.join("\n")} help="One per line." area rows={5} />
            <Row label="Get involved text" name="about.invitation" value={about.invitation} area />
            <Row label="Extra video link" name="aboutVideo" value={site.aboutVideo} />
          </fieldset>

          <fieldset className="admin-fieldset">
            <legend>Contact</legend>
            <div className="admin-form-grid">
              <Row label="Email" name="contact.email" value={contact.email} />
              <Row label="Phone" name="contact.phone" value={contact.phone} />
            </div>
            <Row label="Facebook page" name="contact.facebook" value={contact.facebook} />
            <div className="admin-form-grid">
              <Row label="LinkedIn" name="contact.linkedin" value={contact.linkedin} />
              <Row label="Instagram" name="contact.instagram" value={contact.instagram} />
            </div>
            <Row label="Location" name="contact.location" value={contact.location} />
          </fieldset>

          <fieldset className="admin-fieldset">
            <legend>Footer and general</legend>
            <Row label="Organization name" name="name" value={site.name} />
            <Row label="Join IEEE link" name="joinUrl" value={site.joinUrl} />
            <Row label="IEEE links" name="footerLinks" value={pairLines(site.footerLinks)} help="One per line, as: Label | https://…" area rows={6} />
            <Row label="Useful links" name="usefulLinks" value={pairLines(site.usefulLinks)} help="One per line, as: Label | https://…" area rows={8} />
            <Row label="Copyright line" name="copyright" value={site.copyright} />
          </fieldset>

          <SubmitButton pendingLabel="Saving…" style={{ alignSelf: "flex-start" }}>
            Save site content
          </SubmitButton>
        </form>
      </div>
    </main>
  );
}
