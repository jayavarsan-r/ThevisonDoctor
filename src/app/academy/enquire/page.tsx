import type { Metadata } from "next";
import { AcademyEnquiryForm } from "@/components/forms/AcademyEnquiryForm";
import { ContactAside } from "@/components/forms/ContactAside";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getPrograms } from "@/lib/content";

export const metadata: Metadata = {
  title: "Enquire about the Academy",
  description:
    "Ask about programs, eligibility, schedules and fees at The Vision Doctor Academy, Chennai.",
  alternates: { canonical: "/academy/enquire" },
};

const NEXT_STEPS = [
  {
    title: "We read your enquiry",
    text: "We look at your background and the programs you're interested in.",
  },
  {
    title: "Meet eligibility",
    text: "We contact you to confirm eligibility, schedule and fees.",
  },
  { title: "You decide", text: "There's no obligation — you choose whether to secure a place." },
];

export default function AcademyEnquirePage() {
  const programs = getPrograms().map(({ slug, title }) => ({ slug, title }));

  return (
    <section className="bg-white">
      <div className="container-page py-12 md:py-16">
        <Breadcrumb items={[{ name: "Academy", href: "/academy" }, { name: "Enquire" }]} />
        <div className="mt-8 flex max-w-[44rem] flex-col gap-5">
          <Eyebrow>Academy enquiry</Eyebrow>
          <h1 className="font-display text-h1 font-medium text-ink">Enquire about the Academy.</h1>
          <p className="measure-lead text-lead text-slate-600">
            Tell us about your background and what you&apos;d like to learn. We&apos;ll reply with
            the programs that fit, and their eligibility, schedule and fees.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="rounded-card border border-line bg-white p-5 sm:p-8">
              <AcademyEnquiryForm
                programs={programs}
                turnstileSiteKey={process.env.TURNSTILE_SITE_KEY || undefined}
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <ContactAside steps={NEXT_STEPS} context="academy" />
          </div>
        </div>
      </div>
    </section>
  );
}
