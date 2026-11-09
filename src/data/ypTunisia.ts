// Starting content for the site, originally taken from yp.ieee.tn.
// prisma/seed.ts copies the team into the database; after that, edits happen
// in the dashboard, not here.

// The old site stored images under dated WordPress folders; local copies live
// flat in public/yp/, so only the file name is kept.
export function img(path: string) {
  return `/yp/${path.split("/").pop()}`;
}

export interface Officer {
  name: string;
  role: string;
  photo?: string; // without one the card shows initials
  linkedin?: string; // optional, but if present should be a valid URL
  mail?: string;
  membership?: Membership;
}

// IEEE membership grade, from the Task Force sheet.
export type Membership = "Student Member" | "Graduate Student Member" | "Member";

// Task Force members and ambassadors. Add a photo path (e.g. "/yp/name.jpg")
// once a picture is available; without one the card shows initials.
export interface Member {
  name: string;
  role?: string;
  branch?: string;
  photo?: string;
  membership?: Membership;
}

export interface LinkItem {
  label: string;
  url: string;
}

export const site = {
  name: "IEEE Young Professionals Tunisia Affinity Group",
  copyright: "© Copyright 2019 - IEEE Tunisia Young Professionals AG - All rights reserved.",
  introVideoId: "BTct887NNC0",
  aboutVideo: "https://youtu.be/pJQKg8qBKf8",
};

export const about = {
  intro:
    "The IEEE Tunisia Young Professionals Affinity Group was formed on 2nd April 2010. It brings together more than 700 IEEE members (October 2026) who graduated with their first professional degree within the last 15 years.",
  mission: {
    summary:
      "The IEEE Tunisia Young Professionals Affinity Group (YP-AG) is dedicated to empowering early-career engineers in Tunisia.",
    points: [
      "Provide a framework and tools to help retain recent IEEE graduates in the professional community.",
      "Facilitate professional, technical, and leadership development through networking, events, and mentorship.",
      "Strengthen the bridge between academic and industry sectors in Tunisia's engineering landscape.",
    ],
    conclusion:
      "In essence, the YP-AG's mission is to support young engineers in transitioning from university to professional life, foster local and global connections, and provide ongoing growth opportunities both technically and professionally.",
  },
  values: {
    intro:
      "Thanks to a good relation with IEEE Student Branches in Tunisia and local industries, the IEEE Tunisia Young Professionals affinity group aim to help new graduates transition into the professional world by:",
    points: [
      "providing members with networking opportunities",
      "organizing seminars and workshops in collaboration with universities and industries",
      "developing skills that can boost your career",
      "sharing knowledge",
      "providing access to national and global IEEE resources",
    ],
  },
  invitation:
    "You are welcome to attend any of our meetings, even if you are not a current member of the IEEE. We do, however, encourage you to join the IEEE. If you are interested to join the team of active volunteers and to get leadership experience, please do not hesitate to contact us!",
  joinUrl: "http://www.ieee.org/join",
};

export const officersTerm = "2025-2026";

export const officers: Officer[] = [
  {
    name: "Madiha Neifar",
    role: "Chair",
    photo: img("2025/07/11.png"),
    linkedin: "https://www.linkedin.com/in/madiha-neifar",
    mail: "madihaneifar@ieee.org",
    membership: "Member",
  },
  {
    name: "Khalil Masmoudi",
    role: "Vice-chair",
    photo: img("2025/07/22.png"),
    linkedin: "https://www.linkedin.com/in/khalilmasmoudi",
    mail: "masmoudi.khalil@ieee.org",
    membership: "Graduate Student Member",
  },
  {
    name: "Ranim Damak",
    role: "Secretary",
    photo: img("2025/07/33.png"),
    linkedin: "https://www.linkedin.com/in/ranim-damak",
    mail: "ranimdamak@ieee.org",
    membership: "Graduate Student Member",
  },
  {
    name: "Med Ali Krichen",
    role: "Treasurer",
    photo: img("2025/07/322.png"),
    linkedin: "https://www.linkedin.com/in/mohamedalikrichen/",
    mail: "mohamedali.krichen@ieee.org",
    membership: "Graduate Student Member",
  },
  {
    name: "Iskandar Ghorbel",
    role: "Webmaster",
    photo: "/yp/iskandar-ghorbel.png",
    linkedin: "https://www.linkedin.com/in/iskandar-ghorbel/",
    mail: "iskandar.ghorbel@ieee.org",
    membership: "Member",
  },
  {
    name: "Oumayma Masmoudy",
    role: "Assistant Secretary",
    linkedin: "https://www.linkedin.com/in/oumayma-masmoudy-55b99726b/",
    mail: "masmoudy.oumayma@ieee.org",
    membership: "Graduate Student Member",
  },
  {
    name: "Nadine Jellali",
    role: "Events Coordinator",
    linkedin: "https://www.linkedin.com/in/nadine-jellali/",
    mail: "nadinejellali@ieee.org",
    membership: "Graduate Student Member",
  }
];

