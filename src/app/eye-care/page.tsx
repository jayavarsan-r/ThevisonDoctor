import type { Metadata } from "next";
import { CaseGallery, CasesNote } from "@/components/care/CaseGallery";
import { HospitalInsteadNote } from "@/components/care/HospitalInsteadNote";
import { GroupedServices } from "@/components/care/ServiceTile";
import { CARE_NEXT_STEPS, ServiceSteps } from "@/components/care/ServiceSteps";
import { WhereAppointments } from "@/components/care/WhereAppointments";
import { CareEnquiryForm } from "@/components/forms/CareEnquiryForm";
import { ContactAside } from "@/components/forms/ContactAside";
import { JsonLd } from "@/components/seo/JsonLd";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { faqItems } from "@/components/ui/faqItems";
import { WhatsAppIcon } from "@/components/ui/icons";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { site } from "@/content/site";
import { getCases, getClinician, getFaqs, getLocations, getServices } from "@/lib/content";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Specialist eye care in Chennai, by appointment",
  description:
    "Home eye consultations, eye screening, myopia management, vision therapy, specialty contact lenses and comprehensive eye examinations in Chennai — by appointment only.",
  alternates: { canonical: "/eye-care" },
};

export default function EyeCarePage() {
  const services = getServices();
  const clinician = getClinician();
  const faqs = getFaqs({ audience: "patient" });
  const where = getLocations();
  const cases = getCases();

  return (
    <div className="bg-blue-50">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Eye Care", href: "/eye-care" },
          ]),
          faqSchema(faqs),
        ]}
      />

      <PageHero
        tone="tint"
        eyebrow="Eye care · By appointment"
        title="Specialist eye care in Chennai, by appointment."
        lead={`Consultations with ${clinician.displayName} — at confirmed locations or at your home. Tell us what you need and we'll confirm the place, time and fee before you come.`}
      >
        <Button href="#book" variant="accent" arrow>
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
      </PageHero>

      <section id="how-it-works" aria-labelledby="how-title" className="py-12 md:py-16">
        <div className="container-page">
          <SectionHeader id="how-title" label="How appointments work" title="Three simple steps." />
          <ServiceSteps variant="cards" className="mt-10" />
          <p className="mt-6 text-meta text-slate-600">{site.notWalkIn}</p>
        </div>
      </section>

      <section aria-labelledby="services-title" className="py-12 md:py-16">
        <div className="container-page">
          <SectionHeader id="services-title" label="Services" title="What we can help with." />
          <div className="mt-10">
            <GroupedServices services={services} superSpeciality={site.care.superSpeciality} />
          </div>
        </div>
      </section>

      {cases.length ? (
        <section id="cases" aria-labelledby="cases-title" className="py-12 md:py-16">
          <div className="container-page">
            <SectionHeader
              id="cases-title"
              label="Before and after"
              title="Non-surgical care, before and after."
              layout="split"
              lead="Cases from our practice where glasses or vision therapy were used instead of surgery."
            />
            <CaseGallery
              cases={cases}
              serviceTitles={Object.fromEntries(services.map((s) => [s.slug, s.title]))}
              className="mt-10"
            />
            <CasesNote className="mt-5" />
          </div>
        </section>
      ) : null}

      <section aria-labelledby="where-title" className="py-12 md:py-16">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <SectionHeader id="where-title" label="Where" title="Where appointments happen." />
          </div>
          <div className="flex flex-col gap-6 lg:col-span-7 lg:pt-12">
            <WhereAppointments
              locations={where.consultationLocations}
              fallback={where.defaultWhereWhen}
            />
            <p className="text-meta text-slate-600">
              Our Kolathur office is not a walk-in clinic — appointments only.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="When to go to a hospital" className="py-12 md:py-16">
        <div className="container-page">
          <HospitalInsteadNote
            id="hub-hospital"
            title="When to see a hospital or ophthalmologist instead"
          />
        </div>
      </section>

      <section id="faq" aria-labelledby="care-faq-title" className="py-12 md:py-16">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <SectionHeader id="care-faq-title" label="Questions" title="Patient FAQs." />
          </div>
          <div className="rounded-card bg-white px-5 py-2 sm:px-8 lg:col-span-8">
            <Accordion items={faqItems(faqs)} className="border-t-0" />
          </div>
        </div>
      </section>

      <section id="book" aria-labelledby="book-title" className="py-12 md:py-16">
        <div className="container-page">
          <SectionHeader
            id="book-title"
            label="Book"
            title="Book an eye appointment."
            lead="Send this short form and we'll call you to confirm the place, time and fee. Nothing is booked until then."
          />
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="rounded-card border border-line bg-white p-5 sm:p-8 lg:col-span-7">
              <CareEnquiryForm
                services={services.map(({ slug, title }) => ({ slug, title }))}
                turnstileSiteKey={process.env.TURNSTILE_SITE_KEY || undefined}
              />
            </div>
            <div className="lg:col-span-5">
              <ContactAside steps={CARE_NEXT_STEPS} context="care" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
