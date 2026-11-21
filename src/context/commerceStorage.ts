import {
  siteConfig,
  curatedPalettes,
  curatedTypographyPairs,
  type SiteConfig,
} from '../data/siteConfig';
import type {
  OrderRecord,
  SectionId,
  SectionVisibilityMap,
} from './commerceTypes';

export const STORAGE_KEY_CONFIG = 'luxe_commerce_config_v2';
export const STORAGE_KEY_PRESET = 'luxe_commerce_preset_v2';
export const STORAGE_KEY_CURRENCY = 'luxe_commerce_currency_v1';
export const STORAGE_KEY_LANG = 'luxe_commerce_lang_v1';
export const STORAGE_KEY_LOCK = 'luxe_commerce_locked_v1';
export const STORAGE_KEY_CART = 'so_beauty_cart_v2';
export const STORAGE_KEY_WISHLIST = 'so_beauty_wishlist_v2';
export const STORAGE_KEY_PALETTE = 'luxe_commerce_palette_v2';
export const STORAGE_KEY_TYPO = 'luxe_commerce_typo_v2';
export const STORAGE_KEY_CUSTOM_COLORS = 'luxe_commerce_custom_colors_v2';
export const STORAGE_KEY_SECTIONS_ORDER = 'so_beauty_sections_order_v3';
export const STORAGE_KEY_CLONED = 'so_beauty_cloned_sections_v2';
export const STORAGE_KEY_SAVED_TEMPLATES = 'luxe_saved_custom_templates_v1';

export const LEGACY_PORTAL_STORAGE_KEYS = [
  'luxe_admin_auth_saved',
  'luxe_dev_auth_saved',
  'luxe_admin_saved_pin',
  'luxe_dev_saved_pin',
  'luxe_admin_auth_saved_pref',
  'luxe_dev_auth_saved_pref',
  'luxe_admin_saved_pin_pref',
  'luxe_dev_saved_pin_pref',
] as const;

// Defensive Storage Guard for Production / Vercel Stability
export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      return window.localStorage.getItem(key);
    } catch (e) {
      console.warn(`[SafeStorage] Failed to read ${key}:`, e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn(`[SafeStorage] Failed to write ${key}:`, e);
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`[SafeStorage] Failed to remove ${key}:`, e);
    }
  },
};

export const DEFAULT_SECTIONS_VISIBILITY: SectionVisibilityMap = {
  hero: true,
  valueProps: false,
  brandTicker: true,
  routineDiagnosis: true,
  hairDevices: true,
  productsCatalog: true,
  promoBanner: true,
  beforeAfter: true,
  testimonials: true,
  scrollToTop: true,
  floatingWhatsApp: true,
};

export const DEFAULT_SECTIONS_ORDER: SectionId[] = [
  'hero',
  'brandTicker',
  'valueProps',
  'routineDiagnosis',
  'productsCatalog',
  'hairDevices',
  'promoBanner',
  'beforeAfter',
  'testimonials',
];

export const DEFAULT_ORDERS_PRESET: OrderRecord[] = [
  {
    id: 'ORD-2026-108',
    date: '2026-09-22 14:30',
    customerName: 'فاطمة أحمد',
    phone: '+249912345678',
    address: 'أم درمان – شارع الوادي',
    items: [
      { productName: 'مرطب الهيالورونيك المكثف', quantity: 2, price: '6,000 ج.س' },
      { productName: 'سيروم فيتامين سي النقي', quantity: 1, price: '3,450 ج.س' },
    ],
    totalFormatted: '9,450 ج.س',
    currency: 'SDG',
    status: 'dispatched',
    trackingCode: 'TRK-98241',
  },
  {
    id: 'ORD-2026-109',
    date: '2026-09-23 09:15',
    customerName: 'سارة المنصور',
    phone: '+966501234567',
    address: 'الرياض – حي الملقا',
    items: [
      { productName: 'مجموعة Natural Bloom الكاملة', quantity: 1, price: '67.50 ر.س' },
    ],
    totalFormatted: '67.50 ر.س',
    currency: 'SAR',
    status: 'processing',
    trackingCode: 'TRK-98242',
  },
];

