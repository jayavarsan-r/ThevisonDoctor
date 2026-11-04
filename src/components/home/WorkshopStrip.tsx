import { ArrowRight, BookOpenText, CalendarClock, Hand } from "lucide-react";
import Link from "next/link";
import { modeLabels, programTypeExplainers, programTypeLabels } from "@/content/taxonomy";
import type { Event } from "@/content/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DraftBadge } from "@/components/ui/DraftBadge";
import { WhatsAppIcon } from "@/components/ui/icons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { dateBlock, formatDate } from "@/lib/format";
import { eventHref } from "@/lib/links";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function EventRow({ event }: { event: Event }) {
  const d = dateBlock(event.start);
  return (
    <DraftBadge draft={event.status === "draft"}>
      <article
        id={event.slug}
        className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-x-5 gap-y-3 rounded-card border border-line bg-white p-4 sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:p-5"
      >
        <time
          dateTime={event.start}
          className="row-span-2 flex flex-col items-center justify-center rounded-btn bg-blue-50 py-3 font-mono text-blue-900 sm:row-span-1"
        >
          <span className="text-[26px] leading-none font-medium">{d.day}</span>
          <span className="mt-1 text-[12px] tracking-[0.08em]">{d.month}</span>
          <span className="sr-only">{d.year}</span>
        </time>
        <div className="flex min-w-0 flex-col gap-2">
          <p className="eyebrow text-slate-600">{programTypeLabels[event.type].mono}</p>
          <h3 className="text-[19px] leading-snug font-semibold text-ink">{event.title}</h3>
          <div className="flex flex-wrap items-center gap-2 text-meta text-slate-600">
            <Badge>{modeLabels[event.mode]}</Badge>
            {event.venueArea ? <span>{event.venueArea}</span> : null}
            {event.end ? <span>Until {formatDate(event.end)}</span> : null}
          </div>
        </div>
        <Link
          href={eventHref(event)}
          className="col-start-2 inline-flex items-center gap-1 text-[15px] font-semibold link sm:col-start-3"
        >
          Details <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
          <span className="sr-only">: {event.title}</span>
        </Link>
      </article>
    </DraftBadge>
  );
}

const FORMAT_ICONS = { workshops: Hand, cme: BookOpenText } as const;
const FORMAT_TAGS: Record<keyof typeof FORMAT_ICONS, string[]> = {
  workshops: ["Hands-on", "Skill-based"],
  cme: ["Current practice", "Professional learning"],
};

/** Decorative month grid; the dashed cell stands for "date to be announced". */
function CalendarMark() {
  return (
    <div aria-hidden className="grid grid-cols-7 gap-1.5">
      {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
        <span key={i} className="pb-1 text-center font-mono text-[10px] text-blue-200">
          {d}
        </span>
      ))}
      {Array.from({ length: 21 }, (_, i) => (
        <span
          key={i}
          className={cn(
            "flex h-8 items-center justify-center rounded-[6px] border",
            i === 10
              ? "border-dashed border-orange-300 bg-orange-500/10 font-mono text-[11px] text-orange-300"
              : "border-white/10 bg-white/[0.03]",
          )}
        >
          {i === 10 ? "?" : null}
        </span>
      ))}
    </div>
  );
}

/**
 * Shown while no workshop or CME date is published: what each format is
 * (client wording) and a clear way to hear about the next date.
 */
export function NoEvents() {
  const formats = programTypeExplainers.filter(
    (t): t is (typeof programTypeExplainers)[number] & { key: keyof typeof FORMAT_ICONS } =>
      t.key === "workshops" || t.key === "cme",
  );
  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <div className="flex flex-col gap-5 lg:col-span-7">
        {formats.map((f) => {
          const Icon = FORMAT_ICONS[f.key];
          return (
            <article
              key={f.key}
              className="grid flex-1 gap-5 rounded-[20px] border border-line bg-white p-6 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:p-7"
            >
              <div className="flex items-center gap-3 sm:flex-col sm:items-start">
                <span className="inline-flex size-14 items-center justify-center rounded-card bg-blue-50 ring-1 ring-blue-200">
                  <Icon aria-hidden strokeWidth={1.5} className="size-7 text-blue-900" />
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-[21px] leading-snug font-semibold text-ink">{f.label}</h3>
                <p className="text-[15px] text-slate-600">{f.description}</p>
                <div className="mt-1 flex flex-col gap-3 border-t border-line pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-meta text-slate-600">
                    <span className="font-semibold text-ink">For: </span>
                    {f.typicallyFor}
                  </p>
                  <ul className="flex shrink-0 flex-wrap gap-2">
                    {FORMAT_TAGS[f.key].map((t) => (
                      <li key={t}>
                        <Badge>{t}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <aside
        data-surface="dark"
        aria-labelledby="next-dates-title"
        className="relative flex flex-col gap-6 overflow-hidden rounded-[20px] bg-blue-900 p-6 sm:p-8 lg:col-span-5"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2.5 eyebrow text-blue-200">
            <CalendarClock aria-hidden strokeWidth={1.5} className="size-4" />
            Next dates
          </p>
          <span className="inline-flex h-6 items-center rounded-full border border-dashed border-orange-300 px-2.5 font-mono text-[10.5px] tracking-[0.06em] text-orange-300 uppercase">
            To be announced
          </span>
        </div>
        <CalendarMark />
        <div>
          <h3
            id="next-dates-title"
            className="font-display text-[clamp(1.5rem,2.4vw,1.875rem)] leading-tight font-medium text-white"
          >
            No dates announced right now.
          </h3>
          <p className="mt-2 text-[15px] text-blue-200">
            We&apos;ll share the next workshop or CME date as soon as it&apos;s set.
          </p>
        </div>
        <div className="mt-auto flex flex-col gap-3">
          <Button
            href={buildWhatsAppLink("workshop")}
            variant="light"
            icon={<WhatsAppIcon />}
            data-wa-context="workshop"
            className="w-full"
          >
            Get the next date on WhatsApp
          </Button>
          <Button href="/academy/enquire?intent=notify" variant="ghost-dark" className="w-full">
            Get notified
          </Button>
        </div>
      </aside>
    </div>
  );
}

/** "Upcoming workshops and CME." (§6.7) */
export function WorkshopStrip({ events }: { events: Event[] }) {
  return (
    <section aria-labelledby="workshops-title" className="bg-white section-y">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            id="workshops-title"
            label="Workshops & CME"
            title="Upcoming workshops and CME."
          />
          <Link
            href="/academy/workshops"
            className="inline-flex shrink-0 items-center gap-1 font-semibold link md:mb-2"
          >
            All workshops &amp; CME <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
          </Link>
        </div>
        <div className="mt-10 md:mt-14">
          {events.length ? (
            <ul className="flex flex-col gap-4">
              {events.map((e) => (
                <li key={e.slug}>
                  <EventRow event={e} />
                </li>
              ))}
            </ul>
          ) : (
            <NoEvents />
          )}
        </div>
      </div>
    </section>
  );
}
