"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, Globe, Car, Settings2, CalendarClock, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Header");
  const [cmsFields, setCmsFields] = useState<Record<string, string>>({});

  useEffect(() => {
    const controller = new AbortController();
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001").replace(/\/$/, "");
    const params = new URLSearchParams({ language: locale, section: "Header" });
    fetch(`${apiBase}/api/site-content?${params.toString()}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) throw new Error(`CMS request failed: ${response.status}`);
        return response.json();
      })
      .then((data: { fields?: Record<string, string> }) => {
        if (!controller.signal.aborted) setCmsFields(data.fields ?? {});
      })
      .catch(() => {
        if (!controller.signal.aborted) setCmsFields({});
      });
    return () => controller.abort();
  }, [locale]);

  const content = (key: string): string =>
    cmsFields[key] ?? cmsFields[`Header.${key}`] ?? t(key);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if current route is in admin section (client-side only)
  useEffect(() => {
    setIsAdminRoute(pathname.includes('/admin'));
  }, [pathname]);

  const languages = [
    { code: "en", name: "English" },
    { code: "it", name: "Italiano" },
    { code: "es", name: "Español" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Change language and preserve current route
  const changeLanguage = (newLang: string) => {
    router.replace(pathname, { locale: newLang });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 w-full transition-all duration-300
        ${scrolled ? " md:bg-brand-black/95 shadow-lg shadow-primary " : "md:bg-brand-black"}
        bg-brand-black
      `}
      style={{ translateZ: 0 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <motion.div
          className="flex items-center gap-2 will-change-transform"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          style={{ translateZ: 0 }}
        >
          <Link href="/">
            <Image
              src="/logo/LogoHeader.png"
              alt="Logo"
              width={128}
              height={32}
              className="h-8"
              priority
            />
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <motion.div 
            className="flex items-center gap-6 will-change-transform" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            style={{ translateZ: 0 }}
          >
            <div>
              <Link
                href="/"
                className={`text-sm relative overflow-hidden group pb-2 ${pathname === "/" ? "text-primary" : "text-foreground"} will-change-transform`}
              >
                <span className="flex items-center gap-1">
                  <Car className="h-4 w-4 text-primary group-hover:text-primary" />
                  {content("home")}
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            <div>
              <Link
                href="/reservations/create"
                className={`text-sm relative overflow-hidden group pb-2 ${pathname.includes("/reservations/create")
                  ? "text-primary"
                  : "text-foreground"} will-change-transform`}
              >
                <span className="flex items-center gap-1">
                  <CalendarClock className="h-4 w-4 text-primary group-hover:text-primary" />
                  {content("reservations")}
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            <div>
              <Link
                href="/reservations/manage"
                className={`text-sm relative overflow-hidden group pb-2 ${pathname === "/reservations/manage"
                  ? "text-primary"
                  : "text-foreground"} will-change-transform`}
              >
                <span className="flex items-center gap-1">
                  <Settings2 className="h-4 w-4 text-primary group-hover:text-primary" />
                  {content("manage")}
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
            <div>
              <Link href="/services" className={`text-sm flex items-center gap-1 hover:text-primary ${pathname === "/services" ? "text-primary" : "text-foreground"}`}>
                <Tags className="h-4 w-4 text-primary" />{locale === "it" ? "Tariffe e servizi" : locale === "es" ? "Tarifas y servicios" : "Prices & services"}
              </Link>
            </div>
          </motion.div>
          {!isAdminRoute && (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="parking" size="icon" className="bg-brand-black/30 hover:bg-primary/20 border border-primary/20 hover:border-primary transition-colors duration-300">
                    <Globe className="h-5 w-5 text-primary hover:text-brand-black-foreground transition-colors duration-300" />
                    <span className="sr-only">{content("language")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-brand-black/90 backdrop-blur-md border border-primary/30 shadow-lg shadow-primary/20">
                  {languages.map((language) => (
                    <DropdownMenuItem
                      key={language.code}
                      onClick={() => changeLanguage(language.code)}
                      className={`${language.code === locale ? "bg-primary text-brand-black-foreground" : "hover:bg-primary/20"} transition-colors duration-200`}
                    >
                      {language.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          {!isAdminRoute && (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="parking" size="icon" className="bg-brand-black/30 hover:bg-primary/20 border border-primary/20 hover:border-primary transition-colors duration-300">
                    <Globe className="h-5 w-5 text-primary hover:text-brand-black-foreground transition-colors duration-300" />
                    <span className="sr-only">{content("language")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-brand-black/90 backdrop-blur-md border border-primary/30 shadow-lg shadow-primary/20">
                  {languages.map((language) => (
                    <DropdownMenuItem
                      key={language.code}
                      onClick={() => changeLanguage(language.code)}
                      className={`${language.code === locale ? "bg-primary text-brand-black-foreground" : "hover:bg-primary/20"} transition-colors duration-200`}
                    >
                      {language.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="will-change-transform"
            style={{ translateZ: 0 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="bg-brand-black/30 hover:bg-primary/20 border border-primary/20 hover:border-primary transition-colors duration-300"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-primary hover:text-brand-black-foreground transition-colors duration-300" />
              ) : (
                <Menu className="h-6 w-6 text-primary hover:text-brand-black-foreground transition-colors duration-300" />
              )}
            </Button>
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{
            x: isMenuOpen ? 0 : "100%",
            opacity: isMenuOpen ? 1 : 0
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-brand-black/95 to-brand-black/90 border-l border-primary/20 shadow-2xl md:hidden z-40 overflow-hidden will-change-transform`}
          style={{ translateZ: 0 }}
        >
          <nav className="flex flex-col py-8 px-6 h-full">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="self-end mb-8 text-primary hover:text-brand-black-foreground transition-colors will-change-transform"
              onClick={toggleMenu}
              aria-label="Cerrar menú"
              style={{ translateZ: 0 }}
            >
              <X className="h-7 w-7" />
            </motion.button>

            <div className="space-y-6 mt-4">
              <div>
                <Link
                  href="/"
                  className={`py-2 flex items-center gap-2 text-lg font-medium relative overflow-hidden group pb-3 ${pathname === "/" ? "text-primary" : "text-muted-foreground"} will-change-transform`}
                  onClick={toggleMenu}
                >
                  <Car className="h-5 w-5 text-primary group-hover:text-primary" />
                  {content("home")}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>

              <div>
                <Link
                  href="/reservations/create"
                  className={`py-2 flex items-center gap-2 text-lg font-medium relative overflow-hidden group pb-3 ${pathname.includes("/reservations/create")
                    ? "text-primary"
                    : "text-muted-foreground"} will-change-transform`}
                  onClick={toggleMenu}
                >
                  <CalendarClock className="h-5 w-5 text-primary group-hover:text-primary" />
                  {content("reservations")}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>

              <div>
                <Link
                  href="/reservations/manage"
                  className={`py-2 flex items-center gap-2 text-lg font-medium relative overflow-hidden group pb-3 ${pathname === "/reservations/manage"
                    ? "text-primary"
                    : "text-muted-foreground"} will-change-transform`}
                  onClick={toggleMenu}
                >
                  <Settings2 className="h-5 w-5 text-primary group-hover:text-primary" />
                  {content("manage")}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>
            <div>
              <Link href="/services" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 py-2 text-foreground hover:text-primary">
                <Tags className="h-4 w-4 text-primary" />{locale === "it" ? "Tariffe e servizi" : locale === "es" ? "Tarifas y servicios" : "Prices & services"}
              </Link>
            </div>
            </div>
          </nav>
        </motion.div>
      </div>
    </motion.header>
  );
}
