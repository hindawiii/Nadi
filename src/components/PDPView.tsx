import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, ArrowRight, BadgeCheck, Heart, MessageCircle,
  ShieldCheck, Truck, RotateCcw,
  Plus, Check, Share2, Layers, Maximize2, ZoomIn, ZoomOut, X,
  ChevronLeft, ChevronRight, ArrowLeftRight, ChevronDown,
  FileText, CheckCircle2, Award, HelpCircle, SlidersHorizontal,
  FlaskConical, PenLine, Droplets, Ruler, Package,
  Gift, X as CloseIcon
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { Product } from '../data/siteConfig';
import { StoreCartIcon } from './common/StoreCartIcon';
import { SmartDiscountBadge } from './common/SmartDiscountBadge';
import { openExternalUrl } from '../lib/navigation';
import { NADI_LOCAL_IMAGE_FALLBACK, handleImageLoadError } from '../lib/imageResilience';
import { getCleanCategoryLabel } from '../lib/productCollections';
import {
  extractProductQuickSpecs,
  formatArabicQuantityLabel,
  getPdpContextCopy,
  parsePipeSpecs,
  resolvePdpProductKind,
} from '../lib/pdpProfile';

export const PDPView: React.FC = () => {
  const {
    lang, convertPrice, addToCart, wishlist, toggleWishlist,
    activeProduct, activeData, showToast,
    comparisonList, toggleCompare,
    returnFromPDPToStore, setIsReviewModalOpen
  } = useCommerce();

  const isRtl = lang === 'ar';
  const product = activeProduct;

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Skincare Volume Savings Tier State (tier 1 = 1 bottle 0% off, tier 2 = 2 bottles 10% off, tier 3 = 3 bottles 20% off + gift)
  const [selectedTier, setSelectedTier] = useState<1 | 2 | 3>(1);

  // 5-Pillar Accordion State (ONLY Description open by default for fast scanning)
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    desc: true,
    usage: false,
    specs: false,
    shipping: false,
    reviews: false
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  // Touch swipe gesture tracker
  const touchSwipeRef = useRef<{ startX: number; startY: number; time: number }>({ startX: 0, startY: 0, time: 0 });

  // Touch gesture & pinch-to-zoom state
  const [touchScale, setTouchScale] = useState(1);
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  const [lastTap, setLastTap] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxScale, setLightboxScale] = useState(1);
  const [lightboxPan, setLightboxPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const lightboxTouchDistRef = useRef<number | null>(null);
  const initialLightboxScaleRef = useRef<number>(1);

  // Defensive image normalization & guaranteed local fallback
  const fallbackImage = NADI_LOCAL_IMAGE_FALLBACK;
  const rawImages: string[] = (product && Array.isArray(product.images) && product.images.length > 0)
    ? product.images.filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
    : [fallbackImage];
  const finalImages = rawImages.length > 0 ? rawImages : [fallbackImage];

  // Reset per-product selection state whenever the user opens a different product
  useEffect(() => {
    setSelectedImgIndex(0);
    setSelectedTier(1);
    setQuantity(1);
    setOpenAccordions({
      desc: true,
      usage: false,
      specs: false,
      shipping: false,
      reviews: false,
    });
  }, [product?.id]);

  useEffect(() => {
    if (selectedImgIndex >= finalImages.length) {
      setSelectedImgIndex(0);
    }
  }, [product?.id, finalImages.length, selectedImgIndex]);

  // Keyboard navigation for fullscreen lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
        setLightboxScale(1);
        setLightboxPan({ x: 0, y: 0 });
      } else if (e.key === 'ArrowRight') {
        setSelectedImgIndex(prev => (prev === finalImages.length - 1 ? 0 : prev + 1));
        setLightboxScale(1);
        setLightboxPan({ x: 0, y: 0 });
      } else if (e.key === 'ArrowLeft') {
        setSelectedImgIndex(prev => (prev === 0 ? finalImages.length - 1 : prev - 1));
        setLightboxScale(1);
        setLightboxPan({ x: 0, y: 0 });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, finalImages.length]);

  if (!product) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto px-4">
        <p className="text-slate-500 mb-4">{lang === 'ar' ? 'لم يتم العثور على المنتج المطلوب' : 'Product not found'}</p>
        <button
          onClick={() => returnFromPDPToStore()}
          className="bg-[#5A3E7A] hover:bg-[#483162] text-white px-5 h-10 sm:h-11 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-colors"
        >
          {lang === 'ar' ? 'العودة للمتجر' : 'Return to store'}
        </button>
      </div>
    );
  }

  const productKind = resolvePdpProductKind(product);
  const isSkinTierMode = productKind === 'skin';
  const quantityUnit = productKind === 'box' ? 'box' : (productKind === 'skin' ? 'bottle' : 'piece');
  const quickSpecs = extractProductQuickSpecs(product, productKind, lang);
  const contextCopy = getPdpContextCopy(productKind, activeData.storeName[lang], lang);
  const pipeSpecs = parsePipeSpecs(product.tabs.ingredientsOrSpecs?.[lang]);

  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.stock === 0;

  // Context-aware pricing: skincare uses 3-tier volume savings (no double multiplier);
  // hair devices & gift boxes use one clean quantity selector.
  const tierDiscountPercent = isSkinTierMode
    ? (selectedTier === 3 ? 20 : (selectedTier === 2 ? 10 : 0))
    : 0;
  const effectiveQuantity = isSkinTierMode ? selectedTier : quantity;

  const baseSingleUSD = product.basePriceUSD;
  const discountedSingleUSD = baseSingleUSD * (1 - tierDiscountPercent / 100);
  const tierTotalUSD = discountedSingleUSD * effectiveQuantity;

  const singlePrice = convertPrice(baseSingleUSD);
  const singleOrigPrice = product.originalPriceUSD ? convertPrice(product.originalPriceUSD) : null;
  const currentPrice = convertPrice(tierTotalUSD);
  const qualifiesFreeShipping = (isSkinTierMode && selectedTier >= 2) || productKind === 'box' || tierTotalUSD >= 25;

  // Dynamic Delivery Estimated Dates (Tomorrow to +3 days)
  const today = new Date();
  const deliveryStart = new Date(today);
  deliveryStart.setDate(today.getDate() + 1);
  const deliveryEnd = new Date(today);
  deliveryEnd.setDate(today.getDate() + 3);

  const deliveryDaysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const deliveryDaysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const deliveryMonthsAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const deliveryMonthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const estDeliveryText = lang === 'ar'
    ? `${deliveryDaysAr[deliveryStart.getDay()]} ${deliveryStart.getDate()} ${deliveryMonthsAr[deliveryStart.getMonth()]} - ${deliveryDaysAr[deliveryEnd.getDay()]} ${deliveryEnd.getDate()} ${deliveryMonthsAr[deliveryEnd.getMonth()]}`
    : `${deliveryDaysEn[deliveryStart.getDay()]}, ${deliveryMonthsEn[deliveryStart.getMonth()]} ${deliveryStart.getDate()} - ${deliveryDaysEn[deliveryEnd.getDay()]}, ${deliveryMonthsEn[deliveryEnd.getMonth()]} ${deliveryEnd.getDate()}`;

  const activeImage = finalImages[selectedImgIndex] || finalImages[0] || fallbackImage;

  // Smooth mouse wheel zoom for fullscreen lightbox
  const handleWheelZoom = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    setLightboxScale(prev => {
      const delta = e.deltaY < 0 ? 0.25 : -0.25;
      const next = Math.min(Math.max(prev + delta, 1), 4);
      if (next === 1) setLightboxPan({ x: 0, y: 0 });
      return next;
    });
  };

  // Lightbox touch handlers for smooth multi-touch pinch zoom
  const handleLightboxTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lightboxTouchDistRef.current = dist;
      initialLightboxScaleRef.current = lightboxScale;
    } else if (e.touches.length === 1 && lightboxScale > 1) {
      setIsPanning(true);
      panStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        panX: lightboxPan.x,
        panY: lightboxPan.y
      };
    }
  };

  const handleLightboxTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && lightboxTouchDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / lightboxTouchDistRef.current;
      const nextScale = Math.min(Math.max(initialLightboxScaleRef.current * ratio, 1), 4);
      setLightboxScale(nextScale);
      if (nextScale <= 1) setLightboxPan({ x: 0, y: 0 });
    } else if (e.touches.length === 1 && isPanning && lightboxScale > 1) {
      const dx = e.touches[0].clientX - panStartRef.current.x;
      const dy = e.touches[0].clientY - panStartRef.current.y;
      setLightboxPan({
        x: panStartRef.current.panX + dx,
        y: panStartRef.current.panY + dy
      });
    }
  };

  const handleLightboxTouchEnd = () => {
    lightboxTouchDistRef.current = null;
    setIsPanning(false);
  };

  // Mouse move handler for lens magnifier simulation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // Touch handlers for mobile pinch-to-zoom, double tap & swipe gestures
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialDistance(dist);
    } else if (e.touches.length === 1) {
      touchSwipeRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        time: Date.now()
      };

      const now = Date.now();
      if (now - lastTap < 300) {
        // Double tap toggles zoom
        setTouchScale(prev => (prev > 1 ? 1 : 2));
      }
      setLastTap(now);
      
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = ((e.touches[0].clientX - left) / width) * 100;
      const y = ((e.touches[0].clientY - top) / height) * 100;
      setZoomPos({ x, y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && initialDistance !== null) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleFactor = currentDist / initialDistance;
      const newScale = Math.min(Math.max(scaleFactor, 1), 3);
      setTouchScale(newScale);
    } else if (e.touches.length === 1 && touchScale > 1) {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = Math.min(Math.max(((e.touches[0].clientX - left) / width) * 100, 0), 100);
      const y = Math.min(Math.max(((e.touches[0].clientY - top) / height) * 100, 0), 100);
      setZoomPos({ x, y });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setInitialDistance(null);

    // If not zoomed in, detect natural horizontal swipe across multiple images
    if (touchScale <= 1 && finalImages.length > 1 && e.changedTouches.length === 1) {
      const diffX = e.changedTouches[0].clientX - touchSwipeRef.current.startX;
      const diffY = e.changedTouches[0].clientY - touchSwipeRef.current.startY;
      const timeTaken = Date.now() - touchSwipeRef.current.time;

      if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY) && timeTaken < 800) {
        if (diffX < 0) {
          // Swipe Left -> Next Image
          setSelectedImgIndex(prev => (prev === finalImages.length - 1 ? 0 : prev + 1));
        } else {
          // Swipe Right -> Previous Image
          setSelectedImgIndex(prev => (prev === 0 ? finalImages.length - 1 : prev - 1));
        }
      }
    }
  };

  // WhatsApp formal text order message adapted per product kind (zero emojis)
  const handleWhatsAppOrder = () => {
    const phone = activeData.contactInfo.whatsapp;
    const storeUrl = window.location.href;
    const qtyFormatted = formatArabicQuantityLabel(effectiveQuantity, quantityUnit, lang);

    const tierLineAr = isSkinTierMode
      ? `*الباقة:* ${
          selectedTier === 3
            ? 'باقة التوفير القصوى (3 عبوات + هدية مجانية — خصم 20%)'
            : selectedTier === 2
              ? 'باقة التوفير (عبوتان — خصم 10%)'
              : 'عبوة واحدة'
        }\n`
      : '';
    const tierLineEn = isSkinTierMode
      ? `*Pack:* ${
          selectedTier === 3
            ? 'Value Pack (3 bottles + Free Gift — 20% OFF)'
            : selectedTier === 2
              ? 'Duo Pack (2 bottles — 10% OFF)'
              : 'Single Bottle'
        }\n`
      : '';

    const message = lang === 'ar'
      ? `*طلب مباشر — متجر ${activeData.storeName.ar}*\n` +
        `────────────────\n` +
        `*المنتج:* ${product.name.ar}\n` +
        tierLineAr +
        `*الكمية:* ${qtyFormatted}\n` +
        `*الإجمالي:* ${currentPrice.text}\n` +
        (isSkinTierMode && selectedTier === 3 ? `*ملاحظة:* مؤهل لهدية مجانية.\n` : '') +
        `*التوصيل المتوقع:* ${estDeliveryText}\n` +
        `*الرابط:* ${storeUrl}\n` +
        `────────────────\n` +
        `يرجى تأكيد التوفر والبدء في التوصيل (الدفع عند الاستلام).`
      : `*Direct Order — ${activeData.storeName.en}*\n` +
        `────────────────\n` +
        `*Product:* ${product.name.en}\n` +
        tierLineEn +
        `*Quantity:* ${qtyFormatted}\n` +
        `*Total:* ${currentPrice.text}\n` +
        (isSkinTierMode && selectedTier === 3 ? `*Note:* Qualified for complimentary gift.\n` : '') +
        `*Est. Delivery:* ${estDeliveryText}\n` +
        `*Link:* ${storeUrl}\n` +
        `────────────────\n` +
        `Please confirm availability and dispatch (Cash on Delivery).`;

    openExternalUrl(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
  };

  // Bundle Add To Cart (Applies bundle discount across main + unique complementary essentials)
  const handleAddBundle = () => {
    if (!product.bundle) return;
    const discountRate = Math.max(0, Math.min(90, product.bundle.discount || 0)) / 100;
    const discountFactor = 1 - discountRate;

    const discountedMainProduct: Product = {
      ...product,
      basePriceUSD: Number((product.basePriceUSD * discountFactor).toFixed(2)),
    };
    addToCart(discountedMainProduct, 1);

    product.bundle.items.forEach((item) => {
      if (item.id === product.id) return;
      const bundleSubProduct: Product = {
        id: item.id,
        name: item.name,
        category: product.category,
        basePriceUSD: Number((item.priceUSD * discountFactor).toFixed(2)),
        stock: 5,
        rating: 4.9,
        reviewsCount: 30,
        images: [item.image],
        tabs: product.tabs,
      };
      addToCart(bundleSubProduct, 1);
    });

    showToast(
      lang === 'ar'
        ? `تمت إضافة المجموعة كاملة للسلة بخصم ${product.bundle.discount}%!`
        : `Bundle added to bag with ${product.bundle.discount}% discount!`
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10 pb-28 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb & Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              returnFromPDPToStore();
            }}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#5A3E7A] active:scale-95 transition-all h-10 sm:h-11 px-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-purple-200 cursor-pointer"
          >
            {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{lang === 'ar' ? 'العودة لجميع المنتجات' : 'Back to Store'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: product.name[lang],
                      text: product.tabs.description[lang].slice(0, 100) + '...',
                      url: window.location.href,
                    });
                    return;
                  } catch (err) {
                    // fall back to copy below if user dismisses or share fails
                  }
                }
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  showToast(lang === 'ar' ? 'تم نسخ رابط المنتج بنجاح! يمكنك مشاركته الآن' : 'Product link copied to clipboard!');
                } catch {
                  showToast(lang === 'ar' ? 'رابط المنتج جاهز للمشاركة' : 'Product link ready to share');
                }
              }}
              className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
              title={lang === 'ar' ? 'مشاركة المنتج' : 'Share Product'}
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleCompare(product.id)}
              className={`p-2.5 rounded-full border shadow-sm transition-all flex items-center justify-center ${
                comparisonList.includes(product.id)
                  ? 'bg-[#5A3E7A] border-[#5A3E7A] text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-[#5A3E7A]'
              }`}
              title={lang === 'ar' ? 'مقارنة المواصفات' : 'Compare Specs'}
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-2.5 rounded-full border shadow-sm transition-all ${
                isWishlisted
                  ? 'bg-rose-500 border-rose-500 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-rose-500'
              }`}
              title="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Main PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          
          {/* LEFT COLUMN: Multi-Image Gallery with Pinch/Hover Lens */}
          <div className="lg:col-span-6 space-y-4">
            <div 
              className="relative aspect-[4/4.8] sm:aspect-[4/4.5] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 group touch-pan-y select-none"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => {
                setIsZoomed(false);
                setTouchScale(1);
              }}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={activeImage}
                alt={product.name[lang]}
                referrerPolicy="no-referrer"
                decoding="async"
                className="w-full h-full object-cover object-center transition-transform duration-150 ease-out"
                style={{
                  transform: `scale(${isZoomed ? 1.4 : touchScale})`,
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                }}
                onError={(e) => handleImageLoadError(e.currentTarget)}
              />
            </div>

            {/* Controls Below Main Image: Thumbnails & Dedicated White 4-Arrow Expand Button (Matching Reference Image) */}
            <div className="flex items-center justify-between gap-3 pt-1">
              {/* Thumbnail Ribbons */}
              {finalImages.length > 1 ? (
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none flex-1">
                  {finalImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImgIndex(idx)}
                      className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImgIndex === idx
                          ? 'border-[#5A3E7A] ring-2 ring-purple-200 scale-105'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt="thumb" 
                        referrerPolicy="no-referrer"
                        decoding="async"
                        className="w-full h-full object-cover" 
                        onError={(e) => handleImageLoadError(e.currentTarget)}
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex-1" />
              )}

              {/* Pure White Circular 4-Arrow Expand Button (Exactly Matching Reference Screenshot) */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="w-11 h-11 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 border border-slate-200 shadow-xs hover:shadow-md flex items-center justify-center shrink-0 transition-all active:scale-95 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#5A3E7A]/25"
                aria-label={lang === 'ar' ? 'تكبير وعرض بملء الشاشة' : 'Full screen expand'}
                title={lang === 'ar' ? 'عرض بملء الشاشة' : 'Expand full screen'}
              >
                <Maximize2 className="w-5 h-5 stroke-[1.8]" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Specifications & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Category and Rating */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold tracking-wider uppercase text-[#5A3E7A] bg-purple-50 px-3 py-1 rounded-lg border border-purple-100">
                  {getCleanCategoryLabel(product, lang)}
                </span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-[#5A3E7A] border border-purple-200/70">
                  <BadgeCheck className="w-4 h-4 shrink-0" />
                  <span className="font-bold text-slate-800 text-xs">{product.rating} / 5</span>
                  <span className="text-xs text-slate-500">({product.reviewsCount} {lang === 'ar' ? 'تقييم موثق' : 'reviews'})</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-fluid-h2 font-extrabold text-slate-900 leading-relaxed">
                {product.name[lang]}
              </h1>

              {/* Price Row */}
              <div className="flex items-baseline flex-wrap gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {singlePrice.text}
                </span>
                {singleOrigPrice && (
                  <span className="text-base text-slate-400 line-through">
                    {singleOrigPrice.text}
                  </span>
                )}
                <SmartDiscountBadge
                  basePriceUSD={product.basePriceUSD}
                  originalPriceUSD={product.originalPriceUSD}
                  manualPercent={product.discountPercentage}
                  lang={lang}
                  size="md"
                />
              </div>

              {/* 1. CONTEXT-AWARE TRUST CHIPS (3 concise non-repetitive pillars) */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {contextCopy.trustChips.map((chip) => {
                  const toneClasses =
                    chip.tone === 'purple'
                      ? 'bg-purple-50/75 border-purple-100 text-[#5A3E7A]'
                      : chip.tone === 'emerald'
                        ? 'bg-emerald-50/75 border-emerald-100 text-emerald-800'
                        : 'bg-amber-50/75 border-amber-100 text-amber-800';
                  return (
                    <div
                      key={chip.id}
                      className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border text-[11px] font-bold text-center ${toneClasses}`}
                    >
                      {chip.tone === 'purple' ? (
                        productKind === 'skin' ? (
                          <Droplets className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <Award className="w-3.5 h-3.5 shrink-0" />
                        )
                      ) : chip.tone === 'emerald' ? (
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span className="truncate">{chip.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* 2. SIZE / MEASUREMENT & QUICK SPECS CARD */}
              <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800">
                  <Ruler className="w-3.5 h-3.5 text-[#5A3E7A] shrink-0" />
                  <span>{quickSpecs.heading}</span>
                </div>
                <div className={`grid gap-2 ${quickSpecs.items.length >= 4 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
                  {quickSpecs.items.map((spec, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 rounded-xl bg-white border border-slate-200/70 space-y-0.5"
                    >
                      <span className="block text-[10px] font-bold text-slate-400">
                        {spec.label}
                      </span>
                      <span className="block text-xs font-extrabold text-slate-800 leading-relaxed">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. HONEST AVAILABILITY & ESTIMATED DELIVERY CARD */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/75 flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isOutOfStock
                            ? 'bg-amber-500'
                            : product.stock <= 5
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                        }`}
                      />
                      <span className="truncate">
                        {isOutOfStock
                          ? (lang === 'ar' ? 'نفدت الكمية مؤقتاً — الحجز المسبق متاح' : 'Temporarily out of stock — Pre-order available')
                          : product.stock <= 5
                            ? (lang === 'ar'
                                ? `متوفر الآن (${formatArabicQuantityLabel(product.stock, quantityUnit, 'ar')} متبقية)`
                                : `In stock (${product.stock} left)`)
                            : (lang === 'ar' ? 'متوفر في المخزون للشحن الفوري' : 'In stock & ready to ship')}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-900/90 font-medium leading-relaxed">
                      {lang === 'ar' ? `التوصيل المتوقع: ${estDeliveryText}` : `Est. delivery: ${estDeliveryText}`}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-emerald-700 text-white shrink-0">
                  {qualifiesFreeShipping
                    ? (lang === 'ar' ? 'شحن مجاني' : 'Free Shipping')
                    : (lang === 'ar' ? 'شحن سريع' : 'Express')}
                </span>
              </div>

              {/* 4. CONTEXT-AWARE QUANTITY / VOLUME SAVINGS SELECTOR */}
              {!isOutOfStock && (
                isSkinTierMode ? (
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-extrabold text-slate-900">
                      <span className="flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-[#5A3E7A]" />
                        <span>{lang === 'ar' ? 'اختاري الباقة المناسبة لكِ:' : 'Choose Your Volume Pack:'}</span>
                      </span>
                      <span className="text-[11px] font-bold text-[#5A3E7A] bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-100">
                        {lang === 'ar' ? 'توفير فوري' : 'Instant Savings'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {/* Tier 1: Single Bottle */}
                      <button
                        type="button"
                        onClick={() => setSelectedTier(1)}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between text-start ${
                          selectedTier === 1
                            ? 'border-[#5A3E7A] bg-purple-50/50 shadow-xs ring-1 ring-[#5A3E7A]/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400">
                              {lang === 'ar' ? 'الأساسية' : 'Standard'}
                            </span>
                            {selectedTier === 1 && (
                              <span className="w-4 h-4 rounded-full bg-[#5A3E7A] text-white flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <h4 className="font-extrabold text-xs text-slate-900">
                            {formatArabicQuantityLabel(1, 'bottle', lang)}
                          </h4>
                          <p className="text-[10px] text-slate-500">
                            {lang === 'ar' ? 'شحن قياسي سريع' : 'Standard express'}
                          </p>
                        </div>
                        <div className="pt-2 mt-2 border-t border-slate-100 font-mono font-black text-sm text-slate-900">
                          {convertPrice(product.basePriceUSD).text}
                        </div>
                      </button>

                      {/* Tier 2: Duo Pack (10% OFF) */}
                      <button
                        type="button"
                        onClick={() => setSelectedTier(2)}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between text-start ${
                          selectedTier === 2
                            ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-600/25'
                            : 'border-slate-200 bg-white hover:border-emerald-300'
                        }`}
                      >
                        <span className="absolute -top-2.5 end-3 px-2 py-0.5 rounded-lg text-[9px] font-extrabold bg-emerald-600 text-white shadow-xs">
                          {lang === 'ar' ? 'الأكثر طلباً' : 'Most Popular'}
                        </span>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-emerald-700">
                              {lang === 'ar' ? 'وفّري 10%' : 'Save 10%'}
                            </span>
                            {selectedTier === 2 && (
                              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <h4 className="font-extrabold text-xs text-slate-900">
                            {formatArabicQuantityLabel(2, 'bottle', lang)}
                          </h4>
                          <p className="text-[10px] text-emerald-800 font-semibold">
                            {lang === 'ar' ? 'توصيل مجاني بالكامل' : '100% Free Shipping'}
                          </p>
                        </div>
                        <div className="pt-2 mt-2 border-t border-slate-100">
                          <div className="font-mono font-black text-sm text-slate-900">
                            {convertPrice(product.basePriceUSD * 2 * 0.9).text}
                          </div>
                          <div className="text-[10px] text-slate-400 line-through">
                            {convertPrice(product.basePriceUSD * 2).text}
                          </div>
                        </div>
                      </button>

                      {/* Tier 3: Value Pack of 3 (20% OFF + Free Gift) */}
                      <button
                        type="button"
                        onClick={() => setSelectedTier(3)}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between text-start ${
                          selectedTier === 3
                            ? 'border-amber-500 bg-amber-50/60 shadow-sm ring-1 ring-amber-500/25'
                            : 'border-slate-200 bg-white hover:border-amber-300'
                        }`}
                      >
                        <span className="absolute -top-2.5 end-3 px-2 py-0.5 rounded-lg text-[9px] font-extrabold bg-amber-500 text-white shadow-xs flex items-center gap-1">
                          <Gift className="w-2.5 h-2.5" />
                          <span>{lang === 'ar' ? 'أعلى قيمة' : 'Best Value'}</span>
                        </span>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-amber-800">
                              {lang === 'ar' ? 'وفّري 20% + هدية' : 'Save 20% + Gift'}
                            </span>
                            {selectedTier === 3 && (
                              <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <h4 className="font-extrabold text-xs text-slate-900">
                            {formatArabicQuantityLabel(3, 'bottle', lang)}
                          </h4>
                          <p className="text-[10px] text-amber-900 font-semibold">
                            {lang === 'ar' ? 'شحن مجاني + هدية مخملية' : 'Free Ship + Velvet Gift'}
                          </p>
                        </div>
                        <div className="pt-2 mt-2 border-t border-slate-100">
                          <div className="font-mono font-black text-sm text-slate-900">
                            {convertPrice(product.basePriceUSD * 3 * 0.8).text}
                          </div>
                          <div className="text-[10px] text-slate-400 line-through">
                            {convertPrice(product.basePriceUSD * 3).text}
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div>
                      <span className="block text-xs font-extrabold text-slate-900">
                        {lang === 'ar' ? 'الكمية المطلوبة' : 'Select Quantity'}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {formatArabicQuantityLabel(quantity, quantityUnit, lang)}
                      </span>
                    </div>
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        aria-label={lang === 'ar' ? 'تقليل الكمية' : 'Decrease quantity'}
                        className="min-w-[44px] h-10 hover:bg-slate-100 active:bg-slate-200 transition-colors font-bold text-slate-700 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-4 h-10 flex items-center justify-center font-extrabold text-sm text-slate-900 border-x border-slate-100 min-w-[44px]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(Math.max(1, product.stock || 10), quantity + 1))}
                        aria-label={lang === 'ar' ? 'زيادة الكمية' : 'Increase quantity'}
                        className="min-w-[44px] h-10 hover:bg-slate-100 active:bg-slate-200 transition-colors font-bold text-slate-700 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              )}

              {/* 5. PRIMARY CALL TO ACTION BUTTONS (Cart + WhatsApp) */}
              <div className="space-y-2.5 pt-1">
                <button
                  onClick={() => {
                    if (isOutOfStock) {
                      handleWhatsAppOrder();
                    } else {
                      const tierProduct: Product = {
                        ...product,
                        basePriceUSD: discountedSingleUSD,
                        badge: tierDiscountPercent > 0 ? {
                          ar: `باقة توفير -${tierDiscountPercent}%`,
                          en: `Bundle -${tierDiscountPercent}%`
                        } : product.badge
                      };
                      addToCart(tierProduct, effectiveQuantity);
                    }
                  }}
                  className={`w-full h-11 px-5 rounded-xl font-extrabold flex items-center justify-center gap-2 text-sm sm:text-base transition-all shadow-sm cursor-pointer ${
                    isOutOfStock
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-[#5A3E7A] hover:bg-[#483162] text-white hover:shadow-md active:scale-[0.98]'
                  }`}
                >
                  {isOutOfStock ? (
                    <>
                      <MessageCircle className="w-4.5 h-4.5" />
                      <span>{lang === 'ar' ? 'حجز مسبق فوري عبر واتساب' : 'Instant Pre-Order on WhatsApp'}</span>
                    </>
                  ) : (
                    <>
                      <StoreCartIcon className="w-4.5 h-4.5 text-white" />
                      <span>
                        {lang === 'ar'
                          ? `إضافة للسلة • ${currentPrice.text}${tierDiscountPercent > 0 ? ` (وفرتِ ${tierDiscountPercent}%)` : ''}`
                          : `Add to Bag • ${currentPrice.text}${tierDiscountPercent > 0 ? ` (Save ${tierDiscountPercent}%)` : ''}`}
                      </span>
                    </>
                  )}
                </button>

                {/* Direct Smart WhatsApp Ordering Button */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full h-11 px-5 rounded-xl font-bold text-xs sm:text-sm text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <MessageCircle className="w-4.5 h-4.5 text-emerald-600" />
                  <span>{lang === 'ar' ? 'اطلبي بنقرة واحدة عبر واتساب (دفع عند الاستلام)' : 'One-Click Order via WhatsApp (COD)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BUNDLE BUILDER / SHOP THE LOOK (مجمع المجموعات بخصم 15%) */}
        {product.bundle && (
          <div className="mt-8 bg-gradient-to-r from-purple-50 via-pink-50 to-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#5A3E7A] text-white">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'تسوّق المجموعة الكاملة (Shop The Look)' : 'Complete The Routine'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {product.bundle.title[lang]}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                  {lang === 'ar'
                    ? `احصل على هذا المنتج مع المنتجات المكملة في بكج واحد مع خصم ${product.bundle.discount}% فوري عند الطلب الآن!`
                    : `Get this item along with complementary essentials in one package with ${product.bundle.discount}% instant OFF!`}
                </p>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {/* Bundle Thumbnails */}
                <div className="flex items-center gap-2">
                  <img src={product.images[0]} alt="main" referrerPolicy="no-referrer" decoding="async" onError={(e) => handleImageLoadError(e.currentTarget)} className="w-14 h-14 rounded-xl object-cover border border-purple-200" />
                  <span className="text-slate-400 font-bold">+</span>
                  {product.bundle.items.map((bItem) => (
                    <img key={bItem.id} src={bItem.image} alt={bItem.name[lang]} referrerPolicy="no-referrer" decoding="async" onError={(e) => handleImageLoadError(e.currentTarget)} className="w-14 h-14 rounded-xl object-cover border border-purple-200" />
                  ))}
                </div>

                <button
                  onClick={handleAddBundle}
                  className="bg-[#5A3E7A] hover:bg-[#483162] text-white text-xs sm:text-sm font-bold px-5 h-10 sm:h-11 rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {lang === 'ar' ? `إضافة البكج للسلة (خصم ${product.bundle.discount}%)` : `Add Bundle to Bag (${product.bundle.discount}% OFF)`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5-PILLAR LUXE PRO ACCORDION SYSTEM (Description, Usage, Specs/Ingredients, Shipping & Guarantee, Customer Reviews) */}
        <div className="mt-10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-700" />
              <span>{lang === 'ar' ? 'تفاصيل ومعلومات المنتج الشاملة' : 'Complete Product Information'}</span>
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              {lang === 'ar' ? 'اضغطي على أي قسم لعرض التفاصيل' : 'Click to expand / collapse'}
            </span>
          </div>

          {/* ACCORDION 1: Description & Key Highlights */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-300 hover:border-purple-200">
            <button
              type="button"
              onClick={() => toggleAccordion('desc')}
              className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-start transition-colors hover:bg-slate-50/70 min-h-[56px] cursor-pointer"
              aria-expanded={openAccordions.desc}
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                      {lang === 'ar' ? 'الوصف وتفاصيل المنتج الفاخرة' : 'Description & Key Highlights'}
                    </h4>
                    <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      {lang === 'ar' ? 'نظرة شاملة' : 'Overview'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {lang === 'ar' ? 'شرح وافٍ لخصائص ومميزات المنتج ونتائجه' : 'Comprehensive overview of features and results'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 transition-transform duration-300 ${openAccordions.desc ? 'rotate-180 bg-purple-100 text-purple-700' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </span>
              </div>
            </button>

            {openAccordions.desc && (
              <div className="p-4 sm:p-6 pt-0 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                <div className="text-slate-700 leading-relaxed text-sm sm:text-base pt-4">
                  <p>{product.tabs.description[lang]}</p>
                </div>

                {/* Context-Aware Highlights Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {contextCopy.descHighlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-purple-50/60 border border-purple-100 text-xs sm:text-sm text-purple-950 font-medium leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ACCORDION 2: How to Use & Application Guide */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-300 hover:border-purple-200">
            <button
              type="button"
              onClick={() => toggleAccordion('usage')}
              className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-start transition-colors hover:bg-slate-50/70 min-h-[56px] cursor-pointer"
              aria-expanded={openAccordions.usage}
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                      {lang === 'ar' ? 'طريقة الاستخدام والخطوات الموصى بها' : 'How to Use & Application Guide'}
                    </h4>
                    <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {lang === 'ar' ? 'نصائح الخبراء' : 'Expert Guide'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {lang === 'ar' ? 'الخطوات السليمة لتحقيق أقصى فاعلية واستفادة' : 'Step-by-step instructions for best results'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 transition-transform duration-300 ${openAccordions.usage ? 'rotate-180 bg-amber-100 text-amber-800' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </span>
              </div>
            </button>

            {openAccordions.usage && (
              <div className="p-4 sm:p-6 pt-0 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 mt-4">
                  <h5 className="font-extrabold text-amber-950 text-xs sm:text-sm mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    <span>{lang === 'ar' ? 'إرشادات الاستخدام المعتمدة:' : 'Recommended Usage Guidelines:'}</span>
                  </h5>
                  <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                    {product.tabs.usage[lang]}
                  </p>
                </div>

                {/* 3 Context-Aware Practical Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {contextCopy.usageSteps.map((step, idx) => {
                    const stepBg =
                      idx === 0 ? 'bg-slate-900' : idx === 1 ? 'bg-[#5A3E7A]' : 'bg-emerald-700';
                    return (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                        <span className={`w-6 h-6 rounded-full ${stepBg} text-white font-bold text-xs flex items-center justify-center mb-2`}>
                          {idx + 1}
                        </span>
                        <h6 className="font-bold text-xs text-slate-900 mb-1">
                          {step.title}
                        </h6>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {step.body}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ACCORDION 3: Technical Specs, Box Contents, or Pure Formulation */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-300 hover:border-purple-200">
            <button
              type="button"
              onClick={() => toggleAccordion('specs')}
              className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-start transition-colors hover:bg-slate-50/70 min-h-[56px] cursor-pointer"
              aria-expanded={openAccordions.specs}
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                      {contextCopy.specsHeader.title}
                    </h4>
                    <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {contextCopy.specsHeader.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {contextCopy.specsHeader.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 transition-transform duration-300 ${openAccordions.specs ? 'rotate-180 bg-emerald-100 text-emerald-800' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </span>
              </div>
            </button>

            {openAccordions.specs && (
              <div className="p-4 sm:p-6 pt-0 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                <div className="pt-4">
                  {product.isTechSpecs && product.techSpecs && product.techSpecs.length > 0 ? (
                    <div className="overflow-hidden border border-slate-200 rounded-2xl shadow-xs">
                      <table className="w-full text-start text-xs sm:text-sm">
                        <tbody>
                          {product.techSpecs.map((spec, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}>
                              <td className="p-3.5 font-bold text-slate-900 w-1/3 border-b border-slate-100">
                                {spec.label[lang]}
                              </td>
                              <td className="p-3.5 text-slate-700 border-b border-slate-100 font-medium">
                                {spec.value[lang]}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (productKind === 'hair' || productKind === 'box') && pipeSpecs.length >= 2 ? (
                    <div className="space-y-3">
                      <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3">
                        <h5 className="font-extrabold text-emerald-950 text-xs sm:text-sm flex items-center gap-1.5">
                          <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                          <span>{contextCopy.specsHeader.sectionTitle}</span>
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {pipeSpecs.map((specItem, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 p-3 rounded-xl bg-white border border-emerald-100 text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{specItem}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 lg:gap-3 pt-1">
                        {contextCopy.specsHeader.chips.map((chipLabel, idx) => (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs font-bold text-slate-700 ${
                              idx === 2 ? 'col-span-2 sm:col-span-1' : ''
                            }`}
                          >
                            {chipLabel}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80">
                        <h5 className="font-extrabold text-emerald-950 text-xs sm:text-sm mb-1.5 flex items-center gap-1.5">
                          <FlaskConical className="w-4 h-4 text-emerald-700" />
                          <span>{contextCopy.specsHeader.sectionTitle}</span>
                        </h5>
                        <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                          {product.tabs.ingredientsOrSpecs?.[lang] || (lang === 'ar' ? 'مستخلصات نباتية طبيعية غنية بالعناصر المغذية ومضادات الأكسدة.' : 'Pure natural plant extracts rich in nourishing antioxidants.')}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 lg:gap-3 pt-1">
                        {contextCopy.specsHeader.chips.map((chipLabel, idx) => (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs font-bold text-slate-700 ${
                              idx === 2 ? 'col-span-2 sm:col-span-1' : ''
                            }`}
                          >
                            {chipLabel}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ACCORDION 4: Shipping, Delivery & Golden Guarantee */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-300 hover:border-purple-200">
            <button
              type="button"
              onClick={() => toggleAccordion('shipping')}
              className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-start transition-colors hover:bg-slate-50/70 min-h-[56px] cursor-pointer"
              aria-expanded={openAccordions.shipping}
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                      {lang === 'ar' ? 'الشحن السريع، الدفع عند الاستلام، والضمان الذهبي' : 'Shipping, COD & Golden Guarantee'}
                    </h4>
                    <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                      {lang === 'ar' ? 'ضمان 100%' : '100% Guaranteed'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {lang === 'ar' ? 'توصيل سريع، فحص قبل الدفع، وسياسة استبدال ميسرة' : 'Fast delivery, pay on delivery, hassle-free returns'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 transition-transform duration-300 ${openAccordions.shipping ? 'rotate-180 bg-blue-100 text-blue-800' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </span>
              </div>
            </button>

            {openAccordions.shipping && (
              <div className="p-4 sm:p-6 pt-0 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center gap-2 text-blue-700 font-extrabold text-xs sm:text-sm">
                      <Truck className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'شحن فوري وسريع' : 'Express Delivery'}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {lang === 'ar' ? 'يتم تجهيز الطلب وإرساله مع مندوب معتمد خلال 24 إلى 48 ساعة لباب منزلكِ.' : 'Dispatched with certified express couriers within 24-48 hours.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-xs sm:text-sm">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'الدفع عند الاستلام (COD)' : 'Cash on Delivery (COD)'}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {lang === 'ar' ? 'لا حاجة للدفع مسبقاً، يمكنكِ معاينة وفحص الشحنة عند الاستلام ثم الدفع بكل ثقة.' : 'No upfront payment required. Inspect your order and pay with full confidence.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center gap-2 text-purple-700 font-extrabold text-xs sm:text-sm">
                      <RotateCcw className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'الضمان الذهبي للاستبدال' : 'Golden Replacement Guarantee'}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {productKind === 'hair'
                        ? (lang === 'ar' ? 'ضمان سنتين معتمد ضد عيوب التصنيع + استبدال فوري خلال 14 يوماً من الاستلام.' : '2-year certified warranty + easy 14-day replacement upon delivery.')
                        : (lang === 'ar' ? 'سياسة استبدال أو استرجاع ميسرة في حال وجود أي ملاحظة خلال 14 يوماً من الاستلام.' : 'Easy 14-day replacement or return policy if you have any concerns.')}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center gap-2 text-amber-700 font-extrabold text-xs sm:text-sm">
                      <Award className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'تغليف آمن وفاخر' : 'Luxury Secure Packaging'}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {productKind === 'hair'
                        ? (lang === 'ar' ? 'يصلكِ الجهاز في تغليف حماية عازل للصدمات يحفظ سلامة الجهاز وملحقاته.' : 'Arrives securely in shock-resistant packaging protecting the device and attachments.')
                        : (lang === 'ar' ? 'تصلكِ المنتجات في تغليف حماية عازل للصدمات يحفظ جودة العبوات ونضارة التركيبة.' : 'Items arrive safely in impact-resistant luxury packaging.')}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <span className="font-bold text-purple-900">
                    {lang === 'ar' ? 'لديكِ استفسار حول الشحن أو التوصيل؟' : 'Have questions regarding shipping or delivery?'}
                  </span>
                  <button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    className="font-extrabold text-[#5A3E7A] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'ar' ? 'تحدثي مباشرة مع خدمة العملاء' : 'Chat with Support on WhatsApp'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ACCORDION 5: Verified Customer Reviews & Ratings */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-300 hover:border-purple-200">
            <button
              type="button"
              onClick={() => toggleAccordion('reviews')}
              className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-start transition-colors hover:bg-slate-50/70 min-h-[56px] cursor-pointer"
              aria-expanded={openAccordions.reviews}
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#5A3E7A] flex items-center justify-center shrink-0">
                  <BadgeCheck className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                      {lang === 'ar' ? `تقييمات وتجارب العميلات المعتمدة (${product.reviewsCount})` : `Verified Customer Reviews (${product.reviewsCount})`}
                    </h4>
                    <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-purple-50 text-[#5A3E7A] border border-purple-200">
                      {product.rating} / 5
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {lang === 'ar' ? 'آراء وتجارب واقعية موثقة من عميلاتنا' : 'Verified feedback from real shoppers'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 transition-transform duration-300 ${openAccordions.reviews ? 'rotate-180 bg-purple-100 text-[#5A3E7A]' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </span>
              </div>
            </button>

            {openAccordions.reviews && (
              <div className="p-4 sm:p-6 pt-0 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                {/* Score & Action Row */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#5A3E7A] text-white font-black text-xl flex items-center justify-center shadow-sm">
                      {product.rating}
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-purple-50 text-[#5A3E7A] border border-purple-200/70 text-[11px] font-extrabold mb-1">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? `تقييم معتمد • ${product.rating} من 5` : `Verified Score • ${product.rating} / 5`}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        {lang === 'ar' ? 'تقييمات حقيقية من طلبات مكتملة' : 'Authentic ratings from completed orders'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {lang === 'ar' ? `بناءً على ${product.reviewsCount} تقييماً موثقاً` : `Based on ${product.reviewsCount} verified purchases`}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(true)}
                    className="px-5 h-10 sm:h-11 bg-[#5A3E7A] hover:bg-[#483162] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <PenLine className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'أضيفي تقييمكِ وتجربتكِ' : 'Write a Review'}</span>
                  </button>
                </div>

                {/* Testimonial Quote */}
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100/80 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-purple-200 text-purple-900 font-bold text-xs flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-extrabold text-xs text-slate-900">
                        {lang === 'ar' ? 'مراجعة موثقة من عميلة حقيقية' : 'Verified Buyer Review'}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg font-bold border border-emerald-200 shrink-0">
                      <Check className="w-3 h-3" />
                      <span>{lang === 'ar' ? 'شراء مؤكد' : 'Verified Purchase'}</span>
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "{product.tabs.reviews[lang]}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 7. CONTEXT-AWARE COMPARISON MATRIX */}
        <div className="mt-10 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold bg-purple-100 text-[#5A3E7A] border border-purple-200">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5A3E7A]" />
              <span>{lang === 'ar' ? 'معايير الجودة والتميز' : 'Why Choose NADI'}</span>
            </span>
            <h3 className="text-fluid-h2 font-black text-slate-900 font-brand-ar leading-relaxed">
              {contextCopy.comparison.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {contextCopy.comparison.subtitle}
            </p>
          </div>

          <div className="overflow-x-auto scrollbar-none pt-2">
            <table className="w-full text-start border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-200 text-xs sm:text-sm font-black text-slate-500">
                  <th className="py-3 px-4 text-start font-bold text-slate-600">{lang === 'ar' ? 'المعيار والميزة' : 'Feature / Criterion'}</th>
                  <th className="py-3 px-4 text-center bg-purple-50/80 text-[#5A3E7A] rounded-t-2xl font-black border-x border-t border-purple-200/80">
                    <span className="inline-flex items-center gap-1 text-sm font-black">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>{activeData.storeName[lang]}</span>
                    </span>
                  </th>
                  <th className="py-3 px-4 text-center font-bold text-slate-400">{contextCopy.comparison.competitorHeader}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                {contextCopy.comparison.rows.map((row, idx) => {
                  const isLast = idx === contextCopy.comparison.rows.length - 1;
                  return (
                    <tr key={idx}>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        {row.criterion}
                      </td>
                      <td
                        className={`py-3.5 px-4 text-center bg-purple-50/40 border-x border-purple-200/60 font-bold text-emerald-800 ${
                          isLast ? 'border-b rounded-b-2xl' : ''
                        }`}
                      >
                        <span className="inline-flex items-center gap-1.5 justify-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{row.nadi}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-400">
                        <span className="inline-flex items-center gap-1.5 justify-center text-rose-500 font-semibold">
                          <CloseIcon className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>{row.competitor}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Return to Store Navigation Banner */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 backdrop-blur-xs p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <h4 className="text-base font-black text-slate-900">
              {lang === 'ar' ? 'هل ترغبين في استكشاف المزيد؟' : 'Looking for more curated items?'}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'ar' ? 'عُودي إلى موضعك السابق في المتجر لمتابعة استكشاف باقي التشكيلات والعروض' : 'Return directly to where you were and explore our full collection'}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              returnFromPDPToStore();
            }}
            className="flex items-center gap-2 px-5 h-11 bg-[#5A3E7A] hover:bg-[#483162] text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
          >
            {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{lang === 'ar' ? 'الرجوع للمتجر ومتابعة التسوق' : 'Back to Store & Continue'}</span>
          </button>
        </div>

      </div>

      {/* FULL-SCREEN IMMERSIVE LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={() => {
            setIsLightboxOpen(false);
            setLightboxScale(1);
          }}
        >
          {/* Top Controls Bar - Mobile-Optimized Safe Area with Isolated Close Button */}
          <div 
            className="relative w-full max-w-7xl mx-auto z-20 flex items-center justify-between gap-3 pt-1 sm:pt-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Product Meta Pill: Independent with Safe Truncation */}
            <div className="flex-1 min-w-0 me-3">
              <div className="inline-flex items-center gap-2 max-w-full bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
                <span className="text-xs sm:text-sm font-bold text-white truncate block max-w-[140px] xs:max-w-[200px] sm:max-w-md">
                  {product.name[lang]}
                </span>
                <span className="text-[10px] sm:text-xs font-mono font-extrabold text-amber-300 bg-black/40 px-2 py-0.5 rounded-full border border-white/10 shrink-0">
                  {selectedImgIndex + 1} / {product.images.length}
                </span>
              </div>
            </div>

            {/* Action Group: Zoom Controls + Fully Isolated Safe Close Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setLightboxScale(prev => (prev > 1 ? 1 : 2.2))}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15 flex items-center justify-center shrink-0 cursor-pointer active:scale-95"
                title={lightboxScale > 1 ? (lang === 'ar' ? 'تصغير الحجم' : 'Zoom Out') : (lang === 'ar' ? 'تكبير 2X' : 'Zoom In 2X')}
              >
                {lightboxScale > 1 ? <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" /> : <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>

              {/* Isolated Close Button X with Safe 48px Touch Target */}
              <button
                type="button"
                onClick={() => {
                  setIsLightboxOpen(false);
                  setLightboxScale(1);
                }}
                className="min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] rounded-full bg-red-500/20 hover:bg-red-500/35 border border-red-400/40 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-90 cursor-pointer shadow-lg shadow-black/40"
                aria-label={lang === 'ar' ? 'إغلاق نافذة تكبير الصور' : 'Close full screen preview'}
                title={lang === 'ar' ? 'إغلاق (ESC)' : 'Close (ESC)'}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Center Stage: High-Resolution Photo + Navigation Arrows */}
          <div 
            className="relative flex-1 flex items-center justify-center overflow-hidden my-3 touch-none"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheelZoom}
            onTouchStart={handleLightboxTouchStart}
            onTouchMove={handleLightboxTouchMove}
            onTouchEnd={handleLightboxTouchEnd}
          >
            {/* Previous Arrow */}
            {finalImages.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedImgIndex(prev => (prev === 0 ? finalImages.length - 1 : prev - 1));
                  setLightboxScale(1);
                  setLightboxPan({ x: 0, y: 0 });
                }}
                className="absolute start-2 sm:start-6 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-white/20 shadow-lg"
                aria-label="Previous image"
              >
                {isRtl ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
              </button>
            )}

            {/* Immersive Image Display with Smooth Dynamic Scale & Pan */}
            <div 
              className={`overflow-hidden max-h-[78vh] max-w-[92vw] flex items-center justify-center select-none ${
                lightboxScale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
              }`}
              onDoubleClick={() => {
                setLightboxScale(prev => {
                  const next = prev > 1 ? 1 : 2.5;
                  if (next === 1) setLightboxPan({ x: 0, y: 0 });
                  return next;
                });
              }}
            >
              <img
                src={activeImage}
                alt={product.name[lang]}
                referrerPolicy="no-referrer"
                decoding="async"
                draggable={false}
                className="max-h-[76vh] sm:max-h-[80vh] max-w-[90vw] object-contain drop-shadow-2xl transition-transform duration-100 ease-out select-none pointer-events-none"
                style={{
                  transform: `scale(${lightboxScale}) translate(${lightboxPan.x / lightboxScale}px, ${lightboxPan.y / lightboxScale}px)`,
                }}
                onError={(e) => handleImageLoadError(e.currentTarget)}
              />
            </div>

            {/* Next Arrow */}
            {finalImages.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedImgIndex(prev => (prev === finalImages.length - 1 ? 0 : prev + 1));
                  setLightboxScale(1);
                  setLightboxPan({ x: 0, y: 0 });
                }}
                className="absolute end-2 sm:end-6 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-white/20 shadow-lg"
                aria-label="Next image"
              >
                {isRtl ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Strip (Clutter-Free, Unnecessary Note Removed) */}
          <div 
            className="w-full max-w-xl mx-auto flex flex-col items-center gap-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {finalImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-1.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 max-w-full">
                {finalImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedImgIndex(idx);
                      setLightboxScale(1);
                      setLightboxPan({ x: 0, y: 0 });
                    }}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImgIndex === idx
                        ? 'border-white ring-2 ring-white/50 scale-105'
                        : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt="thumb" 
                      referrerPolicy="no-referrer"
                      decoding="async"
                      className="w-full h-full object-cover" 
                      onError={(e) => handleImageLoadError(e.currentTarget)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
