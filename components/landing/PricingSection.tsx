"use client";

import { useQuery } from "@tanstack/react-query";
import { getPrices } from "@/lib/landing/getPrices";
import { useTranslations } from "next-intl";
import PricingTable from "@/components/landing/PricingTable";
import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { BadgePercent, CreditCard, Tag } from "lucide-react";

export default function PricingSection() {
  const t = useTranslations("PricingSection");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  const {
    error,
    isError,
    data: prices,
  } = useQuery({
    queryKey: ["prices"],
    queryFn: getPrices,
    retry: 1,
  });

  return (
    <section
      id="pricing"
      className="w-full scroll-mt-16 py-12 md:py-24 lg:py-32 2xl:py-32 bg-gradient-to-b from-brand-black/95 to-brand-black/90 relative overflow-hidden"
      ref={ref}
    >
      {/* Background elements - optimized with pointer-events-none and will-change */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-primary blur-2xl will-change-transform"
          animate={prefersReducedMotion ? undefined : { 
            y: [0, -90, 20, -110, 0], 
            x: [0, 70, -40, 90, 0], 
            scale: [1, 1.4, 0.7, 1.5, 1],
            rotate: [0, 120, -60, 180, 0],
            opacity: [0.3, 0.7, 0.2, 0.6, 0.3]
          }}
          transition={prefersReducedMotion ? undefined : { 
            duration: 15, 
            repeat: Infinity, 
            repeatType: "mirror", 
            ease: "easeInOut" 
          }}
          style={{ translateZ: 0 }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-primary blur-2xl opacity-60 will-change-transform"
          animate={prefersReducedMotion ? undefined : { 
            y: [0, 110, -50, 130, 0], 
            x: [0, -80, 60, -100, 0], 
            scale: [1, 0.6, 1.7, 0.8, 1], 
            rotate: [0, -150, 75, -210, 0],
            opacity: [0.6, 1, 0.3, 0.8, 0.6]
          }}
          transition={prefersReducedMotion ? undefined : { 
            duration: 18, 
            delay: 0.5, 
            repeat: Infinity, 
            repeatType: "mirror", 
            ease: "easeInOut" 
          }}
          style={{ translateZ: 0 }}
        />
      </div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div 
          className="flex flex-col items-center justify-center space-y-8 text-center will-change-transform"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.7 }}
          style={{ translateZ: 0 }}
        >
          <motion.div 
            className="space-y-4 will-change-transform"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ translateZ: 0 }}
          >
            <div className="inline-flex items-center justify-center px-4 py-1 mb-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 will-change-transform translate-z-0">
              <Tag className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-primary">{t("title")}</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl lg:text-6xl 2xl:text-7xl text-brand-black-foreground drop-shadow-sm">
              {t("title")}
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-lg/relaxed 2xl:text-xl/relaxed mx-auto">
              {t("description")}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full will-change-transform"
            style={{ translateZ: 0 }}
          >
            <PricingTable prices={prices ?? []} t={t} />
            <p className="mx-auto mt-4 flex w-full max-w-2xl items-start gap-2 rounded-md border border-accent/30 bg-accent/10 px-4 py-2 text-center text-sm font-medium leading-relaxed text-accent-foreground sm:items-center">
              <BadgePercent className="mt-0.5 h-4 w-4 shrink-0 sm:mt-0" aria-hidden="true" />
              <span>
                {t("longStayDiscountBefore")}
                <a href="#contact" className="text-primary underline-offset-4 hover:underline">
                  {t("longStayDiscountAction")}
                </a>
                {t("longStayDiscountAfter")}
              </span>
            </p>
          </motion.div>
          
          {isError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="will-change-opacity"
              style={{ translateZ: 0 }}
            >
              <span className="text-destructive bg-destructive/10 px-4 py-2 rounded-md border border-destructive/20">
                {error.message}
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
