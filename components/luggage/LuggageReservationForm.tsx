"use client";

import { useState, type FormEvent } from "react";

type Bag = { weight_kg: string; length_cm: string; width_cm: string; height_cm: string };
const emptyBag = (): Bag => ({ weight_kg: "", length_cm: "", width_cm: "", height_cm: "" });

const copy = {
  it: { heading: "Richiedi il deposito bagagli", intro: "Pagamento sul posto. La richiesta sarà confermata dal personale dopo la verifica della disponibilità.", name: "Nome e cognome", email: "Email", phone: "Telefono", origin: "Provenienza (facoltativa)", from: "Consegna prevista", to: "Ritiro previsto", bag: "Bagaglio", weight: "Peso (kg)", length: "Lunghezza (cm)", width: "Larghezza (cm)", height: "Altezza (cm)", add: "Aggiungi un bagaglio", remove: "Rimuovi", notes: "Note (facoltative)", hours: "Ore conteggiate", total: "Importo indicativo", send: "Invia richiesta", sending: "Invio in corso…", success: "Richiesta ricevuta! Codice", pending: "In attesa di conferma. Conserva il codice e attendi il contatto del personale.", error: "Impossibile salvare la richiesta. Riprova o contattaci.", past: "La data di consegna è già passata. Seleziona una data futura.", range: "Il ritiro deve essere successivo alla consegna, entro 30 giorni." },
  en: { heading: "Request luggage storage", intro: "Pay on arrival. Staff will confirm your request after checking availability.", name: "Full name", email: "Email", phone: "Phone", origin: "Where are you travelling from? (optional)", from: "Expected drop-off", to: "Expected collection", bag: "Bag", weight: "Weight (kg)", length: "Length (cm)", width: "Width (cm)", height: "Height (cm)", add: "Add another bag", remove: "Remove", notes: "Notes (optional)", hours: "Charged hours", total: "Estimated amount", send: "Send request", sending: "Sending…", success: "Request received! Reference", pending: "Awaiting confirmation. Keep your reference and wait for our team to contact you.", error: "Could not save your request. Please retry or contact us.", past: "The drop-off date is in the past. Choose a future date.", range: "Collection must be after drop-off and within 30 days." },
  es: { heading: "Solicitar consigna de equipaje", intro: "Pago en el establecimiento. Nuestro personal confirmará la solicitud tras verificar la disponibilidad.", name: "Nombre y apellidos", email: "Correo electrónico", phone: "Teléfono", origin: "Procedencia (opcional)", from: "Entrega prevista", to: "Recogida prevista", bag: "Equipaje", weight: "Peso (kg)", length: "Largo (cm)", width: "Ancho (cm)", height: "Alto (cm)", add: "Añadir equipaje", remove: "Eliminar", notes: "Notas (opcional)", hours: "Horas facturadas", total: "Importe estimado", send: "Enviar solicitud", sending: "Enviando…", success: "¡Solicitud recibida! Código", pending: "Pendiente de confirmación. Guarda el código y espera el contacto del personal.", error: "No se pudo guardar la solicitud. Inténtalo de nuevo o contáctanos.", past: "La fecha de entrega ya pasó. Elige una fecha futura.", range: "La recogida debe ser posterior a la entrega, dentro de 30 días." },
};

