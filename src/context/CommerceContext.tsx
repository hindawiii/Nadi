import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  siteConfig, SiteConfig, Product, PresetNiche, 
  ColorPalette, TypographyPair, ImportableTemplate, 
  curatedPalettes, curatedTypographyPairs, curatedImportableTemplates 
} from '../data/siteConfig';
import {
  createGoldenSnapshot,
  getGoldenSnapshot,
  restoreGoldenState,
  sanitizeProductDefensively,
  GoldenSnapshotMeta
} from '../data/goldenStoreConfig';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface OrderRecord {
  id: string;
  date: string;
  customerName: string;
  phone: string;
  address: string;
  items: { productName: string; quantity: number; price: string }[];
  totalFormatted: string;
  totalUSD?: number;
  discountAmountUSD?: number;
  shippingFeeUSD?: number;
  promoCode?: string;
  currency: string;
  status: 'received' | 'processing' | 'dispatched' | 'delivered';
  trackingCode: string;
}

export interface PlaceOrderParams {
  name: string;
  phone: string;
  address: string;
  finalTotalUSD?: number;
  discountAmountUSD?: number;
  shippingFeeUSD?: number;
  promoCode?: string;
}

export interface ToastData {
  id?: string;
  message: string;
  type?: 'cart_add' | 'cart_remove' | 'wishlist_add' | 'wishlist_remove' | 'info' | 'success';
  productName?: string;
  actionText?: string;
  onAction?: () => void;
}

export type RouteName = 'store' | 'admin' | 'developer' | 'pdp' | 'tracker' | 'about' | 'wishlist' | 'cart' | 'login';

interface CommerceContextType {
  lang: 'ar' | 'en';
  setLang: (l: 'ar' | 'en') => void;
  currency: string;
  setCurrency: (c: string) => void;
  activePresetId: 'cosmetics' | 'fashion' | 'eyewear' | 'electronics';
  setActivePresetId: (id: 'cosmetics' | 'fashion' | 'eyewear' | 'electronics') => void;
  currentRoute: RouteName;
  setCurrentRoute: (r: RouteName) => void;
  navigateTo: (r: RouteName) => void;
  activeData: PresetNiche;
  dynamicConfig: SiteConfig;
  setDynamicConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  
  // Auth Modal
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Review Modal
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  addReview: (review: { name: string; city: string; comment: string; rating: number }) => void;
  
  // Currency conversion
  convertPrice: (usdPrice: number) => { value: string; symbol: string; text: string; isCrypto: boolean };
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, delta: number) => void;
  clearCart: () => void;
  cartTotalUSD: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  clearWishlist: () => void;
  addAllWishlistToCart: () => void;
  
  // PDP
  activeProduct: Product | null;
  openProductPDP: (p: Product) => void;

  // Product Comparison System
  comparisonList: string[]; // List of product IDs
  toggleCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;
  
  // Auth PINs
  isAdminAuthenticated: boolean;
  loginAdmin: (pin: string, rememberLogin?: boolean, rememberPin?: boolean) => boolean;
  logoutAdmin: () => void;
  
  isDevAuthenticated: boolean;
  loginDeveloper: (pin: string, rememberLogin?: boolean, rememberPin?: boolean) => boolean;
  logoutDeveloper: () => void;
  
  // Self Destruct / Lock Mode
  isDeveloperModeLocked: boolean;
  toggleLockDeveloperMode: () => void;
  
  // Orders
  orders: OrderRecord[];
  placeOrder: (customer: PlaceOrderParams) => OrderRecord;
  updateOrderStatus: (orderId: string, status: OrderRecord['status']) => void;
  
  // Smart Toast System
  toastMessage: string | null;
  toastData: ToastData | null;
  showToast: (msgOrData: string | ToastData) => void;
  dismissToast: () => void;

  // Inline editing helper
  updateActiveDataField: (path: string, value: string) => void;

  // Sections Control (Developer Panel dynamic toggling)
  sectionsControl: SectionVisibilityMap;
  toggleSection: (id: keyof SectionVisibilityMap) => void;
  resetSections: () => void;

  // Harmonious Color Palette System
  activePaletteId: string;
  setActivePaletteId: (id: string) => void;
  customPalette: { primary: string; accent: string; surface: string } | null;
  setCustomPalette: (colors: { primary: string; accent: string; surface: string } | null) => void;

  // Harmonious Typography Pairing System
  activeTypographyId: string;
  setActiveTypographyId: (id: string) => void;

  // External Template Importer & Adapter Engine
  importTemplate: (templateOrJson: ImportableTemplate | string) => { success: boolean; message: string };
  exportCurrentTemplate: () => string;
  savedCustomTemplates: SavedCustomTemplate[];
  saveCurrentAsTemplate: (nameAr: string, nameEn?: string) => SavedCustomTemplate;
  deleteSavedTemplate: (id: string) => void;
  loadSavedTemplate: (id: string) => void;

  // Golden Store Stability Shield & Anti-Regression Engine
  goldenSnapshot: GoldenSnapshotMeta | null;
  saveGoldenSnapshot: () => void;
  rollbackToGoldenState: () => void;
}

