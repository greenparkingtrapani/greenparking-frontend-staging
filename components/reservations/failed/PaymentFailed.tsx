"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, Home, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentFailed() {
  const t = useTranslations("Reservation");
  const router = useRouter();

  const handleRetry = () => {
     router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleNewReservation = () => {
    router.push('/reservations/create');
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-brand-black to-brand-black/90 relative pb-4">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-64 sm:h-64 rounded-full bg-primary/20 blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-40 h-40 sm:w-96 sm:h-96 rounded-full bg-primary/20 blur-2xl pointer-events-none"></div>
      <div className="absolute top-2/3 left-2/3 w-24 h-24 sm:w-48 sm:h-48 rounded-full bg-primary/20 blur-2xl pointer-events-none"></div>
      <div className="container mx-auto max-w-4xl w-full">
        <Card className="max-w-2xl w-full mx-auto text-center border-border-input">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-xl text-destructive">
              {t("paymentCancelled")}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              {t("paymentCancelledMessage")}
            </p>
            
            <div className="bg-accent/15 border border-input rounded-lg p-4">
              <p className="text-sm text-accent-foreground">
                {t("modifyDataMessage")}
              </p>
            </div>
            
            {/* Botones Nueva reserva e Ir al inicio: columna en mobile, fila en md+ */}
            <div className="flex flex-col gap-3 md:flex-row">
              <Button 
                variant="outline"
                onClick={handleNewReservation}
                className="w-full md:flex-1"
                size="mobile"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("newReservation")}
              </Button>
              <Button 
                variant="outline"
                onClick={handleGoHome}
                className="w-full md:flex-1"
                size="mobile"
              >
                <Home className="h-4 w-4 mr-2" />
                {t("goHome")}
              </Button>
            </div>
            {/* Botón Volver al pago abajo, ancho completo */}
            <Button 
              onClick={handleRetry}
              variant="parking"
              className="w-full mt-3 bg-primary hover:bg-primary/85"
              size="mobile"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("backToPayment")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
