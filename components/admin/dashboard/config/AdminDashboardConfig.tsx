"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { VehicleDashboardConfig } from "./VehicleDashboardConfig";
import { getAdminVehicles } from "@/lib/admin/dashboard/config/getAdminConfig";
import { putAdminConfig } from "@/lib/admin/dashboard/config/putAdminConfig";
import { toast } from "sonner";
import Wheel from "@/components/ui/wheel";
import { VehicleConfig } from "@/types/reservation";
import { useAdminConfig } from "@/hooks/admin/dashboard/config/useAdminConfig";
import { useAdminDashboardAuth } from "@/hooks/admin/dashboard/useAdminDashboardAuth";

export default function AdminDashboardConfig() {
  // Hooks para autenticación
  const { token, isAuthenticated, isLoading, handleAuthError } =
    useAdminDashboardAuth();

  // Hooks para configuración de vehículos
  const {
    editingType,
    editForm,
    handleEdit,
    handleSave,
    handleCancel,
    handleSpacesChange,
    handleEditFormPriceChange,
    setEditingType,
    setEditForm,
  } = useAdminConfig();

  // React Query para obtencion de vehiculos
  const queryClient = useQueryClient();
  const {
    isError,
    error,
    data: vehicleConfigs,
    isFetching,
  } = useQuery({
    queryKey: ["adminVehicles"],
    queryFn: () => getAdminVehicles(token),
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });

  if (isError) {
    handleAuthError(error);
    toast.error(`Errore nel caricamento dei veicoli: ${error.message}`);
  }

  // Mutation para actualizar configuracion de vehiculos
  const mutation = useMutation({
    mutationFn: async (form: VehicleConfig) => {
      return putAdminConfig(token, form.vehicle_type, {
        spaces: form.spaces,
        prices: form.prices,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminVehicles"] });
      setEditingType(null);
      setEditForm(null);
      toast.success("Configurazione aggiornata con successo.");
    },
    onError: (error) => {
      handleAuthError(error);
      toast.error(`Errore nell'aggiornamento: ${error.message}`);
    },
  });

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-brand-black to-brand-black/90">
        <Wheel />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-brand-black to-brand-black/90 relative">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-32 sm:h-32 rounded-full bg-primary/20 blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-40 h-40 sm:w-20 sm:h-20 rounded-full bg-primary/20 blur-2xl pointer-events-none"></div>
      <div className="absolute top-2/3 left-2/3 w-24 h-24 sm:w-48 sm:h-48 rounded-full bg-primary/20 blur-2xl pointer-events-none"></div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Configurazione Veicoli</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {vehicleConfigs &&
          vehicleConfigs.map((config: VehicleConfig) => (
            <VehicleDashboardConfig
              key={config.vehicle_type}
              vehicleConfigs={config}
              editingType={editingType}
              editForm={editForm}
              handleEdit={handleEdit}
              handleSave={handleSave}
              handleCancel={handleCancel}
              handleSpacesChange={handleSpacesChange}
              handleEditFormPriceChange={handleEditFormPriceChange}
              mutation={mutation}
            />
          ))}
      </div>
    </div>
  );
}
