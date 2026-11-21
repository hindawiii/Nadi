import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowDownLeft, ArrowDownRight } from 'lucide-react';
import heroSkincareImg from '../assets/images/hero_skincare_editorial_1795169035349.webp';
import heroHaircareImg from '../assets/images/hero_haircare_editorial_1795169032685.webp';
import heroBundlesImg from '../assets/images/hero_bundles_editorial_1795169033537.webp';
import {
  buildEditorialHeroSlides,
  EditorialCollectionId,
  formatHeroSlideNumber,
  resolveEditorialHeroCta,
} from '../lib/editorialHeroSlides';
import type { EditorialHeroSlideConfig } from '../data/storeContentDefaults';
import { handleImageLoadError } from '../lib/imageResilience';

export interface EditorialHeroProps {
  lang: 'ar' | 'en';
  activePresetId: string;
  slogan: { ar: string; en: string };
  title: { ar: string; en: string };
  subtitle?: { ar: string; en: string };
  ctaPrimary: { ar: string; en: string };
  ctaSecondary: { ar: string; en: string };
  customHeroImage?: string;
  customSlides?: EditorialHeroSlideConfig[];
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
  onSelectCollection?: (collectionId: EditorialCollectionId) => void;
}

const AUTOPLAY_INTERVAL_MS = 6500;
const SWIPE_THRESHOLD_PX = 42;

