"use client";

import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface ReservationCancelledProps {
  onBack: () => void;
}

export default function ReservationCancelled({ onBack }: ReservationCancelledProps) {
  const t = useTranslations("ManageReservation");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="w-12 h-12  text-primary" />
        </div>
      </div>
      <h4 className="text-3xl font-bold text-primary text-center">
        {t("cancelled")}
      </h4>
      <p className="text-muted-foreground text-center">
        {t("cancelledThankYou")}
      </p>
      <div className="flex flex-col gap-3 md:flex-row mt-6">
        <Button 
          variant="outline"
          onClick={onBack}
          className="w-full md:flex-1"
          size="mobile"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("back")}
        </Button>
        <Button 
          variant="primary"
          onClick={() => window.location.href = '/'}
          className="w-full md:flex-1"
          size="mobile"
        >
          <Home className="h-4 w-4 mr-2" />
          {t("goHome")}
        </Button>
      </div>
    </motion.div>
  );
}
