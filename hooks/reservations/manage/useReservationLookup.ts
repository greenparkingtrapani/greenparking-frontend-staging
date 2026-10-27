
import { useState } from "react";

export const useReservationLookup = () => {
  const [lookup, setLookup] = useState({ code: "", email: "" });

  const updateLookup = (field: string, value: string) => {
    setLookup((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = lookup.code.trim() !== "" && lookup.email.trim() !== "";

  return {
    lookup,
    updateLookup,
    isFormValid,
  };
};
