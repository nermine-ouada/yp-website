import type { Metadata } from "next";
import { Board } from "@/components/Board";
import { PageHero, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getOpportunities } from "@/lib/opportunities";

export const metadata: Metadata = {
  title: "Opportunities",
  description:
    "IEEE scholarships, fellowships and internships for students and young professionals, curated by the IEEE YP Tunisia AG Task Force.",
};

// Admins can add/edit opportunities anytime via /admin, so this page can't be
// fully static — revalidate on a short interval and admin actions also
// force an immediate refresh via revalidatePath.
export const revalidate = 60;

export default async function OpportunitiesPage() {
  const opportunities = await getOpportunities();

  return (
    <div className="pro-page">
      <SiteHeader />
      <PageHero kicker={`Opportunities · ${opportunities.length} listed`} title="Scholarships, fellowships and internships">
        Every opportunity the YP Tunisia Task Force has found for IEEE students and young
        professionals, in one place. Search, filter by category and level, then apply.
      </PageHero>

      <main>
        <div className="wrap pro-section" style={{ paddingTop: 32 }}>
          <Board opportunities={opportunities} />
        </div>
      </main>

      <SiteFooter
        note={
          <>
            Deadlines shift year to year, so confirm current dates on the linked page before
            applying. IEEE membership is required for most listings.
          </>
        }
      />
    </div>
  );
}
