import { getSeoCopy } from "@/lib/site-content-server";
import type { Metadata } from "next";
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

  return getUtilityMetadata(t("adminTitle"), t("adminDescription"));
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
