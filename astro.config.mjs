// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import { loadEnv } from "vite";

// Cargar variables de entorno según el modo actual
const env = loadEnv(process.env.NODE_ENV || "production", process.cwd(), "");

// Dominio canónico del sitio
const site = (
  env.SITE_URL ||
  env.PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  process.env.PUBLIC_SITE_URL ||
  (env.BASE_URL && env.BASE_URL.startsWith("http") ? env.BASE_URL : "") ||
  "https://lroma.innovaweb.pro"
).replace(/\/$/, "");

// Ruta base del router ('/' para la raíz)
const rawBase = env.BASE_PATH || process.env.BASE_PATH || env.BASE_URL || process.env.BASE_URL || "/";
const base = rawBase.startsWith("/") ? rawBase : "/";

// https://astro.build/config
export default defineConfig({
  output: "static",
  site,
  base,
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["gsap", "framer-motion"],
    },
  },
});
