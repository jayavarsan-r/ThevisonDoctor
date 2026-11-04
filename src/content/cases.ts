import type { CareCase } from "./types";

/**
 * Before-and-after cases from the practice (non-surgical care), supplied by the
 * client over WhatsApp on 26 Oct 2026 with these captions:
 *   "Ptosis, treated with crutch glasses"
 *   "Squint, treated with vision therapy"
 *   "Squint, treated with prism glasses"
 *
 * Only two photo pairs arrived. The squint pair is matched to vision therapy
 * because the "after" photo shows straight eyes without glasses; the client
 * should confirm this (see CONTENT_TODO.md). The prism-glasses case stays a
 * draft until its photos are sent.
 *
 * Photos are cropped to 12:5 and stripped of metadata. Before publishing a new
 * case, get the patient's written permission and set `consentConfirmed: true`.
 */
const PHOTO = { width: 1200, height: 500 } as const;

export const cases: CareCase[] = [
  {
    id: "ptosis-crutch-glasses",
    status: "published",
    condition: "Ptosis (drooping upper eyelids)",
    treatment: "Crutch glasses",
    summary:
      "Crutch glasses have a small support fitted to the frame that gently holds up a drooping eyelid, so it no longer covers the eye. For some people they are an alternative to eyelid surgery.",
    before: {
      src: "/images/cases/ptosis-crutch-glasses-before.jpg",
      alt: "Before: both upper eyelids droop and cover most of the eyes.",
      ...PHOTO,
    },
    after: {
      src: "/images/cases/ptosis-crutch-glasses-after.jpg",
      alt: "After: wearing crutch glasses, both eyes are open.",
      ...PHOTO,
    },
    relatedService: "comprehensive-eye-examination",
    safetyNote:
      "A drooping eyelid that appears suddenly, especially with double vision, a severe headache or weakness, needs a hospital emergency department straight away.",
    consentConfirmed: false,
  },
  {
    id: "squint-vision-therapy",
    status: "published",
    condition: "Squint (strabismus)",
    treatment: "Vision therapy",
    summary:
      "A structured program of eye exercises, guided by the optometrist, to improve how the eyes work together. Whether it can help depends on the type of squint, so an assessment comes first.",
    before: {
      src: "/images/cases/squint-vision-therapy-before.jpg",
      alt: "Before: the eyes are not aligned and point in slightly different directions.",
      ...PHOTO,
    },
    after: {
      src: "/images/cases/squint-vision-therapy-after.jpg",
      alt: "After vision therapy: both eyes look straight ahead together.",
      ...PHOTO,
    },
    relatedService: "vision-therapy",
    relatedPosts: ["squint-strabismus-signs-causes-treatment"],
    consentConfirmed: false,
  },
  {
    id: "squint-prism-glasses",
    status: "draft",
    condition: "Squint (strabismus)",
    treatment: "Prism glasses",
    summary:
      "Prism lenses bend light so both eyes can work together more comfortably. They can help some types of squint and double vision.",
    relatedService: "vision-therapy",
    relatedPosts: ["squint-strabismus-signs-causes-treatment"],
    consentConfirmed: false,
  },
];
