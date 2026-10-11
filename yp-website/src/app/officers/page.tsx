import type { Metadata } from "next";
import { OfficerGrid } from "@/components/Gallery";
import { CommitteeTabs } from "@/components/TeamTabs";
import { PagedMembers } from "@/components/Pagination";
import { PageHero, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { graduatesFirst } from "@/data/ypTunisia";
import { getSite, getTeam } from "@/lib/content";

export const metadata: Metadata = {
  title: "Officers",
  description: "The executive committee, YP Task Force and ambassadors of the IEEE Young Professionals Tunisia Affinity Group.",
};

export const revalidate = 60;

export default async function OfficersPage() {
  const [{ officersTerm }, { officers, taskForce, ambassadors }] = await Promise.all([getSite(), getTeam()]);
  const taskForceCount = taskForce.reduce((n, c) => n + c.members.length, 0);

  return (
    <div className="pro-page">
      <SiteHeader />
      <PageHero kicker={`Team ${officersTerm}`} title="Our team">
        The officers, YP Task Force committees and ambassadors behind the IEEE Young
        Professionals Tunisia Affinity Group.
      </PageHero>

      <main>
        <div className="wrap">
          <section className="pro-section">
            <div className="pro-section-head">
              <div>
                <span className="pro-kicker">Executive committee</span>
                <h2>Officers</h2>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/yp/executive-committee-banner.png"
              alt={`${officersTerm} IEEE Young Professionals Tunisia Affinity Group Executive Committee`}
              className="officers-banner"
            />
            <OfficerGrid officers={officers} />
          </section>

          <section className="pro-section">
            <div className="pro-section-head">
              <div>
                <span className="pro-kicker">YP Task Force</span>
                <h2>Committees</h2>
                <p className="pro-lead">
                  {taskForceCount} volunteers across {taskForce.length} committees who run our
                  events, logistics, outreach and member support.
                </p>
              </div>
            </div>
            <CommitteeTabs committees={taskForce.map((c) => ({ ...c, members: graduatesFirst(c.members) }))} />
          </section>

          <section className="pro-section">
            <div className="pro-section-head">
              <div>
                <span className="pro-kicker">Ambassadors</span>
                <h2>YP Ambassadors</h2>
                <p className="pro-lead">
                  {ambassadors.length} ambassadors representing YP Tunisia in student branches and
                  cities across the country.
                </p>
              </div>
            </div>
            <PagedMembers members={graduatesFirst(ambassadors)} perPage={4} />
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
