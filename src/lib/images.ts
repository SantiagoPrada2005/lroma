/**
 * Image URL helper — handles local assets and responsive formats cleanly.
 */
export function getImageUrl(url: string, _width?: number): string {
  return url;
}

/**
 * Backward compatibility alias for components expecting getUnsplashUrl
 */
export const getUnsplashUrl = getImageUrl;