// YP Task Force committees, from "Committees & Ambassadors_ YP Task Force List.xlsx".
// Only names and roles are public; contact details stay in the sheet.
export const taskForce: { committee: string; members: Member[] }[] = [
  {
    committee: "Coordination",
    members: [
      { name: "Yosr Jabloun", role: "Chair", membership: "Graduate Student Member" },
      { name: "Malek Fakhfakh", role: "Member", membership: "Graduate Student Member" },
      { name: "Yassine Soussi", role: "Member", membership: "Graduate Student Member" },
      { name: "Dorsaf Jallouli", role: "Member", membership: "Student Member" },
    ],
  },
  {
    committee: "Support",
    members: [
      { name: "Rahma Benslema", role: "Chair", membership: "Student Member" },
      { name: "Lina Labidi", role: "Member", membership: "Graduate Student Member" },
      { name: "Mohamed Amine Ben Helal", role: "Member", membership: "Graduate Student Member" },
      { name: "Aya Chokri", role: "Member", membership: "Student Member" },
    ],
  },
  {
    committee: "Logistics",
    members: [
      { name: "Adam Lassidi", role: "Chair", membership: "Member" },
      { name: "Amir Zouenkhi", role: "Member", membership: "Graduate Student Member" },
      { name: "Helmi Bouhlel", role: "Member", membership: "Student Member" },
      { name: "Maryem Yousfi", role: "Member", membership: "Student Member" },
      { name: "Omar Guettat", role: "Member", membership: "Student Member" },
    ],
  },
  {
    committee: "Human Resources",
    members: [
      { name: "Eya Ayadi", role: "Chair", membership: "Student Member" },
      { name: "Mohamed Aziz Miladi", role: "Member", membership: "Student Member" },
      { name: "Khalil Guettat", role: "Member", membership: "Student Member" },
    ],
  },
  {
    committee: "Marketing",
    members: [
      { name: "Yasmine Frikha", role: "Chair", membership: "Student Member" },
    ],
  },
];

