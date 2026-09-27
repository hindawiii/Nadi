/**
 * Golden Store Registry & Stability Shield
 * 
 * Provides:
 * 1. Deep Object Freezing & Immutability Lock for baseline texts, branding, and core products.
 * 2. Golden Snapshot Creation (save current verified state to secure persistent storage).
 * 3. One-Click Instant Rollback / Restore to the Golden State.
 * 4. Self-Healing Schema Validator (defensive fallback for missing product keys, malformed prices, etc.).
 */

import { SiteConfig, siteConfig, Product } from './siteConfig';

export const GOLDEN_STORAGE_KEY_SNAPSHOT = 'luxe_golden_snapshot_v1';
export const GOLDEN_STORAGE_KEY_LOCKED = 'luxe_golden_locked_state_v1';

/**
 * Deep freezes an object recursively to guarantee total runtime immutability.
 */
export function deepFreeze<T>(obj: T): Readonly<T> {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Freeze properties first
  const propNames = Object.getOwnPropertyNames(obj);
  for (const name of propNames) {
    const value = (obj as any)[name];
    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  }

  return Object.freeze(obj);
}

/**
 * The Unalterable Baseline (Golden Source of Truth).
 * Deeply frozen to prevent prompt drift, accidental modifications, or regressions.
 */
export const FROZEN_GOLDEN_BASELINE: Readonly<SiteConfig> = deepFreeze(
  JSON.parse(JSON.stringify(siteConfig))
);

export interface GoldenSnapshotMeta {
  savedAt: string;
  version: string;
  storeName: { ar: string; en: string };
  productsCount: number;
  config: SiteConfig;
}

/**
 * Creates and persists a Golden Snapshot of the current state.
 */
export function createGoldenSnapshot(config: SiteConfig): GoldenSnapshotMeta {
  const meta: GoldenSnapshotMeta = {
    savedAt: new Date().toISOString(),
    version: '1.0.0-GOLDEN',
    storeName: {
      ar: config.presets.cosmetics?.storeName?.ar || 'نَـــــدِي',
      en: config.presets.cosmetics?.storeName?.en || 'NADI'
    },
    productsCount: config.presets.cosmetics?.products?.length || 0,
    config: JSON.parse(JSON.stringify(config))
  };

  try {
    localStorage.setItem(GOLDEN_STORAGE_KEY_SNAPSHOT, JSON.stringify(meta));
  } catch (err) {
    console.error('Failed to save Golden Snapshot into localStorage', err);
  }

  return meta;
}

/**
 * Retrieves the currently saved Golden Snapshot, or returns the frozen baseline.
 */
export function getGoldenSnapshot(): GoldenSnapshotMeta | null {
  try {
    const raw = localStorage.getItem(GOLDEN_STORAGE_KEY_SNAPSHOT);
    if (raw) {
      const parsed = JSON.parse(raw) as GoldenSnapshotMeta;
      if (parsed && parsed.config && parsed.config.presets) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read Golden Snapshot', err);
  }
  return null;
}

/**
 * Restores the store configuration to the Golden Snapshot or the Frozen Baseline.
 */
export function restoreGoldenState(): { success: boolean; config: SiteConfig; message: string } {
  try {
    const snapshot = getGoldenSnapshot();
    if (snapshot && snapshot.config) {
      const restored = JSON.parse(JSON.stringify(snapshot.config));
      return {
        success: true,
        config: restored,
        message: 'تمت استعادة نقطة الاستقرار الذهبية المحفوظة بنجاح.'
      };
    }

    // Fall back to the pristine frozen baseline
    const fallback = JSON.parse(JSON.stringify(FROZEN_GOLDEN_BASELINE));
    return {
      success: true,
      config: fallback,
      message: 'تمت استعادة إعدادات المصنع الذهبية الأصلية المحصنة بنجاح.'
    };
  } catch (err: any) {
    return {
      success: false,
      config: JSON.parse(JSON.stringify(FROZEN_GOLDEN_BASELINE)),
      message: `فشل استرجاع الحالة: ${err?.message || 'خطأ غير معروف'}`
    };
  }
}

/**
 * Defensive Data Integrity Guard:
 * Normalizes any incoming product data so that missing keys or malformed numbers
 * never crash the application or cause visual drift.
 */
export function sanitizeProductDefensively(raw: Partial<Product>, index = 0): Product {
  const fallback = FROZEN_GOLDEN_BASELINE.presets.cosmetics.products[0];

  const safeId = typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : `prod-${Date.now()}-${index}`;
  const safeName = {
    ar: raw.name?.ar?.trim() || fallback.name.ar,
    en: raw.name?.en?.trim() || fallback.name.en,
  };
  const safeCategory = {
    ar: raw.category?.ar?.trim() || fallback.category.ar,
    en: raw.category?.en?.trim() || fallback.category.en,
  };
  const safeBasePriceUSD = typeof raw.basePriceUSD === 'number' && !isNaN(raw.basePriceUSD) && raw.basePriceUSD > 0
    ? raw.basePriceUSD
    : fallback.basePriceUSD;

  const safeOriginalPriceUSD = typeof raw.originalPriceUSD === 'number' && raw.originalPriceUSD > safeBasePriceUSD
    ? raw.originalPriceUSD
    : undefined;

  const safeStock = typeof raw.stock === 'number' && !isNaN(raw.stock) && raw.stock >= 0 ? raw.stock : 10;
  const safeRating = typeof raw.rating === 'number' && raw.rating >= 1 && raw.rating <= 5 ? raw.rating : 4.9;
  const safeReviewsCount = typeof raw.reviewsCount === 'number' && raw.reviewsCount >= 0 ? raw.reviewsCount : 24;

  const safeImages = Array.isArray(raw.images) && raw.images.length > 0 && raw.images.some(img => typeof img === 'string' && img.trim())
    ? raw.images.filter(img => typeof img === 'string' && img.trim())
    : [...fallback.images];

  return {
    id: safeId,
    name: safeName,
    category: safeCategory,
    basePriceUSD: safeBasePriceUSD,
    originalPriceUSD: safeOriginalPriceUSD,
    discountPercentage: raw.discountPercentage,
    stock: safeStock,
    badge: raw.badge,
    rating: safeRating,
    reviewsCount: safeReviewsCount,
    images: safeImages,
    hasAR: !!raw.hasAR,
    isTechSpecs: !!raw.isTechSpecs,
    techSpecs: raw.techSpecs,
    bundle: raw.bundle,
    tabs: raw.tabs || fallback.tabs,
  };
}
