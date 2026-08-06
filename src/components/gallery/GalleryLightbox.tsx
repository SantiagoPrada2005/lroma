"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  src: string;
  alt: string;
}

const galleryImages: GalleryImage[] = [
  {
    src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&fm=webp&fit=crop&q=90",
    alt: "Chef preparando pizza artesanal en horno de leña",
  },
  {
    src: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1600&fm=webp&fit=crop&q=90",
    alt: "Pizza Margherita con albahaca fresca",
  },
  {
    src: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1600&fm=webp&fit=crop&q=90",
    alt: "Baby beef jugoso con papas rústicas",
  },
  {
    src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&fm=webp&fit=crop&q=90",
    alt: "Hamburguesa gourmet con queso cheddar",
  },
  {
    src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&fm=webp&fit=crop&q=90",
    alt: "Ambiente cálido del restaurante",
  },
  {
    src: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=1600&fm=webp&fit=crop&q=90",
    alt: "Pasta carbonara con panceta",
  },
  {
    src: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1600&fm=webp&fit=crop&q=90",
    alt: "Ingredientes frescos y coloridos",
  },
  {
    src: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1600&fm=webp&fit=crop&q=90",
    alt: "Cóctel artesanal con decoración cítrica",
  },
  {
    src: "https://images.unsplash.com/photo-1574915371488-6fc8b03ff8a3?w=1600&fm=webp&fit=crop&q=90",
    alt: "Bife de chorizo a la parrilla",
  },
  {
    src: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=1600&fm=webp&fit=crop&q=90",
    alt: "Picada con quesos y fiambres",
  },
];

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
