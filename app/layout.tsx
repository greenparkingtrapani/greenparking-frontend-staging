import type { Metadata } from "next";
import "@/app/globals.css";
import { TanstackProvider } from "@/components/tanstack/tanstack-provider";
import { getLocale } from "next-intl/server";

export const metadata: Metadata = {
  metadataBase: new URL("https://greenparkingtrapani.it"),
  title: "Green Parking Trapani",
  description: "Reserve secure parking in Trapani, near the port and Egadi Islands ferries.",
  verification: {
    google: "89o6zMazmY9eSsrVhUYdlTuCmAetLG4AzwOxp-0tY4U",
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        href: "/favicon.ico",
      }
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning className={`dark antialiased`}>
      <body className="flex flex-col min-h-screen ">
        <TanstackProvider>{children}</TanstackProvider>
      </body>
    </html>
  );
}
