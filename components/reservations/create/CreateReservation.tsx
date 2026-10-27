"use client";

import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Plus } from "lucide-react";
import { Check, CreditCard, Calendar, User } from "lucide-react";
import countryData from "country-telephone-data";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import { useReservationForm } from "../../../hooks/reservations/create/useReservationForm";
import StepNavigation from "./StepNavigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getReservation } from "@/lib/reservations/create/getReservation";
import { ReservationDashboard } from "@/types/reservation";
import {
  mapReservationToPresentable,
} from "@/hooks/reservations/create/constants";
import Wheel from "@/components/ui/wheel";

const countryOptions =
  //Es un array de objetos con nombre, código de marcado y código ISO2
  (
    countryData.allCountries as Array<{
      name: string;
      dialCode: string;
      iso2: string;
    }>
  ).map((country) => ({
    name: country.name,
    dialCode: country.dialCode,
    iso2: country.iso2,
  }));

export default function CreateReservation() {
  const t = useTranslations("Reservation");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // Si hay session_id, estamos en modo confirmación (Step 4)
  const isConfirmationMode = !!sessionId;

  const {
    currentStep: formStep,
    formData,
    selectedCountry,
    setSelectedCountry,
    availability,
    setAvailability,
    slotDetails,
    setSlotDetails,
    lastCheckedKey,
    setLastCheckedKey,
    timer,
    setTimer,
    start_time,
    end_time,
    handleChange,
    handleSelectChange,
    handleDateChange,
    isEmailValid,
    isNameValid,
    isPhoneValid,
    touched,
    handleBlur,
    nextStep,
    prevStep,
    handlePrint,
  } = useReservationForm(t, countryOptions, locale);

  // Query para obtener datos de la reserva cuando estamos en modo confirmación
  const {
    data: reservation,
    isFetching,
    error,
  } = useQuery<ReservationDashboard>({
    queryKey: ["reservation", sessionId],
    queryFn: ({ signal }) => getReservation(sessionId!, signal),
    enabled: isConfirmationMode,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });

  // El step actual depende del modo
  const currentStep = isConfirmationMode ? 4 : formStep;

  const expiredToastRef = useRef(false);
  const slotAvailableToastRef = useRef(false);

  // Lógica del timer movida desde el hook para usar traducciones
  useEffect(() => {
    if (!timer) return;
    expiredToastRef.current = false; // Con esto hago que no se muestre el mensaje de expiración dos veces
    const interval = setInterval(() => {
      setTimer((prev: number) => {
        if (prev <= 1) {
          if (!expiredToastRef.current) {
            setAvailability(null);
            setSlotDetails([]);
            toast.warning(t("reservationTimeExpired"));
            expiredToastRef.current = true;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Función para mapear datos de la reserva (para Step4)
  const mapReservationToFormData = (reservation: ReservationDashboard) => {
    return mapReservationToPresentable(reservation);
  };

  const steps = [
    {
      number: 1,
      title: t("step1Title"),
      icon: <Calendar className="h-5 w-5" />,
    },
    { number: 2, title: t("step2Title"), icon: <User className="h-5 w-5" /> },
    {
      number: 3,
      title: t("step3Title"),
      icon: <CreditCard className="h-5 w-5" />,
    },
    { number: 4, title: t("step4Title"), icon: <Check className="h-5 w-5" /> },
  ];

  return (
    <div className="flex flex-1  items-center justify-center bg-gradient-to-b from-brand-black to-brand-black/90 relative pb-4">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-64 sm:h-64 rounded-full bg-primary/20 blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-40 h-40 sm:w-96 sm:h-96 rounded-full bg-primary/20 blur-2xl pointer-events-none"></div>
      <div className="absolute top-2/3 left-2/3 w-24 h-24 sm:w-48 sm:h-48 rounded-full bg-primary/20 blur-2xl pointer-events-none"></div>
      <div className=" container mx-auto max-w-4xl w-full ">
        <div className="mb-6">
          <StepNavigation steps={steps} currentStep={currentStep} t={t} />
        </div>

        {/* Timer solo para steps 1-3 */}
        {!isConfirmationMode && availability === true && timer > 0 && (
          <div className="w-full flex justify-center mb-6">
            <div className="bg-muted border rounded-md px-4 py-2">
              <span className="text-sm font-semibold text-destructive">
                {t("timeRemaining")}{" "}
                {`${Math.floor(timer / 60)
                  .toString()
                  .padStart(2, "0")}:${(timer % 60)
                  .toString()
                  .padStart(2, "0")}`}
              </span>
            </div>
          </div>
        )}

        <Card className="max-w-2xl w-full mx-auto">
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <Step1
                t={t}
                formData={formData}
                availability={availability}
                setAvailability={setAvailability}
                slotDetails={slotDetails}
                setSlotDetails={setSlotDetails}
                lastCheckedKey={lastCheckedKey}
                setLastCheckedKey={setLastCheckedKey}
                handleSelectChange={handleSelectChange}
                handleDateChange={handleDateChange}
                nextStep={nextStep}
                start_time={start_time}
                end_time={end_time}
                slotAvailableToastRef={slotAvailableToastRef}
              />
            )}
            {currentStep === 2 && (
              <Step2
                t={t}
                formData={formData}
                handleChange={handleChange}
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
                countryOptions={countryOptions}
                isEmailValid={isEmailValid}
                isNameValid={isNameValid}
                isPhoneValid={isPhoneValid}
                touched={touched}
                handleBlur={handleBlur}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}
            {currentStep === 3 && (
              <Step3
                t={t}
                formData={formData}
                handleSelectChange={handleSelectChange}
                prevStep={prevStep}
                start_time={start_time}
                end_time={end_time}
                selectedCountry={selectedCountry}
                locale={locale}
              />
            )}
            {currentStep === 4 &&
              (isFetching ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Wheel />
                  <p className="mt-4 text-muted-foreground">
                    {t("loadingReservation")}
                  </p>
                </div>
              ) : error || !reservation ? (
                <div className="text-center">
                  <p className="text-muted-foreground">
                    {t("errorReservationMessage")}
                  </p>
                  <div className="flex flex-col gap-3 md:flex-row justify-center mt-4">
                    <Button
                      variant="outline"
                      onClick={() =>
                        (window.location.href = "/reservations/create")
                      }
                      className="w-full md:flex-1"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t("newReservation")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => (window.location.href = "/")}
                      className="w-full md:flex-1"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      {t("goHome")}
                    </Button>
                  </div>
                </div>
              ) : (
                <Step4
                  t={t}
                  reservationCode={reservation.code}
                  formData={mapReservationToFormData(reservation)}
                  handlePrint={handlePrint}
                  totalPrice={reservation.total_price}
                  depositPayment={reservation.deposit_payment}
                  paymentMethodId={reservation.payment_method_id}
                />
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
