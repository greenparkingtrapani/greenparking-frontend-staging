import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AboutSection from '@/components/landing/AboutSection';
import HeroSection from '@/components/landing/HeroSection';
import ContactSection from '@/components/landing/ContactSection';
import PricingSection from '@/components/landing/PricingSection';
import { getLandingMetadata, locales } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locales.includes(locale as (typeof locales)[number])
    ? (locale as (typeof locales)[number])
    : "en";
  const t = await getTranslations({ locale: validLocale, namespace: "SEO" });

  return getLandingMetadata(validLocale, t("title"), t("description"));
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = locales.includes(locale as (typeof locales)[number])
    ? (locale as (typeof locales)[number])
    : "en";
  const t = await getTranslations({ locale: validLocale });
  const contact = (key: string) => t(`ContactSection.${key}`);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    additionalType: "https://schema.org/ParkingFacility",
    name: "Green Parking Trapani",
    url: `https://greenparkingtrapani.it/${validLocale}`,
    description: t("AboutSection.description"),
    telephone: contact("phoneValue"),
    email: contact("emailValue"),
    address: {
      "@type": "PostalAddress",
      streetAddress: contact("addressLine1"),
      addressLocality: "Trapani",
      postalCode: "91100",
      addressCountry: "IT",
    },
    sameAs: [contact("facebookUrl"), contact("instagramUrl")],
    hasMap: contact("mapUrl"),
  };

  return (
    <div className="bg-gradient-to-b from-brand-black to-brand-black/90">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <HeroSection />
      <AboutSection />
      <PricingSection />
      <ContactSection />
    </div>
  );
}