export default function LuggageReservationForm({ locale }: { locale: string }) {
  const t = copy[locale as keyof typeof copy] || copy.it;
  const [bags, setBags] = useState<Bag[]>([emptyBag()]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", origin: "", dropoff_at: "", pickup_at: "", notes: "" });
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const start = new Date(form.dropoff_at).getTime();
  const end = new Date(form.pickup_at).getTime();
  const minDateTime = new Date(now - new Date(now).getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const pastDate = Number.isFinite(start) && start < now - 60000;
  const invalidRange = Number.isFinite(start) && Number.isFinite(end) && (end <= start || end - start > 30 * 24 * 3600000);
  const validTime = Number.isFinite(start) && Number.isFinite(end) && !pastDate && !invalidRange;
  const hours = validTime ? Math.ceil((end - start) / 3600000) : 0;
  const hourlyCents = bags.reduce((sum, bag) => { const kg = Number(bag.weight_kg); return sum + (!kg || kg <= 0 ? 0 : kg <= 10 ? 100 : kg <= 20 ? 200 : 300); }, 0);
  const quote = new Intl.NumberFormat(locale === "en" ? "en-IE" : locale === "es" ? "es-ES" : "it-IT", { style: "currency", currency: "EUR" }).format((hourlyCents * hours) / 100);
  const updateBag = (i: number, field: keyof Bag, value: string) => setBags(current => current.map((bag, index) => index === i ? { ...bag, [field]: value } : bag));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (start < Date.now() - 60000) { setError(t.past); return; }
    if (!validTime || busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/luggage-requests`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, dropoff_at: new Date(start).toISOString(), pickup_at: new Date(end).toISOString(), bags: bags.map(b => ({ weight_kg: Number(b.weight_kg), length_cm: Number(b.length_cm), width_cm: Number(b.width_cm), height_cm: Number(b.height_cm) })) }) });
      if (!response.ok) {
        const message = await response.text();
        if (response.status === 400 && message.includes("Dropoff time is in the past")) throw new Error(t.past);
        if (response.status === 400 && message.includes("invalid time range")) throw new Error(t.range);
        throw new Error(t.error);
      }
      const result: { code?: string } = await response.json(); if (!result.code) throw new Error("Missing reference");
      setCode(result.code);
    } catch (err) { setError(err instanceof Error ? err.message : t.error); } finally { setBusy(false); }
  }

  return <section className="rounded-2xl border border-primary/40 bg-white/5 p-5 md:p-8">
    <h2 className="text-2xl font-bold text-primary">{t.heading}</h2>
    <p className="mt-3 text-sm text-zinc-300">{t.intro}</p>
    {code ? <div role="status" className="mt-6 rounded-xl border border-primary bg-primary/10 p-5"><p className="font-bold">{t.success}: {code}</p><p className="mt-2">{t.pending}</p></div> : <form onSubmit={submit} className="mt-6 space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        {(["name", "email", "phone", "origin"] as const).map(field => <label key={field} className="block text-sm">{t[field]}<input className="mt-2 w-full rounded-lg border border-white/25 bg-black/40 p-3 text-white" type={field === "email" ? "email" : field === "phone" ? "tel" : "text"} required={field !== "origin"} maxLength={field === "email" ? 254 : 120} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}/></label>)}
        {(["dropoff_at", "pickup_at"] as const).map(field => <label key={field} className="block text-sm">{field === "dropoff_at" ? t.from : t.to}<input className="mt-2 w-full rounded-lg border border-white/25 bg-black/40 p-3 text-white" type="datetime-local" required min={field === "pickup_at" && form.dropoff_at > minDateTime ? form.dropoff_at : minDateTime} value={form[field]} onChange={e => { setNow(Date.now()); setForm({ ...form, [field]: e.target.value }); }}/></label>)}
      </div>
      {bags.map((bag, i) => <fieldset key={i} className="rounded-xl border border-white/25 p-4"><legend className="px-2 font-semibold">{t.bag} {i + 1}</legend><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{(["weight_kg", "length_cm", "width_cm", "height_cm"] as const).map(field => <label key={field} className="text-sm">{field === "weight_kg" ? t.weight : field === "length_cm" ? t.length : field === "width_cm" ? t.width : t.height}<input className="mt-2 w-full rounded-lg border border-white/25 bg-black/40 p-3 text-white" type="number" min="0.1" max={field === "weight_kg" ? 100 : 300} step="0.1" required value={bag[field]} onChange={e => updateBag(i, field, e.target.value)}/></label>)}</div>{bags.length > 1 && <button className="mt-3 text-sm text-red-300 underline" type="button" onClick={() => setBags(current => current.filter((_, index) => index !== i))}>{t.remove}</button>}</fieldset>)}
      {bags.length < 10 && <button type="button" className="rounded-lg border border-primary px-4 py-2 text-primary" onClick={() => setBags(current => [...current, emptyBag()])}>+ {t.add}</button>}
      <label className="block text-sm">{t.notes}<textarea maxLength={1000} rows={3} className="mt-2 w-full rounded-lg border border-white/25 bg-black/40 p-3 text-white" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}/></label>
      <div className="rounded-xl bg-primary/10 p-4"><p>{t.hours}: <strong>{hours || "—"}</strong></p><p className="mt-2 text-xl">{t.total}: <strong>{quote}</strong></p></div>
      {(pastDate || invalidRange || error) && <p role="alert" className="text-red-300">{pastDate ? t.past : invalidRange ? t.range : error}</p>}
      <button disabled={busy || !validTime} className="rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground disabled:opacity-50" type="submit">{busy ? t.sending : t.send}</button>
    </form>}
  </section>;
}
