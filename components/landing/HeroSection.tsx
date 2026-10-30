"use client";

import {
  Car,
  Clock,
  CreditCard,
  Calendar,
  Luggage,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const t = useTranslations("HeroSection");
  const locale = useLocale();
  const prefersReducedMotion = useReducedMotion();
  const [cmsFields, setCmsFields] = useState<Record<string, string>>({});

  useEffect(() => {
    const controller = new AbortController();
    setCmsFields({});
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return () => controller.abort();

    const url = `${apiUrl.replace(/\/$/, "")}/api/site-content?language=${encodeURIComponent(locale)}&section=HeroSection`;
    fetch(url, { signal: controller.signal, cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`CMS HTTP ${response.status}`);
        return response.json() as Promise<{ fields?: Record<string, unknown> }>;
      })
      .then((data) => {
        if (controller.signal.aborted) return;
        const fields: Record<string, string> = {};
        for (const [key, value] of Object.entries(data.fields ?? {})) {
          if (typeof value === "string") fields[key] = value;
        }
        setCmsFields(fields);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) console.warn("CMS non disponibile: uso le traduzioni originali.", error);
      });
    return () => controller.abort();
  }, [locale]);

  const content = (key: string) => cmsFields[`HeroSection.${key}`] ?? cmsFields[key] ?? t(key);

  return (
    <section className="w-full min-h-[580px] md:min-h-[670px] flex items-center justify-center py-20 md:py-24 bg-gradient-to-b from-brand-black to-brand-black/90 relative overflow-hidden">
      {/* Background elements - optimized with pointer-events-none and will-change */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary blur-2xl will-change-transform"
          animate={
            prefersReducedMotion
              ? undefined
              : { 
                  y: [0, -80, -20, -100, 0], 
                  x: [0, 60, -20, 80, 0], 
                  scale: [1, 1.3, 0.8, 1.4, 1],
                  rotate: [0, 45, -30, 90, 0],
                  opacity: [0.3, 0.6, 0.2, 0.5, 0.3]
                }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: 12,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }
          }
          style={{ translateZ: 0 }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-primary blur-2xl will-change-transform"
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  y: [0, 100, -30, 120, 0],
                  x: [0, -70, 40, -90, 0],
                  scale: [1, 0.7, 1.5, 0.9, 1],
                  rotate: [0, -60, 40, -120, 0],
                  opacity: [0.4, 0.8, 0.3, 0.6, 0.4]
                }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: 14,
                  delay: 0.5,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }
          }
          style={{ translateZ: 0 }}
        />
        <motion.div
          className="absolute top-2/3 left-2/3 w-48 h-48 rounded-full bg-primary blur-2xl will-change-transform"
          animate={
            prefersReducedMotion
              ? undefined
              : { 
                  y: [0, -60, 20, -80, 0], 
                  x: [0, 50, -30, 70, 0], 
                  scale: [1, 1.6, 0.9, 1.3, 1],
                  rotate: [0, 180, -90, 270, 0],
                  opacity: [0.3, 0.7, 0.4, 0.5, 0.3]
                }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: 10,
                  delay: 0.8,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }
          }
          style={{ translateZ: 0 }}
        />
      </div>

      <div className="container relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
        <motion.div
          className="flex flex-col items-center justify-center w-full space-y-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ translateZ: 0 }}
        >
          <motion.div
            className="space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center justify-center mb-4 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 px-4 py-1 will-change-transform"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              style={{ translateZ: 0 }}
            >
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-primary">
                Green Parking
              </span>
            </motion.div>
            <h1 className="text-5xl xl:text-7xl 2xl:text-8xl font-bold tracking-tighter text-brand-black-foreground drop-shadow-sm">
              {content("title")}
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              {content("subtitle")}
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center w-full will-change-transform"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ translateZ: 0 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ translateZ: 0 }}>
              <Link href={`/${locale}/reservations/create`}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2 text-lg bg-primary hover:bg-primary/80 shadow-md hover:shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                >
                  {content("reserveNow")}
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{ translateZ: 0 }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </motion.span>
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ translateZ: 0 }}>
              <Link href={`/${locale}/luggage`}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-lg border-primary/50 hover:border-primary text-primary hover:bg-primary/10 transition-colors duration-300">
                  <Luggage className="h-5 w-5" />
                  {locale === "en" ? "Request luggage storage" : locale === "es" ? "Solicitar consigna" : "Richiedi deposito bagagli"}
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ translateZ: 0 }}>
              <Link href="#pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-lg border-primary/50 hover:border-primary text-primary  hover:bg-primary/10 transition-colors duration-300"
                >
                  {content("viewPricing")}
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-3 will-change-transform"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{ translateZ: 0 }}
          >
            <motion.div
              className="flex items-center gap-1 sm:gap-2 bg-brand-black/40 backdrop-blur-sm py-1.5 px-3 sm:py-2 sm:px-4 rounded-full border border-primary/10 hover:border-primary/30 transition-all duration-300 will-change-transform"
              whileHover={{ scale: 1.05, y: -5 }}
              style={{ translateZ: 0 }}
            >
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-sm sm:text-base font-semibold">{content("service247")}</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-1 sm:gap-2 bg-brand-black/40 backdrop-blur-sm py-1.5 px-3 sm:py-2 sm:px-4 rounded-full border border-primary/10 hover:border-primary/30 transition-all duration-300 will-change-transform"
              whileHover={{ scale: 1.05, y: -5 }}
              style={{ translateZ: 0 }}
            >
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-sm sm:text-base font-semibold">
                {content("securePayment")}
              </span>
            </motion.div>
            <motion.div
              className="flex items-center gap-1 sm:gap-2 bg-brand-black/40 backdrop-blur-sm py-1.5 px-3 sm:py-2 sm:px-4 rounded-full border border-primary/10 hover:border-primary/30 transition-all duration-300 will-change-transform"
              whileHover={{ scale: 1.05, y: -5 }}
              style={{ translateZ: 0 }}
            >
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-sm sm:text-base font-semibold">
                {content("easyBooking")}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
