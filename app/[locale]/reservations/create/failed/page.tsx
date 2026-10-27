import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PaymentFailed from '@/components/reservations/failed/PaymentFailed';
import { getUtilityMetadata, locales } from "@/lib/seo";

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

  return getUtilityMetadata(t("failedTitle"), t("failedDescription"));
}

export default function FailedReservationPage() {
  return <PaymentFailed />;
}
