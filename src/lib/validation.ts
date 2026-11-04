import { z } from "zod";

/**
 * Enquiry schemas shared by the client forms and /api/enquiry.
 * Minimum data only — never medical history, symptoms or date of birth.
 */

export const STAGES = ["student-intern", "practising-optometrist", "other-eyecare"] as const;
export const SPECIALITIES = [
  "myopia",
  "binocular-vision",
  "contact-lenses",
  "diagnostics",
] as const;
export const ACADEMY_INTENTS = ["program", "notify", "institution", "general"] as const;
export const CONTACT_METHODS = ["whatsapp", "phone", "email"] as const;
export const CARE_FOR_WHOM = ["self", "child", "family", "group"] as const;
export const GENDERS = ["female", "male", "other", "prefer-not-to-say"] as const;
export const VISIT_TYPES = ["home", "location", "either"] as const;
export const PREFERRED_TIMES = [
  "",
  "weekday-morning",
  "weekday-afternoon",
  "weekday-evening",
  "weekend",
] as const;

export type AcademyIntent = (typeof ACADEMY_INTENTS)[number];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Indian mobile/landline (10 digits, optional +91/0) or any E.164 number. */
export function isValidPhone(raw: string) {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/[^\d]/g, "");
  if (/[^\d\s()+\-.]/.test(trimmed)) return false;
  if (trimmed.startsWith("+") && !trimmed.startsWith("+91")) {
    return digits.length >= 8 && digits.length <= 15;
  }
  const local = digits.replace(/^(91|0)(?=\d{10}$)/, "");
  return /^[2-9]\d{9}$/.test(local);
}

const name = z
  .string({ error: "Enter your name." })
  .trim()
  .min(2, "Enter your name.")
  .max(80, "Use 80 characters or fewer.");

const phone = z
  .string({ error: "Enter a phone number." })
  .trim()
  .min(1, "Enter a phone number.")
  .refine(isValidPhone, "Enter a valid phone number, for example 95141 62051.");

const email = z
  .string()
  .trim()
  .max(120, "Use 120 characters or fewer.")
  .refine((v) => v === "" || EMAIL.test(v), "Enter a valid email address, like name@example.com.");

const consent = z.literal(true, {
  error: "Please confirm that we may use these details to reply to your enquiry.",
});

const honeypot = z.string().max(500);
const turnstileToken = z.string().max(4096);

const always = { when: () => true };

type Loose = Record<string, unknown>;

// ---------- Academy ----------

export const academyEnquirySchema = z
  .object({
    kind: z.literal("academy"),
    intent: z.enum(ACADEMY_INTENTS, { error: "Choose what your enquiry is about." }),
    program: z.string().trim().max(120),
    specialities: z.array(z.enum(SPECIALITIES)).max(SPECIALITIES.length),
    name,
    phone,
    email,
    stage: z.union([z.enum(STAGES), z.literal("")], {
      error: "Choose the option that best describes you.",
    }),
    qualification: z.string().trim().max(120, "Use 120 characters or fewer."),
    organisation: z.string().trim().max(120, "Use 120 characters or fewer."),
    preferredContact: z.enum(CONTACT_METHODS, { error: "Choose how we should contact you." }),
    message: z.string().trim().max(1000, "Use 1,000 characters or fewer."),
    consent,
    website: honeypot,
    turnstileToken,
  })
  .superRefine((value, ctx) => {
    const d = value as unknown as Loose;
    if (d.intent !== "institution" && !d.stage) {
      ctx.addIssue({
        code: "custom",
        path: ["stage"],
        message: "Choose the option that best describes you.",
      });
    }
    if (d.intent === "institution" && String(d.organisation ?? "").trim().length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["organisation"],
        message: "Enter the name of your hospital, college or organisation.",
      });
    }
    if (d.preferredContact === "email" && !String(d.email ?? "").trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Enter your email address, or choose another way for us to contact you.",
      });
    }
  }, always);

