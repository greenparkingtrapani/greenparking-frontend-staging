"use client";

import { Car, Clock, CreditCard, Shield, Video, Home, Droplets } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function AboutSection() {
  const t = useTranslations("AboutSection");
  const locale = useLocale();
  const [cmsFields, setCmsFields] = useState<Record<string, string>>({});

  useEffect(() => {
    const controller = new AbortController();
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "");
    const params = new URLSearchParams({ language: locale, section: "AboutSection" });

    // The CMS overrides translations only when an explicit database value exists.
    fetch(`${apiBase}/api/site-content?${params.toString()}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) throw new Error(`CMS request failed: ${response.status}`);
        return response.json();
      })
      .then((payload: { fields?: Record<string, string> }) => {
        if (!controller.signal.aborted) setCmsFields(payload.fields ?? {});
      })
      .catch(() => {
        if (!controller.signal.aborted) setCmsFields({});
      });

    return () => controller.abort();
  }, [locale]);

  const content = (key: string): string => {
    const override = cmsFields[`AboutSection.${key}`] ?? cmsFields[key];
    return typeof override === "string" ? override : t(key);
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <section
      id="about"
      className="bg-gradient-to-b from-brand-black/95 to-brand-black/90 w-full py-12 md:py-24 lg:py-32 2xl:py-56 relative overflow-hidden"
      ref={ref}
    >
      {/* Background elements - optimized with pointer-events-none and will-change */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full border-2 border-primary/50 will-change-transform"
          animate={prefersReducedMotion ? undefined : { y: [0, -40, 0], x: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={prefersReducedMotion ? undefined : { duration: 7, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          style={{ translateZ: 0 }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full border-2 border-primary/50 opacity-70 will-change-transform"
          animate={prefersReducedMotion ? undefined : { y: [0, 70, 0], x: [0, -45, 0], scale: [1, 1.13, 1], rotate: [0, 10, 0] }}
          transition={prefersReducedMotion ? undefined : { duration: 9, delay: 0.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          style={{ translateZ: 0 }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full border-2 border-primary/50 will-change-transform"
          animate={prefersReducedMotion ? undefined : { y: [0, -60, 0], x: [0, 40, 0], scale: [1, 1.18, 1] }}
          transition={prefersReducedMotion ? undefined : { duration: 8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          style={{ translateZ: 0 }}
        />
        <motion.div
          className="absolute bottom-3/4 left-3/3 w-32 h-32 rounded-full border-2 border-primary/70 will-change-transform"
          animate={prefersReducedMotion ? undefined : { y: [0, 30, 0], x: [0, -20, 0], scale: [1, 1.10, 1] }}
          transition={prefersReducedMotion ? undefined : { duration: 10, delay: 0.7, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
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
            <div className="inline-flex items-center justify-center px-4 py-1 mb-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
              <Shield className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-primary">{content("title")}</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl lg:text-6xl 2xl:text-7xl text-brand-black-foreground drop-shadow-sm">
              {content("title")}
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-lg/relaxed 2xl:text-xl/relaxed mx-auto">
              {content("description")}
            </p>
          </motion.div>
          
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 2xl:gap-12 mt-8">
            <motion.div 
              className="flex flex-col items-center space-y-3 p-4 rounded-2xl bg-brand-black/30 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-500 shadow-lg hover:shadow-xl shadow-primary/5 hover:shadow-primary/10 will-change-transform"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              whileHover={{ y: -10, scale: 1.02 }}
              style={{ translateZ: 0 }}
            >
              <motion.div 
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 lg:h-14 lg:w-14 2xl:h-16 2xl:w-16 shadow-md shadow-primary/20 will-change-transform"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                style={{ translateZ: 0 }}
              >
                <Clock className="h-6 w-6 text-primary lg:h-7 lg:w-7 2xl:h-8 2xl:w-8" />
              </motion.div>
              <h3 className="text-lg font-bold lg:text-lg 2xl:text-xl text-center">{content("access247")}</h3>
              <p className="text-muted-foreground text-center text-sm">
                {content("access247Desc")}
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center space-y-3 p-4 rounded-2xl bg-brand-black/30 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-500 shadow-lg hover:shadow-xl shadow-primary/5 hover:shadow-primary/10 will-change-transform"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              whileHover={{ y: -10, scale: 1.02 }}
              style={{ translateZ: 0 }}
            >
              <motion.div 
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 lg:h-14 lg:w-14 2xl:h-16 2xl:w-16 shadow-md shadow-primary/20 will-change-transform"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                style={{ translateZ: 0 }}
              >
                <Car className="h-6 w-6 text-primary lg:h-7 lg:w-7 2xl:h-8 2xl:w-8" />
              </motion.div>
              <h3 className="text-lg font-bold lg:text-lg 2xl:text-xl text-center">{content("allVehicles")}</h3>
              <p className="text-muted-foreground text-center text-sm">
                {content("allVehiclesDesc")}
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center space-y-3 p-4 rounded-2xl bg-brand-black/30 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-500 shadow-lg hover:shadow-xl shadow-primary/5 hover:shadow-primary/10 will-change-transform"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              whileHover={{ y: -10, scale: 1.02 }}
              style={{ translateZ: 0 }}
            >
              <motion.div 
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 lg:h-14 lg:w-14 2xl:h-16 2xl:w-16 shadow-md shadow-primary/20 will-change-transform"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                style={{ translateZ: 0 }}
              >
                <CreditCard className="h-6 w-6 text-primary lg:h-7 lg:w-7 2xl:h-8 2xl:w-8" />
              </motion.div>
              <h3 className="text-lg font-bold lg:text-lg 2xl:text-xl text-center">{content("securePayment")}</h3>
              <p className="text-muted-foreground text-center text-sm">
                {content("securePaymentDesc")}
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center space-y-3 p-4 rounded-2xl bg-brand-black/30 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-500 shadow-lg hover:shadow-xl shadow-primary/5 hover:shadow-primary/10 will-change-transform"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              whileHover={{ y: -10, scale: 1.02 }}
              style={{ translateZ: 0 }}
            >
              <motion.div 
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 lg:h-14 lg:w-14 2xl:h-16 2xl:w-16 shadow-md shadow-primary/20 will-change-transform"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                style={{ translateZ: 0 }}
              >
                <Video className="h-6 w-6 text-primary lg:h-7 lg:w-7 2xl:h-8 2xl:w-8" />
              </motion.div>
              <h3 className="text-lg font-bold lg:text-lg 2xl:text-xl text-center">{content("security24")}</h3>
              <p className="text-muted-foreground text-center text-sm">
                {content("security24Desc")}
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center space-y-3 p-4 rounded-2xl bg-brand-black/30 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-500 shadow-lg hover:shadow-xl shadow-primary/5 hover:shadow-primary/10 will-change-transform"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              whileHover={{ y: -10, scale: 1.02 }}
              style={{ translateZ: 0 }}
            >
              <motion.div 
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 lg:h-14 lg:w-14 2xl:h-16 2xl:w-16 shadow-md shadow-primary/20 will-change-transform"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                style={{ translateZ: 0 }}
              >
                <Home className="h-6 w-6 text-primary lg:h-7 lg:w-7 2xl:h-8 2xl:w-8" />
              </motion.div>
              <h3 className="text-lg font-bold lg:text-lg 2xl:text-xl text-center">{content("coveredParking")}</h3>
              <p className="text-muted-foreground text-center text-sm">
                {content("coveredParkingDesc")}
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center space-y-3 p-4 rounded-2xl bg-brand-black/30 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-500 shadow-lg hover:shadow-xl shadow-primary/5 hover:shadow-primary/10 will-change-transform"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.75 }}
              whileHover={{ y: -10, scale: 1.02 }}
              style={{ translateZ: 0 }}
            >
              <motion.div 
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 lg:h-14 lg:w-14 2xl:h-16 2xl:w-16 shadow-md shadow-primary/20 will-change-transform"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                style={{ translateZ: 0 }}
              >
                <Droplets className="h-6 w-6 text-primary lg:h-7 lg:w-7 2xl:h-8 2xl:w-8" />
              </motion.div>
              <h3 className="text-lg font-bold lg:text-lg 2xl:text-xl text-center">{content("showers")}</h3>
              <p className="text-muted-foreground text-center text-sm">
                {content("showersDesc")}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
