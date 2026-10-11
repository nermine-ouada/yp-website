// One record per event, with the same fields an admin dashboard will edit later
// (this file is the stand-in for a future `Event` table). Content comes from
// yp.ieee.tn and the event posters.
import { img } from "./ypTunisia";

export const EVENT_TYPES = [
  "Webinar",
  "Workshop",
  "Talk",
  "Infosession",
  "Technical challenge",
  "Industry meet-up",
  "Partnership",
  "Award",
  "Announcement",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export interface Person {
  name: string;
  title?: string;
}

export interface YPEvent {
  slug: string; // URL id: /events/<slug>
  title: string;
  type: EventType;
  date?: string; // ISO date, yyyy-mm-dd
  time?: string; // as announced, e.g. "6:00 PM CEST"
  format?: "Online" | "In person";
  venue?: string; // platform when online, place when in person
  partOf?: string; // the wider programme or congress, e.g. "TSYP 13"
  hosts?: string[];
  coHosts?: string[];
  speakers?: Person[];
  moderator?: Person;
  summary: string; // one line, shown on cards
  description?: string; // longer text, shown on the event page
  images: string[]; // first one is the cover
  registrationUrl?: string;
  initiative?: boolean; // listed under "Collaborations and future initiatives"
}

export const events: YPEvent[] = [
  {
    slug: "radar-sensors-webinar-2025",
    title: "Towards Next-Generation Intelligent Radar Sensors",
    type: "Webinar",
    date: "2025-07-24",
    time: "6:00 PM CEST",
    format: "Online",
    venue: "Google Meet",
    partOf: "YP Webinar Series",
    hosts: ["IEEE Young Professionals Germany"],
    coHosts: [
      "IEEE Young Professionals France",
      "IEEE Estonia Section",
      "IEEE Jordan Section",
      "IEEE Benelux",
      "IEEE Tunisia Section",
    ],
    speakers: [
      {
        name: "Dr. Arya Menon",
        title: "Assistant Professor, Electromagnetics Group, Texas A&M University; IEEE MTT-S YP Outstanding Lecturer 2025",
      },
    ],
    moderator: { name: "Dr. Sevda Abadpour", title: "Vice Chair, IEEE Young Professionals Germany" },
    summary: "Adopting a hardware-software-data framework for radar system design.",
    description:
      "Dr. Menon explores an approach to radar system design that fuses hardware, software and data thinking, a foundation for intelligent, energy-efficient and low-latency radar systems. Topics include cognitive radar design through hardware-software co-design, AI-in-hardware and analog in-compute technologies, open and reusable wireless datasets, sensor fusion and spectral coexistence.",
    images: [img("2025/07/519834017_122137736696741380_358579834761898064_n-scaled-e1753123557491.jpg")],
    registrationUrl: "https://lnkd.in/ePRWrpeB",
  },
  {
    slug: "innovative-antennas-webinar-2025",
    title: "Innovative Antennas for Satellite Telecom, Radars and Radio Telescopes",
    type: "Webinar",
    date: "2025-06-27",
    time: "6:00 PM CET",
    format: "Online",
    venue: "Google Meet",
    partOf: "YP Webinar Series",
    hosts: ["IEEE YP France Section"],
    coHosts: ["IEEE YP Estonia Section", "IEEE YP Jordan Section", "IEEE YP Benelux Section", "IEEE YP Tunisia Section"],
    speakers: [{ name: "Dr. Gaurangi Gupta", title: "RF Microwave Engineer, NASA Jet Propulsion Laboratory" }],
    summary: "Antenna design for satellite telecom, radars and radio telescopes.",
    images: [img("2025/07/srgrs-scaled.png"), img("2025/07/dfgfd-scaled.png")],
    initiative: true,
  },
  {
    slug: "industry-meetup-mena-syp-2025",
    title: "IEEE YP Tunisia AG Industry Meet-up at IEEE R8 MENA SYP",
    type: "Industry meet-up",
    date: "2025-08-29",
    format: "In person",
    venue: "Gammarth, Tunis",
    partOf: "IEEE R8 MENA SYP",
    coHosts: ["IEEE INSAT SB", "IEEE Young Professionals"],
    speakers: [
      { name: "Saif Hajjem", title: "IEEE YP Industry & Career Subcommittee Lead" },
      { name: "Mohamed Saeed Darweesh", title: "IEEE R8 YP Chair" },
    ],
    summary: "Meet-up between young professionals and Tunisian and international companies.",
    images: [img("2025/07/Screenshot-2025-07-15-002913.png")],
    initiative: true,
  },
  {
    slug: "national-robotics-weekend-2025",
    title: "National Robotics Weekend (NRW)",
    type: "Partnership",
    date: "2025-06-28",
    format: "In person",
    venue: "Gammarth, Tunis",
    hosts: ["IEEE INSAT SB"],
    summary: "IEEE YP Tunisia supported the National Robotics Weekend.",
    images: [img("2025/07/Screenshot-2025-07-15-002859.png")],
    initiative: true,
  },
  {
    slug: "cv-writing-2025",
    title: "CV Writing",
    type: "Workshop",
    date: "2025-05-27",
    time: "8:00 PM",
    format: "Online",
    venue: "Microsoft Teams",
    hosts: ["IEEE YP Tunisia Section", "IEEE Tunisia Section Member Activities Committee"],
    speakers: [
      {
        name: "Hajer Kammoun",
        title: "JCI Tunisia National Awards and Twinning Counselor; Past President of JCI Sakiet Eddaier",
      },
    ],
    summary: "How to write a CV that shows your competences. 30 participants joined live.",
    images: [img("2025/07/erere.png"), img("2025/07/rerer.png")],
  },
  {
    slug: "ieee-collabratec-2025",
    title: "IEEE Collabratec: Connect, Share & Collaborate",
    type: "Workshop",
    date: "2025-05-23",
    time: "8:00 PM",
    format: "Online",
    venue: "Microsoft Teams",
    hosts: ["IEEE YP Tunisia Section", "IEEE Tunisia Section Member Activities Committee"],
    speakers: [
      {
        name: "Cybele Ghanem",
        title: "Lead Ambassador, IEEE Collabratec; Chairperson, IEEE MGA SAC Virtual Speakers Bureau",
      },
    ],
    summary: "A guided tour of IEEE Collabratec for members.",
    images: [img("2025/07/rere.png"), img("2025/07/szasz.png")],
  },
  {
    slug: "content-strategies-2025",
    title: "Content Strategies & Digital Communication",
    type: "Workshop",
    date: "2025-05-18",
    time: "8:00 PM",
    format: "Online",
    hosts: ["IEEE YP Tunisia Section", "IEEE Tunisia Section Member Activities Committee"],
    speakers: [{ name: "Lina Hidouri", title: "Copywriter, SEO freelancer, employability and human skills trainer" }],
    summary: "Planning content and communicating clearly online.",
    images: [img("2025/07/zzzz.png")],
  },
  {
    slug: "events-management-2025",
    title: "Events Management Fundamentals",
    type: "Workshop",
    date: "2025-05-11",
    time: "8:00 PM",
    format: "Online",
    hosts: ["IEEE YP Tunisia Section", "IEEE Tunisia Section Member Activities Committee"],
    speakers: [{ name: "Lina Hidouri", title: "Copywriter, SEO freelancer, employability and human skills trainer" }],
    summary: "The basics of planning and running an event.",
    images: [img("2025/07/aaaaa.png")],
  },
  {
    slug: "future-leaders-education-week-2025",
    title: "Future Leaders leveraging Technology and Mentorship to level up in the Engineering and Energy sector",
    type: "Webinar",
    date: "2025-04-10",
    time: "8:00 PM (GMT+1)",
    format: "Online",
    venue: "Microsoft Teams",
    partOf: "IEEE Education Week Webinars, 5th session",
    hosts: ["IEEE YP Tunisia Section", "IEEE PES Tunisia", "IEEE YP Climate and Sustainability Task Force"],
    coHosts: ["IEEE Tunisia Section (MAC)"],
    speakers: [
      {
        name: "Abdulhameed Raji",
        title: "MPhil in Engineering for Sustainable Development; member of the IEEE United Kingdom and Ireland Section",
      },
    ],
    summary: "Mentorship and technology for early-career engineers in the energy sector.",
    description:
      "Abdulhameed Raji has worked on projects across IEEE Region 8, IEEE Smart Village, the IEEE Power and Energy Society and IEEE Young Professionals.",
    images: [img("2025/07/489331492_675391451708522_8905115526458508545_n-scaled.jpg")],
  },
  {
    slug: "tech4good-infosession",
    title: "IEEE Tech4Good Lebanon & Tunisia Infosession",
    type: "Infosession",
    format: "Online",
    summary: "Information session on IEEE Tech4Good for Lebanon and Tunisia.",
    images: [img("2025/07/aaa.png")],
  },
  {
    slug: "tsyp13-technical-challenge",
    title: "Technical challenge at TSYP 13",
    type: "Technical challenge",
    date: "2025-12-23",
    format: "In person",
    venue: "Yasmine Hammamet, Tunisia",
    partOf: "TSYP 13",
    hosts: ["IEEE ENIS SB", "IEEE Tunisia Section"],
    summary: "IEEE YP Tunisia AG organizes a technical challenge during TSYP 13.",
    images: [img("2025/07/Screenshot-2025-07-15-002945.png")],
    initiative: true,
  },
  {
    slug: "techx-beyond-the-cloudline",
    title: "IEEE YP Tunisia AG Session at TechX: Beyond the CloudLine",
    type: "Talk",
    format: "In person",
    partOf: "TechX",
    hosts: ["IEEE EPI SB", "IEEE ISET Djerba SB"],
    summary: "A YP Tunisia session during TechX: Beyond the CloudLine.",
    images: [img("2025/07/Screenshot-2025-07-15-002931.png")],
    initiative: true,
  },
  {
    slug: "tsyp12-smartshield-challenge",
    title: "TSYP 12 Technical Challenge: Smartshield",
    type: "Technical challenge",
    partOf: "TSYP 12",
    hosts: ["IEEE Computer Society Tunisia Chapter", "IEEE YP Tunisia Section"],
    summary: "AI-driven cybersecurity incident response automation.",
    description: "Submission deadline: 10 November, 11:59 PM.",
    images: [img("2025/07/481957630_957992773148307_6171452945999709663_n-1-scaled.jpg")],
  },
  {
    slug: "tsyp12-partner",
    title: "IEEE Young Professionals, partner of TSYP 12",
    type: "Partnership",
    partOf: "TSYP 12",
    summary: "IEEE Young Professionals partnered with the 12th TSYP congress.",
    images: [img("2025/07/480820904_959410756339842_3212020303742050075_n-scaled.jpg")],
  },
  {
    slug: "yp-in-tunisia-and-beyond-tsyp11",
    title: "Young Professionals in Tunisia and Beyond",
    type: "Workshop",
    format: "In person",
    partOf: "TSYP 11",
    speakers: [
      { name: "Oussama Laajili", title: "IEEE YP Tunisia Section Treasurer" },
      { name: "Seif El Hajem", title: "IEEE Region 8 Young Professionals Subcommittee" },
    ],
    summary: "Non-technical workshop on YP aspirations and career development.",
    description: "Understanding YP aspirations, career and professional development, and an overview of IEEE Young Professionals.",
    images: [img("2025/07/476798196_949685383979046_3593289821925028506_n.jpg")],
  },
  {
    slug: "corrosion-monitoring-talk",
    title: "Advanced Corrosion Monitoring Systems for Risk-Based Management of Pressure Vessels and Pipelines",
    type: "Talk",
    format: "In person",
    partOf: "IEEE PES Tunisia General Meeting",
    hosts: ["IEEE ESSTHS Student Branch"],
    speakers: [
      {
        name: "Aymen Tmar",
        title: "Asset Integrity Engineer at APO; IEEE Power and Energy Society YP Secretary",
      },
    ],
    summary: "Corrosion management, inspection techniques and risk assessment.",
    images: [img("2025/07/473346272_524057277322591_5026724097766316840_n.jpg")],
  },
  {
    slug: "digital-twins-tsyp-x",
    title: "Digital Twins & Real-time Simulation using Hardware Acceleration and FPGA Computing",
    type: "Talk",
    format: "In person",
    partOf: "TSYP X",
    hosts: ["IEEE Esprit Student Branch"],
    speakers: [{ name: "Kayoum Jedidi", title: "IEEE Tunisia Section YP Webmaster" }],
    summary: "Hardware acceleration and FPGA computing for real-time digital twins.",
    images: [img("2025/07/484284830_4386243764935533_4018526715585478563_n-scaled.jpg")],
  },
  {
    slug: "executive-committee-2025-2026",
    title: "New Executive Committee 2025-2026",
    type: "Announcement",
    summary: "Meet the officers leading IEEE YP Tunisia AG for 2025-2026.",
    images: [img("2025/07/491631881_122130697676786843_5489825640158908662_n.jpg")],
  },
  {
    slug: "hall-of-fame-2022",
    title: "IEEE YP Hall of Fame Award 2022",
    type: "Award",
    summary: "IEEE YP Tunisia AG received the 2022 IEEE Young Professionals Hall of Fame Award.",
    description:
      "The Young Professionals Hall of Fame Award recognizes active and inspiring Young Professionals Affinity Groups and Society Groups worldwide, based on their activities. IEEE Region 8 Young Professionals congratulated the IEEE Tunisia Section Young Professionals Affinity Group on receiving it.",
    images: [img("2025/07/318432039_5657538060992875_6931580335118631052_n.png")],
  },
];

const NEWS_TYPES: EventType[] = ["Announcement", "Award", "Partnership"];
export const isNews = (e: YPEvent) => NEWS_TYPES.includes(e.type) && !e.initiative;

// Newest first; undated items keep their listed order at the end.
export function sortByDate(list: YPEvent[]) {
  return [...list].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

export function getEvent(slug: string) {
  return events.find((e) => e.slug === slug);
}

export function isUpcoming(e: YPEvent, today = new Date().toISOString().slice(0, 10)) {
  return !!e.date && e.date >= today;
}
