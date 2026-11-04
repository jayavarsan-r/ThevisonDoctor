import { ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import { EventsExplorer } from "@/components/academy/EventsExplorer";
import { EventRow } from "@/components/home/WorkshopStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { getPastEvents, getToday, getUpcomingEvents } from "@/lib/content";
import { breadcrumbSchema, eventSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Workshops & CME",
  description:
    "Upcoming optometry workshops and continuing medical education (CME) from The Vision Doctor Academy, Chennai.",
  alternates: { canonical: "/academy/workshops" },
};

export default async function WorkshopsPage() {
  const today = await getToday();
  const upcoming = getUpcomingEvents(today);
  const past = getPastEvents(today);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Academy", href: "/academy" },
            { name: "Workshops & CME", href: "/academy/workshops" },
          ]),
          ...upcoming.filter((e) => e.status === "published").map((e) => eventSchema(e)),
        ]}
      />
      <PageHero
        breadcrumb={
          <Breadcrumb
            items={[{ name: "Academy", href: "/academy" }, { name: "Workshops & CME" }]}
          />
        }
        eyebrow="Workshops & CME"
        title="Upcoming workshops and CME."
        lead="Workshops and continuing education sessions, with the format and venue area for each."
      >
        <Button href="/academy/enquire?intent=notify" arrow>
          Get notified
        </Button>
      </PageHero>

      <section aria-labelledby="upcoming-title" className="bg-white section-y">
        <div className="container-page">
          <h2 id="upcoming-title" className="mb-8 font-display text-h2 font-medium text-ink">
            Upcoming
          </h2>
          <EventsExplorer events={upcoming} />

          {past.length ? (
            <details className="group mt-14 border-t border-line pt-6">
              <summary className="flex cursor-pointer items-center justify-between gap-4 py-2">
                <h2 className="text-h3 font-semibold text-ink">Past events ({past.length})</h2>
                <ChevronDown
                  aria-hidden
                  strokeWidth={1.5}
                  className="details-chevron size-5 text-blue-900 transition-transform"
                />
              </summary>
              <ul className="mt-6 flex flex-col gap-4 opacity-90">
                {past.map((e) => (
                  <li key={e.slug}>
                    <EventRow event={e} />
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </div>
      </section>
    </>
  );
}
