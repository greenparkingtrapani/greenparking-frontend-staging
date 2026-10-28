import "server-only";
import { getTranslations } from "next-intl/server";

export async function getSeoCopy(locale: string): Promise<(key: string) => string> {
  const t = await getTranslations({ locale, namespace: "SEO" });
  let fields: Record<string, string> = {};
  const api = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (api) {
    try {
      const response = await fetch(`${api}/api/site-content?language=${encodeURIComponent(locale)}&section=SEO`, {
        cache: "no-store", signal: AbortSignal.timeout(5000),
      });
      if (response.ok) fields = (await response.json()).fields || {};
    } catch { /* Existing translations remain available if the CMS is unreachable. */ }
  }
  return key => fields[`SEO.${key}`] ?? fields[key] ?? t(key);
}
