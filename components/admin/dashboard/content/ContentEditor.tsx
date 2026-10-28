"use client";

import { useEffect, useMemo, useState } from "react";
import it from "@/messages/it.json";
import en from "@/messages/en.json";
import es from "@/messages/es.json";

type Lang = "it" | "en" | "es";
type Content = Record<string, unknown>;
const originals: Record<Lang, Content> = { it, en, es };
const sections = ["Header", "HeroSection", "AboutSection", "PricingSection", "ContactSection", "Footer", "SEO"];
const storageKey = "greenparking-cms-draft-v1";

function flatten(value: unknown, prefix = ""): Record<string, string> {
  if (typeof value === "string") return { [prefix]: value };
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.entries(value).reduce<Record<string, string>>((all, [key, item]) => {
    Object.assign(all, flatten(item, prefix ? `${prefix}.${key}` : key));
    return all;
  }, {});
}
function setPath(obj: Content, path: string, value: string) {
  const parts = path.split("."); let current: Content = obj;
  for (const part of parts.slice(0, -1)) {
    if (!current[part] || typeof current[part] !== "object") current[part] = {};
    current = current[part] as Content;
  }
  current[parts[parts.length - 1]] = value;
}
function copy<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }

export default function ContentEditor() {
  const [lang, setLang] = useState<Lang>("it");
  const [section, setSection] = useState("HeroSection");
  const [draft, setDraft] = useState<Record<Lang, Content>>(() => copy(originals));
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [dirty, setDirty] = useState(false);
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as Record<Lang, Content>;
        if (parsed.it && parsed.en && parsed.es) setDraft(parsed);
      }
    } catch { /* invalid draft ignored */ }
    setLoaded(true);
  }, []);
  const fields = useMemo(() => Object.entries(flatten(draft[lang][section], section)).filter(([key]) => key.toLowerCase().includes(search.toLowerCase())), [draft, lang, section, search]);
  const update = (key: string, value: string) => {
    setDraft(old => {
      const next = copy(old);
      setPath(next[lang], key, value);
      return next;
    });
    setDirty(true);
  };
  const saveDraft = () => { localStorage.setItem(storageKey, JSON.stringify(draft)); alert("Bozza salvata su questo browser. Il sito pubblico non è stato modificato."); };
  const loadDatabase = async () => {
    if (dirty && !confirm("Le modifiche non salvate saranno sovrascritte. Continuare?")) return;
    setBusy(true); setStatus("");
    try {
      const response = await fetch(`${apiUrl}/api/site-content?language=${encodeURIComponent(lang)}&section=${encodeURIComponent(section)}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`Lettura non riuscita (HTTP ${response.status})`);
      const data: { fields?: Record<string, string> } = await response.json();
      const incoming = data.fields || {};
      const next = copy(draft);
      next[lang][section] = copy(originals[lang][section]);
      for (const [key, value] of Object.entries(incoming)) {
        if (key.startsWith(`${section}.`) && !key.split(".").some(part => ["__proto__", "constructor", "prototype", ""].includes(part)) && typeof value === "string") setPath(next[lang], key, value);
      }
      setDraft(next); setDirty(false);
      setStatus(Object.keys(incoming).length ? `Caricati ${Object.keys(incoming).length} campi dal database.` : "Nessun testo ancora salvato nel database per questa sezione.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Errore durante il caricamento."); }
    finally { setBusy(false); }
  };
  const saveDatabase = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) { setStatus("Sessione non trovata: effettua nuovamente il login."); return; }
    const fields = flatten(draft[lang][section], section);
    if (Object.keys(fields).length === 0) { setStatus("Nessun campo da salvare."); return; }
    setBusy(true); setStatus("");
    try {
      const response = await fetch(`${apiUrl}/admin/site-content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ language: lang, section, fields }),
      });
      if (!response.ok) throw new Error(`Salvataggio non riuscito (HTTP ${response.status})`);
      const reload = await fetch(`${apiUrl}/api/site-content?language=${encodeURIComponent(lang)}&section=${encodeURIComponent(section)}`, { cache: "no-store" });
      if (!reload.ok) throw new Error("Salvataggio inviato, ma ricaricamento dal server non riuscito.");
      const persisted: { fields?: Record<string, string> } = await reload.json();
      if (Object.entries(fields).some(([key, value]) => persisted.fields?.[key] !== value)) {
        throw new Error("Salvataggio inviato, ma i testi ricaricati non corrispondono. Ricarica dal database prima di riprovare.");
      }
      setDirty(false);
      setStatus(`Salvataggio e ricaricamento verificati: ${Object.keys(fields).length} campi nel database di questo ambiente.`);
    } catch (error) { setStatus(error instanceof Error ? error.message : "Errore durante il salvataggio."); }
    finally { setBusy(false); }
  };
  const exportDraft = () => {
    const blob = new Blob([JSON.stringify(draft[lang], null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `greenparking-${lang}-bozza.json`; a.click(); URL.revokeObjectURL(url);
  };
  const reset = () => {
    if (!confirm(`Ripristinare i testi originali in ${lang.toUpperCase()}?`)) return;
    setDraft(old => ({ ...old, [lang]: copy(originals[lang]) }));
    setDirty(true);
  };
  return <main className="p-6 max-w-5xl space-y-5">
    <div><h1 className="text-2xl font-bold">Gestione Sito Web</h1><p className="text-sm text-muted-foreground mt-1">Gestisci i testi del sito in italiano, inglese e spagnolo. Puoi conservare una bozza nel browser o salvare sul server collegato.</p></div>
    <div className="rounded-lg border border-amber-500/50 p-3 text-sm">Attenzione: “Salva nel database” modifica i testi nell’ambiente a cui questa pagina è collegata. Verifica se stai operando su staging o sul sito ufficiale prima di confermare.</div>
    <div className="flex flex-wrap gap-3 items-center">
      <label htmlFor="cms-lang">Lingua</label><select disabled={busy} id="cms-lang" className="bg-background border rounded p-2" value={lang} onChange={e => setLang(e.target.value as Lang)}><option value="it">Italiano</option><option value="en">English</option><option value="es">Español</option></select>
      <label htmlFor="cms-section">Sezione</label><select disabled={busy} id="cms-section" className="bg-background border rounded p-2" value={section} onChange={e => setSection(e.target.value)}>{sections.map(x => <option key={x} value={x}>{x}</option>)}</select>
      <input aria-label="Cerca un campo" placeholder="Cerca campo..." className="bg-background border rounded p-2" value={search} onChange={e => setSearch(e.target.value)}/>
    </div>
    <div className="space-y-4">{fields.map(([key, value]) => <label className="block space-y-1" key={key}><span className="text-sm font-semibold">{key}</span><textarea disabled={busy} rows={Math.min(6, Math.max(2, Math.ceil(value.length / 85)))} className="w-full rounded border bg-background p-3 text-sm" value={value} onChange={e => update(key, e.target.value)}/></label>)}{fields.length === 0 && <p>Nessun campo trovato.</p>}</div>
    {status && <p role="status" className="text-sm rounded border p-3">{status}</p>}
    {dirty && <p className="text-sm">Modifiche non ancora salvate nel database.</p>}
    <div className="flex flex-wrap gap-2"><button disabled={!loaded} className="bg-primary text-primary-foreground rounded px-4 py-2 disabled:opacity-50" onClick={saveDraft}>Salva bozza locale</button><button disabled={busy || !loaded} className="border rounded px-4 py-2 disabled:opacity-50" onClick={loadDatabase}>Carica dal database</button><button disabled={busy || !loaded} className="bg-primary text-primary-foreground rounded px-4 py-2 disabled:opacity-50" onClick={saveDatabase}>{busy ? "Attendere..." : "Salva nel database"}</button><button className="border rounded px-4 py-2" onClick={exportDraft}>Esporta JSON</button><button disabled={busy} className="border rounded px-4 py-2" onClick={reset}>Ripristina lingua</button></div>
  </main>;
}
