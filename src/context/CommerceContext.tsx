import React, { createContext, useContext, useState, useEffect } from 'react';
import { siteConfig, SiteConfig, Product, PresetNiche } from '../data/siteConfig';

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
  currency: string;
  status: 'received' | 'processing' | 'dispatched' | 'delivered';
  trackingCode: string;
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
  
  // Auth PINs
  isAdminAuthenticated: boolean;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  
  isDevAuthenticated: boolean;
  loginDeveloper: (pin: string) => boolean;
  logoutDeveloper: () => void;
  
  // Self Destruct / Lock Mode
  isDeveloperModeLocked: boolean;
  toggleLockDeveloperMode: () => void;
  
  // Orders
  orders: OrderRecord[];
  placeOrder: (customer: { name: string; phone: string; address: string }) => OrderRecord;
  updateOrderStatus: (orderId: string, status: OrderRecord['status']) => void;
  
  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Inline editing helper
  updateActiveDataField: (path: string, value: string) => void;
}

const CommerceContext = createContext<CommerceContextType | null>(null);

const STORAGE_KEY_CONFIG = 'luxe_commerce_config_v2';
const STORAGE_KEY_PRESET = 'luxe_commerce_preset_v2';
const STORAGE_KEY_CURRENCY = 'luxe_commerce_currency_v1';
const STORAGE_KEY_LANG = 'luxe_commerce_lang_v1';
const STORAGE_KEY_LOCK = 'luxe_commerce_locked_v1';
const STORAGE_KEY_CART = 'so_beauty_cart_v2';
const STORAGE_KEY_WISHLIST = 'so_beauty_wishlist_v2';

export const CommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<'ar' | 'en'>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    return saved === 'en' ? 'en' : 'ar';
  });

  const [currency, setCurrencyState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CURRENCY);
    return saved && siteConfig.currencies[saved] ? saved : 'SDG';
  });

  const [activePresetId, setActivePresetIdState] = useState<'cosmetics' | 'fashion' | 'eyewear' | 'electronics'>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PRESET);
    return saved && ['cosmetics', 'fashion', 'eyewear', 'electronics'].includes(saved)
      ? (saved as any)
      : 'cosmetics';
  });

  const [dynamicConfig, setDynamicConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
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
    const savedLock = localStorage.getItem(STORAGE_KEY_LOCK) === 'true';
    return envLock || savedLock;
  });

  const [currentRoute, setCurrentRouteState] = useState<RouteName>('store');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isDevAuthenticated, setIsDevAuthenticated] = useState<boolean>(false);

  // Persistent Cart in LocalStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
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
      const saved = localStorage.getItem(STORAGE_KEY_WISHLIST);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load wishlist from storage', e);
    }
    return ['sb-01'];
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpenState] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Sync wishlist to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Sync route with both URL pathname and hash for universal compatibility
  const setCurrentRoute = (r: RouteName) => {
    setCurrentRouteState(r);
  };

  const navigateTo = (r: RouteName) => {
    setCurrentRouteState(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      if (r === 'store') {
        window.history.pushState(null, '', '/');
        window.location.hash = '';
      } else {
        window.history.pushState(null, '', `/${r}`);
        window.location.hash = r;
      }
    } catch (e) {
      window.location.hash = r;
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

  // Convert USD price to current currency
  const convertPrice = (usdPrice: number) => {
    const curConfig = dynamicConfig.currencies[currency] || dynamicConfig.currencies['USD'];
    const converted = usdPrice * curConfig.rate;
    const isCrypto = !!curConfig.isCrypto;

    let value: string;
    if (isCrypto) {
      value = converted < 0.01 ? converted.toFixed(6) : converted.toFixed(4);
    } else if (converted >= 100) {
      value = Math.round(converted).toLocaleString();
    } else {
      value = converted.toFixed(2);
    }

    const text = lang === 'ar' ? `${value} ${curConfig.symbol}` : `${curConfig.symbol}${value}`;
    return { value, symbol: curConfig.symbol, text, isCrypto };
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
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
    showToast(lang === 'ar' ? `تمت إضافة "${product.name[lang]}" إلى السلة` : `Added "${product.name[lang]}" to bag`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
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

  const clearCart = () => setCart([]);

  const cartTotalUSD = cart.reduce(
    (sum, item) => sum + item.product.basePriceUSD * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(
        exists
          ? (lang === 'ar' ? 'تمت إزالة المنتج من المفضلة' : 'Removed from wishlist')
          : (lang === 'ar' ? 'تمت إضافة المنتج إلى المفضلة ❤️' : 'Added to wishlist ❤️')
      );
      return next;
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
    showToast(lang === 'ar' ? 'تم تفريغ قائمة المفضلة' : 'Wishlist cleared');
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

  const loginAdmin = (pin: string) => {
    if (pin.trim() === dynamicConfig.security.adminPin) {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => setIsAdminAuthenticated(false);

  const loginDeveloper = (pin: string) => {
    if (pin.trim() === dynamicConfig.security.developerPin) {
      setIsDevAuthenticated(true);
      return true;
    }
    return false;
  };

  const logoutDeveloper = () => setIsDevAuthenticated(false);

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

  const placeOrder = (customer: { name: string; phone: string; address: string }) => {
    const { text } = convertPrice(cartTotalUSD);
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
      currency,
      status: 'received',
      trackingCode,
    };

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
        showToast,
        updateActiveDataField,
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
