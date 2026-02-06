import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

/**
 * Generate a deterministic avatar using DiceBear
 * Returns an SVG string that can be used with img src
 * @param seed - Any string like username, name, or ID (same seed = same avatar)
 * @returns SVG string as data URI
 */
export function generateAvatar(seed: string): string {
  const avatar = createAvatar(lorelei, {
    seed: seed || 'default',
  });
  return avatar.toDataUri();
}

/**
 * Get avatar URL - returns existing avatar or generates one using DiceBear
 * If avatarUrl exists and is a valid URL, returns it
 * Otherwise generates a new avatar using the fallback seed
 * @param avatarUrl - Existing avatar URL (optional)
 * @param fallbackSeed - Seed to use for generation if no URL provided
 * @returns Avatar URL or generated data URI
 */
export function getAvatarUrl(avatarUrl?: string | null | undefined, fallbackSeed?: string): string {
  // If avatarUrl is provided and is a valid URL string, return it
  if (avatarUrl && typeof avatarUrl === 'string' && avatarUrl.trim().length > 0) {
    return avatarUrl;
  }
  // Otherwise generate a new avatar
  return generateAvatar(fallbackSeed || 'default');
}

/**
 * Check if a URL is a data URI (starts with 'data:')
 */
export function isDataUri(url: string): boolean {
  return url.startsWith('data:');
}
