import type { Clinician } from "./types";

const NAME = "Dr. Subash V";
// Shown after the name everywhere, at the clinician's request (Nov 2026).
const CREDENTIAL = "O.D. (SWISS)";

/**
 * The clinician (BUILD_PROMPT §2).
 *
 * `displayName` ("Dr. Subash V, O.D. (SWISS)") is the ONE place the visible
 * name is set; change NAME or CREDENTIAL here and it updates sitewide. Use of
 * the "Dr." prefix by optometrists is under legal review. `role` is kept for
 * structured data only.
 */
export const clinician: Clinician = {
  id: "subash-v",
  name: NAME,
  displayName: `${NAME}, ${CREDENTIAL}`,
  credential: CREDENTIAL,
  role: "Optometrist",
  summary:
    "He has 5 years of clinical expertise as an eye care professional and clinical vision specialist.",
  // "Specialised in" — the clinician's own list (Nov 2026).
  expertise: [
    "Ocular disease",
    "Squint correction",
    "Myopia management",
    "Binocular vision and vision therapy",
    "Speciality contact lenses",
    "Low vision rehabilitation",
  ],
  // Supplied but not verified. Institution and year are unknown.
  qualificationsLine: { value: "B.Optom | O.D. (Switzerland) | M.S. (YT)", verified: false },
  qualifications: [
    { value: { degree: "B.Optom" }, verified: false },
    {
      value: { degree: "O.D.", institution: "Switzerland (institution to be confirmed)" },
      verified: false,
    },
    { value: { degree: "M.S. (YT)" }, verified: false },
  ],
  // Registration number unknown — field stays hidden until supplied and verified.
  registration: undefined,
  // Hospitals and clinics previously worked at: unknown.
  experience: [],
  teachingApproach: {
    value:
      "Teaching approach to be written with the clinician: how sessions are structured, how cases are discussed and how practice is supervised.",
    verified: false,
  },
  photo: "/images/dr-subash-v.jpg",
  // Supplied by the clinician (Oct 2026). Years match the summary above.
  stats: [
    { value: "36,000+", label: "Patients seen" },
    { value: "5 years", label: "Clinical experience" },
  ],
};

export const clinicians: Clinician[] = [clinician];
