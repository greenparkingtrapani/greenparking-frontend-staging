import type { MetadataRoute } from "next";
import { locales, siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: locales.map((locale) => `/${locale}`),
      disallow: locales.flatMap((locale) => [
        `/${locale}/admin`,
        `/${locale}/reservations/manage`,
        `/${locale}/reservations/create/failed`,
      ]),
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
