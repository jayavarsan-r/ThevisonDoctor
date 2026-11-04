/** Shared navigation data for the header menu, mobile sheet and footer. */

export type { NavLink } from "@/lib/content";

/** Routes whose first section is a dark navy hero — the header starts transparent. */
export const DARK_HERO_ROUTES = ["/", "/academy"];

export type NavService = {
  slug: string;
  title: string;
  short: string;
  icon: import("@/content/types").ServiceIcon;
};
export type NavFeatured = { slug: string; title: string; start: string } | null;
