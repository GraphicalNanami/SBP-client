'use client';

import Image from 'next/image';
import { getAvatarUrl, isDataUri } from '@/src/shared/utils/avatar';

interface AvatarProps {
  src?: string | null;
  alt: string;
  seed: string;
  className?: string;
  size?: number;
}

/**
 * Avatar component that handles both external URLs and DiceBear-generated data URIs
 * Uses Next.js Image for external URLs and regular img for data URIs
 */
export function Avatar({ src, alt, seed, className = '', size = 40 }: AvatarProps) {
  const avatarUrl = getAvatarUrl(src, seed);
  const isDataUrl = isDataUri(avatarUrl);

  // For data URIs, use regular img tag since Next.js Image doesn't support them
  if (isDataUrl) {
    return (
      <img
        src={avatarUrl}
        alt={alt}
        className={className}
        style={{ width: size, height: size }}
      />
    );
  }

  // For external URLs, use Next.js Image component
  return (
    <Image
      src={avatarUrl}
      alt={alt}
      fill
      className={className}
    />
  );
}
