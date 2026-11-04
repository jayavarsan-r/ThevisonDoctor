import type { MetadataRoute } from "next";
import { legal } from "@/content/legal";
import { siteUrl } from "@/content/site";
import { getPosts, getPrograms, getServices } from "@/lib/content";
import { showDrafts } from "@/lib/drafts";

export default function sitemap(): MetadataRoute.Sitemap {
  // Preview deployments are never indexed.
  if (showDrafts) return [];

  const routes = [
    "/",
    "/academy",
    "/academy/workshops",
    "/academy/enquire",
    "/eye-care",
    "/about",
    "/contact",
  ];
  const legalRoutes = legal.reviewed
    ? ["/privacy", "/terms", "/refund-policy", "/medical-disclaimer", "/accessibility"]
    : [];

  return [
    ...routes.map((r) => ({
      url: `${siteUrl}${r}`,
      changeFrequency: "weekly" as const,
      priority: r === "/" ? 1 : 0.8,
    })),
    ...getPrograms().map((p) => ({ url: `${siteUrl}/academy/programs/${p.slug}`, priority: 0.7 })),
    ...getServices().map((s) => ({ url: `${siteUrl}/eye-care/${s.slug}`, priority: 0.7 })),
    { url: `${siteUrl}/blog`, changeFrequency: "weekly" as const, priority: 0.8 },
    ...getPosts().map((p) => ({
      url: `${siteUrl}/blog/${p.slug}`,
      lastModified: p.published,
      priority: 0.6,
    })),
    ...legalRoutes.map((r) => ({ url: `${siteUrl}${r}`, priority: 0.3 })),
  ];
}
