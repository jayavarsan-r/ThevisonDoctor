import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/** Closing enquiry band for Academy pages. */
export function EnquiryBand({
  title = "Not sure which program fits?",
  text = "Tell us your background and what you want to practise. We'll suggest programs that fit and confirm eligibility, schedule and fees with you directly.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section
      data-surface="dark"
      aria-labelledby="enquiry-band-title"
      className="bg-blue-900 py-16 md:py-20"
    >
      <div className="container-page grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="flex flex-col gap-4 lg:col-span-7">
          <h2 id="enquiry-band-title" className="font-display text-h2 font-medium text-white">
            {title}
          </h2>
          <p className="measure-lead text-lead text-blue-200">{text}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
          <Button href="/academy/enquire" variant="accent" arrow>
            Enquire now
          </Button>
          <Button
            href={buildWhatsAppLink("academy")}
            variant="ghost-dark"
            icon={<WhatsAppIcon />}
            data-wa-context="academy"
          >
            Ask on WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
}
