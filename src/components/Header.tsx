import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, Search, Globe, ChevronDown, User,
  Sparkles, Check, Menu, X, ArrowRight, ArrowLeft, Truck, 
  ChevronRight, Star, ExternalLink, ShieldCheck 
} from 'lucide-react';
import { StoreCartIcon } from './common/StoreCartIcon';
import { useCommerce } from '../context/CommerceContext';
import { Product } from '../data/siteConfig';
import { SearchModal } from './SearchModal';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { 
    lang, setLang, currency, setCurrency, dynamicConfig, 
    activeData, cartCount, wishlist, 
    currentRoute, navigateTo, setIsAuthModalOpen,
    openProductPDP, convertPrice 
  } = useCommerce();

  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const currencyMenuRef = useRef<HTMLDivElement>(null);
  const isRtl = lang === 'ar';
  const currencyList = Object.entries(dynamicConfig.currencies);
  const currentCurrencyObj = dynamicConfig.currencies[currency] || dynamicConfig.currencies['USD'];

  // Close currency dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(event.target as Node)) {
        setIsCurrencyDropdownOpen(false);
      }
    };
    if (isCurrencyDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCurrencyDropdownOpen]);

  // Top Announcement Multi-Slide Animated Messages
  const announcementSlides = [
    {
      ar: "تسوقي بذكاء: احفظي في المفضلة ❤️ • قارني المواصفات ⚖️ • اطلبي فـوراً عبر السلة أو واتساب 💬",
      en: "Smart Shopping: Save to Wishlist ❤️ • Compare Specs ⚖️ • Order via Cart or WhatsApp 💬"
    },
    {
      ar: "شحن سريع وعناية نباتية فائقة 🚚 • دفع آمن عند الاستلام أو أونلاين ✨",
      en: "Fast Delivery & Pure Botanical Care 🚚 • Cash on Delivery or Secure Online Checkout ✨"
    },
    {
      ar: "مستحضرات نَدِي الأصلية 100% 🌿 • ترطيب يدوم 24 ساعة ونقاء طبيعي",
      en: "100% Authentic NADI Skincare 🌿 • 24H Lasting Moisture & Natural Purity"
    }
  ];
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isAnnouncementPaused, setIsAnnouncementPaused] = useState(false);

  useEffect(() => {
    if (isAnnouncementPaused) return;
    const interval = setInterval(() => {
      setActiveSlideIdx(prev => (prev + 1) % announcementSlides.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [isAnnouncementPaused, announcementSlides.length]);

  return (
    <header className="sticky top-0 z-40 w-full shadow-xs bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
      
      {/* 1. TOP ANNOUNCEMENT BAR (Intelligent Animated Auto-Rotating Multi-Slide Ticker) */}
      <div 
        className="bg-theme-primary text-white text-xs py-2 px-3 sm:px-6 transition-colors border-b border-white/10"
        onMouseEnter={() => setIsAnnouncementPaused(true)}
        onMouseLeave={() => setIsAnnouncementPaused(false)}
        onTouchStart={() => setIsAnnouncementPaused(true)}
        onTouchEnd={() => setIsAnnouncementPaused(false)}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Animated Announcement Text with Smooth Slide Fade */}
          <div className="flex-1 min-w-0 flex items-center gap-1.5 sm:gap-2 overflow-hidden">
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-300 animate-pulse" />
            <div className="flex-1 min-w-0 relative h-4.5 sm:h-5 flex items-center">
              {announcementSlides.map((slide, idx) => (
                <p 
                  key={idx}
                  className={`absolute inset-0 flex items-center font-medium tracking-wide text-[10px] sm:text-xs text-purple-50 transition-all duration-500 transform ${
                    idx === activeSlideIdx 
                      ? 'opacity-100 translate-y-0 pointer-events-auto' 
                      : 'opacity-0 translate-y-2 pointer-events-none'
                  }`}
                >
                  <span className="truncate">{slide[lang]}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Currency & Language Controls with Safe Proportional Spacing */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Currency Selector */}
            <div className="relative" ref={currencyMenuRef}>
              <button
                onClick={() => {
                  setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen);
                }}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider transition-colors min-h-[32px] border border-white/10"
                aria-label="Currency Selector"
              >
                <span>{currentCurrencyObj.country}</span>
                <span className="font-mono">{currency}</span>
                <ChevronDown className={`w-3 h-3 text-purple-200 transition-transform duration-200 ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCurrencyDropdownOpen && (
                <div 
                  className={`absolute top-full mt-2 w-44 bg-white/95 backdrop-blur-xl text-slate-800 rounded-2xl shadow-2xl border border-purple-100/80 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${isRtl ? 'end-0 sm:start-0' : 'end-0'}`}
                >
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                    <span>{lang === 'ar' ? 'تحويل العملة' : 'Currency'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="max-h-56 overflow-y-auto py-1 divide-y divide-slate-50">
                    {currencyList.map(([code, config]) => (
                      <button
                        key={code}
                        onClick={() => {
                          setCurrency(code);
                          setIsCurrencyDropdownOpen(false);
                        }}
                        className={`w-full text-start px-3 py-2 text-xs flex items-center justify-between hover:bg-purple-50 transition-colors ${currency === code ? 'font-bold text-[#5A3E7A] bg-purple-50/70' : 'text-slate-600'}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{config.country}</span>
                          <span className="font-mono font-semibold">{code}</span>
                        </div>
                        {currency === code && <Check className="w-3.5 h-3.5 text-[#5A3E7A]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1 bg-white/15 hover:bg-white/25 px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider transition-colors min-h-[32px]"
            >
              <Globe className="w-3 h-3 text-slate-200 shrink-0" />
              <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR WITH DUAL-SCRIPT LOGO & GUARANTEED MOBILE TOUCH TARGETS */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Side: Mobile Menu Button & Brand Logo */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Mobile menu hamburger button */}
          <button
            onClick={() => onOpenMobileMenu?.()}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-6 h-6 text-slate-800" />
          </button>

          {/* INTELLIGENT DUAL-SCRIPT BRAND NAME OR AUTO-IMAGE LOGO */}
          <div 
            onClick={() => navigateTo('store')} 
            className="cursor-pointer flex items-center select-none group py-1"
            title={`${activeData.storeName.en} | ${activeData.storeName.ar}`}
          >
            {activeData.storeLogo ? (
              /* Automatic Brand Logo Image (When image exists) */
              <img 
                src={activeData.storeLogo} 
                alt={`${activeData.storeName.en} - ${activeData.storeName.ar}`} 
                className="h-10 sm:h-12 w-auto max-h-12 object-contain group-hover:opacity-95 transition-opacity" 
              />
            ) : (
              /* Pure Text Name Lockup (No logo icon, English LARGER Top, Arabic Elongated Bottom, Safe Spacing) */
              <div className="flex flex-col items-start justify-center gap-1 sm:gap-1.5">
                {/* English Name: Modern Geometric Luxury Uppercase (Always on Top & LARGER) */}
                <span className="font-brand-geometric font-black text-lg sm:text-2xl text-slate-950 group-hover:text-[#5A3E7A] transition-colors tracking-[0.24em] sm:tracking-[0.28em] uppercase leading-none">
                  {activeData.storeName.en}
                </span>
                {/* Arabic Name: Professionally Elongated, Clear, Bold & Symmetrical */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-brand-ar font-extrabold text-sm sm:text-base text-slate-700 group-hover:text-[#5A3E7A] transition-colors leading-tight tracking-wide">
                    {activeData.storeName.ar.includes('ـ') ? activeData.storeName.ar : (activeData.storeName.ar === 'نَدِي' || activeData.storeName.ar === 'ندي' ? 'نَـــــدِي' : activeData.storeName.ar)}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A3E7A]/50 group-hover:bg-[#5A3E7A] transition-colors" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-bold text-slate-600">
          <button 
            onClick={() => navigateTo('store')} 
            className={`transition-colors hover:text-theme-primary py-1 ${currentRoute === 'store' ? 'text-theme-primary font-extrabold border-b-2 border-theme-primary' : ''}`}
          >
            {lang === 'ar' ? 'الرئيسية' : 'Home'}
          </button>
          
          <button 
            onClick={() => {
              if (currentRoute !== 'store') {
                navigateTo('store');
                setTimeout(() => {
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              } else {
                document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
              }
            }} 
            className="transition-colors hover:text-theme-primary py-1"
          >
            {lang === 'ar' ? 'منتجاتنا' : 'Products'}
          </button>

          <button 
            onClick={() => navigateTo('about')} 
            className={`transition-colors hover:text-theme-primary py-1 ${currentRoute === 'about' ? 'text-theme-primary font-extrabold border-b-2 border-theme-primary' : ''}`}
          >
            {lang === 'ar' ? 'من نحن' : 'Our Story'}
          </button>

          <button 
            onClick={() => navigateTo('wishlist')} 
            className={`transition-colors hover:text-theme-primary py-1 ${currentRoute === 'wishlist' ? 'text-theme-primary font-extrabold border-b-2 border-theme-primary' : ''}`}
          >
            {lang === 'ar' ? 'المفضلة' : 'Wishlist'}
          </button>

          <button 
            onClick={() => navigateTo('tracker')} 
            className={`transition-colors hover:text-theme-primary py-1 ${currentRoute === 'tracker' ? 'text-theme-primary font-extrabold border-b-2 border-theme-primary' : ''}`}
          >
            {lang === 'ar' ? 'تتبع الشحنة' : 'Track Order'}
          </button>
        </nav>

        {/* Smart Auto-Adaptive Action Dock (Search, Wishlist, Cart, Login) */}
        {/* Uniform geometry, auto-rebalancing gaps, resilient to deletion/reordering */}
        <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-slate-100/70 sm:bg-slate-50/80 border border-slate-200/80 rounded-2xl shrink-0 shadow-2xs backdrop-blur-xs">
          
          {/* Search Toggle Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`w-10 sm:w-10.5 h-10 sm:h-10.5 rounded-xl transition-all flex items-center justify-center relative shrink-0 min-h-[44px] min-w-[44px] ${
              isSearchOpen 
                ? 'bg-purple-100 text-[#5A3E7A] shadow-xs' 
                : 'text-slate-700 hover:text-[#5A3E7A] hover:bg-white hover:shadow-xs'
            }`}
            aria-label="Search"
            title={lang === 'ar' ? 'بحث' : 'Search'}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Button -> Navigates to dedicated /wishlist page */}
          <button
            onClick={() => navigateTo('wishlist')}
            className={`w-10 sm:w-10.5 h-10 sm:h-10.5 rounded-xl transition-all flex items-center justify-center relative shrink-0 min-h-[44px] min-w-[44px] ${
              currentRoute === 'wishlist' 
                ? 'bg-purple-100 text-[#5A3E7A] shadow-xs' 
                : 'text-slate-700 hover:text-[#5A3E7A] hover:bg-white hover:shadow-xs'
            }`}
            aria-label="Wishlist"
            title={lang === 'ar' ? 'المفضلة' : 'Wishlist'}
          >
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-700'}`} />
            {wishlist.length > 0 && (
              <span className="absolute top-0.5 end-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-xs">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Basket Button -> Navigates to dedicated /cart page */}
          <button
            onClick={() => navigateTo('cart')}
            className={`w-10 sm:w-10.5 h-10 sm:h-10.5 rounded-xl transition-all flex items-center justify-center relative shrink-0 min-h-[44px] min-w-[44px] ${
              currentRoute === 'cart' 
                ? 'bg-purple-100 text-[#5A3E7A] shadow-xs' 
                : 'text-slate-700 hover:text-[#5A3E7A] hover:bg-white hover:shadow-xs'
            }`}
            aria-label="Cart"
            title={lang === 'ar' ? 'سلة المشتريات' : 'Shopping Basket'}
          >
            <StoreCartIcon size="md" className="text-slate-800 transition-transform group-hover:scale-105" />
            {cartCount > 0 && (
              <span 
                key={`cart-bounce-${cartCount}`} 
                className="absolute top-0.5 end-0.5 min-w-[18px] h-4 px-1 bg-[#5A3E7A] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-xs ring-1 ring-white"
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Sign In Button - Smart Responsive Squircle */}
          <button
            onClick={() => navigateTo('login')}
            className={`h-10 sm:h-10.5 w-10 sm:w-auto px-0 sm:px-3 rounded-xl transition-all flex items-center justify-center sm:justify-start gap-0 sm:gap-2 relative shrink-0 min-h-[44px] min-w-[44px] ${
              currentRoute === 'login'
                ? 'bg-white text-[#5A3E7A] shadow-xs ring-1 ring-[#5A3E7A]/25'
                : 'hover:bg-white hover:shadow-xs text-slate-700 hover:text-[#5A3E7A]'
            } focus:outline-none focus:ring-2 focus:ring-[#5A3E7A]/25 group`}
            title={lang === 'ar' ? 'تسجيل الدخول / فتح الحساب' : 'Sign In / Customer Account'}
            aria-label={lang === 'ar' ? 'تسجيل الدخول إلى حسابك' : 'Sign in to your account'}
          >
            {/* Square with soft edges for the User Icon */}
            <div className="w-7 h-7 sm:w-6.5 sm:h-6.5 rounded-lg bg-purple-100/90 group-hover:bg-[#5A3E7A] text-[#5A3E7A] group-hover:text-white flex items-center justify-center transition-all shrink-0">
              <User className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            </div>
            <span className="hidden sm:inline text-xs font-bold whitespace-nowrap">
              {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </span>
            {/* Active Indicator on tablet/desktop */}
            <span className="hidden sm:inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full border border-white shrink-0" />
          </button>

        </div>
      </div>

      {/* Global Predictive Spotlight Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

    </header>
  );
};
