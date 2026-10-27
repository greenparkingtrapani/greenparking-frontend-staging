"use client"
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const [cmsFields, setCmsFields] = useState<Record<string, string>>({});

  useEffect(() => {
    const controller = new AbortController();
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001").replace(/\/$/, "");
    const params = new URLSearchParams({ language: locale, section: "Footer" });

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

  const rights = cmsFields["Footer.rights"] ?? cmsFields["rights"] ?? t("rights");
  return (
    <footer className="bg-gradient-to-b from-brand-black/90 to-brand-black backdrop-blur-md border-t border-primary/10 py-6 md:py-0">
      <div className="container flex justify-center items-center gap-4 md:h-16 md:flex-row">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center "
        >
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-center">
            &copy; {new Date().getFullYear()} Green Parking. {rights}.
          </p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex items-center gap-2 text-xs text-muted-foreground/60 hover:text-muted-foreground/80 transition-colors"
          >
            <span>Created with</span>
            <motion.div 
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Heart className="h-3 w-3 text-primary/70 fill-primary/70" />
            </motion.div>
            <span>by <Link href="https://god.com.ar/" className="underline hover:text-primary"><strong><span className="text-brand-black-foreground">GO</span><span className="text-chart-4">D</span></strong></Link></span>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
