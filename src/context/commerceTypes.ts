import React from 'react';
import type {
  SiteConfig,
  Product,
  PresetNiche,
  ImportableTemplate,
} from '../data/siteConfig';
import type { GoldenSnapshotMeta } from '../data/goldenStoreConfig';

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

export type RouteName =
  | 'store'
  | 'admin'
  | 'developer'
  | 'pdp'
  | 'tracker'
  | 'about'
  | 'privacy'
  | 'wishlist'
  | 'cart'
  | 'login';

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

export interface CommerceContextType {
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

  // PDP & Pixel-Exact Scroll Restoration
  activeProduct: Product | null;
  openProductPDP: (p: Product, pushHistory?: boolean) => void;
  returnFromPDPToStore: (fromPopstate?: boolean) => void;
  getSavedStoreScrollY: () => number;

  // Product Comparison System
  comparisonList: string[];
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
  customerOrders: OrderRecord[];
  isLoadingCustomerOrders: boolean;
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
