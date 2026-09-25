import React, { useState, useRef } from 'react';
import { 
  Heart, Eye, Star, MessageCircle, 
  Sparkles, AlertCircle, Check, ShieldCheck, Award
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
    openProductPDP, activeData 
  } = useCommerce();

  const isRtl = lang === 'ar';
  const isWishlisted = wishlist.includes(product.id);
  const currentPrice = convertPrice(product.basePriceUSD);
  const origPrice = product.originalPriceUSD ? convertPrice(product.originalPriceUSD) : null;
  const isOutOfStock = product.stock === 0;
  const isScarcity = product.stock > 0 && product.stock <= 3;

  // Multi-image state
  const images = product.images && product.images.length > 0 ? product.images : [
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
  ];
  const hasMultipleImages = images.length > 1;
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Quick Add feedback
  const [justAdded, setJustAdded] = useState(false);

  // Touch Swipe gesture tracker
  const touchStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const justSwipedRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasMultipleImages) return;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!hasMultipleImages) return;
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
      onClick={() => {
        if (justSwipedRef.current) return;
        openProductPDP(product);
      }}
      className={`group relative bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200/80 hover:border-purple-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer select-none ${
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
          className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 mb-3 sm:mb-4 touch-pan-y"
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

          {/* Top-Left: Wishlist Heart Button Only (Eye button completely hidden) */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <button
              type="button"
              onClick={handleWishlistClick}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isWishlisted
                  ? 'bg-rose-500 text-white shadow-md scale-105'
                  : 'bg-white/90 hover:bg-white text-slate-600 hover:text-rose-500 backdrop-blur-md shadow-2xs'
              }`}
              aria-label={lang === 'ar' ? 'إضافة إلى المفضلة' : 'Add to Wishlist'}
              title={lang === 'ar' ? 'إضافة إلى المفضلة' : 'Add to Wishlist'}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Top-Right: Single Clean Discount Badge + Special Marketing Badge (Zero Duplication) */}
          <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1.5 z-10 pointer-events-none">
            <SmartDiscountBadge
              basePriceUSD={product.basePriceUSD}
              originalPriceUSD={product.originalPriceUSD}
              manualPercent={product.discountPercentage}
              lang={lang}
              size="md"
            />
            {showSpecialBadge && (
              <span className="px-2.5 py-1 rounded-xl text-[10px] sm:text-[11px] font-bold tracking-wide shadow-xs bg-[#5A3E7A] text-white backdrop-blur-xs">
                {product.badge![lang]}
              </span>
            )}
          </div>

          {/* Interactive Multi-Image Switcher Dots */}
          {hasMultipleImages && (
            <div 
              className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 z-10 px-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-slate-950/40 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/20 shadow-xs">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => handleSelectImage(e, idx)}
                    onMouseEnter={(e) => handleSelectImage(e, idx)}
                    className={`transition-all rounded-full ${
                      activeImgIndex === idx
                        ? 'w-5 h-1.5 bg-white shadow-xs'
                        : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                    }`}
                    title={lang === 'ar' ? `صورة ${idx + 1}` : `Image ${idx + 1}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Scarcity Alert Tag (Only when stock <= 3 and above 0) */}
          {isScarcity && (
            <div className={`absolute start-2 end-2 bg-amber-500/95 text-white text-[10px] sm:text-[11px] font-bold py-1 px-2.5 rounded-xl text-center shadow-xs flex items-center justify-center gap-1.5 backdrop-blur-xs z-10 ${hasMultipleImages ? 'bottom-9' : 'bottom-2'}`}>
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>
                {lang === 'ar' ? `متبقي ${product.stock} فقط في المخزون!` : `Only ${product.stock} left in stock!`}
              </span>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center p-3 text-center z-20">
              <span className="bg-slate-900/95 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg border border-white/10">
                {lang === 'ar' ? 'نفد مؤقتاً – متاح للحجز المسبق' : 'Out of Stock – Pre-Order'}
              </span>
            </div>
          )}
        </div>

        {/* 2. METADATA & CONTENT AREA */}
        <div className="space-y-1.5 text-start">
          {/* Category & 5-Star Golden Rating Row */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="truncate max-w-[60%] font-medium">{product.category[lang]}</span>
            <div className="flex items-center gap-1 text-amber-500 shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-slate-800">{product.rating}</span>
              <span className="text-slate-400 text-[10px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 min-h-[40px] group-hover:text-theme-primary transition-colors">
            {product.name[lang]}
          </h3>

          {/* Unified Smart Trust & Guarantee Badge */}
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${trustBadge.className}`}>
            <TrustIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{trustBadge.text[lang]}</span>
          </div>

          {/* Dynamic Pricing Row */}
          <div className="pt-1.5 flex items-baseline gap-2 justify-between flex-wrap">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {currentPrice.text}
              </span>
              {origPrice && (
                <span className="text-xs font-semibold text-slate-400 line-through">
                  {origPrice.text}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. UNIFIED ACTION ROW (Direct Add to Cart + WhatsApp Quick Order) */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
        {/* Main CTA: Add to Bag with Micro-Feedback */}
        <button
          onClick={handleAddToCart}
          className={`flex-1 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all min-h-[44px] shadow-sm ${
            justAdded
              ? 'bg-emerald-600 text-white shadow-emerald-600/20'
              : isOutOfStock
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                : 'bg-theme-primary hover:bg-theme-primary-hover text-white shadow-xs hover:shadow-md'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 shrink-0 animate-in zoom-in" />
              <span>{lang === 'ar' ? 'تمت الإضافة ✓' : 'Added to Bag ✓'}</span>
            </>
          ) : isOutOfStock ? (
            <>
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span className="truncate">{lang === 'ar' ? 'حجز مسبق عبر واتساب' : 'Pre-Order via WhatsApp'}</span>
            </>
          ) : (
            <>
              <StoreCartIcon className="w-4.5 h-4.5 shrink-0 text-white" />
              <span>{lang === 'ar' ? 'إضافة للسلة' : 'Add to Bag'}</span>
            </>
          )}
        </button>

        {/* Quick Direct WhatsApp Order Button */}
        <button
          onClick={handleWhatsAppOrder}
          className="w-11 h-11 shrink-0 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors flex items-center justify-center relative min-h-[44px] min-w-[44px] shadow-2xs hover:scale-105 active:scale-95"
          title={lang === 'ar' ? 'طلب مباشر وسريع عبر واتساب' : 'Direct WhatsApp Order'}
          aria-label="Direct WhatsApp Order"
        >
          <span className="absolute top-2 end-2 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <MessageCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
