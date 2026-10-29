"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, RefreshCcw, Archive, CalendarDays, CalendarClock, List } from "lucide-react";
import { CreateReservationModal } from "@/components/admin/dashboard/reservations/modal/CreateDashboardReservations";
import { getAdminReservations } from "@/lib/admin/dashboard/reservations/getAdminReservations";
import { deleteAdminReservation } from "@/lib/admin/dashboard/reservations/deleteAdminReservations";
import { getVehicleTypes } from "@/lib/reservations/create/getVehicleTypes";
import Wheel from "@/components/ui/wheel";
import { useAdminReservationState } from "@/hooks/admin/dashboard/reservations/useAdminReservationState";
import { useAdminReservationFilters } from "@/hooks/admin/dashboard/reservations/useAdminReservationFilters";
import { ReservationDashboard } from "@/types/reservation";
import { useAdminDashboardAuth } from "@/hooks/admin/dashboard/useAdminDashboardAuth";
import { toast } from "sonner";
import { PaginationDashboardReservations } from "./PaginationDashboardReservations";
import { TableDashboardReservations } from "./TableDashboardReservations";
import type { ReservationSort } from "./TableDashboardReservations";
import { FiltersDashboardReservations } from "./FiltersDashboardReservations";

export default function AdminDashboardReservations() {
  const itemsPerPage = 10;
  const [sort, setSort] = useState<ReservationSort>(null);
  /* GREENPARKING_AGENDA_V1 */
  const [view, setView] = useState<"today" | "upcoming" | "archive" | "all">("all");
  const changeView = (next: typeof view) => {
    setView(next);
    setSort(null);
    resetPagination();
  };

  const queryClient = useQueryClient();
  // Hook para estado de la UI (modal, paginación, etc.)
  const {
    showCreateModal,
    setShowCreateModal,
    currentPage,
    showFilters,
    setShowFilters,
    handlePageChange,
    handlePreviousPage,
    handleNextPage,
    resetPagination,
  } = useAdminReservationState(itemsPerPage);

  // Hook para filtros
  const {
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
  } = useAdminReservationFilters({
    startDate: "",
    endDate: "",
    vehicleType: "all",
    status: "all",
    code: "",
  });

  // Hook de autenticación
  const { token, isAuthenticated, isLoading, handleAuthError } =
    useAdminDashboardAuth();

  // Obtener tipos de vehículos
  const { data: vehicleTypes = [], isLoading: loadingVehicleTypes } = useQuery({
    queryKey: ["vehicleTypes"],
    queryFn: getVehicleTypes,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 25 * 60 * 60 * 1000, // Cache
  });

  const filterSignature = JSON.stringify([filters, sort, view]);
  const [previousFilterSignature, setPreviousFilterSignature] =
    useState(filterSignature);
  const queryPage =
    previousFilterSignature === filterSignature ? currentPage : 1;

  const {
    data: reservationsResponse,
    isFetching,
    isError,
    refetch,
    error: GetReservationError,
  } = useQuery({
    queryKey: ["adminReservations", queryPage, itemsPerPage, filters, sort, view],
    queryFn: ({ signal }) =>
      getAdminReservations(token, {
        limit: itemsPerPage,
        offset: (queryPage - 1) * itemsPerPage,
        status: filters.status,
        code: filters.code,
        start_time: filters.startDate,
        end_time: filters.endDate,
        vehicle_type_name: filters.vehicleType,
        sort_by: sort?.key,
        sort_order: sort?.direction,
        view,
      }, signal),
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });

  // Paginacion = 1 cuando se elige algun filtro
  useEffect(() => {
    resetPagination();
    setPreviousFilterSignature(filterSignature);
    // resetPagination is intentionally invoked when the filter signature changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSignature]);

  useEffect(() => {
    queryClient.removeQueries({ queryKey: ["adminReservations"] });
  }, [token, queryClient]);

  // GREENPARKING_DELETE_V1: physically remove ONLY unpaid canceled/finished reservations.
  const purgeMutation = useMutation({
    mutationFn: async (reservation: ReservationDashboard) => {
      const api = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(
        `${api}/admin/reservations/${encodeURIComponent(reservation.code)}/purge`,
        { method: "POST", headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ confirm_code: reservation.code }) }
      );
      if (!response.ok) throw new Error(`Eliminazione non consentita (HTTP ${response.status})`);
    },
    onSuccess: () => {
      toast.success("Prenotazione eliminata definitivamente.");
      resetPagination();
      queryClient.invalidateQueries({ queryKey: ["adminReservations"] });
    },
    onError: (error: Error) => {
      handleAuthError(error);
      toast.error(error.message);
    },
  });

  // Mutación para cancelar reserva
  const cancelMutation = useMutation({
    mutationFn: async ({
      reservation,
      refund,
    }: {
      reservation: ReservationDashboard;
      refund: boolean;
    }) => {
      return deleteAdminReservation(token, reservation.code, refund);
    },
    onSuccess: async (data: Response) => {
      clearAllFilters();
      setSort(null);
      resetPagination();

      let msg = "Prenotazione cancellata correttamente.";
      try {
        const json = await data.json();
        if (json?.message) msg = json.message;
      } catch {
        // The cancellation succeeded even when the backend returns no JSON body.
      }

      toast.success(msg);
      queryClient.invalidateQueries({ queryKey: ["adminReservations"] });
    },
    onError: (error: any) => {
      handleAuthError(error);
      toast.error(`Errore nella cancellazione: ${error.message}`);
    },
  });


  useEffect(() => {
    if (isError) {
      if (GetReservationError?.message?.includes("401")) {
        handleAuthError(GetReservationError);
        return;
      } else {
        toast.error(`Errore : ${GetReservationError.message}`);
      }
    }
  }, [isError, GetReservationError  , handleAuthError]);

  // Extraer datos de la nueva estructura de respuesta
  const reservations = reservationsResponse?.reservations || [];
  const totalReservations = reservationsResponse?.total || 0;
  const totalPages = Math.ceil(totalReservations / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const handleCancelReservation = (
    reservation: ReservationDashboard,
    refund: boolean
  ) => {
    cancelMutation.mutate({ reservation, refund });
  };

  const handleRefresh = () => {
    if (sort) {
      setSort(null);
      return;
    }
    refetch();
  };

  const getStatusBadge = (status: string, textOnly = false) => {
    const variants = {
      active: { background: "bg-reservation-active", text: "text-reservation-active-foreground", filterText: "text-reservation-active" },
      pending: { background: "bg-reservation-pending", text: "text-reservation-pending-foreground", filterText: "text-reservation-pending" },
      canceled: { background: "bg-destructive/20", text: "text-destructive", filterText: "text-destructive" },
      finished: { background: "bg-reservation-finished", text: "text-reservation-finished-foreground", filterText: "text-reservation-finished" },
      null: { background: "bg-reservation-null", text: "text-reservation-null-foreground", filterText: "text-muted-foreground" },
    };
    const variant = variants[status as keyof typeof variants] || variants.null;
    return textOnly ? variant.filterText : `${variant.background} ${variant.text}`;
  };

  if (isFetching || cancelMutation.isPending || isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-gradient-to-b from-brand-black to-brand-black/90">
        <Wheel />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-brand-black to-brand-black/90 relative">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-64 sm:h-64 rounded-full bg-primary/20 blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-40 h-40 sm:w-96 sm:h-96 rounded-full bg-primary/20 blur-2xl pointer-events-none"></div>
      <div className="absolute top-2/3 left-2/3 w-24 h-24 sm:w-48 sm:h-48 rounded-full bg-primary/20 blur-2xl pointer-events-none"></div>
      <div className="flex justify-between items-center mb-6 " >
        <h1 className="text-2xl font-bold">Gestione Prenotazioni</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <Button
            onClick={handleRefresh}
            variant="secondary"
            size="mobile"
            title="Refresh list"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Aggiorna
          </Button>
          <Button onClick={() => setShowCreateModal(true)} size="mobile">
            <Plus className="h-4 w-4 mr-2" />
            Crea Prenotazione
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4" role="group" aria-label="Viste prenotazioni">
        {([
          { id: "today", label: "Oggi", Icon: CalendarDays },
          { id: "upcoming", label: "Prossime", Icon: CalendarClock },
          { id: "archive", label: "Archivio", Icon: Archive },
          { id: "all", label: "Tutte", Icon: List },
        ] as const).map(({ id, label, Icon }) => (
          <Button
            key={id}
            type="button"
            variant={view === id ? "default" : "outline"}
            size="mobile"
            aria-pressed={view === id}
            onClick={() => changeView(id)}
            className="min-w-0 w-full gap-1 sm:gap-2"
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        {view === "today" ? "Prenotazioni da gestire oggi, incluse quelle già iniziate e ancora in corso." :
         view === "upcoming" ? "Prenotazioni dei prossimi giorni, ordinate per ingresso." :
         view === "archive" ? "Prenotazioni concluse o annullate: rimangono consultabili e non vengono eliminate." :
         "Elenco completo delle prenotazioni."}
      </p>

      {/* Filtros */}
      <FiltersDashboardReservations
        filters={filters}
        localCode={localCode}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        startCalendarOpen={startCalendarOpen}
        setStartCalendarOpen={setStartCalendarOpen}
        endCalendarOpen={endCalendarOpen}
        setEndCalendarOpen={setEndCalendarOpen}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        vehicleTypes={vehicleTypes}
        loadingVehicleTypes={loadingVehicleTypes}
        handleFilterChange={handleFilterChange}
        handleDateChange={handleDateChange}
        clearAllFilters={clearAllFilters}
        getStatusBadge={getStatusBadge}
      />

      {/* Tabla de reservas */}
      <Card>
        <CardContent className="p-0">
          <TableDashboardReservations
            reservations={reservations}
            onCancelReservation={handleCancelReservation}
            onPurgeReservation={(reservation) => purgeMutation.mutate(reservation)}
            getStatusBadge={getStatusBadge}
            sort={sort}
            onSortChange={setSort}
          />
        </CardContent>
      </Card>

      {/* Pagination o mensaje de no resultados */}
      {reservations.length > 0 && totalReservations > 0 ? (
        <div className="mt-6">
          <PaginationDashboardReservations
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalReservations}
            itemsPerPage={itemsPerPage}
            hasPreviousPage={hasPreviousPage}
            hasNextPage={hasNextPage}
            onPageChange={(page) => handlePageChange(page, totalPages)}
            onPreviousPage={handlePreviousPage}
            onNextPage={() => handleNextPage(totalPages)}
          />
        </div>
      ) : (
        <div className="mt-6 text-center">
          <span className="text-muted-foreground text-sm">
            Nessuna prenotazione trovata per i filtri selezionati.
          </span>
        </div>
      )}

      <CreateReservationModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onReservationCreated={() => {
          // Refetch data después de crear nueva reserva
          refetch();
          setShowCreateModal(false);
        }}
        handleAuthError={handleAuthError}
      />
    </div>
  );
}
