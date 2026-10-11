// Editable site text. The dashboard saves this as one JSON document (Setting
// "site"); anything not saved yet falls back to these defaults.
import { about, contact, footerLinks, officersTerm, site, usefulLinks, type LinkItem } from "./ypTunisia";

export interface Stat {
  value: string; // "{opportunities}" is replaced by the live count
  label: string;
}

export interface SiteContent {
  name: string;
  copyright: string;
  joinUrl: string;
  introVideoId: string; // YouTube id shown on the home page
  aboutVideo: string;
  officersTerm: string;
  heroTitle: string;
  heroText: string;
  stats: Stat[];
  about: {
    intro: string;
    missionSummary: string;
    missionPoints: string[];
    missionConclusion: string;
    valuesIntro: string;
    valuesPoints: string[];
    invitation: string;
  };
  contact: {
    email: string;
    phone: string;
    facebook: string;
    hours: string;
    days: string;
    location: string;
  };
  footerLinks: LinkItem[];
  usefulLinks: LinkItem[];
}

export const DEFAULT_SITE: SiteContent = {
  name: site.name,
  copyright: site.copyright,
  joinUrl: about.joinUrl,
  introVideoId: site.introVideoId,
  aboutVideo: site.aboutVideo,
  officersTerm,
  heroTitle: "Supporting young engineers from graduation to leadership",
  heroText: `${about.intro} We help new graduates move into professional life through networking, workshops, mentorship and access to IEEE opportunities.`,
  stats: [
    { value: "2010", label: "Founded on 2 April" },
    { value: String(about.members), label: `Members (${about.membersStatsDate})` },
    { value: "{opportunities}", label: "Opportunities listed" },
    { value: "2022", label: "IEEE YP Hall of Fame Award" },
  ],
  about: {
    intro: about.intro,
    missionSummary: about.mission.summary,
    missionPoints: about.mission.points,
    missionConclusion: about.mission.conclusion,
    valuesIntro: about.values.intro,
    valuesPoints: about.values.points,
    invitation: about.invitation,
  },
  contact: { ...contact },
  footerLinks,
  usefulLinks,
};

// Shallow-merges a saved document over the defaults, section by section, so a
// field added to the code later still gets its default.
export function mergeSite(saved: Partial<SiteContent> | null | undefined): SiteContent {
  if (!saved) return DEFAULT_SITE;
  return {
    ...DEFAULT_SITE,
    ...saved,
    about: { ...DEFAULT_SITE.about, ...saved.about },
    contact: { ...DEFAULT_SITE.contact, ...saved.contact },
  };
}
