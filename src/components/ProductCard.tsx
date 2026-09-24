import React, { useState, useRef } from 'react';
import { 
  Heart, ShoppingBag, Eye, Star, MessageCircle, 
  Sparkles, AlertCircle, Check
} from 'lucide-react';
import { Product } from '../data/siteConfig';
import { useCommerce } from '../context/CommerceContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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

  // Multi-image switcher state
  const images = product.images && product.images.length > 0 ? product.images : [
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
  ];
  const hasMultipleImages = images.length > 1;
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Quick Add success micro-animation feedback
  const [justAdded, setJustAdded] = useState(false);

  // Touch Swipe gesture references and click suppression
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

    // Require distinct horizontal swipe (> 30px) faster than 800ms
    if (Math.abs(diffX) > 30 && Math.abs(diffX) > Math.abs(diffY) && timeTaken < 800) {
      e.stopPropagation();
      justSwipedRef.current = true;
      setTimeout(() => {
        justSwipedRef.current = false;
      }, 250);

      if (diffX < 0) {
        // Swiped Left -> Next Image
        setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else {
        // Swiped Right -> Previous Image
        setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    }
  };

  // Calculate discount percentage if not explicitly defined
  const discountPercent = product.discountPercentage 
    ? product.discountPercentage 
    : (product.originalPriceUSD && product.originalPriceUSD > product.basePriceUSD)
      ? Math.round(((product.originalPriceUSD - product.basePriceUSD) / product.originalPriceUSD) * 100)
      : null;

  const handleSelectImage = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setActiveImgIndex(idx);
  };

  // Generate personalized direct WhatsApp order URL
  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = activeData.contactInfo.whatsapp;
    const storeUrl = window.location.origin;
    const message = lang === 'ar'
      ? `مرحباً ${activeData.storeName.ar}، أود طلب المنتج التالي:\n\n*المنتج:* ${product.name.ar}\n*السعر:* ${currentPrice.text}\n*الرابط:* ${storeUrl}#${product.id}\n\nهل المنتج متوفر للشحن؟`
      : `Hello ${activeData.storeName.en}, I would like to order:\n\n*Product:* ${product.name.en}\n*Price:* ${currentPrice.text}\n*Link:* ${storeUrl}#${product.id}\n\nIs it available for instant delivery?`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) {
      handleWhatsAppOrder(e);
      return;
    }
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div 
      onClick={() => {
        if (justSwipedRef.current) return;
        openProductPDP(product);
      }}
      className="group relative bg-white rounded-3xl p-3 sm:p-4 border border-slate-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer select-none"
    >
      <div>
        {/* Top Visual Area (Image Slider, Badges, Wishlist & Navigation) */}
        <div 
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 mb-3 sm:mb-4 touch-pan-y"
        >
          
          {/* Main Product Image with Smooth Transition */}
          <img
            key={activeImgIndex}
            src={images[activeImgIndex]}
            alt={`${product.name[lang]} - ${activeImgIndex + 1}`}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500 animate-in fade-in zoom-in-95 duration-200"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80";
            }}
          />

          {/* Badges Overlay (Discount Tag + Category Badge) */}
          <div className="absolute top-2.5 start-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
            {discountPercent && discountPercent > 0 && (
              <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-black tracking-wide shadow-xs bg-rose-500 text-white flex items-center gap-1 backdrop-blur-xs">
                <span>{lang === 'ar' ? `وفر ${discountPercent}%` : `-${discountPercent}%`}</span>
              </span>
            )}
            {product.badge && (
              <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide shadow-xs bg-purple-900/85 text-white backdrop-blur-xs">
                {product.badge[lang]}
              </span>
            )}
          </div>

          {/* Top-End Action Buttons: Wishlist & Quick Peek */}
          <div className="absolute top-2.5 end-2.5 flex flex-col gap-1.5 z-10">
            {/* Wishlist Heart Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isWishlisted
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-white/85 hover:bg-white text-slate-600 hover:text-rose-500 backdrop-blur-md shadow-xs'
              }`}
              aria-label="Add to wishlist"
              title={lang === 'ar' ? 'إضافة إلى المفضلة' : 'Add to Wishlist'}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            {/* Quick View Button (Visible on Hover / Direct Tap) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openProductPDP(product);
              }}
              className="w-9 h-9 rounded-full bg-white/85 hover:bg-white text-slate-600 hover:text-[#5A3E7A] backdrop-blur-md shadow-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hidden sm:flex"
              title={lang === 'ar' ? 'نظرة سريعة على التفاصيل' : 'Quick Details'}
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* SMART MULTI-IMAGE SWITCHER CONTROLS (Rendered ONLY if hasMultipleImages is true) */}
          {hasMultipleImages && (
            <>
              {/* Bottom Smart Indicator Pills (Interactive Switcher Bar) */}
              <div 
                className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 z-10 px-3"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-slate-950/40 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/20 shadow-sm">
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
            </>
          )}

          {/* Scarcity Alert Tag (Only when stock <= 3 and above 0, positioned carefully above the pills if multiple images) */}
          {isScarcity && (
            <div className={`absolute start-2 end-2 bg-amber-500/95 text-white text-[10px] sm:text-[11px] font-bold py-1 px-2.5 rounded-xl text-center shadow-xs flex items-center justify-center gap-1 backdrop-blur-xs z-10 ${hasMultipleImages ? 'bottom-8' : 'bottom-2'}`}>
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>
                {lang === 'ar' ? `متبقي ${product.stock} فقط في المخزون!` : `Only ${product.stock} left in stock!`}
              </span>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] flex items-center justify-center p-3 text-center z-20">
              <span className="bg-slate-900/95 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg border border-white/10">
                {lang === 'ar' ? 'نفد مؤقتاً – متاح للحجز المسبق' : 'Out of Stock – Pre-Order'}
              </span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="truncate max-w-[65%]">{product.category[lang]}</span>
            <div className="flex items-center gap-1 text-amber-500 shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-semibold text-slate-700">{product.rating}</span>
              <span className="text-slate-400 text-[10px]">({product.reviewsCount})</span>
            </div>
          </div>

          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[#5A3E7A] transition-colors">
            {product.name[lang]}
          </h3>

          {/* Pricing Row */}
          <div className="pt-1 flex items-baseline gap-2 justify-between flex-wrap">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                {currentPrice.text}
              </span>
              {origPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {origPrice.text}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">
              ~${product.basePriceUSD}
            </span>
          </div>
        </div>
      </div>

      {/* Unified Ergonomic Action Row (Add to Cart + Instant WhatsApp Order) */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
        {/* Main CTA: Add to Bag or Pre-Order with Micro-Feedback */}
        <button
          onClick={handleAddToCart}
          className={`flex-1 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all min-h-[44px] ${
            justAdded
              ? 'bg-emerald-600 text-white shadow-md'
              : isOutOfStock
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                : 'bg-[#5A3E7A] hover:bg-[#483162] text-white shadow-xs hover:shadow-md'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 shrink-0 animate-in zoom-in" />
              <span>{lang === 'ar' ? 'تمت الإضافة!' : 'Added!'}</span>
            </>
          ) : isOutOfStock ? (
            <>
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span className="truncate">{lang === 'ar' ? 'حجز مسبق' : 'Pre-Order'}</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>{lang === 'ar' ? 'إضافة للسلة' : 'Add to Bag'}</span>
            </>
          )}
        </button>

        {/* Quick WhatsApp Direct Order Button (44x44 safe touch target) */}
        <button
          onClick={handleWhatsAppOrder}
          className="w-11 h-11 shrink-0 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors flex items-center justify-center relative min-h-[44px] min-w-[44px]"
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
