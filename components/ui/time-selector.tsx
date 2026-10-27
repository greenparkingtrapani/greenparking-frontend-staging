"use client"

import React, { useState } from "react"
import { Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  minTime?: string; // Optional: for future use
  excludeMinTime?: boolean; // Si es true, excluye la hora exacta de minTime (para hora de salida)
  placeholder?: string; // Texto para mostrar cuando no hay valor seleccionado
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ 
  value, 
  onValueChange, 
  disabled = false, 
  minTime,
  excludeMinTime = false, // Por defecto no excluye la hora mínima
  placeholder = "Selecciona una hora" // Valor por defecto en español
}) => {
  const [selectedTime, setSelectedTime] = useState<string>(value);

  // Generar array de 24 horas (00:00 a 23:00)
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });

  // Si hay minTime, filtrar según si se debe excluir o incluir la hora exacta
  const filteredHours = minTime
    ? hours.filter((time) => excludeMinTime ? time > minTime : time >= minTime)
    : hours;

  const handleChange = (newValue: string) => {
    setSelectedTime(newValue);
    onValueChange(newValue);
  };

  return (
    <div className="w-full space-y-2">
      <Select value={selectedTime} onValueChange={handleChange} disabled={disabled}>
        <SelectTrigger className="w-full bg-background text-foreground border-border focus:ring-2 focus:ring-primary">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-background text-foreground border-border">
          {filteredHours.map((time) => (
            <SelectItem 
              key={time} 
              value={time} 
              disabled={disabled}
              className="hover:bg-primary/10 focus:bg-primary/10 focus:text-primary hover:text-primary transition-colors"
            >
              <span className="flex items-center gap-2">
                {time}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeSelector;
