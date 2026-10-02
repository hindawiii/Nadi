import React, { useState, useRef } from 'react';
import { 
  Heart, Eye, Star, MessageCircle, 
  Sparkles, AlertCircle, Check, ShieldCheck, Award, ArrowLeftRight
} from 'lucide-react';
import { Product } from '../data/siteConfig';
import { useCommerce } from '../context/CommerceContext';
import { StoreCartIcon } from './common/StoreCartIcon';
import { SmartDiscountBadge } from './common/SmartDiscountBadge';

export interface ProductCardProps {
  product: Product;
  isCarouselItem?: boolean;
  className?: string;
  onRemoveFromWishlist?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isCarouselItem = false,
  className = '',
  onRemoveFromWishlist
}) => {
  const { 
    lang, convertPrice, addToCart, wishlist, toggleWishlist, 
    openProductPDP, activeData, comparisonList, toggleCompare,
    setIsCompareModalOpen 
  } = useCommerce();

  const isRtl = lang === 'ar';
  const isWishlisted = wishlist.includes(product.id);
  const isCompared = comparisonList.includes(product.id);

  // Self-Healing Defensive Normalization for any incoming or future product
  const safeBasePrice = typeof product.basePriceUSD === 'number' && !isNaN(product.basePriceUSD) && product.basePriceUSD > 0 
    ? product.basePriceUSD 
    : 10;
  const safeOrigPriceUSD = typeof product.originalPriceUSD === 'number' && product.originalPriceUSD > safeBasePrice 
    ? product.originalPriceUSD 
    : undefined;

  const currentPrice = convertPrice(safeBasePrice);
  const origPrice = safeOrigPriceUSD ? convertPrice(safeOrigPriceUSD) : null;
  const isOutOfStock = typeof product.stock === 'number' ? product.stock === 0 : false;
  const isScarcity = typeof product.stock === 'number' && product.stock > 0 && product.stock <= 3;

  // Safe Multi-image state
  const defaultFallbackImage = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80";
  const images = Array.isArray(product.images) && product.images.length > 0 && product.images.some(img => typeof img === 'string' && img.trim().length > 0)
    ? product.images.filter(img => typeof img === 'string' && img.trim().length > 0)
    : [defaultFallbackImage];
  const hasMultipleImages = images.length > 1;
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Quick Add feedback
  const [justAdded, setJustAdded] = useState(false);

  // Touch Swipe gesture tracker
  const touchStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const justSwipedRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    // When the card is an item in a horizontal carousel, do not intercept swipe gestures
    // so the carousel itself and vertical page scroll work with 100% fluid native responsiveness
    if (isCarouselItem || !hasMultipleImages) return;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isCarouselItem || !hasMultipleImages) return;
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStartRef.current.x;
    const diffY = touch.clientY - touchStartRef.current.y;
    const timeTaken = Date.now() - touchStartRef.current.time;

    // Detect horizontal swipe (> 25px) faster than 800ms
    if (Math.abs(diffX) > 25 && Math.abs(diffX) > Math.abs(diffY) && timeTaken < 800) {
      e.stopPropagation();
      justSwipedRef.current = true;
      setTimeout(() => {
        justSwipedRef.current = false;
      }, 250);

      if (diffX < 0) {
        // Swiped Left
        setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else {
        // Swiped Right
        setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    }
  };

  // Calculate discount percentage
  const discountPercent = product.discountPercentage 
    ? product.discountPercentage 
    : (product.originalPriceUSD && product.originalPriceUSD > product.basePriceUSD)
      ? Math.round(((product.originalPriceUSD - product.basePriceUSD) / product.originalPriceUSD) * 100)
      : null;

  // Filter out duplicate discount badges (e.g. if product.badge just repeats 20% or وفر or خصم)
  const isDuplicateDiscountBadge = (badgeText?: string) => {
    if (!badgeText) return true;
    return /[\d%]|خصم|وفر|خ\d|off|discount/i.test(badgeText);
  };
  const showSpecialBadge = product.badge && !isDuplicateDiscountBadge(product.badge[lang]);

  const handleSelectImage = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setActiveImgIndex(idx);
  };

  // Dynamic Trust Badge Detection
  const getSmartTrustBadge = () => {
    const cat = product.category?.ar || '';
    const name = product.name?.ar || '';
    const id = product.id || '';

    // Hair or beauty hardware devices
    if (
      cat.includes('أجهزة') || 
      cat.includes('شعر') || 
      name.includes('جهاز') || 
      name.includes('مكواة') || 
      name.includes('فرشاة') || 
      name.includes('مجفف') ||
      id.startsWith('hd-')
    ) {
      return {
        icon: ShieldCheck,
        text: { ar: 'ضمان سنتين شامل معتمد 🛡️', en: 'Certified 2-Year Warranty 🛡️' },
        className: 'text-emerald-700 bg-emerald-50/90 border-emerald-200/80',
      };
    }

    // Bundles & Value Gift Boxes
    if (cat.includes('بكجات') || cat.includes('بوكس') || product.bundle) {
      return {
        icon: Sparkles,
        text: { ar: 'بوكس توفير متكامل + هدية 🎁', en: 'Value Bundle + Free Gift 🎁' },
        className: 'text-amber-800 bg-amber-50/90 border-amber-200/80',
      };
    }

    // Default Skincare / Botanical Formulations
    return {
      icon: Award,
      text: { ar: 'نقاء نباتي أصلي 100% 🌿', en: '100% Pure Botanical Purity 🌿' },
      className: 'text-purple-900 bg-purple-50/90 border-purple-200/80',
    };
  };

  const trustBadge = getSmartTrustBadge();
  const TrustIcon = trustBadge.icon;

  // Direct WhatsApp Order
  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = activeData?.contactInfo?.whatsapp || '249900776688';
    const storeUrl = window.location.origin;
    const storeName = activeData?.storeName?.[lang] || (lang === 'ar' ? 'نَـــــدِي' : 'NADI');
    
    const message = lang === 'ar'
      ? `مرحباً ${storeName}، أود طلب المنتج التالي:\n\n*المنتج:* ${product.name.ar}\n*السعر:* ${currentPrice.text}\n*الضمان/الأصالة:* ${trustBadge.text.ar}\n*الرابط:* ${storeUrl}#${product.id}\n\nهل المنتج متوفر للشحن الفوري؟`
      : `Hello ${storeName}, I would like to order:\n\n*Product:* ${product.name.en}\n*Price:* ${currentPrice.text}\n*Trust:* ${trustBadge.text.en}\n*Link:* ${storeUrl}#${product.id}\n\nIs it available for instant delivery?`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) {
      handleWhatsAppOrder(e);
      return;
    }
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onRemoveFromWishlist) {
      onRemoveFromWishlist();
    } else {
      toggleWishlist(product.id);
    }
  };

  return (
    <div 
      id={`product-${product.id}`}
      onClick={() => {
        if (justSwipedRef.current) return;
        openProductPDP(product);
      }}
      className={`group relative bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border border-slate-200/80 hover:border-purple-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer select-none ${
        isCarouselItem 
          ? 'shrink-0 snap-start w-[82%] sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]' 
          : 'w-full'
      } ${className}`}
    >
      <div>
        {/* 1. TOP VISUAL STUDIO (Full-Bleed Photographic Display with Smooth Hover Zoom) */}
        <div 
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 mb-2.5 sm:mb-4"
        >
          {/* Main Product Image - Fills the Frame Professionally */}
          <img
            key={activeImgIndex}
            src={images[activeImgIndex]}
            alt={`${product.name[lang]} - ${activeImgIndex + 1}`}
            className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80";
            }}
          />

          {/* Top-Start: Single Ultra-Clean Micro Discount Badge (Only one clean badge, leaving 95% of image completely clear) */}
          <div className="absolute top-2 start-2 sm:top-2.5 sm:start-2.5 z-10 pointer-events-none">
            <SmartDiscountBadge
              basePriceUSD={safeBasePrice}
              originalPriceUSD={safeOrigPriceUSD}
              manualPercent={product.discountPercentage}
              lang={lang}
              size="xs"
            />
          </div>

          {/* Interactive Multi-Image Switcher Dots (Minimalist line indicators at absolute bottom) */}
          {hasMultipleImages && (
            <div 
              className="absolute bottom-1.5 inset-x-0 flex items-center justify-center gap-1 z-10 px-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-slate-950/30 backdrop-blur-xs px-1.5 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => handleSelectImage(e, idx)}
                    onMouseEnter={(e) => handleSelectImage(e, idx)}
                    className={`transition-all rounded-full ${
                      activeImgIndex === idx
                        ? 'w-3 h-1 bg-white shadow-xs'
                        : 'w-1 h-1 bg-white/60 hover:bg-white'
                    }`}
                    title={lang === 'ar' ? `صورة ${idx + 1}` : `Image ${idx + 1}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center p-2 sm:p-3 text-center z-20">
              <span className="bg-slate-900/95 text-white text-[9px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-xl shadow-lg border border-white/10">
                {lang === 'ar' ? 'نفد مؤقتاً – حجز مسبق' : 'Out of Stock – Pre-Order'}
              </span>
            </div>
          )}
        </div>

        {/* 2. METADATA & CONTENT AREA */}
        <div className="space-y-1 sm:space-y-1.5 text-start">
          {/* Category, Rating & Heart Wishlist Row (Perfect harmony below image) */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-400">
            <span className="truncate max-w-[45%] font-medium">{product.category[lang]}</span>
            
            <div className="flex items-center gap-2 shrink-0">
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                <span className="font-bold text-slate-800 text-[11px] sm:text-xs">{product.rating}</span>
                <span className="text-slate-400 text-[9px] sm:text-[10px]">({product.reviewsCount})</span>
              </div>

              {/* Seamless Wishlist Heart Button (Clean, accessible, zero image clutter) */}
              <button
                type="button"
                onClick={handleWishlistClick}
                className={`p-1 rounded-full transition-all hover:scale-110 active:scale-95 ${
                  isWishlisted
                    ? 'text-rose-500'
                    : 'text-slate-300 hover:text-rose-500'
                }`}
                aria-label={lang === 'ar' ? 'إضافة إلى المفضلة' : 'Add to Wishlist'}
                title={lang === 'ar' ? 'إضافة إلى المفضلة' : 'Add to Wishlist'}
              >
                <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-extrabold text-slate-900 text-xs sm:text-base leading-snug line-clamp-2 min-h-[32px] sm:min-h-[40px] group-hover:text-theme-primary transition-colors">
            {product.name[lang]}
          </h3>

          {/* Unified Smart Trust & Guarantee Badge */}
          <div className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg border text-[9px] sm:text-[11px] font-bold max-w-full ${trustBadge.className}`}>
            <TrustIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="truncate">{trustBadge.text[lang]}</span>
          </div>

          {/* Dynamic Pricing Row + Elegant Scarcity Indicator */}
          <div className="pt-1 flex items-baseline gap-1.5 sm:gap-2 justify-between flex-wrap">
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-sm sm:text-lg font-black text-slate-900 tracking-tight">
                {currentPrice.text}
              </span>
              {origPrice && (
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400 line-through">
                  {origPrice.text}
                </span>
              )}
            </div>

            {/* Elegant Micro-Scarcity Indicator (Clean typography instead of blocking banner) */}
            {isScarcity && (
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                {lang === 'ar' ? `متبقي ${product.stock}` : `${product.stock} left`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. UNIFIED ACTION ROW (Balanced 3-Button Single Row: Cart + Compare + WhatsApp) */}
      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-100 flex items-center gap-1 sm:gap-2">
        {/* Main CTA: Add to Bag (Icon-only on mobile to fit 3 buttons, expands with text on tablet/desktop) */}
        <button
          onClick={handleAddToCart}
          className={`flex-1 min-w-0 py-2 sm:py-2.5 px-2 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-1.5 transition-all min-h-[36px] sm:min-h-[42px] shadow-sm ${
            justAdded
              ? 'bg-emerald-600 text-white shadow-emerald-600/20'
              : isOutOfStock
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                : 'bg-theme-primary hover:bg-theme-primary-hover text-white shadow-xs hover:shadow-md'
          }`}
          title={lang === 'ar' ? 'إضافة للسلة' : 'Add to Bag'}
          aria-label={lang === 'ar' ? 'إضافة للسلة' : 'Add to Bag'}
        >
          {justAdded ? (
            <>
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 animate-in zoom-in" />
              <span className="hidden sm:inline text-xs sm:text-sm">{lang === 'ar' ? 'تمت الإضافة ✓' : 'Added ✓'}</span>
            </>
          ) : isOutOfStock ? (
            <>
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline text-xs sm:text-sm truncate">{lang === 'ar' ? 'حجز بالواتساب' : 'WhatsApp'}</span>
            </>
          ) : (
            <>
              <StoreCartIcon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 shrink-0 text-white" />
              <span className="hidden sm:inline text-xs sm:text-sm truncate">{lang === 'ar' ? 'إضافة للسلة' : 'Add to Bag'}</span>
            </>
          )}
        </button>

        {/* Quick Compare Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (!isCompared) {
              toggleCompare(product.id);
            }
            setIsCompareModalOpen(true);
          }}
          className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl sm:rounded-2xl border transition-all flex items-center justify-center relative min-h-[36px] min-w-[36px] sm:min-h-[42px] sm:min-w-[42px] shadow-2xs hover:scale-105 active:scale-95 ${
            isCompared
              ? 'bg-[#5A3E7A] text-white border-[#5A3E7A] shadow-purple-900/20'
              : 'bg-purple-50/80 hover:bg-purple-100 text-[#5A3E7A] border-purple-200/80'
          }`}
          title={lang === 'ar' ? 'مقارنة هذا المنتج' : 'Compare Specs'}
          aria-label={lang === 'ar' ? 'مقارنة هذا المنتج' : 'Compare Specs'}
        >
          <ArrowLeftRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Quick Direct WhatsApp Order Button */}
        <button
          type="button"
          onClick={handleWhatsAppOrder}
          className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl sm:rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors flex items-center justify-center relative min-h-[36px] min-w-[36px] sm:min-h-[42px] sm:min-w-[42px] shadow-2xs hover:scale-105 active:scale-95"
          title={lang === 'ar' ? 'طلب مباشر وسريع عبر واتساب' : 'Direct WhatsApp Order'}
          aria-label="Direct WhatsApp Order"
        >
          <span className="absolute top-1.5 end-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};
