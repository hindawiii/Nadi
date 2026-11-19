import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  getOrdersFromCloud, 
  persistOrderToCloud, 
  updateOrderStatusInCloud, 
  clearAllOrdersFromCloud,
  subscribeToCloudOrders
} from '../services/orderService';
import { persistReviewToCloud, subscribeToCloudReviews } from '../services/reviewService';
import {
  buildPublicStorefrontPayload,
  saveStorefrontConfigToCloud,
  subscribeToStorefrontConfig,
} from '../services/storeConfigService';
import { computeAuthoritativeOrderSummary } from '../lib/checkoutIntegrity';
import { testConnection, auth } from '../lib/firebase';
import {
  hashSecretSync,
  verifySecretSync,
  generateOrderId,
  generateTrackingCode
} from '../lib/security';
import {
  clearCustomerSessionCache,
  getRememberMePreference,
  readCustomerSessionCache,
  saveCustomerSessionCache,
} from '../lib/authPersistence';
import {
  buildSanitizedTemplateExport,
  stripSensitiveKeysDeep,
} from '../lib/exportSanitizer';
import { hairStylingDevices } from '../components/HairDevicesSpotlight';

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
  ownerUid?: string;
}

export interface PlaceOrderParams {
  name: string;
  phone: string;
  address: string;
  selectedCity?: string;
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

export interface CustomerSessionUser {
  uid: string;
  name: string;
  email: string | null;
  photoURL?: string | null;
  provider?: string;
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
  
  // Authenticated Customer Session (Firebase Auth synchronized)
  customerUser: CustomerSessionUser | null;
  logoutCustomer: () => Promise<void>;

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
  openProductPDP: (p: Product, pushHistory?: boolean) => void;
  returnFromPDPToStore: (fromPopstate?: boolean) => void;


  // Product Comparison System
  comparisonList: string[]; // List of product IDs
  toggleCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;
  
  // Auth PINs & Verified Cloud Admin Session
  isAdminAuthenticated: boolean;
  isCloudAdminVerified: boolean;
  firebaseAdminEmail: string | null;
  cloudConfigStatus: 'local' | 'syncing' | 'synced' | 'error';
  lastCloudSyncAt: string | null;
  publishStorefrontToCloud: () => Promise<boolean>;
  loginAdmin: (pin: string, rememberLogin?: boolean, rememberPin?: boolean) => boolean;
  logoutAdmin: () => void;
  updateAdminPin: (newPin: string) => boolean;
  resetAdminPinWithOwnerAuth: (newPin: string) => boolean;
  
  isDevAuthenticated: boolean;
  loginDeveloper: (pin: string, rememberLogin?: boolean, rememberPin?: boolean) => boolean;
  logoutDeveloper: () => void;
  updateDeveloperPin: (newPin: string) => boolean;
  resetDeveloperPinWithAdminAuth: (newPin: string) => boolean;
  
  // Self Destruct / Lock Mode
  isDeveloperModeLocked: boolean;
  toggleLockDeveloperMode: () => void;
  
  // Orders
  orders: OrderRecord[];
  placeOrder: (customer: PlaceOrderParams) => OrderRecord;
  updateOrderStatus: (orderId: string, status: OrderRecord['status']) => void;
  clearAllOrders: () => void;
  restoreDefaultOrders: () => void;
  
  // Smart Toast System
  toastMessage: string | null;
  toastData: ToastData | null;
  showToast: (msgOrData: string | ToastData) => void;
  dismissToast: () => void;

  // Inline editing helper
  updateActiveDataField: (path: string, value: string) => void;

  // Sections Control (Developer & Admin Panel dynamic toggling)
  sectionsControl: SectionVisibilityMap;
  toggleSection: (id: keyof SectionVisibilityMap) => void;
  resetSections: () => void;

  // Dynamic Section Layout Ordering & Drag-and-Drop (Storefront Layout Reorder)
  sectionsOrder: SectionId[];
  reorderSections: (newOrder: SectionId[]) => void;
  moveSectionUp: (id: SectionId) => void;
  moveSectionDown: (id: SectionId) => void;
  resetSectionsOrder: () => void;

  // Section Cloning & Customization Suite
  clonedSections: Record<string, ClonedSectionConfig>;
  toggleCloneSection: (key: string, title?: string) => void;
  updateClonedSectionConfig: (key: string, updates: Partial<ClonedSectionConfig>) => void;

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

