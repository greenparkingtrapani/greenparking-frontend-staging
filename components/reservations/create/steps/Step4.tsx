import { Button } from "@/components/ui/button";
import { Check, Printer } from "lucide-react";
import React from "react";
import { MappedReservation } from "@/types/reservation";

interface Step4Props {
  t: (key: string) => string;
  reservationCode: string;
  formData: MappedReservation;
  handlePrint: () => void;
  totalPrice?: number | null;
  depositPayment?: number;
  paymentMethodId?: number;
}

const Step4 = ({
  t,
  reservationCode,
  formData,
  handlePrint,
  totalPrice,
  depositPayment,
  paymentMethodId,
}: Step4Props) => {
  return (
    <div className="print-area space-y-4 text-center">
      <>
        <div className="no-print flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Check className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold">{t("reservationConfirmed")}</h3>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">{t("confirmationDetails")}</p>
        </div>
        <div className="bg-muted p-6 rounded-md inline-block mx-auto">
          <div className="text-xs md:text-sm text-muted-foreground">{t("reservationCode")}</div>
          <div className="text-primary text-xl md:text-2xl font-bold tracking-wider">{reservationCode}</div>
        </div>
        <div className="pt-4 space-y-4">
          <div className="bg-muted p-4 rounded-md text-left">
            <h4 className="text-base md:text-lg font-medium mb-2">{t("reservationDetails")}</h4>
            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex justify-between">
                <span>{t("name")}:</span>
                <span>
                  {formData.firstName} {formData.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("vehicleType")}:</span>
                <span className="capitalize">{formData.vehicleType ? t(formData.vehicleType) : "-"}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("entryDateTime")}:</span>
                <span>
                  {formData.entryDate} {formData.entryTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("exitDateTime")}:</span>
                <span>
                  {formData.exitDate} {formData.exitTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("paymentMethod")}:</span>
                <span>{formData.paymentMethod ? t(formData.paymentMethod) : "-"}</span>
              </div>
              {totalPrice && (
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-medium text-primary">
                    <span>{t("totalFinal")}:</span>
                    <span>€{totalPrice.toFixed(2)}</span>
                  </div>
                  {paymentMethodId === 1 && depositPayment !== undefined && (
                    <div className="mt-2 space-y-1 text-xs md:text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>{t("onlinePaymentAmount")}:</span>
                        <span>€{depositPayment.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("onsitePaymentAmount")}:</span>
                        <span>€{(totalPrice - depositPayment).toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <Button className="no-print w-full" size="mobile" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            {t("printConfirmation")}
          </Button>
        </div>
      </>
    </div>
  );
};

export default Step4;
