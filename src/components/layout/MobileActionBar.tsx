"use client";

import { usePathname } from "next/navigation";
import { buildWhatsAppLink, type WhatsAppContext } from "@/lib/whatsapp";
import { Button } from "../ui/Button";
import { WhatsAppIcon } from "../ui/icons";

/**
 * Fixed bottom bar below `md` (§5.4). Hidden while the mobile menu is open
 * (CSS: body[data-menu-open]) and on program pages, which render their own
 * sticky "Enquire" bar.
 */
export function MobileActionBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/academy/programs/")) return null;

  const care = pathname.startsWith("/eye-care") || pathname.startsWith("/thank-you/eye-care");
  const context: WhatsAppContext = care
    ? "care"
    : pathname.startsWith("/academy")
      ? "academy"
      : "general";

  return (
    <div
      data-mobile-action-bar
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <div className="grid h-[var(--action-bar-h)] grid-cols-2 items-center gap-3 px-4">
        {care ? (
          <Button href="/eye-care#book" size="sm" className="h-11">
            Book eye care
          </Button>
        ) : (
          <Button href="/academy#programs" size="sm" className="h-11">
            Programs
          </Button>
        )}
        <Button
          href={buildWhatsAppLink(context)}
          variant="secondary"
          size="sm"
          className="h-11"
          icon={<WhatsAppIcon />}
          data-wa-context={context}
        >
          WhatsApp
        </Button>
      </div>
    </div>
  );
}
