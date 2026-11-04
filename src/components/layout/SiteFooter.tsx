import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { site } from "@/content/site";
import type { ClinicianView } from "@/lib/content";
import { buildWhatsAppLink, mailLink, telLink } from "@/lib/whatsapp";
import { SocialLinks } from "../ui/SocialLinks";
import { DraftBadge } from "../ui/DraftBadge";
import type { NavLink, NavService } from "./nav";
import { Wordmark } from "./Wordmark";

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/refund-policy", label: "Refund policy" },
  { href: "/medical-disclaimer", label: "Medical disclaimer" },
  { href: "/accessibility", label: "Accessibility" },
];

const linkCls =
  "rounded-[4px] text-slate-300 underline-offset-[3px] hover:text-white hover:underline";

export function SiteFooter({
  academyLinks,
  year,
  services,
  registration,
}: {
  academyLinks: NavLink[];
  year: string;
  services: NavService[];
  registration: ClinicianView["registration"];
}) {
  return (
    <footer
      data-surface="dark"
      className="relative overflow-hidden bg-navy-950 text-[15px] text-slate-300"
    >
      <div className="container-page pt-16 pb-10 md:pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-5 lg:col-span-4">
            <Wordmark tone="dark" />
            <p className="max-w-[36ch] text-slate-300">
              Clinical optometry training and appointment-based eye care in {site.location.city}.
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              <li>
                <Link href="/about" className={linkCls}>
                  About us
                </Link>
              </li>
              <li>
                <Link href="/blog" className={linkCls}>
                  Eye health blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className={linkCls}>
                  Contact
                </Link>
              </li>
            </ul>
            <SocialLinks tone="dark" className="mt-1" />
            {site.registrations.length ? (
              <dl className="mt-2 flex flex-col gap-1 font-mono text-[12px] tracking-[0.04em] text-slate-300">
                {site.registrations.map((r) => (
                  <div key={r.label} className="flex gap-2">
                    <dt>{r.label}:</dt>
                    <dd>{r.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>

          <nav aria-labelledby="footer-academy" className="lg:col-span-2">
            <h2 id="footer-academy" className="mb-4 text-[15px] font-semibold text-white">
              Academy
            </h2>
            <ul className="flex flex-col gap-2.5">
              {academyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/academy/enquire" className={linkCls}>
                  Enquire now
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-care" className="lg:col-span-3">
            <h2 id="footer-care" className="mb-4 text-[15px] font-semibold text-white">
              Eye Care
            </h2>
            <ul className="flex flex-col gap-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/eye-care/${s.slug}`} className={linkCls}>
                    {s.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/eye-care#book" className={linkCls}>
                  Book an eye appointment
                </Link>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="mb-4 text-[15px] font-semibold text-white">Contact</h2>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a href={telLink} className={linkCls}>
                  {site.phone.display}
                </a>
              </li>
              <li>
                <a
                  href={buildWhatsAppLink("general")}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-wa-context="general"
                  className={linkCls}
                >
                  WhatsApp<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a href={mailLink} className={`${linkCls} break-all`}>
                  {site.email}
                </a>
              </li>
            </ul>
            <address className="mt-6 not-italic">
              <p className="mb-2 eyebrow text-orange-300">{site.office.label}</p>
              {site.office.lines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
          </div>
        </div>

        <div className="mt-14 flex gap-3 rounded-card border border-white/20 p-5">
          <TriangleAlert
            aria-hidden
            strokeWidth={1.5}
            className="mt-0.5 size-5 shrink-0 text-orange-300"
          />
          <p className="measure">
            <strong className="font-semibold text-white">Eye emergency? </strong>
            {site.emergencyNote}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/12 pt-6 text-meta md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          {registration ? (
            <DraftBadge draft={registration.draft} tone="dark" inline>
              <p>
                Registration: {registration.value.council} {registration.value.number}
              </p>
            </DraftBadge>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
