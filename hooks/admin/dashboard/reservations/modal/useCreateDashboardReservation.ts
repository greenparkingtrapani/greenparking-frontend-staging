import { useCallback, useState, useEffect } from "react";
import { useLocale } from "next-intl";
import {
  getMinSelectableDateInItaly,
  getMinimumExitDate,
  compareItalyDateTime,
  convertItalyToUTC,
} from "@/lib/italy-time";
import { toast } from "sonner";
import countryData from "country-telephone-data";
import { ReservationFormData, CountryOption } from "@/types/reservation";

const countryOptions = (
  countryData.allCountries as Array<{
    name: string;
    dialCode: string;
    iso2: string;
  }>
).map((country) => ({
  name: country.name,
  dialCode: country.dialCode,
  iso2: country.iso2,
}));
export function useCreateDashboardReservation() {
  const locale = useLocale();

  const [formData, setFormData] = useState<ReservationFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    vehicleType: undefined as any, //Se pone asi, ya que sino rompe con la interface ReservationFormData del create de user
    licensePlate: "",
    vehicleModel: "",
    entryDate: undefined,
    entryTime: "",
    exitDate: undefined,
    exitTime: "",
    paymentMethod: 1,
    language: locale,
  });
  const [availability, setAvailability] = useState<boolean | null>(null);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [slotDetails, setSlotDetails] = useState<any[]>([]);
  const [token, setToken] = useState<string>(() =>
    typeof window === "undefined" ? "" : localStorage.getItem("admin_token") || ""
  );
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(
    countryOptions.find((c) => c.iso2 === "it") || countryOptions[0]
  );
  const [touched, setTouched] = useState({
    licensePlate: false,
    vehicleModel: false,
  });
  
  // Estados para el sistema de confirmación del botón
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmTimer, setConfirmTimer] = useState<number>(0);

  // Get minimum selectable date in Italy timezone
  const minSelectableDate = getMinSelectableDateInItaly();
  const exitMinSelectableDate = getMinimumExitDate(
    formData.entryDate,
    formData.entryTime
  );

  // Transforma la fecha Y hora de entrada y salida a formato UTC
  const start_time =
    formData.entryDate && formData.entryTime
      ? convertItalyToUTC(formData.entryDate, formData.entryTime)
      : "";

  const end_time =
    formData.exitDate && formData.exitTime
      ? convertItalyToUTC(formData.exitDate, formData.exitTime)
      : "";

  // Reset form
  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      vehicleType: undefined as any, 
      licensePlate: "",
      vehicleModel: "",
      entryDate: undefined,
      entryTime: "",
      exitDate: undefined,
      exitTime: "",
      paymentMethod: 1,
      language: locale,
    });
    setAvailability(null);
    setAvailabilityChecked(false);
    setSlotDetails([]);
    setTouched({ licensePlate: false, vehicleModel: false });
    setShowConfirm(false);
    setConfirmTimer(0);
  };
  // Checkea si las fechas y horas son válidas
  const isDateTimeValid = useCallback((): boolean => {
    if (
      !formData.entryDate ||
      !formData.entryTime ||
      !formData.exitDate ||
      !formData.exitTime
    ) return false;
    return compareItalyDateTime(
      formData.exitDate,
      formData.exitTime,
      formData.entryDate,
      formData.entryTime
    ) > 0;
  }, [formData.entryDate, formData.entryTime, formData.exitDate, formData.exitTime]);
  // Toast de error si la fecha/hora de entrada es mayor o igual a la de salida
  useEffect(() => {
    if (
      formData.entryDate &&
      formData.entryTime &&
      formData.exitDate &&
      formData.exitTime &&
      !isDateTimeValid()
    ) {
      toast.error("La data e ora di fine devono essere successive a quelle di inizio.");
    }
  }, [formData.entryDate, formData.entryTime, formData.exitDate, formData.exitTime, isDateTimeValid]);

  // Handler para verificar disponibilidad (será pasado desde el componente)
  const createHandleCheckAvailability = (checkAvailabilityFn: () => void) => () => {
    setAvailabilityChecked(false);
    setAvailability(null);
    checkAvailabilityFn();
  };

  // Submit handler (será pasado desde el componente) 
  const createHandleSubmit = (submitFn: (data: any) => void, totalPrice: number) => async (e: React.FormEvent) => {
    e.preventDefault();
    if (!availability) {
      toast.error("Verifica prima la disponibilità");
      return;
    }
    const reservationData = {
      user_name: `${formData.firstName} ${formData.lastName}`.trim(),
      user_email: formData.email,
      user_phone: `+${selectedCountry.dialCode}${formData.phone}`,
      vehicle_type_id: Number(formData.vehicleType),
      vehicle_plate: formData.licensePlate,
      vehicle_model: formData.vehicleModel,
      payment_method_id: formData.paymentMethod,
      start_time: start_time,
      end_time: end_time,
      total_price: totalPrice,
      language: locale,
    };
    submitFn(reservationData);
  };

  // Handle input changes
  const handleInputChange = (field: keyof ReservationFormData, value: any) => {
    setShowConfirm(false);
    setConfirmTimer(0);
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      const minimumExitDate = getMinimumExitDate(
        next.entryDate,
        next.entryTime
      );
      if (
        (field === "entryDate" || field === "entryTime") &&
        next.entryTime === "23:00" &&
        minimumExitDate &&
        (!next.exitDate ||
          compareItalyDateTime(
            next.exitDate,
            "00:00",
            minimumExitDate,
            "00:00"
          ) < 0)
      ) {
        next.exitDate = minimumExitDate;
        next.exitTime = "";
      }
      return next;
    });
    if ([
      "entryDate",
      "entryTime",
      "exitDate",
      "exitTime",
      "vehicleType",
    ].includes(field)) {
      setAvailability(null);
      setAvailabilityChecked(false);
      setSlotDetails([]);
      if (availabilityChecked) {
        toast.info("Hai modificato i dati, controlla di nuovo la disponibilità.");
      }
    }
  };

  // Validaciones de inputos
  const isEmailValid = (email: string) => /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(email);
  const isNameValid = (name: string) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/.test(name);
  const isPhoneValid = (phone: string) => /^\d{7,}$/.test(phone);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const canCheckAvailability =
    formData.entryDate &&
    formData.entryTime &&
    formData.exitDate &&
    formData.exitTime &&
    formData.vehicleType &&
    isDateTimeValid();

  // Handler para el botón "Crea Prenotazione" que inicia el timer de confirmación
  const handleCreateClick = () => {
    setShowConfirm(true);
    setConfirmTimer(10); // 10 segundos para confirmar
  };

  // Handler para cancelar la confirmación
  const handleCancelConfirm = () => {
    setShowConfirm(false);
    setConfirmTimer(0);
  };

  // Reset confirmation (útil para resetear desde el timer principal)
  const resetConfirmation = () => {
    setShowConfirm(false);
    setConfirmTimer(0);
  };

  // Timer para el botón de confirmación
  useEffect(() => {
    if (!confirmTimer) return;
    const interval = setInterval(() => {
      setConfirmTimer((prev) => {
        if (prev <= 1) {
          setShowConfirm(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [confirmTimer]);


  return {
    formData,
    setFormData,
    availability,
    setAvailability,
    availabilityChecked,
    setAvailabilityChecked,
    slotDetails,
    setSlotDetails,
    token,
    setToken,
    selectedCountry,
    setSelectedCountry,
    minSelectableDate,
    exitMinSelectableDate,
    start_time,
    end_time,
    resetForm,
    isDateTimeValid,
    createHandleCheckAvailability,
    createHandleSubmit,
    handleInputChange,
    isEmailValid,
    isNameValid,
    isPhoneValid,
    touched,
    setTouched,
    handleBlur,
    canCheckAvailability,
    locale,
    showConfirm,
    confirmTimer,
    handleCreateClick,
    handleCancelConfirm,
    resetConfirmation,
  };
}