export interface SavedCustomTemplate {
  id: string;
  name: { ar: string; en: string };
  savedAt: string;
  paletteId: string;
  typographyId: string;
  customPalette: { primary: string; accent: string; surface: string } | null;
  presetData: PresetNiche;
}

export interface SectionVisibilityMap {
  hero: boolean;
  valueProps: boolean;
  brandTicker: boolean;
  routineDiagnosis: boolean;
  hairDevices: boolean;
  productsCatalog: boolean;
  promoBanner: boolean;
  beforeAfter: boolean;
  testimonials: boolean;
  scrollToTop: boolean;
  floatingWhatsApp: boolean;
}

const CommerceContext = createContext<CommerceContextType | null>(null);

const STORAGE_KEY_CONFIG = 'luxe_commerce_config_v2';
const STORAGE_KEY_PRESET = 'luxe_commerce_preset_v2';
const STORAGE_KEY_CURRENCY = 'luxe_commerce_currency_v1';
const STORAGE_KEY_LANG = 'luxe_commerce_lang_v1';
const STORAGE_KEY_LOCK = 'luxe_commerce_locked_v1';
const STORAGE_KEY_CART = 'so_beauty_cart_v2';
const STORAGE_KEY_WISHLIST = 'so_beauty_wishlist_v2';
const STORAGE_KEY_PALETTE = 'luxe_commerce_palette_v2';
const STORAGE_KEY_TYPO = 'luxe_commerce_typo_v2';
const STORAGE_KEY_CUSTOM_COLORS = 'luxe_commerce_custom_colors_v2';

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

