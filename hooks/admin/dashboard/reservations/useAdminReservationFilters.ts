import { useState, useEffect } from "react";

export function useAdminReservationFilters(initialFilters: {
  startDate?: string;
  endDate?: string;
  vehicleType?: string;
  status?: string;
  code?: string;
}) {
  const [filters, setFilters] = useState({
    startDate: initialFilters.startDate || "",
    endDate: initialFilters.endDate || "",
    vehicleType: initialFilters.vehicleType || "all",
    status: initialFilters.status || "all",
    code: initialFilters.code || "",
  });

  const [localCode, setLocalCode] = useState(filters.code);

  // Estados para los calendarios de fecha
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);

  // Debounce para el código de reserva
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, code: localCode }));
    }, 1000);
    return () => clearTimeout(handler);
  }, [localCode]);

  const handleFilterChange = (key: string, value: string) => {
    if (key === "code") {
      setLocalCode(value);
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleDateChange = (
    key: "startDate" | "endDate",
    date: Date | undefined,
    setDate: (date: Date | undefined) => void,
    setCalendarOpen: (open: boolean) => void
  ) => {
    setDate(date);
    const dateString = date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
      : "";
    setFilters((prev) => ({ ...prev, [key]: dateString }));
    setCalendarOpen(false);
  };

  const clearAllFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      vehicleType: "all",
      status: "all",
      code: "",
    });
    setLocalCode("");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return {
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
    handleFilterChange,
    handleDateChange,
    clearAllFilters,
    setFilters,
  };
}
