import { OpticalRings } from "@/components/motif/OpticalRings";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/** Shown when no programs are published — the expected state at launch (§6.3). */
export function EmptyPrograms() {
  return (
    <div className="relative overflow-hidden rounded-card bg-blue-50 p-8 sm:p-12">
      <OpticalRings
        rings={7}
        focal={2}
        reticle={false}
        className="absolute -right-24 -bottom-32 w-[420px] opacity-80 sm:-right-10"
      />
      <div className="relative flex max-w-[52ch] flex-col gap-4">
        <p className="eyebrow text-blue-900">Intakes</p>
        <h3 className="font-display text-[clamp(1.75rem,3vw,2.25rem)] leading-tight font-medium text-ink">
          New intakes are being finalised.
        </h3>
        <p className="text-slate-600">
          Leave your details and we&apos;ll send dates, eligibility and fees as soon as they&apos;re
          confirmed.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button href="/academy/enquire?intent=notify" arrow>
            Get notified
          </Button>
          <Button
            href={buildWhatsAppLink("academy")}
            variant="secondary"
            icon={<WhatsAppIcon />}
            data-wa-context="academy"
          >
            Ask on WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}
