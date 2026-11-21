import React, { useEffect, useState } from 'react';
import {
  X,
  Home,
  Package,
  LayoutGrid,
  Wind,
  Heart,
  Leaf,
  Truck,
  Globe,
  ChevronDown,
  User,
  LogOut,
  Check,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { StoreCartIcon } from './common/StoreCartIcon';
import { useCommerce } from '../context/CommerceContext';
import { PWAInstallMenuItem } from './PWAInstallBanner';

interface MobileNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavigationDrawer: React.FC<MobileNavigationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    lang,
    setLang,
    currency,
    setCurrency,
    dynamicConfig,
    activeData,
    cartCount,
    cartTotalUSD,
    convertPrice,
    wishlist,
    currentRoute,
    navigateTo,
    customerUser,
    logoutCustomer,
    sectionsControl,
  } = useCommerce();

  const isRtl = lang === 'ar';
  const currencyList = Object.entries(dynamicConfig.currencies);
  const currentCurrencyObj =
    dynamicConfig.currencies[currency] ||
    dynamicConfig.currencies['SDG'] ||
    dynamicConfig.currencies['USD'];
  const [isCurrencyListOpen, setIsCurrencyListOpen] = useState(false);

  // Lock background scroll & close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Resolve currency symbol whether stored as plain string or bilingual map
  const resolveCurrencySymbol = (sym: string | { ar: string; en: string }): string =>
    typeof sym === 'string' ? sym : sym[lang];

  // Format currency label cleanly without duplicating code (e.g. "SDG · ج.س" instead of "SDG · SDG")
  const formatCurrencyTag = (code: string, symbolValue: string | { ar: string; en: string }) => {
    const cleanSymbol = resolveCurrencySymbol(symbolValue)?.trim();
    if (!cleanSymbol || cleanSymbol.toUpperCase() === code.toUpperCase()) {
      return code;
    }
    return `${code} · ${cleanSymbol}`;
  };

  const navigateToSection = (sectionId: string) => {
    if (currentRoute !== 'store') {
      navigateTo('store');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 140);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
    onClose();
  };

  const cartSubtotalFormatted = cartCount > 0 ? convertPrice(cartTotalUSD).text : null;
  const firstCustomerName = customerUser?.name?.split(' ')[0] || '';

  return (
    <div
      className="fixed inset-0 z-[9999] isolate"
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'ar' ? 'قائمة التنقل الجانبية' : 'Store Navigation Drawer'}
    >
      {/* Translucent Soft Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/35 backdrop-blur-[3px] transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Side Sliding Panel (Logical start-edge for seamless RTL/LTR flipping) */}
      <aside
        className={`fixed top-0 bottom-0 start-0 z-10 w-[82vw] max-w-[340px] h-[100dvh] bg-white shadow-2xl flex flex-col justify-between overflow-hidden transition-transform duration-300 ease-out animate-in rounded-e-[28px] border-e border-slate-200/80 ${
          isRtl ? 'slide-in-from-right' : 'slide-in-from-left'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP HEADER: Brand Identity + Subtle Member Greeting + 44px Close */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/60">
          <button
            type="button"
            onClick={() => {
              navigateTo('store');
              onClose();
            }}
            className="text-start flex flex-col items-start justify-center cursor-pointer min-h-[44px]"
          >
            {activeData.storeLogo ? (
              <img
                src={activeData.storeLogo}
                alt={`${activeData.storeName.en} - ${activeData.storeName.ar}`}
                className="h-8 w-auto max-h-8 object-contain"
              />
            ) : (
              <div className="flex flex-col items-start justify-center gap-0.5">
                <span className="font-brand-geometric font-black text-lg text-slate-900 tracking-[0.2em] uppercase leading-none">
                  {activeData.storeName.en}
                </span>
                <span className="font-brand-ar font-bold text-xs text-slate-600 leading-tight">
                  {activeData.storeName.ar}
                </span>
              </div>
            )}
            {firstCustomerName && (
              <span className="text-[11px] font-medium text-[#5A3E7A] mt-0.5 leading-relaxed">
                {lang === 'ar'
                  ? `أهلاً بكِ، ${firstCustomerName}`
                  : `Welcome, ${firstCustomerName}`}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 rounded-full text-slate-500 hover:text-slate-900 hover:bg-white flex items-center justify-center transition-colors min-h-[44px] min-w-[44px] border border-transparent hover:border-slate-200 cursor-pointer"
            aria-label={lang === 'ar' ? 'إغلاق القائمة' : 'Close Menu'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SCROLLABLE BODY: Clean Grouped Lists (Material 3 / Luxe Pro) */}
        <nav
          className="flex-1 overflow-y-auto overscroll-contain px-3.5 py-4 space-y-5"
          aria-label={lang === 'ar' ? 'روابط المتجر' : 'Store Links'}
        >
          {/* GROUP 1: Shop & Quick Shortcuts */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 block px-3 pb-1 leading-relaxed">
              {lang === 'ar' ? 'التسوق والأقسام' : 'Shop & Explore'}
            </span>

            {/* Home (Real Home Icon + Crisp Active Pill State) */}
            <button
              type="button"
              onClick={() => {
                navigateTo('store');
                onClose();
              }}
              aria-current={currentRoute === 'store' ? 'page' : undefined}
              className={`w-full text-start px-3.5 py-2.5 rounded-full text-sm sm:text-base flex items-center gap-3.5 transition-colors min-h-[46px] cursor-pointer leading-relaxed ${
                currentRoute === 'store'
                  ? 'bg-[#5A3E7A]/12 text-[#5A3E7A] font-bold'
                  : 'text-slate-800 font-medium hover:bg-slate-100/80'
              }`}
            >
              <Home className="w-5 h-5 shrink-0" />
              <span>{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
            </button>

            {/* All Products */}
            <button
              type="button"
              onClick={() => navigateToSection('products-section')}
              className="w-full text-start px-3.5 py-2.5 rounded-full text-sm sm:text-base font-medium text-slate-800 hover:bg-slate-100/80 flex items-center gap-3.5 transition-colors min-h-[46px] cursor-pointer leading-relaxed"
            >
              <Package className="w-5 h-5 text-slate-500 shrink-0" />
              <span>{lang === 'ar' ? 'جميع المنتجات' : 'All Products'}</span>
            </button>

            {/* Quick Jump: Store Categories */}
            {sectionsControl.productsCatalog && (
              <button
                type="button"
                onClick={() => navigateToSection('categories-section')}
                className="w-full text-start px-3.5 py-2.5 rounded-full text-sm sm:text-base font-medium text-slate-800 hover:bg-slate-100/80 flex items-center gap-3.5 transition-colors min-h-[46px] cursor-pointer leading-relaxed"
              >
                <LayoutGrid className="w-5 h-5 text-slate-500 shrink-0" />
                <span>{lang === 'ar' ? 'أركان منتجاتنا' : 'Shop by Category'}</span>
              </button>
            )}

            {/* Quick Jump: Hair Devices Spotlight */}
            {sectionsControl.hairDevices && (
              <button
                type="button"
                onClick={() => navigateToSection('hair-devices-section')}
                className="w-full text-start px-3.5 py-2.5 rounded-full text-sm sm:text-base font-medium text-slate-800 hover:bg-slate-100/80 flex items-center gap-3.5 transition-colors min-h-[46px] cursor-pointer leading-relaxed"
              >
                <Wind className="w-5 h-5 text-slate-500 shrink-0" />
                <span>{lang === 'ar' ? 'أجهزة تصفيف الشعر' : 'Hair Styling Devices'}</span>
              </button>
            )}

            {/* Live Order Tracking */}
            <button
              type="button"
              onClick={() => {
                navigateTo('tracker');
                onClose();
              }}
              aria-current={currentRoute === 'tracker' ? 'page' : undefined}
              className={`w-full text-start px-3.5 py-2.5 rounded-full text-sm sm:text-base flex items-center gap-3.5 transition-colors min-h-[46px] cursor-pointer leading-relaxed ${
                currentRoute === 'tracker'
                  ? 'bg-[#5A3E7A]/12 text-[#5A3E7A] font-bold'
                  : 'text-slate-800 font-medium hover:bg-slate-100/80'
              }`}
            >
              <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{lang === 'ar' ? 'تتبع شحنتكِ' : 'Track Your Order'}</span>
            </button>
          </div>

          {/* Hairline Group Divider */}
          <div className="border-t border-slate-100 mx-2" aria-hidden="true" />

          {/* GROUP 2: My Bag, Wishlist & Brand Story */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 block px-3 pb-1 leading-relaxed">
              {lang === 'ar' ? 'حقيبتي وحسابي' : 'My Bag & Store'}
            </span>

            {/* Shopping Basket with Live Count & Subtotal */}
            <button
              type="button"
              onClick={() => {
                navigateTo('cart');
                onClose();
              }}
              aria-current={currentRoute === 'cart' ? 'page' : undefined}
              className={`w-full text-start px-3.5 py-2.5 rounded-full text-sm sm:text-base flex items-center justify-between gap-2 transition-colors min-h-[46px] cursor-pointer leading-relaxed ${
                currentRoute === 'cart'
                  ? 'bg-[#5A3E7A]/12 text-[#5A3E7A] font-bold'
                  : 'text-slate-800 font-medium hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <StoreCartIcon size="sm" className="text-[#5A3E7A] shrink-0" />
                <span className="truncate">
                  {lang === 'ar' ? 'سلة المشتريات' : 'Shopping Bag'}
                </span>
              </div>
              {cartCount > 0 && (
                <div className="flex items-center gap-2 shrink-0">
                  {cartSubtotalFormatted && (
                    <span className="text-xs font-semibold text-slate-500">
                      {cartSubtotalFormatted}
                    </span>
                  )}
                  <span className="min-w-[24px] h-6 px-1.5 bg-[#5A3E7A] text-white text-xs font-bold rounded-full inline-flex items-center justify-center">
                    {cartCount}
                  </span>
                </div>
              )}
            </button>

            {/* Wishlist */}
            <button
              type="button"
              onClick={() => {
                navigateTo('wishlist');
                onClose();
              }}
              aria-current={currentRoute === 'wishlist' ? 'page' : undefined}
              className={`w-full text-start px-3.5 py-2.5 rounded-full text-sm sm:text-base flex items-center justify-between gap-2 transition-colors min-h-[46px] cursor-pointer leading-relaxed ${
                currentRoute === 'wishlist'
                  ? 'bg-[#5A3E7A]/12 text-[#5A3E7A] font-bold'
                  : 'text-slate-800 font-medium hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <Heart
                  className={`w-5 h-5 shrink-0 ${
                    wishlist.length > 0
                      ? 'text-rose-500 fill-rose-500'
                      : 'text-slate-500'
                  }`}
                />
                <span className="truncate">
                  {lang === 'ar' ? 'المفضلة' : 'Wishlist'}
                </span>
              </div>
              {wishlist.length > 0 && (
                <span className="min-w-[24px] h-6 px-1.5 bg-rose-500 text-white text-xs font-bold rounded-full inline-flex items-center justify-center shrink-0">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Our Story */}
            <button
              type="button"
              onClick={() => {
                navigateTo('about');
                onClose();
              }}
              aria-current={currentRoute === 'about' ? 'page' : undefined}
              className={`w-full text-start px-3.5 py-2.5 rounded-full text-sm sm:text-base flex items-center gap-3.5 transition-colors min-h-[46px] cursor-pointer leading-relaxed ${
                currentRoute === 'about'
                  ? 'bg-[#5A3E7A]/12 text-[#5A3E7A] font-bold'
                  : 'text-slate-800 font-medium hover:bg-slate-100/80'
              }`}
            >
              <Leaf className="w-5 h-5 text-slate-500 shrink-0" />
              <span>{lang === 'ar' ? 'قصتنا وهوية المتجر' : 'Our Story'}</span>
            </button>

            {/* Frequently Asked Questions */}
            <button
              type="button"
              onClick={() => navigateToSection('faq-section')}
              className="w-full text-start px-3.5 py-2.5 rounded-full text-sm sm:text-base font-medium text-slate-800 hover:bg-slate-100/80 flex items-center gap-3.5 transition-colors min-h-[46px] cursor-pointer leading-relaxed"
            >
              <HelpCircle className="w-5 h-5 text-slate-500 shrink-0" />
              <span>{lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</span>
            </button>

            {/* Privacy Policy */}
            <button
              type="button"
              onClick={() => {
                navigateTo('privacy');
                onClose();
              }}
              aria-current={currentRoute === 'privacy' ? 'page' : undefined}
              className={`w-full text-start px-3.5 py-2.5 rounded-full text-sm sm:text-base flex items-center gap-3.5 transition-colors min-h-[46px] cursor-pointer leading-relaxed ${
                currentRoute === 'privacy'
                  ? 'bg-[#5A3E7A]/12 text-[#5A3E7A] font-bold'
                  : 'text-slate-800 font-medium hover:bg-slate-100/80'
              }`}
            >
              <ShieldCheck className="w-5 h-5 text-slate-500 shrink-0" />
              <span>{lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
            </button>
          </div>

          {/* Hairline Group Divider */}
          <div className="border-t border-slate-100 mx-2" aria-hidden="true" />

          {/* COMPACT SINGLE-ROW PREFERENCES STRIP (Zero Bulky Cards / Zero Clipping) */}
          <div className="px-1.5 space-y-2.5">
            <span className="text-xs font-semibold text-slate-400 block px-1.5 leading-relaxed">
              {lang === 'ar' ? 'العملة واللغة' : 'Currency & Language'}
            </span>

            <div className="grid grid-cols-2 gap-2">
              {/* Compact Currency Picker */}
              <button
                type="button"
                onClick={() => setIsCurrencyListOpen((prev) => !prev)}
                aria-expanded={isCurrencyListOpen}
                className="px-3 py-2.5 rounded-2xl bg-slate-100/90 hover:bg-slate-100 border border-slate-200/80 text-slate-800 text-xs font-bold flex items-center justify-between gap-1.5 min-h-[44px] transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5 min-w-0 truncate">
                  <span className="text-base leading-none shrink-0">
                    {currentCurrencyObj.country}
                  </span>
                  <span className="truncate">
                    {formatCurrencyTag(currency, currentCurrencyObj.symbol)}
                  </span>
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform duration-200 ${
                    isCurrencyListOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Compact Secondary Language Toggle (Does not compete with primary CTA) */}
              <button
                type="button"
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                className="px-3 py-2.5 rounded-2xl bg-slate-100/90 hover:bg-purple-50 border border-slate-200/80 hover:border-purple-200 text-slate-800 hover:text-[#5A3E7A] text-xs font-bold flex items-center justify-center gap-1.5 min-h-[44px] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Globe className="w-4 h-4 text-[#5A3E7A] shrink-0" />
                <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
              </button>
            </div>

            {/* Expandable Compact Currency List */}
            {isCurrencyListOpen && (
              <div className="p-1.5 rounded-2xl bg-slate-50 border border-slate-200/80 max-h-44 overflow-y-auto space-y-0.5">
                {currencyList.map(([code, config]) => {
                  const localizedSymbol = resolveCurrencySymbol(config.symbol)?.trim();
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        setCurrency(code);
                        setIsCurrencyListOpen(false);
                      }}
                      className={`w-full text-start px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors min-h-[40px] cursor-pointer ${
                        currency === code
                          ? 'bg-[#5A3E7A]/12 font-bold text-[#5A3E7A]'
                          : 'hover:bg-white text-slate-700 font-medium'
                      }`}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="text-base leading-none">{config.country}</span>
                        <span className="font-mono font-bold">{code}</span>
                        {localizedSymbol &&
                          localizedSymbol.toUpperCase() !== code.toUpperCase() && (
                            <span className="text-slate-500 truncate">
                              ({localizedSymbol})
                            </span>
                          )}
                      </span>
                      {currency === code && (
                        <Check className="w-4 h-4 text-[#5A3E7A] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* PWA Install Action (renders only when installable) */}
            <PWAInstallMenuItem onActionComplete={onClose} />
          </div>
        </nav>

        {/* STICKY FOOTER: Clean Account Bar or Single Primary Sign-In CTA */}
        <div className="p-4 border-t border-slate-100 bg-white shrink-0 space-y-2.5">
          {customerUser ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="w-9 h-9 rounded-full bg-[#5A3E7A]/12 text-[#5A3E7A] flex items-center justify-center shrink-0 font-bold text-sm">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1 text-start">
                  <p className="text-sm font-bold text-slate-900 truncate leading-snug">
                    {customerUser.name}
                  </p>
                  {customerUser.email && (
                    <p
                      className="text-xs text-slate-500 truncate"
                      dir="ltr"
                    >
                      {customerUser.email}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  void logoutCustomer();
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 min-h-[44px] transition-colors active:scale-[0.98] cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                navigateTo('login');
              }}
              className="w-full py-3 px-4 bg-[#5A3E7A] hover:bg-[#4A3266] text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2.5 min-h-[48px] shadow-md shadow-[#5A3E7A]/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              <User className="w-4 h-4 shrink-0" />
              <span>
                {lang === 'ar' ? 'تسجيل الدخول / حسابي' : 'Sign In / My Account'}
              </span>
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};
