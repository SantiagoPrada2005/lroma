"use client";

import { useRef, useEffect, useState } from "react";
import { gsap, initGSAP } from "@/lib/gsap";

interface Stat {
  target: number;
  suffix: string;
  label: string;
  prefix?: string;
}

const stats: Stat[] = [
  { target: 10, suffix: "+", label: "años" },
  { target: 50, suffix: "+", label: "platos" },
  { target: 1000, suffix: "+", label: "clientes" },
];

function AnimatedCounter({ stat }: { stat: Stat }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    initGSAP();

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (isReducedMotion) {
      setDisplayValue(stat.target);
      return;
    }

    const el = ref.current;
    if (!el || triggered.current) return;

    const ctx = gsap.context(() => {
      const obj = { value: 0 };

      gsap.to(obj, {
        value: stat.target,
        duration: 2.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            triggered.current = true;
          },
        },
        onUpdate: () => {
          setDisplayValue(Math.round(obj.value));
        },
      });
    }, el);

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85 && !triggered.current) {
      triggered.current = true;
      gsap.to({ value: 0 }, {
        value: stat.target,
        duration: 2.2,
        ease: "power3.out",
        onUpdate: function () {
          const t = this.targets()[0] as { value: number };
          setDisplayValue(Math.round(t.value));
        },
      });
    }

    return () => ctx.revert();
  }, [stat, isReducedMotion]);

  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span
        ref={ref}
        className="font-heading text-[clamp(1.5rem,5.5vw,6.5rem)] font-black leading-none tracking-tight text-lroma-gold"
        aria-label={`${stat.prefix ?? ""}${stat.target}${stat.suffix} ${stat.label}`}
      >
        {isReducedMotion
          ? `${stat.prefix ?? ""}${stat.target}${stat.suffix}`
          : `${stat.prefix ?? ""}${displayValue}${stat.suffix}`}
      </span>
      <span className="text-[10px] font-semibold tracking-[0.15em] sm:text-xs sm:tracking-[0.25em] text-white/40 uppercase">
        {stat.label}
      </span>
    </div>
  );
}

export default function StatsCounter() {
  return (
    <section
      className="relative px-4 py-12 sm:px-6 sm:py-24 md:py-32"
      aria-label="Estadísticas del restaurante"
    >
      {/* Thin gold line — editorial divider */}
      <div className="mx-auto mb-8 h-px w-20 bg-gradient-to-r from-transparent via-lroma-gold/30 to-transparent sm:mb-16 md:mb-20 md:w-40" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* Background gradient — subtle dark depth */}
        <div className="absolute inset-0 rounded-3xl sm:rounded-[4rem] bg-gradient-to-b from-lroma-red/[0.02] via-transparent to-lroma-gold/[0.02]" aria-hidden="true" />

        <div className="relative grid grid-cols-3 items-center justify-items-center gap-2 sm:gap-8 md:flex md:flex-row md:justify-center md:gap-20">
          {stats.map((stat, i) => (
            <AnimatedCounter key={`${stat.label}-${i}`} stat={stat} />
          ))}
        </div>
      </div>

      {/* Bottom thin gold line */}
      <div className="mx-auto mt-8 h-px w-20 bg-gradient-to-r from-transparent via-lroma-gold/30 to-transparent sm:mt-16 md:mt-20 md:w-40" aria-hidden="true" />
    </section>
  );
}
