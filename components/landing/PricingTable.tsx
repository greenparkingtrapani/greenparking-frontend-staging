"use client";

import { Price } from "@/types/reservation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  RESERVATION_DURATIONS,
  VEHICLE_TYPE_ID_TO_KEY_MAP,
} from "@/hooks/reservations/create/constants";
import { motion } from "framer-motion";
import { Car, Bike, ChevronRight, Luggage } from "lucide-react";

interface PricingTableProps {
  prices: Price[];
  t: (key: string) => string;
}

export default function PricingTable({ prices, t }: PricingTableProps) {
  const tHero = useTranslations("HeroSection");
  const locale = useLocale();

  // Available pricing durations
  const durations = RESERVATION_DURATIONS;

  // Vehicle types with their IDs and translated labels
  const vehicleTypes = Object.entries(VEHICLE_TYPE_ID_TO_KEY_MAP).map(
    ([id, vehicleKey]) => ({
      id: parseInt(id),
      key: vehicleKey,
      label: t(`PricingTable.${vehicleKey}`),
    })
  );

  // Return the price for a vehicle type and duration
  function getPrice(vehicleType: string, duration: string) {
    const found = prices.find(
      (price) =>
        price.vehicle_type === vehicleType &&
        price.reservation_time === duration
    );
    return found ? `${found.price}€` : "-";
  }

  const getVehicleIcon = (type: string) => {
    switch(type) {
      case 'car':
        return <Car className="h-6 w-6 text-primary" />;
      case 'motorcycle':
        return <Bike className="h-6 w-6 text-primary" />;
      default:
        return <Car className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Tabs defaultValue="hour" className="w-full">
        <TabsList className="grid w-full border border-primary/30 max-w-md mx-auto grid-cols-2 bg-brand-black/40 backdrop-blur-md overflow-hidden rounded-xl">
          {durations.map((duration) => (
            <TabsTrigger 
              key={duration} 
              value={duration}
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:shadow-primary/20 transition-all duration-300"
            >
              {t(`PricingTable.${duration}`)}
            </TabsTrigger>
          ))}
        </TabsList>
        {durations.map((duration) => (
          <TabsContent key={duration} value={duration} className="mt-8">
            <div className="grid gap-6 md:grid-cols-3 lg:gap-6 2xl:gap-8">
              {vehicleTypes.map((vehicleType, idx) => (
                <motion.div
                  key={vehicleType.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: idx * 0.1 + 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Card
                    className="flex flex-col h-full overflow-hidden border-primary/20 bg-brand-black/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
                  >
                    <CardHeader className="2xl:p-8 border-b border-primary/10">
                      <div className="flex justify-center items-center">
                        <CardTitle className="lg:text-xl 2xl:text-2xl flex items-center gap-2">
                          {getVehicleIcon(vehicleType.key)}
                          {vehicleType.label}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 2xl:px-8 py-8">
                      <div className="text-4xl font-bold mb-4 lg:text-4xl 2xl:text-5xl text-brand-black-foreground">
                        {getPrice(vehicleType.key, duration)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-6 lg:text-sm 2xl:text-base">
                        {t(`PricingTable.per${duration.charAt(0).toUpperCase() + duration.slice(1)}`)}
                      </p>
                    </CardContent>
                    <CardFooter className="2xl:p-8 pt-0">
                      <Link
                        href={`/reservations/create?type=${vehicleType.id}`}
                        className="w-full"
                      >
                        <Button 
                          className="w-full bg-primary/80 shadow-md shadow-primary/10 transition-all duration-300 hover:bg-primary hover:shadow-lg hover:shadow-primary/20 lg:text-base 2xl:py-6 group"
                        >
                          {tHero("reserveNow")} 
                          <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
              <motion.div
                key={`luggage-${duration}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 100 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <Card className="flex flex-col h-full overflow-hidden border-primary/20 bg-brand-black/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50">
                  <CardHeader className="2xl:p-8 border-b border-primary/10">
                    <div className="flex justify-center items-center">
                      <CardTitle className="lg:text-xl 2xl:text-2xl flex items-center gap-2">
                        <Luggage className="h-6 w-6 text-primary" />
                        {locale === "en" ? "Luggage storage" : locale === "es" ? "Consigna de equipaje" : "Deposito bagagli"}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 2xl:px-8 py-8">
                    <div className="text-4xl font-bold mb-4 lg:text-4xl 2xl:text-5xl text-brand-black-foreground">
                      {locale === "en" ? "from " : locale === "es" ? "desde " : "da "}1€
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {locale === "en" ? "per bag per hour" : locale === "es" ? "por equipaje y hora" : "per bagaglio / ora"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {locale === "en" ? "Pay on arrival" : locale === "es" ? "Pago en el establecimiento" : "Pagamento sul posto"}
                    </p>
                  </CardContent>
                  <CardFooter className="2xl:p-8 pt-0">
                    <Link href={`/${locale}/luggage`} className="w-full">
                      <Button className="w-full bg-primary/80 shadow-md shadow-primary/10 transition-all duration-300 hover:bg-primary hover:shadow-lg hover:shadow-primary/20 lg:text-base 2xl:py-6 group">
                        {locale === "en" ? "Request storage" : locale === "es" ? "Solicitar consigna" : "Richiedi deposito"}
                        <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
