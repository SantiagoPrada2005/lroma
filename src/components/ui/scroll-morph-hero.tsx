"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
  src: string;
  index: number;
  total: number;
  phase: AnimationPhase;
  target: { x: number; y: number; rotation: number; scale: number; opacity: number };
  label: string;
}

// --- FlipCard Component ---
const IMG_WIDTH = 60;
const IMG_HEIGHT = 85;

function FlipCard({ src, target, label }: FlipCardProps) {
  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{ type: "spring", stiffness: 40, damping: 15 }}
      style={{
        position: "absolute",
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className="group cursor-pointer"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180 }}
      >
        {/* Front Face — food image */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg border border-white/10"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={src}
            alt={label}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-transparent" />
        </div>

        {/* Back Face — L'Roma branding */}
        <div
          className="absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-lroma-red/30 bg-[#0A0A0A] p-1 shadow-lg"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-center">
            <p className="text-[7px] font-bold uppercase tracking-widest text-lroma-red">
              L'ROMA
            </p>
            <p className="text-[9px] font-medium text-white/70">{label}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Main Hero Component ---
const TOTAL_IMAGES = 20;
const MAX_SCROLL = 600;

// L'Roma food photography — Unsplash
const IMAGES = [
  { src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&q=80", label: "Pizza" },
  { src: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&q=80", label: "Grill" },
  { src: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300&q=80", label: "Pasta" },
  { src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80", label: "Burger" },
  { src: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&q=80", label: "Pizza" },
  { src: "https://images.unsplash.com/photo-1625938145744-e380515399b7?w=300&q=80", label: "Picada" },
  { src: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=300&q=80", label: "Lasaña" },
  { src: "https://images.unsplash.com/photo-1558030006-450675393462?w=300&q=80", label: "Cocina" },
  { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=80", label: "Plato" },
  { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80", label: "Carne" },
  { src: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=300&q=80", label: "Pasta" },
  { src: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=300&q=80", label: "Comida" },
  { src: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=300&q=80", label: "Resto" },
  { src: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&q=80", label: "Chef" },
  { src: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=300&q=80", label: "Grill" },
  { src: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&q=80", label: "Ensalada" },
  { src: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&q=80", label: "Waffle" },
  { src: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=300&q=80", label: "Postre" },
  { src: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=300&q=80", label: "Burger" },
  { src: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=300&q=80", label: "Cocina" },
];

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

interface ScrollMorphHeroProps {
  className?: string;
}

export function ScrollMorphHero({ className }: ScrollMorphHeroProps) {
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    };
    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);
    setContainerSize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    });
    return () => observer.disconnect();
  }, []);

  const virtualScroll = useMotionValue(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const current = scrollRef.current;
      const next = current + e.deltaY;

      // Only capture scroll when inside virtual bounds.
      // At 0 (top) or MAX_SCROLL (bottom), let the event pass to page scroll.
      if (next > 0 && next < MAX_SCROLL) {
        e.preventDefault();
        scrollRef.current = Math.min(Math.max(next, 0), MAX_SCROLL);
        virtualScroll.set(scrollRef.current);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;
      const current = scrollRef.current;
      const next = current + deltaY;

      if (next > 0 && next < MAX_SCROLL) {
        e.preventDefault();
        scrollRef.current = Math.min(Math.max(next, 0), MAX_SCROLL);
        virtualScroll.set(scrollRef.current);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [virtualScroll]);

  const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });
  const scrollRotate = useTransform(virtualScroll, [200, 1000], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      mouseX.set(((relativeX / rect.width) * 2 - 1) * 100);
    };
    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX]);

  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase("line"), 500);
    const t2 = setTimeout(() => setIntroPhase("circle"), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const scatterPositions = useMemo(() => {
    return IMAGES.map(() => ({
      x: (Math.random() - 0.5) * 1500,
      y: (Math.random() - 0.5) * 1000,
      rotation: (Math.random() - 0.5) * 180,
      scale: 0.6,
      opacity: 0,
    }));
  }, []);

  const [morphValue, setMorphValue] = useState(0);
  const [rotateValue, setRotateValue] = useState(0);
  const [parallaxValue, setParallaxValue] = useState(0);

  useEffect(() => {
    const u1 = smoothMorph.on("change", setMorphValue);
    const u2 = smoothScrollRotate.on("change", setRotateValue);
    const u3 = smoothMouseX.on("change", setParallaxValue);
    return () => { u1(); u2(); u3(); };
  }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

  const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
  const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full w-full overflow-hidden bg-[#0A0A0A]", className)}
    >
      <div className="flex h-full w-full flex-col items-center justify-center perspective-1000">
        {/* Intro Logo — L'Roma branding, fades out */}
        <div className="pointer-events-none absolute top-1/2 z-0 flex -translate-y-1/2 flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={
              introPhase === "circle" && morphValue < 0.5
                ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" }
                : { opacity: 0, filter: "blur(10px)" }
            }
            transition={{ duration: 1 }}
            className="flex items-center justify-center"
          >
            <picture>
              <source srcSet="/img/logo.avif" type="image/avif" />
              <source srcSet="/img/logo.webp" type="image/webp" />
              <img
                src="/img/logo.webp"
                alt="L'Roma Pizza & Grill"
                className="h-30 w-auto object-contain drop-shadow-2xl md:h-44"
              />
            </picture>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={
              introPhase === "circle" && morphValue < 0.5
                ? { opacity: 0.5 - morphValue }
                : { opacity: 0 }
            }
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-6 text-[10px] font-bold tracking-[0.2em] text-white/40"
          >
            DESLIZÁ PARA EXPLORAR
          </motion.p>
        </div>

        {/* Arc Content — fades in when arc forms */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="pointer-events-none absolute top-[8%] z-10 flex flex-col items-center justify-center px-4 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-lroma-gold/30 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-lroma-gold">
            Nuestra Cocina
          </span>
          <h2 className="font-heading text-3xl font-bold text-white md:text-5xl">
            Descubrí L&apos;Roma
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/60 md:text-base">
            Donde la pizza artesanal se encuentra con la parrilla.{" "}
            <br className="hidden md:block" />
            Una experiencia gastronómica que despierta los sentidos.
          </p>
          <a
            href="/menu"
            className="pointer-events-auto mt-6 inline-flex items-center gap-2 rounded-full bg-lroma-red px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-lroma-red/20 transition-all hover:bg-lroma-red/90"
          >
            Ver Menú
          </a>
        </motion.div>

        {/* Image container */}
        <div className="relative flex h-full w-full items-center justify-center">
          {IMAGES.slice(0, TOTAL_IMAGES).map((img, i) => {
            let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

            if (introPhase === "scatter") {
              target = scatterPositions[i];
            } else if (introPhase === "line") {
              const spacing = 70;
              const totalWidth = TOTAL_IMAGES * spacing;
              const lineX = i * spacing - totalWidth / 2;
              target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
            } else {
              const isMobile = containerSize.width < 768;
              const minDim = Math.min(containerSize.width, containerSize.height);
              const circleRadius = Math.min(minDim * 0.35, 350);
              const circleAngle = (i / TOTAL_IMAGES) * 360;
              const circleRad = (circleAngle * Math.PI) / 180;
              const circlePos = {
                x: Math.cos(circleRad) * circleRadius,
                y: Math.sin(circleRad) * circleRadius,
                rotation: circleAngle + 90,
              };

              const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
              const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);
              const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25);
              const arcCenterY = arcApexY + arcRadius;
              const spreadAngle = isMobile ? 100 : 130;
              const startAngle = -90 - spreadAngle / 2;
              const step = spreadAngle / (TOTAL_IMAGES - 1);

              const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
              const maxRotation = spreadAngle * 0.8;
              const boundedRotation = -scrollProgress * maxRotation;
              const currentArcAngle = startAngle + i * step + boundedRotation;
              const arcRad = (currentArcAngle * Math.PI) / 180;
              const arcPos = {
                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                rotation: currentArcAngle + 90,
                scale: isMobile ? 1.4 : 1.8,
              };

              target = {
                x: lerp(circlePos.x, arcPos.x, morphValue),
                y: lerp(circlePos.y, arcPos.y, morphValue),
                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                scale: lerp(1, arcPos.scale, morphValue),
                opacity: 1,
              };
            }

            return (
              <FlipCard
                key={i}
                src={img.src}
                label={img.label}
                index={i}
                total={TOTAL_IMAGES}
                phase={introPhase}
                target={target}
              />
            );
          })}
        </div>

        {/* Scroll indicator — appears when arc is formed, fades at bottom */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">
              Seguí bajando
            </span>
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              className="text-white/30"
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default ScrollMorphHero;