export function hydrateDynamicConfig(): SiteConfig {
  const saved = safeStorage.getItem(STORAGE_KEY_CONFIG);
  if (!saved) return siteConfig;

  try {
    const parsed = JSON.parse(saved);
    if (parsed.presets?.cosmetics?.storeName?.ar === 'نَدِي') {
      parsed.presets.cosmetics.storeName.ar = 'نَـــــدِي';
    }
    if (parsed.presets?.cosmetics) {
      parsed.presets.cosmetics.storeSlogan = {
        ar: 'إشراقة طبيعية، تليق بك.',
        en: 'Natural radiance, made for you.',
      };
      parsed.presets.cosmetics.topAnnouncement = siteConfig.presets.cosmetics.topAnnouncement;
      parsed.presets.cosmetics.heroTitle = siteConfig.presets.cosmetics.heroTitle;
      parsed.presets.cosmetics.heroSubtitle = siteConfig.presets.cosmetics.heroSubtitle;
    }

    const mergedPresets = { ...siteConfig.presets };
    if (parsed.presets && typeof parsed.presets === 'object') {
      (Object.keys(siteConfig.presets) as (keyof typeof siteConfig.presets)[]).forEach((presetKey) => {
        if (parsed.presets[presetKey]) {
          mergedPresets[presetKey] = {
            ...siteConfig.presets[presetKey],
            ...parsed.presets[presetKey],
            contactInfo: {
              ...siteConfig.presets[presetKey].contactInfo,
              ...(parsed.presets[presetKey].contactInfo || {}),
            },
            storeName: {
              ...siteConfig.presets[presetKey].storeName,
              ...(parsed.presets[presetKey].storeName || {}),
            },
            storeSlogan: {
              ...siteConfig.presets[presetKey].storeSlogan,
              ...(parsed.presets[presetKey].storeSlogan || {}),
            },
            products: (() => {
              if (Array.isArray(parsed.presets[presetKey]?.products)) {
                const defaultById = new Map(
                  (siteConfig.presets[presetKey]?.products || []).map((dp) => [dp.id, dp])
                );
                return parsed.presets[presetKey].products.map((prod: any) => {
                  if (!Array.isArray(prod?.images)) return prod;
                  const needsBrokenHeal = prod.images.some(
                    (u: string) => typeof u === 'string' && u.includes('photo-1608248597359-59754b2d354a')
                  );
                  const isStaleBundle02 =
                    prod.id === 'bundle-02' &&
                    typeof prod.images[0] === 'string' &&
                    prod.images[0].includes('photo-1556228720-195a672e8a03');
                  const defaultMatch = defaultById.get(prod.id);
                  if (isStaleBundle02 && defaultMatch?.images?.length) {
                    return { ...prod, images: [...defaultMatch.images] };
                  }
                  if (needsBrokenHeal) {
                    return {
                      ...prod,
                      images: defaultMatch?.images?.length
                        ? [...defaultMatch.images]
                        : prod.images.map((u: string) =>
                            typeof u === 'string'
                              ? u.replace('photo-1608248597359-59754b2d354a', 'photo-1608248597359-25b82877fb18')
                              : u
                          ),
                    };
                  }
                  return prod;
                });
              }
              return siteConfig.presets[presetKey]?.products || [];
            })(),
            skinDiagnosisCards: (() => {
              const cached = parsed.presets[presetKey]?.skinDiagnosisCards;
              if (Array.isArray(cached) && cached.length > 0) {
                const isCorrupted = cached.some(
                  (c: any) =>
                    !c.image ||
                    c.image.includes('1508746829417') ||
                    c.image.includes('1512290900672') ||
                    c.image.includes('1556228720-195a672e8a03') ||
                    (c.image.includes('/assets/nadi/') && !c.image.startsWith('data:'))
                );
                if (!isCorrupted) {
                  return cached;
                }
              }
              return siteConfig.presets[presetKey]?.skinDiagnosisCards || siteConfig.presets.cosmetics.skinDiagnosisCards || [];
            })(),
            beforeAfterMedia: (() => {
              const cached = parsed.presets[presetKey]?.beforeAfterMedia;
              if (cached && cached.beforeImage && cached.afterImage) {
                const isCorrupted =
                  cached.beforeImage.includes('1512290900672') ||
                  cached.beforeImage.includes('1508214751196') ||
                  cached.afterImage.includes('1567532939604') ||
                  (cached.beforeImage.includes('/assets/nadi/') && !cached.beforeImage.startsWith('data:')) ||
                  (cached.afterImage.includes('/assets/nadi/') && !cached.afterImage.startsWith('data:'));
                if (!isCorrupted) {
                  return {
                    ...siteConfig.presets[presetKey]?.beforeAfterMedia,
                    ...cached,
                  };
                }
              }
              return siteConfig.presets[presetKey]?.beforeAfterMedia || siteConfig.presets.cosmetics.beforeAfterMedia;
            })(),
            testimonials: Array.isArray(parsed.presets[presetKey]?.testimonials)
              ? parsed.presets[presetKey].testimonials
              : siteConfig.presets[presetKey]?.testimonials || siteConfig.presets.cosmetics.testimonials || [],
          };
        }
      });
    }
    parsed.presets = mergedPresets;

    try {
      safeStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(parsed));
    } catch (_) {}

    if (parsed.currencies) {
      Object.keys(siteConfig.currencies).forEach((currKey) => {
        if (parsed.currencies[currKey]) {
          parsed.currencies[currKey].symbol = siteConfig.currencies[currKey].symbol;
        } else {
          parsed.currencies[currKey] = siteConfig.currencies[currKey];
        }
      });
    }

    if (!parsed.security || typeof parsed.security !== 'object') {
      parsed.security = JSON.parse(JSON.stringify(siteConfig.security));
    }

    return parsed;
  } catch (e) {
    console.error('Failed to parse config from storage', e);
    return siteConfig;
  }
}

