import Link from "next/link";

const copy = {
  it: { title: "Deposito bagagli", subtitle: "Viaggia leggero, al resto pensiamo noi.", details: "Da €1 per bagaglio all'ora. Comunica peso, dimensioni e orari di consegna e ritiro.", status: "Richiesta soggetta a conferma · Pagamento sul posto", action: "Richiedi deposito bagagli" },
  en: { title: "Luggage storage", subtitle: "Travel light. We'll look after your bags.", details: "From €1 per bag per hour. Enter each bag's weight, dimensions and drop-off / collection times.", status: "Subject to confirmation · Pay on arrival", action: "Request luggage storage" },
  es: { title: "Consigna de equipaje", subtitle: "Viaja ligero. Cuidamos tu equipaje.", details: "Desde 1 € por equipaje y hora. Indica peso, dimensiones y horario de entrega y recogida.", status: "Sujeto a confirmación · Pago en el establecimiento", action: "Solicitar consigna" },
};

export default function LuggageSection({ locale }: { locale: string }) {
  const t = copy[locale as keyof typeof copy] || copy.it;
  return <section className="px-4 py-12" aria-labelledby="luggage-title"><div className="container mx-auto max-w-6xl rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/15 to-white/5 p-7 md:p-10">
    <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
      <div><p className="text-sm font-semibold uppercase tracking-widest text-primary">Green Parking Trapani</p><h2 id="luggage-title" className="mt-2 text-3xl font-bold text-white">🧳 {t.title}</h2><p className="mt-3 text-lg text-white">{t.subtitle}</p><p className="mt-2 max-w-2xl text-zinc-300">{t.details}</p><p className="mt-3 text-sm text-primary">{t.status}</p></div>
      <Link href={`/${locale}/luggage`} className="shrink-0 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:brightness-110">{t.action}</Link>
    </div>
  </div></section>;
}
