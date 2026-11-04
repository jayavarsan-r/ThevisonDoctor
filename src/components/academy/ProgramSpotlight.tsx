import { ArrowRight, BellRing, Mic } from "lucide-react";
import Link from "next/link";
import type { Program } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { DraftBadge } from "@/components/ui/DraftBadge";
import { WhatsAppIcon } from "@/components/ui/icons";
import { SpecList } from "@/components/ui/SpecList";
import { programEnquiryHref, programHref } from "@/lib/links";
import { feeText, intakeText, modeText, typeMono } from "@/lib/program-view";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/**
 * The lead program while only a few are published: the program with its key
 * facts and actions, no filters.
 */
export function ProgramSpotlight({ program, today }: { program: Program; today: string }) {
  const intake = intakeText(program, today);
  const areas = program.curriculum?.map((m) => m.title) ?? [];

  return (
    <DraftBadge draft={program.status === "draft"}>
      <article
        aria-labelledby="spotlight-title"
        className="grid overflow-hidden rounded-[24px] border border-line bg-white lg:grid-cols-12"
      >
        {/* Story */}
        <div className="flex flex-col gap-6 p-6 sm:p-10 lg:col-span-7 lg:p-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow text-blue-900">{typeMono(program)}</span>
            {intake ? (
              <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-orange-50 px-2.5 font-mono text-[11px] font-medium tracking-[0.06em] text-orange-700 uppercase">
                <span aria-hidden className="size-1.5 rounded-full bg-orange-500" />
                Admissions open
              </span>
            ) : null}
          </div>
          <h3
            id="spotlight-title"
            className="font-display text-[clamp(1.875rem,3.4vw,2.75rem)] leading-[1.06] font-medium text-ink"
          >
            <Link href={programHref(program)} className="hover:text-blue-900">
              {program.title}
            </Link>
          </h3>
          <p className="measure-lead text-lead text-slate-600">{program.outcome}</p>

          {areas.length ? (
            <div>
              <p className="eyebrow text-slate-600">Key learning areas</p>
              <ol className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {areas.map((a) => (
                  <li key={a} className="flex items-center gap-3 text-[15px] text-ink">
                    <span
                      aria-hidden
                      className="size-1.5 shrink-0 translate-y-[-2px] rounded-full bg-orange-500"
                    />
                    {a}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {program.guestFaculty ? (
            <p className="flex items-start gap-3 rounded-card bg-blue-50 px-4 py-3 text-[15px] text-ink">
              <Mic aria-hidden strokeWidth={1.5} className="mt-0.5 size-5 shrink-0 text-blue-900" />
              <span>
                <span className="font-semibold">Expert guest faculty: </span>
                selected sessions by national-level speakers and experienced eye care professionals.
              </span>
            </p>
          ) : null}

          <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
            <Button href={programHref(program)} arrow>
              View program
            </Button>
            <Button href={programEnquiryHref(program)} variant="accent">
              Enquire about this program
            </Button>
            <Button
              href={buildWhatsAppLink("program", undefined, program.title)}
              variant="secondary"
              icon={<WhatsAppIcon />}
              data-wa-context="program"
            >
              Ask on WhatsApp
            </Button>
          </div>
        </div>

        {/* Facts */}
        <aside
          aria-label="Key facts"
          className="flex flex-col gap-6 border-t border-line bg-blue-50 p-6 sm:p-10 lg:col-span-5 lg:border-t-0 lg:border-l"
        >
          {intake ? (
            <div className="rounded-card bg-white p-5 ring-1 ring-blue-200">
              <p className="eyebrow text-orange-700">First batch</p>
              <p className="mt-1 font-display text-[clamp(2rem,3.6vw,2.75rem)] leading-none font-medium text-blue-900">
                {intake}
              </p>
            </div>
          ) : null}
          <SpecList
            size="sm"
            rows={[
              { label: "Duration", value: program.duration },
              { label: "Mode", value: modeText(program) },
              { label: "Fee", value: feeText(program) },
              { label: "Location", value: program.venue },
              { label: "Clinical", value: program.partner },
              { label: "Batch", value: program.batchSize },
            ]}
          />
          {program.eligibilityList?.length ? (
            <div>
              <p className="eyebrow text-slate-600">Who can apply</p>
              <ul className="mt-3 flex flex-col gap-2">
                {program.eligibilityList.map((e) => (
                  <li key={e} className="flex gap-2.5 text-[14.5px] text-ink">
                    <span
                      aria-hidden
                      className="mt-[8px] size-1.5 shrink-0 rounded-full bg-blue-600"
                    />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </article>
    </DraftBadge>
  );
}

/** Slim prompt under the programs: the confirmed categories not yet published. */
export function ComingNextStrip({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-4 rounded-card border border-dashed border-blue-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="flex items-start gap-3 text-[15px] text-slate-600">
        <BellRing aria-hidden strokeWidth={1.5} className="mt-0.5 size-5 shrink-0 text-blue-900" />
        <span>
          <span className="font-semibold text-ink">Coming next: </span>
          {text}.
        </span>
      </p>
      <Link
        href="/academy/enquire?intent=notify"
        className="inline-flex shrink-0 items-center gap-1 text-[15px] font-semibold link"
      >
        Get notified <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
      </Link>
    </div>
  );
}
