import { useState } from "react";

export function useReservationSteps() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
  };
}