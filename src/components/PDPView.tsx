import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, ArrowRight, Star, ShoppingBag, Heart, MessageCircle, 
  Sparkles, ShieldCheck, Truck, RotateCcw, AlertCircle, 
  Clock, Plus, Check, Share2, Layers 
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { Product } from '../data/siteConfig';

export const PDPView: React.FC = () => {
  const { 
    lang, convertPrice, addToCart, wishlist, toggleWishlist, 
    activeProduct, setCurrentRoute, activeData, showToast, navigateTo 
  } = useCommerce();

  const isRtl = lang === 'ar';
  const product = activeProduct;

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'usage' | 'specs' | 'reviews'>('desc');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  // Touch swipe gesture tracker
  const touchSwipeRef = useRef<{ startX: number; startY: number; time: number }>({ startX: 0, startY: 0, time: 0 });

  // Countdown timer for deals
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 18, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!product) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto px-4">
        <p className="text-slate-500 mb-4">{lang === 'ar' ? 'لم يتم العثور على المنتج المطلوب' : 'Product not found'}</p>
        <button
          onClick={() => setCurrentRoute('store')}
          className="bg-[#5A3E7A] text-white px-6 py-2.5 rounded-full font-bold"
        >
          {lang === 'ar' ? 'العودة للمتجر' : 'Return to store'}
        </button>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const currentPrice = convertPrice(product.basePriceUSD * quantity);
  const unitPrice = convertPrice(product.basePriceUSD);
  const origPrice = product.originalPriceUSD ? convertPrice(product.originalPriceUSD * quantity) : null;
  const isOutOfStock = product.stock === 0;

  // Touch gesture & pinch-to-zoom state
  const [touchScale, setTouchScale] = useState(1);
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  const [lastTap, setLastTap] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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
    if (touchScale <= 1 && product && product.images.length > 1 && e.changedTouches.length === 1) {
      const diffX = e.changedTouches[0].clientX - touchSwipeRef.current.startX;
      const diffY = e.changedTouches[0].clientY - touchSwipeRef.current.startY;
      const timeTaken = Date.now() - touchSwipeRef.current.time;

      if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY) && timeTaken < 800) {
        if (diffX < 0) {
          // Swipe Left -> Next Image
          setSelectedImgIndex(prev => (prev === product.images.length - 1 ? 0 : prev + 1));
        } else {
          // Swipe Right -> Previous Image
          setSelectedImgIndex(prev => (prev === 0 ? product.images.length - 1 : prev - 1));
        }
      }
    }
  };

  // WhatsApp personalized message
  const handleWhatsAppOrder = () => {
    const phone = activeData.contactInfo.whatsapp;
    const storeUrl = window.location.href;
    const message = lang === 'ar'
      ? `مرحباً ${activeData.storeName.ar}، أود الاستفسار وطلب هذا المنتج مباشرة:\n\n*المنتج:* ${product.name.ar}\n*الكمية:* ${quantity}\n*الإجمالي التقريبي:* ${currentPrice.text}\n*الرابط:* ${storeUrl}\n\nيرجى تأكيد التوافر وطريقة الدفع.`
      : `Hello ${activeData.storeName.en}, I want to order:\n\n*Product:* ${product.name.en}\n*Quantity:* ${quantity}\n*Total:* ${currentPrice.text}\n*Link:* ${storeUrl}\n\nPlease confirm availability and payment options.`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Bundle Add To Cart
  const handleAddBundle = () => {
    if (!product.bundle) return;
    addToCart(product);
    product.bundle.items.forEach(item => {
      // Create mock product item
      const bundleSubProduct: Product = {
        id: item.id,
        name: item.name,
        category: product.category,
        basePriceUSD: item.priceUSD * (1 - product.bundle!.discount / 100),
        stock: 5,
        rating: 4.9,
        reviewsCount: 30,
        images: [item.image],
        tabs: product.tabs
      };
      addToCart(bundleSubProduct);
    });
    showToast(lang === 'ar' ? 'تمت إضافة المجموعة كاملة للسلة بخصم 15%!' : 'Bundle added to bag with 15% discount!');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb & Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.location.hash) {
                window.history.pushState(null, '', window.location.pathname);
              }
              navigateTo('store');
            }}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#5A3E7A] transition-colors py-2.5 px-4 rounded-2xl bg-white border border-slate-200 shadow-xs min-h-[44px] hover:border-purple-200"
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
              className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 cursor-crosshair group touch-pan-y select-none"
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
                src={product.images[selectedImgIndex] || product.images[0]}
                alt={product.name[lang]}
                className="w-full h-full object-cover transition-transform duration-150 ease-out"
                style={{
                  transform: `scale(${isZoomed ? 1.5 : touchScale})`,
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                }}
              />
            </div>

            {/* Thumbnail Ribbons */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImgIndex === idx
                        ? 'border-[#5A3E7A] ring-2 ring-purple-200 scale-105'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Product Specifications & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Category and Rating */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold tracking-wider uppercase text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                  {product.category[lang]}
                </span>
                <div className="flex items-center gap-1.5 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-slate-800">{product.rating}</span>
                  <span className="text-xs text-slate-400">({product.reviewsCount} {lang === 'ar' ? 'تقييم موثق' : 'reviews'})</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {product.name[lang]}
              </h1>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {unitPrice.text}
                </span>
                {origPrice && (
                  <span className="text-base text-slate-400 line-through">
                    {origPrice.text}
                  </span>
                )}
                {product.discountPercentage && (
                  <span className="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {lang === 'ar' ? `وفر ${product.discountPercentage}%` : `Save ${product.discountPercentage}%`}
                  </span>
                )}
              </div>

              {/* Urgency & Scarcity Countdown Strip */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="font-bold">
                    {lang === 'ar' ? 'ينتهي العرض الترويجي خلال:' : 'Special deal expires in:'}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-mono font-bold text-sm bg-white px-2.5 py-1 rounded-lg border border-amber-200 text-amber-950">
                  <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
                  <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
                  <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                </div>
              </div>

              {/* Stock status indicator */}
              <div className="text-xs font-semibold">
                {product.stock > 0 ? (
                  <span className="text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {lang === 'ar' ? `متوفر في المخزون (${product.stock} قطع متبقية)` : `In Stock (${product.stock} items remaining)`}
                  </span>
                ) : (
                  <span className="text-rose-600 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    {lang === 'ar' ? 'نفد من المخزون حالياً – اطلبه مسبقاً عبر واتساب' : 'Currently Out of Stock – Pre-Order via WhatsApp'}
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="flex items-center gap-4 pt-2">
                  <span className="text-xs font-bold text-slate-700">{lang === 'ar' ? 'الكمية:' : 'Quantity:'}</span>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 hover:bg-slate-200 transition-colors font-bold text-slate-700 min-w-[36px]"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 font-bold text-sm text-slate-900 bg-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-1.5 hover:bg-slate-200 transition-colors font-bold text-slate-700 min-w-[36px]"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Primary Call to Action Buttons */}
              <div className="space-y-3 pt-3">
                <button
                  onClick={() => {
                    if (isOutOfStock) {
                      handleWhatsAppOrder();
                    } else {
                      addToCart(product, quantity);
                    }
                  }}
                  className={`w-full py-3.5 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 text-base transition-all shadow-md min-h-[48px] ${
                    isOutOfStock
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-[#5A3E7A] hover:bg-[#483162] text-white hover:shadow-lg'
                  }`}
                >
                  {isOutOfStock ? (
                    <>
                      <MessageCircle className="w-5 h-5" />
                      <span>{lang === 'ar' ? 'حجز مسبق فوري عبر واتساب' : 'Instant Pre-Order on WhatsApp'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>{lang === 'ar' ? `إضافة للسلة (${currentPrice.text})` : `Add to Bag (${currentPrice.text})`}</span>
                    </>
                  )}
                </button>

                {/* Direct Smart WhatsApp Ordering Button */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3 px-6 rounded-2xl font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-all flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-600" />
                  <span>{lang === 'ar' ? 'اطلب بنقرة واحدة عبر واتساب (دفع عند الاستلام)' : 'One-Click Order via WhatsApp (COD)'}</span>
                </button>
              </div>

              {/* Value propositions icons list */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{lang === 'ar' ? 'أصلي ومضمون 100%' : '100% Guaranteed Authentic'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{lang === 'ar' ? 'شحن سريع لكافة المدن' : 'Fast Regional Dispatch'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>{lang === 'ar' ? 'استبدال واسترجاع ميسر' : 'Hassle-Free Returns'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{lang === 'ar' ? 'دعم فني واستشارة مجانية' : 'Free Beauty Consultation'}</span>
                </div>
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
                    ? `احصل على هذا المنتج مع المنتجات المكملة في بكج واحد ووفر ${product.bundle.discount}% فورياً عند الطلب الآن!`
                    : `Get this item along with complementary essentials in one package and save ${product.bundle.discount}% instantly!`}
                </p>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {/* Bundle Thumbnails */}
                <div className="flex items-center gap-2">
                  <img src={product.images[0]} alt="main" className="w-14 h-14 rounded-xl object-cover border border-purple-200" />
                  <span className="text-slate-400 font-bold">+</span>
                  {product.bundle.items.map((bItem) => (
                    <img key={bItem.id} src={bItem.image} alt={bItem.name[lang]} className="w-14 h-14 rounded-xl object-cover border border-purple-200" />
                  ))}
                </div>

                <button
                  onClick={handleAddBundle}
                  className="bg-purple-900 hover:bg-purple-800 text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-2xl shadow-md flex items-center gap-2 min-h-[44px] transition-all hover:scale-105"
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

        {/* INTERACTIVE TABS (Description, Usage, Ingredients/Specs, Reviews) */}
        <div className="mt-10 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 sm:gap-4 border-b border-slate-100 pb-4 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('desc')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all min-h-[44px] whitespace-nowrap ${
                activeTab === 'desc'
                  ? 'bg-[#5A3E7A] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {lang === 'ar' ? 'الوصف والتفاصيل' : 'Description'}
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all min-h-[44px] whitespace-nowrap ${
                activeTab === 'usage'
                  ? 'bg-[#5A3E7A] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {lang === 'ar' ? 'طريقة الاستخدام' : 'How to Use'}
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all min-h-[44px] whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'bg-[#5A3E7A] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {product.isTechSpecs
                ? (lang === 'ar' ? 'المواصفات الفنية' : 'Tech Specs')
                : (lang === 'ar' ? 'المكونات الفعالة' : 'Ingredients')}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all min-h-[44px] whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'bg-[#5A3E7A] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {lang === 'ar' ? `آراء العميلات (${product.reviewsCount})` : `Reviews (${product.reviewsCount})`}
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="pt-6 text-slate-700 leading-relaxed text-sm sm:text-base">
            {activeTab === 'desc' && (
              <div className="space-y-4">
                <p>{product.tabs.description[lang]}</p>
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                  <h4 className="font-bold text-[#5A3E7A] mb-2">{lang === 'ar' ? 'إرشادات الاستخدام الموصى بها:' : 'Recommended Application:'}</h4>
                  <p>{product.tabs.usage[lang]}</p>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div>
                {product.isTechSpecs && product.techSpecs ? (
                  /* Technical Specs Matrix for Electronics */
                  <div className="overflow-hidden border border-slate-200 rounded-2xl">
                    <table className="w-full text-start text-xs sm:text-sm">
                      <tbody>
                        {product.techSpecs.map((spec, i) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                            <td className="p-3.5 font-bold text-slate-900 w-1/3 border-b border-slate-100">
                              {spec.label[lang]}
                            </td>
                            <td className="p-3.5 text-slate-700 border-b border-slate-100">
                              {spec.value[lang]}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* Cosmetic botanical ingredients */
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <h4 className="font-bold text-emerald-800 mb-2">{lang === 'ar' ? 'تركيبة نقية ومختبرة مخبرياً:' : 'Pure Tested Formulation:'}</h4>
                    <p>{product.tabs.ingredientsOrSpecs?.[lang]}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <span className="text-2xl font-extrabold text-slate-900">{product.rating} / 5</span>
                    <p className="text-xs text-slate-500">{lang === 'ar' ? 'بناءً على تقييمات العملاء الموثقة' : 'Based on verified buyer reviews'}</p>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-600 italic">
                  "{product.tabs.reviews[lang]}"
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
