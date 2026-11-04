import type { Event, Program, Service } from "@/content/types";

export const programHref = (p: Pick<Program, "slug">) => `/academy/programs/${p.slug}`;
export const serviceHref = (s: Pick<Service, "slug">) => `/eye-care/${s.slug}`;
export const eventHref = (e: Pick<Event, "slug" | "programSlug">) =>
  e.programSlug ? `/academy/programs/${e.programSlug}` : `/academy/workshops#${e.slug}`;
export const programEnquiryHref = (p: Pick<Program, "slug">) =>
  `/academy/enquire?program=${encodeURIComponent(p.slug)}`;
export const serviceBookingHref = (s: Pick<Service, "slug">) =>
  `/eye-care/${s.slug}?service=${encodeURIComponent(s.slug)}#book`;
