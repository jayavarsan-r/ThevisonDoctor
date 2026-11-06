import { Check, Info, Mic } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CurriculumAccordion } from "@/components/academy/CurriculumAccordion";
import { ProgramCard } from "@/components/academy/ProgramCard";
import { ProgramStickyEnquire, SpecRail } from "@/components/academy/SpecRail";
import { JsonLd } from "@/components/seo/JsonLd";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ClinicianCard } from "@/components/ui/ClinicianCard";
import { DraftBadge, DraftTag } from "@/components/ui/DraftBadge";
import { faqItems } from "@/components/ui/faqItems";
import { site } from "@/content/site";
import { programTypeLabels } from "@/content/taxonomy";
import {
  getEvents,
  getFaculty,
  getFaqs,
  getProgram,
  getPrograms,
  getRelatedPrograms,
  getToday,
} from "@/lib/content";
import {
  accreditationText,
  FILTERS_FROM,
  feeText,
  intakeText,
  isEventType,
  modeText,
  typeMono,
} from "@/lib/program-view";
import { breadcrumbSchema, courseSchema, eventSchema, faqSchema } from "@/lib/schema";

/** Cache Components needs at least one param; the placeholder renders 404. */
const PLACEHOLDER = "__no-published-programs__";

export function generateStaticParams() {
  const slugs = getPrograms().map((p) => ({ slug: p.slug }));
  return slugs.length ? slugs : [{ slug: PLACEHOLDER }];
}

export async function generateMetadata({
  params,
}: PageProps<"/academy/programs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program) return { title: "Program not found", robots: { index: false } };
  return {
    title: program.title,
    description: program.outcome,
    alternates: { canonical: `/academy/programs/${program.slug}` },
    ...(program.status === "draft" ? { robots: { index: false, follow: false } } : {}),
  };
}

const DEFAULT_PROGRAM_FAQS = ["l-hands-on", "l-certificate", "l-fees"];

