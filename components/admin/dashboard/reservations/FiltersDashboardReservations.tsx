import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getVehicleTypeItalian } from "@/hooks/reservations/create/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bike, CarFront, CalendarIcon, Filter, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import React from "react";

interface FiltersDashboardReservationsProps {
  filters: {
    startDate: string;
    endDate: string;
    vehicleType: string;
    status: string;
    code: string;
  };
  localCode: string;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  startCalendarOpen: boolean;
  setStartCalendarOpen: (open: boolean) => void;
  endCalendarOpen: boolean;
  setEndCalendarOpen: (open: boolean) => void;
  showFilters: boolean;
  setShowFilters: (open: boolean) => void;
  vehicleTypes: any[];
  loadingVehicleTypes: boolean;
  handleFilterChange: (key: string, value: string) => void;
  handleDateChange: (
    key: "startDate" | "endDate",
    date: Date | undefined,
    setDate: (date: Date | undefined) => void,
    setCalendarOpen: (open: boolean) => void
  ) => void;
  clearAllFilters: () => void;
  getStatusBadge: (status: string, textOnly?: boolean) => string;
}

export function FiltersDashboardReservations({
  filters,
  localCode,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  startCalendarOpen,
  setStartCalendarOpen,
  endCalendarOpen,
  setEndCalendarOpen,
  showFilters,
  setShowFilters,
  vehicleTypes,
  loadingVehicleTypes,
  handleFilterChange,
  handleDateChange,
  clearAllFilters,
  getStatusBadge,
}: FiltersDashboardReservationsProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtri</CardTitle>
          {/* Botón toggle solo visible en mobile */}
          <Button
            variant="outline"
            size="mobile"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? "Nascondi" : "Mostra"} Filtri
          </Button>
        </div>
      </CardHeader>
      <CardContent className={`${showFilters ? "block" : "hidden"} lg:block`}>
        <div className="flex flex-col gap-2 sm:gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
            <div>
              <Label htmlFor="startDate" className="text-xs sm:text-sm">
                Data Inizio
              </Label>
              <Popover
                open={startCalendarOpen}
                onOpenChange={setStartCalendarOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    id="startDate"
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !startDate && "text-muted-foreground"
                    }`}
                    size="mobile"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate
                      ? format(startDate, "dd/MM/yy")
                      : "Seleziona data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    id="startDateCalendar"
                    mode="single"
                    selected={startDate}
                    onSelect={(date) =>
                      handleDateChange(
                        "startDate",
                        date,
                        setStartDate,
                        setStartCalendarOpen
                      )
                    }
                    initialFocus
                  captionLayout="label"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="endDate" className="text-xs sm:text-sm">
                Data Fine
              </Label>
              <Popover open={endCalendarOpen} onOpenChange={setEndCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="endDate"
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !endDate && "text-muted-foreground"
                    }`}
                    size="mobile"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yy") : "Seleziona data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    id="endDateCalendar"
                    mode="single"
                    selected={endDate}
                    onSelect={(date) =>
                      handleDateChange(
                        "endDate",
                        date,
                        setEndDate,
                        setEndCalendarOpen
                      )
                    }
                    initialFocus
                  captionLayout="label"
                    disabled={(date) => (startDate ? date < startDate : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="vehicleType" className="text-xs sm:text-sm">
                Tipo Veicolo
              </Label>
              <Select
                value={filters.vehicleType}
                onValueChange={(value) =>
                  handleFilterChange("vehicleType", value)
                }
                disabled={loadingVehicleTypes}
              >
                <SelectTrigger
                  id="vehicleType"
                  className="text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4"
                >
                  {filters.vehicleType !== "all" &&
                    (filters.vehicleType.toLowerCase().includes("motor") ? (
                      <Bike aria-hidden="true" className="h-4 w-4 shrink-0" />
                    ) : (
                      <CarFront aria-hidden="true" className="h-4 w-4 shrink-0" />
                    ))}
                  <SelectValue placeholder="Tutti i tipi" />
                </SelectTrigger>
                <SelectContent className="text-xs sm:text-sm">
                  <SelectItem
                    value="all"
                    className="text-xs sm:text-sm h-8 sm:h-10"
                  >
                    Tutti i tipi
                  </SelectItem>
                  {vehicleTypes.map((type: any) => (
                    <SelectItem
                      key={type.id}
                      value={type.name}
                      className="text-xs sm:text-sm h-8 sm:h-10"
                    >
                      <span>{getVehicleTypeItalian(type.name)}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status" className="text-xs sm:text-sm">
                Stato
              </Label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger
                  id="status"
                  className="text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4"
                >
                  <SelectValue placeholder="Tutti gli stati" />
                </SelectTrigger>
                <SelectContent className="text-xs sm:text-sm">
                  <SelectItem
                    value="all"
                    className={`${getStatusBadge("all", true)} text-xs sm:text-sm h-8 sm:h-10`}
                  >
                    Tutti gli stati
                  </SelectItem>
                  <SelectItem
                    value="active"
                    className={`${getStatusBadge("active", true)} text-xs sm:text-sm h-8 sm:h-10`}
                  >
                    Attiva
                  </SelectItem>
                  <SelectItem
                    value="pending"
                    className={`${getStatusBadge("pending", true)} text-xs sm:text-sm h-8 sm:h-10`}
                  >
                    In attesa
                  </SelectItem>
                  <SelectItem
                    value="canceled"
                    className={`${getStatusBadge("canceled", true)} text-xs sm:text-sm h-8 sm:h-10`}
                  >
                    Annullata
                  </SelectItem>
                  <SelectItem
                    value="finished"
                    className={`${getStatusBadge("finished", true)} text-xs sm:text-sm h-8 sm:h-10`}
                  >
                    Completata
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="code" className="text-xs sm:text-sm">
                Codice Prenotazione
              </Label>
              <div className="relative">
                <Input
                  id="code"
                  placeholder="Cerca codice..."
                  className="pl-8 text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4"
                  value={localCode}
                  onChange={(e) => handleFilterChange("code", e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2 sm:pt-4">
            <Button
              variant="outline"
              size="mobile"
              onClick={clearAllFilters}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Cancella
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
