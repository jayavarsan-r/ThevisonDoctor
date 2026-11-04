import type { Metadata } from "next";
import { ProgramExplorer } from "@/components/academy/ProgramExplorer";
import { CareBand } from "@/components/home/CareBand";
import { ClinicianFeature } from "@/components/home/ClinicianFeature";
import { ClosingCTA } from "@/components/home/ClosingCTA";
import { ExpertiseGrid } from "@/components/home/ExpertiseGrid";
import { FaqTabs } from "@/components/home/FaqTabs";
import { Hero } from "@/components/home/Hero";
import { LearningJourney } from "@/components/home/LearningJourney";
import { BlogTeaser } from "@/components/home/BlogTeaser";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { PathSelector } from "@/components/home/PathSelector";
import { WorkshopStrip } from "@/components/home/WorkshopStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { partners } from "@/content/partners";
import { programTypeLabels } from "@/content/taxonomy";
import {
  getCases,
  getClinician,
  getFaqs,
  getFeaturedIntake,
  getPost,
  getProgramChart,
  getPrograms,
  getServices,
  getToday,
  getUpcomingEvents,
  programsLink,
  readingMinutes,
} from "@/lib/content";
import { formatDate } from "@/lib/format";
import { programHref } from "@/lib/links";
import { faqSchema, organizationSchema, websiteSchema } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const today = await getToday();
  const clinician = getClinician();
  const featured = getFeaturedIntake(today);
  const programs = getPrograms();
  const learnerFaqs = getFaqs({ audience: "learner", homepage: true }).slice(0, 5);
  const patientFaqs = getFaqs({ audience: "patient", homepage: true }).slice(0, 5);

  return (
    <>
      <JsonLd
        data={[organizationSchema(), websiteSchema(), faqSchema([...learnerFaqs, ...patientFaqs])]}
      />

      <Hero
        clinicianName={clinician.displayName}
        admission={
          featured
            ? {
                title: featured.program.title,
                shortTitle: programTypeLabels[featured.program.type].label,
                href: programHref(featured.program),
                intake: formatDate(featured.intake.start),
              }
            : undefined
        }
      />
      <BrandMarquee partners={partners} />
      <PathSelector
        services={getServices().map(({ slug, title }) => ({ slug, title }))}
        chart={getProgramChart(today)}
      />

      <section
        id="programs"
        aria-labelledby="programs-title"
        className="bg-white pt-4 pb-16 md:pt-6 md:pb-24 lg:pb-28"
      >
        <div className="container-page">
          <SectionHeader
            id="programs-title"
            label="The Academy"
            title="Programs and upcoming intakes."
            layout="split"
            lead="Every program lists who it's for, how long it takes, what you'll practise and what it costs — before you enquire."
          />
          <div className="mt-10 md:mt-14">
            <ProgramExplorer
              programs={programs}
              today={today}
              limit={6}
              viewAllHref="/academy#programs"
            />
          </div>
        </div>
      </section>

      <ExpertiseGrid
        related={{
          myopia: programsLink({ speciality: "myopia" }).href,
          "binocular-vision": programsLink({ speciality: "binocular-vision" }).href,
          "contact-lenses": programsLink({ speciality: "contact-lenses" }).href,
          diagnostics: programsLink({ speciality: "diagnostics" }).href,
        }}
      />
      <LearningJourney />
      <ClinicianFeature clinician={clinician} />
      <WorkshopStrip events={getUpcomingEvents(today, 3)} />

      <CareBand services={getServices()} clinicianName={clinician.displayName} cases={getCases()} />
      <BlogTeaser
        posts={[
          "myopia-control-children-symptoms-management",
          "computer-vision-syndrome-digital-eye-strain",
          "glaucoma-symptoms-early-detection",
        ]
          .map((slug) => getPost(slug))
          .filter((p) => p !== undefined)
          .map((post) => ({ post, minutes: readingMinutes(post) }))}
      />
      <FaqTabs learner={learnerFaqs} patient={patientFaqs} />
      <ClosingCTA />
    </>
  );
}
