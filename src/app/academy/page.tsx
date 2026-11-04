import { ArrowRight, Award, Building2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryBand } from "@/components/academy/EnquiryBand";
import { FeaturedProgram } from "@/components/academy/FeaturedProgram";
import { ProgramExplorer } from "@/components/academy/ProgramExplorer";
import { JsonLd } from "@/components/seo/JsonLd";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { DraftBadge } from "@/components/ui/DraftBadge";
import { faqItems } from "@/components/ui/faqItems";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { site } from "@/content/site";
import { programTypeExplainers, stageLabels } from "@/content/taxonomy";
import type { Stage } from "@/content/types";
import {
  getCertificateStatement,
  getFaqs,
  getFeaturedIntake,
  getPrograms,
  getToday,
  programsLink,
} from "@/lib/content";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Optometry training programs in Chennai",
  description:
    "Fellowships, certifications, short-term clinical training, workshops and CME in myopia management, binocular vision and vision therapy, specialty contact lenses and ocular diagnostics.",
  alternates: { canonical: "/academy" },
};

/**
 * Stage guidance, from the eligibility in the fellowship brochure and the
 * certificate course document. Programs start after graduation.
 */
const STAGE_CARDS: { stage: Stage; text: string }[] = [
  {
    stage: "student-intern",
    text: "The Certification in Retinal Diagnostics and Imaging (CRDI) is open to optometry students and interns. Short clinical workshops and CME will be listed here as dates are announced.",
  },
  {
    stage: "practising-optometrist",
    text: "Choose the six-month Fellowship in Advanced Clinical Optometry, or a four-week certification: CODES (clinical ocular diagnostics and examination skills) or CRDI (retinal diagnostics and imaging).",
  },
  {
    stage: "other-eyecare",
    text: "Workshops and CME cover topics across eye care. Each program page states exactly who it is for.",
  },
];

export default async function AcademyPage() {
  const today = await getToday();
  const programs = getPrograms();
  const faqs = getFaqs({ audience: "learner" });
  const certificate = getCertificateStatement();
  const featured = getFeaturedIntake(today)?.program;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Academy", href: "/academy" },
          ]),
          faqSchema(faqs),
        ]}
      />

      <PageHero
        tone="dark"
        aside={featured ? <FeaturedProgram program={featured} today={today} /> : undefined}
        eyebrow="The Academy"
        title="Optometry training programs in Chennai"
        lead="Fellowships, certifications, short-term clinical training, workshops and CME in myopia management, binocular vision and vision therapy, specialty contact lenses and ocular diagnostics."
      >
        <Button href="#programs" variant="light" arrow>
          Browse programs
        </Button>
        <Button href="/academy/enquire" variant="accent">
          Enquire now
        </Button>
      </PageHero>

      {/* 2. Choose by stage */}
      <section aria-labelledby="stage-title" className="bg-white section-y">
        <div className="container-page">
          <SectionHeader
            id="stage-title"
            label="Choose by stage"
            title="Start from where you are."
          />
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {STAGE_CARDS.map(({ stage, text }, i) => (
              <li key={stage} data-reveal style={{ "--i": i } as React.CSSProperties}>
                <article className="card-interactive flex h-full flex-col gap-4 rounded-card border border-line bg-white p-6 sm:p-7">
                  <h3 className="text-h3 font-semibold text-ink">{stageLabels[stage]}</h3>
                  <p className="text-[15px] text-slate-600">{text}</p>
                  <Link
                    href={programsLink({ stage }).href}
                    className="mt-auto inline-flex items-center gap-1 pt-2 text-[15px] font-semibold link"
                  >
                    {programsLink({ stage }).count ? "See suitable programs" : "Get notified"}{" "}
                    <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
                    <span className="sr-only">: {stageLabels[stage]}</span>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Full explorer */}
      <section
        id="programs"
        aria-labelledby="programs-title"
        className="bg-white pt-0 pb-16 md:pb-24 lg:pb-32"
      >
        <div className="container-page">
          <SectionHeader
            id="programs-title"
            label="Programs"
            title="Programs and upcoming intakes."
            layout="split"
            lead="Every program lists who it's for, how long it takes, what you'll practise and what it costs — before you enquire."
          />
          <div className="mt-10 md:mt-14">
            <ProgramExplorer programs={programs} today={today} />
          </div>
        </div>
      </section>

      {/* Why the Academy — the client's own words */}
      <section
        data-surface="dark"
        aria-labelledby="why-title"
        className="relative overflow-hidden bg-navy-950 section-y"
      >
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <SectionHeader
              id="why-title"
              label="Why The Vision Doctor Academy"
              title={site.academy.motto}
              tone="dark"
            />
          </div>
          <div className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7 lg:pt-10">
            {site.academy.why.map((p) => (
              <p key={p} className="measure-lead text-lead text-slate-300">
                {p}
              </p>
            ))}
            <p className="eyebrow text-orange-300">{site.academy.tagline}</p>
          </div>
        </div>
      </section>

      {/* 4. Program types explained */}
      <section aria-labelledby="types-title" className="bg-blue-50 section-y">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <SectionHeader id="types-title" label="Program types" title="Four ways to learn." />
          </div>
          <dl className="divide-y divide-blue-200 border-y border-blue-200 lg:col-span-8">
            {programTypeExplainers.map((t) => (
              <div
                key={t.key}
                className="grid gap-3 py-6 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-8"
              >
                <dt className="text-h3 font-semibold text-ink">{t.label}</dt>
                <dd className="flex flex-col gap-3">
                  <p className="text-[15px] text-slate-600">{t.description}</p>
                  <p className="text-meta">
                    <span className="eyebrow text-blue-900">Typically for</span>{" "}
                    <span className="text-slate-600">— {t.typicallyFor}</span>
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 5 & 6. Certificates + institutions */}
      <section aria-label="Certificates and institutions" className="bg-white section-y">
        <div className="container-page grid gap-5 lg:grid-cols-2">
          <article className="flex flex-col gap-4 rounded-card border border-line p-7 sm:p-9">
            <Award aria-hidden strokeWidth={1.5} className="size-8 text-blue-900" />
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.25rem)] leading-tight font-medium text-ink">
              Certificates and accreditation
            </h2>
            {certificate ? (
              <DraftBadge draft={certificate.draft}>
                <p className="measure text-slate-600">{certificate.value}</p>
              </DraftBadge>
            ) : null}
            <p className="measure text-slate-600">
              We only describe a program as accredited when the accrediting body has approved it —
              and we name that body on the program page.
            </p>
          </article>
          <article className="flex flex-col gap-4 rounded-card border border-line p-7 sm:p-9">
            <Building2 aria-hidden strokeWidth={1.5} className="size-8 text-blue-900" />
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.25rem)] leading-tight font-medium text-ink">
              Training for hospitals, colleges and optical teams
            </h2>
            <p className="measure text-slate-600">
              Tell us about your team and what you would like to cover, and we&apos;ll discuss
              whether and how we can help.
            </p>
            <div className="mt-auto pt-2">
              <Button href="/academy/enquire?intent=institution" variant="outline" arrow>
                Enquire now
              </Button>
            </div>
          </article>
        </div>
      </section>

      {/* 7. FAQ */}
      <section
        id="faq"
        aria-labelledby="academy-faq-title"
        className="bg-white pt-0 pb-16 md:pb-24 lg:pb-32"
      >
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <SectionHeader id="academy-faq-title" label="Questions" title="Academy FAQs." />
          </div>
          <div className="lg:col-span-8">
            <Accordion items={faqItems(faqs)} />
          </div>
        </div>
      </section>

      <EnquiryBand />
    </>
  );
}
