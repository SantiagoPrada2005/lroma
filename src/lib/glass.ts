// Glass utilities — exported as a Tailwind plugin
// Provides glass-sm, glass-md, glass-xl utilities
// Respects prefers-reduced-motion: strips backdrop-blur

import plugin from "tailwindcss/plugin";

export const glassPlugin = plugin(function ({ addUtilities }) {
  addUtilities({
    ".glass-sm": {
      backdropFilter: "blur(8px)",
      backgroundColor: "oklch(0 0 0 / 30%)",
      border: "1px solid oklch(1 0 0 / 5%)",
    },
    ".glass-md": {
      backdropFilter: "blur(16px)",
      backgroundColor: "oklch(0 0 0 / 40%)",
      border: "1px solid oklch(1 0 0 / 10%)",
    },
    ".glass-xl": {
      backdropFilter: "blur(24px)",
      backgroundColor: "oklch(0 0 0 / 50%)",
      border: "1px solid oklch(1 0 0 / 15%)",
    },
  });
});

/**
 * Returns the glass utility class name for a given level.
 * Accepts "sm", "md", or "xl".
 */
export function getGlassClass(level: "sm" | "md" | "xl"): string {
  const map: Record<"sm" | "md" | "xl", string> = {
    sm: "glass-sm",
    md: "glass-md",
    xl: "glass-xl",
  };
  return map[level];
}

/**
 * Returns the reduced-motion safe glass class.
 * When prefers-reduced-motion is active, strips backdrop-blur
 * and falls back to a solid background.
 */
export function getGlassClassSafe(level: "sm" | "md" | "xl"): string {
  const safeMap: Record<"sm" | "md" | "xl", string> = {
    sm: "glass-sm motion-safe:backdrop-blur-sm motion-reduce:bg-black/50",
    md: "glass-md motion-safe:backdrop-blur-md motion-reduce:bg-black/60",
    xl: "glass-xl motion-safe:backdrop-blur-xl motion-reduce:bg-black/70",
  };
  return safeMap[level];
}
