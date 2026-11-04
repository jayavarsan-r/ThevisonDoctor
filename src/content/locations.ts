import type { ConsultationLocation } from "./types";

/**
 * Where appointments happen (BUILD_PROMPT §7.5.4).
 *
 * Consultation locations, the home-visit service area, days and hours are
 * not confirmed. While these lists are empty the site shows the default
 * sentence and hides the pincode checker. The office is never listed here.
 */
export const locations = {
  consultationLocations: [] as ConsultationLocation[],
  /** Six-digit Chennai pincodes covered by home visits, e.g. "600099". */
  homeVisitPincodes: [] as string[],
  defaultWhereWhen:
    "Appointments take place at confirmed locations in Chennai or at your home. We'll confirm the exact place when we call.",
};
