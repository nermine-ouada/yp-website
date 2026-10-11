import type { Metadata } from "next";
import { DecryptText } from "@/components/DecryptText";
import { SplitHeadline } from "@/components/SplitHeadline";
import { CountUp } from "@/components/CountUp";
import { Mark3D } from "@/components/Mark3D";
import { Board } from "@/components/Board";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getOpportunities } from "@/lib/opportunities";

export const metadata: Metadata = {
  title: "The YP Pinboard",
  description:
    "A pinboard of IEEE YP scholarships, fellowships and internships, curated by the YP Tunisia AG Task Force.",
};

// Admins can add/edit opportunities anytime via /admin, so this page can't be
// fully static — revalidate on a short interval and admin actions also
// force an immediate refresh via revalidatePath.
export const revalidate = 60;

export default async function OpportunitiesPage() {
  const opportunities = await getOpportunities();

  return (
    <>
      <SiteHeader>
        <div className="hero">
          <Mark3D />
          <div className="hero-copy">
            <DecryptText
              as="span"
              className="eyebrow"
              text="// YP Tunisia AG Task Force pinboard"
              duration={550}
            />
            <SplitHeadline plain="Pin your next" shiny="opportunity" />
            <p>
              Every scholarship, fellowship and internship the Task Force has scouted,
              dragged out of a spreadsheet and pinned up where you&apos;ll actually look.
              Drag the badge, search below, go apply.
            </p>
            <span className="tape-stat hero-tape">
              <CountUp target={opportunities.length} />
              &nbsp;pinned · Sept 2026
            </span>
          </div>
        </div>
      </SiteHeader>

      <main>
        <div className="wrap">
          <Board opportunities={opportunities} />
        </div>
      </main>

      <SiteFooter
        note={
          <>
            Deadlines shift year to year, so confirm current cycle dates on the linked society
            page before applying. IEEE membership is required for virtually every listing here.
            Compiled from the Task Force Support Sheet, Sept 2026.
          </>
        }
      />
    </>
  );
}
