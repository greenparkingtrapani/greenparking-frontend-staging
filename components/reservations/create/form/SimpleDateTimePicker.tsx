import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { isBefore } from "date-fns";
import {
  getCurrentItalyTime,
  getTodayInItaly,
  compareItalyDateTime,
  getAvailableItalyHours,
} from "@/lib/italy-time";
import { ChevronDown } from "lucide-react";

// Generar horas válidas (solo terminadas en :00)
const generateHours = () => {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, "0") + ":00";
    hours.push(hour);
  }
  return hours;
};

const AVAILABLE_HOURS = generateHours();

// Función para obtener horas disponibles considerando las siguientes reglas:
// - Si la fecha es hoy en Italia y la hora actual es antes de y media (minutos < 40), se permite también la hora actual.
// - Si es después de y media (minutos >= 40), se exige a partir de la próxima hora como antes.
// - Para fechas futuras todas las horas están disponibles.
const getAvailableHours = (
  selectedDate: Date | undefined,
  isExitPicker: boolean,
  entryDate: Date | undefined,
  entryTime: string,
  allowPastDates: boolean
) => {
  if (!selectedDate) return AVAILABLE_HOURS;

  let availableHours = getAvailableItalyHours(selectedDate);
  if (!allowPastDates && isSameDay(selectedDate, getTodayInItaly())) {
    const nowInItaly = getCurrentItalyTime();
    const minHour = nowInItaly.getMinutes() < 40
      ? nowInItaly.getHours()
      : nowInItaly.getHours() + 1;
    availableHours = AVAILABLE_HOURS.filter(
      (hour) => Number.parseInt(hour.split(":")[0]) >= minHour
    );
  }

  if (isExitPicker && entryDate && isSameDay(selectedDate, entryDate)) {
    return availableHours.filter(
      (hour) => compareItalyDateTime(selectedDate, hour, entryDate, entryTime) > 0
    );
  }

  return availableHours;
};

interface SimpleDateTimePickerProps {
  t: (key: string) => string;
  dateLabel: string;
  timeLabel: string;
  dateValue: Date | undefined;
  timeValue: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (value: string) => void;
  disabled?: boolean;
  minSelectableDate?: Date;
  isExitPicker?: boolean; // Para determinar si es el picker de salida
  entryDate?: Date; // Necesario para el picker de salida
  entryTime?: string; // Necesario para el picker de salida
  timeDisabled?: boolean;
  allowPastDates?: boolean;
  dateInputId?: string;
  timeInputId?: string;
}

const SimpleDateTimePicker: React.FC<SimpleDateTimePickerProps> = ({
  t,
  dateLabel,
  timeLabel,
  dateInputId,
  timeInputId,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  disabled = false,
  minSelectableDate,
  isExitPicker = false,
  entryDate,
  entryTime = "",
  timeDisabled = false,
  allowPastDates = false,
}) => {
  // Obtener horas disponibles según la hora actual en Italia y nueva regla
  const availableHours = getAvailableHours(
    dateValue,
    isExitPicker,
    entryDate,
    entryTime,
    allowPastDates
  );

  // Si la hora seleccionada ya no está disponible, resetea el select
  useEffect(() => {
    if (timeValue && !availableHours.includes(timeValue)) {
      onTimeChange("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateValue, availableHours.join(","), timeValue]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
      <div className="space-y-1 md:space-y-2">
        <Label
          htmlFor={dateInputId}
          className="text-sm md:text-base font-medium"
        >
          {dateLabel}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={dateInputId}
              variant="outline"
              className={cn(
                "w-full h-8 md:h-10 justify-between text-left font-normal border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground text-sm md:text-base"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
              {dateValue ? format(dateValue, "dd/MM/yy") : t("selectDate")}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-popover text-popover-foreground border border-border ">
            <Calendar
              mode="single"
              selected={dateValue}
              onSelect={onDateChange}
              disabled={(date) => {
                if (!allowPastDates && minSelectableDate) {
                  return isBefore(date, minSelectableDate);
                }
                return false;
              }}
              initialFocus
              captionLayout="label"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-1 md:space-y-2">
        <Label
          htmlFor={timeInputId}
          className="text-sm md:text-base font-medium"
        >
          {timeLabel}
        </Label>
        <Select
          name="time"
          value={timeValue}
          onValueChange={onTimeChange}
          disabled={disabled || timeDisabled}
        >
          <SelectTrigger
            id={timeInputId}
            className="border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground h-8 md:h-10 text-sm md:text-base"
          >
            <ClockIcon className=" mr-2 h-4 w-4 text-primary" />
            <SelectValue
              placeholder={
                disabled || timeDisabled
                  ? t("selectDateFirst")
                  : t("selectTime")
              }
            />
          </SelectTrigger>
          <SelectContent className="bg-popover text-primary border border-border md:text-sm max-h-48 md:max-h-80">
            {availableHours.map((hour: string) => (
              <SelectItem
                key={hour}
                value={hour}
                className="text-foreground hover:bg-accent hover:text-accent-foreground data-[state=checked]:bg-primary data-[state=checked]:text-brand-black-foreground text-center justify-center  md:py-1.5 text-base md:text-sm pl-2 md:pl-8 pr-2 md:pr-8 leading-tight  "
              >
                {hour}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SimpleDateTimePicker;
