import { clinician } from "@/content/clinician";
import { site } from "@/content/site";

export type WhatsAppContext =
  "general" | "academy" | "program" | "workshop" | "care" | "service" | "clinician" | "enquiry";

/** Pre-filled messages. Short, polite, and never include personal data. */
export const whatsappMessages: Record<WhatsAppContext, (subject?: string) => string> = {
  general: () => `Hi, I have a question for ${site.shortName}.`,
  academy: () => `Hi, I'd like to know about the Academy's programs at ${site.shortName}.`,
  program: (name) =>
    name
      ? `Hi, I'd like to know more about "${name}" at ${site.shortName} Academy.`
      : `Hi, I'd like to know about the Academy's programs at ${site.shortName}.`,
  workshop: () => `Hi, please let me know when the next workshop or CME date is announced.`,
  care: () => `Hi, I'd like to book an eye appointment with ${site.shortName}.`,
  service: (name) =>
    name
      ? `Hi, I'd like to book an appointment for ${name.toLowerCase()}.`
      : `Hi, I'd like to book an eye appointment with ${site.shortName}.`,
  clinician: () => `Hi, I have a question for ${clinician.displayName}.`,
  enquiry: (subject) => `Hi, I sent enquiry ${subject ?? ""}.`.replace(/\s+\./, "."),
};

/**
 * Build a wa.me link with a pre-filled message.
 * Pass `text` to override the template entirely.
 */
export function buildWhatsAppLink(context: WhatsAppContext, text?: string, subject?: string) {
  const message = text ?? whatsappMessages[context](subject);
  return `${site.whatsappBase}?text=${encodeURIComponent(message)}`;
}

export const telLink = `tel:${site.phone.e164}`;
export const mailLink = `mailto:${site.email}`;
