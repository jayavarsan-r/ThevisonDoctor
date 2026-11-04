import { site, siteUrl } from "@/content/site";
import type { Event, Faq, Program, Service } from "@/content/types";
import type { ClinicianView } from "./content";

/**
 * JSON-LD builders. Only verified, published facts go into structured data.
 * The office address is deliberately omitted: it is not a clinic.
 */

const ORG_ID = `${siteUrl}/#organization`;

const areaServed = {
  "@type": "City",
  name: site.location.city,
  containedInPlace: { "@type": "State", name: site.location.region },
};

const locality = {
  "@type": "PostalAddress",
  addressLocality: site.location.city,
  addressRegion: site.location.region,
  addressCountry: site.location.countryCode,
};

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": ORG_ID,
    name: site.name,
    alternateName: site.shortName,
    url: siteUrl,
    logo: `${siteUrl}/images/brand/logo-stacked.png`,
    description: site.description,
    telephone: site.phone.e164,
    email: site.email,
    address: locality,
    areaServed,
    ...(site.social.some((s) => s.confirmed)
      ? { sameAs: site.social.filter((s) => s.confirmed).map((s) => s.url) }
      : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: site.shortName,
    url: siteUrl,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN",
  };
}

export function personSchema(c: ClinicianView) {
  const credentials = c.qualifications
    .filter((q) => !q.draft)
    .map((q) => ({
      "@type": "EducationalOccupationalCredential",
      name: q.value.degree,
      ...(q.value.institution
        ? { recognizedBy: { "@type": "Organization", name: q.value.institution } }
        : {}),
    }));
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/about#person`,
    name: c.name,
    honorificSuffix: c.credential,
    jobTitle: c.role,
    description: c.summary,
    knowsAbout: c.expertise,
    worksFor: { "@id": ORG_ID },
    url: `${siteUrl}/about`,
    ...(credentials.length ? { hasCredential: credentials } : {}),
  };
}

const modeToSchema: Record<NonNullable<Program["mode"]>, string> = {
  "in-person": "Onsite",
  online: "Online",
  hybrid: "Blended",
};

const attendanceMode: Record<Event["mode"], string> = {
  "in-person": "https://schema.org/OfflineEventAttendanceMode",
  online: "https://schema.org/OnlineEventAttendanceMode",
  hybrid: "https://schema.org/MixedEventAttendanceMode",
};

export function courseSchema(p: Program) {
  const url = `${siteUrl}/academy/programs/${p.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${url}#course`,
    name: p.title,
    description: p.outcome,
    url,
    provider: { "@id": ORG_ID, "@type": "EducationalOrganization", name: site.name },
    ...(p.fee
      ? {
          offers: {
            "@type": "Offer",
            price: p.fee.amountINR,
            priceCurrency: "INR",
            category: "Paid",
          },
        }
      : {}),
    ...(p.intakes?.length
      ? {
          hasCourseInstance: p.intakes.map((i) => ({
            "@type": "CourseInstance",
            startDate: i.start,
            ...(p.mode ? { courseMode: modeToSchema[p.mode] } : {}),
            ...(p.venue && p.mode !== "online"
              ? { location: { "@type": "Place", name: p.venue, address: locality } }
              : {}),
          })),
        }
      : {}),
  };
}

export function eventSchema(e: Event | Program, start?: string) {
  const isProgram = "outcome" in e;
  const startDate = isProgram ? (start ?? e.intakes?.[0]?.start) : e.start;
  const mode = (isProgram ? e.mode : e.mode) ?? "in-person";
  const venue = isProgram ? e.venue : e.venueArea;
  if (!startDate) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    startDate,
    ...(!isProgram && e.end ? { endDate: e.end } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: attendanceMode[mode],
    location:
      mode === "online"
        ? { "@type": "VirtualLocation", url: siteUrl }
        : { "@type": "Place", name: venue ?? site.location.city, address: locality },
    organizer: { "@id": ORG_ID, "@type": "EducationalOrganization", name: site.name, url: siteUrl },
  };
}

export function serviceSchema(s: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    serviceType: s.title,
    description: s.lead,
    url: `${siteUrl}/eye-care/${s.slug}`,
    areaServed,
    provider: {
      "@type": "MedicalBusiness",
      name: site.name,
      telephone: site.phone.e164,
      url: `${siteUrl}/eye-care`,
      areaServed,
    },
  };
}

export function faqSchema(items: Faq[]) {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.href}`,
    })),
  };
}