export function applyThemeCssVariables(
  activePaletteId: string,
  activeTypographyId: string,
  customPalette: { primary: string; accent: string; surface: string } | null
): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const currentPalette = curatedPalettes.find((p) => p.id === activePaletteId) || curatedPalettes[0];
  const primary = customPalette?.primary || currentPalette.primary;
  const accent = customPalette?.accent || currentPalette.accent;
  const surface = customPalette?.surface || currentPalette.surface;

  root.style.setProperty('--theme-primary', primary);
  root.style.setProperty('--theme-primary-hover', primary + 'E6');
  root.style.setProperty('--theme-accent', accent);
  root.style.setProperty('--theme-accent-hover', accent + 'E6');
  root.style.setProperty('--theme-surface', surface);
  root.style.setProperty('--theme-badge', accent);
  root.style.setProperty('--theme-border', primary + '22');

  const currentTypo = curatedTypographyPairs.find((t) => t.id === activeTypographyId) || curatedTypographyPairs[0];
  root.style.setProperty('--font-heading-ar-family', `${currentTypo.headingFamilyAr}, Cairo, serif`);
  root.style.setProperty('--font-heading-en-family', `${currentTypo.headingFamilyEn}, Playfair Display, serif`);
  root.style.setProperty('--font-body-ar-family', `${currentTypo.bodyFamilyAr}, Cairo, sans-serif`);
  root.style.setProperty('--font-body-en-family', `${currentTypo.bodyFamilyEn}, Plus Jakarta Sans, sans-serif`);
  root.style.setProperty('--font-line-height', currentTypo.lineHeight);
}

export function formatConvertedPrice(
  usdPrice: number,
  currency: string,
  lang: 'ar' | 'en',
  dynamicConfig: SiteConfig
): { value: string; symbol: string; text: string; isCrypto: boolean } {
  const curConfig =
    dynamicConfig.currencies[currency] ||
    siteConfig.currencies[currency] ||
    dynamicConfig.currencies['USD'] ||
    siteConfig.currencies['USD'];
  const converted = usdPrice * curConfig.rate;
  const isCrypto = !!curConfig.isCrypto;

  let value: string;
  if (isCrypto) {
    value = converted < 0.01 ? converted.toFixed(6) : converted.toFixed(4);
  } else if (converted >= 100) {
    value = Math.round(converted).toLocaleString(lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US');
  } else {
    value = converted.toFixed(2);
  }

  let resolvedSymbol = '';
  if (typeof curConfig.symbol === 'object' && curConfig.symbol !== null) {
    resolvedSymbol =
      lang === 'ar'
        ? curConfig.symbol.ar || curConfig.symbol.en
        : curConfig.symbol.en || curConfig.symbol.ar;
  } else if (typeof curConfig.symbol === 'string') {
    if (lang === 'en') {
      const enFallbackMap: Record<string, string> = {
        'ج.س': 'SDG',
        'ر.س': 'SAR',
        'د.إ': 'AED',
        'ج.م': 'EGP',
        'د.ك': 'KWD',
      };
      resolvedSymbol = enFallbackMap[curConfig.symbol] || curConfig.symbol;
    } else {
      resolvedSymbol = curConfig.symbol;
    }
  } else {
    resolvedSymbol = currency;
  }

  let text = '';
  if (lang === 'ar') {
    text = `${value} ${resolvedSymbol}`;
  } else if (['$', '€', '£', '¥', '₹'].includes(resolvedSymbol)) {
    text = `${resolvedSymbol}${value}`;
  } else {
    text = `${value} ${resolvedSymbol}`;
  }

  return { value, symbol: resolvedSymbol, text, isCrypto };
}
