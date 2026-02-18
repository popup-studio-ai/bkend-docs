const IMAGE_CDN_URL = "https://img.bkend.ai";
const RAW_CDN_PREFIX = "https://cdn.bkend.ai/";

export interface ImageTransform {
  width?: number;
  height?: number;
  quality?: number;
  format?: "webp" | "jpeg" | "png";
  fit?: "contain" | "cover";
}

/**
 * Convert an S3 key or URL to an optimized CDN image URL.
 * - cdn.bkend.ai URLs are converted to img.bkend.ai with transforms
 * - Other external URLs (blob, picsum, etc.) pass through unchanged
 * - S3 keys are transformed to img.bkend.ai CDN URLs
 */
export function getOptimizedImageUrl(
  src: string | undefined | null,
  transform?: ImageTransform
): string | undefined {
  if (!src) return undefined;

  // Extract S3 key from cdn.bkend.ai URL
  let key = src;
  if (src.startsWith(RAW_CDN_PREFIX)) {
    key = src.slice(RAW_CDN_PREFIX.length);
  } else if (src.includes("://")) {
    // Other external/blob URLs — pass through
    return src;
  }

  // Build CDN URL from S3 key
  const parts: string[] = [];

  if (transform?.width || transform?.height) {
    const w = transform.width ?? 0;
    const h = transform.height ?? 0;
    if (transform.fit === "cover") {
      parts.push(`${w}x${h}/smart`);
    } else {
      parts.push(`fit-in/${w}x${h}`);
    }
  }

  const filters: string[] = [];
  if (transform?.quality) filters.push(`quality(${transform.quality})`);
  if (transform?.format) filters.push(`format(${transform.format})`);
  if (filters.length > 0) {
    parts.push(`filters:${filters.join(":")}`);
  }

  const path = parts.length > 0 ? `${parts.join("/")}/${key}` : key;
  return `${IMAGE_CDN_URL}/${path}`;
}

export const IMAGE_PRESETS = {
  /** Product card thumbnail (400x400) */
  thumbnail: { width: 400, height: 400, quality: 80, format: "webp" } as ImageTransform,
  /** Product gallery main image (800x800) */
  gallery: { width: 800, height: 800, quality: 85, format: "webp" } as ImageTransform,
  /** Cart item image (128x128) */
  cartItem: { width: 128, height: 128, quality: 75, format: "webp" } as ImageTransform,
  /** Profile avatar (192x192 retina, smart crop) */
  avatar: { width: 192, height: 192, quality: 80, fit: "cover", format: "webp" } as ImageTransform,
} as const;
