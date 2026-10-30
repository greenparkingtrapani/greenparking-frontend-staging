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
    <section className="w-full min-h-0 flex items-center justify-center pt-24 pb-8 md:pt-28 md:pb-10 bg-gradient-to-b from-brand-black to-brand-black/90 relative overflow-hidden">
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
          className="flex flex-col items-center justify-center w-full space-y-5 text-center"
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
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {([
              { key: "service247", icon: Clock, details: locale === "en" ? ["Open 24 hours a day", "Video-monitored area", "Remote access assistance", "Personal access code where provided"] : locale === "es" ? ["Abierto las 24 horas", "Zona videovigilada", "Asistencia para apertura remota", "Código personal de acceso cuando esté disponible"] : ["Aperto 24 ore su 24", "Area videosorvegliata", "Assistenza per apertura da remoto", "Codice personale dove previsto"] },
              { key: "securePayment", icon: CreditCard, details: locale === "en" ? ["Secure online payment via Stripe", "Or pay directly at the car park", "Protected online transactions"] : locale === "es" ? ["Pago online seguro con Stripe", "O paga directamente en el aparcamiento", "Transacciones online protegidas"] : ["Pagamento online sicuro con Stripe", "Oppure pagamento direttamente al parcheggio", "Transazioni online protette"] },
              { key: "easyBooking", icon: Calendar, details: locale === "en" ? ["Book in just a few steps", "Choose dates and service", "Confirmation after booking is processed"] : locale === "es" ? ["Reserva en pocos pasos", "Elige fechas y servicio", "Confirmación tras procesar la reserva"] : ["Prenota in pochi passaggi", "Scegli date e servizio", "Conferma dopo l'elaborazione della prenotazione"] },
            ] as const).map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.key} className="group relative">
                  <button type="button" aria-label={content(item.key)} aria-describedby={`info-${item.key}`} className="peer flex items-center gap-2 rounded-full border border-primary/20 bg-brand-black/70 px-3 py-2 text-sm font-semibold transition-colors hover:border-primary/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary sm:px-4">
                    <Icon className="h-4 w-4 text-primary" />
                    {content(item.key)}
                  </button>
                  <div id={`info-${item.key}`} role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 w-64 -translate-x-1/2 translate-y-1 rounded-xl border border-primary/50 bg-zinc-950 p-4 text-left text-sm text-white opacity-0 shadow-xl shadow-primary/10 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <p className="mb-2 font-bold text-primary">{content(item.key)}</p>
                    <ul className="space-y-2">
                      {item.details.map((detail) => <li key={detail} className="flex gap-2"><span className="text-primary" aria-hidden="true">✓</span><span>{detail}</span></li>)}
                    </ul>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
