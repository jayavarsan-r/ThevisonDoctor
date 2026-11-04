import { todayInIndia } from "./format";

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O, 1/I/L

export type EnquiryKind = "academy" | "care";

/** e.g. TVD-A-261013-K7QM (A = Academy, C = Care). */
export function makeEnquiryRef(kind: EnquiryKind, now = new Date()) {
  const date = todayInIndia(now).replace(/-/g, "").slice(2);
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `TVD-${kind === "academy" ? "A" : "C"}-${date}-${suffix}`;
}

export const ENQUIRY_REF_PATTERN = /^TVD-[AC]-\d{6}-[A-Z2-9]{4}$/;
