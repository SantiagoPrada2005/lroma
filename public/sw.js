/**
 * L'Roma Pizza & Grill — Service Worker
 *
 * Estrategia de cache nivel 2:
 *  1. Páginas HTML → NetworkFirst (3s timeout, fallback a cache, 1 día)
 *  2. Imágenes locales → CacheFirst (30 días)
 *  3. Imágenes Unsplash → StaleWhileRevalidate (7 días)
 *  4. Fuentes → CacheFirst (1 año)
 *
 * Workbox se carga desde CDN para no depender de plugins de build.
 */

// ---------------------------------------------------------------------------
// Carga Workbox desde CDN
// ---------------------------------------------------------------------------
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js",
);

// ---------------------------------------------------------------------------
// Configuración de Workbox
// ---------------------------------------------------------------------------
workbox.setConfig({
  debug: false,
});

const { strategies, routing, expiration } = workbox;

// Sin precaching de páginas HTML — usamos NetworkFirst en runtime
// para que cambios en menú, horarios o contenido se reflejen sin
// necesidad de actualizar el service worker.

// ---------------------------------------------------------------------------
// Estrategias de runtime caching
// ---------------------------------------------------------------------------

// 1. Imágenes locales — CacheFirst
routing.registerRoute(
  ({ url }) =>
    /\.(webp|avif|jpe?g|png|svg|ico)$/i.test(url.pathname) &&
    url.origin === self.location.origin,
  new strategies.CacheFirst({
    cacheName: "images-local",
    plugins: [
      new expiration.ExpirationPlugin({
        maxEntries: 150,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
      }),
    ],
  }),
);

// 3. Fuentes — CacheFirst
routing.registerRoute(
  ({ url }) =>
    /\.(woff2?|ttf|otf|eot)$/i.test(url.pathname) &&
    url.origin === self.location.origin,
  new strategies.CacheFirst({
    cacheName: "fonts",
    plugins: [
      new expiration.ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 año
      }),
    ],
  }),
);

// 4. Navegación (HTML) — NetworkFirst, fallback a cache
routing.registerRoute(
  ({ request }) => request.mode === "navigate",
  new strategies.NetworkFirst({
    cacheName: "pages",
    networkTimeoutSeconds: 3,
    plugins: [
      new expiration.ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 24 * 60 * 60, // 1 día
      }),
    ],
  }),
);

// 5. Google Fonts (por si acaso) — StaleWhileRevalidate
routing.registerRoute(
  ({ url }) =>
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com",
  new strategies.StaleWhileRevalidate({
    cacheName: "google-fonts",
    plugins: [
      new expiration.ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 365 * 24 * 60 * 60,
      }),
    ],
  }),
);

// 6. JS y CSS del build — StaleWhileRevalidate
// (los bundles tienen hash en el nombre, así que son inmutables)
routing.registerRoute(
  ({ url }) =>
    /\.(js|css)$/i.test(url.pathname) &&
    url.origin === self.location.origin,
  new strategies.StaleWhileRevalidate({
    cacheName: "static-assets",
    plugins: [
      new expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  }),
);

// ---------------------------------------------------------------------------
// Activación inmediata al actualizar
// ---------------------------------------------------------------------------
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
