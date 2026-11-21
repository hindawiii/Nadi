import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, BadgeCheck, 
  Gift, Check, ShieldCheck, Award, ArrowLeftRight
} from 'lucide-react';
import { Product } from '../data/siteConfig';
import { useCommerce } from '../context/CommerceContext';
import { StoreCartIcon } from './common/StoreCartIcon';
import { SmartDiscountBadge } from './common/SmartDiscountBadge';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { openExternalUrl } from '../lib/navigation';
import { canAcceptCartAddTap, isAtStockLimit } from '../lib/cartButtonGuard';
import { getCleanCategoryLabel } from '../lib/productCollections';
import { formatSmartCardTitle } from '../lib/smartProductTitle';
import { NADI_LOCAL_IMAGE_FALLBACK, handleImageLoadError } from '../lib/imageResilience';

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
    lang, convertPrice, cart, addToCart, wishlist, toggleWishlist, 
    openProductPDP, activeData, comparisonList, toggleCompare,
    setIsCompareModalOpen, showToast
  } = useCommerce();

  const isRtl = lang === 'ar';
  const isWishlisted = wishlist.includes(product.id);
  const isCompared = comparisonList.includes(product.id);
  const inCartQty = cart.reduce(
    (sum, item) => (item.product.id === product.id ? sum + item.quantity : sum),
    0
  );

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

  // Safe Multi-image state with guaranteed local SVG fallback
  const images = Array.isArray(product.images) && product.images.length > 0 && product.images.some(img => typeof img === 'string' && img.trim().length > 0)
    ? product.images.filter(img => typeof img === 'string' && img.trim().length > 0)
    : [NADI_LOCAL_IMAGE_FALLBACK];
  const hasMultipleImages = images.length > 1;
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Quick Add feedback & accidental double-tap cooldown guard
  const [justAdded, setJustAdded] = useState(false);
  const lastAddTapRef = useRef<number>(0);
  const addedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    };
  }, []);

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

  // Dynamic Trust Badge Detection (concise phrasing so it reads in full on narrow mobile cards)
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
        text: { ar: 'ضمان سنتين', en: '2-Yr Warranty' },
        className: 'text-emerald-700',
      };
    }

    if (cat.includes('بكجات') || cat.includes('بوكس') || product.bundle) {
      return {
        icon: Gift,
        text: { ar: 'بوكس توفير + هدية', en: 'Bundle + Gift' },
        className: 'text-amber-700',
      };
    }

    // Default Skincare / Botanical Formulations
    return {
      icon: Award,
      text: { ar: 'نقاء نباتي 100%', en: '100% Botanical' },
      className: 'text-[#5A3E7A]',
    };
  };

  const trustBadge = getSmartTrustBadge();
  const TrustIcon = trustBadge.icon;

  // Direct WhatsApp Order (tailored message for in-stock vs out-of-stock pre-order inquiry)
  const handleWhatsAppOrder = (e: React.MouseEvent, asRestockInquiry = false) => {
    e.stopPropagation();
    const phone = activeData?.contactInfo?.whatsapp || '249900776688';
    const storeUrl = window.location.origin;
    const storeName = activeData?.storeName?.[lang] || (lang === 'ar' ? 'نَـــــدِي' : 'NADI');

    const message = asRestockInquiry
      ? lang === 'ar'
        ? `مرحباً ${storeName}، أود الاستفسار عن موعد توفر المنتج التالي وحجزه فور وصوله:\n\n*المنتج:* ${product.name.ar}\n*السعر:* ${currentPrice.text}\n*الرابط:* ${storeUrl}/product/${product.id}`
        : `Hello ${storeName}, please notify me when this item is back in stock or available for pre-order:\n\n*Product:* ${product.name.en}\n*Price:* ${currentPrice.text}\n*Link:* ${storeUrl}/product/${product.id}`
      : lang === 'ar'
        ? `مرحباً ${storeName}، أود طلب المنتج التالي:\n\n*المنتج:* ${product.name.ar}\n*السعر:* ${currentPrice.text}\n*الضمان/الأصالة:* ${trustBadge.text.ar}\n*الرابط:* ${storeUrl}/product/${product.id}\n\nهل المنتج متوفر للشحن الفوري؟`
        : `Hello ${storeName}, I would like to order:\n\n*Product:* ${product.name.en}\n*Price:* ${currentPrice.text}\n*Trust:* ${trustBadge.text.en}\n*Link:* ${storeUrl}/product/${product.id}\n\nIs it available for instant delivery?`;

    const encoded = encodeURIComponent(message);
    openExternalUrl(`https://wa.me/${phone}?text=${encoded}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) {
      handleWhatsAppOrder(e, true);
      return;
    }

    const now = Date.now();
    if (!canAcceptCartAddTap(lastAddTapRef.current, now)) {
      return;
    }
    lastAddTapRef.current = now;

    if (isAtStockLimit(inCartQty, product.stock)) {
      showToast(
        lang === 'ar'
          ? `الحد الأقصى المتوفر (${product.stock}) موجود بالفعل في السلة`
          : `Maximum available stock (${product.stock}) is already in your bag`
      );
      return;
    }

    addToCart(product, 1);
    setJustAdded(true);
    if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    addedTimerRef.current = setTimeout(() => setJustAdded(false), 900);
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
      className={`group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 hover:border-purple-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer select-none ${
        isCarouselItem 
          ? 'shrink-0 snap-start w-[58%] sm:w-[calc((100%-20px)/3)] md:w-[calc((100%-24px)/3)] lg:w-[calc((100%-28px)/3)]' 
          : 'w-full'
      } ${className}`}
    >
      <div>
        {/* 1. TOP VISUAL STUDIO (Grand Portrait Photographic Canvas - Dominant Visual Hero) */}
        <div 
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative aspect-[4/4.6] sm:aspect-[4/4.5] w-full overflow-hidden bg-slate-100 border-b border-slate-100"
        >
          {/* Main Product Image - High-Clarity Tall Portrait Focus with Smooth Duration-700 Zoom */}
          <img
            key={activeImgIndex}
            src={images[activeImgIndex]}
            alt={`${product.name[lang]} - ${activeImgIndex + 1}`}
            referrerPolicy="no-referrer"
            decoding="async"
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={(e) => handleImageLoadError(e.currentTarget)}
          />

          {/* Top-Start: Compact Pointed Price Tag Smartly Anchored Flush to Top-Start Image Edge */}
          <div className="absolute top-[2px] start-0 z-10 pointer-events-none">
            <SmartDiscountBadge
              basePriceUSD={safeBasePrice}
              originalPriceUSD={safeOrigPriceUSD}
              manualPercent={product.discountPercentage}
              lang={lang}
              displayStyle="pendant"
              variant="rose"
            />
          </div>

          {/* Top-End: Edge-Fused Glass Wishlist Tab (Mirrors Discount Ribbon Alignment at top-0) */}
          <button
            type="button"
            onClick={handleWishlistClick}
            className={`absolute top-0 end-0 z-10 h-7 w-8 sm:h-8 sm:w-9 rounded-none rounded-es-xl backdrop-blur-md border-b border-s shadow-xs transition-all duration-200 flex items-center justify-center cursor-pointer active:scale-95 after:content-[''] after:absolute after:-inset-2 ${
              isWishlisted
                ? 'bg-rose-50/95 border-rose-200/90 text-rose-500'
                : 'bg-white/90 hover:bg-white border-slate-200/80 text-slate-500 hover:text-rose-500'
            }`}
            aria-label={lang === 'ar' ? 'إضافة إلى المفضلة' : 'Add to Wishlist'}
            title={lang === 'ar' ? 'إضافة إلى المفضلة' : 'Add to Wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${isWishlisted ? 'fill-current scale-105' : 'group-hover:scale-105'}`} />
          </button>

          {/* Interactive Multi-Image Switcher Dots (Minimalist line indicators at absolute bottom) */}
          {hasMultipleImages && (
            <div 
              className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1 z-10 px-2"
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

        {/* 2. METADATA & CONTENT AREA (Airy Typographic Hierarchy - Unboxed Metadata) */}
        <div className="p-2.5 sm:p-3.5 space-y-1.5 text-start">
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between gap-1.5 text-[10.5px] sm:text-xs text-slate-500">
            <span className="truncate font-semibold text-slate-500">
              {getCleanCategoryLabel(product, lang)}
            </span>

            <div className="inline-flex items-center gap-0.5 text-[#5A3E7A] shrink-0">
              <BadgeCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="font-bold text-slate-800 tabular-nums">{product.rating}</span>
              <span className="text-slate-400 text-[9.5px] sm:text-[10.5px] tabular-nums">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Smart Semantic Single-Line Product Title (Core identity preserved; full title in PDP) */}
          <h3
            title={product.name[lang]}
            className="font-extrabold text-slate-900 text-[12px] sm:text-[14.5px] leading-snug truncate group-hover:text-theme-primary transition-colors"
          >
            {formatSmartCardTitle(product.name[lang], lang)}
          </h3>

          {/* Concise Unboxed Trust Indicator */}
          <div className={`inline-flex items-center gap-1 text-[10.5px] sm:text-[11px] font-bold max-w-full ${trustBadge.className}`}>
            <TrustIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="truncate">{trustBadge.text[lang]}</span>
          </div>

          {/* Dynamic Pricing Row */}
          <div className="pt-0.5 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 min-h-[34px] sm:min-h-[28px] justify-center sm:justify-start">
              <span className="text-[13.5px] sm:text-lg font-black text-slate-900 tracking-tight whitespace-nowrap tabular-nums leading-tight">
                {currentPrice.text}
              </span>
              {origPrice && (
                <span className="text-[10.5px] sm:text-xs font-semibold text-slate-400 line-through whitespace-nowrap tabular-nums leading-tight">
                  {origPrice.text}
                </span>
              )}
            </div>

            {isScarcity && (
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50/90 px-1.5 py-0.5 rounded-md border border-amber-200/70 whitespace-nowrap">
                  {lang === 'ar' ? `متبقي ${product.stock}` : `${product.stock} left`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. UNIFIED ACTION ROW (3 buttons when in stock; clean 2 buttons without duplicate WhatsApp when out of stock) */}
      <div
        className={`px-2 pb-2 sm:px-3.5 sm:pb-3.5 pt-2 border-t border-slate-100 items-center gap-1 sm:gap-1.5 ${
          isOutOfStock ? 'flex' : 'grid grid-cols-3 sm:flex'
        }`}
      >
        {/* Main CTA: Clean Add to Bag button (header badge tracks bag count) OR Single Out-of-Stock WhatsApp Notify CTA */}
        <button
          type="button"
          onClick={handleAddToCart}
          className={`relative overflow-hidden min-w-0 h-10 px-2 sm:px-2.5 gap-1.5 rounded-xl font-bold flex items-center justify-center transition-all shadow-sm cursor-pointer active:scale-[0.98] ${
            isOutOfStock ? 'flex-1' : 'w-full sm:flex-1'
          } ${
            justAdded
              ? 'bg-emerald-600 text-white shadow-emerald-600/20'
              : isOutOfStock
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                : 'bg-theme-primary hover:bg-theme-primary-hover text-white shadow-xs hover:shadow-md'
          }`}
          title={
            isOutOfStock
              ? lang === 'ar'
                ? 'تنبيه عند التوفر عبر واتساب'
                : 'Notify on WhatsApp'
              : lang === 'ar'
                ? 'إضافة للسلة'
                : 'Add to Bag'
          }
          aria-label={
            isOutOfStock
              ? lang === 'ar'
                ? 'تنبيه عند التوفر عبر واتساب'
                : 'Notify on WhatsApp'
              : lang === 'ar'
                ? 'إضافة للسلة'
                : 'Add to Bag'
          }
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 shrink-0 animate-in zoom-in" />
              <span className="hidden sm:inline text-xs sm:text-sm truncate">
                {lang === 'ar' ? 'تمت الإضافة' : 'Added'}
              </span>
            </>
          ) : isOutOfStock ? (
            <>
              <WhatsAppIcon variant="white" className="w-4 h-4 shrink-0" />
              <span className="text-[11px] sm:text-xs truncate">
                {lang === 'ar' ? 'تنبيه توفر' : 'Notify Me'}
              </span>
            </>
          ) : (
            <>
              <StoreCartIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-white" />
              <span className="hidden sm:inline text-xs sm:text-sm truncate">
                {lang === 'ar' ? 'إضافة للسلة' : 'Add to Bag'}
              </span>
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
          className={`${
            isOutOfStock ? 'w-10' : 'w-full sm:w-10'
          } h-10 min-w-0 shrink-0 rounded-xl border transition-all flex items-center justify-center relative shadow-2xs hover:scale-105 active:scale-95 cursor-pointer ${
            isCompared
              ? 'bg-[#5A3E7A] text-white border-[#5A3E7A] shadow-purple-900/20'
              : 'bg-purple-50/70 hover:bg-purple-100 text-[#5A3E7A] border-purple-200/70'
          }`}
          title={lang === 'ar' ? 'مقارنة هذا المنتج' : 'Compare Specs'}
          aria-label={lang === 'ar' ? 'مقارنة هذا المنتج' : 'Compare Specs'}
        >
          <ArrowLeftRight className="w-4 h-4 shrink-0" />
        </button>

        {/* Quick Direct WhatsApp Order Button (Hidden when out of stock to avoid duplicate WhatsApp button) */}
        {!isOutOfStock && (
          <button
            type="button"
            onClick={(e) => handleWhatsAppOrder(e, false)}
            className="w-full sm:w-10 h-10 min-w-0 shrink-0 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/90 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200/90 transition-all flex items-center justify-center relative shadow-2xs hover:shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
            title={lang === 'ar' ? 'طلب مباشر وسريع عبر واتساب' : 'Direct WhatsApp Order'}
            aria-label="Direct WhatsApp Order"
          >
            <WhatsAppIcon variant="gradient" className="w-4 h-4 sm:w-[18px] sm:h-[18px] relative z-10" />
          </button>
        )}
      </div>
    </div>
  );
};
