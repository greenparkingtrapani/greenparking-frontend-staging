import { useReservationFormState } from "./useReservationFormState";
import { useReservationSteps } from "./useReservationSteps";
import { CountryOption } from "@/types/reservation";
import { useEffect } from "react";
// Tipos explícitos para los datos del formulario y props del hook

export function useReservationForm(
  t: (key: string) => string,
  countryOptions: CountryOption[],
  locale: string
) {
  // Subhooks para dividir responsabilidades
  const steps = useReservationSteps();
  const formState = useReservationFormState(countryOptions);

  // Volver al step 1 cuando availability se resetee por el timer
  useEffect(() => {
    if (formState.availability === null && steps.currentStep > 1 && formState.timer === 0) {
      steps.setCurrentStep(1);
    }
  }, [formState.availability, formState.timer, steps]);

  // Handlers que conectan los subhooks
  const handleSelectChange = (name: string, value: string | number) => {
    formState.handleSelectChange(name, value);
  };

  const handleDateChange = (
    name: "entryDate" | "exitDate",
    date: Date | undefined
  ) => {
    formState.handleDateChange(name, date);
  };

  // Funciones del flujo principal
  const nextStep = async () => {
    steps.nextStep();
  };

  const prevStep = () => {
    steps.prevStep();
  };

  const handlePrint = () => {
    window.print();
  };

  return {
    // Estados del flujo de pasos
    currentStep: steps.currentStep,
    
    // Estados del formulario
    formData: formState.formData,
    selectedCountry: formState.selectedCountry,
    setSelectedCountry: formState.setSelectedCountry,
    start_time: formState.start_time,
    end_time: formState.end_time,
    
    // Estados de disponibilidad (replicados del admin)
    availability: formState.availability,
    setAvailability: formState.setAvailability,
    slotDetails: formState.slotDetails,
    setSlotDetails: formState.setSlotDetails,
    lastCheckedKey: formState.lastCheckedKey,
    setLastCheckedKey: formState.setLastCheckedKey,
    timer: formState.timer,
    setTimer: formState.setTimer,
    
    // Handlers
    handleChange: formState.handleChange,
    handleSelectChange,
    handleDateChange,
    
    // Validaciones
    isEmailValid: formState.isEmailValid,
    isNameValid: formState.isNameValid,
    isPhoneValid: formState.isPhoneValid,
    touched: formState.touched,
    handleBlur: formState.handleBlur,
    
    // Funciones del flujo principal
    nextStep,
    prevStep,
    handlePrint,
  };
}
