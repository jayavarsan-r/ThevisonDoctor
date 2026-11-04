import type { Event } from "./types";

/**
 * Workshops and CME events (BUILD_PROMPT §9.3).
 *
 * No dates have been announced. These two drafts exist only for layout review
 * in preview mode; their dates are placeholders, not real dates.
 * A published event must have `start` (ISO date) and `mode`.
 */
export const events: Event[] = [
  {
    slug: "draft-workshop-1",
    status: "draft",
    type: "workshop",
    title: "[Draft] Workshop — topic and date TBC",
    start: "2027-01-16",
    mode: "in-person",
    venueArea: "Chennai (venue TBC)",
    accreditation: { status: "none" },
    specialities: ["contact-lenses"],
  },
  {
    slug: "draft-cme-1",
    status: "draft",
    type: "cme",
    title: "[Draft] CME — topic and date TBC",
    start: "2027-02-20",
    mode: "online",
    accreditation: { status: "none" },
    specialities: ["myopia"],
  },
];