export default async function ProgramPage({ params }: PageProps<"/academy/programs/[slug]">) {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program) notFound();

  const today = await getToday();
  const event = isEventType(program);
  const faculty = getFaculty(program.facultyIds);
  const faqs = getFaqs({ ids: program.faqs?.length ? program.faqs : DEFAULT_PROGRAM_FAQS });
  const related = getRelatedPrograms(program);
  const linkedEvent = event ? getEvents().find((e) => e.programSlug === program.slug) : undefined;
  const agenda = linkedEvent?.agenda;
  const typeName = programTypeLabels[program.type];
  const intake = intakeText(program, today);
  const isDraft = program.status === "draft";

  const crumbs = [
    { name: "Academy", href: "/academy" },
    {
      name: typeName.plural,
      // Filters only exist once several programs are published.
      href:
        getPrograms().length < FILTERS_FROM
          ? "/academy#programs"
          : `/academy?type=${event ? "workshop-cme" : program.type}#programs`,
    },
    { name: program.title, href: `/academy/programs/${program.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={
          isDraft
            ? null
            : [
                breadcrumbSchema([{ name: "Home", href: "/" }, ...crumbs]),
                event ? eventSchema(program) : courseSchema(program),
                faqSchema(faqs),
              ]
        }
      />

      <section className="bg-white">
        <div className="container-page flex flex-col gap-6 py-12 md:py-16">
          <Breadcrumb
            items={crumbs.map((c, i) => (i === crumbs.length - 1 ? { name: c.name } : c))}
          />
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow text-blue-900">{typeMono(program)}</p>
            {isDraft ? <DraftTag /> : null}
          </div>
          <h1 className="max-w-[24ch] font-display text-h1 font-medium text-ink">
            {program.title}
          </h1>
          <p className="measure-lead text-lead text-slate-600">{program.outcome}</p>
          <div className="flex flex-wrap items-center gap-2">
            {modeText(program) ? <Badge>{modeText(program)}</Badge> : null}
            {program.duration ? <Badge>{program.duration}</Badge> : null}
            {intake ? (
              <Badge dot>Next intake {intake}</Badge>
            ) : event ? null : (
              <Badge tone="outline">Dates to be announced</Badge>
            )}
          </div>
          {program.partner ? (
            <p className="text-meta text-slate-600">
              Offered by <span className="font-semibold text-ink">The Vision Doctor Academy</span>{" "}
              in association with <span className="font-semibold text-ink">{program.partner}</span>.
            </p>
          ) : null}
        </div>
      </section>

      <div className="container-page grid gap-10 py-12 md:py-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:order-2 lg:col-span-4">
          <DraftBadge draft={isDraft}>
            <SpecRail program={program} today={today} />
          </DraftBadge>
        </div>

        <div className="flex flex-col gap-14 lg:order-1 lg:col-span-8">
          {program.outcomes?.length ? (
            <Block title="What you'll learn">
              <ul className="grid gap-3 sm:grid-cols-2">
                {program.outcomes.map((o) => (
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
            </Block>
          ) : null}

          {program.eligibilityList?.length ? (
            <Block title="Who can apply">
              <ul className="flex flex-col gap-3">
                {program.eligibilityList.map((e) => (
                  <li key={e} className="flex gap-3 text-ink">
                    <span
                      aria-hidden
                      className="mt-[10px] size-1.5 shrink-0 rounded-full bg-orange-500"
                    />
                    {e}
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}

          {program.highlights?.length ? (
            <Block title="Program highlights">
              <ul className="grid gap-3 sm:grid-cols-2">
                {program.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex gap-3 rounded-btn border border-line bg-white p-4 text-[15px] text-ink"
                  >
                    <span
                      aria-hidden
                      className="mt-[8px] size-1.5 shrink-0 rounded-full bg-orange-500"
                    />
                    {h}
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}

          {event && agenda?.length ? (
            <Block title="Agenda">
              <ol className="divide-y divide-line border-y border-line">
                {agenda.map((a) => (
                  <li
                    key={`${a.time}-${a.title}`}
                    className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 py-3"
                  >
                    <span className="font-mono text-[13px] text-slate-600">{a.time ?? ""}</span>
                    <span className="text-[15px] text-ink">{a.title}</span>
                  </li>
                ))}
              </ol>
            </Block>
          ) : program.curriculum?.length ? (
            <Block title={event ? "Agenda" : "Key learning areas"}>
              <CurriculumAccordion modules={program.curriculum} />
              {program.curriculumNote ? (
                <p className="text-meta text-slate-600">{program.curriculumNote}</p>
              ) : null}
            </Block>
          ) : null}

          {program.handsOn ? (
            <Block title="Hands-on component">
              <p className="measure text-slate-600">{program.handsOn}</p>
            </Block>
          ) : null}

          {program.assessment || program.certificate || program.accreditation ? (
            <Block title="Assessment and certification">
              <dl className="flex flex-col gap-4">
                {program.assessment ? (
                  <Detail label="Assessment">{program.assessment}</Detail>
                ) : null}
                {program.certificate ? (
                  <Detail label="Certificate">{program.certificate}</Detail>
                ) : null}
                <Detail label="Accreditation">{accreditationText(program.accreditation)}</Detail>
              </dl>
              {program.importantNote ? (
                <div
                  role="note"
                  className="flex gap-3 rounded-card border border-blue-200 bg-blue-50 p-5 text-[15px] text-ink"
                >
                  <Info
                    aria-hidden
                    strokeWidth={1.5}
                    className="mt-0.5 size-5 shrink-0 text-blue-900"
                  />
                  <p>
                    <strong className="font-semibold">Important note. </strong>
                    {program.importantNote}
                  </p>
                </div>
              ) : null}
            </Block>
          ) : null}

          {faculty.length || program.guestFaculty ? (
            <Block title="Faculty">
              <div className="flex flex-col gap-4">
                {faculty.map((c) => (
                  <ClinicianCard key={c.id} clinician={c} />
                ))}
                {program.guestFaculty ? (
                  <article className="flex gap-4 rounded-card border border-blue-200 bg-blue-50 p-5 sm:p-6">
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-900 ring-1 ring-blue-200">
                      <Mic aria-hidden strokeWidth={1.5} className="size-5" />
                    </span>
                    <div className="flex flex-col gap-2">
                      <p className="eyebrow text-blue-900">Expert guest faculty</p>
                      <h3 className="text-[19px] font-semibold text-ink">
                        {program.guestFaculty.title}
                      </h3>
                      <p className="text-[15px] text-slate-600">{program.guestFaculty.text}</p>
                    </div>
                  </article>
                ) : null}
              </div>
            </Block>
          ) : null}

          {program.notFor ? (
            <Block title="Who this is not for">
              <p className="measure text-slate-600">{program.notFor}</p>
            </Block>
          ) : null}

          <Block title="Fees, payment and refunds">
            <dl className="flex flex-col gap-4">
              {feeText(program) ? <Detail label="Fee">{feeText(program)}</Detail> : null}
              {program.fee?.includes?.length ? (
                <Detail label="What the fee includes">{program.fee.includes.join(", ")}</Detail>
              ) : null}
              {!program.fee ? (
                <Detail label="Fee">Confirmed with you before you enrol.</Detail>
              ) : null}
              {program.fee ? (
                <Detail label="Payment">
                  {site.payment.methods}.{" "}
                  {program.fee.instalments ? `${site.payment.instalments} ` : ""}We confirm the
                  details when you enrol.
                </Detail>
              ) : null}
            </dl>
            <p className="mt-4 text-[15px] text-slate-600">
              Payment options and refund terms are explained in our{" "}
              <Link href="/refund-policy" className="link">
                refund policy
              </Link>
              .
            </p>
          </Block>

          {faqs.length ? (
            <Block title="Questions">
              <Accordion items={faqItems(faqs)} headingLevel={3} />
            </Block>
          ) : null}

          {related.length ? (
            <Block title="Related programs">
              <ul className="grid gap-5 md:grid-cols-2">
                {related.map((p) => (
                  <li key={p.slug}>
                    <ProgramCard program={p} today={today} />
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}
        </div>
      </div>

      <ProgramStickyEnquire program={program} />
    </>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="flex flex-col gap-5">
      <h2 className="font-display text-[clamp(1.6rem,2.6vw,2rem)] leading-tight font-medium text-ink">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6">
      <dt className="pt-1 eyebrow text-slate-600">{label}</dt>
      <dd className="text-[15px] text-ink">{children}</dd>
    </div>
  );
}
