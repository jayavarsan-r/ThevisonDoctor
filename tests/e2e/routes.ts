/** Public routes covered by smoke and accessibility tests. */
export const ROUTES = [
  "/",
  "/academy",
  "/academy/workshops",
  "/academy/programs/fellowship-advanced-clinical-optometry",
  "/academy/programs/certification-clinical-ocular-diagnostics-examination-skills",
  "/academy/programs/certification-retinal-diagnostics-imaging",
  "/academy/enquire",
  "/eye-care",
  "/eye-care/home-eye-consultation",
  "/eye-care/eye-screening",
  "/eye-care/myopia-management",
  "/eye-care/vision-therapy",
  "/eye-care/specialty-contact-lenses",
  "/eye-care/comprehensive-eye-examination",
  "/about",
  "/blog",
  "/blog/myopia-control-children-symptoms-management",
  "/blog/squint-strabismus-signs-causes-treatment",
  "/blog/glaucoma-symptoms-early-detection",
  "/blog/colour-blindness-color-vision-deficiency",
  "/contact",
  "/thank-you/academy?ref=TVD-A-261013-ABCD",
  "/thank-you/eye-care?ref=TVD-C-261013-ABCD&service=eye-screening",
  "/privacy",
  "/terms",
  "/refund-policy",
  "/medical-disclaimer",
  "/accessibility",
];

/** A random client address so API tests never share a rate-limit bucket. */
export const randomIp = () =>
  `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
