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

const VehicleTypeSelector = ({
  t,
  vehicleTypes,
  selectedType,
  onTypeChange,
  fetching = false,
}: VehicleTypeSelectorProps) => {
  const getVehicleIcon = (vehicleTypeName: string, isSelected: boolean) => {
    const iconClass = `h-6 w-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`;
    
    switch (vehicleTypeName.toLowerCase()) {
      case "car":
        return <Car className={iconClass} />;
      case "motorcycle":
        return <Bike className={iconClass} />;
      default:
        return <Car className={iconClass} />;
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">{t("vehicleType")}</Label>

      {fetching ? (
        <div className="flex items-center justify-center p-6">
          <Wheel/>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {vehicleTypes.map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <div
                key={type.id}
                onClick={() => onTypeChange(type.id)}
                className={`
                  relative cursor-pointer rounded-md border-2 p-4 transition-all duration-200
                  flex flex-col items-center justify-center
                  ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/50"
                      : "border-border bg-background/40 hover:border-primary text-foreground hover:shadow-sm"
                  }
                `}
              >
                {getVehicleIcon(type.name, isSelected)}
                <span
                  className={`text-xs font-medium text-center mt-2 ${
                    isSelected ? "text-primary" : "text-foreground"
                  }`}
                >
                  {t(type.name)}
                </span>
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <CheckCircle2Icon className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VehicleTypeSelector;
