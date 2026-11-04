import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { specialityLabels } from "@/content/taxonomy";
import type { Speciality } from "@/content/types";
import { specialityIcons } from "@/components/ui/icons";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** General copy on purpose — the owner has not yet supplied the exact skills (CONTENT_TODO). */
const SPECIALITIES: { key: Speciality; text: string }[] = [
  {
    key: "myopia",
    text: "Assess progression risk, understand current management options and plan structured follow-up for children with myopia.",
  },
  {
    key: "binocular-vision",
    text: "Evaluate visual dysfunction, interpret binocular vision findings and understand how therapy programs are planned and reviewed.",
  },
  {
    key: "contact-lenses",
    text: "Approach complex fits with confidence — from assessment and lens selection to aftercare.",
  },
  {
    key: "diagnostics",
    text: "Strengthen early detection of eye conditions through structured examination and confident referral decisions.",
  },
];

/** "Four specialities, taught at the chair." (§6.4) */
export function ExpertiseGrid({ related }: { related: Record<Speciality, string> }) {
  return (
    <section
      aria-labelledby="focus-title"
      className="bg-white pt-8 pb-16 md:pt-10 md:pb-24 lg:pb-32"
    >
      <div className="container-page">
        <SectionHeader
          id="focus-title"
          label="Clinical focus"
          title="Four specialities, taught at the chair."
        />

        {/* Tablet & desktop: hairline-separated columns */}
        <ul className="mt-14 hidden md:grid md:grid-cols-2 md:gap-y-12 lg:grid-cols-4 lg:gap-y-0">
          {SPECIALITIES.map(({ key, text }, i) => {
            const Icon = specialityIcons[key];
            return (
              <li
                key={key}
                data-reveal
                style={{ "--i": i } as React.CSSProperties}
                className="flex flex-col gap-4 border-line px-0 md:pr-8 lg:border-l lg:px-7 lg:first:border-l-0 lg:first:pl-0 md:[&:nth-child(even)]:border-l md:[&:nth-child(even)]:pl-8 lg:[&:nth-child(even)]:pl-7"
              >
                <Icon className="text-blue-900" />
                <h3 className="text-h3 font-semibold text-ink">{specialityLabels[key]}</h3>
                <p className="text-[15px] text-slate-600">{text}</p>
                <Link
                  href={related[key]}
                  className="mt-auto inline-flex items-center gap-1 text-[15px] font-semibold link"
                >
                  Related programs <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
                  <span className="sr-only">: {specialityLabels[key]}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile: native disclosure accordion */}
        <ul className="mt-10 border-t border-line md:hidden">
          {SPECIALITIES.map(({ key, text }) => {
            const Icon = specialityIcons[key];
            return (
              <li key={key} className="border-b border-line">
                <details className="group">
                  <summary className="flex min-h-16 cursor-pointer items-center gap-4 py-4">
                    <Icon className="shrink-0 text-blue-900" size={28} />
                    <h3 className="flex-1 text-[17px] font-semibold text-ink">
                      {specialityLabels[key]}
                    </h3>
                    <ChevronDown
                      aria-hidden
                      strokeWidth={1.5}
                      className="details-chevron size-5 text-blue-900 transition-transform"
                    />
                  </summary>
                  <div className="flex flex-col gap-4 pb-6 pl-11">
                    <p className="text-[15px] text-slate-600">{text}</p>
                    <Link
                      href={related[key]}
                      className="inline-flex items-center gap-1 text-[15px] font-semibold link"
                    >
                      Related programs{" "}
                      <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
                    </Link>
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
