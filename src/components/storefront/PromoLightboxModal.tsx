import React, { useEffect } from 'react';
import { BadgeCheck, ChevronLeft, ChevronRight, ShoppingBag, X } from 'lucide-react';

export interface ResolvedPromoSlide {
  id: string;
  image: string;
  badge: string;
  title: string;
  desc: string;
}

interface PromoLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRtl: boolean;
  slides: ResolvedPromoSlide[];
  activeSlideIdx: number;
  setActiveSlideIdx: React.Dispatch<React.SetStateAction<number>>;
  onOrderBundle: () => void;
}

export const PromoLightboxModal: React.FC<PromoLightboxModalProps> = ({
  isOpen,
  onClose,
  isRtl,
  slides,
  activeSlideIdx,
  setActiveSlideIdx,
  onOrderBundle,
}) => {
  useEffect(() => {
    if (!isOpen || slides.length === 0) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        setActiveSlideIdx((prev) =>
          isRtl
            ? prev === slides.length - 1
              ? 0
              : prev + 1
            : prev === 0
              ? slides.length - 1
              : prev - 1
        );
      } else if (e.key === 'ArrowRight') {
        setActiveSlideIdx((prev) =>
          isRtl
            ? prev === 0
              ? slides.length - 1
              : prev - 1
            : prev === slides.length - 1
              ? 0
              : prev + 1
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isRtl, slides.length, onClose, setActiveSlideIdx]);

  if (!isOpen || slides.length === 0) return null;

  const safeIdx = activeSlideIdx % slides.length;
  const currentSlide = slides[safeIdx] || slides[0];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div
        className="w-full flex items-center justify-between z-30 max-w-5xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-amber-300 border border-white/20">
            <BadgeCheck className="w-3.5 h-3.5 text-amber-300" />
            {currentSlide.badge}
          </span>
          <span className="text-xs font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/15">
            {safeIdx + 1} / {slides.length}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 bg-white/15 hover:bg-white/25 text-white rounded-full transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center border border-white/20 hover:scale-105"
          aria-label="Close Lightbox"
          title={isRtl ? 'إغلاق المعاينة' : 'Close Preview'}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Center Area */}
      <div
        className="relative w-full max-w-5xl mx-auto flex-1 flex items-center justify-center px-2 sm:px-12 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActiveSlideIdx((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
          }}
          className="absolute start-0 sm:start-2 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 bg-white/20 hover:bg-white/35 active:bg-white/40 text-white rounded-full backdrop-blur-xl border-2 border-white/60 transition-all hover:scale-110 active:scale-95 shadow-[0_0_25px_rgba(255,255,255,0.3)] min-w-[48px] sm:min-w-[54px] min-h-[48px] sm:min-h-[54px] flex items-center justify-center cursor-pointer z-30 group"
          aria-label={isRtl ? 'الصورة السابقة' : 'Previous image'}
          title={isRtl ? 'الصورة السابقة' : 'Previous image'}
        >
          {isRtl ? (
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.5] group-hover:scale-110 transition-transform drop-shadow" />
          ) : (
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.5] group-hover:scale-110 transition-transform drop-shadow" />
          )}
        </button>

        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/20 max-h-[55vh] sm:max-h-[62vh] bg-slate-950 flex items-center justify-center">
          <img
            key={currentSlide.id}
            src={currentSlide.image}
            alt={currentSlide.title}
            className="max-h-[55vh] sm:max-h-[62vh] w-auto max-w-full object-contain mx-auto animate-in fade-in zoom-in-95 duration-200"
          />
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActiveSlideIdx((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
          }}
          className="absolute end-0 sm:end-2 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 bg-white/20 hover:bg-white/35 active:bg-white/40 text-white rounded-full backdrop-blur-xl border-2 border-white/60 transition-all hover:scale-110 active:scale-95 shadow-[0_0_25px_rgba(255,255,255,0.3)] min-w-[48px] sm:min-w-[54px] min-h-[48px] sm:min-h-[54px] flex items-center justify-center cursor-pointer z-30 group"
          aria-label={isRtl ? 'الصورة التالية' : 'Next image'}
          title={isRtl ? 'الصورة التالية' : 'Next image'}
        >
          {isRtl ? (
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.5] group-hover:scale-110 transition-transform drop-shadow" />
          ) : (
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.5] group-hover:scale-110 transition-transform drop-shadow" />
          )}
        </button>
      </div>

      {/* Bottom Area */}
      <div
        className="w-full max-w-2xl mx-auto flex flex-col items-center gap-3 text-center text-white z-30 pt-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1 px-4">
          <h4 className="text-sm sm:text-base font-extrabold text-white">{currentSlide.title}</h4>
          {currentSlide.desc && (
            <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed max-w-lg line-clamp-2">
              {currentSlide.desc}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          {slides.map((slide, idx) => {
            const isActive = safeIdx === idx;
            return (
              <button
                key={slide.id}
                onClick={() => setActiveSlideIdx(idx)}
                className={`relative rounded-lg overflow-hidden w-12 h-12 sm:w-14 sm:h-14 border-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105'
                    : 'border-white/20 hover:border-white/50 opacity-60 hover:opacity-100'
                }`}
                title={slide.title}
              >
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>

        <div className="pt-1 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={onOrderBundle}
            className="h-10 sm:h-11 px-5 bg-[#5A3E7A] hover:bg-[#483162] text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            <span>{isRtl ? 'اطلبي هذا البوكس الآن (خصم 25%)' : 'Order This Bundle (-25%)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
