import type { CareCase, Service } from "@/content/types";
import { CaseGallery, CasesNote } from "@/components/care/CaseGallery";
import { GroupedServices } from "@/components/care/ServiceTile";
import { ServiceSteps } from "@/components/care/ServiceSteps";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { site } from "@/content/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/** "Care" — the lighter, tinted patient room (§6.9). */
export function CareBand({
  services,
  clinicianName,
  cases = [],
}: {
  services: Service[];
  clinicianName: string;
  /** Before-and-after cases, shown under the services. */
  cases?: CareCase[];
}) {
  const serviceTitles = Object.fromEntries(services.map((s) => [s.slug, s.title]));
  return (
    <section id="care" aria-labelledby="care-title" className="bg-blue-50 py-20 md:py-28 lg:py-32">
      <div className="container-page">
        <SectionHeader
          id="care-title"
          label="Eye care"
          title="Speciality eye care, by appointment."
          layout="split"
          lead={`Consultations with ${clinicianName} — at confirmed locations or at your home. Tell us what you need and we'll confirm the place, time and fee before you come.`}
        />

        <div className="mt-12 md:mt-16">
          <GroupedServices services={services} superSpeciality={site.care.superSpeciality} />
        </div>

        {cases.length ? (
          <div className="mt-16 md:mt-24">
            <h3 className="font-display text-[clamp(1.6rem,2.8vw,2.25rem)] leading-tight font-medium text-ink">
              Non-surgical care, before and after.
            </h3>
            <CaseGallery
              cases={cases}
              serviceTitles={serviceTitles}
              headingLevel={4}
              className="mt-8"
            />
            <CasesNote className="mt-5" />
          </div>
        ) : null}

        <div className="mt-12 flex flex-col gap-8 border-t border-blue-200 pt-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4">
            <h3 className="eyebrow text-blue-900">How appointments work</h3>
            <ServiceSteps />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/eye-care#book" variant="accent" arrow>
              Book an eye appointment
            </Button>
            <Button
              href={buildWhatsAppLink("care")}
              variant="secondary"
              icon={<WhatsAppIcon />}
              data-wa-context="care"
            >
              WhatsApp us
            </Button>
          </div>
        </div>
        <p className="mt-8 text-meta text-slate-600">{site.notWalkIn}</p>
      </div>
    </section>
  );
}
