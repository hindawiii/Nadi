import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, ArrowRight, BadgeCheck, Heart, MessageCircle,
  ShieldCheck, Truck, Plus, Check, Share2, Layers, Maximize2,
  ArrowLeftRight, CheckCircle2, Award, Droplets, Ruler, Package,
  Gift
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { Product } from '../data/siteConfig';
import { StoreCartIcon } from './common/StoreCartIcon';
import { SmartDiscountBadge } from './common/SmartDiscountBadge';
import { PdpFullscreenLightbox } from './pdp/PdpFullscreenLightbox';
import { PdpInfoAccordions } from './pdp/PdpInfoAccordions';
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

  // Touch swipe gesture tracker for PDP gallery (inline zoom disabled — zoom lives exclusively in Fullscreen Lightbox)
  const touchSwipeRef = useRef<{ startX: number; startY: number; time: number }>({ startX: 0, startY: 0, time: 0 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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

  // Pure horizontal swipe handlers for PDP gallery (inline zoom intentionally removed; zoom works only in Lightbox)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      touchSwipeRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        time: Date.now()
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (finalImages.length > 1 && e.changedTouches.length === 1) {
      const diffX = e.changedTouches[0].clientX - touchSwipeRef.current.startX;
      const diffY = e.changedTouches[0].clientY - touchSwipeRef.current.startY;
      const timeTaken = Date.now() - touchSwipeRef.current.time;

      if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY) && timeTaken < 800) {
        if (diffX < 0) {
          setSelectedImgIndex(prev => (prev === finalImages.length - 1 ? 0 : prev + 1));
        } else {
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
    <div className="min-h-screen bg-slate-50 pt-2 sm:pt-6 lg:pt-8 pb-28 sm:pb-16">
      <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-6">
        
        {/* Breadcrumb & Navigation */}
        <div className="px-3 sm:px-0 mb-2.5 sm:mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              returnFromPDPToStore();
            }}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#5A3E7A] active:scale-95 transition-all h-10 sm:h-11 px-3.5 sm:px-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-purple-200 cursor-pointer"
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
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-xs flex items-center justify-center cursor-pointer"
              title={lang === 'ar' ? 'مشاركة المنتج' : 'Share Product'}
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleCompare(product.id)}
              className={`w-10 h-10 rounded-full border shadow-xs transition-all flex items-center justify-center cursor-pointer ${
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
              className={`w-10 h-10 rounded-full border shadow-xs transition-all flex items-center justify-center cursor-pointer ${
                isWishlisted
                  ? 'bg-rose-500 border-rose-500 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-rose-500'
              }`}
              title={lang === 'ar' ? 'المفضلة' : 'Wishlist'}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Main PDP Grid (Full-Bleed Cinematic on Mobile; Balanced 2-Column Split on Tablet/Desktop to Prevent Any Top Cropping) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-6 lg:gap-10 bg-white sm:rounded-3xl border-y sm:border border-slate-200/90 shadow-xs overflow-hidden">
          
          {/* LEFT COLUMN: Multi-Image Gallery (Zero Inline Zoom; Uncropped Natural Aspect Ratio on All Screens) */}
          <div className="md:col-span-6 sm:p-4 md:p-5 space-y-2.5 sm:space-y-3">
            <div 
              className="relative aspect-[4/4.2] sm:max-w-[460px] sm:mx-auto md:max-w-none md:aspect-[4/4.3] w-full rounded-none sm:rounded-2xl overflow-hidden bg-slate-100 touch-pan-y select-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={activeImage}
                alt={product.name[lang]}
                referrerPolicy="no-referrer"
                decoding="async"
                className="w-full h-full object-cover object-center select-none"
                onError={(e) => handleImageLoadError(e.currentTarget)}
              />
            </div>

            {/* Compact Thumbnail Strip + Original Fullscreen Expand Row (Matched 44px Height on Mobile, 52px on Larger Screens) */}
            <div className="px-3 sm:px-0 sm:max-w-[460px] sm:mx-auto md:max-w-none pb-1 flex items-center justify-between gap-3">
              {finalImages.length > 1 ? (
                <div className="flex items-center gap-2 overflow-x-auto py-0.5 scrollbar-none min-w-0">
                  {finalImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImgIndex(idx)}
                      className={`relative w-11 h-11 sm:w-[52px] sm:h-[52px] rounded-lg overflow-hidden border-[1.5px] shrink-0 transition-all cursor-pointer ${
                        selectedImgIndex === idx
                          ? 'border-[#5A3E7A] ring-2 ring-purple-200/90'
                          : 'border-slate-200 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`${product.name[lang]} ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        decoding="async"
                        className="w-full h-full object-cover" 
                        onError={(e) => handleImageLoadError(e.currentTarget)}
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div />
              )}

              {/* Fullscreen Expand Button Restored to Its Original Row Below the Image */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                className="w-11 h-11 rounded-full bg-white hover:bg-purple-50 text-slate-700 hover:text-[#5A3E7A] border border-slate-200 hover:border-purple-200 shadow-xs flex items-center justify-center shrink-0 transition-all active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5A3E7A]/25"
                aria-label={lang === 'ar' ? 'تكبير وعرض بملء الشاشة' : 'Full screen expand'}
                title={lang === 'ar' ? 'عرض بملء الشاشة' : 'Expand full screen'}
              >
                <Maximize2 className="w-4.5 h-4.5 stroke-[2]" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Specifications & Actions */}
          <div className="md:col-span-6 p-4 sm:p-6 md:py-5 md:pe-5 md:ps-0 lg:py-6 lg:pe-6 flex flex-col justify-between space-y-6">
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

        {/* 5-PILLAR LUXE PRO ACCORDION SYSTEM & CONTEXT-AWARE COMPARISON MATRIX */}
        <PdpInfoAccordions
          lang={lang}
          product={product}
          productKind={productKind}
          storeName={activeData.storeName[lang]}
          contextCopy={contextCopy}
          pipeSpecs={pipeSpecs}
          openAccordions={openAccordions}
          toggleAccordion={toggleAccordion}
          onWhatsAppOrder={handleWhatsAppOrder}
          onOpenReviewModal={() => setIsReviewModalOpen(true)}
        />

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
      <PdpFullscreenLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        lang={lang}
        isRtl={isRtl}
        productName={product.name[lang]}
        images={finalImages}
        selectedImgIndex={selectedImgIndex}
        setSelectedImgIndex={setSelectedImgIndex}
      />
    </div>
  );
};
