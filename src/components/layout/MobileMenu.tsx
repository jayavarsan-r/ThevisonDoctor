"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, GraduationCap, Menu, Phone, Mail, X, Eye } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { buildWhatsAppLink, mailLink, telLink } from "@/lib/whatsapp";
import { Button } from "../ui/Button";
import { WhatsAppIcon } from "../ui/icons";
import { SocialLinks } from "../ui/SocialLinks";
import type { NavLink, NavService } from "./nav";
import { Wordmark } from "./Wordmark";

/** Full-height sheet for mobile and tablet (§5.3). */
export function MobileMenu({
  academyLinks,
  services,
  dark,
}: {
  academyLinks: NavLink[];
  services: NavService[];
  dark: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  // Close on route change.
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  // Hide the mobile action bar while the sheet is open.
  useEffect(() => {
    document.body.dataset.menuOpen = String(open);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className={cn(
          "inline-flex size-11 items-center justify-center rounded-btn border transition-colors lg:hidden",
          dark
            ? "border-white/35 text-white hover:bg-white/10"
            : "border-line text-ink hover:border-blue-200 hover:bg-blue-50",
        )}
        aria-label="Open menu"
      >
        <Menu aria-hidden strokeWidth={1.5} className="size-5" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="animate-overlay fixed inset-0 z-50 bg-navy-950/40" />
        <Dialog.Content
          className="animate-sheet fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col overflow-y-auto bg-white shadow-float focus:outline-none"
          aria-describedby={undefined}
        >
          <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-line px-4">
            <Wordmark />
            <Dialog.Close
              className="inline-flex size-11 items-center justify-center rounded-btn border border-line text-ink hover:bg-blue-50"
              aria-label="Close menu"
            >
              <X aria-hidden strokeWidth={1.5} className="size-5" />
            </Dialog.Close>
          </div>
          <Dialog.Title className="sr-only">Menu</Dialog.Title>

          <div className="flex flex-col gap-8 px-4 pt-5 pb-10">
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/academy"
                onClick={close}
                data-surface="dark"
                className="flex min-h-36 flex-col justify-between rounded-card bg-blue-900 p-4 text-white"
              >
                <GraduationCap aria-hidden strokeWidth={1.5} className="size-7 text-blue-300" />
                <span>
                  <span className="block text-[15px] leading-snug font-semibold">
                    I&apos;m here to learn
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1 text-meta text-blue-300">
                    Academy <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
                  </span>
                </span>
              </Link>
              <Link
                href="/eye-care"
                onClick={close}
                className="flex min-h-36 flex-col justify-between rounded-card border border-blue-200 bg-blue-50 p-4 text-ink"
              >
                <Eye aria-hidden strokeWidth={1.5} className="size-7 text-blue-900" />
                <span>
                  <span className="block text-[15px] leading-snug font-semibold">
                    I&apos;m here for eye care
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1 text-meta text-blue-900">
                    Eye Care <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
                  </span>
                </span>
              </Link>
            </div>

            <nav aria-label="Mobile">
              <MenuGroup title="Academy">
                {academyLinks.map((l) => (
                  <MenuLink key={l.href} href={l.href} onClick={close}>
                    {l.label}
                  </MenuLink>
                ))}
                <MenuLink href="/academy/enquire" onClick={close}>
                  Enquire academy
                </MenuLink>
              </MenuGroup>
              <MenuGroup title="Eye Care">
                {services.map((s) => (
                  <MenuLink key={s.slug} href={`/eye-care/${s.slug}`} onClick={close}>
                    {s.title}
                  </MenuLink>
                ))}
                <MenuLink href="/eye-care#how-it-works" onClick={close}>
                  How appointments work
                </MenuLink>
                <MenuLink href="/eye-care#book" onClick={close}>
                  Book an eye appointment
                </MenuLink>
              </MenuGroup>
              <MenuGroup title="More">
                <MenuLink href="/blog" onClick={close}>
                  Eye health blog
                </MenuLink>
                <MenuLink href="/about" onClick={close}>
                  About us
                </MenuLink>
                <MenuLink href="/contact" onClick={close}>
                  Contact
                </MenuLink>
              </MenuGroup>
            </nav>

            <div className="flex flex-col gap-3 rounded-card bg-blue-50 p-5">
              <a
                href={telLink}
                className="inline-flex items-center gap-2 text-[15px] font-medium text-ink"
              >
                <Phone aria-hidden strokeWidth={1.5} className="size-[18px] text-blue-900" />
                {site.phone.display}
              </a>
              <a
                href={mailLink}
                className="inline-flex items-center gap-2 text-[15px] font-medium break-all text-ink"
              >
                <Mail
                  aria-hidden
                  strokeWidth={1.5}
                  className="size-[18px] shrink-0 text-blue-900"
                />
                {site.email}
              </a>
              <Button
                href={buildWhatsAppLink("general")}
                variant="secondary"
                className="mt-2 w-full"
                icon={<WhatsAppIcon />}
                data-wa-context="general"
              >
                WhatsApp us
              </Button>
              <SocialLinks className="mt-2" />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function MenuGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line py-4 first:border-t-0 first:pt-0">
      <p className="mb-2 eyebrow text-slate-600">{title}</p>
      <ul className="flex flex-col">{children}</ul>
    </div>
  );
}

function MenuLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="flex min-h-11 items-center justify-between rounded-btn py-2 text-[17px] font-medium text-ink hover:text-blue-600"
      >
        {children}
        <ArrowRight aria-hidden strokeWidth={1.5} className="size-4 text-slate-500" />
      </Link>
    </li>
  );
}
