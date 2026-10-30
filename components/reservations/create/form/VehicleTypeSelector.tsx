import { Label } from "@/components/ui/label";
import { CheckCircle2Icon } from "lucide-react";
import Wheel from "@/components/ui/wheel";

interface VehicleTypeSelectorProps {
  t: (key: string) => string;
  vehicleTypes: { id: number; name: string }[];
  selectedType: number;
  onTypeChange: (value: number) => void;
  fetching?: boolean;
}

// Cropped from the approved realistic C concept; one lightweight image strip for all five categories.
const vehicleSprite = "data:image/webp;base64,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";
const imageIndex: Record<string,number> = {car:0,sedan:1,suv:2,electric_bicycle:3,motorcycle:4};
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
    return (
      <button type="button" key={type.id} onClick={() => onTypeChange(type.id)}
        aria-pressed={selected}
        className={`relative flex min-h-28 flex-col items-center justify-center rounded-lg border-2 px-3 py-4 text-center transition-colors ${selected ? "border-primary bg-primary/10 ring-2 ring-primary/40" : "border-border bg-background/40 hover:border-primary"}`}>
        <span aria-hidden="true" className={`block h-[73px] w-[115px] max-w-full shrink-0 rounded-md bg-black bg-no-repeat ${selected ? "" : "opacity-85"}`} style={{ backgroundImage: `url("${vehicleSprite}")`, backgroundSize: "575px 73px", backgroundPosition: `-${(imageIndex[type.name] ?? 0)*115}px 0px` }} />
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
