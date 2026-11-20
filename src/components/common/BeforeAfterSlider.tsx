import React, { useRef, useEffect, useCallback } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { NADI_LOCAL_IMAGE_FALLBACK, handleImageLoadError } from '../../lib/imageResilience';
import {
  resolveSliderGestureIntent,
  SliderGestureMode,
} from '../../lib/sliderGestureIntent';

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  lang: 'ar' | 'en';
  isRtl: boolean;
}

const FALLBACK_IMAGE = NADI_LOCAL_IMAGE_FALLBACK;

interface ActiveGestureState {
  pointerId: number;
  startX: number;
  startY: number;
  mode: SliderGestureMode;
}

/**
 * Isolated 60fps Before/After Comparison Slider with scroll-safe directional intent lock.
 * Uses `touch-pan-y` on the photo canvas so vertical page scrolling never stalls when passing
 * over the component on mobile, while direct grabs on the center handle (`touch-none`) or
 * intentional horizontal swipes glide smoothly at 60fps via refs + requestAnimationFrame.
 */
export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  lang,
  isRtl,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const clipLayerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef<number>(50);
  const gestureRef = useRef<ActiveGestureState | null>(null);
  const rafRef = useRef<number | null>(null);

  const resolvedAfter = afterImage || FALLBACK_IMAGE;
  const resolvedBefore = beforeImage || FALLBACK_IMAGE;
  const applySyntheticBeforeFilter =
    !beforeImage ||
    beforeImage === afterImage ||
    beforeImage.includes('1570172619644');

  const applyVisualPosition = useCallback(
    (pct: number) => {
      const clamped = Math.max(2, Math.min(98, pct));
      posRef.current = clamped;

      if (clipLayerRef.current) {
        clipLayerRef.current.style.clipPath = isRtl
          ? `inset(0 ${clamped}% 0 0)`
          : `inset(0 0 0 ${clamped}%)`;
      }
      if (dividerRef.current) {
        dividerRef.current.style.insetInlineStart = `${clamped}%`;
      }
      if (containerRef.current) {
        containerRef.current.setAttribute('aria-valuenow', String(Math.round(clamped)));
      }
    },
    [isRtl]
  );

  // Sync clipPath direction whenever language/RTL switches
  useEffect(() => {
    applyVisualPosition(posRef.current);
  }, [applyVisualPosition]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const scheduleFromClientX = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0) return;

      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const rawPct = (x / rect.width) * 100;
      const nextPct = isRtl ? 100 - rawPct : rawPct;

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => {
        applyVisualPosition(nextPct);
        rafRef.current = null;
      });
    },
    [applyVisualPosition, isRtl]
  );

  const capturePointerSafely = (el: HTMLDivElement, pointerId: number) => {
    try {
      if (!el.hasPointerCapture(pointerId)) {
        el.setPointerCapture(pointerId);
      }
    } catch {
      // Ignore pointer capture errors on synthetic events
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    const isDirectHandleGrab = Boolean(target?.closest('[data-slider-handle="true"]'));
    const isImmediateHorizontal = e.pointerType === 'mouse' || isDirectHandleGrab;

    gestureRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      mode: isImmediateHorizontal ? 'horizontal' : 'pending',
    };

    if (isImmediateHorizontal) {
      capturePointerSafely(e.currentTarget, e.pointerId);
      scheduleFromClientX(e.clientX);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== e.pointerId) return;

    if (gesture.mode === 'vertical') return;

    if (gesture.mode === 'pending') {
      const resolved = resolveSliderGestureIntent(
        e.clientX - gesture.startX,
        e.clientY - gesture.startY
      );
      if (resolved === 'pending') return;
      gesture.mode = resolved;

      if (resolved === 'vertical') {
        return;
      }

      capturePointerSafely(e.currentTarget, e.pointerId);
    }

    scheduleFromClientX(e.clientX);
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== e.pointerId) return;
    gestureRef.current = null;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore release errors
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      applyVisualPosition(posRef.current + (isRtl ? step : -step));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      applyVisualPosition(posRef.current + (isRtl ? -step : step));
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-3 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm">
      <div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-label={lang === 'ar' ? 'مقارنة قبل وبعد بالسحب' : 'Before and after comparison slider'}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={50}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onKeyDown={handleKeyDown}
        className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden select-none touch-pan-y bg-slate-100 shadow-inner border border-slate-200 cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-[#5A3E7A] focus:ring-offset-2"
      >
        {/* "After" Image (Background) */}
        <img
          src={resolvedAfter}
          alt={lang === 'ar' ? 'بعد الاستخدام' : 'After Skincare'}
          referrerPolicy="no-referrer"
          decoding="async"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none brightness-105 saturate-110"
          onError={(e) => handleImageLoadError(e.currentTarget)}
        />
        <span className="absolute top-3.5 end-3.5 bg-emerald-600/95 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full shadow-lg z-10 flex items-center gap-1.5 pointer-events-none border border-emerald-400/40">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'بعد' : 'After'}</span>
        </span>

        {/* "Before" Image (GPU-accelerated clipPath overlay) */}
        <div
          ref={clipLayerRef}
          className="absolute inset-0 w-full h-full pointer-events-none select-none will-change-[clip-path]"
          style={{
            clipPath: isRtl ? 'inset(0 50% 0 0)' : 'inset(0 0 0 50%)',
          }}
        >
          <img
            src={resolvedBefore}
            alt={lang === 'ar' ? 'قبل الاستخدام' : 'Before Skincare'}
            referrerPolicy="no-referrer"
            decoding="async"
            draggable={false}
            className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none ${
              applySyntheticBeforeFilter
                ? 'saturate-60 brightness-90 contrast-120 sepia-[0.16]'
                : ''
            }`}
            onError={(e) => handleImageLoadError(e.currentTarget)}
          />
        </div>

        <span className="absolute top-3.5 start-3.5 bg-slate-900/90 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full shadow-lg z-10 flex items-center gap-1.5 pointer-events-none border border-slate-700/60">
          <span className="w-2 h-2 rounded-full bg-rose-400" />
          <span>{lang === 'ar' ? 'قبل' : 'Before'}</span>
        </span>

        {/* Precision Drag Handle (Dedicated touch-none grab zone for immediate horizontal drag) */}
        <div
          ref={dividerRef}
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_15px_rgba(0,0,0,0.45)] z-20 pointer-events-none flex items-center justify-center will-change-[inset-inline-start]"
          style={{ insetInlineStart: '50%' }}
        >
          <div
            data-slider-handle="true"
            className="w-11 h-11 rounded-full bg-white text-[#5A3E7A] shadow-xl flex items-center justify-center font-black text-base border-2 border-[#5A3E7A] shrink-0 pointer-events-auto touch-none cursor-ew-resize"
          >
            ↔
          </div>
        </div>
      </div>
    </div>
  );
};
