import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import React, { useState } from "react";
import Wheel from "@/components/ui/wheel";
import { format } from "date-fns";
import { Coins, CreditCard, CheckCircle2Icon, KeyRound } from "lucide-react";
import { ReservationFormData, CountryOption } from "@/types/reservation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getTotalPrice } from "@/lib/reservations/create/getTotalPrice";
import { createReservation } from "@/lib/reservations/create/createReservation";
import {
  getVehicleTypeKeyFromId,
  getPaymentMethodKeyFromId,
} from "@/hooks/reservations/create/constants";
import { toast } from "sonner";

interface Step3Props {
  t: (key: string) => string;
  formData: ReservationFormData;
  handleSelectChange: (name: string, value: string | number) => void;
  prevStep: () => void;
  start_time: string;
  end_time: string;
  selectedCountry: CountryOption;
  locale: string;
}

const paymentMethods = [{ value: 1, label: "payOnSite", icon: Coins }, { value: 2, label: "payOnline", icon: CreditCard }];

const onsiteCopy = {
  it: { notice: "Prenotazione senza pagamento anticipato: pagherai l'intero importo al parcheggio.", success: "Prenotazione registrata!", reference: "Codice prenotazione", instructions: "Conserva questo codice e presentalo al parcheggio. Nessun pagamento online è stato richiesto.", again: "Effettua un'altra prenotazione" },
  en: { notice: "Book now and pay the full amount at the car park by cash or card.", success: "Reservation confirmed!", reference: "Booking reference", instructions: "Keep this code and show it when you arrive. No online payment was charged.", again: "Make another reservation" },
  es: { notice: "El pago en línea está desactivado temporalmente. Reserva ahora y paga el importe completo en el aparcamiento, en efectivo o con tarjeta.", success: "¡Reserva registrada!", reference: "Código de reserva", instructions: "Guarda este código y preséntalo al llegar. No se ha cobrado ningún pago en línea.", again: "Hacer otra reserva" },
};

