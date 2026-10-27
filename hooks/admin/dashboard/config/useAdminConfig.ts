import { useState } from "react";
import { VehicleConfig } from "@/types/reservation";

export function useAdminConfig() {
  const [editingType, setEditingType] = useState<string | null>(null); //Tipo de vehiculo que se está editando
  const [editForm, setEditForm] = useState<VehicleConfig | null>(null); //Los datos actuales del formulario de edición

  const handleEdit = (config: VehicleConfig) => {
    setEditingType(config.vehicle_type);
    setEditForm({ ...config });
  };

  const handleSave = (mutation: any) => {
    if (!editForm) return;
    mutation.mutate(editForm);
  };

  const handleCancel = () => {
    setEditingType(null);
    setEditForm(null);
  };

  // Maneja el cambio de espacios disponibles
  const handleSpacesChange = (value: number) => {
    setEditForm((prev) =>
      prev
        ? {
            ...prev,
            spaces: value,
          }
        : null
    );
  };

  //Maneja el cambio de precios en el formulario de edición
  const handleEditFormPriceChange = (priceType: string, value: number) => { //Para los precios
    setEditForm((prev) =>
      prev
        ? {
            ...prev,
            prices: {
              ...prev.prices,
              [priceType]: value,
            },
          }
        : null
    );
  };

  return {
    editingType,
    editForm,
    handleEdit,
    handleSave,
    handleCancel,
    handleSpacesChange,
    handleEditFormPriceChange,
    setEditingType,
    setEditForm,
  };
}