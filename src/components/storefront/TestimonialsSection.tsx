import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageSquarePlus,
  Quote,
  ShoppingBag,
} from 'lucide-react';
import type { Product } from '../../data/siteConfig';
import type { ClonedSectionConfig } from '../../context/CommerceContext';
import {
  DEFAULT_NADI_TESTIMONIALS,
  getReviewerInitial,
  normalizeTestimonialList,
} from '../../lib/testimonialSanitizer';

interface TestimonialsSectionProps {
  lang: 'ar' | 'en';
  isRtl: boolean;
  activePresetId: 'cosmetics' | 'fashion' | 'eyewear' | 'electronics';
  testimonials?: any[];
  products: Product[];
  clonedTestimonialConfig?: ClonedSectionConfig;
  openProductPDP: (product: Product) => void;
  onOpenReviewModal: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  lang,
  isRtl,
  activePresetId,
  testimonials,
  products,
  clonedTestimonialConfig,
  openProductPDP,
  onOpenReviewModal,
}) => {
  const [reviewSlide, setReviewSlide] = useState<number>(0);
  const reviewTouchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const rawTestimonials =
    testimonials && testimonials.length > 0 ? testimonials : DEFAULT_NADI_TESTIMONIALS;
  const approvedTestimonials = rawTestimonials.filter(
    (t: any) => t.status === 'approved' || !t.status
  );
  const effectiveTestimonials = normalizeTestimonialList(
    approvedTestimonials.length > 0 ? approvedTestimonials : rawTestimonials,
    activePresetId
  );

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-3.5 sm:space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2.5 sm:pb-3">
          <div className="space-y-0.5 sm:space-y-1 text-start">
            <h2 className="text-fluid-h2 font-black text-slate-900 font-brand-ar tracking-tight">
              {lang === 'ar' ? 'آراء عميلاتنا' : 'Customer Reviews'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              {lang === 'ar'
                ? 'تجارب موثّقة من عميلات نَـدِي'
                : 'Verified experiences from NADI clients'}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenReviewModal}
            className="shrink-0 h-10 sm:h-11 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-[#5A3E7A] via-[#8B5478] to-[#C67D2E] hover:from-[#4C3368] hover:via-[#7A4768] hover:to-[#B26E24] text-white font-extrabold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 sm:gap-2 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A3E7A] focus-visible:ring-offset-2"
          >
            <MessageSquarePlus className="w-4 h-4 text-white shrink-0" aria-hidden="true" />
            <span>{lang === 'ar' ? '+ شاركينا' : '+ Share'}</span>
          </button>
        </div>

        {/* Smart Luxury Testimonial Cards Carousel: Touch-Swipe enabled + Prev/Next Arrows */}
        <div
          className="relative touch-pan-y select-none"
          onTouchStart={(e) => {
            if (effectiveTestimonials.length <= 1) return;
            const touch = e.touches[0];
            reviewTouchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
          }}
          onTouchEnd={(e) => {
            const start = reviewTouchStartRef.current;
            reviewTouchStartRef.current = null;
            if (!start || effectiveTestimonials.length <= 1) return;
            const touch = e.changedTouches[0];
            const diffX = touch.clientX - start.x;
            const diffY = touch.clientY - start.y;
            const elapsed = Date.now() - start.time;

            if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY) * 1.2 && elapsed < 900) {
              const goNext = isRtl ? diffX > 0 : diffX < 0;
              setReviewSlide((prev) =>
                goNext
                  ? (prev + 1) % effectiveTestimonials.length
                  : (prev - 1 + effectiveTestimonials.length) % effectiveTestimonials.length
              );
            }
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              effectiveTestimonials[reviewSlide % effectiveTestimonials.length],
              effectiveTestimonials[(reviewSlide + 1) % effectiveTestimonials.length],
            ]
              .filter(Boolean)
              .map((review, idx) => {
                const reviewerInitial = getReviewerInitial(review.name[lang]);

                return (
                  <div
                    key={`${review.id}-${idx}`}
                    className={`bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between gap-4 relative overflow-hidden group ${
                      idx === 1 ? 'hidden sm:flex' : 'flex'
                    }`}
                  >
                    <div
                      className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-amber-400 to-rose-400"
                      aria-hidden="true"
                    />

                    <div className="space-y-3.5 text-start">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-[#5A3E7A] border border-purple-200/80 text-xs font-black tabular-nums">
                          <BadgeCheck className="w-3.5 h-3.5 text-[#5A3E7A]" aria-hidden="true" />
                          <span>{Number(review.rating || 5).toFixed(1)} / 5</span>
                        </span>

                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/90">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                          <span>{review.badge[lang]}</span>
                        </span>
                      </div>

                      <div className="relative pt-1">
                        <Quote
                          className="w-7 h-7 text-purple-100 absolute -top-2 -start-1.5 -z-0 opacity-80"
                          aria-hidden="true"
                        />
                        <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium relative z-10">
                          «{review.comment[lang]}»
                        </p>
                      </div>

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            const targetProd =
                              products.find((p) => p.id === review.purchasedProduct.id) || products[0];
                            if (targetProd) openProductPDP(targetProd);
                          }}
                          className="inline-flex items-center gap-2 px-3 py-1.5 min-h-[38px] rounded-xl bg-purple-50/80 hover:bg-purple-100 text-[#5A3E7A] text-xs font-extrabold transition-colors border border-purple-200/60 group/btn cursor-pointer"
                          title={lang === 'ar' ? 'عرض هذا المنتج' : 'View Product'}
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-[#5A3E7A] shrink-0" aria-hidden="true" />
                          <span className="underline decoration-purple-300 group-hover/btn:decoration-[#5A3E7A]">
                            {review.purchasedProduct[lang]}
                          </span>
                          {isRtl ? (
                            <ArrowLeft className="w-3 h-3 ms-0.5 shrink-0" aria-hidden="true" />
                          ) : (
                            <ArrowRight className="w-3 h-3 ms-0.5 shrink-0" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3 text-start">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          aria-hidden="true"
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5A3E7A] to-[#8B5478] text-white font-extrabold text-sm flex items-center justify-center ring-2 ring-purple-100 shadow-2xs shrink-0"
                        >
                          {reviewerInitial}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug truncate">
                            {review.name[lang]}
                          </h4>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
                            <span className="truncate">{review.city[lang]}</span>
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                        {review.date[lang]}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="mt-4 sm:mt-5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {effectiveTestimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setReviewSlide(i)}
                  className={`transition-all rounded-full ${
                    reviewSlide % effectiveTestimonials.length === i
                      ? 'w-7 h-2 bg-[#5A3E7A]'
                      : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setReviewSlide((prev) => (prev - 1 + effectiveTestimonials.length) % effectiveTestimonials.length)
                }
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-xs transition-colors min-h-[40px] min-w-[40px]"
                aria-label="Previous review"
              >
                {isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setReviewSlide((prev) => (prev + 1) % effectiveTestimonials.length)}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-xs transition-colors min-h-[40px] min-w-[40px]"
                aria-label="Next review"
              >
                {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {clonedTestimonialConfig?.isCloned && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-3.5 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-purple-200/60 pb-4">
            <div className="space-y-1.5 text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-900 text-xs font-bold">
                <Award className="w-3.5 h-3.5 text-purple-700" />
                <span>
                  {(
                    clonedTestimonialConfig.badgeAr ||
                    (lang === 'ar' ? 'تجارب إضافية موثقة' : 'Additional Highlights')
                  ).replace(/\s*[\u2728\u2B50\u{1F31F}\u2605\u2726]/gu, '')}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-brand-ar">
                {lang === 'ar'
                  ? clonedTestimonialConfig.titleAr || 'قصص نجاح وتجارب عميلاتنا الإضافية'
                  : clonedTestimonialConfig.titleEn || 'Additional Verified Testimonials'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {lang === 'ar'
                  ? clonedTestimonialConfig.subtitleAr || 'مجموعة إضافية من آراء وتجارب عميلاتنا الموثقة مع منتجاتنا الأصلية'
                  : clonedTestimonialConfig.subtitleEn || 'Curated secondary insights from our happy community'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {effectiveTestimonials.slice(0, 2).map((review) => (
              <div
                key={`cloned-review-${review.id}`}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 text-start relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-[#5A3E7A] border border-purple-200/80 text-xs font-black">
                      <BadgeCheck className="w-3.5 h-3.5 text-[#5A3E7A]" />
                      <span>{Number((review as any).rating || 5).toFixed(1)} / 5</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
                      {review.badge[lang]}
                    </span>
                  </div>

                  <div className="relative">
                    <Quote className="w-8 h-8 text-purple-100 absolute -top-3 -start-2 -z-0 opacity-80" />
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium relative z-10 italic">
                      "{review.comment[lang]}"
                    </p>
                  </div>

                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-900 text-xs font-bold border border-purple-200">
                      <ShoppingBag className="w-3.5 h-3.5 text-purple-600" />
                      <span>{lang === 'ar' ? 'المنتج المقتنى:' : 'Purchased:'}</span>
                      <span className="font-extrabold">{review.purchasedProduct[lang]}</span>
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-purple-100 flex items-center justify-between text-start">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.avatar}
                      alt={review.name[lang]}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-100 shadow-2xs"
                    />
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                        {review.name[lang]}
                      </h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{review.city[lang]}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{review.date[lang]}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};
