/**
 * Content model (BUILD_PROMPT §9.1).
 *
 * Every business fact that is not confirmed by the client lives here with
 * `status: "draft"` or `verified: false`. Getters in `src/lib/content.ts`
 * strip those out of production builds.
 */

export type Status = "draft" | "published";
export type Verified<T> = { value: T; verified: boolean };

export type ProgramType = "fellowship" | "certification" | "clinical-training" | "workshop" | "cme";
export type Stage = "student-intern" | "practising-optometrist" | "other-eyecare";
export type Speciality = "myopia" | "binocular-vision" | "contact-lenses" | "diagnostics";
export type Mode = "in-person" | "online" | "hybrid";

export interface Accreditation {
  status: "none" | "applied" | "approved";
  body?: string;
  points?: number;
}

export interface Program {
  slug: string;
  status: Status;
  type: ProgramType;
  title: string;
  outcome: string;
  stages: Stage[];
  specialities: Speciality[];
  eligibility?: string;
  /** "Who can apply" as a list, when the brochure gives one. */
  eligibilityList?: string[];
  duration?: string;
  schedule?: string;
  mode?: Mode;
  venue?: string;
  /** Clinical training association, e.g. a partner hospital. */
  partner?: string;
  /** e.g. "10–15 learners (first batch)". */
  batchSize?: string;
  fee?: {
    amountINR: number;
    gstNote?: string;
    includes?: string[];
    /** Payment in instalments is offered (details shared on enquiry). */
    instalments?: boolean;
  };
  /**
   * `start` is ISO: "2027-01-12", or "2027-01" when only the month is confirmed.
   */
  intakes?: { start: string; applyBy?: string; status: "open" | "full" | "closed" }[];
  outcomes?: string[];
  highlights?: string[];
  curriculum?: {
    title: string;
    summary?: string;
    topics?: string[];
    theoryHours?: number;
    practicalHours?: number;
  }[];
  /** Shown under the curriculum, e.g. "The final curriculum will be based on…". */
  curriculumNote?: string;
  handsOn?: string;
  assessment?: string;
  certificate?: string;
  /** Prominent note in the certification block (scope of the certificate). */
  importantNote?: string;
  accreditation: Accreditation;
  notFor?: string;
  faqs?: string[];
  facultyIds: string[];
  /** Guest sessions by visiting speakers, described in the client's words. */
  guestFaculty?: { title: string; text: string };
  relatedSlugs?: string[];
}

export interface Event {
  slug: string;
  status: Status;
  type: "workshop" | "cme";
  title: string;
  start: string;
  end?: string;
  mode: Mode;
  venueArea?: string;
  fee?: number;
  seats?: number;
  accreditation: Accreditation;
  agenda?: { time?: string; title: string }[];
  specialities?: Speciality[];
  summary?: string;
  /** When the event has a full program page (workshop/CME variant). */
  programSlug?: string;
}

/** A detail the owner still has to supply, e.g. "Lens types offered". */
export interface DraftDetail {
  label: string;
  value?: string;
  verified: boolean;
}

export interface Service {
  slug: string;
  status: Status;
  title: string;
  short: string;
  icon: ServiceIcon;
  lead: string;
  /** Heading for the "Is this for you?" list, when it needs different wording. */
  forWhomTitle?: string;
  forWhom: string[];
  /** Short line rendered under the "Is this for you?" list, e.g. "This list is not a diagnosis." */
  forWhomNote?: string;
  /** Optional general-information paragraphs. */
  about?: string[];
  steps: string[];
  prepare?: string[];
  feeDisplay?: string;
  whereWhen?: string;
  faqs?: string[];
  relatedProgramSpecialities?: Speciality[];
  /** "core" services, or part of super-speciality eye care. */
  group: "core" | "super-speciality";
  details?: DraftDetail[];
  /** Home consultation only: shows the pincode checker when pincodes exist. */
  pincodeChecker?: boolean;
}

export type ServiceIcon = "home" | "screening" | "myopia" | "binocular" | "lens" | "exam";

export interface Qualification {
  degree: string;
  institution?: string;
  year?: string;
}

export interface Clinician {
  id: string;
  /** "Dr. Subash V" — for structured data. */
  name: string;
  /** "Dr. Subash V, O.D. (SWISS)" — how the name appears on the site. */
  displayName: string;
  credential: string;
  /** Structured data only; not shown after the name. */
  role: "Optometrist";
  summary: string;
  expertise: string[];
  qualifications: Verified<Qualification>[];
  qualificationsLine: Verified<string>;
  registration?: Verified<{ council: string; number: string }>;
  experience: Verified<{ place: string; years?: string }>[];
  teachingApproach: Verified<string>;
  photo?: string;
  /** Client-supplied figures shown on the profile, e.g. { value: "36,000+", label: "Patients seen" }. */
  stats?: { value: string; label: string }[];
}

export interface Faq {
  id: string;
  audience: "learner" | "patient";
  q: string;
  a: string;
  homepage?: boolean;
  status: Status;
}

export interface ConsultationLocation {
  id: string;
  status: Status;
  name: string;
  area: string;
  days?: string;
  hours?: string;
  note?: string;
}

export interface ContentNote {
  page: string;
  item: string;
  note: string;
}

export type BlogCategory = "eye-diseases" | "vision-disorders";
export type BlogCover =
  | "dry-eye"
  | "keratoconus"
  | "cataract"
  | "squint"
  | "glaucoma"
  | "armd"
  | "diabetic"
  | "hypertensive"
  | "amblyopia"
  | "vergence"
  | "accommodation"
  | "myopia"
  | "screen"
  | "colour";

export interface BlogSection {
  heading: string;
  body?: string[];
  list?: string[];
  /** Titled items, e.g. management options. */
  items?: { title: string; text: string }[];
}

export interface BlogPost {
  slug: string;
  status: Status;
  category: BlogCategory;
  cover: BlogCover;
  /** On-page H1 — natural language, keyword-led. */
  title: string;
  /** <title> tag, at most 60 characters. */
  seoTitle: string;
  /** Meta description, at most 160 characters. */
  description: string;
  keywords: string[];
  /** ISO date the article was published on this site. */
  published: string;
  /** The condition, for MedicalCondition structured data. */
  condition: string;
  symptoms: string[];
  intro: string;
  sections: BlogSection[];
  faqs: { q: string; a: string }[];
  /** Service page that relates to this condition. */
  relatedService: string;
  /** Adds a prominent "go to a hospital if…" note near the top. */
  urgentNote?: string;
}

export interface CasePhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** A before-and-after case from the practice (non-surgical care). */
export interface CareCase {
  id: string;
  status: Status;
  /** e.g. "Ptosis (drooping upper eyelids)". */
  condition: string;
  /** e.g. "Crutch glasses". */
  treatment: string;
  summary: string;
  before?: CasePhoto;
  after?: CasePhoto;
  /** Service page the case belongs to. */
  relatedService: string;
  /** Blog articles that show this case. */
  relatedPosts?: string[];
  /** Safety line shown with the case, e.g. when the same sign can be an emergency. */
  safetyNote?: string;
  /** Written permission from the patient to publish the photos. */
  consentConfirmed: boolean;
}
