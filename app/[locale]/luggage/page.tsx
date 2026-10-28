import type { Metadata } from "next";
import Link from "next/link";
import LuggageReservationForm from "@/components/luggage/LuggageReservationForm";

const words = {
  it: { title: "Deposito bagagli a Trapani", desc: "Prenota il deposito bagagli da Green Parking Trapani. Tariffe orarie in base al peso, pagamento sul posto.", back: "Torna alla home", price: "Tariffe per singolo bagaglio e per ogni ora iniziata", bands: ["Fino a 10 kg: €1/ora", "Oltre 10 e fino a 20 kg: €2/ora", "Oltre 20 kg: €3/ora"] },
  en: { title: "Luggage storage in Trapani", desc: "Request luggage storage at Green Parking Trapani. Hourly rates by weight, payment on arrival.", back: "Back to home", price: "Rates per bag, for each started hour", bands: ["Up to 10 kg: €1/hour", "Over 10 to 20 kg: €2/hour", "Over 20 kg: €3/hour"] },
  es: { title: "Consigna de equipaje en Trapani", desc: "Solicita consigna en Green Parking Trapani. Tarifa por hora según el peso, pago en el establecimiento.", back: "Volver al inicio", price: "Tarifas por equipaje y por cada hora comenzada", bands: ["Hasta 10 kg: 1 €/hora", "Más de 10 y hasta 20 kg: 2 €/hora", "Más de 20 kg: 3 €/hora"] },
};

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{ const {locale}=await params;const t=words[locale as keyof typeof words]||words.it;return {title:t.title,description:t.desc}; }

export default async function LuggagePage({params}:{params:Promise<{locale:string}>}) {
  const {locale}=await params;const t=words[locale as keyof typeof words]||words.it;
  return <main className="min-h-[80vh] bg-brand-black px-4 py-12 text-white"><div className="container mx-auto max-w-5xl"><Link href={`/${locale}`} className="text-primary underline">← {t.back}</Link><h1 className="mt-7 text-3xl font-bold md:text-5xl">{t.title}</h1><p className="mt-4 text-zinc-300">{t.desc}</p><div className="my-8 rounded-2xl border border-primary/30 p-5"><p className="font-semibold">{t.price}</p><ul className="mt-3 grid gap-2 md:grid-cols-3">{t.bands.map(band=><li className="rounded-lg bg-white/5 p-3" key={band}>{band}</li>)}</ul></div><LuggageReservationForm locale={locale}/></div></main>;
}
