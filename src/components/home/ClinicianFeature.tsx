import { Button } from "@/components/ui/Button";
import { DraftBadge } from "@/components/ui/DraftBadge";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import type { ClinicianView } from "@/lib/content";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/** "Meet {clinician}" — the cinematic pause (§6.6). */
export function ClinicianFeature({ clinician }: { clinician: ClinicianView }) {
  return (
    <section
      data-surface="dark"
      aria-labelledby="clinician-title"
      className="overflow-hidden bg-navy-950 section-y"
    >
      <div className="container-page grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="relative mx-auto mb-3 w-[calc(100%-12px)] max-w-[420px] lg:col-span-5 lg:mr-3 lg:ml-0 lg:w-auto lg:max-w-none">
          <div
            aria-hidden
            className="absolute inset-0 translate-x-3 translate-y-3 rounded-card border border-blue-300"
          />
          <PhotoSlot
            ratio="4/5"
            caption="PHOTO · FOUNDER PORTRAIT · 4:5 · NATURAL LIGHT"
            src={clinician.photo}
            alt={clinician.displayName}
            className="relative"
          />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7">
          <h2
            id="clinician-title"
            className="font-display text-[clamp(1.5rem,6.2vw,2.5rem)] leading-tight font-medium whitespace-nowrap text-white"
          >
            {clinician.displayName}
          </h2>
          {clinician.qualificationsLine ? (
            <DraftBadge draft={clinician.qualificationsLine.draft} tone="dark" inline>
              <p className="font-mono text-[13px] tracking-[0.04em] text-slate-300">
                {clinician.qualificationsLine.value}
              </p>
            </DraftBadge>
          ) : null}
          <p className="measure-lead text-lead text-slate-300">{clinician.summary}</p>
          {clinician.stats.length ? (
            <dl className="flex flex-wrap gap-x-12 gap-y-5">
              {clinician.stats.map((st) => (
                <div key={st.label} className="flex flex-col-reverse gap-1.5">
                  <dt className="eyebrow text-blue-300">{st.label}</dt>
                  <dd className="font-display text-[clamp(2.25rem,4vw,3rem)] leading-none font-medium text-white">
                    {st.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
          <div className="border-t border-white/12 pt-6">
            <p id="clinician-specialities" className="eyebrow text-blue-300">
              Specialised in
            </p>
            <ul
              aria-labelledby="clinician-specialities"
              className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2"
            >
              {clinician.expertise.map((e) => (
                <li key={e} className="flex gap-3 text-[15px] text-white">
                  <span
                    aria-hidden
                    className="mt-[9px] size-1.5 shrink-0 rounded-full bg-orange-500"
                  />
                  {e}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button href="/about" variant="light" arrow>
              Meet your clinical specialist
            </Button>
            <Button
              href={buildWhatsAppLink("clinician")}
              variant="ghost-dark"
              data-wa-context="clinician"
            >
              Ask a question
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
