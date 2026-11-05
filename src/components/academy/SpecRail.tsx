import { site } from "@/content/site";
import type { Program } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { SpecList } from "@/components/ui/SpecList";
import { formatDate } from "@/lib/format";
import { programEnquiryHref } from "@/lib/links";
import {
  accreditationText,
  applyByText,
  batchText,
  cpdText,
  feeText,
  intakeText,
  isEventType,
  modeText,
  nextIntake,
  stagesText,
} from "@/lib/program-view";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/** Sticky specification card on program pages (§7.2). Empty rows are hidden. */
export function SpecRail({ program, today }: { program: Program; today: string }) {
  const event = isEventType(program);
  const intake = nextIntake(program, today);

  return (
    <aside
      aria-label="Program details"
      className="rounded-card border border-line bg-white p-6 lg:sticky lg:top-[calc(var(--header-h)+24px)]"
    >
      <p className="eyebrow text-blue-900">At a glance</p>
      <SpecList
        className="mt-4"
        size="sm"
        rows={[
          { label: "Who it's for", value: stagesText(program) },
          { label: "Eligibility", value: program.eligibility },
          event
            ? {
                label: "Date & time",
                value: intake
                  ? `${formatDate(intake.start)}${program.schedule ? ` · ${program.schedule}` : ""}`
                  : undefined,
              }
            : { label: "Duration", value: program.duration },
          ...(event ? [] : [{ label: "Schedule", value: program.schedule }]),
          { label: "Mode", value: modeText(program) },
          { label: "Venue", value: program.venue },
          { label: "Clinical training", value: program.partner },
          { label: "Batch size", value: batchText(program) },
          { label: "Fee", value: feeText(program) },
          { label: "Fee includes", value: program.fee?.includes?.join(", ") },
          {
            label: "Payment",
            value: program.fee
              ? `${site.payment.methods}${program.fee.instalments ? " · instalments accepted (plan varies by course)" : ""}`
              : undefined,
          },
          ...(event
            ? []
            : [
                {
                  label: "Next intake",
                  value: intakeText(program, today) ?? "Dates to be announced",
                },
              ]),
          { label: "Apply by", value: applyByText(program, today) },
          { label: "Certificate", value: program.certificate },
          event
            ? { label: "CE/CPD points", value: cpdText(program.accreditation) }
            : { label: "Accreditation", value: accreditationText(program.accreditation) },
        ]}
      />
      <div className="mt-6 flex flex-col gap-3">
        <Button href={programEnquiryHref(program)} variant="accent" arrow className="w-full">
          Enquire about this program
        </Button>
        <Button
          href={buildWhatsAppLink("program", undefined, program.title)}
          variant="secondary"
          icon={<WhatsAppIcon />}
          className="w-full"
          data-wa-context="program"
        >
          Ask on WhatsApp
        </Button>
      </div>
    </aside>
  );
}

/** Mobile replacement for the action bar on program pages. */
export function ProgramStickyEnquire({ program }: { program: Program }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] backdrop-blur-md md:hidden">
      <Button href={programEnquiryHref(program)} variant="accent" className="h-11 w-full" arrow>
        Enquire
      </Button>
    </div>
  );
}
