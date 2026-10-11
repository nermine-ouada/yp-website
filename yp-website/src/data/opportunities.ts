export type Sheet = "Scholarships" | "PhD & Fellowships" | "Internships";

export type Opportunity = {
  id: string;
  title: string;
  category: string;
  level: string;
  who: string;
  award: string;
  deadline: string;
  status: string;
  membership: string;
  notes: string;
  link: string;
  sheet: Sheet;
};

export const CATEGORY_ACCENT: Record<Sheet, string> = {
  Scholarships: "var(--orange)",
  "PhD & Fellowships": "var(--blue)",
  Internships: "var(--green)",
};
