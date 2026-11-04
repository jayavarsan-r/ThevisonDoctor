import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ClinicianView } from "@/lib/content";
import { DraftBadge } from "./DraftBadge";
import { PhotoSlot } from "./PhotoSlot";

/** Clinician card — the name always carries the credential, e.g. "O.D. (SWISS)". */
export function ClinicianCard({
  clinician,
  headingLevel = 3,
}: {
  clinician: ClinicianView;
  headingLevel?: 3 | 4;
}) {
  const H = headingLevel === 3 ? "h3" : "h4";
  return (
    <article className="grid gap-5 rounded-card border border-line bg-white p-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:p-6">
      <PhotoSlot
        ratio="4/5"
        caption="PHOTO · PORTRAIT"
        src={clinician.photo}
        alt={clinician.displayName}
        sizes="128px"
        className="w-28 sm:w-full"
      />
      <div className="flex flex-col gap-2">
        <H className="text-[19px] font-semibold text-ink">{clinician.displayName}</H>
        {clinician.qualificationsLine ? (
          <DraftBadge draft={clinician.qualificationsLine.draft} inline>
            <p className="font-mono text-[12px] text-slate-600">
              {clinician.qualificationsLine.value}
            </p>
          </DraftBadge>
        ) : null}
        <p className="text-[15px] text-slate-600">{clinician.summary}</p>
        {clinician.stats.length ? (
          <ul className="mt-1 flex flex-wrap gap-x-6 gap-y-2">
            {clinician.stats.map((st) => (
              <li key={st.label} className="text-meta text-slate-600">
                <strong className="mr-1.5 text-[17px] font-semibold text-blue-900">
                  {st.value}
                </strong>
                {st.label.toLowerCase()}
              </li>
            ))}
          </ul>
        ) : null}
        <Link
          href="/about"
          className="mt-1 inline-flex items-center gap-1 text-[15px] font-semibold link"
        >
          About us <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
        </Link>
      </div>
    </article>
  );
}
