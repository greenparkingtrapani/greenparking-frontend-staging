"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Wheel from "@/components/ui/wheel";
import { useReservationLookup } from "@/hooks/reservations/manage/useReservationLookup";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getReservationManage } from "@/lib/reservations/manage/getReservationManage";
import {
  mapReservationToPresentable,
} from "@/hooks/reservations/create/constants";
import { MappedReservation } from "@/types/reservation";
interface ReservationLookupProps {
  onReservationFound: (reservation: MappedReservation) => void;
}

export default function ReservationLookup({
  onReservationFound,
}: ReservationLookupProps) {
  const t = useTranslations("ManageReservation");
  const { lookup, updateLookup, isFormValid } = useReservationLookup();

  const { isFetching, refetch } = useQuery({
    queryKey: ["reservation", lookup.code, lookup.email],
    queryFn: ({ signal }) =>
      getReservationManage(lookup.code, lookup.email, signal),
    enabled: false,
    retry: 0,
  });

  const handleFind = async () => {

    const {data,isError,error} = await refetch();
    if (data) {
      // Si el status es distinto de active, Mostramos mensaje que no esta activa
      if (data.status !== "active") {
        toast.error(t("notActive"));
        return;
      }
      // Mapear los datos recibidos a la estructura esperada usando la función compartida
      const mapped = mapReservationToPresentable(data);
      onReservationFound(mapped);
    } else if (isError) {
      if (error?.message?.includes("404")){
        toast.error(t("notFound"));
      } else {
        toast.error(error.message);
      }
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Wheel />
        <p className="mt-4 text-muted-foreground">{t("searching")}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 1 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <Label className="text-xs md:text-sm">{t("lookupLabel")}</Label>
        <Input
          name="code"
          placeholder={t("reservationCode")}
          value={lookup.code}
          onChange={(e) => updateLookup("code", e.target.value)}
          className="mt-2 h-8 md:h-10 text-xs md:text-sm px-2 md:px-3"
        />
        <Input
          name="email"
          type="email"
          placeholder={t("email")}
          value={lookup.email}
          onChange={(e) => updateLookup("email", e.target.value)}
          className="h-8 md:h-10 text-xs md:text-sm px-2 md:px-3"
        />
      </div>
      <Button
        className="w-full"
        size="mobile"
        onClick={handleFind}
        disabled={!isFormValid || isFetching}
      >
        {t("findReservation")}
      </Button>
    </motion.div>
  );
}
