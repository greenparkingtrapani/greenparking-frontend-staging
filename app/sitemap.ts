import type { MetadataRoute } from "next";
import { locales, siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    changeFrequency: "weekly",
    priority: locale === "en" ? 1 : 0.9,
  }));
}
