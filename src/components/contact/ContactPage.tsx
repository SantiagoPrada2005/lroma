"use client";

import { useEffect, useRef } from "react";
import {
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { initGSAP, gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

initGSAP();

// ─── Data ─────────────────────────────────────────────────────────────────────

const WHATSAPP_URL =
  "https://wa.me/549XXXXXXXXX?text=Hola%20L'Roma!%20Quiero%20informaci%C3%B3n";

const HOURS = [
  { day: "Lunes – Jueves", time: "19:00 – 00:00" },
  { day: "Viernes – Sábado", time: "19:00 – 01:30" },
  { day: "Domingo", time: "19:00 – 00:00" },
] as const;

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=L'Roma+Pizza+Grill+Rosario";

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const scrollCtx = useRef<gsap.Context | null>(null);

  // ── Scroll-triggered animations ─────────────────────────────────────────

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero parallax glow
      gsap.to("[data-hero-glow]", {
        y: 120,
        scale: 0.95,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero]",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Hero content fade
      gsap.to("[data-hero-content]", {
        y: -60,
        opacity: 0,
        ease: "power2.in",
        scrollTrigger: {
          trigger: "[data-hero]",
          start: "top top",
          end: "bottom 55%",
          scrub: 0.6,
        },
      });

      // Scroll indicator fade
      gsap.to("[data-scroll-indicator]", {
        opacity: 0,
        scrollTrigger: {
          trigger: "[data-hero]",
          start: "top top",
          end: "top 30%",
          scrub: true,
        },
      });

      // Bento card reveals
      gsap.fromTo(
        "[data-reveal]",
        {
          y: 60,
          opacity: 0,
          filter: "blur(10px)",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-contact-grid]",
            start: "top 82%",
            toggleActions: "play none none none",
          },
        },
      );

      // Map reveal
      gsap.fromTo(
        "[data-map-reveal]",
        {
          y: 40,
          opacity: 0,
          filter: "blur(8px)",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-map-section]",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    });

    scrollCtx.current = ctx;
    return () => ctx.revert();
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-[100dvh] bg-lroma-black overflow-x-hidden">
      {/* ================================================================
          Atmosphere layer
          ================================================================ */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        {/* Film grain */}
        <div className="absolute inset-0 opacity-[0.022] mix-blend-overlay">
          <svg width="100%" height="100%">
            <filter id="contact-grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#contact-grain)" />
          </svg>
        </div>

        {/* Ambient glows */}
        <div className="absolute -top-[15%] left-[10%] w-[60%] h-[50%] rounded-full bg-lroma-gold/[0.03] blur-[140px]" />
        <div className="absolute top-[30%] -right-[10%] w-[50%] h-[45%] rounded-full bg-lroma-red/[0.03] blur-[130px]" />
        <div className="absolute top-[65%] left-[5%] w-[40%] h-[35%] rounded-full bg-lroma-red/[0.02] blur-[120px]" />
      </div>

      {/* ================================================================
          Hero section
          ================================================================ */}
      <section
        ref={heroRef}
        data-hero
        className="relative z-10 flex min-h-[85dvh] flex-col items-center justify-center px-6 md:min-h-[90dvh]"
      >
        {/* Parallax glow behind hero */}
        <div
          data-hero-glow
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div
            className="w-[min(700px,85vw)] h-[min(500px,55vh)] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(212,168,83,0.08) 0%, rgba(231,49,52,0.04) 40%, transparent 70%)",
            }}
          />
        </div>

        {/* Content */}
        <div data-hero-content className="relative text-center max-w-2xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.05] bg-white/[0.02] backdrop-blur-sm px-4 py-1.5 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-lroma-gold" />
            <span className="text-[11px] font-semibold tracking-[0.3em] text-lroma-gold uppercase">
              Contacto
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-heading text-[clamp(2.8rem,8vw,5.5rem)] leading-[0.92] text-white/95">
            Hablanos
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-white/40 md:text-base">
            Reservá tu mesa, hacé tu pedido, o consultanos lo que necesites.
            Estamos para vos.
          </p>

          {/* Quick-action floating pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full bg-lroma-red px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-lroma-red/90 active:scale-[0.97] shadow-[0_0_24px_rgba(231,49,52,0.3)]"
            >
              <MessageCircle className="size-4" />
              WhatsApp
              <span className="flex size-6 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-px">
                <ArrowUpRight className="size-3" />
              </span>
            </a>
            <a
              href="tel:+549XXXXXXXXX"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm px-5 py-3 text-sm font-medium text-white/70 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white/90"
            >
              <Phone className="size-4" />
              Llamar
            </a>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm px-5 py-3 text-sm font-medium text-white/70 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white/90"
            >
              <MapPin className="size-4" />
              Cómo llegar
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          data-scroll-indicator
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.25em] text-white/25 uppercase">
            Info
          </span>
          <ChevronDown className="size-4 text-white/20 animate-bounce" />
        </div>
      </section>

      {/* ================================================================
          Contact bento grid
          ================================================================ */}
      <section
        data-contact-grid
        className="relative z-10 px-6 pb-24 md:pb-32"
        aria-label="Información de contacto"
      >
        <div className="mx-auto max-w-5xl">
          {/* Section divider */}
          <div className="mb-12 flex items-center gap-3 md:mb-16">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            <span className="text-[11px] font-semibold tracking-[0.25em] text-white/20 uppercase shrink-0">
              Información
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          </div>

          {/* Bento grid */}
          <div className="grid gap-4 md:grid-cols-3 md:gap-5 auto-rows-auto">
            {/* WhatsApp — featured, spans 2 cols */}
            <BentoCard
              className="md:col-span-2 group/whatsapp"
              accent="red"
            >
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col justify-between p-6 md:p-8"
              >
                <div>
                  {/* Icon */}
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-lroma-red/15 ring-1 ring-lroma-red/20">
                    <MessageCircle className="size-5 text-lroma-red" />
                  </span>
                  {/* Content */}
                  <h2 className="mt-5 font-heading text-2xl font-bold text-white/90 md:text-3xl">
                    Contactanos por WhatsApp
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/40">
                    Respondemos en minutos. Pedí, reservá o consultá lo que
                    necesites — directo y sin vueltas.
                  </p>
                </div>
                {/* Inline CTA */}
                <span className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/70 transition-all duration-300 group-hover/whatsapp:bg-lroma-red/20 group-hover/whatsapp:text-white">
                  Abrir chat
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/whatsapp:translate-x-0.5 group-hover/whatsapp:-translate-y-px" />
                </span>
              </a>
            </BentoCard>

            {/* Phone */}
            <BentoCard className="group/phone">
              <a
                href="tel:+549XXXXXXXXX"
                className="flex h-full flex-col justify-between p-6"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-lroma-gold/10 ring-1 ring-lroma-gold/15">
                  <Phone className="size-5 text-lroma-gold" />
                </span>
                <div>
                  <p className="text-xs font-medium tracking-wide text-white/30 uppercase">
                    Teléfono
                  </p>
                  <p className="mt-1 font-heading text-xl font-bold text-white/85 transition-colors duration-300 group-hover/phone:text-lroma-gold md:text-2xl">
                    +54 9 XXX XXX-XXXX
                  </p>
                  <p className="mt-2 text-xs text-white/25 transition-colors duration-300 group-hover/phone:text-white/40">
                    Tocá para llamar →
                  </p>
                </div>
              </a>
            </BentoCard>

            {/* Address */}
            <BentoCard className="group/map">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col justify-between p-6"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-lroma-gold/10 ring-1 ring-lroma-gold/15">
                  <MapPin className="size-5 text-lroma-gold" />
                </span>
                <div>
                  <p className="text-xs font-medium tracking-wide text-white/30 uppercase">
                    Dirección
                  </p>
                  <p className="mt-1 text-base font-semibold text-white/80 leading-snug">
                    Av. Siempre Viva 742
                  </p>
                  <p className="text-sm text-white/35">Rosario, Santa Fe</p>
                  <p className="mt-2 text-xs text-white/25 transition-colors duration-300 group-hover/map:text-white/40">
                    Ver en Google Maps →
                  </p>
                </div>
              </a>
            </BentoCard>

            {/* Hours — spans 2 cols on desktop */}
            <BentoCard className="md:col-span-2">
              <div className="flex h-full flex-col p-6 md:p-7">
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-lroma-gold/10 ring-1 ring-lroma-gold/15">
                  <Clock className="size-5 text-lroma-gold" />
                </span>
                <div className="mt-5 flex-1">
                  <p className="text-xs font-medium tracking-wide text-white/30 uppercase">
                    Horarios
                  </p>
                  <div className="mt-3 space-y-0">
                    {HOURS.map((row, i) => (
                      <div
                        key={row.day}
                        className={cn(
                          "flex items-center justify-between py-3",
                          i < HOURS.length - 1 &&
                            "border-b border-white/[0.04]",
                        )}
                      >
                        <span className="text-sm text-white/60">
                          {row.day}
                        </span>
                        <span className="text-sm font-semibold text-white/85 tabular-nums">
                          {row.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </BentoCard>

            {/* Social */}
            <BentoCard>
              <div className="flex h-full flex-col justify-between p-6">
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-lroma-gold/10 ring-1 ring-lroma-gold/15">
                  <Sparkles className="size-5 text-lroma-gold" />
                </span>
                <div>
                  <p className="text-xs font-medium tracking-wide text-white/30 uppercase">
                    Redes
                  </p>
                  <div className="mt-3 flex gap-2">
                    <a
                      href="https://instagram.com/lromapizza"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-white/40 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white/80"
                      aria-label="Instagram"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect
                          width="20"
                          height="20"
                          x="2"
                          y="2"
                          rx="5"
                          ry="5"
                        />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                    </a>
                    <a
                      href="https://facebook.com/lromapizza"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-white/40 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white/80"
                      aria-label="Facebook"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ================================================================
          Map section
          ================================================================ */}
      <section
        data-map-section
        className="relative z-10 border-t border-white/[0.04] px-6 pb-24 md:pb-36"
        aria-labelledby="map-heading"
      >
        <div className="mx-auto max-w-5xl">
          {/* Section header */}
          <div className="mb-10 text-center md:mb-14">
            <h2
              id="map-heading"
              className="font-heading text-2xl text-white/90 md:text-3xl"
            >
              Dónde estamos
            </h2>
            <div
              className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-lroma-gold/30 to-transparent"
              aria-hidden="true"
            />
          </div>

          {/* Map card */}
          <div data-map-reveal>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group/map-link relative block overflow-hidden"
            >
              {/* Double-bezel frame */}
              <div className="rounded-3xl p-[1px] bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-transparent transition-shadow duration-500 group-hover/map-link:shadow-[0_0_40px_rgba(212,168,83,0.06)]">
                <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[calc(1.5rem-1px)] bg-black/50 backdrop-blur-sm md:aspect-[21/8]">
                  {/* Grid pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                    aria-hidden="true"
                  />

                  {/* Animated pin */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative flex flex-col items-center">
                      {/* Pulse ring */}
                      <div className="absolute size-16 rounded-full bg-lroma-red/15 animate-ping" />
                      {/* Pin icon */}
                      <svg
                        className="relative size-10 text-lroma-red drop-shadow-[0_0_8px_rgba(231,49,52,0.4)] transition-transform duration-500 group-hover/map-link:scale-110"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                    </div>
                  </div>

                  {/* Address overlay */}
                  <div className="absolute bottom-4 left-4 rounded-2xl border border-white/[0.06] bg-black/70 backdrop-blur-md px-5 py-3.5 md:bottom-6 md:left-6">
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-lroma-gold/70 uppercase">
                      Rosario, Santa Fe
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white/85 md:text-base">
                      Av. Siempre Viva 742
                    </p>
                    <p className="mt-1.5 text-xs text-white/30 transition-colors duration-300 group-hover/map-link:text-white/50">
                      Abrir en Google Maps →
                    </p>
                  </div>

                  {/* Subtle scan line effect */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
                    }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BentoCard — reusable glass card for the bento grid
// ═══════════════════════════════════════════════════════════════════════════════

function BentoCard({
  children,
  className,
  accent,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: "red" | "gold";
}) {
  const borderGradient =
    accent === "red"
      ? "from-lroma-red/[0.08] via-white/[0.05] to-transparent"
      : "from-white/[0.06] via-white/[0.03] to-transparent";

  const shadowHover =
    accent === "red"
      ? "group-hover:shadow-[0_0_30px_rgba(231,49,52,0.08)]"
      : "group-hover:shadow-[0_0_30px_rgba(255,255,255,0.03)]";

  return (
    <div data-reveal className={cn("group flex flex-col", className)}>
      {/* Outer bezel */}
      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden rounded-3xl p-[1px] bg-gradient-to-br transition-shadow duration-500",
          borderGradient,
          shadowHover,
        )}
      >
        {/* Inner core */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-[calc(1.5rem-1px)] bg-black/40 backdrop-blur-md transition-all duration-500 group-hover:-translate-y-0.5 group-hover:bg-black/50">
          {children}
        </div>
      </div>
    </div>
  );
}
