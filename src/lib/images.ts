/**
 * Unsplash URL helper — resizes images by modifying the `w` query parameter.
 * Strips existing w= and appends the desired width.
 *
 * Example:
 *   getUnsplashUrl("https://images.unsplash.com/photo-XXX?w=800&fm=webp", 400)
 *   => "https://images.unsplash.com/photo-XXX?fm=webp&w=400"
 */
export function getUnsplashUrl(url: string, width: number): string {
  try {
    const u = new URL(url);
    // Remove existing w param, then set the new width and modern format parameters
    u.searchParams.delete("w");
    u.searchParams.set("w", String(width));
    u.searchParams.set("auto", "format");
    u.searchParams.set("q", "75");
    return u.toString();
  } catch {
    // If URL parsing fails, return as-is
    return url;
  }
}
