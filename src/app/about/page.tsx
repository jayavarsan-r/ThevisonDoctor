import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { DraftBadge } from "@/components/ui/DraftBadge";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { WhatsAppIcon } from "@/components/ui/icons";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { site } from "@/content/site";
import { getClinician } from "@/lib/content";
import { breadcrumbSchema, personSchema } from "@/lib/schema";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export async function generateMetadata(): Promise<Metadata> {
  const c = getClinician();
  return {
    title: "About us",
    description: `${site.mission} Led by ${c.displayName}.`,
    alternates: { canonical: "/about" },
  };
}

export default function AboutPage() {
  const c = getClinician();

  return (
    <>
      <JsonLd
        data={[
          personSchema(c),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "About us", href: "/about" },
          ]),
        ]}
      />

      <section className="bg-blue-50">
        <div className="container-page flex flex-col gap-6 py-14 md:py-20 lg:py-24">
          <Eyebrow>About us</Eyebrow>
          <h1 className="max-w-[22ch] font-display text-h1 font-medium text-ink">
            Advancing optometry education and accessible eye care.
          </h1>
          <p className="measure-lead text-lead text-slate-600">{site.mission}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {[...site.academy.offerings, ...site.care.offerings].map((o) => (
              <li
                key={o}
                className="rounded-full border border-blue-200 bg-white px-3.5 py-1.5 text-meta font-medium text-blue-900"
              >
                {o}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="founder-title" className="bg-white">
        <div className="container-page grid items-center gap-12 py-14 md:py-20 lg:grid-cols-12 lg:gap-8">
          <div className="relative mx-auto mb-3 w-[calc(100%-12px)] max-w-[380px] lg:col-span-4 lg:mr-3 lg:ml-0 lg:w-auto lg:max-w-none">
            <div
              aria-hidden
              className="absolute inset-0 translate-x-3 translate-y-3 rounded-card border border-blue-200"
            />
            <PhotoSlot
              ratio="4/5"
              caption="PHOTO · FOUNDER PORTRAIT · 4:5 · NATURAL LIGHT"
              src={c.photo}
              alt={c.displayName}
              priority
              className="relative"
            />
          </div>
          <div className="flex flex-col gap-5 lg:col-span-7 lg:col-start-6">
            <Eyebrow>Who leads us</Eyebrow>
            <h2 id="founder-title" className="font-display text-h2 font-medium text-ink">
              {c.displayName}
            </h2>
            <p className="measure-lead text-lead text-slate-600">
              {c.displayName} leads The Vision Doctor Academy and Eye Care Services. {c.summary}
            </p>
            {c.stats.length ? (
              <dl className="grid max-w-[34rem] grid-cols-2 gap-px overflow-hidden rounded-card border border-blue-200 bg-blue-200">
                {c.stats.map((st) => (
                  <div key={st.label} className="flex flex-col-reverse gap-2 bg-blue-50 px-5 py-5">
                    <dt className="eyebrow text-slate-600">{st.label}</dt>
                    <dd className="font-display text-[clamp(2rem,3.6vw,2.75rem)] leading-none font-medium text-blue-900">
                      {st.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {c.qualificationsLine ? (
              <DraftBadge draft={c.qualificationsLine.draft} inline>
                <p className="font-mono text-[13px] tracking-[0.04em] text-slate-600">
                  {c.qualificationsLine.value}
                </p>
              </DraftBadge>
            ) : null}
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Button href="/academy" arrow>
                Explore the Academy
              </Button>
              <Button
                href={buildWhatsAppLink("clinician")}
                variant="secondary"
                icon={<WhatsAppIcon />}
                data-wa-context="clinician"
              >
                Ask on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page flex flex-col py-6 md:py-10">
        <Row title="Specialised in">
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {c.expertise.map((e) => (
              <li key={e} className="flex gap-3 text-ink">
                <span
                  aria-hidden
                  className="mt-[10px] size-1.5 shrink-0 rounded-full bg-orange-500"
                />
                {e}
              </li>
            ))}
          </ul>
        </Row>

        <Row title="Faculty">
          <div className="flex flex-col gap-5">
            <p className="measure text-slate-600">
              {c.displayName} leads teaching at the Academy. Our programs also feature selected
              guest sessions by national-level speakers and experienced eye care professionals, who
              bring clinical perspectives and current advancements in optometry to the regular
              training.
            </p>
            <p className="measure text-[15px] text-slate-600">
              Our teaching team is growing — new faculty and guest speakers will be introduced here
              as they join.
            </p>
          </div>
        </Row>

        {c.qualifications.length ? (
          <Row title="Qualifications">
            <ul className="flex flex-col gap-3">
              {c.qualifications.map((q) => (
                <li key={q.value.degree}>
                  <DraftBadge draft={q.draft}>
                    <div className="rounded-btn border border-line bg-white p-4">
                      <p className="font-semibold text-ink">{q.value.degree}</p>
                      {q.value.institution || q.value.year ? (
                        <p className="text-[15px] text-slate-600">
                          {[q.value.institution, q.value.year].filter(Boolean).join(" · ")}
                        </p>
                      ) : null}
                    </div>
                  </DraftBadge>
                </li>
              ))}
            </ul>
          </Row>
        ) : null}

        <Row title="Clinical experience">
          <p className="measure text-slate-600">
            Five years of clinical experience across multiple eye hospitals and clinics.
          </p>
          {c.experience.length ? (
            <ul className="mt-4 flex flex-col gap-2">
              {c.experience.map((x) => (
                <li key={x.value.place}>
                  <DraftBadge draft={x.draft} inline>
                    <span className="text-ink">
                      {x.value.place}
                      {x.value.years ? (
                        <span className="text-slate-600"> · {x.value.years}</span>
                      ) : null}
                    </span>
                  </DraftBadge>
                </li>
              ))}
            </ul>
          ) : null}
        </Row>

        {c.registration ? (
          <Row title="Registration">
            <DraftBadge draft={c.registration.draft} inline>
              <p className="text-ink">
                {c.registration.value.council} — {c.registration.value.number}
              </p>
            </DraftBadge>
          </Row>
        ) : null}

        {c.teachingApproach ? (
          <Row title="Teaching approach">
            <DraftBadge draft={c.teachingApproach.draft}>
              <p className="measure text-slate-600">{c.teachingApproach.value}</p>
            </DraftBadge>
          </Row>
        ) : null}

        <Row title="The Academy and Eye Care">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-card bg-blue-50 p-6">
              <h3 className="text-h3 font-semibold text-ink">The Academy</h3>
              <p className="text-[15px] text-slate-600">
                Fellowship programs, certification programs, short-term clinical workshops and
                Continuing Medical Education (CME) for optometrists and eye-care professionals.
              </p>
              <Link
                href="/academy"
                className="mt-auto inline-flex items-center gap-1 font-semibold link"
              >
                Explore the Academy <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
              </Link>
            </div>
            <div className="flex flex-col gap-3 rounded-card bg-blue-50 p-6">
              <h3 className="text-h3 font-semibold text-ink">Eye Care</h3>
              <p className="text-[15px] text-slate-600">
                Home eye consultations, screening services and super-speciality eye care — binocular
                vision and vision therapy, specialty contact lenses and myopia management — by
                appointment.
              </p>
              <Link
                href="/eye-care"
                className="mt-auto inline-flex items-center gap-1 font-semibold link"
              >
                Find eye care <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
              </Link>
            </div>
          </div>
        </Row>
      </div>
    </>
  );
}

function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="grid gap-5 py-10 md:py-12 lg:grid-cols-12 lg:gap-8">
      <div className="flex flex-col gap-3 lg:col-span-4">
        <Eyebrow>{title}</Eyebrow>
        <h2 className="font-display text-[clamp(1.6rem,2.6vw,2rem)] leading-tight font-medium text-ink">
          {title}
        </h2>
      </div>
      <div className="lg:col-span-8 lg:pt-8">{children}</div>
    </section>
  );
}
