import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CaseGallery, CasesNote } from "@/components/care/CaseGallery";
import { HospitalInsteadNote } from "@/components/care/HospitalInsteadNote";
import { PincodeChecker } from "@/components/care/PincodeChecker";
import { CARE_NEXT_STEPS } from "@/components/care/ServiceSteps";
import { WhereAppointments } from "@/components/care/WhereAppointments";
import { CareEnquiryForm } from "@/components/forms/CareEnquiryForm";
import { ContactAside } from "@/components/forms/ContactAside";
import { JsonLd } from "@/components/seo/JsonLd";
import { Accordion } from "@/components/ui/Accordion";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { ClinicianCard } from "@/components/ui/ClinicianCard";
import { DraftBadge } from "@/components/ui/DraftBadge";
import { faqItems } from "@/components/ui/faqItems";
import { ServiceIcon, WhatsAppIcon } from "@/components/ui/icons";
import {
  getCasesForService,
  getClinician,
  getFaqs,
  getLocations,
  getPostsForService,
  getService,
  getServices,
  programsLink,
} from "@/lib/content";
import { showDrafts } from "@/lib/drafts";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const FEE_FALLBACK = "Confirmed when we call — before you book.";

export function generateStaticParams() {
  const slugs = getServices().map((s) => ({ slug: s.slug }));
  return slugs.length ? slugs : [{ slug: "__no-published-services__" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/eye-care/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service not found", robots: { index: false } };
  return {
    title: `${service.title} in Chennai`,
    description: service.lead,
    alternates: { canonical: `/eye-care/${service.slug}` },
  };
}

export default async function ServicePage({ params }: PageProps<"/eye-care/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const clinician = getClinician();
  const articles = getPostsForService(service.slug);
  const cases = getCasesForService(service.slug);
  const faqs = getFaqs({ ids: service.faqs ?? ["p-walk-in", "p-prepare", "p-cost"] });
  const where = getLocations();
  const services = getServices().map(({ slug: s, title }) => ({ slug: s, title }));
  const details = (service.details ?? []).filter((d) => (d.verified && d.value) || showDrafts);
  const academyHref = service.relatedProgramSpecialities?.length
    ? programsLink({ speciality: service.relatedProgramSpecialities[0] }).href
    : "/academy#programs";

  return (
    <div className="bg-blue-50">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Eye Care", href: "/eye-care" },
            { name: service.title, href: `/eye-care/${service.slug}` },
          ]),
          serviceSchema(service),
          faqSchema(faqs),
        ]}
      />

      <section>
        <div className="container-page flex flex-col gap-6 py-12 md:py-16">
          <Breadcrumb items={[{ name: "Eye Care", href: "/eye-care" }, { name: service.title }]} />
          <ServiceIcon name={service.icon} size={40} />
          <h1 className="max-w-[22ch] font-display text-h1 font-medium text-ink">
            {service.title} in Chennai
          </h1>
          <p className="measure-lead text-lead text-slate-600">{service.lead}</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button href="#book" variant="accent" arrow>
              Book an eye appointment
            </Button>
            <Button
              href={buildWhatsAppLink("service", undefined, service.title)}
              variant="secondary"
              icon={<WhatsAppIcon />}
              data-wa-context="service"
            >
              WhatsApp us
            </Button>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-12 py-12 md:py-16 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-14 lg:col-span-8">
          <Block title={service.forWhomTitle ?? "Is this for you?"}>
            <ul className="flex flex-col gap-3">
              {service.forWhom.map((f) => (
                <li key={f} className="flex gap-3 text-ink">
                  <Check
                    aria-hidden
                    strokeWidth={2}
                    className="mt-1.5 size-4 shrink-0 text-blue-600"
                  />
                  {f}
                </li>
              ))}
            </ul>
            {service.forWhomNote ? (
              <p className="text-[15px] font-medium text-slate-600">{service.forWhomNote}</p>
            ) : null}
            {service.about?.map((p) => (
              <p key={p} className="measure text-slate-600">
                {p}
              </p>
            ))}
          </Block>

          <Block title="What happens at your appointment">
            <ol className="flex flex-col gap-4">
              {service.steps.map((s, i) => (
                <li key={s} className="flex gap-4">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-white text-[14px] font-semibold text-blue-900">
                    {i + 1}
                  </span>
                  <p className="pt-1.5 text-ink">{s}</p>
                </li>
              ))}
            </ol>
          </Block>

          {cases.length ? (
            <Block title="Before and after">
              <CaseGallery cases={cases} />
              <CasesNote />
            </Block>
          ) : null}

          <Block title="Who you'll see">
            <ClinicianCard clinician={clinician} />
            {service.group === "super-speciality" ? (
              <p className="text-[15px] text-slate-600">
                Super-speciality care is offered with access to professional clinical networks.
                We&apos;ll confirm who you&apos;ll see and where before anything is booked.
              </p>
            ) : null}
          </Block>

          <Block title="Where and when">
            {service.whereWhen ? (
              <p className="measure text-slate-600">{service.whereWhen}</p>
            ) : (
              <WhereAppointments
                locations={where.consultationLocations}
                fallback={where.defaultWhereWhen}
              />
            )}
            {service.pincodeChecker ? (
              where.homeVisitPincodes.length ? (
                <PincodeChecker pincodes={where.homeVisitPincodes} />
              ) : (
                <p className="text-[15px] font-medium text-ink">
                  Tell us your area and we&apos;ll confirm whether we can visit.
                </p>
              )
            ) : null}
          </Block>

          {service.prepare?.length ? (
            <Block title="How to prepare">
              <ul className="grid gap-3 sm:grid-cols-2">
                {service.prepare.map((p) => (
                  <li
                    key={p}
                    className="flex gap-3 rounded-btn border border-line bg-white p-4 text-[15px] text-ink"
                  >
                    <Check
                      aria-hidden
                      strokeWidth={2}
                      className="mt-1 size-4 shrink-0 text-blue-600"
                    />
                    {p}
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}

          <Block title="Fees">
            <p className="text-ink">{service.feeDisplay ?? FEE_FALLBACK}</p>
            {details.length ? (
              <dl className="flex flex-col gap-3">
                {details.map((d) => (
                  <DraftBadge key={d.label} draft={!d.verified}>
                    <div className="grid gap-1 rounded-btn bg-white p-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
                      <dt className="pt-1 eyebrow text-slate-600">{d.label}</dt>
                      <dd className="text-[15px] text-ink">{d.value ?? "To be confirmed"}</dd>
                    </div>
                  </DraftBadge>
                ))}
              </dl>
            ) : null}
          </Block>

          <HospitalInsteadNote id="service-hospital" />

          {articles.length ? (
            <Block title="Read more on our blog">
              <ul className="flex flex-col divide-y divide-line rounded-card border border-line bg-white">
                {articles.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/blog/${a.slug}`}
                      className="group flex items-start justify-between gap-4 p-5 hover:bg-blue-50"
                    >
                      <span>
                        <span className="block text-[17px] font-semibold text-ink group-hover:text-blue-900">
                          {a.title}
                        </span>
                        <span className="mt-1 block text-[15px] text-slate-600">
                          {a.description}
                        </span>
                      </span>
                      <ArrowRight
                        aria-hidden
                        strokeWidth={1.5}
                        className="mt-1 size-5 shrink-0 text-blue-600 transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}

          {faqs.length ? (
            <Block title="Questions">
              <div className="rounded-card bg-white px-5 py-1 sm:px-7">
                <Accordion items={faqItems(faqs)} className="border-t-0" />
              </div>
            </Block>
          ) : null}
        </div>

        <aside aria-label="Book this service" className="lg:col-span-4">
          <div className="flex flex-col gap-4 rounded-card border border-line bg-white p-6 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
            <p className="eyebrow text-blue-900">Book this service</p>
            <p className="text-[15px] text-slate-600">
              By appointment only. We confirm the place, time and fee when we call.
            </p>
            <Button href="#book" variant="primary" arrow className="w-full">
              Book an eye appointment
            </Button>
            <Button
              href={buildWhatsAppLink("service", undefined, service.title)}
              variant="secondary"
              icon={<WhatsAppIcon />}
              className="w-full"
              data-wa-context="service"
            >
              WhatsApp us
            </Button>
          </div>
        </aside>
      </div>

      <section id="book" aria-labelledby="book-title" className="py-16 md:py-24">
        <div className="container-page">
          <h2 id="book-title" className="font-display text-h2 font-medium text-ink">
            Book an eye appointment.
          </h2>
          <p className="mt-4 measure-lead text-lead text-slate-600">
            {service.title} is already selected. Send this short form and we&apos;ll call you to
            confirm the place, time and fee.
          </p>
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="rounded-card border border-line bg-white p-5 sm:p-8 lg:col-span-7">
              <CareEnquiryForm
                services={services}
                defaultService={service.slug}
                turnstileSiteKey={process.env.TURNSTILE_SITE_KEY || undefined}
              />
            </div>
            <div className="lg:col-span-5">
              <ContactAside steps={CARE_NEXT_STEPS} context="care" />
            </div>
          </div>
          <p className="mt-12 border-t border-blue-200 pt-6 text-meta text-slate-600">
            <Link href={academyHref} className="inline-flex items-center gap-1 link">
              Optometrists: learn this speciality at our Academy{" "}
              <ArrowRight aria-hidden strokeWidth={1.5} className="size-3.5" />
            </Link>
          </p>
        </div>
      </section>
    </div>
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
