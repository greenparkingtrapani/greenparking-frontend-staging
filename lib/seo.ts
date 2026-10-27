import type { Metadata } from "next";

export const siteUrl = "https://greenparkingtrapani.it";
export const locales = ["en", "it", "es"] as const;

const openGraphLocales = {
  en: "en_US",
  it: "it_IT",
  es: "es_ES",
} as const;

function getLocalizedMetadata(
  locale: (typeof locales)[number],
  path: string,
  title: string,
  description: string,
): Metadata {
  const url = `${siteUrl}/${locale}${path}`;
  const languages = Object.fromEntries(
    locales.map((supportedLocale) => [
      supportedLocale,
      `${siteUrl}/${supportedLocale}${path}`,
    ]),
  );

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { ...languages, "x-default": `${siteUrl}/en${path}` },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Green Parking Trapani",
      type: "website",
      locale: openGraphLocales[locale],
    },
  };
}

export function getLandingMetadata(
  locale: (typeof locales)[number],
  title: string,
  description: string,
): Metadata {
  return getLocalizedMetadata(locale, "", title, description);
}

export function getReservationMetadata(
  locale: (typeof locales)[number],
  title: string,
  description: string,
): Metadata {
  return getLocalizedMetadata(locale, "/reservations/create", title, description);
}

export function getUtilityMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    robots: { index: false, follow: true },
  };
}
