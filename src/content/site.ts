import type { Verified } from "./types";

/**
 * Single source of truth for business facts (BUILD_PROMPT §2).
 * Only client-confirmed values are set without a `verified: false` flag.
 */
export const site = {
  name: "The Vision Doctor Academy and Eye Care Services",
  shortName: "The Vision Doctor",
  wordmarkSubline: "ACADEMY · EYE CARE",
  description:
    "Clinical optometry training for students and practising optometrists, and personalised, appointment-based eye care in Chennai.",
  /** Client wording ("Our Services"). */
  mission:
    "We are committed to advancing optometry education and delivering accessible, comprehensive eye care through clinical training, professional development, and patient-focused services.",

  location: {
    city: "Chennai",
    region: "Tamil Nadu",
    country: "India",
    countryCode: "IN",
  },

  /** Office only — never a clinic. Address as on the Udyam certificate. Always render with `office.label`. */
  office: {
    lines: [
      "22, C-1, Ganapathy Rao Nagar",
      "Papermills Road, Kolathur",
      "Chennai, Tamil Nadu – 600099",
    ],
    label: "Our office · visits by appointment",
    note: "Call or WhatsApp us to arrange a time.",
  },

  phone: {
    display: "+91 95141 62051",
    e164: "+919514162051",
  },
  whatsappBase: "https://wa.me/919514162051",
  email: "thevisiondoctor6.6@gmail.com",

  /**
   * Social profiles. Only `confirmed: true` links are shown in production and
   * listed in structured data. Paste the YouTube and Instagram profile URLs and
   * set `confirmed: true` to show them.
   */
  social: [
    {
      id: "linkedin",
      label: "LinkedIn",
      url: "https://www.linkedin.com/company/the-vision-doctor-academy-eye-care-services/",
      confirmed: true,
    },
    {
      id: "facebook",
      label: "Facebook",
      url: "https://www.facebook.com/share/19RS4o6uq9/",
      confirmed: true,
    },
    {
      id: "youtube",
      label: "YouTube",
      url: "https://www.youtube.com/@the.visiondoctor",
      confirmed: true,
    },
    {
      id: "instagram",
      label: "Instagram",
      url: "https://www.instagram.com/the.visiondoctor/",
      confirmed: true,
    },
  ],

  /** Google Search Console verification token (meta name="google-site-verification"). */
  googleSiteVerification: "3MiwxColfz7E4FqDBFF72B4iwsnA6kvf9w4eSEKSxhY",

  /**
   * Business registrations shown in the footer. Udyam from the registration
   * certificate (registered 15 Oct 2026, micro enterprise, services). Not
   * GST-registered (confirmed 5 Nov 2026).
   */
  registrations: [{ label: "Udyam (MSME)", value: "UDYAM-TN-02-0517785" }] as {
    label: string;
    value: string;
  }[],

  /** As printed on the Udyam registration certificate; used in the legal pages. */
  registeredAddress:
    "22, C-1, Ganapathy Rao Nagar, Papermills Road, Kolathur, Chennai, Tamil Nadu – 600099",

  /** Academy fees (client, 5 Nov 2026). */
  payment: {
    methods: "Cash or UPI",
    instalments: "Instalments are accepted; the plan varies by course.",
  },

  /** e.g. "within one working day". Empty = hidden. Owner to confirm. */
  responseTime: "" as string,

  academy: {
    offerings: [
      "Fellowship programs",
      "Certification programs",
      "Short-term clinical training",
      "Workshops",
      "Continuing Medical Education (CME)",
    ],
    /** From the fellowship brochure's "Important note". */
    certificateStatement: {
      value:
        "Fellowship certificates are awarded on successful completion of the prescribed program requirements. Completion of a professional training program does not, by itself, confer a statutory licence, specialist registration, or additional legal scope of practice.",
      verified: true,
    } satisfies Verified<string>,
    /** Client wording ("Why Vision Doctor Academy?"). */
    why: [
      "At The Vision Doctor Academy, we believe that clinical excellence comes from continuous learning, practical exposure, and a commitment to patient-centred care.",
      "Our goal is to empower optometrists with the knowledge, clinical perspective, and professional confidence needed to deliver responsible, evidence-informed eye care.",
    ],
    motto: "Learn. Practice. Advance.",
    tagline: "Advancing Clinical Knowledge. Empowering Optometrists.",
  },

  care: {
    offerings: ["Home eye consultations", "Screening services", "Super-speciality eye care"],
    /** Client wording ("Our Services" › Super-Speciality Eye Care Services). */
    superSpeciality:
      "Access to specialised eye care services in areas such as binocular vision and vision therapy, specialty contact lenses, myopia management, and other advanced vision care needs through professional clinical networks.",
  },

  emergencyNote:
    "For sudden loss of vision, eye injury or a chemical splash, go to the nearest hospital emergency department immediately. We do not provide emergency care.",

  notWalkIn:
    "Every visit is by appointment, so we can give you our full attention. We don't provide emergency care.",
} as const;

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);
