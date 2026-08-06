import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let initialized = false;

export function initGSAP(): void {
  if (initialized) return;
  initialized = true;

  // Register ScrollTrigger once
  gsap.registerPlugin(ScrollTrigger);

  // Prefers-reduced-motion guard
  if (typeof window !== "undefined") {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (prefersReducedMotion.matches) {
      gsap.globalTimeline.pause();
    }

    // Re-evaluate on change
    prefersReducedMotion.addEventListener("change", (e) => {
      if (e.matches) {
        gsap.globalTimeline.pause();
      } else {
        gsap.globalTimeline.resume();
      }
    });

    // Responsive breakpoints via matchMedia
    gsap.matchMedia();
  }
}

export { gsap, ScrollTrigger };