export const ambassadors: Member[] = [
  { name: "Rafed Jabri", membership: "Member" },
  { name: "Fares Gharbi", membership: "Member" },
  { name: "Baha Eddine Hammou", branch: "ENSIT", membership: "Graduate Student Member" },
  { name: "Menyar Ben Rebah", branch: "IEEE FST SB", membership: "Graduate Student Member" },
  { name: "Yosri Essalah", branch: "IEEE FST SB", membership: "Graduate Student Member" },
  { name: "Malek Aziz Hassayoun", branch: "IEEE SESAME SB", membership: "Graduate Student Member" },
  { name: "Nour Limem", branch: "IEEE FSB SB", membership: "Graduate Student Member" },
  { name: "Rama Hermi", membership: "Graduate Student Member" },
  { name: "Chaima Ben Ayed", membership: "Graduate Student Member" },
  { name: "Jaber Soyed", branch: "Higher School of Sciences & Tech of Hammam Sousse Student Branch", membership: "Graduate Student Member" },
  { name: "Oussama Ben Mahmoud", branch: "ESSTHS", membership: "Graduate Student Member" },
  { name: "Nour Chargui", branch: "IEEE VTS Tunisia Section Chapter", membership: "Graduate Student Member" },
  { name: "Ayoub Madyouni", membership: "Graduate Student Member" },
  { name: "Nermine Ouada", branch: "IEEE ENICarthage SB", membership: "Student Member" },
  { name: "Tasnim Saidi", branch: "IEEE ENICarthage SB", membership: "Student Member" },
  { name: "Ahmed Masmoudi", branch: "IEEE ENET'Com SB", membership: "Student Member" },
  { name: "Mejdi Chennoufi", branch: "IEEE ENET'Com SB", membership: "Student Member" },
  { name: "Nour Guidara", branch: "IEEE ENET'Com SB", membership: "Student Member" },
  { name: "Eya Jaoua", branch: "IEEE ISIMS SB", membership: "Student Member" },
  { name: "Molka Weslati", branch: "IEEE ENSIT SB", membership: "Student Member" },
  { name: "Yasmine Aidoudi", branch: "IEEE ENSIT SB", membership: "Student Member" },
  { name: "Maram Kharroubi", branch: "IEEE ENIG SB", membership: "Student Member" },
  { name: "Mohamed Saddour", branch: "IEEE FSB SB", membership: "Student Member" },
  { name: "Ameni Selmi", branch: "IEEE ISIMS SB", membership: "Student Member" },
  { name: "Nada Nar", branch: "IEEE ENISo SB", membership: "Student Member" },
];

export const contact = {
  location: "Tunisia",
  hours: "8:00 AM - 8:00 PM",
  days: "Monday - Sunday",
  phone: "+216 53 523 759",
  email: "yp@ieee.tn",
  facebook: "https://www.facebook.com/ieee.yp.tunisia",
};

export const footerLinks: LinkItem[] = [
  { label: "Join IEEE", url: "http://www.ieee.org/join/" },
  { label: "Young Professionals Worldwide", url: "http://yp.ieee.org/" },
  { label: "IEEE Region 8", url: "http://www.ieeer8.org/" },
  { label: "R8 Young Professionals", url: "https://ieeer8.org/category/member-activities/yp/" },
  { label: "IEEE Tunisia Section", url: "http://ieee.tn/" },
  { label: "YP Business Plan", url: "http://yp.ieee.org/bp/" },
];

export const usefulLinks: LinkItem[] = [
  { label: "Volunteers Awards", url: "http://yp.ieee.org/volunteers/awards/" },
  { label: "R8 YP Awards", url: "https://ieeer8.org/category/member-activities/yp/gold-awards/" },
  { label: "YP Funding Portal", url: "https://yp-events.fluidreview.com/" },
  { label: "uVolunteering", url: "http://yp.ieee.org/uv/" },
  { label: "YP Newsletter", url: "http://yp.ieee.org/members/newsletter-archive/" },
  { label: "JobSite", url: "http://careers.ieee.org/" },
  {
    label: "eLearning Library",
    url: "http://www.ieee.org/publications_standards/publications/subscriptions/prod/elearning_overview.html",
  },
  { label: "IEEE.tv", url: "http://www.ieee.tv/" },
  {
    label: "IEEE publications",
    url: "http://www.ieee.org/publications_standards/publications_standards_index.html",
  },
  {
    label: "Society membership",
    url: "http://www.ieee.org/societies_communities/SocietiesandCommunitiesLandingPage_20101209134921",
  },
];


// Graduates first (Member, then Graduate Student Member, then Student Member).
// A committee Chair stays at the top of their list.
const GRADE_ORDER: Record<Membership, number> = { Member: 0, "Graduate Student Member": 1, "Student Member": 2 };
export function graduatesFirst(list: Member[]) {
  const rank = (m: Member) => (m.role === "Chair" ? -1 : m.membership ? GRADE_ORDER[m.membership] : 3);
  return [...list].sort((a, b) => rank(a) - rank(b));
}