  // Granular Reset to Default & Smart Targeted Undo Engine
  historyStack: HistorySnapshot[];
  canUndo: boolean;
  undoLastChange: () => boolean;
  recordHistorySnapshot: (descAr: string, descEn: string, fieldPath?: string) => void;
  resetFieldToDefault: (fieldPath: string, descAr?: string, descEn?: string) => void;
  isFieldModified: (fieldPath: string) => boolean;
  resetEntireSectionToDefault: (sectionKey: string, descAr?: string, descEn?: string) => void;
  resetPresetToFactoryDefault: (targetPresetId?: 'cosmetics' | 'fashion' | 'eyewear' | 'electronics') => void;
}

export interface HistorySnapshot {
  id: string;
  timestamp: number;
  descriptionAr: string;
  descriptionEn: string;
  fieldPath?: string;
  configSnapshot: SiteConfig;
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

export interface ClonedSectionConfig {
  isCloned: boolean;
  titleAr?: string;
  titleEn?: string;
  subtitleAr?: string;
  subtitleEn?: string;
  badgeAr?: string;
  badgeEn?: string;
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

export type SectionId = 
  | 'hero' 
  | 'brandTicker' 
  | 'valueProps' 
  | 'routineDiagnosis' 
  | 'hairDevices' 
  | 'productsCatalog' 
  | 'promoBanner' 
  | 'beforeAfter' 
  | 'testimonials';

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
                  if (Array.isArray(parsed.presets[presetKey]?.products)) {
                    // Self-heal broken Unsplash URLs and duplicate bundle-02 primary photo cached from earlier builds
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
                              )
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
                    const isCorrupted = cached.some((c: any) => 
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
                  return (siteConfig.presets[presetKey]?.skinDiagnosisCards || siteConfig.presets.cosmetics.skinDiagnosisCards || []);
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
                        ...cached
                      };
                    }
                  }
                  return siteConfig.presets[presetKey]?.beforeAfterMedia || siteConfig.presets.cosmetics.beforeAfterMedia;
                })(),
                testimonials: Array.isArray(parsed.presets[presetKey]?.testimonials)
                  ? parsed.presets[presetKey].testimonials
                  : (siteConfig.presets[presetKey]?.testimonials || siteConfig.presets.cosmetics.testimonials || [])
              };
            }
          });
        }
        parsed.presets = mergedPresets;

        // Auto-persist healed config back to localStorage
        try {
          localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(parsed));
        } catch (err) {}

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

        if (!parsed.security || typeof parsed.security !== 'object') {
          parsed.security = JSON.parse(JSON.stringify(siteConfig.security));
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
  // Universal Storefront Scroll Memory for Zero-Delay Return from ANY page
  const lastStoreScrollYRef = useRef<number>(0);
  const lastViewedProductIdRef = useRef<string | undefined>(undefined);
  // Session-only in-memory admin/developer unlock state (never hydrated from spoofable localStorage flags)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isDevAuthenticated, setIsDevAuthenticated] = useState<boolean>(false);

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
  const [rawWishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEY_WISHLIST);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load wishlist from storage', e);
    }
    return [];
  });

  const activePresetIdRef = useRef(activePresetId);
  activePresetIdRef.current = activePresetId;

  const [isCloudAdminVerified, setIsCloudAdminVerified] = useState<boolean>(false);
  const [firebaseAdminEmail, setFirebaseAdminEmail] = useState<string | null>(null);
  const [cloudConfigStatus, setCloudConfigStatus] = useState<'local' | 'syncing' | 'synced' | 'error'>('local');
  const [lastCloudSyncAt, setLastCloudSyncAt] = useState<string | null>(null);
  const isApplyingCloudConfigRef = useRef(false);
  const lastCloudFingerprintRef = useRef('');
  const wasCloudAdminVerifiedRef = useRef(false);

  const activePresetProductsForWishlist = dynamicConfig.presets[activePresetId]?.products || [];
  const wishlist = rawWishlist.filter(
    (id) => activePresetProductsForWishlist.some((p) => p.id === id) || (activePresetId === 'cosmetics' && id.startsWith('hd-'))
  );

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

  const getCatalogProductPool = () => {
    const presetProducts = dynamicConfig.presets[activePresetId]?.products || [];
    if (activePresetId !== 'cosmetics') return presetProducts;
    const baseIds = new Set(presetProducts.map((p) => p.id));
    return [...presetProducts, ...hairStylingDevices.filter((hd) => !baseIds.has(hd.id))];
  };

  const toggleCompare = (productId: string) => {
    const allProducts = getCatalogProductPool();
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
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [customerUser, setCustomerUser] = useState<CustomerSessionUser | null>(() => {
    const cached = readCustomerSessionCache();
    return cached ? (cached as CustomerSessionUser) : null;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastData, setToastData] = useState<ToastData | null>(null);
  const toastTimeoutRef = React.useRef<any>(null);

  const logoutCustomer = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase sign-out warning:', err);
    }
    setCustomerUser(null);
    clearCustomerSessionCache();
    showToast(lang === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Signed out successfully');
  };

  // Sync cart to storage
  useEffect(() => {
    try {
      safeStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Sync raw wishlist to storage
  useEffect(() => {
    try {
      safeStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(rawWishlist));
    } catch (e) {
      console.error(e);
    }
  }, [rawWishlist]);

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

  // Dynamic Section Layout Ordering: routineDiagnosis -> productsCatalog -> hairDevices -> promoBanner
  const defaultSectionsOrder: SectionId[] = [
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

  const STORAGE_KEY_SECTIONS_ORDER = 'so_beauty_sections_order_v3';
  const [sectionsOrder, setSectionsOrder] = useState<SectionId[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEY_SECTIONS_ORDER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validSet = new Set(defaultSectionsOrder);
          const filtered = parsed.filter((id): id is SectionId => validSet.has(id));
          defaultSectionsOrder.forEach(id => {
            if (!filtered.includes(id)) {
              filtered.push(id);
            }
          });
          return filtered;
        }
      }
    } catch (e) {}
    return defaultSectionsOrder;
  });

  const reorderSections = (newOrder: SectionId[]) => {
    setSectionsOrder(newOrder);
    try {
      safeStorage.setItem(STORAGE_KEY_SECTIONS_ORDER, JSON.stringify(newOrder));
    } catch (e) {}
    showToast(lang === 'ar' ? 'تم تحديث ترتيب أقسام المتجر بنجاح' : 'Store layout reordered successfully');
  };

  const moveSectionUp = (id: SectionId) => {
    setSectionsOrder(prev => {
      const idx = prev.indexOf(id);
      if (idx <= 0) return prev;
      const next = [...prev];
      const temp = next[idx - 1];
      next[idx - 1] = next[idx];
      next[idx] = temp;
      try {
        safeStorage.setItem(STORAGE_KEY_SECTIONS_ORDER, JSON.stringify(next));
      } catch (e) {}
      showToast(lang === 'ar' ? 'تم تقديم القسم للأعلى' : 'Section moved up');
      return next;
    });
  };

  const moveSectionDown = (id: SectionId) => {
    setSectionsOrder(prev => {
      const idx = prev.indexOf(id);
      if (idx === -1 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      const temp = next[idx + 1];
      next[idx + 1] = next[idx];
      next[idx] = temp;
      try {
        safeStorage.setItem(STORAGE_KEY_SECTIONS_ORDER, JSON.stringify(next));
      } catch (e) {}
      showToast(lang === 'ar' ? 'تم تأخير القسم للأسفل' : 'Section moved down');
      return next;
    });
  };

  const resetSectionsOrder = () => {
    setSectionsOrder(defaultSectionsOrder);
    try {
      safeStorage.setItem(STORAGE_KEY_SECTIONS_ORDER, JSON.stringify(defaultSectionsOrder));
    } catch (e) {}
    showToast(lang === 'ar' ? 'تمت استعادة الترتيب الافتراضي لأقسام المتجر' : 'Store layout reset to default order');
  };

  // Section Cloning & Customization Suite State
  const STORAGE_KEY_CLONED = 'so_beauty_cloned_sections_v2';
  const [clonedSections, setClonedSections] = useState<Record<string, ClonedSectionConfig>>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEY_CLONED);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.routineDiagnosis?.isCloned) parsed.routineDiagnosis.isCloned = false;
        if (parsed?.promoBanner?.isCloned) parsed.promoBanner.isCloned = false;
        return parsed;
      }
    } catch (e) {}
    return {};
  });

  const toggleCloneSection = (key: string, title?: string) => {
    setClonedSections(prev => {
      const current = prev[key] || { isCloned: false };
      const nextCloned = !current.isCloned;
      const updated = {
        ...prev,
        [key]: {
          ...current,
          isCloned: nextCloned,
          titleAr: current.titleAr || (title ? `نسخة مستنسخة: ${title}` : 'قسم مخصص إضافي'),
          titleEn: current.titleEn || (title ? `Cloned: ${title}` : 'Custom Cloned Section'),
          subtitleAr: current.subtitleAr || 'محتوى مخصص إضافي لعرض مميزات وعروض حصرية للعملاء',
          subtitleEn: current.subtitleEn || 'Custom secondary showcase with tailored highlights',
          badgeAr: current.badgeAr || 'نسخة إضافية',
          badgeEn: current.badgeEn || 'Featured Extra',
        }
      };
      try {
        safeStorage.setItem(STORAGE_KEY_CLONED, JSON.stringify(updated));
      } catch (e) {}
      showToast(lang === 'ar'
        ? (nextCloned ? `تم استنساخ وتفعيل نسخة إضافية من (${title || key})` : `تم إزالة النسخة المستنسخة من (${title || key})`)
        : (nextCloned ? `Cloned extra instance of (${title || key})` : `Removed cloned instance of (${title || key})`)
      );
      return updated;
    });
  };

  const updateClonedSectionConfig = (key: string, updates: Partial<ClonedSectionConfig>) => {
    setClonedSections(prev => {
      const current = prev[key] || { isCloned: true };
      const updated = {
        ...prev,
        [key]: { ...current, ...updates }
      };
      try {
        safeStorage.setItem(STORAGE_KEY_CLONED, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(lang === 'ar' ? 'تم حفظ التعديلات على القسم المستنسخ بنجاح' : 'Cloned section customized successfully');
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
      presetData: stripSensitiveKeysDeep(JSON.parse(JSON.stringify(currentPreset)))
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
      badge: { ar: 'قالبك المحفوظ', en: 'Saved Template' },
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
        ? 'تم حفظ نقطة الاستقرار الذهبية للمتجر وتجميدها بنجاح' 
        : 'Golden Stability Snapshot created and locked successfully'
    });
  };

  const rollbackToGoldenState = () => {
    const res = restoreGoldenState(dynamicConfig.security);
    if (res.success && res.config) {
      setDynamicConfig(res.config);
      try {
        const { security: _omitSecurity, ...storableConfig } = res.config;
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(storableConfig));
      } catch (e) {}
      showToast({
        type: 'success',
        message: lang === 'ar' 
          ? 'تم التراجع واستعادة الحالة الذهبية المستقرة بنجاح' 
          : 'Successfully restored store to the Golden Stable state'
      });
    } else {
      showToast({
        type: 'info',
        message: res.message
      });
    }
  };

  const exportCurrentTemplate = (): string => {
    const exportData = buildSanitizedTemplateExport({
      paletteId: activePaletteId,
      typographyId: activeTypographyId,
      customPalette,
      presetData: dynamicConfig.presets[activePresetId],
    });
    return JSON.stringify(exportData, null, 2);
  };

  // Sync route with both URL pathname and hash for universal compatibility
  const setCurrentRoute = (r: RouteName) => {
    setCurrentRouteState(r);
  };

  // Dedicated Frame-Synchronized Scroll Restoration Engine
  const restoreStoreScroll = () => {
    const targetY = lastStoreScrollYRef.current || 0;
    // Immediate instant reset
    window.scrollTo({ top: targetY, behavior: 'instant' });

    // Double frame buffer ensuring React has rendered StorefrontView fully in the DOM
    requestAnimationFrame(() => {
      window.scrollTo({ top: targetY, behavior: 'instant' });
      setTimeout(() => {
        const currentY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        if (targetY > 0 && Math.abs(currentY - targetY) > 40) {
          window.scrollTo({ top: targetY, behavior: 'instant' });
        }
      }, 40);
    });
  };

  // Continuously maintain accurate lastStoreScrollY while browsing the storefront
  useEffect(() => {
    if (currentRoute !== 'store') return;

    let ticking = false;
    const handleStoreScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
          if (currentY > 0) {
            lastStoreScrollYRef.current = currentY;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleStoreScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleStoreScroll);
  }, [currentRoute]);

  const navigateTo = (r: RouteName) => {
    // If currently on store and navigating away, record scroll position
    if (currentRoute === 'store' && r !== 'store') {
      lastStoreScrollYRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    }

    if (r === 'store') {
      if (currentRoute === 'pdp') {
        returnFromPDPToStore();
        return;
      }
      setCurrentRouteState('store');
      try {
        window.history.replaceState(null, '', '/');
      } catch (_) {}
      restoreStoreScroll();
      return;
    }

    setCurrentRouteState(r);
    window.scrollTo({ top: 0, behavior: 'instant' });
    try {
      if (r === 'login') {
        window.history.replaceState(null, '', '/');
      } else {
        window.history.pushState(null, '', `/${r}`);
      }
    } catch (_) {}
  };

  const addReview = (review: { name: string; city: string; comment: string; rating: number }) => {
    const newId = Date.now();
    const newReviewItem = {
      id: newId,
      name: { ar: review.name.trim(), en: review.name.trim() },
      city: { ar: review.city?.trim() || (lang === 'ar' ? 'الخرطوم' : 'Khartoum'), en: review.city?.trim() || 'Khartoum' },
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      purchasedProduct: { 
        ar: 'مشتريات معتمدة من المتجر', 
        en: 'Verified Store Order', 
        id: 'verified' 
      },
      date: { 
        ar: 'الآن (مكتوب حديثاً)', 
        en: 'Just now' 
      },
      comment: { ar: review.comment.trim(), en: review.comment.trim() },
      badge: { ar: 'مشتري حقيقي موثق ✓', en: 'Verified Real Buyer ✓' },
      rating: review.rating || 5,
      status: 'pending' as const
    };

    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const targetPreset = clone.presets[activePresetId];
      if (!Array.isArray(targetPreset.testimonials)) {
        targetPreset.testimonials = JSON.parse(JSON.stringify(siteConfig.presets.cosmetics.testimonials || []));
      }
      targetPreset.testimonials.unshift(newReviewItem);
      try {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(clone));
      } catch (_) {}
      return clone;
    });

    // Persist to Cloud Firestore asynchronously (defensive execution)
    persistReviewToCloud({
      name: review.name,
      city: review.city,
      comment: review.comment,
      rating: review.rating || 5
    }).catch((err) => console.warn('Could not persist review to cloud:', err));

    showToast(
      lang === 'ar' 
        ? 'شكراً لكِ! تم إرسال تقييمكِ بنجاح وهو الآن بانتظار مراجعة الإدارة وسيظهر قريباً في المتجر' 
        : 'Thank you! Your review has been submitted and is awaiting admin approval'
    );
  };

  const defaultOrdersPreset: OrderRecord[] = [
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
  ];

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const cached = safeStorage.getItem('luxe_cached_orders');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return [];
  });

  // Synchronize Firestore Cloud Database gated strictly by Auth State (Admin gets orders + all reviews; Public gets approved reviews only)
  useEffect(() => {
    let isMounted = true;
    let unsubOrders: (() => void) | undefined;
    let unsubReviews: (() => void) | undefined;

    // Purge any legacy client-side auth bypass or cached PIN keys from earlier versions
    [
      'luxe_admin_auth_saved',
      'luxe_dev_auth_saved',
      'luxe_admin_saved_pin',
      'luxe_dev_saved_pin',
      'luxe_admin_auth_saved_pref',
      'luxe_dev_auth_saved_pref',
      'luxe_admin_saved_pin_pref',
      'luxe_dev_saved_pin_pref',
    ].forEach((legacyKey) => safeStorage.removeItem(legacyKey));

    testConnection().catch(() => {});

    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (!isMounted) return;
      if (unsubOrders) {
        unsubOrders();
        unsubOrders = undefined;
      }
      if (unsubReviews) {
        unsubReviews();
        unsubReviews = undefined;
      }

      const verifiedAdmin = Boolean(
        fbUser && fbUser.emailVerified && fbUser.email === 'mohsentiben@gmail.com'
      );
      setIsCloudAdminVerified(verifiedAdmin);
      setFirebaseAdminEmail(fbUser?.email || null);

      // Immediately revoke in-memory Admin/Developer sessions if Firebase owner identity is lost
      if (!verifiedAdmin) {
        setIsAdminAuthenticated(false);
        setIsDevAuthenticated(false);
      }

      if (fbUser) {
        const resolvedName =
          fbUser.displayName ||
          fbUser.email?.split('@')[0] ||
          (lang === 'ar' ? 'عميلة نَــدِي' : 'NADI Customer');
        const nextUser: CustomerSessionUser = {
          uid: fbUser.uid,
          name: resolvedName,
          email: fbUser.email,
          photoURL: fbUser.photoURL,
          provider: fbUser.providerData?.[0]?.providerId || 'firebase',
        };
        setCustomerUser(nextUser);
        saveCustomerSessionCache(nextUser, getRememberMePreference());
      } else {
        setCustomerUser(null);
        clearCustomerSessionCache();
      }

      // Attach live reviews subscription (approved-only for public visitors; all statuses for verified Admin)
      unsubReviews = subscribeToCloudReviews(
        (cloudReviews) => {
          if (!isMounted || !Array.isArray(cloudReviews) || cloudReviews.length === 0) return;
          const targetPresetKey = activePresetIdRef.current;
          setDynamicConfig((prev) => {
            const clone = JSON.parse(JSON.stringify(prev));
            const currentTestimonials = clone.presets[targetPresetKey]?.testimonials || [];

            const mappedCloud = cloudReviews.map((cr) => ({
              id: cr.id,
              name: { ar: cr.name, en: cr.name },
              city: { ar: cr.city || 'الخرطوم', en: cr.city || 'Khartoum' },
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              purchasedProduct: { ar: 'مشتريات معتمدة من المتجر', en: 'Verified Store Order', id: 'verified' },
              date: { ar: 'تقييم سحابي موثق ✓', en: 'Verified Cloud Review ✓' },
              comment: { ar: cr.comment, en: cr.comment },
              badge: { ar: 'تقييم معتمد ✓', en: 'Verified Review ✓' },
              rating: cr.rating || 5,
              status: cr.status || ('pending' as const),
            }));

            const existingIds = new Set(currentTestimonials.map((t: any) => String(t.id)));
            const existingComments = new Set(currentTestimonials.map((t: any) => t.comment?.ar || t.comment));
            let changed = false;

            const updatedTestimonials = currentTestimonials.map((t: any) => {
              const match = mappedCloud.find((mc) => String(mc.id) === String(t.id));
              if (match && match.status !== t.status) {
                changed = true;
                return { ...t, status: match.status };
              }
              return t;
            });

            const freshItems = mappedCloud.filter(
              (m) => !existingIds.has(String(m.id)) && !existingComments.has(m.comment.ar)
            );

            if (freshItems.length > 0 || changed) {
              clone.presets[targetPresetKey].testimonials = [...freshItems, ...updatedTestimonials];
              return clone;
            }
            return prev;
          });
        },
        undefined,
        verifiedAdmin
      );

      // Private full-orders stream is strictly reserved for verified Admin sessions
      if (verifiedAdmin) {
        try {
          const cloudOrders = await getOrdersFromCloud();
          if (isMounted && Array.isArray(cloudOrders)) {
            setOrders(cloudOrders);
            safeStorage.setItem('luxe_cached_orders', JSON.stringify(cloudOrders));
          }
          unsubOrders = subscribeToCloudOrders((liveOrders) => {
            if (isMounted && Array.isArray(liveOrders)) {
              setOrders(liveOrders);
              safeStorage.setItem('luxe_cached_orders', JSON.stringify(liveOrders));
            }
          });
        } catch (err) {
          console.warn('Could not sync admin cloud orders:', err);
        }
      }
    });

    // Attach live public storefront catalog, theme & layout sync across all visitors/devices
    const unsubStorefront = subscribeToStorefrontConfig((cloudPayload) => {
      if (!isMounted) return;
      const incomingFingerprint = JSON.stringify({
        activePresetId: cloudPayload.activePresetId,
        presets: cloudPayload.presets,
        currencies: cloudPayload.currencies,
        sectionsControl: cloudPayload.sectionsControl,
        sectionsOrder: cloudPayload.sectionsOrder,
        paletteId: cloudPayload.paletteId,
        customColors: cloudPayload.customColors ?? null,
        typographyId: cloudPayload.typographyId,
      });

      lastCloudFingerprintRef.current = incomingFingerprint;
      isApplyingCloudConfigRef.current = true;

      try {
        if (cloudPayload.activePresetId) {
          setActivePresetIdState(cloudPayload.activePresetId);
          localStorage.setItem(STORAGE_KEY_PRESET, cloudPayload.activePresetId);
        }

        setDynamicConfig((prev) => {
          const mergedPresets = { ...prev.presets, ...cloudPayload.presets };
          // Sanitize product fields defensively on hydrated cloud presets
          (Object.keys(mergedPresets) as Array<keyof typeof mergedPresets>).forEach((pk) => {
            const target = mergedPresets[pk];
            if (target && Array.isArray(target.products)) {
              target.products = target.products.map((p: Product) => sanitizeProductDefensively(p));
            }
          });
          const nextConfig: SiteConfig = {
            ...prev,
            currencies: cloudPayload.currencies || prev.currencies,
            presets: mergedPresets,
          };
          try {
            localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(nextConfig));
          } catch (_) {}
          return nextConfig;
        });

        if (cloudPayload.sectionsControl && typeof cloudPayload.sectionsControl === 'object') {
          setSectionsControl((prev) => {
            const merged = { ...prev, ...cloudPayload.sectionsControl } as SectionVisibilityMap;
            try {
              safeStorage.setItem('so_beauty_sections_v1', JSON.stringify(merged));
            } catch (_) {}
            return merged;
          });
        }

        if (Array.isArray(cloudPayload.sectionsOrder) && cloudPayload.sectionsOrder.length > 0) {
          setSectionsOrder(() => {
            const validSet = new Set(defaultSectionsOrder);
            const filtered = cloudPayload.sectionsOrder!.filter((id): id is SectionId => validSet.has(id as SectionId));
            defaultSectionsOrder.forEach((id) => {
              if (!filtered.includes(id)) filtered.push(id);
            });
            try {
              safeStorage.setItem(STORAGE_KEY_SECTIONS_ORDER, JSON.stringify(filtered));
            } catch (_) {}
            return filtered;
          });
        }

        if (cloudPayload.paletteId && curatedPalettes.some((p) => p.id === cloudPayload.paletteId)) {
          setActivePaletteIdState(cloudPayload.paletteId);
          localStorage.setItem(STORAGE_KEY_PALETTE, cloudPayload.paletteId);
        }

        if (cloudPayload.customColors) {
          setCustomPaletteState(cloudPayload.customColors);
          localStorage.setItem(STORAGE_KEY_CUSTOM_COLORS, JSON.stringify(cloudPayload.customColors));
        } else if ('paletteId' in cloudPayload) {
          setCustomPaletteState(null);
          localStorage.removeItem(STORAGE_KEY_CUSTOM_COLORS);
        }

        if (cloudPayload.typographyId && curatedTypographyPairs.some((t) => t.id === cloudPayload.typographyId)) {
          setActiveTypographyIdState(cloudPayload.typographyId);
          localStorage.setItem(STORAGE_KEY_TYPO, cloudPayload.typographyId);
        }

        setCloudConfigStatus('synced');
        if (cloudPayload.updatedAt) {
          setLastCloudSyncAt(cloudPayload.updatedAt);
        }
      } finally {
        setTimeout(() => {
          isApplyingCloudConfigRef.current = false;
        }, 0);
      }
    });

    return () => {
      isMounted = false;
      unsubAuth();
      unsubStorefront();
      if (unsubOrders) unsubOrders();
      if (unsubReviews) unsubReviews();
    };
  }, []);

  const publishStorefrontToCloud = async (): Promise<boolean> => {
    if (!isCloudAdminVerified || !auth.currentUser) {
      return false;
    }
    const payload = buildPublicStorefrontPayload({
      dynamicConfig,
      activePresetId,
      sectionsControl: sectionsControl as unknown as Record<string, boolean>,
      sectionsOrder,
      paletteId: activePaletteId,
      customColors: customPalette,
      typographyId: activeTypographyId,
    });
    const nextFingerprint = JSON.stringify({
      activePresetId: payload.activePresetId,
      presets: payload.presets,
      currencies: payload.currencies,
      sectionsControl: payload.sectionsControl,
      sectionsOrder: payload.sectionsOrder,
      paletteId: payload.paletteId,
      customColors: payload.customColors ?? null,
      typographyId: payload.typographyId,
    });
    setCloudConfigStatus('syncing');
    const result = await saveStorefrontConfigToCloud(payload);
    if (result.success) {
      lastCloudFingerprintRef.current = nextFingerprint;
      setCloudConfigStatus('synced');
      setLastCloudSyncAt(payload.updatedAt);
      return true;
    }
    setCloudConfigStatus('error');
    if (result.reason === 'too-large') {
      showToast(
        lang === 'ar'
          ? 'حجم بيانات المتجر يتجاوز الحد السحابي المسموح؛ يرجى رفع الصور عبر التخزين السحابي بدلاً من الصور المضمنة.'
          : 'Storefront config exceeds cloud limit; use Cloud Storage URLs instead of large inline images.'
      );
    }
    return false;
  };

  // Debounced auto-sync to Firestore (/storefront/public) on verified Admin mutations
  useEffect(() => {
    if (!isCloudAdminVerified) {
      wasCloudAdminVerifiedRef.current = false;
      return;
    }

    if (isApplyingCloudConfigRef.current) {
      return;
    }

    const currentFingerprint = JSON.stringify({
      activePresetId,
      presets: dynamicConfig.presets,
      currencies: dynamicConfig.currencies,
      sectionsControl,
      sectionsOrder,
      paletteId: activePaletteId,
      customColors: customPalette ?? null,
      typographyId: activeTypographyId,
    });

    // Skip immediate push on initial admin verification so existing cloud data is never overwritten accidentally
    if (!wasCloudAdminVerifiedRef.current) {
      wasCloudAdminVerifiedRef.current = true;
      if (!lastCloudFingerprintRef.current) {
        lastCloudFingerprintRef.current = currentFingerprint;
      }
      return;
    }

    if (currentFingerprint === lastCloudFingerprintRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      void publishStorefrontToCloud();
    }, 900);

    return () => clearTimeout(timer);
  }, [
    isCloudAdminVerified,
    dynamicConfig.presets,
    dynamicConfig.currencies,
    activePresetId,
    sectionsControl,
    sectionsOrder,
    activePaletteId,
    customPalette,
    activeTypographyId,
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

  // Granular Reset to Default & Smart Targeted Undo Engine State
  const [historyStack, setHistoryStack] = useState<HistorySnapshot[]>([]);

  const recordHistorySnapshot = (descAr: string, descEn: string, fieldPath?: string) => {
    setHistoryStack((prev) => [
      {
        id: `snap-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: Date.now(),
        descriptionAr: descAr,
        descriptionEn: descEn,
        fieldPath,
        configSnapshot: JSON.parse(JSON.stringify(dynamicConfig)),
      },
      ...prev.slice(0, 29), // Keep last 30 snapshots
    ]);
  };

  const undoLastChange = (): boolean => {
    if (historyStack.length === 0) {
      showToast(lang === 'ar' ? 'لا توجد تعديلات سابقة للتراجع عنها' : 'No previous edits to undo');
      return false;
    }

    const [lastSnapshot, ...remaining] = historyStack;
    setHistoryStack(remaining);
    setDynamicConfig(lastSnapshot.configSnapshot);
    try {
      safeStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(lastSnapshot.configSnapshot));
    } catch (_) {}

    showToast({
      type: 'info',
      message: lang === 'ar' 
        ? `تم التراجع عن: ${lastSnapshot.descriptionAr} ↩` 
        : `Undone: ${lastSnapshot.descriptionEn} ↩`,
    });
    return true;
  };

  const canUndo = historyStack.length > 0;

  const isFieldModified = (fieldPath: string): boolean => {
    try {
      const parts = fieldPath.split('.');
      let currentVal: any = dynamicConfig.presets[activePresetId];
      let defaultVal: any = siteConfig.presets[activePresetId];

      for (const p of parts) {
        if (currentVal === undefined || defaultVal === undefined) return false;
        currentVal = currentVal[p];
        defaultVal = defaultVal[p];
      }

      if (currentVal === undefined && defaultVal === undefined) return false;
      return JSON.stringify(currentVal) !== JSON.stringify(defaultVal);
    } catch (_) {
      return false;
    }
  };

  const resetFieldToDefault = (fieldPath: string, descAr?: string, descEn?: string) => {
    try {
      const parts = fieldPath.split('.');
      let defaultVal: any = siteConfig.presets[activePresetId];
      for (const p of parts) {
        if (defaultVal === undefined) break;
        defaultVal = defaultVal[p];
      }

      if (defaultVal === undefined) {
        showToast(lang === 'ar' ? 'القيمة الافتراضية غير متوفرة لهذا الحقل' : 'Default value not found');
        return;
      }

      // Record snapshot first so the reset itself can be undone!
      recordHistorySnapshot(
        descAr ? `استعادة افتراضي ${descAr}` : `استعادة افتراضي ${fieldPath}`,
        descEn ? `Reset ${descEn} to default` : `Reset ${fieldPath} to default`,
        fieldPath
      );

      setDynamicConfig((prev) => {
        const clone = JSON.parse(JSON.stringify(prev));
        if (!clone.presets) clone.presets = JSON.parse(JSON.stringify(siteConfig.presets));
        if (!clone.presets[activePresetId]) {
          clone.presets[activePresetId] = JSON.parse(JSON.stringify(siteConfig.presets[activePresetId] || siteConfig.presets.cosmetics));
        }

        let cur = clone.presets[activePresetId];
        for (let i = 0; i < parts.length - 1; i++) {
          if (!cur[parts[i]]) cur[parts[i]] = {};
          cur = cur[parts[i]];
        }
        cur[parts[parts.length - 1]] = JSON.parse(JSON.stringify(defaultVal));
        try {
          safeStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(clone));
        } catch (_) {}
        return clone;
      });

      showToast({
        type: 'success',
        message: lang === 'ar' 
          ? `تمت استعادة القيمة الافتراضية لـ (${descAr || fieldPath}) ↺` 
          : `Restored default for (${descEn || fieldPath}) ↺`,
        actionText: lang === 'ar' ? 'تراجع ↩' : 'Undo ↩',
        onAction: () => undoLastChange()
      });
    } catch (e) {
      console.error('Failed to reset field to default', e);
    }
  };

  const resetEntireSectionToDefault = (sectionKey: string, descAr?: string, descEn?: string) => {
    try {
      const defaultSectionData = (siteConfig.presets[activePresetId] as any)[sectionKey];
      if (defaultSectionData === undefined) {
        showToast(lang === 'ar' ? 'القسم غير متوفر في الإعدادات الأصلية' : 'Section not found in default presets');
        return;
      }

      recordHistorySnapshot(
        descAr ? `استعادة قسم: ${descAr}` : `استعادة قسم ${sectionKey}`,
        descEn ? `Reset section: ${descEn}` : `Reset section ${sectionKey}`,
        sectionKey
      );

      setDynamicConfig((prev) => {
        const clone = JSON.parse(JSON.stringify(prev));
        if (!clone.presets) clone.presets = JSON.parse(JSON.stringify(siteConfig.presets));
        if (!clone.presets[activePresetId]) {
          clone.presets[activePresetId] = JSON.parse(JSON.stringify(siteConfig.presets[activePresetId] || siteConfig.presets.cosmetics));
        }
        clone.presets[activePresetId][sectionKey] = JSON.parse(JSON.stringify(defaultSectionData));
        try {
          safeStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(clone));
        } catch (_) {}
        return clone;
      });

      showToast({
        type: 'success',
        message: lang === 'ar' 
          ? `تمت استعادة كافة إعدادات (${descAr || sectionKey}) للوضع الافتراضي المصنعي ↺` 
          : `Restored (${descEn || sectionKey}) to factory defaults ↺`,
        actionText: lang === 'ar' ? 'تراجع ↩' : 'Undo ↩',
        onAction: () => undoLastChange()
      });
    } catch (e) {
      console.error('Failed to reset entire section', e);
    }
  };

  const resetPresetToFactoryDefault = (targetPresetId?: 'cosmetics' | 'fashion' | 'eyewear' | 'electronics') => {
    try {
      const presetKey = targetPresetId || activePresetId;
      const defaultPresetData = siteConfig.presets[presetKey];
      if (!defaultPresetData) {
        showToast(lang === 'ar' ? 'النظام غير متوفر في الإعدادات الأصلية' : 'Preset not found in factory defaults');
        return;
      }

      const presetName = defaultPresetData.nicheLabel?.[lang] || presetKey;

      recordHistorySnapshot(
        `استعادة ضبط المصنع لنظام: ${defaultPresetData.nicheLabel?.ar || presetKey}`,
        `Factory Reset system: ${defaultPresetData.nicheLabel?.en || presetKey}`,
        `presets.${presetKey}`
      );

      setDynamicConfig((prev) => {
        const clone = JSON.parse(JSON.stringify(prev));
        if (!clone.presets) clone.presets = JSON.parse(JSON.stringify(siteConfig.presets));
        clone.presets[presetKey] = JSON.parse(JSON.stringify(defaultPresetData));
        try {
          safeStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(clone));
        } catch (_) {}
        return clone;
      });

      showToast({
        type: 'success',
        message: lang === 'ar' 
          ? `تمت استعادة القالب الافتراضي المصنعي بالكامل لـ (${presetName}) بنجاح ↺` 
          : `Fully restored factory default template for (${presetName}) ↺`,
        actionText: lang === 'ar' ? 'تراجع ↩' : 'Undo ↩',
        onAction: () => undoLastChange()
      });
    } catch (e) {
      console.error('Failed to reset preset to factory default', e);
    }
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const bestUnitPriceUSD = Math.min(existing.product.basePriceUSD, product.basePriceUSD);
        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                product:
                  bestUnitPriceUSD < item.product.basePriceUSD
                    ? { ...item.product, basePriceUSD: bestUnitPriceUSD }
                    : item.product,
                quantity: item.quantity + quantity,
              }
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
    // Search full catalog pool including standalone hair styling devices
    const allProducts = getCatalogProductPool();
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
            ? (lang === 'ar' ? `تم حفظ "${prodName}" في المفضلة` : `Saved "${prodName}" to wishlist`)
            : (lang === 'ar' ? 'تمت إضافة المنتج إلى المفضلة' : 'Added to wishlist'),
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
    const presetProducts = dynamicConfig.presets[activePresetId]?.products || [];
    const baseIds = new Set(presetProducts.map((p) => p.id));
    const catalogPool =
      activePresetId === 'cosmetics'
        ? [...presetProducts, ...hairStylingDevices.filter((hd) => !baseIds.has(hd.id))]
        : presetProducts;
    const itemsToAdd = catalogPool.filter((p) => wishlist.includes(p.id));
    if (itemsToAdd.length === 0) return;

    itemsToAdd.forEach((prod) => {
      addToCart(prod, 1);
    });
    showToast(lang === 'ar' ? `تمت إضافة ${itemsToAdd.length} منتجات من المفضلة إلى السلة!` : `Added ${itemsToAdd.length} items from wishlist to bag!`);
  };

  const openProductPDP = (p: Product, pushHistory: boolean = true) => {
    // Record storefront scroll position before jumping to PDP
    if (currentRoute === 'store') {
      lastStoreScrollYRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    }
    lastViewedProductIdRef.current = p.id;

    setActiveProduct(p);
    setCurrentRouteState('pdp');
    // Instant open without slow dragging/scrolling delay
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (pushHistory) {
      try {
        window.history.pushState({ productId: p.id }, '', `/product/${p.id}`);
      } catch (_) {}
    }
  };

  const returnFromPDPToStore = (fromPopstate: boolean = false) => {
    setCurrentRouteState('store');
    if (!fromPopstate) {
      try {
        window.history.replaceState(null, '', '/');
      } catch (_) {}
    }
    restoreStoreScroll();
  };

  const isVerifiedCloudOwner = (): boolean => {
    const fbUser = auth.currentUser;
    return Boolean(fbUser && fbUser.emailVerified && fbUser.email === 'mohsentiben@gmail.com');
  };

  const purgeLegacyPortalStorageKeys = () => {
    [
      'luxe_admin_auth_saved',
      'luxe_dev_auth_saved',
      'luxe_admin_saved_pin',
      'luxe_dev_saved_pin',
      'luxe_admin_auth_saved_pref',
      'luxe_dev_auth_saved_pref',
      'luxe_admin_saved_pin_pref',
      'luxe_dev_saved_pin_pref',
    ].forEach((k) => safeStorage.removeItem(k));
  };

  const loginAdmin = (pin: string) => {
    // Strictly require verified Firebase Cloud Owner identity before accepting the secondary local PIN
    if (!isVerifiedCloudOwner()) {
      setIsAdminAuthenticated(false);
      return false;
    }
    const cleanPin = pin.trim();
    const storedPin = dynamicConfig.security.adminPin;
    const isMatched = verifySecretSync(cleanPin, storedPin);

    if (isMatched) {
      setIsAdminAuthenticated(true);
      purgeLegacyPortalStorageKeys();
      return true;
    }
    return false;
  };

  const updateAdminPin = (newPin: string): boolean => {
    const cleanPin = newPin.trim();
    if (!cleanPin || cleanPin.length !== 4 || !/^\d{4}$/.test(cleanPin)) {
      showToast(lang === 'ar' ? 'رمز لوحة التحكم يجب أن يتكون من 4 أرقام عددية تماماً' : 'Admin PIN must be exactly 4 numeric digits');
      return false;
    }
    const hashedPin = hashSecretSync(cleanPin);
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      if (!clone.security) {
        clone.security = { ...siteConfig.security };
      }
      clone.security.adminPin = hashedPin;
      try {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(clone));
      } catch (e) {}
      return clone;
    });
    purgeLegacyPortalStorageKeys();
    showToast(lang === 'ar' ? 'تم تحديث وتشفير رمز الأدمن السري الجديد بنجاح!' : 'Admin PIN updated and encrypted successfully!');
    return true;
  };

  const resetAdminPinWithOwnerAuth = (newPin: string): boolean => {
    if (!isVerifiedCloudOwner()) {
      showToast(lang === 'ar' ? 'يجب توثيق هوية المالك عبر Google أولاً لاستعادة رمز الإدارة.' : 'Verified owner Google login required to reset Admin PIN.');
      return false;
    }
    const cleanPin = newPin.trim();
    if (!/^\d{4}$/.test(cleanPin)) {
      showToast(lang === 'ar' ? 'يرجى إدخال رمز جديد مكون من 4 أرقام' : 'Please enter a valid 4-digit numeric PIN');
      return false;
    }
    const hashedPin = hashSecretSync(cleanPin);
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      if (!clone.security) {
        clone.security = { ...siteConfig.security };
      }
      clone.security.adminPin = hashedPin;
      try {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(clone));
      } catch (e) {}
      return clone;
    });
    purgeLegacyPortalStorageKeys();
    setIsAdminAuthenticated(true);
    showToast(lang === 'ar' ? 'تم تعيين رمز الإدارة الجديد بنجاح بعد التحقق السحابي!' : 'Admin PIN securely updated after Google verification!');
    return true;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    purgeLegacyPortalStorageKeys();
  };

  const loginDeveloper = (pin: string) => {
    // Strictly require verified Firebase Cloud Owner identity before accepting the secondary local PIN
    if (!isVerifiedCloudOwner()) {
      setIsDevAuthenticated(false);
      return false;
    }
    const cleanPin = pin.trim();
    const storedPin = dynamicConfig.security.developerPin;
    const isMatched = verifySecretSync(cleanPin, storedPin);

    if (isMatched) {
      setIsDevAuthenticated(true);
      purgeLegacyPortalStorageKeys();
      return true;
    }
    return false;
  };

  const updateDeveloperPin = (newPin: string): boolean => {
    const cleanPin = newPin.trim();
    if (!cleanPin || cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) {
      showToast(lang === 'ar' ? 'رمز المطور يجب أن يتكون من 6 أرقام عددية تماماً' : 'Developer PIN must be exactly 6 numeric digits');
      return false;
    }
    const hashedPin = hashSecretSync(cleanPin);
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      if (!clone.security) {
        clone.security = { ...siteConfig.security };
      }
      clone.security.developerPin = hashedPin;
      try {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(clone));
      } catch (e) {}
      return clone;
    });
    purgeLegacyPortalStorageKeys();
    showToast(lang === 'ar' ? 'تم تحديث وتشفير رمز المطور السري الجديد بنجاح!' : 'Developer PIN updated and encrypted successfully!');
    return true;
  };

  const resetDeveloperPinWithAdminAuth = (newPin: string): boolean => {
    if (!isVerifiedCloudOwner()) {
      showToast(lang === 'ar' ? 'يجب توثيق هوية المالك عبر Google أولاً لاستعادة الرمز.' : 'Verified owner Google login required to reset PIN.');
      return false;
    }
    const cleanPin = newPin.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      showToast(lang === 'ar' ? 'يرجى إدخال رمز جديد مكون من 6 أرقام' : 'Please enter a valid 6-digit numeric PIN');
      return false;
    }
    const hashedPin = hashSecretSync(cleanPin);
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      if (!clone.security) {
        clone.security = { ...siteConfig.security };
      }
      clone.security.developerPin = hashedPin;
      try {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(clone));
      } catch (e) {}
      return clone;
    });
    purgeLegacyPortalStorageKeys();
    setIsDevAuthenticated(true);
    showToast(lang === 'ar' ? 'تم تعيين رمز المطور الجديد بنجاح بعد التحقق السحابي!' : 'Developer PIN securely updated after Google verification!');
    return true;
  };

  const logoutDeveloper = () => {
    setIsDevAuthenticated(false);
    purgeLegacyPortalStorageKeys();
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
    const authoritativeSummary = computeAuthoritativeOrderSummary({
      cart,
      catalogPool: getCatalogProductPool(),
      promoCode: customer.promoCode,
      selectedCity: customer.selectedCity || 'الخرطوم',
    });

    const finalUSD = authoritativeSummary.verifiedItems.length > 0
      ? authoritativeSummary.finalTotalUSD
      : Math.max(0, typeof customer.finalTotalUSD === 'number' && !isNaN(customer.finalTotalUSD) ? customer.finalTotalUSD : cartTotalUSD);

    const { text } = convertPrice(finalUSD);
    const trackingCode = generateTrackingCode();
    const newOrder: OrderRecord = {
      id: generateOrderId(),
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      customerName: customer.name,
      phone: customer.phone,
      address: customer.address,
      items: authoritativeSummary.verifiedItems.map((vi) => ({
        productName: vi.product.name[lang],
        quantity: vi.quantity,
        price: convertPrice(vi.lineTotalUSD).text,
      })),
      totalFormatted: text,
      totalUSD: finalUSD,
      discountAmountUSD: authoritativeSummary.discountAmountUSD,
      shippingFeeUSD: authoritativeSummary.shippingFeeUSD,
      promoCode: authoritativeSummary.appliedPromoCode || undefined,
      currency,
      status: 'received',
      trackingCode,
      ...(auth.currentUser?.uid ? { ownerUid: auth.currentUser.uid } : {}),
    };

    // Decrement stock for purchased items across all catalog presets
    setDynamicConfig((prevConfig) => {
      const updatedPresets = { ...prevConfig.presets };
      const cartQuantities = new Map<string, number>();
      cart.forEach((item) => {
        cartQuantities.set(item.product.id, (cartQuantities.get(item.product.id) || 0) + item.quantity);
      });

      // Synchronize stock decrement across all presets to ensure cosmetics & hair devices both update
      (Object.keys(updatedPresets) as (keyof typeof updatedPresets)[]).forEach((presetKey) => {
        const preset = updatedPresets[presetKey];
        if (preset && Array.isArray(preset.products)) {
          preset.products = preset.products.map((p: Product) => {
            const qtyBought = cartQuantities.get(p.id);
            if (qtyBought) {
              const currentStock = typeof p.stock === 'number' ? p.stock : 10;
              return {
                ...p,
                stock: Math.max(0, currentStock - qtyBought),
              };
            }
            return p;
          });
        }
      });

      const nextConfig = { ...prevConfig, presets: updatedPresets };
      try {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(nextConfig));
      } catch (_) {}
      return nextConfig;
    });

    setOrders((prev) => {
      const next = [newOrder, ...prev];
      safeStorage.setItem('luxe_cached_orders', JSON.stringify(next));
      return next;
    });

    // Store the customer's own last tracking code safely for quick lookup without exposing all orders
    try {
      safeStorage.setItem('luxe_my_last_tracking', trackingCode);
    } catch (_) {}

    // Cloud Firestore persistence (orders + sanitized tracking doc)
    persistOrderToCloud(newOrder).catch((err) => {
      console.warn('Could not persist order to Firestore in background:', err);
    });

    clearCart();
    setIsCartOpen(false);
    showToast(lang === 'ar' ? 'تم تسجيل طلبك وحفظه سحابياً بنجاح! رقم التتبع: ' + trackingCode : 'Order placed & saved to cloud! Tracking: ' + trackingCode);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderRecord['status']) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    setOrders((prev) => {
      const next = prev.map((o) => (o.id === orderId ? { ...o, status } : o));
      safeStorage.setItem('luxe_cached_orders', JSON.stringify(next));
      return next;
    });
    updateOrderStatusInCloud(orderId, status, targetOrder?.trackingCode).catch((err) => {
      console.warn('Could not update order status in cloud:', err);
    });
    showToast(lang === 'ar' ? 'تم تحديث حالة الطلب سحابياً بنجاح' : 'Order status updated in cloud');
  };

  const clearAllOrders = () => {
    const targets = orders.map((o) => ({ id: o.id, trackingCode: o.trackingCode }));
    setOrders([]);
    safeStorage.removeItem('luxe_cached_orders');
    safeStorage.setItem('luxe_orders_seeded_flag', 'cleared');
    clearAllOrdersFromCloud(targets).catch((err) => {
      console.warn('Could not clear orders from cloud:', err);
    });
    showToast(lang === 'ar' ? 'تم تفريغ سجل الطلبات بالكامل بنجاح' : 'All orders have been cleared');
  };

  const restoreDefaultOrders = () => {
    safeStorage.setItem('luxe_orders_seeded_flag', 'active');
    safeStorage.setItem('luxe_has_seeded_once', 'true');
    setOrders(defaultOrdersPreset);
    safeStorage.setItem('luxe_cached_orders', JSON.stringify(defaultOrdersPreset));
    for (const defOrder of defaultOrdersPreset) {
      persistOrderToCloud(defOrder).catch(() => {});
    }
    showToast(lang === 'ar' ? 'تمت استعادة الطلبات وتحديث السحابة بنجاح' : 'Default orders restored to cloud');
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
        customerUser,
        logoutCustomer,
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
        returnFromPDPToStore,
        comparisonList,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        isCompareModalOpen,
        setIsCompareModalOpen,
        isAdminAuthenticated,
        isCloudAdminVerified,
        firebaseAdminEmail,
        cloudConfigStatus,
        lastCloudSyncAt,
        publishStorefrontToCloud,
        loginAdmin,
        logoutAdmin,
        updateAdminPin,
        resetAdminPinWithOwnerAuth,
        isDevAuthenticated,
        loginDeveloper,
        logoutDeveloper,
        updateDeveloperPin,
        resetDeveloperPinWithAdminAuth,
        isDeveloperModeLocked,
        toggleLockDeveloperMode,
        orders,
        placeOrder,
        updateOrderStatus,
        clearAllOrders,
        restoreDefaultOrders,
        toastMessage,
        toastData,
        showToast,
        dismissToast,
        updateActiveDataField,
        sectionsControl,
        toggleSection,
        resetSections,
        sectionsOrder,
        reorderSections,
        moveSectionUp,
        moveSectionDown,
        resetSectionsOrder,
        clonedSections,
        toggleCloneSection,
        updateClonedSectionConfig,
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
        historyStack,
        canUndo,
        undoLastChange,
        recordHistorySnapshot,
        resetFieldToDefault,
        isFieldModified,
        resetEntireSectionToDefault,
        resetPresetToFactoryDefault,
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
