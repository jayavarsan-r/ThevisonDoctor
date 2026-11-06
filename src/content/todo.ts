import type { ContentNote } from "./types";

/**
 * Questions for the owner that are not tied to a single draft field.
 * `scripts/content-check.ts` merges these into CONTENT_TODO.md together with
 * every draft item and unverified field it finds in the content files.
 */
export const contentNotes: ContentNote[] = [
  {
    page: "Sitewide",
    item: '"Dr." prefix',
    note: 'Use of "Dr." by optometrists is under legal review. Change `clinician.displayName` in src/content/clinician.ts to update it everywhere.',
  },
  {
    page: "Home",
    item: "Hero video",
    note: "Optional. Add /public/media/hero.webm, /public/media/hero.mp4 and /public/media/hero-poster.avif (no audio, no patients). Without them the hero shows the optical-rings artwork.",
  },
  {
    page: "Academy › Programs",
    item: "Fellowship — remaining details",
    note: "Published from the brochure. Still to confirm: exact start date in January 2027 (intakes every January and July), apply-by date, weekly schedule (days and times), what the ₹29,999 fee includes and refund terms.",
  },
  {
    page: "Academy › Programs",
    item: "Instalment plans",
    note: "Pages say payment is by cash or UPI and that instalments are accepted, with the plan varying by course (5 Nov 2026). Send each course's plan if you want it shown.",
  },
  {
    page: "About",
    item: "Teaching faculty and guest speakers",
    note: "The About page and the fellowship describe expert guest faculty in general terms; guest speakers are announced to students close to each session. To list teaching faculty by name, send each faculty member's name, credentials, role and a portrait (with permission).",
  },
  {
    page: "Academy › Programs",
    item: "Certifications — remaining details",
    note: 'Both certifications are published from "Certificate Course.pdf". Fee ₹8,999, first batch January 2027 and monthly intakes (client, 6 Nov 2026). Still to confirm: weekly schedule, where in-person sessions happen, what the ₹8,999 fee includes and the assessment format. CRDI eligibility now includes Diploma graduates, students and interns (from the 29 Oct meeting notes) — confirm.',
  },
  {
    page: "Academy › Programs",
    item: "Certifications — scope note",
    note: 'Each certification page carries the same scope note as the fellowship brochure ("does not, by itself, confer a statutory licence…"). Confirm the wording is right for the certificate courses.',
  },
  {
    page: "Academy",
    item: "Other programs",
    note: "For short-term clinical workshops and CME supply: title, outcome, eligibility, duration, schedule, mode, venue, batch size, fee, intakes, agenda, certificate wording and accreditation status.",
  },
  {
    page: "Academy",
    item: "Choose by stage",
    note: "The student/intern and other-professional cards stay general until workshops, CME or other programs for those groups are confirmed.",
  },
  {
    page: "Academy",
    item: "Institution training",
    note: "Confirm that in-house training for hospitals, colleges and optical teams is offered (the institutions FAQ is a draft).",
  },
  {
    page: "Home",
    item: "Brand collaborations — original files",
    note: "The six logos in the strip were cleaned up from WhatsApp images. For sharper logos, send the original SVG or PNG files, and confirm each brand is happy to be shown.",
  },
  {
    page: "Sitewide",
    item: "Office phone number",
    note: "The site lists +91 95141 62051 and thevisiondoctor6.6@gmail.com. If the office has a separate landline, send it for the Contact page.",
  },
  {
    page: "Eye Care › Before and after",
    item: "Which squint case is which",
    note: 'Two photo pairs arrived for three captions. The squint pair is shown as "treated with vision therapy" (the after photo has no glasses). Confirm this, and send the photos for the prism-glasses case.',
  },
  {
    page: "Eye Care",
    item: "Locations, area, days, hours and fees",
    note: "Supply consultation locations (not the office), the home-visit pincodes, days, hours and fees. Set them in src/content/locations.ts and src/content/services.ts.",
  },
  {
    page: "Eye Care",
    item: "Professional clinical networks",
    note: "Super-speciality care is described as accessed through professional clinical networks. Confirm whether any partners should be named on the service pages.",
  },
  {
    page: "About",
    item: "Professional registration",
    note: "Supply the registration council and number so it can be verified and shown on About and in the footer.",
  },
  {
    page: "About",
    item: "Clinical experience",
    note: "List the hospitals and clinics previously worked at (with years, if wanted) and confirm each one may be named.",
  },
  {
    page: "Legal",
    item: "Legal pages",
    note: "Privacy notice, terms, refund policy, medical disclaimer and accessibility statement are draft templates. A qualified lawyer must review them before publication. Supply the data-retention period and a grievance officer contact.",
  },
];