const Step3 = ({
  t,
  formData,
  handleSelectChange,
  prevStep,
  start_time,
  end_time,
  selectedCountry,
  locale,
}: Step3Props) => {
  const [confirmedCode, setConfirmedCode] = useState("");
  const onsiteText = onsiteCopy[locale as keyof typeof onsiteCopy] || onsiteCopy.it;
  const notice = formData.paymentMethod === 2
    ? (locale === "en" ? "Pay 100% online securely with Stripe. The booking will be confirmed after payment." : locale === "es" ? "Paga el 100% en línea con Stripe. La reserva se confirma después del pago." : "Paga il 100% online con Stripe. La prenotazione sarà confermata dopo il pagamento.")
    : (locale === "en" ? "Book now and pay at the parking facility." : locale === "es" ? "Reserva ahora y paga en el aparcamiento." : "Prenota ora e paga al parcheggio, in contanti o con carta.");

  //  Obtenemos el tipo de vehiculo
  const vehicleTypeId = formData.vehicleType;

  // Obtenemos el precio total
  const { data: totalPriceResponse = null, isFetching: fetchingPrice } = useQuery({
    queryKey: ["totalPrice", vehicleTypeId, start_time, end_time],
    queryFn: ({ signal }) =>
      getTotalPrice({
        vehicleTypeId,
        startTime: start_time,
        endTime: end_time,
        signal,
      }),
    enabled: !!(vehicleTypeId && start_time && end_time),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const totalPrice = totalPriceResponse?.total_price ?? null;

  // Función para construir el payload de la reserva para luego enviar a la base.
  const buildReservationPayload = () => {
    return {
      user_name: `${formData.firstName} ${formData.lastName}`.trim(),
      user_email: formData.email,
      user_phone: `+${selectedCountry.dialCode}${formData.phone}`,
      vehicle_type_id: formData.vehicleType,
      payment_method_id: formData.paymentMethod,
      vehicle_plate: formData.licensePlate,
      vehicle_model: formData.vehicleModel,
      start_time,
      end_time,
      total_price: totalPrice ?? 0,
      deposit_payment: 0,
      language: locale,
    };
  };

  // Mutation para crear la reserva, a la cual le pasamos el payload construido
  const createReservationMutation = useMutation({
    mutationFn: createReservation,
    onSuccess: (reservation) => {
      if (formData.paymentMethod === 2 && reservation?.url) {
        window.location.assign(reservation.url);
        return;
      }
      if (formData.paymentMethod === 1 && reservation?.code) setConfirmedCode(reservation.code);
      else toast.error("Reservation could not be confirmed. Please contact the parking staff.");
    },
    onError: (error: any) => {
      toast.error(`Failed to create reservation: ${error.message}`);
    }
  });

  // Handler para la reserva
  const handleReservation = async () => {
    const payload = buildReservationPayload();
    createReservationMutation.mutate(payload);
  };

  const isFetching = createReservationMutation.isPending;

  if (confirmedCode) return (
    <div role="status" className="space-y-5 rounded-xl border border-primary/40 bg-primary/10 p-6 text-center">
      <CheckCircle2Icon className="mx-auto h-12 w-12 text-primary" />
      <h2 className="text-2xl font-bold">{onsiteText.success}</h2>
      <p>{onsiteText.reference}</p>
      <p className="select-all rounded-lg border bg-background px-4 py-3 font-mono text-2xl font-bold">{confirmedCode}</p>
      <p>{onsiteText.instructions}</p>
      <p className="font-semibold">{onsiteText.notice}</p>
      <Button type="button" onClick={() => window.location.reload()}>{onsiteText.again}</Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <Alert className="border-primary/40 bg-primary/10">
        <Coins className="h-4 w-4 text-primary" />
        <AlertTitle>{notice}</AlertTitle>
      </Alert>
      {/* Keys Required Alert */}
      <Alert className="border-warning dark:bg-warning/20">
        <KeyRound className="h-4 w-4 text-warning" />
        <AlertTitle className=" dark:text-warning-foreground">{t("keysRequired")}</AlertTitle>
        <AlertDescription className="text-sm dark:text-warning-foreground">
          {t("keysRequiredMessage")}
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <Label className="text-base md:text-lg font-medium">{t("paymentMethod")}</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = formData.paymentMethod === method.value;
            const paymentColorClass = "text-payment-onsite";
            return (
              <div
                key={method.value}
                onClick={() =>
                  handleSelectChange("paymentMethod", method.value)
                }
                className={`
                  relative cursor-pointer rounded-md border-2 p-4 transition-all duration-200
                  flex flex-col items-center justify-center
                  ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/50"
                      : "border-border bg-background/40 hover:border-primary text-foreground hover:shadow-sm"
                  }
                  ${isFetching ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <Icon
                  className={`h-6 w-6 ${
                    isSelected ? "text-primary" : paymentColorClass
                  }`}
                />
                <span
                  className={`text-xs md:text-sm font-medium text-center mt-2 ${
                    isSelected ? "text-primary" : paymentColorClass
                  }`}
                >
                  {t(method.label)}
                </span>
                {/* Indicador de selección */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <CheckCircle2Icon className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {!formData.paymentMethod && (
          <p role="alert" className="text-sm text-destructive">
            {t("paymentMethodRequired")}
          </p>
        )}
      </div>
      <div className="bg-muted p-4 rounded-md">
        <h3 className="text-base md:text-lg font-medium mb-2">{t("reservationSummary")}</h3>
        <div className="space-y-2 text-xs md:text-sm">
          <div className="flex justify-between">
            <span>{t("vehicleType")}:</span>
            <span className="capitalize">
              {formData.vehicleType ? t(getVehicleTypeKeyFromId(formData.vehicleType)) : "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t("entryDateTime")}:</span>
            <span>
              {formData.entryDate && formData.entryTime
                ? `${format(formData.entryDate, "dd/MM/yyyy")} ${formData.entryTime}`
                : "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t("exitDateTime")}:</span>
            <span>
              {formData.exitDate && formData.exitTime
                ? `${format(formData.exitDate, "dd/MM/yyyy")} ${formData.exitTime}`
                : "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t("paymentMethod")}:</span>
            <span>
              {formData.paymentMethod ? t(getPaymentMethodKeyFromId(formData.paymentMethod)) : "-"}
            </span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-medium">
              <span>{t("totalAmount")}:</span>
              <span className="text-primary">
                {fetchingPrice ? <Wheel /> : totalPrice !== null ? `€${totalPrice}` : "-"}
              </span>
            </div>
            {totalPriceResponse?.discount === true && (
              <div className="mt-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-center text-xs font-medium text-primary">
                {t("discountApplied")}
              </div>
            )}
            {totalPrice !== null && (
              <p className="mt-3 text-sm font-semibold text-primary">{notice}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-2 mt-2 md:mt-4">
        <Button variant="outline" onClick={prevStep} size="mobile">
          {t("back")}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={isFetching || !formData.paymentMethod || totalPrice === null}
              role="link"
              size="mobile"
            >
              {t("completeReservation")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("confirmReservation")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("confirmReservationDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleReservation}
                disabled={isFetching}
              >
                {isFetching ? t("processing") : t("confirmReservation")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Step3;
