import { getSeoCopy } from "@/lib/site-content-server";
import type { Metadata } from "next";
import CreateReservation from '@/components/reservations/create/CreateReservation';
import { getReservationMetadata, locales } from "@/lib/seo";

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

  return getReservationMetadata(
    validLocale,
    t("reservationTitle"),
    t("reservationDescription"),
  );
}

export default function CreateReservationPage() {
  return <CreateReservation />;
}