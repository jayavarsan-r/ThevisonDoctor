/**
 * Consent-guarded analytics (GA4 or Plausible).
 *
 * - Nothing is sent until the visitor accepts analytics.
 * - Personal or health data is never sent: params are limited to short,
 *   non-identifying values and any key that could carry PII is dropped.
 */

export type AnalyticsEvent =
  | "path_select"
  | "filter_change"
  | "compare_open"
  | "program_view"
  | "service_view"
  | "enquiry_start"
  | "enquiry_submit"
  | "enquiry_error"
  | "generate_lead"
  | "whatsapp_click"
  | "phone_click"
  | "email_click"
  | "pincode_check";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    plausible?: ((event: string, options?: { props?: Params }) => void) & { q?: unknown[] };
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
export const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "";
export const analyticsConfigured = Boolean(GA_ID || PLAUSIBLE_DOMAIN);

const CONSENT_KEY = "tvd_consent";
export const CONSENT_EVENT = "tvd:consent";
export type Consent = "granted" | "denied" | null;

/** Fallback when storage is unavailable (private mode): consent lasts for this page view. */
let sessionConsent: Consent = null;

export function getConsent(): Consent {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : sessionConsent;
  } catch {
    return sessionConsent;
  }
}

export function setConsent(value: Exclude<Consent, null>) {
  sessionConsent = value;
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Storage unavailable — sessionConsent covers this page view.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

const PII_KEY =
  /name|phone|mobile|email|mail|message|area|pincode|address|organisation|qualification/i;

function sanitize(params: Params = {}): Params {
  const out: Params = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || PII_KEY.test(key)) continue;
    out[key] = typeof value === "string" ? value.slice(0, 80) : value;
  }
  return out;
}

export function track(event: AnalyticsEvent, params?: Params) {
  if (typeof window === "undefined") return;
  const consent = getConsent();
  const safe = sanitize(params);
  if (process.env.NODE_ENV !== "production") {
    console.debug("[track]", event, safe, consent === "granted" ? "" : "(not sent: no consent)");
  }
  if (consent !== "granted") return;
  window.gtag?.("event", event, safe);
  window.plausible?.(event, { props: safe });
}
