import Link from "next/link";
import { site } from "@/content/site";
import type { Event } from "@/content/types";
import { formatDate } from "@/lib/format";
import { eventHref } from "@/lib/links";
import { buildWhatsAppLink, telLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "../ui/icons";
import { AudienceSwitch } from "./AudienceSwitch";

/** 32–36px bar above the header (§5.2). */
export function UtilityBar({
  nextEvent,
  admission,
}: {
  nextEvent?: Event;
  /** Shown when no workshop is scheduled but a program intake is open. */
  admission?: { title: string; href: string; intake?: string };
}) {
  const wa = buildWhatsAppLink("general");
  return (
    <div data-surface="dark" className="bg-blue-900 text-[13px] text-white">
      <div className="container-page flex h-9 items-center justify-between gap-4">
        <p className="hidden min-w-0 truncate md:block">
          {nextEvent ? (
            <Link
              href={eventHref(nextEvent)}
              className="inline-flex items-center gap-2 underline-offset-[3px] hover:underline"
            >
              <span aria-hidden className="size-1.5 rounded-full bg-orange-500" />
              <span>
                Next workshop: {nextEvent.title} ·{" "}
                <time dateTime={nextEvent.start}>{formatDate(nextEvent.start)}</time>
              </span>
            </Link>
          ) : admission ? (
            <Link
              href={admission.href}
              className="inline-flex items-center gap-2 underline-offset-[3px] hover:underline"
            >
              <span aria-hidden className="size-1.5 rounded-full bg-orange-500" />
              <span>
                Admissions open: {admission.title}
                {admission.intake ? ` · First batch ${admission.intake}` : ""}
              </span>
            </Link>
          ) : (
            <span>Optometry Academy &amp; Eye Care · {site.location.city}</span>
          )}
        </p>
        <div className="flex w-full items-center justify-between gap-5 md:w-auto md:justify-end">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            data-wa-context="general"
            className="inline-flex min-h-6 min-w-6 items-center justify-center gap-1.5 underline-offset-[3px] hover:underline"
          >
            <WhatsAppIcon size={16} />
            <span className="hidden md:inline">WhatsApp</span>
            <span className="sr-only md:hidden">WhatsApp us</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={telLink} className="hidden underline-offset-[3px] hover:underline md:inline">
            {site.phone.display}
          </a>
          <AudienceSwitch />
        </div>
      </div>
    </div>
  );
}
