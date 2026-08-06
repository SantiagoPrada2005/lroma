"use client";

import { useRef, useEffect } from "react";
import { gsap, initGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface GsapRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  distance?: number;
  blur?: boolean;
}

const directionMap = {
  up: { y: 60 },
  down: { y: -60 },
  left: { x: 60 },
  right: { x: -60 },
};

export default function GsapReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 1,
  distance,
  blur = true,
}: GsapRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initGSAP();
    const el = ref.current;
    if (!el) return;

    const dir = directionMap[direction];
    const dist = distance ?? (direction === "up" || direction === "down" ? 60 : 60);

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      ...(dir.x ? { x: dist } : { y: dist }),
      ...(blur ? { filter: "blur(8px)" } : {}),
    };

    const toVars: gsap.TweenVars = {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(el, fromVars, toVars);
    }, el);

    return () => ctx.revert();
  }, [direction, delay, duration, distance, blur]);

  return (
    <div ref={ref} className={cn(className)} style={{ willChange: "transform, opacity, filter" }}>
      {children}
    </div>
  );
}