export const CommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<'ar' | 'en'>(() => {
    const saved = safeStorage.getItem(STORAGE_KEY_LANG);
    return saved === 'en' ? 'en' : 'ar';
  });

  const [currency, setCurrencyState] = useState<string>(() => {
    const saved = safeStorage.getItem(STORAGE_KEY_CURRENCY);
    return saved && siteConfig.currencies[saved] ? saved : 'SDG';
  });

  const [activePresetId, setActivePresetIdState] = useState<'cosmetics' | 'fashion' | 'eyewear' | 'electronics'>(() => {
    const saved = safeStorage.getItem(STORAGE_KEY_PRESET);
    return saved && ['cosmetics', 'fashion', 'eyewear', 'electronics'].includes(saved)
      ? (saved as any)
      : 'cosmetics';
  });

  const [dynamicConfig, setDynamicConfig] = useState<SiteConfig>(() => {
    const saved = safeStorage.getItem(STORAGE_KEY_CONFIG);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.presets?.cosmetics?.storeName?.ar === 'نَدِي') {
          parsed.presets.cosmetics.storeName.ar = 'نَـــــدِي';
        }
        if (parsed.presets?.cosmetics) {
          parsed.presets.cosmetics.storeSlogan = {
            ar: 'إشراقة طبيعية، تليق بك.',
            en: 'Natural radiance, made for you.'
          };
          parsed.presets.cosmetics.topAnnouncement = siteConfig.presets.cosmetics.topAnnouncement;
          parsed.presets.cosmetics.heroTitle = siteConfig.presets.cosmetics.heroTitle;
          parsed.presets.cosmetics.heroSubtitle = siteConfig.presets.cosmetics.heroSubtitle;
        }

        // Ensure all presets from siteConfig exist, and merge each preset deeply
        const mergedPresets = { ...siteConfig.presets };
        if (parsed.presets && typeof parsed.presets === 'object') {
          (Object.keys(siteConfig.presets) as (keyof typeof siteConfig.presets)[]).forEach((presetKey) => {
            if (parsed.presets[presetKey]) {
              mergedPresets[presetKey] = {
                ...siteConfig.presets[presetKey],
                ...parsed.presets[presetKey],
                contactInfo: {
                  ...siteConfig.presets[presetKey].contactInfo,
                  ...(parsed.presets[presetKey].contactInfo || {})
                },
                storeName: {
                  ...siteConfig.presets[presetKey].storeName,
                  ...(parsed.presets[presetKey].storeName || {})
                },
                storeSlogan: {
                  ...siteConfig.presets[presetKey].storeSlogan,
                  ...(parsed.presets[presetKey].storeSlogan || {})
                },
                products: (() => {
                  const baseProds = siteConfig.presets[presetKey].products || [];
                  const cachedProds = Array.isArray(parsed.presets[presetKey].products) ? parsed.presets[presetKey].products : [];
                  if (cachedProds.length === 0) return baseProds;
                  const existingIds = new Set(cachedProds.map((p: any) => p.id));
                  const missingProds = baseProds.filter(p => !existingIds.has(p.id));
                  return [...cachedProds, ...missingProds];
                })(),
                skinDiagnosisCards: Array.isArray(parsed.presets[presetKey]?.skinDiagnosisCards) && parsed.presets[presetKey].skinDiagnosisCards.length > 0
                  ? parsed.presets[presetKey].skinDiagnosisCards
                  : (siteConfig.presets[presetKey]?.skinDiagnosisCards || siteConfig.presets.cosmetics.skinDiagnosisCards || []),
                testimonials: Array.isArray(parsed.presets[presetKey]?.testimonials) && parsed.presets[presetKey].testimonials.length > 0
                  ? parsed.presets[presetKey].testimonials
                  : (siteConfig.presets[presetKey]?.testimonials || siteConfig.presets.cosmetics.testimonials || [])
              };
            }
          });
        }
        parsed.presets = mergedPresets;

        // Migrate any cached single-string currency symbols to bilingual symbols from siteConfig
        if (parsed.currencies) {
          Object.keys(siteConfig.currencies).forEach((currKey) => {
            if (parsed.currencies[currKey]) {
              parsed.currencies[currKey].symbol = siteConfig.currencies[currKey].symbol;
            } else {
              parsed.currencies[currKey] = siteConfig.currencies[currKey];
            }
          });
        }

        return parsed;
      } catch (e) {
        console.error('Failed to parse config from storage', e);
      }
    }
    return siteConfig;
  });

  const [isDeveloperModeLocked, setIsDeveloperModeLocked] = useState<boolean>(() => {
    const envLock = (import.meta as any).env?.VITE_LOCK_DEVELOPER_MODE === 'true';
    const savedLock = safeStorage.getItem(STORAGE_KEY_LOCK) === 'true';
    return envLock || savedLock;
  });

  const [currentRoute, setCurrentRouteState] = useState<RouteName>('store');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return safeStorage.getItem('luxe_admin_auth_saved') === 'true';
  });
  const [isDevAuthenticated, setIsDevAuthenticated] = useState<boolean>(() => {
    return safeStorage.getItem('luxe_dev_auth_saved') === 'true';
  });

  // Persistent Cart in LocalStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEY_CART);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
    return [];
  });

  // Persistent Wishlist in LocalStorage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEY_WISHLIST);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load wishlist from storage', e);
    }
    return ['sb-01'];
  });

  // Product Comparison State
  const [comparisonList, setComparisonList] = useState<string[]>(() => {
    try {
      const saved = safeStorage.getItem('luxe_commerce_compare_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  useEffect(() => {
    try {
      safeStorage.setItem('luxe_commerce_compare_v1', JSON.stringify(comparisonList));
    } catch (e) {}
  }, [comparisonList]);

  const toggleCompare = (productId: string) => {
    const allProducts = dynamicConfig.presets[activePresetId]?.products || [];
    const targetProduct = allProducts.find(p => p.id === productId);
    const prodName = targetProduct ? (targetProduct.name[lang] || targetProduct.name.ar) : '';

    setComparisonList(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast({
          type: 'info',
          message: lang === 'ar' ? `تمت إزالة "${prodName}" من قائمة المقارنة` : `Removed "${prodName}" from compare list`
        });
        return prev.filter(id => id !== productId);
      } else {
        if (prev.length >= 4) {
          showToast({
            type: 'info',
            message: lang === 'ar' ? 'الحد الأقصى للمقارنة هو 4 منتجات' : 'Maximum 4 products can be compared at once'
          });
          return prev;
        }
        showToast({
          type: 'info',
          message: lang === 'ar' ? `تمت إضافة "${prodName}" للمقارنة` : `Added "${prodName}" to compare list`,
          actionText: lang === 'ar' ? 'عرض المقارنة' : 'View Compare',
          onAction: () => setIsCompareModalOpen(true)
        });
        return [...prev, productId];
      }
    });
  };

  const removeFromCompare = (productId: string) => {
    setComparisonList(prev => prev.filter(id => id !== productId));
  };

  const clearCompare = () => {
    setComparisonList([]);
    showToast(lang === 'ar' ? 'تم مسح قائمة المقارنة' : 'Compare list cleared');
  };

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpenState] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastData, setToastData] = useState<ToastData | null>(null);
  const toastTimeoutRef = React.useRef<any>(null);

  // Intercept setIsAuthModalOpen to open full-page login view
  const setIsAuthModalOpen = (open: boolean) => {
    if (open) {
      navigateTo('login');
    } else {
      setIsAuthModalOpenState(false);
    }
  };

  // Sync cart to storage
  useEffect(() => {
    try {
      safeStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Sync wishlist to storage
  useEffect(() => {
    try {
      safeStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Section Visibility Management (Single Source of Truth for Developer Panel)
  const defaultSections: SectionVisibilityMap = {
    hero: true,
    valueProps: true,
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

  const [sectionsControl, setSectionsControl] = useState<SectionVisibilityMap>(() => {
    try {
      const saved = safeStorage.getItem('so_beauty_sections_v1');
      if (saved) return { ...defaultSections, ...JSON.parse(saved) };
    } catch (e) {}
    return defaultSections;
  });

  const toggleSection = (id: keyof SectionVisibilityMap) => {
    setSectionsControl(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        safeStorage.setItem('so_beauty_sections_v1', JSON.stringify(updated));
      } catch (e) {}
      showToast(lang === 'ar' ? `تم تحديث حالة القسم: ${id}` : `Section updated: ${id}`);
      return updated;
    });
  };

  const resetSections = () => {
    setSectionsControl(defaultSections);
    try {
      safeStorage.setItem('so_beauty_sections_v1', JSON.stringify(defaultSections));
    } catch (e) {}
    showToast(lang === 'ar' ? 'تمت إعادة ضبط جميع الأقسام' : 'All sections restored to default');
  };

  // Harmonious Color Palette State
  const [activePaletteId, setActivePaletteIdState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PALETTE);
    return saved && curatedPalettes.some(p => p.id === saved) ? saved : 'imperial-orchid';
  });

  const [customPalette, setCustomPaletteState] = useState<{ primary: string; accent: string; surface: string } | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_COLORS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const setActivePaletteId = (id: string) => {
    setActivePaletteIdState(id);
    setCustomPaletteState(null);
    localStorage.setItem(STORAGE_KEY_PALETTE, id);
    localStorage.removeItem(STORAGE_KEY_CUSTOM_COLORS);
  };

  const setCustomPalette = (colors: { primary: string; accent: string; surface: string } | null) => {
    setCustomPaletteState(colors);
    if (colors) {
      localStorage.setItem(STORAGE_KEY_CUSTOM_COLORS, JSON.stringify(colors));
    } else {
      localStorage.removeItem(STORAGE_KEY_CUSTOM_COLORS);
    }
  };

  // Harmonious Typography State
  const [activeTypographyId, setActiveTypographyIdState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TYPO);
    return saved && curatedTypographyPairs.some(t => t.id === saved) ? saved : 'royal-luxury';
  });

  const setActiveTypographyId = (id: string) => {
    setActiveTypographyIdState(id);
    localStorage.setItem(STORAGE_KEY_TYPO, id);
  };

  // Synchronize CSS Theme Variables & Font Families to DOM Root
  useEffect(() => {
    const root = document.documentElement;
    const currentPalette = curatedPalettes.find(p => p.id === activePaletteId) || curatedPalettes[0];
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

    const currentTypo = curatedTypographyPairs.find(t => t.id === activeTypographyId) || curatedTypographyPairs[0];
    root.style.setProperty('--font-heading-ar-family', `${currentTypo.headingFamilyAr}, Cairo, serif`);
    root.style.setProperty('--font-heading-en-family', `${currentTypo.headingFamilyEn}, Playfair Display, serif`);
    root.style.setProperty('--font-body-ar-family', `${currentTypo.bodyFamilyAr}, Cairo, sans-serif`);
    root.style.setProperty('--font-body-en-family', `${currentTypo.bodyFamilyEn}, Plus Jakarta Sans, sans-serif`);
    root.style.setProperty('--font-line-height', currentTypo.lineHeight);
  }, [activePaletteId, activeTypographyId, customPalette]);

  // External Template Importer & Adapter Engine
  const importTemplate = (templateOrJson: ImportableTemplate | string): { success: boolean; message: string } => {
    try {
      let parsed: any;
      if (typeof templateOrJson === 'string') {
        parsed = JSON.parse(templateOrJson);
      } else {
        parsed = templateOrJson;
      }

      const presetPayload: PresetNiche = parsed.presetData || parsed;
      if (!presetPayload.storeName || !presetPayload.products) {
        return {
          success: false,
          message: lang === 'ar' 
            ? 'كود القالب غير مطابق: يجب أن يحتوي الكود على اسم المتجر (storeName) وقائمة المنتجات (products).'
            : 'Invalid template structure: Missing storeName or products array.'
        };
      }

      setDynamicConfig(prev => {
        const clone = JSON.parse(JSON.stringify(prev));
        clone.presets[activePresetId] = {
          ...clone.presets[activePresetId],
          ...presetPayload,
          id: activePresetId // keep preset slot stable
        };
        try {
          localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(clone));
        } catch (e) {}
        return clone;
      });

      if (parsed.paletteId && curatedPalettes.some(p => p.id === parsed.paletteId)) {
        setActivePaletteId(parsed.paletteId);
      }
      if (parsed.typographyId && curatedTypographyPairs.some(t => t.id === parsed.typographyId)) {
        setActiveTypographyId(parsed.typographyId);
      }

      return {
        success: true,
        message: lang === 'ar' 
          ? `تم دمج وتطويع كود القالب بنجاح مع المتجر ونشاط (${activePresetId})!`
          : `Template adapted and merged successfully into ${activePresetId}!`
      };
    } catch (err: any) {
      console.error('Error importing template:', err);
      return {
        success: false,
        message: lang === 'ar' ? `خطأ في معالجة الكود: ${err.message}` : `Error parsing code: ${err.message}`
      };
    }
  };

  const STORAGE_KEY_SAVED_TEMPLATES = 'luxe_saved_custom_templates_v1';

  const [savedCustomTemplates, setSavedCustomTemplates] = useState<SavedCustomTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED_TEMPLATES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  const saveCurrentAsTemplate = (nameAr: string, nameEn?: string): SavedCustomTemplate => {
    const currentPreset = dynamicConfig.presets[activePresetId];
    const newTemplate: SavedCustomTemplate = {
      id: `custom-tpl-${Date.now()}`,
      name: {
        ar: nameAr.trim() || currentPreset.storeName.ar || 'قالب مخصص',
        en: nameEn?.trim() || currentPreset.storeName.en || 'Custom Template'
      },
      savedAt: new Date().toISOString(),
      paletteId: activePaletteId,
      typographyId: activeTypographyId,
      customPalette,
      presetData: JSON.parse(JSON.stringify(currentPreset))
    };

    setSavedCustomTemplates(prev => {
      const updated = [newTemplate, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY_SAVED_TEMPLATES, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    showToast(lang === 'ar' ? `تم حفظ القالب بنجاح باسم: ${newTemplate.name.ar}` : `Template saved as ${newTemplate.name.en}!`);
    return newTemplate;
  };

  const deleteSavedTemplate = (id: string) => {
    setSavedCustomTemplates(prev => {
      const updated = prev.filter(t => t.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY_SAVED_TEMPLATES, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(lang === 'ar' ? 'تم حذف القالب المحفوظ' : 'Saved template removed');
  };

  const loadSavedTemplate = (id: string) => {
    const target = savedCustomTemplates.find(t => t.id === id);
    if (!target) return;
    importTemplate({
      id: target.id,
      name: target.name,
      nicheLabel: target.name,
      badge: { ar: 'قالبك المحفوظ 💾', en: 'Saved Template 💾' },
      description: { ar: 'قالبك المخصص الذي تم حفظه محلياً', en: 'Your locally saved custom template' },
      previewImage: target.presetData.heroImage || '',
      paletteId: target.paletteId,
      typographyId: target.typographyId,
      presetData: target.presetData
    });
    if (target.customPalette) {
      setCustomPalette(target.customPalette);
    }
    showToast(lang === 'ar' ? `تم استرجاع وتفعيل قالب: ${target.name.ar}` : `Restored ${target.name.en}!`);
  };

  const [goldenSnapshot, setGoldenSnapshotState] = useState<GoldenSnapshotMeta | null>(() => {
    return getGoldenSnapshot();
  });

  const saveGoldenSnapshot = () => {
    const meta = createGoldenSnapshot(dynamicConfig);
    setGoldenSnapshotState(meta);
    showToast({
      type: 'success',
      message: lang === 'ar' 
        ? 'تم حفظ نقطة الاستقرار الذهبية للمتجر وتجميدها بنجاح 🛡️' 
        : 'Golden Stability Snapshot created and locked successfully 🛡️'
    });
  };

  const rollbackToGoldenState = () => {
    const res = restoreGoldenState();
    if (res.success && res.config) {
      setDynamicConfig(res.config);
      try {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(res.config));
      } catch (e) {}
      showToast({
        type: 'success',
        message: lang === 'ar' 
          ? 'تم التراجع واستعادة الحالة الذهبية المستقرة بنجاح 🔄' 
          : 'Successfully restored store to the Golden Stable state 🔄'
      });
    } else {
      showToast({
        type: 'info',
        message: res.message
      });
    }
  };

  const exportCurrentTemplate = (): string => {
    const exportData = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      paletteId: activePaletteId,
      typographyId: activeTypographyId,
      customPalette,
      presetData: dynamicConfig.presets[activePresetId]
    };
    return JSON.stringify(exportData, null, 2);
  };

  // Sync route with both URL pathname and hash for universal compatibility
  const setCurrentRoute = (r: RouteName) => {
    setCurrentRouteState(r);
  };

  const navigateTo = (r: RouteName) => {
    setCurrentRouteState(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      if (r === 'store') {
        window.history.replaceState(null, '', '/');
        if (window.location.hash) {
          window.location.hash = '';
        }
      } else if (r === 'login') {
        // Do not pollute the URL bar with persistent #login so refresh never gets trapped
        window.history.replaceState(null, '', '/');
        if (window.location.hash) {
          window.location.hash = '';
        }
      } else {
        window.history.pushState(null, '', `/${r}`);
        window.location.hash = r;
      }
    } catch (e) {
      if (r !== 'store' && r !== 'login') {
        window.location.hash = r;
      }
    }
  };

  const addReview = (review: { name: string; city: string; comment: string; rating: number }) => {
    showToast(lang === 'ar' ? 'شكراً لمشاركتك! تم إضافة تقييمك بنجاح.' : 'Thank you! Your verified review has been posted.');
  };

  const [orders, setOrders] = useState<OrderRecord[]>([
    {
      id: "ORD-2026-108",
      date: "2026-09-22 14:30",
      customerName: "فاطمة أحمد",
      phone: "+249912345678",
      address: "أم درمان – شارع الوادي",
      items: [
        { productName: "مرطب الهيالورونيك المكثف", quantity: 2, price: "6,000 ج.س" },
        { productName: "سيروم فيتامين سي النقي", quantity: 1, price: "3,450 ج.س" }
      ],
      totalFormatted: "9,450 ج.س",
      currency: "SDG",
      status: "dispatched",
      trackingCode: "TRK-98241"
    },
    {
      id: "ORD-2026-109",
      date: "2026-09-23 09:15",
      customerName: "سارة المنصور",
      phone: "+966501234567",
      address: "الرياض – حي الملقا",
      items: [
        { productName: "مجموعة Natural Bloom الكاملة", quantity: 1, price: "67.50 ر.س" }
      ],
      totalFormatted: "67.50 ر.س",
      currency: "SAR",
      status: "processing",
      trackingCode: "TRK-98242"
    }
  ]);

  // Persist language and update document direction
  const setLang = (l: 'ar' | 'en') => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY_LANG, l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const setCurrency = (c: string) => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEY_CURRENCY, c);
  };

  const setActivePresetId = (id: 'cosmetics' | 'fashion' | 'eyewear' | 'electronics') => {
    setActivePresetIdState(id);
    localStorage.setItem(STORAGE_KEY_PRESET, id);
    const newPreset = dynamicConfig.presets[id];
    if (newPreset && newPreset.products.length > 0) {
      setActiveProduct(newPreset.products[0]);
    }
  };

  // Convert USD price to current currency dynamically adapted to active language (Arabic / English)
  const convertPrice = (usdPrice: number) => {
    const curConfig = dynamicConfig.currencies[currency] || siteConfig.currencies[currency] || dynamicConfig.currencies['USD'] || siteConfig.currencies['USD'];
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

    // Resolve bilingual symbol safely (handles both object { ar, en } and legacy string)
    let resolvedSymbol = '';
    if (typeof curConfig.symbol === 'object' && curConfig.symbol !== null) {
      resolvedSymbol = lang === 'ar' ? (curConfig.symbol.ar || curConfig.symbol.en) : (curConfig.symbol.en || curConfig.symbol.ar);
    } else if (typeof curConfig.symbol === 'string') {
      // Fallback mapping if legacy string exists
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

    // Format text smartly:
    // In Arabic: "3,000 ج.س"
    // In English with standard prefix symbols ($ / € / £): "$3,000"
    // In English with standard code symbols (SDG / SAR / AED): "3,000 SDG"
    let text = '';
    if (lang === 'ar') {
      text = `${value} ${resolvedSymbol}`;
    } else {
      if (['$', '€', '£', '¥', '₹'].includes(resolvedSymbol)) {
        text = `${resolvedSymbol}${value}`;
      } else {
        text = `${value} ${resolvedSymbol}`;
      }
    }

    return { value, symbol: resolvedSymbol, text, isCrypto };
  };

  const dismissToast = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(null);
    setToastData(null);
  };

  const showToast = (msgOrData: string | ToastData) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    if (typeof msgOrData === 'string') {
      setToastMessage(msgOrData);
      setToastData({ message: msgOrData, type: 'info' });
    } else {
      setToastMessage(msgOrData.message);
      setToastData(msgOrData);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      setToastData(null);
    }, 3800);
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    const pName = product.name[lang] || product.name.ar;
    showToast({
      type: 'cart_add',
      productName: pName,
      message: lang === 'ar' ? `تمت إضافة "${pName}" إلى السلة` : `Added "${pName}" to bag`,
      actionText: lang === 'ar' ? 'عرض السلة' : 'View Bag',
      onAction: () => navigateTo('cart')
    });
  };

  const removeFromCart = (productId: string) => {
    let removedProductName = '';
    setCart((prev) => {
      const target = prev.find(item => item.product.id === productId);
      if (target) {
        removedProductName = target.product.name[lang] || target.product.name.ar;
      }
      return prev.filter((item) => item.product.id !== productId);
    });

    if (removedProductName) {
      showToast({
        type: 'cart_remove',
        productName: removedProductName,
        message: lang === 'ar' ? `تم حذف "${removedProductName}" من السلة` : `Removed "${removedProductName}" from bag`
      });
    }
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    showToast({
      type: 'cart_remove',
      message: lang === 'ar' ? 'تم إفراغ سلة المشتريات بالكامل' : 'Cart has been emptied'
    });
  };

  const cartTotalUSD = cart.reduce(
    (sum, item) => sum + item.product.basePriceUSD * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleWishlist = (productId: string) => {
    // Find product name from all available products
    const allProducts = dynamicConfig.presets[activePresetId]?.products || [];
    const targetProduct = allProducts.find(p => p.id === productId);
    const prodName = targetProduct ? (targetProduct.name[lang] || targetProduct.name.ar) : '';

    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      
      if (exists) {
        showToast({
          type: 'wishlist_remove',
          productName: prodName,
          message: prodName 
            ? (lang === 'ar' ? `تمت إزالة "${prodName}" من المفضلة` : `Removed "${prodName}" from wishlist`)
            : (lang === 'ar' ? 'تمت إزالة المنتج من المفضلة' : 'Removed from wishlist')
        });
      } else {
        showToast({
          type: 'wishlist_add',
          productName: prodName,
          message: prodName
            ? (lang === 'ar' ? `تم حفظ "${prodName}" في المفضلة ❤️` : `Saved "${prodName}" to wishlist ❤️`)
            : (lang === 'ar' ? 'تمت إضافة المنتج إلى المفضلة ❤️' : 'Added to wishlist ❤️'),
          actionText: lang === 'ar' ? 'عرض المفضلة' : 'View Wishlist',
          onAction: () => navigateTo('wishlist')
        });
      }
      return next;
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
    showToast({
      type: 'wishlist_remove',
      message: lang === 'ar' ? 'تم تفريغ قائمة المفضلة بالكامل' : 'Wishlist cleared completely'
    });
  };

  const addAllWishlistToCart = () => {
    const allProducts = dynamicConfig.presets[activePresetId].products;
    const itemsToAdd = allProducts.filter((p) => wishlist.includes(p.id));
    if (itemsToAdd.length === 0) return;

    itemsToAdd.forEach((prod) => {
      addToCart(prod, 1);
    });
    showToast(lang === 'ar' ? `تمت إضافة ${itemsToAdd.length} منتجات من المفضلة إلى السلة!` : `Added ${itemsToAdd.length} items from wishlist to bag!`);
  };

  const openProductPDP = (p: Product) => {
    setActiveProduct(p);
    setCurrentRoute('pdp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState({ productId: p.id }, '', `/product/${p.id}`);
      window.location.hash = `product-${p.id}`;
    } catch {
      window.location.hash = `product-${p.id}`;
    }
  };

  const loginAdmin = (pin: string, rememberLogin: boolean = false, rememberPin: boolean = false) => {
    if (pin.trim() === dynamicConfig.security.adminPin) {
      setIsAdminAuthenticated(true);
      if (rememberLogin) {
        safeStorage.setItem('luxe_admin_auth_saved', 'true');
      } else {
        safeStorage.removeItem('luxe_admin_auth_saved');
      }
      if (rememberPin) {
        safeStorage.setItem('luxe_admin_saved_pin', pin.trim());
      } else {
        safeStorage.removeItem('luxe_admin_saved_pin');
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    safeStorage.removeItem('luxe_admin_auth_saved');
  };

  const loginDeveloper = (pin: string, rememberLogin: boolean = false, rememberPin: boolean = false) => {
    if (pin.trim() === dynamicConfig.security.developerPin) {
      setIsDevAuthenticated(true);
      if (rememberLogin) {
        safeStorage.setItem('luxe_dev_auth_saved', 'true');
      } else {
        safeStorage.removeItem('luxe_dev_auth_saved');
      }
      if (rememberPin) {
        safeStorage.setItem('luxe_dev_saved_pin', pin.trim());
      } else {
        safeStorage.removeItem('luxe_dev_saved_pin');
      }
      return true;
    }
    return false;
  };

  const logoutDeveloper = () => {
    setIsDevAuthenticated(false);
    safeStorage.removeItem('luxe_dev_auth_saved');
  };

  const toggleLockDeveloperMode = () => {
    const next = !isDeveloperModeLocked;
    setIsDeveloperModeLocked(next);
    localStorage.setItem(STORAGE_KEY_LOCK, String(next));
    if (next) {
      setIsDevAuthenticated(false);
      if (currentRoute === 'developer') {
        setCurrentRoute('store');
      }
      showToast(lang === 'ar' ? 'تم قفل وضع المطور وحجبه نهائياً بنجاح!' : 'Developer Mode locked and purged!');
    } else {
      showToast(lang === 'ar' ? 'تم فتح وضع المطور' : 'Developer Mode unlocked');
    }
  };

  const placeOrder = (customer: PlaceOrderParams) => {
    const finalUSD = typeof customer.finalTotalUSD === 'number' && !isNaN(customer.finalTotalUSD)
      ? customer.finalTotalUSD
      : cartTotalUSD;
    const { text } = convertPrice(finalUSD);
    const trackingCode = `TRK-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: OrderRecord = {
      id: `ORD-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      customerName: customer.name,
      phone: customer.phone,
      address: customer.address,
      items: cart.map((i) => ({
        productName: i.product.name[lang],
        quantity: i.quantity,
        price: convertPrice(i.product.basePriceUSD * i.quantity).text,
      })),
      totalFormatted: text,
      totalUSD: finalUSD,
      discountAmountUSD: customer.discountAmountUSD || 0,
      shippingFeeUSD: customer.shippingFeeUSD || 0,
      promoCode: customer.promoCode || undefined,
      currency,
      status: 'received',
      trackingCode,
    };

    // Decrement stock for purchased items
    setDynamicConfig((prevConfig) => {
      const updatedPresets = { ...prevConfig.presets };
      const currentPreset = updatedPresets[activePresetId];
      if (currentPreset && Array.isArray(currentPreset.products)) {
        const cartQuantities = new Map<string, number>();
        cart.forEach((item) => {
          cartQuantities.set(item.product.id, (cartQuantities.get(item.product.id) || 0) + item.quantity);
        });

        currentPreset.products = currentPreset.products.map((p) => {
          const qtyBought = cartQuantities.get(p.id);
          if (qtyBought) {
            return {
              ...p,
              stock: Math.max(0, (p.stock || 0) - qtyBought),
            };
          }
          return p;
        });
      }
      try {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(prevConfig));
      } catch (_) {}
      return { ...prevConfig, presets: updatedPresets };
    });

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setIsCartOpen(false);
    showToast(lang === 'ar' ? 'تم تسجيل طلبك بنجاح! رقم التتبع: ' + trackingCode : 'Order placed successfully! Tracking: ' + trackingCode);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderRecord['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(lang === 'ar' ? 'تم تحديث حالة الطلب بنجاح' : 'Order status updated');
  };

  const updateActiveDataField = (path: string, value: string) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let current = clone.presets[activePresetId];
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(clone));
      return clone;
    });
  };

  const activeData = dynamicConfig.presets[activePresetId];

  // Dynamic document title update based on current page
  useEffect(() => {
    const brandName = `${activeData.storeName.en} · ${activeData.storeName.ar}`;
    if (currentRoute === 'wishlist') {
      document.title = lang === 'ar' ? `المفضلة الفاخرة | ${brandName}` : `Luxury Wishlist | ${activeData.storeName.en}`;
    } else if (currentRoute === 'cart') {
      document.title = lang === 'ar' ? `سلة المشتريات وإتمام الطلب | ${brandName}` : `Shopping Bag & Checkout | ${activeData.storeName.en}`;
    } else if (currentRoute === 'about') {
      document.title = lang === 'ar' ? `من نحن وقصة المتجر | ${brandName}` : `About Our Story | ${activeData.storeName.en}`;
    } else if (currentRoute === 'tracker') {
      document.title = lang === 'ar' ? `تتبع الشحنة المباشر | ${brandName}` : `Live Order Tracking | ${activeData.storeName.en}`;
    } else if (currentRoute === 'pdp' && activeProduct) {
      document.title = `${activeProduct.name[lang]} | ${brandName}`;
    } else if (currentRoute === 'admin') {
      document.title = lang === 'ar' ? `لوحة تحكم المتجر | ${brandName} Admin` : `Store Dashboard | ${activeData.storeName.en} Admin`;
    } else if (currentRoute === 'developer') {
      document.title = `Developer Sovereign Console | ${activeData.storeName.en}`;
    } else if (currentRoute === 'login') {
      document.title = lang === 'ar' ? `تسجيل الدخول والوصول للحساب | ${brandName}` : `Sign In & Account Access | ${activeData.storeName.en}`;
    } else {
      document.title = lang === 'ar' ? `${brandName} | متجر العناية والتجميل الفاخر` : `${activeData.storeName.en} | Luxury Skincare & Botanical Care`;
    }
  }, [currentRoute, activeProduct, lang, activeData]);

  return (
    <CommerceContext.Provider
      value={{
        lang,
        setLang,
        currency,
        setCurrency,
        activePresetId,
        setActivePresetId,
        currentRoute,
        setCurrentRoute,
        navigateTo,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isReviewModalOpen,
        setIsReviewModalOpen,
        addReview,
        activeData,
        dynamicConfig,
        setDynamicConfig,
        convertPrice,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartTotalUSD,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        clearWishlist,
        addAllWishlistToCart,
        activeProduct,
        openProductPDP,
        comparisonList,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        isCompareModalOpen,
        setIsCompareModalOpen,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        isDevAuthenticated,
        loginDeveloper,
        logoutDeveloper,
        isDeveloperModeLocked,
        toggleLockDeveloperMode,
        orders,
        placeOrder,
        updateOrderStatus,
        toastMessage,
        toastData,
        showToast,
        dismissToast,
        updateActiveDataField,
        sectionsControl,
        toggleSection,
        resetSections,
        activePaletteId,
        setActivePaletteId,
        customPalette,
        setCustomPalette,
        activeTypographyId,
        setActiveTypographyId,
        importTemplate,
        exportCurrentTemplate,
        savedCustomTemplates,
        saveCurrentAsTemplate,
        deleteSavedTemplate,
        loadSavedTemplate,
        goldenSnapshot,
        saveGoldenSnapshot,
        rollbackToGoldenState,
      }}
    >
      {children}
    </CommerceContext.Provider>
  );
};

export const useCommerce = () => {
  const context = useContext(CommerceContext);
  if (!context) {
    throw new Error('useCommerce must be used within a CommerceProvider');
  }
  return context;
};