export type AcademyEnquiryInput = z.input<typeof academyEnquirySchema>;
export type AcademyEnquiry = z.output<typeof academyEnquirySchema>;

// ---------- Eye care ----------

export const careEnquirySchema = z
  .object({
    kind: z.literal("care"),
    service: z.string({ error: "Choose a service." }).trim().min(1, "Choose a service.").max(80),
    forWhom: z.enum(CARE_FOR_WHOM, { error: "Choose who the appointment is for." }),
    guardianConfirm: z.boolean(),
    // Age and gender of the person the appointment is for (not date of birth).
    age: z
      .string({ error: "Enter the age in years." })
      .trim()
      .min(1, "Enter the age in years.")
      .refine(
        (v) => /^\d{1,3}$/.test(v) && Number(v) <= 120,
        "Enter an age in years, from 0 to 120.",
      ),
    gender: z.enum(GENDERS, { error: "Choose a gender option." }),
    visitType: z.enum(VISIT_TYPES, { error: "Choose where you would prefer the appointment." }),
    area: z
      .string({ error: "Enter your area or locality." })
      .trim()
      .min(2, "Enter your area or locality.")
      .max(80, "Use 80 characters or fewer."),
    pincode: z
      .string()
      .trim()
      .refine((v) => v === "" || /^\d{6}$/.test(v), "Enter a 6-digit pincode, or leave it blank."),
    preferredTime: z.enum(PREFERRED_TIMES),
    name,
    phone,
    email,
    preferredContact: z.enum(CONTACT_METHODS, { error: "Choose how we should contact you." }),
    message: z.string().trim().max(600, "Use 600 characters or fewer."),
    consent,
    website: honeypot,
    turnstileToken,
  })
  .superRefine((value, ctx) => {
    const d = value as unknown as Loose;
    if (d.forWhom === "child" && d.guardianConfirm !== true) {
      ctx.addIssue({
        code: "custom",
        path: ["guardianConfirm"],
        message: "Please confirm you are the child's parent or guardian.",
      });
    }
    if (d.preferredContact === "email" && !String(d.email ?? "").trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Enter your email address, or choose another way for us to contact you.",
      });
    }
  }, always);

export type CareEnquiryInput = z.input<typeof careEnquirySchema>;
export type CareEnquiry = z.output<typeof careEnquirySchema>;

export const enquirySchema = z.discriminatedUnion("kind", [
  academyEnquirySchema,
  careEnquirySchema,
]);
export type Enquiry = z.output<typeof enquirySchema>;

// ---------- Labels (shared by form UI and the notification email) ----------

export const intentLabels: Record<AcademyIntent, string> = {
  program: "A program",
  notify: "Notify me about new intakes",
  institution: "Training for an institution",
  general: "A general question",
};

export const contactLabels: Record<(typeof CONTACT_METHODS)[number], string> = {
  whatsapp: "WhatsApp",
  phone: "Phone call",
  email: "Email",
};

export const genderLabels: Record<(typeof GENDERS)[number], string> = {
  female: "Female",
  male: "Male",
  other: "Other",
  "prefer-not-to-say": "Prefer not to say",
};

export const forWhomLabels: Record<(typeof CARE_FOR_WHOM)[number], string> = {
  self: "Myself",
  child: "My child",
  family: "Another family member",
  group: "A group (school, workplace or community)",
};

export const visitTypeLabels: Record<(typeof VISIT_TYPES)[number], string> = {
  home: "At my home",
  location: "At a confirmed location",
  either: "No preference",
};

export const preferredTimeLabels: Record<(typeof PREFERRED_TIMES)[number], string> = {
  "": "No preference",
  "weekday-morning": "Weekday mornings",
  "weekday-afternoon": "Weekday afternoons",
  "weekday-evening": "Weekday evenings",
  weekend: "Weekends",
};
