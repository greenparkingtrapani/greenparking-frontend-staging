"use client";

import { useEffect, useState } from "react";

type Row = { code: string; name: string; email: string; phone: string; origin: string; dropoff_at: string; pickup_at: string; bags: Array<{ weight_kg: number; length_cm: number; width_cm: number; height_cm: number }>; notes: string; status: string; quoted_total_eur: number; paid_eur: number; payment_method: string };

const api = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

export default function LuggageAdmin() {
  const [items,setItems]=useState<Row[]>([]);
  const [status,setStatus]=useState("");
  const [busy,setBusy]=useState("");
  const [payments,setPayments]=useState<Record<string,string>>({});
  const [methods,setMethods]=useState<Record<string,string>>({});
  async function load() {
    const token=localStorage.getItem("admin_token");if(!token){setStatus("Accedi come amministratore.");return;}
    try {const response=await fetch(`${api}/admin/luggage`,{headers:{Authorization:`Bearer ${token}`},cache:"no-store"});if(!response.ok)throw new Error(`Errore HTTP ${response.status}`);setItems(await response.json());setStatus("");}
    catch(e){setStatus(e instanceof Error?e.message:"Errore di caricamento");}
  }
  useEffect(()=>{queueMicrotask(()=>{void load();});},[]);
  async function update(code:string,nextStatus:string) {
    if(nextStatus==="deleted"&&!confirm(`Nascondere la richiesta ${code} dall'elenco?`))return;
    const amount=Number(payments[code]||0);if(!Number.isFinite(amount)||amount<0){setStatus("Importo non valido.");return;}
    setBusy(code);
    try {const token=localStorage.getItem("admin_token");const response=await fetch(`${api}/admin/luggage/${encodeURIComponent(code)}`,{method:"PATCH",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({status:nextStatus,payment_cents:Math.round(amount*100),payment_method:methods[code]||""})});if(!response.ok)throw new Error(`Errore HTTP ${response.status}`);setPayments(old=>({...old,[code]:""}));await load();}
    catch(e){setStatus(e instanceof Error?e.message:"Aggiornamento non riuscito");}finally{setBusy("");}
  }
  return <div className="space-y-5 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold">Deposito bagagli</h1><p className="text-sm text-muted-foreground">Richieste, consegne, ritiri e pagamenti sul posto.</p></div><button onClick={()=>void load()} className="rounded-lg border px-4 py-2">Aggiorna</button></div>{status&&<p role="alert" className="text-red-400">{status}</p>}
    <div className="grid gap-4">{items.map(item=><article key={item.code} className="rounded-xl border p-4"><div className="flex flex-wrap justify-between gap-2"><div><strong>{item.name}</strong><p className="text-sm">{item.code} · {item.status}</p><p className="text-sm">{item.phone} · {item.email}</p><p className="text-sm">{item.origin}</p></div><div className="text-sm"><p>Consegna: {new Date(item.dropoff_at).toLocaleString("it-IT")}</p><p>Ritiro: {new Date(item.pickup_at).toLocaleString("it-IT")}</p><p>Totale stimato: €{item.quoted_total_eur.toFixed(2)} · Pagato: €{item.paid_eur.toFixed(2)}</p></div></div><ul className="mt-3 text-sm">{item.bags.map((bag,i)=><li key={i}>Bagaglio {i+1}: {bag.weight_kg} kg · {bag.length_cm} × {bag.width_cm} × {bag.height_cm} cm</li>)}</ul>{item.notes&&<p className="mt-2 text-sm">Note: {item.notes}</p>}
      <div className="mt-4 flex flex-wrap items-end gap-3"><label className="text-sm">Incasso aggiuntivo (€)<input aria-label={`Incasso ${item.code}`} type="number" min="0" step="0.01" value={payments[item.code]||""} onChange={e=>setPayments(old=>({...old,[item.code]:e.target.value}))} className="mt-1 block w-28 rounded-lg border bg-transparent p-2"/></label><label className="text-sm">Metodo<select className="mt-1 block rounded-lg border bg-background p-2" value={methods[item.code]||""} onChange={e=>setMethods(old=>({...old,[item.code]:e.target.value}))}><option value="">Non indicato</option><option value="cash">Contanti</option><option value="card">Carta</option><option value="other">Altro</option></select></label><label className="text-sm">Stato<select aria-label={`Stato ${item.code}`} className="mt-1 block rounded-lg border bg-background p-2" defaultValue={item.status} key={item.code+item.status} id={`state-${item.code}`}><option value="pending">In attesa</option><option value="confirmed">Confermato</option><option value="received">Depositato</option><option value="collected">Ritirato</option><option value="cancelled">Annullato</option><option value="deleted">Elimina dall&apos;elenco</option></select></label><button disabled={busy===item.code} className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-50" onClick={()=>{const el=document.getElementById(`state-${item.code}`) as HTMLSelectElement|null;void update(item.code,el?.value||item.status)}}>Salva</button></div>
    </article>)}{!items.length&&!status&&<p>Nessuna richiesta presente.</p>}</div></div>;
}
