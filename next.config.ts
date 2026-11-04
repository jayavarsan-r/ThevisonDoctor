import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // Lets a preview build (NEXT_PUBLIC_SHOW_DRAFTS=true) live beside the production build locally.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Certifications were renamed (CODES, CRDI) in Nov 2026.
  async redirects() {
    return [
      {
        source:
          "/academy/programs/certification-advanced-clinical-examination-ocular-disease-screening",
        destination:
          "/academy/programs/certification-clinical-ocular-diagnostics-examination-skills",
        permanent: true,
      },
      {
        source: "/academy/programs/certification-retinal-imaging-diagnostics",
        destination: "/academy/programs/certification-retinal-diagnostics-imaging",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
