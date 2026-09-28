import React, { useEffect } from 'react';
import { 
  X, Heart, Globe, ChevronDown, User, Sparkles, 
  ArrowRight, ArrowLeft, Truck, Package, ShieldCheck, Check
} from 'lucide-react';
import { StoreCartIcon } from './common/StoreCartIcon';
import { useCommerce } from '../context/CommerceContext';

interface MobileNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavigationDrawer: React.FC<MobileNavigationDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    lang, setLang, currency, setCurrency, dynamicConfig, 
    activeData, cartCount, wishlist, 
    currentRoute, navigateTo 
  } = useCommerce();

  const isRtl = lang === 'ar';
  const currencyList = Object.entries(dynamicConfig.currencies);
  const currentCurrencyObj = dynamicConfig.currencies[currency] || dynamicConfig.currencies['SDG'] || dynamicConfig.currencies['USD'];
  const [isCurrencyListOpen, setIsCurrencyListOpen] = React.useState(false);

  // Prevent background scroll when side drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] isolate"
      role="dialog" 
      aria-modal="true"
      aria-label={lang === 'ar' ? 'قائمة المتجر الجانبية الفاخرة' : 'Store Side Navigation Drawer'}
    >
      {/* 1. Translucent Soft Backdrop (Allows seeing products and store content through a soft blur) */}
      <div 
        className="fixed inset-0 bg-slate-950/30 backdrop-blur-[3px] transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Side Sliding Panel:
          - Arabic (RTL): fixed to the RIGHT (right-0), slides in from right, inner corners rounded to the left (rounded-s-3xl)
          - English (LTR): fixed to the LEFT (left-0), slides in from left, inner corners rounded to the right (rounded-e-3xl)
          - Takes comfortable width: 75vw - 80vw (max 340px) so the store background remains visible!
      */}
      <aside 
        className={`fixed top-0 bottom-0 z-10 w-[78vw] max-w-[340px] h-[100dvh] bg-white/95 backdrop-blur-2xl shadow-[-10px_0_40px_rgba(0,0,0,0.18)] flex flex-col justify-between overflow-hidden transition-transform duration-300 ease-out animate-in ${
          isRtl 
            ? 'right-0 rounded-s-[28px] border-s border-purple-100/80 slide-in-from-right' 
            : 'left-0 rounded-e-[28px] border-e border-purple-100/80 slide-in-from-left'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ============================================================ */}
        {/* TOP HEADER: Store Identity & Smooth Close Action             */}
        {/* ============================================================ */}
        <div className="p-4 border-b border-purple-100/60 flex items-center justify-between shrink-0 bg-purple-50/40">
          <div 
            onClick={() => {
              navigateTo('store');
              onClose();
            }}
            className="cursor-pointer flex items-center select-none"
          >
            {activeData.storeLogo ? (
              <img 
                src={activeData.storeLogo} 
                alt={`${activeData.storeName.en} - ${activeData.storeName.ar}`} 
                className="h-8 w-auto max-h-8 object-contain" 
              />
            ) : (
              <div className="flex flex-col items-start justify-center gap-0.5">
                <span className="font-brand-geometric font-black text-lg text-slate-950 tracking-[0.2em] uppercase leading-none">
                  {activeData.storeName.en}
                </span>
                <span className="font-brand-ar font-extrabold text-xs text-slate-700 leading-tight">
                  {activeData.storeName.ar.includes('ـ') ? activeData.storeName.ar : (activeData.storeName.ar === 'نَدِي' || activeData.storeName.ar === 'ندي' ? 'نَـــــدِي' : activeData.storeName.ar)}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full text-slate-500 hover:text-slate-900 hover:bg-white flex items-center justify-center transition-colors min-h-[44px] min-w-[44px] border border-transparent hover:border-purple-100 shadow-2xs"
            aria-label={lang === 'ar' ? 'إغلاق القائمة' : 'Close Menu'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* SCROLLABLE BODY: Navigation Links, Preferences & Settings    */}
        {/* ============================================================ */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-5">
          
          {/* Main Navigation Links */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-black text-slate-400 tracking-wider uppercase block px-2 mb-1">
              {lang === 'ar' ? 'أقسام المتجر' : 'Navigation'}
            </span>

            {/* Home Link */}
            <button
              onClick={() => {
                navigateTo('store');
                onClose();
              }}
              className={`w-full text-start px-3.5 py-3 rounded-2xl font-bold text-sm flex items-center justify-between transition-colors min-h-[46px] ${
                currentRoute === 'store' 
                  ? 'bg-purple-100/90 text-[#5A3E7A] shadow-xs' 
                  : 'text-slate-800 hover:bg-purple-50/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#5A3E7A]" />
                <span>{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
              </div>
              {isRtl ? <ArrowLeft className="w-4 h-4 text-slate-400" /> : <ArrowRight className="w-4 h-4 text-slate-400" />}
            </button>

            {/* All Products */}
            <button
              onClick={() => {
                if (currentRoute !== 'store') {
                  navigateTo('store');
                  setTimeout(() => {
                    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 120);
                } else {
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                }
                onClose();
              }}
              className="w-full text-start px-3.5 py-3 rounded-2xl font-bold text-sm flex items-center justify-between text-slate-800 hover:bg-purple-50/50 transition-colors min-h-[46px]"
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-[#5A3E7A]" />
                <span>{lang === 'ar' ? 'منتجاتنا بالكامل' : 'All Products'}</span>
              </div>
              {isRtl ? <ArrowLeft className="w-4 h-4 text-slate-400" /> : <ArrowRight className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => {
                navigateTo('wishlist');
                onClose();
              }}
              className={`w-full text-start px-3.5 py-3 rounded-2xl font-bold text-sm flex items-center justify-between transition-colors min-h-[46px] ${
                currentRoute === 'wishlist' 
                  ? 'bg-purple-100/90 text-[#5A3E7A] shadow-xs' 
                  : 'text-slate-800 hover:bg-purple-50/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-600'}`} />
                <span>{lang === 'ar' ? 'المفضلة الفاخرة' : 'Wishlist'}</span>
              </div>
              <div className="flex items-center gap-2">
                {wishlist.length > 0 && (
                  <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-full">
                    {wishlist.length}
                  </span>
                )}
                {isRtl ? <ArrowLeft className="w-4 h-4 text-slate-400" /> : <ArrowRight className="w-4 h-4 text-slate-400" />}
              </div>
            </button>

            {/* Shopping Basket */}
            <button
              onClick={() => {
                navigateTo('cart');
                onClose();
              }}
              className={`w-full text-start px-3.5 py-3 rounded-2xl font-bold text-sm flex items-center justify-between transition-colors min-h-[46px] ${
                currentRoute === 'cart' 
                  ? 'bg-purple-100/90 text-[#5A3E7A] shadow-xs' 
                  : 'text-slate-800 hover:bg-purple-50/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <StoreCartIcon size="sm" className="text-[#5A3E7A]" />
                <span>{lang === 'ar' ? 'سلة المشتريات' : 'Shopping Basket'}</span>
              </div>
              <div className="flex items-center gap-2">
                {cartCount > 0 && (
                  <span className="px-2.5 py-0.5 bg-[#5A3E7A] text-white text-[11px] font-black rounded-full shadow-xs">
                    {cartCount}
                  </span>
                )}
                {isRtl ? <ArrowLeft className="w-4 h-4 text-slate-400" /> : <ArrowRight className="w-4 h-4 text-slate-400" />}
              </div>
            </button>

            {/* Our Story */}
            <button
              onClick={() => {
                navigateTo('about');
                onClose();
              }}
              className={`w-full text-start px-3.5 py-3 rounded-2xl font-bold text-sm flex items-center justify-between transition-colors min-h-[46px] ${
                currentRoute === 'about' 
                  ? 'bg-purple-100/90 text-[#5A3E7A] shadow-xs' 
                  : 'text-slate-800 hover:bg-purple-50/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{lang === 'ar' ? 'من نحن وقصة المتجر' : 'Our Story'}</span>
              </div>
              {isRtl ? <ArrowLeft className="w-4 h-4 text-slate-400" /> : <ArrowRight className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Live Order Tracking */}
            <button
              onClick={() => {
                navigateTo('tracker');
                onClose();
              }}
              className={`w-full text-start px-3.5 py-3 rounded-2xl font-bold text-sm flex items-center justify-between transition-colors min-h-[46px] ${
                currentRoute === 'tracker' 
                  ? 'bg-purple-100/90 text-[#5A3E7A] shadow-xs' 
                  : 'text-slate-800 hover:bg-purple-50/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'ar' ? 'تتبع الشحنة المباشر' : 'Live Order Tracking'}</span>
              </div>
              {isRtl ? <ArrowLeft className="w-4 h-4 text-slate-400" /> : <ArrowRight className="w-4 h-4 text-slate-400" />}
            </button>
          </div>

          {/* ============================================================ */}
          {/* STORE PREFERENCES & SETTINGS PANEL                          */}
          {/* ============================================================ */}
          <div className="pt-3 border-t border-purple-100/70 space-y-3">
            <span className="text-[11px] font-black text-slate-400 tracking-wider uppercase block px-2">
              {lang === 'ar' ? 'إعدادات المتجر والتخصيص' : 'Settings & Preferences'}
            </span>

            {/* Currency Selector Accordion Card */}
            <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setIsCurrencyListOpen(!isCurrencyListOpen)}
                className="w-full p-3 flex items-center justify-between text-start"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{currentCurrencyObj.country}</span>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {lang === 'ar' ? 'عملة المتجر والأسعار' : 'Store Currency'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono font-bold">
                      {currency} · {currentCurrencyObj.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-purple-100 text-xs font-black text-[#5A3E7A] shadow-2xs">
                  <span>{currency}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCurrencyListOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {isCurrencyListOpen && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-200/60 max-h-48 overflow-y-auto space-y-1">
                  {currencyList.map(([code, config]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setCurrency(code);
                        setIsCurrencyListOpen(false);
                      }}
                      className={`w-full text-start px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        currency === code 
                          ? 'bg-purple-100/80 font-black text-[#5A3E7A]' 
                          : 'hover:bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{config.country}</span>
                        <span className="font-mono font-bold text-xs">{code}</span>
                        <span className="text-slate-500 text-[11px] truncate max-w-[120px]">{config.name}</span>
                      </div>
                      {currency === code && <Check className="w-3.5 h-3.5 text-[#5A3E7A]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Switcher Card */}
            <div className="bg-slate-50/90 border border-slate-200/80 p-3 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#5A3E7A]" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    {lang === 'ar' ? 'لغة الواجهة' : 'Store Language'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {lang === 'ar' ? 'العربية (RTL)' : 'English (LTR)'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                className="px-3.5 py-1.5 rounded-xl bg-[#5A3E7A] text-white text-xs font-black shadow-xs hover:bg-[#483162] transition-colors"
              >
                {lang === 'ar' ? 'English (EN)' : 'العربية (AR)'}
              </button>
            </div>

            {/* Quick Guarantees Badge */}
            <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100/70 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="text-[11px] text-purple-950 font-medium leading-relaxed">
                {lang === 'ar'
                  ? 'مستحضرات أصلية 100% • دفع عند الاستلام • شحن سريع لكافة المدن'
                  : '100% Authentic • Cash on Delivery • Fast Express Shipping'}
              </p>
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* BOTTOM FIXED FOOTER: Sign In / Account Action Button         */}
        {/* ============================================================ */}
        <div className="p-4 border-t border-purple-100/70 bg-white/95 shrink-0 space-y-2">
          <button
            onClick={() => {
              onClose();
              navigateTo('login');
            }}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#5A3E7A] to-[#483162] hover:opacity-95 text-white rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 min-h-[48px] shadow-md transition-all active:scale-[0.98]"
          >
            <User className="w-4 h-4 text-purple-200" />
            <span>{lang === 'ar' ? 'تسجيل الدخول / فتح الحساب' : 'Sign In / Customer Account'}</span>
          </button>
        </div>

      </aside>
    </div>
  );
};
