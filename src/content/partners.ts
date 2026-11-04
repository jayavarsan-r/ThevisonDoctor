/**
 * Brand collaborations shown in the homepage logo strip.
 *
 * Logos were supplied by the client over WhatsApp (Oct 2026; VV Vision Clinic
 * in Nov 2026) and cleaned up
 * for a white background (transparent PNG, trimmed). `width` and `height` are
 * the file's pixel size; the strip scales every logo to a similar visual
 * weight, so wide and compact marks look balanced.
 *
 * To add a partner: put a transparent PNG or SVG in /public/images/partners/
 * and add an entry below. Order here is the order in the strip.
 */
export type Partner = {
  id: string;
  /** Used as the logo's alt text. */
  name: string;
  logo: { src: string; width: number; height: number };
};

export const partners: Partner[] = [
  {
    id: "aradhana-eye-care-hospital",
    name: "Aradhana Eye Care Hospital",
    logo: { src: "/images/partners/aradhana-eye-care-hospital.png", width: 660, height: 144 },
  },
  {
    id: "menicon",
    name: "Menicon",
    logo: { src: "/images/partners/menicon.png", width: 323, height: 61 },
  },
  {
    id: "curesee",
    name: "CureSee",
    logo: { src: "/images/partners/curesee.png", width: 463, height: 122 },
  },
  {
    id: "acuitiz",
    name: "Acuitiz",
    logo: { src: "/images/partners/acuitiz.png", width: 500, height: 130 },
  },
  {
    id: "vv-vision-clinic",
    name: "VV Vision Clinic",
    logo: { src: "/images/partners/vv-vision-clinic.png", width: 432, height: 144 },
  },
  {
    id: "iworld-optometry",
    name: "iWorld Optometry Clinic & Opticals",
    logo: { src: "/images/partners/iworld-optometry.png", width: 365, height: 144 },
  },
];
