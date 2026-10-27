"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useLocale, useTranslations } from "next-intl";
import { Mail, MapPin, Phone, Facebook, Instagram, MessageSquare } from "lucide-react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function ContactSection() {
  const t = useTranslations("ContactSection");
  const locale = useLocale();
  const [cms, setCms] = useState<Record<string, string>>({});

  useEffect(() => {
    const controller = new AbortController();
    const api = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";
    fetch(`${api.replace(/\/$/, "")}/api/site-content?language=${encodeURIComponent(locale)}&section=ContactSection`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) throw new Error("CMS unavailable");
        return response.json();
      })
      .then((data: { fields?: Record<string, string> }) => {
        if (!controller.signal.aborted) setCms(data.fields ?? {});
      })
      .catch(() => {
        if (!controller.signal.aborted) setCms({});
      });
    return () => controller.abort();
  }, [locale]);

  const content = (key: string): string => cms[key] ?? cms[`ContactSection.${key}`] ?? t(key);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  const safeHttps = (value: string): string => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" ? value : "about:blank";
    } catch { return "about:blank"; }
  };

  const contactCards = [
    {
      icon: <MapPin className="h-6 w-6 text-primary mb-2 2xl:h-8 2xl:w-8" />,
      title: content("visitUs"),
      content: (
        <>
          {content("addressLine1")}<br />
          {content("addressLine2")}<br />
          {content("addressLine3")}
        </>
      )
    },
    {
      icon: <Phone className="h-6 w-6 text-primary mb-2 2xl:h-8 2xl:w-8" />,
      title: content("callUs"),
      content: (
        <>
          <a href={`tel:${content("phoneValue")}`} className="hover:text-primary transition-colors">{content("phoneValue")}</a>
          <div className="text-xs text-muted-foreground 2xl:text-sm">{content("hours")}</div>
        </>
      )
    },
    {
      icon: <Mail className="h-6 w-6 text-primary mb-2 2xl:h-8 2xl:w-8" />,
      title: content("emailUs"),
      content: (
        <>
          <a
            href={`mailto:${content("emailValue")}`}
            className="block max-w-full break-all text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            {content("emailValue")}
          </a>
          <div className="mt-1 text-xs text-muted-foreground">{content("emailNote")}</div>
        </>
      )
    }
  ];

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5 text-primary group-hover:text-brand-black-foreground 2xl:h-6 2xl:w-6 transition-colors duration-300" />, url: safeHttps(content("facebookUrl")), label: "Facebook" },
    { icon: <Instagram className="h-5 w-5 text-primary group-hover:text-brand-black-foreground 2xl:h-6 2xl:w-6 transition-colors duration-300" />, url: safeHttps(content("instagramUrl")), label: "Instagram" },
      ];

  return (
    <section
      id="contact"
      className="w-full py-12 md:py-24 lg:py-32 2xl:py-56 bg-gradient-to-b from-brand-black/95 to-brand-black/90 relative overflow-hidden"
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
          className="absolute top-3/3 right-1/4 w-40 h-40 rounded-full border-2 border-primary/50 will-change-transform"
          animate={prefersReducedMotion ? undefined : { y: [0, -60, 0], x: [0, 40, 0], scale: [1, 1.18, 1] }}
          transition={prefersReducedMotion ? undefined : { duration: 8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          style={{ translateZ: 0 }}
        />
        <motion.div
          className="absolute bottom-3/4 left-3/3 w-72 h-72 rounded-full border-2 border-primary/70 will-change-transform"
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
            <div className="inline-flex items-center justify-center px-4 py-1 mb-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 will-change-transform">
              <MessageSquare className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-primary">{content("title")}</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl lg:text-6xl 2xl:text-7xl text-brand-black-foreground drop-shadow-sm">
              {content("title")}
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-lg/relaxed 2xl:text-xl/relaxed mx-auto">
              {content("subtitle")}
            </p>
          </motion.div>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2 2xl:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="will-change-transform"
            style={{ translateZ: 0 }}
          >
            <Card className="overflow-hidden border-primary/20 bg-brand-black/40 backdrop-blur-md shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 h-full">
              <CardContent className="p-0">
                <iframe
                  src={safeHttps(content("mapUrl"))}
                  width="100%"
                  height="100%"
                  className="aspect-video lg:aspect-square w-full border-0 2xl:min-h-[500px]"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={(cms.mapTitle ?? cms["ContactSection.mapTitle"] ?? "Our Location")}
                  aria-label={(cms.mapAriaLabel ?? cms["ContactSection.mapAriaLabel"] ?? "Map showing our location")}
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="flex flex-col justify-center space-y-8 will-change-transform"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{ translateZ: 0 }}
          >
            <div className="grid gap-6 md:grid-cols-2 2xl:gap-8">
              {contactCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="flex flex-col items-center gap-2 rounded-lg border border-primary/20 p-6 text-center shadow-md shadow-primary/5 hover:shadow-lg hover:shadow-primary/10 bg-brand-black/40 backdrop-blur-md transition-all duration-300 2xl:p-8 will-change-transform"
                  style={{ translateZ: 0 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="will-change-transform"
                    style={{ translateZ: 0 }}
                  >
                    {card.icon}
                  </motion.div>
                  <div className="font-semibold text-brand-black-foreground lg:text-lg 2xl:text-xl">{card.title}</div>
                  <div className="min-w-0 max-w-full text-sm text-muted-foreground 2xl:text-base">
                    {card.content}
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="flex flex-col items-center gap-2 rounded-lg border border-primary/20 p-6 text-center shadow-md shadow-primary/5 hover:shadow-lg hover:shadow-primary/10 bg-brand-black/40 backdrop-blur-md transition-all duration-300 2xl:p-8 will-change-transform"
                style={{ translateZ: 0 }}
              >
                <span className="font-semibold text-brand-black-foreground lg:text-lg 2xl:text-xl">{content("followUs")}</span>
                <div className="flex gap-2 justify-center mt-2 2xl:gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="will-change-transform"
                      style={{ translateZ: 0 }}
                    >
                      <Link
                        href={social.url}
                        aria-label={social.label}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-black/60 border border-primary/30 hover:bg-primary/20 hover:border-primary transition-all duration-300 group "
                      >
                        {social.icon}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}