// Editable site text. The dashboard saves this as one JSON document (Setting
// "site"); anything not saved yet falls back to these defaults.
import { about, contact, footerLinks, officersTerm, site, usefulLinks, type LinkItem } from "./ypTunisia";

export interface Stat {
  value: string; // "{opportunities}" is replaced by the live count
  label: string;
}

// One KPI compared across two years, e.g. congresses 6 -> 11.
export interface Kpi {
  label: string;
  before: string; // value for impact.yearBefore, e.g. "6", "$3 000", "+2 500"
  after: string; // value for impact.yearAfter
  note?: string; // e.g. "x2", "+20%"
}

export interface Impact {
  title: string;
  yearBefore: string;
  yearAfter: string;
  membersValue: string;
  membersLabel: string;
  membersNote: string;
  kpis: Kpi[];
  activities: string[];
  award: string;
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
  impact: Impact;
  contact: {
    email: string;
    phone: string;
    facebook: string;
    linkedin: string;
    instagram: string;
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
    { value: "+700", label: "YP members (Oct 2026)" },
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
  // From the IEEE Day 2026 KPI sheet.
  impact: {
    title: "Our impact in numbers",
    yearBefore: "2025",
    yearAfter: "2026",
    membersValue: "+700",
    membersLabel: "YP members in October 2026",
    membersNote: "+75% compared with +400 in October 2024",
    kpis: [
      { label: "Congresses we partnered on or organized", before: "6", after: "11" },
      { label: "YP participants in partnered congresses", before: "+250", after: "+500", note: "x2" },
      { label: "Student participants in partnered congresses", before: "+2 500", after: "+3 000", note: "+20%" },
    ],
    activities: [
      "Financial support",
      "Round tables",
      "Nano mentoring",
      "Technical contests",
      "Mock interviews",
      "Presentations",
      "Industry meetups",
    ],
    award: "Best YP Poster Award at IEEE R8 SYP 2026, Kraków",
  },
  contact: {
    ...contact,
    linkedin: "https://www.linkedin.com/company/ieee-yp-tunisia",
    instagram: "https://www.instagram.com/ieee_yp_tunisia_affinity_group",
  },
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
    impact: { ...DEFAULT_SITE.impact, ...saved.impact },
  };
}
