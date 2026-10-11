import type { Metadata } from "next";
import { PagedEvents } from "@/components/Pagination";
import { PageHero, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { isNews, isUpcoming, sortByDate } from "@/data/events";
import { getEvents } from "@/lib/content";

export const metadata: Metadata = {
  title: "Events and Conferences",
  description: "Webinars, workshops, TSYP challenges and collaborations from IEEE YP Tunisia.",
};

// Content is edited from the dashboard, which also refreshes this page on save.
export const revalidate = 60;

export default async function EventsPage() {
  const all = sortByDate(await getEvents());
  const upcoming = all.filter((e) => isUpcoming(e)).reverse();
  const initiatives = all.filter((e) => e.initiative && !isUpcoming(e));
  const news = all.filter(isNews);
  const past = all.filter((e) => !isUpcoming(e) && !e.initiative && !isNews(e));

  return (
    <div className="pro-page">
      <SiteHeader />
      <PageHero kicker="Events and conferences" title="Pathways to professional growth">
        Webinars with YP teams across IEEE Region 8, TSYP technical challenges, workshops and
        industry meet-ups. Open any event for the full details.
      </PageHero>

      <main>
        <div className="wrap">
          {upcoming.length > 0 && (
            <section className="pro-section">
              <div className="pro-section-head">
                <h2>Upcoming</h2>
              </div>
              <PagedEvents events={upcoming} label="Upcoming events pages" />
            </section>
          )}

          <section className="pro-section">
            <div className="pro-section-head">
              <h2>Past events</h2>
            </div>
            <PagedEvents events={past} label="Past events pages" />
          </section>

          <section className="pro-section">
            <div className="pro-section-head">
              <h2>Collaborations and initiatives</h2>
            </div>
            <PagedEvents events={initiatives} perPage={2} cols={2} label="Initiatives pages" />
          </section>

          <section className="pro-section">
            <div className="pro-section-head">
              <h2>News and recognition</h2>
            </div>
            <PagedEvents events={news} label="News pages" />
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
