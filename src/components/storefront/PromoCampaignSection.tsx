import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Gem,
  Maximize2,
  Plus,
  ShoppingBag,
} from 'lucide-react';
import type { PresetNiche, Product } from '../../data/siteConfig';
import type { ToastData } from '../../context/CommerceContext';
import type { ResolvedPromoSlide } from './PromoLightboxModal';

interface PromoCampaignSectionProps {
  lang: 'ar' | 'en';
  isRtl: boolean;
  promoBanner?: PresetNiche['promoBanner'];
  targetBundle: Product | undefined;
  promoSlides: ResolvedPromoSlide[];
  safePromoSlideIdx: number;
  setActivePromoSlide: React.Dispatch<React.SetStateAction<number>>;
  onOpenBundleModal: () => void;
  onOpenLightbox: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  showToast: (msgOrData: string | ToastData) => void;
  setIsCartOpen: (open: boolean) => void;
}

export const PromoCampaignSection: React.FC<PromoCampaignSectionProps> = ({
  lang,
  isRtl,
  promoBanner,
  targetBundle,
  promoSlides,
  safePromoSlideIdx,
  setActivePromoSlide,
  onOpenBundleModal,
  onOpenLightbox,
  addToCart,
  showToast,
  setIsCartOpen,
}) => {
  const currentPromoSlide = promoSlides[safePromoSlideIdx] || promoSlides[0];
  if (!currentPromoSlide) return null;

  return (
    <section id="campaign-section" className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950 via-[#5A3E7A] to-pink-950 text-white p-4 sm:p-8 lg:p-10 shadow-2xl border border-purple-800/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center">
          {/* Copy & CTA Column */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-4 text-start">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-pink-200 border border-white/20">
              <Gem className="w-3.5 h-3.5 text-amber-300" />
              {promoBanner?.badge ? promoBanner.badge[lang] : lang === 'ar' ? 'عرض خاص' : 'Special Offer'}
            </span>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-relaxed tracking-tight text-white">
              {promoBanner?.title
                ? promoBanner.title[lang]
                : lang === 'ar'
                  ? 'وفّري 25% على بوكس العناية الكامل'
                  : 'Save 25% on the Complete Care Box'}
            </h3>

            <p className="text-xs sm:text-sm lg:text-base text-purple-100/90 leading-relaxed max-w-xl">
              {promoBanner?.subtitle
                ? promoBanner.subtitle[lang]
                : lang === 'ar'
                  ? 'مع حقيبة مخملية وعينات مجانية وتوصيل سريع.'
                  : 'Includes a velvet pouch, free samples & fast shipping.'}
            </p>

            {/* Unified Single-Row Smart Glassmorphic Dual-CTA Capsule */}
            <div className="pt-0.5 w-full sm:w-auto sm:inline-block">
              <div className="grid grid-cols-2 items-center gap-1 p-1 rounded-2xl bg-white/12 backdrop-blur-md border border-white/20 shadow-lg w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (!targetBundle) {
                      showToast(
                        isRtl
                          ? 'لا توجد باقات متاحة في الكتالوج حالياً'
                          : 'No bundles are currently available in catalog'
                      );
                      return;
                    }
                    onOpenBundleModal();
                  }}
                  className="h-11 px-1.5 sm:px-4 bg-white text-[#5A3E7A] hover:bg-purple-50 font-extrabold rounded-xl text-[11px] sm:text-sm shadow-sm active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                >
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5A3E7A] shrink-0" aria-hidden="true" />
                  <span>{promoBanner?.ctaText?.[lang] || (lang === 'ar' ? 'اطلبي البوكس' : 'Order Box')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!targetBundle) {
                      showToast(
                        isRtl
                          ? 'لا توجد باقات متاحة في الكتالوج حالياً'
                          : 'No bundles are currently available in catalog'
                      );
                      return;
                    }
                    addToCart(targetBundle, 1);
                    showToast({
                      message: isRtl ? 'تمت إضافة البوكس إلى السلة.' : 'Bundle added to bag.',
                      type: 'cart_add',
                    });
                    setIsCartOpen(true);
                  }}
                  className="h-11 px-1.5 sm:px-4 bg-purple-950/35 hover:bg-purple-950/60 text-white font-extrabold rounded-xl text-[11px] sm:text-sm active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-200 shrink-0" aria-hidden="true" />
                  <span>
                    {promoBanner?.secondaryCtaText?.[lang] || (isRtl ? 'أضيفي للسلة' : 'Add to Bag')}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Enriched & Clean Hero Showcase Column */}
          <div className="lg:col-span-6 space-y-2.5 sm:space-y-3.5">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 w-full h-[290px] sm:h-[370px] lg:h-[460px] group bg-purple-950/70 transition-all duration-300 select-none">
              <img
                src={currentPromoSlide.image}
                alt={currentPromoSlide.title}
                className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm text-start space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug min-w-0">
                  {currentPromoSlide.title}
                </h4>

                <button
                  type="button"
                  onClick={onOpenLightbox}
                  className="p-2 sm:p-2.5 bg-purple-950/80 hover:bg-purple-900 active:bg-purple-950 text-white hover:text-amber-300 rounded-xl border border-white/20 transition-all hover:scale-105 active:scale-95 w-10 h-10 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center cursor-pointer shadow-sm group"
                  title={isRtl ? 'توسيع وعرض بالحجم الكامل' : 'Full Screen Expand'}
                  aria-label={isRtl ? 'توسيع وعرض بالحجم الكامل' : 'Full Screen Expand'}
                >
                  <Maximize2 className="w-4 h-4 text-white group-hover:text-amber-300 transition-colors" />
                </button>
              </div>

              <div className="pt-2.5 border-t border-white/10 flex items-center justify-center gap-2.5 sm:gap-4 w-full">
                <button
                  type="button"
                  onClick={() =>
                    setActivePromoSlide((prev) => (prev === 0 ? promoSlides.length - 1 : prev - 1))
                  }
                  className="py-2.5 px-3.5 sm:px-5 bg-purple-950/80 hover:bg-purple-900 active:bg-purple-950 text-white rounded-xl border border-white/20 transition-all hover:scale-105 active:scale-95 min-h-[44px] flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  aria-label={isRtl ? 'الشريحة السابقة' : 'Previous slide'}
                  title={isRtl ? 'الشريحة السابقة' : 'Previous slide'}
                >
                  {isRtl ? (
                    <ChevronRight className="w-5 h-5 text-white" />
                  ) : (
                    <ChevronLeft className="w-5 h-5 text-white" />
                  )}
                  <span className="text-xs font-semibold">{isRtl ? 'السابق' : 'Prev'}</span>
                </button>

                <span className="text-xs sm:text-sm font-bold text-white bg-black/50 px-4 sm:px-6 py-2.5 rounded-xl border border-white/15 min-w-[70px] sm:min-w-[80px] text-center shadow-inner tracking-wider">
                  {safePromoSlideIdx + 1} / {promoSlides.length}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setActivePromoSlide((prev) => (prev === promoSlides.length - 1 ? 0 : prev + 1))
                  }
                  className="py-2.5 px-3.5 sm:px-5 bg-purple-950/80 hover:bg-purple-900 active:bg-purple-950 text-white rounded-xl border border-white/20 transition-all hover:scale-105 active:scale-95 min-h-[44px] flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  aria-label={isRtl ? 'الشريحة التالية' : 'Next slide'}
                  title={isRtl ? 'الشريحة التالية' : 'Next slide'}
                >
                  <span className="text-xs font-semibold">{isRtl ? 'التالي' : 'Next'}</span>
                  {isRtl ? (
                    <ChevronLeft className="w-5 h-5 text-white" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-1">
              {promoSlides.map((slide, idx) => {
                const isActive = safePromoSlideIdx === idx;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActivePromoSlide(idx)}
                    aria-label={slide.title}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer group ${
                      isActive
                        ? 'border-amber-400 ring-2 ring-amber-400/50 scale-[1.03] shadow-lg'
                        : 'border-white/20 hover:border-white/50 opacity-75 hover:opacity-100'
                    }`}
                    title={slide.title}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {isActive && (
                      <div className="absolute top-1.5 end-1.5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-purple-950" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