export const EditorialHero: React.FC<EditorialHeroProps> = ({
  lang,
  activePresetId,
  slogan,
  title,
  ctaPrimary,
  ctaSecondary,
  customHeroImage,
  customSlides,
  onPrimaryAction,
  onSecondaryAction,
  onSelectCollection,
}) => {
  const isRtl = lang === 'ar';
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const slides = useMemo(
    () =>
      buildEditorialHeroSlides({
        activePresetId,
        customHeroImage,
        customSlides,
        storeTitle: title,
        assets: {
          skincare: heroSkincareImg,
          haircare: heroHaircareImg,
          bundles: heroBundlesImg,
        },
      }),
    [activePresetId, customHeroImage, customSlides, title]
  );

  const primaryCta = useMemo(
    () => resolveEditorialHeroCta(ctaPrimary, 'primary', activePresetId),
    [ctaPrimary, activePresetId]
  );
  const secondaryCta = useMemo(
    () => resolveEditorialHeroCta(ctaSecondary, 'secondary', activePresetId),
    [ctaSecondary, activePresetId]
  );

  // Respect OS reduced-motion setting to disable autoplay and subtle scale drift
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);
    syncPreference();
    mediaQuery.addEventListener?.('change', syncPreference);
    return () => mediaQuery.removeEventListener?.('change', syncPreference);
  }, []);

  // Keep slide index within bounds when switching presets
  useEffect(() => {
    if (activeSlideIndex >= slides.length) {
      setActiveSlideIndex(0);
    }
  }, [activeSlideIndex, slides.length]);

  // Gentle editorial crossfade rotation across the 3 store-section photographs
  useEffect(() => {
    if (slides.length <= 1 || isPaused || prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [slides.length, isPaused, prefersReducedMotion]);

  const activeSlide = slides[activeSlideIndex] || slides[0];
  const totalLabel = formatHeroSlideNumber(slides.length - 1);

  const goToNext = () => setActiveSlideIndex((prev) => (prev + 1) % slides.length);
  const goToPrev = () => setActiveSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);

  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    setIsPaused(false);
    if (!start || slides.length <= 1) return;

    const touch = e.changedTouches[0];
    if (!touch) return;

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) <= Math.abs(dy)) return;

    // Directional swipe matching RTL/LTR reading flow
    if (isRtl) {
      if (dx > 0) goToNext();
      else goToPrev();
    } else {
      if (dx < 0) goToNext();
      else goToPrev();
    }
  };

  const handleCollectionJump = () => {
    if (activeSlide?.collectionId && onSelectCollection) {
      onSelectCollection(activeSlide.collectionId);
      return;
    }
    onPrimaryAction();
  };

  return (
    <section
      aria-label={isRtl ? 'واجهة متجر نَدِي الرئيسية' : 'NADI Featured Editorial Showcase'}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full overflow-hidden bg-slate-950 text-white min-h-[60svh] sm:min-h-[68vh] lg:min-h-[74vh] max-h-[760px] flex flex-col justify-end select-none !mb-0"
    >
      {/* Full-Bleed Editorial Photography Layer (Local Bundled Assets — 1 Per Store Section) */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {slides.map((slide, idx) => {
          const isCurrent = idx === activeSlideIndex;
          return (
            <img
              key={slide.id}
              src={slide.image}
              alt={slide.alt[lang]}
              loading={idx === 0 ? 'eager' : 'lazy'}
              decoding="async"
              referrerPolicy="no-referrer"
              onError={(e) => handleImageLoadError(e.currentTarget, idx === 0 ? heroSkincareImg : undefined)}
              className={`absolute inset-0 w-full h-full object-cover brightness-[1.1] contrast-[1.04] ${slide.objectPosition} ${
                prefersReducedMotion
                  ? 'transition-opacity duration-300'
                  : 'transition-[opacity,transform] duration-700 ease-out'
              } ${
                isCurrent
                  ? 'opacity-100 scale-100 z-10'
                  : `opacity-0 ${prefersReducedMotion ? 'scale-100' : 'scale-[1.03]'} z-0 pointer-events-none`
              }`}
            />
          );
        })}

        {/* Single lower-anchored contrast scrim keeping upper 60% of photography bright and crystal-clear */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950/78 via-slate-950/24 via-42% to-transparent" />
      </div>

      {/* Compact Editorial Foreground Copy & Slim Squircle Action Capsule */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-16 sm:pt-24 pb-2.5 sm:pb-4 text-start">
        <div className="max-w-xl space-y-1.5 sm:space-y-2">
          {/* Quiet unboxed kicker */}
          <p className="text-xs sm:text-sm font-semibold tracking-wide text-purple-100/95 leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]">
            {slogan[lang]}
          </p>

          {/* Fluid Display Headline (clamp-scaled smoothly across mobile, tablet, and desktop) */}
          <h1 className="text-fluid-hero font-extrabold text-white tracking-tight leading-[1.22] font-brand-ar text-balance drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)]">
            {title[lang]}
          </h1>

          {/* Slim Squircle Action Capsule (Mirrors "Our Collections" rounded-2xl / rounded-xl geometry) */}
          <div className="pt-1.5 sm:pt-2">
            <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-slate-950/45 backdrop-blur-xl border border-white/25 shadow-[0_10px_28px_rgba(0,0,0,0.34)] max-w-full">
              <button
                type="button"
                onClick={onPrimaryAction}
                className="h-9 sm:h-10 px-4 sm:px-5 bg-white hover:bg-purple-50 active:scale-[0.98] text-slate-950 font-extrabold rounded-xl text-xs sm:text-[13px] shadow-xs transition-all duration-200 inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <span>{primaryCta[lang]}</span>
                {isRtl ? (
                  <ArrowLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                )}
              </button>

              <button
                type="button"
                onClick={onSecondaryAction}
                className="h-9 sm:h-10 px-3.5 sm:px-4 bg-transparent hover:bg-white/15 active:scale-[0.98] text-white/95 hover:text-white font-bold rounded-xl text-xs sm:text-[13px] transition-all duration-200 inline-flex items-center justify-center cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <span>{secondaryCta[lang]}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Single-Row Bottom Editorial Slide Rail (01 — 03) + Direct Section Jump */}
        {slides.length > 1 && (
          <div className="mt-2.5 sm:mt-4 pt-1 sm:pt-1.5 border-t border-white/15 flex items-center justify-between gap-2 flex-nowrap">
            {/* Numeric Counter & Minimalist Hairline Progress Indicators */}
            <div
              className="flex items-center gap-2 sm:gap-3 shrink-0"
              role="tablist"
              aria-label={isRtl ? 'شرائح أقسام المتجر' : 'Store section slides'}
            >
              <span className="text-[11px] sm:text-xs font-semibold tracking-widest text-white/95 tabular-nums">
                {activeSlide.indexLabel}
              </span>

              <div className="flex items-center gap-1.5">
                {slides.map((slide, idx) => {
                  const isCurrent = idx === activeSlideIndex;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      role="tab"
                      aria-selected={isCurrent}
                      aria-label={`${slide.indexLabel} — ${slide.sectionLabel[lang]}`}
                      onClick={() => setActiveSlideIndex(idx)}
                      className="min-h-[44px] py-3 px-0.5 flex items-center cursor-pointer group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/80 rounded"
                    >
                      <span
                        className={`block h-[2px] rounded-full transition-all duration-300 ${
                          isCurrent
                            ? 'w-7 sm:w-12 bg-white'
                            : 'w-4 sm:w-8 bg-white/30 group-hover:bg-white/60'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <span className="text-[11px] sm:text-xs font-medium tracking-widest text-white/55 tabular-nums">
                {totalLabel}
              </span>
            </div>

            {/* Active Section Quick-Jump Link */}
            <button
              type="button"
              onClick={handleCollectionJump}
              className="min-h-[44px] ps-2 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white/90 hover:text-white transition-colors cursor-pointer group whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/80 rounded-lg"
            >
              <span>{activeSlide.sectionLabel[lang]}</span>
              {isRtl ? (
                <ArrowDownLeft
                  className="w-3.5 h-3.5 text-white/75 group-hover:text-white transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:translate-y-0.5 shrink-0"
                  aria-hidden="true"
                />
              ) : (
                <ArrowDownRight
                  className="w-3.5 h-3.5 text-white/75 group-hover:text-white transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5 shrink-0"
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
