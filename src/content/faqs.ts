import type { Faq } from "./types";

/** Starter FAQs (BUILD_PROMPT §10). */
export const faqs: Faq[] = [
  // Learners
  {
    id: "l-who",
    audience: "learner",
    status: "published",
    homepage: true,
    q: "Who can join the Academy's programs?",
    a: "Each program lists its own eligibility on its page. If you're unsure, send an enquiry with your qualification and we'll tell you which programs fit.",
  },
  {
    id: "l-hands-on",
    audience: "learner",
    status: "published",
    homepage: true,
    q: "Is there hands-on practice?",
    a: "The practical component is described on each program page, including what you'll practise and how it's supervised.",
  },
  {
    id: "l-certificate",
    audience: "learner",
    status: "published",
    homepage: true,
    q: "What certificate will I receive, and is it accredited?",
    a: "Each program page states exactly what the certificate says and its accreditation status. We only describe a program as accredited when the accrediting body has approved it.",
  },
  {
    id: "l-full-time",
    audience: "learner",
    status: "published",
    homepage: true,
    q: "Can I attend while working full time?",
    a: "Schedules differ by program. Check the schedule on the program page, or ask us about weekend and short formats.",
  },
  {
    id: "l-fees",
    audience: "learner",
    status: "published",
    homepage: true,
    q: "How do fees and refunds work?",
    a: "Fees, what they include, payment options and refund terms are listed on each program page and in our refund policy.",
  },
  {
    id: "l-institutions",
    audience: "learner",
    status: "draft",
    q: "Do you offer training for hospitals or optical teams?",
    a: "Yes, we discuss in-house training on request. Send an enquiry and choose 'For an institution'.",
  },

  // Patients
  {
    id: "p-walk-in",
    audience: "patient",
    status: "published",
    homepage: true,
    q: "Is this a walk-in clinic?",
    a: "No. All consultations are by appointment, at confirmed locations or at your home. We'll confirm the place and time when we call.",
  },
  {
    id: "p-home-area",
    audience: "patient",
    status: "published",
    homepage: true,
    q: "Do you visit homes in my area?",
    a: "Home consultations are available in selected areas of Chennai. Tell us your area and we'll confirm.",
  },
  {
    id: "p-prepare",
    audience: "patient",
    status: "published",
    homepage: true,
    q: "What should I bring or prepare?",
    a: "Your current glasses or contact lenses, any previous eye reports and a list of your medicines. For home visits, a room where the lights can be dimmed.",
  },
  {
    id: "p-emergency",
    audience: "patient",
    status: "published",
    homepage: true,
    q: "Do you treat eye emergencies?",
    a: "No. For sudden vision loss, eye injury, a chemical splash or severe eye pain, go to the nearest hospital emergency department immediately.",
  },
  {
    id: "p-children",
    audience: "patient",
    status: "published",
    q: "Do you see children?",
    a: "Yes, including children with increasing spectacle power and children with reading or eye-strain difficulties. A parent or guardian must attend.",
  },
  {
    id: "p-cost",
    audience: "patient",
    status: "published",
    homepage: true,
    q: "How much does a consultation cost?",
    a: "We confirm the fee with you before booking.",
  },
];
