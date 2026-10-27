import { useState } from "react";

const useAdminReservationState = (itemsPerPage: number) => {
  // Estados de UI
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Handlers para paginación
  const handlePageChange = (page: number, totalPages: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleNextPage = (totalPages: number) =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const resetPagination = () => setCurrentPage(1);

  return {
    showCreateModal,
    setShowCreateModal,
    currentPage,
    showFilters,
    setShowFilters,
    handlePageChange,
    handlePreviousPage,
    handleNextPage,
    resetPagination,
  };
};

export { useAdminReservationState };
