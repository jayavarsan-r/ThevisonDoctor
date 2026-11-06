import { Check } from "lucide-react";
import Link from "next/link";
import { programTypeLabels } from "@/content/taxonomy";
import type { Program } from "@/content/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DraftBadge } from "@/components/ui/DraftBadge";
import { formatINR } from "@/lib/format";
import { programEnquiryHref, programHref } from "@/lib/links";
import {
  comingNextText,
  feeText,
  intakeText,
  modeText,
  nextIntake,
  PROGRAM_TYPES,
  typeAnchor,
  typeMono,
} from "@/lib/program-view";
import { ComingNextStrip, ProgramSpotlight } from "./ProgramSpotlight";

const LEARN_PREVIEW = 4;

/** The lead program: soonest open intake, else the first fellowship, else the first. */
function pickLead(programs: Program[], today: string) {
  const withIntake = programs
    .map((p) => ({ p, intake: nextIntake(p, today) }))
    .filter((x) => x.intake)
    .sort((a, b) => a.intake!.start.localeCompare(b.intake!.start));
  return withIntake[0]?.p ?? programs.find((p) => p.type === "fellowship") ?? programs[0];
}

/** "4 weeks · Hybrid · ₹10,000 each" — only the facts every program in the group shares. */
function sharedFacts(items: Program[]) {
  const same = <T,>(values: T[]) => (values.every((v) => v === values[0]) ? values[0] : undefined);
  const fee = same(items.map((p) => p.fee?.amountINR));
  return [
    `${items.length} ${items.length === 1 ? "course" : "courses"}`,
    same(items.map((p) => p.duration)),
    same(items.map((p) => modeText(p))),
    fee ? `${formatINR(fee)} each` : undefined,
  ]
    .filter(Boolean)
    .join(" · ");
}

/**
 * Every program at once while only a few are published (no filters): the lead
 * program as a spotlight, the rest grouped by type, then what's coming next.
 */
export function ProgramShowcase({ programs, today }: { programs: Program[]; today: string }) {
  const lead = pickLead(programs, today);
  const rest = programs.filter((p) => p.slug !== lead.slug);
  const groups = PROGRAM_TYPES.map((type) => ({
    type,
    items: rest.filter((p) => p.type === type),
  })).filter((g) => g.items.length);
  const next = comingNextText(programs);

  return (
    <div className="flex flex-col gap-12 md:gap-16">
      <ProgramSpotlight program={lead} today={today} />

      {groups.map((g) => (
        <div
          key={g.type}
          id={typeAnchor(g.type)}
          className="scroll-mt-[calc(var(--header-h)+24px)]"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <h3 className="font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-tight font-medium text-ink">
              {programTypeLabels[g.type].plural}
            </h3>
            <p className="font-mono text-[12px] tracking-[0.06em] text-slate-600 uppercase">
              {sharedFacts(g.items)}
            </p>
          </div>
          <ul className="mt-6 grid gap-6 md:grid-cols-2">
            {g.items.map((p) => (
              <li key={p.slug} className="h-full">
                <ProgramTile program={p} today={today} />
              </li>
            ))}
          </ul>
        </div>
      ))}

      {next ? <ComingNextStrip text={next} /> : null}
    </div>
  );
}

function ProgramTile({ program, today }: { program: Program; today: string }) {
  const intake = intakeText(program, today);
  const learn = program.outcomes ?? [];
  const preview = learn.slice(0, LEARN_PREVIEW);
  const titleId = `tile-${program.slug}-title`;
  const facts = [
    { label: "Duration", value: program.duration },
    { label: "Mode", value: modeText(program) },
    { label: "Fee", value: feeText(program) },
    { label: "Batch", value: program.batchSize },
    { label: "Intakes", value: program.intakeSchedule },
  ].filter((f) => f.value);
  const noun = program.type === "certification" ? "course" : "program";

  return (
    <DraftBadge draft={program.status === "draft"} className="h-full">
      <article
        aria-labelledby={titleId}
        className="card-interactive flex h-full flex-col rounded-[20px] border border-line bg-white p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="eyebrow text-blue-900">{typeMono(program)}</span>
          {intake ? (
            <Badge dot>Next intake {intake}</Badge>
          ) : (
            <Badge tone="outline">Dates to be announced</Badge>
          )}
        </div>

        <h4
          id={titleId}
          className="mt-5 font-display text-[clamp(1.375rem,2.1vw,1.625rem)] leading-[1.15] font-medium text-ink"
        >
          <Link href={programHref(program)} className="hover:text-blue-900">
            {program.title}
          </Link>
        </h4>
        <p className="mt-3 text-[15px] text-slate-600">{program.outcome}</p>

        {facts.length ? (
          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-btn border border-line bg-line [&>div:last-child:nth-child(odd)]:col-span-2">
            {facts.map((f) => (
              <div key={f.label} className="bg-blue-50/60 px-4 py-3">
                <dt className="font-mono text-[11px] tracking-[0.08em] text-slate-600 uppercase">
                  {f.label}
                </dt>
                <dd className="mt-1 text-[15px] font-semibold text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {preview.length ? (
          <div className="mt-7">
            <p className="eyebrow text-slate-600">What you&apos;ll learn</p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {preview.map((o) => (
                <li key={o} className="flex gap-3 text-[15px] text-ink">
                  <Check
                    aria-hidden
                    strokeWidth={2}
                    className="mt-1 size-4 shrink-0 text-blue-600"
                  />
                  {o}
                </li>
              ))}
            </ul>
            {learn.length > preview.length ? (
              <p className="mt-3 pl-7 text-meta text-slate-600">
                + {learn.length - preview.length} more topics
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:flex-wrap">
          <Button href={programHref(program)} arrow>
            View {noun}
            <span className="sr-only">: {program.title}</span>
          </Button>
          <Button href={programEnquiryHref(program)} variant="secondary">
            Enquire
            <span className="sr-only"> about {program.title}</span>
          </Button>
        </div>
      </article>
    </DraftBadge>
  );
}
