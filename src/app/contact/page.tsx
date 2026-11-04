import { Eye, GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon, YouTubeIcon } from "@/components/ui/icons";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { PageHero } from "@/components/ui/PageHero";
import { site } from "@/content/site";
import { breadcrumbSchema } from "@/lib/schema";
import { buildWhatsAppLink, mailLink, telLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact The Vision Doctor Academy and Eye Care Services, Chennai — by phone, WhatsApp or email.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ])}
      />
      <PageHero
        eyebrow="Contact"
        title="How can we help?"
        lead="Choose the Academy for programs and training, or Eye Care for appointments. Or reach us directly."
      />

      <section aria-label="Enquiry options" className="bg-white py-14 md:py-20">
        <div className="container-page grid gap-5 md:grid-cols-2">
          <article className="flex flex-col gap-4 rounded-card border border-line p-7 sm:p-9">
            <GraduationCap aria-hidden strokeWidth={1.5} className="size-8 text-blue-900" />
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.25rem)] leading-tight font-medium text-ink">
              Academy enquiries
            </h2>
            <p className="text-slate-600">
              Programs, eligibility, schedules, fees and training for institutions.
            </p>
            <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row">
              <Button href="/academy/enquire" arrow>
                Enquire now
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
          </article>
          <article className="flex flex-col gap-4 rounded-card border border-blue-200 bg-blue-50 p-7 sm:p-9">
            <Eye aria-hidden strokeWidth={1.5} className="size-8 text-blue-900" />
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.25rem)] leading-tight font-medium text-ink">
              Eye care appointments
            </h2>
            <p className="text-slate-600">
              Home consultations, screening and speciality care — by appointment, never walk-in.
            </p>
            <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row">
              <Button href="/eye-care#book" arrow>
                Book an eye appointment
              </Button>
              <Button
                href={buildWhatsAppLink("care")}
                variant="secondary"
                icon={<WhatsAppIcon />}
                data-wa-context="care"
              >
                WhatsApp us
              </Button>
            </div>
          </article>
        </div>
      </section>

      <section aria-labelledby="details-title" className="bg-white pt-0 pb-14 md:pb-20">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-8">
          <h2
            id="details-title"
            className="font-display text-h2 font-medium text-ink lg:col-span-4"
          >
            Contact details
          </h2>
          <dl className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
            <Detail
              icon={<Phone aria-hidden strokeWidth={1.5} className="size-5 text-blue-900" />}
              label="Phone"
            >
              <a href={telLink} className="link">
                {site.phone.display}
              </a>
            </Detail>
            <Detail icon={<WhatsAppIcon size={20} className="text-blue-900" />} label="WhatsApp">
              <a
                href={buildWhatsAppLink("general")}
                target="_blank"
                rel="noopener noreferrer"
                data-wa-context="general"
                className="link"
              >
                {site.phone.display}
                <span className="sr-only"> on WhatsApp (opens in a new tab)</span>
              </a>
            </Detail>
            <Detail
              icon={<Mail aria-hidden strokeWidth={1.5} className="size-5 text-blue-900" />}
              label="Email"
            >
              <a href={mailLink} className="break-all link">
                {site.email}
              </a>
            </Detail>
            <Detail
              icon={<MapPin aria-hidden strokeWidth={1.5} className="size-5 text-blue-900" />}
              label={site.office.label}
            >
              <address className="not-italic">
                {site.office.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
                <span className="mt-1 block text-meta text-slate-600">{site.office.note}</span>
              </address>
            </Detail>
            <Detail icon={<YouTubeIcon size={20} className="text-blue-900" />} label="Follow us">
              <span className="flex flex-col gap-3">
                <span className="text-slate-600">
                  Eye health videos and Academy updates on YouTube and Instagram.
                </span>
                <SocialLinks />
              </span>
            </Detail>
          </dl>
        </div>
      </section>
    </>
  );
}

function Detail({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-card border border-line p-5">
      <dt className="flex items-center gap-3 eyebrow text-slate-600">
        <span className="shrink-0">{icon}</span>
        {label}
      </dt>
      <dd className="pl-8 text-[16px] text-ink">{children}</dd>
    </div>
  );
}
