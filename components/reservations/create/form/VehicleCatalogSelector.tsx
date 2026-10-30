"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { VehicleIcon } from "./VehicleIcon";
import { vehicleCatalog, categoryLabels } from "@/lib/vehicle-catalog";

interface Props {
  vehicleTypes: { id: number; name: string }[];
  selectedType: number;
  vehicleModel: string;
  onSelect: (vehicleModel: string, vehicleTypeId: number) => void;
}

const copy = {
  it: { title: "Trova il tuo modello", hint: "Scegli marca e modello: suggeriamo automaticamente la categoria del parcheggio.", kind: "Tipo di veicolo", brand: "Marca", model: "Modello", choose: "Seleziona", other: "Altro modello / non presente", car: "Automobile", motorcycle: "Motocicletta", length: "Lunghezza indicativa", warning: "Le dimensioni variano in base all'anno e alla versione. Conferma la categoria prima di verificare la disponibilità.", noType: "Categoria non disponibile: scegli un'altra categoria dal riquadro soprastante." },
  en: { title: "Find your model", hint: "Choose make and model to suggest a parking category.", kind: "Vehicle type", brand: "Make", model: "Model", choose: "Select", other: "Other / model not listed", car: "Car", motorcycle: "Motorcycle", length: "Approximate length", warning: "Dimensions vary by model year and trim. Check your category before checking availability.", noType: "Category unavailable: select another category above." },
  es: { title: "Encuentra tu modelo", hint: "Elige marca y modelo para sugerir una categoría de aparcamiento.", kind: "Tipo de vehículo", brand: "Marca", model: "Modelo", choose: "Seleccionar", other: "Otro / modelo no listado", car: "Automóvil", motorcycle: "Motocicleta", length: "Longitud aproximada", warning: "Las dimensiones varían según año y versión. Comprueba la categoría antes de verificar disponibilidad.", noType: "Categoría no disponible: selecciona otra categoría arriba." },
};

export default function VehicleCatalogSelector({ vehicleTypes, selectedType, vehicleModel, onSelect }: Props) {
  const locale = useLocale();
  const t = copy[locale as keyof typeof copy] || copy.it;
  const [kind, setKind] = useState<"car" | "motorcycle">("car");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const brands = useMemo(() => [...new Set(vehicleCatalog.filter(v => v.kind === kind).map(v => v.brand))].sort((a,b)=>a.localeCompare(b)), [kind]);
  const models = useMemo(() => vehicleCatalog.filter(v => v.kind === kind && v.brand === brand), [kind, brand]);
  const picked = models.find(v => v.model === model);
  const category = picked?.kind === "motorcycle" ? "motorcycle" : picked?.category;
  const availableCategory = vehicleTypes.find(v => v.name === category);
  const vehicleIcon = picked?.kind === "motorcycle" ? "motorcycle" : picked?.category || "car";
  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
      <div>
        <h3 className="font-semibold text-base">{t.title}</h3>
        <p className="text-xs text-muted-foreground">{t.hint}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="space-y-1 text-sm">
          <span>{t.kind}</span>
          <select className="w-full rounded-md border border-input bg-background p-2" value={kind} onChange={e => { setKind(e.target.value as "car" | "motorcycle"); setBrand(""); setModel(""); }}>
            <option value="car">{t.car}</option>
            <option value="motorcycle">{t.motorcycle}</option>
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span>{t.brand}</span>
          <select className="w-full rounded-md border border-input bg-background p-2" value={brand} onChange={e => {setBrand(e.target.value);setModel("");}}>
            <option value="">{t.choose}</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span>{t.model}</span>
          <select className="w-full rounded-md border border-input bg-background p-2" value={model} disabled={!brand} onChange={e => {
            const next = e.target.value;
            setModel(next);
            const found = models.find(v => v.model === next);
            if (found) {
              const name = found.kind === "motorcycle" ? "motorcycle" : found.category;
              const type = vehicleTypes.find(v => v.name === name);
              if (type) onSelect(`${found.brand} ${found.model}`, type.id);
            }
          }}>
            <option value="">{t.choose}</option>
            {models.map(v => <option key={v.model} value={v.model}>{v.model}</option>)}
          </select>
        </label>
      </div>
      {picked && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-primary/20 bg-background/50 p-3">
          <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <VehicleIcon kind={vehicleIcon} className="h-12 w-20 text-primary"/>
          </div>
          <div className="text-sm">
            <p className="font-semibold">{picked.brand} {picked.model}</p>
            <p className="text-primary">{categoryLabels[locale]?.[picked.category] || categoryLabels.it[picked.category]} · {t.length}: {picked.length.toLocaleString(locale === "en" ? "en-GB" : "it-IT")} m</p>
            <p className="text-xs text-muted-foreground">{t.warning}</p>
            {!availableCategory && <p className="text-xs text-destructive">{t.noType}</p>}
          </div>
        </div>
      )}
      <p className="text-xs text-muted-foreground">{t.other}: {locale === "it" ? "puoi scegliere una categoria sopra e scrivere liberamente il modello nel passaggio successivo." : locale === "es" ? "puedes elegir una categoría arriba y escribir el modelo en el siguiente paso." : "choose a category above and enter your model manually in the next step."}</p>
      {vehicleModel && <p className="text-xs text-primary">{locale === "it" ? "Modello attuale" : locale === "es" ? "Modelo actual" : "Current model"}: {vehicleModel}</p>}
    </div>
  );
}
