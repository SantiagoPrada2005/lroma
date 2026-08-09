"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { SITE_IMAGES } from "@/config/images";

const galleryImages = SITE_IMAGES.gallery;

type Direction = "next" | "prev";

const variants = {
  enter: (dir: Direction) => ({
    x: dir === "next" ? 80 : -80,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: Direction) => ({
    x: dir === "next" ? -80 : 80,
    opacity: 0,
    scale: 0.95,
  }),
};

export default function GalleryLightbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>("next");

  const total = galleryImages.length;

  // Listen for custom event from MasonryGrid
  useEffect(() => {
    const handler = (e: Event) => {
      const { index } = (e as CustomEvent).detail;
      setDirection("next");
      setCurrentIndex(index);
      setIsOpen(true);
      document.body.style.overflow = "hidden";
    };

    window.addEventListener("gallery:open", handler);
    return () => window.removeEventListener("gallery:open", handler);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "";
  }, []);

  const goTo = useCallback(
    (delta: number) => {
      setDirection(delta > 0 ? "next" : "prev");
      setCurrentIndex((prev) => (prev + delta + total) % total);
    },
    [total]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          close();
          break;
        case "ArrowRight":
          goTo(1);
          break;
        case "ArrowLeft":
          goTo(-1);
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close, goTo]);

  const current = galleryImages[currentIndex];
  if (!current) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label="Visor de imágenes"
        >
          {/* Backdrop */}
          <button
            className="absolute inset-0 bg-black/85 backdrop-blur-xl cursor-default"
            onClick={close}
            aria-hidden="true"
            tabIndex={-1}
          />

          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-6 right-6 z-10 rounded-full bg-white/10 p-3 text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
            aria-label="Cerrar visor"
          >
            <X className="size-5" />
          </button>

          {/* Counter */}
          <div className="absolute top-6 left-6 z-10 rounded-full bg-white/10 px-4 py-2 text-sm text-white/60 backdrop-blur-sm">
            {currentIndex + 1} / {total}
          </div>

          {/* Previous arrow */}
          <button
            onClick={() => goTo(-1)}
            className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white md:left-8"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="size-6" />
          </button>

          {/* Next arrow */}
          <button
            onClick={() => goTo(1)}
            className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white/80 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white md:right-8"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="size-6" />
          </button>

          {/* Image with AnimatePresence */}
          <div className="relative z-0 flex h-full w-full items-center justify-center p-12 md:p-24">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 400, damping: 40 },
                  opacity: { duration: 0.25 },
                  scale: { duration: 0.3 },
                }}
                className="relative max-h-full max-w-full"
              >
                <img
                  src={current.src}
                  alt={current.alt}
                  className="max-h-[80vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
                  loading="eager"
                />
                {/* Caption */}
                <p className="mt-4 text-center text-sm text-white/50">
                  {current.alt}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Swipe hint on mobile */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/25 md:hidden">
            Deslizá para navegar
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
