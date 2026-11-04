import { Mail, Phone } from "lucide-react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buildWhatsAppLink, mailLink, telLink, type WhatsAppContext } from "@/lib/whatsapp";

/** "What happens next" + contact options beside an enquiry form (§7.4). */
export function ContactAside({
  steps,
  context,
}: {
  steps: { title: string; text: string }[];
  context: WhatsAppContext;
}) {
  return (
    <aside
      aria-label="What happens next"
      className="flex flex-col gap-6 lg:sticky lg:top-[calc(var(--header-h)+24px)]"
    >
      <div className="rounded-card bg-blue-50 p-6 sm:p-7">
        <h2 className="eyebrow text-blue-900">What happens next</h2>
        <ol className="mt-5 flex flex-col gap-5">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-white text-[14px] font-semibold text-blue-900">
                {i + 1}
              </span>
              <div>
                <h3 className="text-[16px] font-semibold text-ink">{s.title}</h3>
                <p className="mt-0.5 text-[15px] text-slate-600">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        {site.responseTime ? (
          <p className="mt-6 border-t border-blue-200 pt-4 text-meta text-slate-600">
            We usually reply {site.responseTime}.
          </p>
        ) : null}
      </div>
      <div className="rounded-card border border-line p-6 sm:p-7">
        <h2 className="text-[17px] font-semibold text-ink">Prefer to talk?</h2>
        <ul className="mt-4 flex flex-col gap-3 text-[15px]">
          <li>
            <a
              href={telLink}
              className="inline-flex items-center gap-2 text-ink hover:text-blue-600"
            >
              <Phone aria-hidden strokeWidth={1.5} className="size-[18px] text-blue-900" />
              {site.phone.display}
            </a>
          </li>
          <li>
            <a
              href={mailLink}
              className="inline-flex items-center gap-2 break-all text-ink hover:text-blue-600"
            >
              <Mail aria-hidden strokeWidth={1.5} className="size-[18px] shrink-0 text-blue-900" />
              {site.email}
            </a>
          </li>
        </ul>
        <Button
          href={buildWhatsAppLink(context)}
          variant="secondary"
          icon={<WhatsAppIcon />}
          className="mt-5 w-full"
          data-wa-context={context}
        >
          {context === "care" ? "WhatsApp us" : "Ask on WhatsApp"}
        </Button>
      </div>
    </aside>
  );
}
