"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

const NAV_LINKS = [
  { href: `${base}/menu`, label: "Menú" },
  { href: `${base}/gallery`, label: "Galería" },
  { href: `${base}/about`, label: "Nosotros" },
  { href: `${base}/contact`, label: "Contacto" },
];

export default function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ============================================
          Desktop — Floating Glass Pill
          ============================================ */}
      <nav
        className={cn(
          "fixed left-1/2 top-6 z-50 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 px-2 py-2 backdrop-blur-md transition-all duration-500 md:flex",
          scrolled
            ? "bg-black/60 shadow-lg shadow-black/20"
            : "bg-black/40"
        )}
        role="navigation"
        aria-label="Navegación principal"
      >
        {/* Logo mark */}
        <a
          href={base || "/"}
          className="mr-3 flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold text-white transition-colors hover:text-lroma-red"
        >
          L&apos;ROMA
        </a>

        <div className="h-5 w-px bg-white/10" />

        {/* Nav links */}
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="rounded-full px-4 py-1.5 text-sm font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white"
          >
            {link.label}
          </a>
        ))}

        <div className="h-5 w-px bg-white/10" />

        {/* WhatsApp CTA */}
        <a
          href="https://wa.me/549XXXXXXXXX?text=Hola%20L'Roma!%20Quiero%20hacer%20un%20pedido"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full bg-lroma-red px-4 py-1.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-lroma-red/90 hover:shadow-lg hover:shadow-lroma-red/20"
        >
          <MessageCircle className="size-4" data-icon="inline-start" />
          WhatsApp
        </a>
      </nav>

      {/* ============================================
          Mobile — Hamburger → Sheet overlay
          ============================================ */}
      <div className="fixed right-4 top-4 z-50 md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60"
                aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen ? (
                    <motion.div
                      key="x"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="size-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="hamburger"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="size-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            }
          />
          <SheetContent
            side="left"
            className="w-full border-none bg-black/90 backdrop-blur-xl p-0"
          >
            <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
            <nav
              className="flex h-full flex-col items-center justify-center gap-6"
              role="navigation"
              aria-label="Navegación móvil"
            >
              {/* Logo */}
              <motion.a
                href={base || "/"}
                className="mb-8 text-2xl font-bold text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: mobileOpen ? 1 : 0, y: mobileOpen ? 0 : 20 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                onClick={() => setMobileOpen(false)}
              >
                L&apos;ROMA
              </motion.a>

              {/* Staggered links */}
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="text-xl font-light text-white/70 transition-colors hover:text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: mobileOpen ? 1 : 0,
                    y: mobileOpen ? 0 : 20,
                  }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}

              {/* Mobile WhatsApp CTA */}
              <motion.a
                href="https://wa.me/549XXXXXXXXX?text=Hola%20L'Roma!%20Quiero%20hacer%20un%20pedido"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-lroma-red px-8 py-3 text-base font-semibold text-white shadow-lg shadow-lroma-red/20 transition-all hover:bg-lroma-red/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: mobileOpen ? 1 : 0,
                  y: mobileOpen ? 0 : 20,
                }}
                transition={{ delay: 0.55, duration: 0.4 }}
                onClick={() => setMobileOpen(false)}
              >
                <MessageCircle className="size-5" />
                Pedir por WhatsApp
              </motion.a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
