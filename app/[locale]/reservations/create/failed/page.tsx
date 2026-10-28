import { getSeoCopy } from "@/lib/site-content-server";
import type { Metadata } from "next";
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
  const t = await getSeoCopy(validLocale);

  return getUtilityMetadata(t("failedTitle"), t("failedDescription"));
}

export default function FailedReservationPage() {
  return <PaymentFailed />;
}
