import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";
import { showDrafts } from "@/lib/drafts";

export default function robots(): MetadataRoute.Robots {
  if (showDrafts) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/thank-you/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
