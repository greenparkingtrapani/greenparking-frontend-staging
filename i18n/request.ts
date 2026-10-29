import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

// All public translations are resolved from the SAME backend database that the
// dashboard editor writes. A saving operation never requires a new deployment.
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const bundled = (await import(`../messages/${locale}.json`)).default;
  const messages = JSON.parse(JSON.stringify(bundled)) as typeof bundled;
  const api = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (api) {
    try {
      const response = await fetch(
        `${api}/api/site-content/all?language=${encodeURIComponent(locale)}`,
        { cache: "no-store", signal: AbortSignal.timeout(4000) }
      );
      if (response.ok) {
        const payload = (await response.json()) as { fields?: Record<string, unknown> };
        for (const [path, value] of Object.entries(payload.fields || {})) {
          if (typeof value !== "string") continue;
          const parts = path.split(".");
          if (parts.some(part => !part || ["__proto__", "constructor", "prototype"].includes(part))) continue;
          let node = messages as unknown as Record<string, unknown>;
          for (const part of parts.slice(0, -1)) {
            const next = node[part];
            if (!next || typeof next !== "object" || Array.isArray(next)) {
              node = {};
              break;
            }
            node = next as Record<string, unknown>;
          }
          const leaf = parts[parts.length - 1];
          // Only known translated text fields may be replaced by CMS values.
          if (typeof node[leaf] === "string") node[leaf] = value;
        }
      }
    } catch {
      // If the CMS is unavailable, the original bundled translations are safe.
    }
  }
  return { locale, messages };
});
