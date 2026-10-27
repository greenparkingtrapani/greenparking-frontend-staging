import { useState } from "react";

export const useManageReservation = () => {
  const [step, setStep] = useState(1);
  const [reservation, setReservation] = useState<any>(null);
  const [cancelled, setCancelled] = useState(false);

  const handleBack = () => {
    setReservation(null);
    setCancelled(false);
    setStep(1);
  };

  const handleReservationFound = (foundReservation: any) => {
    setReservation(foundReservation);
    setStep(2);
  };

  const handleCancel = () => {
    setCancelled(true);
    setStep(3);
  };

  return {
    step,
    reservation,
    cancelled,
    handleReservationFound,
    handleBack,
    handleCancel,
  };
};
