import { Label } from "@/components/ui/label";
import { Car, Bike, CheckCircle2Icon } from "lucide-react";
import Wheel from "@/components/ui/wheel";

interface VehicleTypeSelectorProps {
  t: (key: string) => string;
  vehicleTypes: { id: number; name: string }[];
  selectedType: number;
  onTypeChange: (value: number) => void;
  fetching?: boolean;
}

const autoTypes = ["car", "sedan", "suv"];
const twoWheelTypes = ["motorcycle", "electric_bicycle"];
const dimensions: Record<string, string> = {
  car: "3,5–4,0 m",
  sedan: "4,5–5,0 m",
  suv: "4,5–5,0 m",
};
const hourly: Record<string, string> = {
  car: "€2/ora", sedan: "€2/ora", suv: "€3/ora",
  motorcycle: "€1/ora", electric_bicycle: "€1/ora",
};

export default function VehicleTypeSelector({
  t, vehicleTypes, selectedType, onTypeChange, fetching = false,
}: VehicleTypeSelectorProps) {
  const choices = (names: string[]) => vehicleTypes.filter(v => names.includes(v.name));
  const tile = (type: {id:number;name:string}) => {
    const selected = type.id === selectedType;
    const Icon = autoTypes.includes(type.name) ? Car : Bike;
    return (
      <button type="button" key={type.id} onClick={() => onTypeChange(type.id)}
        aria-pressed={selected}
        className={`relative flex min-h-28 flex-col items-center justify-center rounded-lg border-2 px-3 py-4 text-center transition-colors ${selected ? "border-primary bg-primary/10 ring-2 ring-primary/40" : "border-border bg-background/40 hover:border-primary"}`}>
        <Icon className={`h-7 w-7 ${selected ? "text-primary" : "text-muted-foreground"}`} />
        <span className="mt-2 text-sm font-semibold">{t(type.name)}</span>
        {dimensions[type.name] && <span className="mt-1 text-xs text-muted-foreground">{dimensions[type.name]}</span>}
        {hourly[type.name] && <span className="mt-1 text-sm text-primary font-medium">{hourly[type.name]}</span>}
        {selected && <CheckCircle2Icon className="absolute right-2 top-2 h-4 w-4 text-primary" />}
      </button>
    );
  };
  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">{t("vehicleType")}</Label>
      {fetching ? <div className="flex justify-center p-6"><Wheel /></div> :
        <>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">{t("carCategory")}</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {choices(autoTypes).map(tile)}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {choices(twoWheelTypes).map(tile)}
          </div>
          {vehicleTypes.length === 0 && <p className="text-sm text-destructive">{t("noSpotsAvailable")}</p>}
        </>
      }
    </div>
  );
}
