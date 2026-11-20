/**
 * Legacy Cache Storage buckets that previously stored opaque (status 0)
 * third-party image responses under a CacheFirst strategy, which caused
 * Chrome/Android Cache API quota inflation (~7MB per opaque image) and
 * disappearing product photos on repeat visits.
 */
export const LEGACY_POISONED_IMAGE_CACHES = ['unsplash-images-cache'] as const;

/**
 * Self-contained branded SVG data URI fallback for NADI.
 * 100% local (zero external network calls) so broken external URLs never
 * render blank frames or trigger infinite onError retry loops.
 */
export const NADI_LOCAL_IMAGE_FALLBACK =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 720" width="600" height="720" role="img" aria-label="NADI">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FAF7FC"/>
          <stop offset="55%" stop-color="#F2ECF8"/>
          <stop offset="100%" stop-color="#E9DFF4"/>
        </linearGradient>
      </defs>
      <rect width="600" height="720" fill="url(#bg)"/>
      <rect x="28" y="28" width="544" height="664" rx="28" fill="none" stroke="#5A3E7A" stroke-opacity="0.16" stroke-width="2"/>
      <circle cx="300" cy="310" r="68" fill="#5A3E7A" fill-opacity="0.08"/>
      <path d="M300 264c19 26 32 45 32 62a32 32 0 1 1-64 0c0-17 13-36 32-62Z" fill="none" stroke="#5A3E7A" stroke-opacity="0.55" stroke-width="3.5" stroke-linejoin="round"/>
      <text x="300" y="426" text-anchor="middle" font-family="Georgia, serif" font-size="30" font-weight="700" letter-spacing="8" fill="#5A3E7A" fill-opacity="0.72">NADI</text>
      <text x="300" y="462" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#64748B">Botanical Skincare</text>
    </svg>`
  );

/**
 * Safely swaps a failed <img> to the local branded SVG fallback exactly once,
 * preventing infinite error-retry loops on offline or restricted mobile networks.
 */
export function handleImageLoadError(
  img: HTMLImageElement,
  fallbackSrc: string = NADI_LOCAL_IMAGE_FALLBACK
): void {
  if (img.dataset.fallbackApplied === 'true') {
    img.onerror = null;
    return;
  }
  img.dataset.fallbackApplied = 'true';
  img.onerror = null;
  img.src = fallbackSrc;
}

/**
 * Purges legacy poisoned PWA image caches on startup so phones that previously
 * cached broken opaque Unsplash responses recover automatically without manual cache clearing.
 */
export async function purgeLegacyImageCaches(): Promise<string[]> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return [];
  }

  const deleted: string[] = [];
  try {
    const cacheNames = await window.caches.keys();
    for (const cacheName of cacheNames) {
      const shouldPurge =
        (LEGACY_POISONED_IMAGE_CACHES as readonly string[]).includes(cacheName) ||
        cacheName.toLowerCase().includes('unsplash');
      if (shouldPurge) {
        const removed = await window.caches.delete(cacheName);
        if (removed) deleted.push(cacheName);
      }
    }
  } catch {
    // Gracefully ignore restricted/private browser contexts where Cache API is blocked
  }

  return deleted;
}
