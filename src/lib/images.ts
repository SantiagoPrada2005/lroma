/**
 * Image URL helper — handles local assets and responsive formats cleanly.
 */
export function getImageUrl(url: string, _width?: number): string {
  if (!url || url.startsWith("http")) return url;
  const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
  // Strip legacy /lroma prefix if base is root
  const cleanedUrl = url.replace(/^\/lroma\//, "/");
  return cleanedUrl.startsWith(base) ? cleanedUrl : `${base}${cleanedUrl.startsWith("/") ? "" : "/"}${cleanedUrl}`;
}

/**
 * Backward compatibility alias for components expecting getUnsplashUrl
 */
export const getUnsplashUrl = getImageUrl;
