import { Link } from "@/i18n/navigation";

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const it = locale === "it";
  const en = locale === "en";
  const copy = it ? {
    title: "Tariffe, convenzioni e servizi", subtitle: "Le nostre soluzioni per chi parte da Trapani.",
    moto: "Parcheggio moto", hour: "€1 / ora", day: "€8 / 24 ore", storage: "Rimessaggio moto", season: "Da ottobre a maggio · €50 / mese", storageNote: "Contattaci per disponibilità e condizioni del rimessaggio stagionale.",
    agreements: "Convenzioni", agreementsNote: "Per soggiorni prolungati, gruppi e convenzioni personalizzate, richiedi un preventivo.",
    bikes: "Biciclette", soon: "Prossimamente", luggage: "Deposito bagagli", luggageNote: "Servizio in preparazione: presto sarà possibile prenotare indicando peso e dimensioni.", contact: "Chiedi informazioni", reserve: "Prenota il parcheggio",
  } : en ? {
    title: "Prices, partnerships and services", subtitle: "Parking solutions for departures from Trapani.",
    moto: "Motorcycle parking", hour: "€1 / hour", day: "€8 / 24 hours", storage: "Motorcycle storage", season: "October to May · €50 / month", storageNote: "Contact us for seasonal storage availability and terms.",
    agreements: "Partnerships", agreementsNote: "Ask for a quote for extended stays, groups and partnerships.", bikes: "Bicycles", soon: "Coming soon", luggage: "Luggage storage", luggageNote: "Coming soon: reservations with luggage weight and dimensions.", contact: "Contact us", reserve: "Book parking",
  } : {
    title: "Tarifas, convenios y servicios", subtitle: "Soluciones para quienes salen de Trapani.",
    moto: "Aparcamiento de motos", hour: "1 € / hora", day: "8 € / 24 horas", storage: "Guardamotos", season: "De octubre a mayo · 50 € / mes", storageNote: "Contáctanos para disponibilidad y condiciones.",
    agreements: "Convenios", agreementsNote: "Pide un presupuesto para largas estancias, grupos y convenios.", bikes: "Bicicletas", soon: "Próximamente", luggage: "Consigna de equipaje", luggageNote: "Próximamente: reservas indicando peso y dimensiones.", contact: "Contacta", reserve: "Reservar aparcamiento",
  };

  const cards = [
    { title: copy.moto, lines: [copy.hour, copy.day] },
    { title: copy.storage, lines: [copy.season, copy.storageNote] },
    { title: copy.agreements, lines: [copy.agreementsNote] },
    { title: copy.bikes, lines: [copy.soon] },
    { title: copy.luggage, lines: [copy.luggageNote] },
  ];
  return <section className="min-h-[70vh] bg-brand-black px-4 py-16 text-brand-black-foreground">
    <div className="container mx-auto max-w-5xl">
      <h1 className="text-3xl font-bold md:text-5xl">{copy.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{copy.subtitle}</p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {cards.map((card) => <article key={card.title} className="rounded-2xl border border-primary/30 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-primary">{card.title}</h2>
          {card.lines.map((line) => <p className="mt-2" key={line}>{line}</p>)}
        </article>)}
      </div>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground" href="/reservations/create">{copy.reserve}</Link>
        <Link className="rounded-lg border border-primary px-6 py-3" href="/#contact">{copy.contact}</Link>
      </div>
    </div>
  </section>;
}
