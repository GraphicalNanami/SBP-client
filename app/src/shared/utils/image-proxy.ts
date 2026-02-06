/**
 * Image Proxy Utility
 * Handles proxying images from ngrok URLs to bypass browser warnings
 */

/**
 * Check if URL is from ngrok
 */
function isNgrokUrl(url: string): boolean {
  return url.includes('ngrok-free.app') || url.includes('ngrok.io');
}

/**
 * Convert ngrok image URL to proxied URL
 * Bypasses ngrok browser warning by routing through our proxy endpoint
 */
export function getProxiedImageUrl(imageUrl: string | undefined | null): string {
  if (!imageUrl) return '';

  // If it's an ngrok URL, proxy it
  if (isNgrokUrl(imageUrl)) {
    return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
  }

  // Otherwise return as-is
  return imageUrl;
}
