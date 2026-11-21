import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { handleImageLoadError } from '../../lib/imageResilience';

interface PdpFullscreenLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
  isRtl: boolean;
  productName: string;
  images: string[];
  selectedImgIndex: number;
  setSelectedImgIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const PdpFullscreenLightbox: React.FC<PdpFullscreenLightboxProps> = ({
  isOpen,
  onClose,
  lang,
  isRtl,
  productName,
  images,
  selectedImgIndex,
  setSelectedImgIndex,
}) => {
  const [lightboxScale, setLightboxScale] = useState(1);
  const [lightboxPan, setLightboxPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const lightboxTouchDistRef = useRef<number | null>(null);
  const initialLightboxScaleRef = useRef<number>(1);
  const lightboxSwipeRef = useRef<{
    startX: number;
    startY: number;
    time: number;
    didMultiTouch: boolean;
  }>({
    startX: 0,
    startY: 0,
    time: 0,
    didMultiTouch: false,
  });
  const lightboxDidGestureRef = useRef(false);

  const resetTransform = () => {
    setLightboxScale(1);
    setLightboxPan({ x: 0, y: 0 });
    setIsPanning(false);
    lightboxTouchDistRef.current = null;
  };

  const handleClose = () => {
    resetTransform();
    onClose();
  };

  // Reset zoom/pan when opened
  useEffect(() => {
    if (isOpen) {
      resetTransform();
    }
  }, [isOpen]);

  // Keyboard navigation + body scroll lock while fullscreen lightbox is open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowRight') {
        setSelectedImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        setLightboxScale(1);
        setLightboxPan({ x: 0, y: 0 });
      } else if (e.key === 'ArrowLeft') {
        setSelectedImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        setLightboxScale(1);
        setLightboxPan({ x: 0, y: 0 });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, images.length]);

  if (!isOpen) return null;

  const activeImage = images[selectedImgIndex] || images[0];

  const clampLightboxPan = (nextX: number, nextY: number, scale: number) => {
    if (scale <= 1) return { x: 0, y: 0 };
    const maxOffsetX = window.innerWidth * (scale - 1) * 0.65;
    const maxOffsetY = window.innerHeight * (scale - 1) * 0.65;
    return {
      x: Math.min(Math.max(nextX, -maxOffsetX), maxOffsetX),
      y: Math.min(Math.max(nextY, -maxOffsetY), maxOffsetY),
    };
  };

  const handleWheelZoom = (e: React.WheelEvent<HTMLDivElement>) => {
    setLightboxScale((prev) => {
      const delta = e.deltaY < 0 ? 0.22 : -0.22;
      const next = Math.min(Math.max(Number((prev + delta).toFixed(3)), 1), 4);
      if (next <= 1.01) {
        setLightboxPan({ x: 0, y: 0 });
        return 1;
      }
      setLightboxPan((currentPan) => clampLightboxPan(currentPan.x, currentPan.y, next));
      return next;
    });
  };

  const handleLightboxMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (lightboxScale <= 1) return;
    e.preventDefault();
    setIsPanning(true);
    lightboxDidGestureRef.current = false;
    panStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: lightboxPan.x,
      panY: lightboxPan.y,
    };
  };

  const handleLightboxMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning || lightboxScale <= 1) return;
    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      lightboxDidGestureRef.current = true;
    }
    setLightboxPan(clampLightboxPan(panStartRef.current.panX + dx, panStartRef.current.panY + dy, lightboxScale));
  };

  const handleLightboxMouseUp = () => {
    setIsPanning(false);
  };

  // Pure Touch Pinch-to-Zoom & Free Pan (Zero tap/click zoom)
  const handleLightboxTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lightboxTouchDistRef.current = Math.max(dist, 1);
      initialLightboxScaleRef.current = lightboxScale;
      lightboxSwipeRef.current.didMultiTouch = true;
      lightboxDidGestureRef.current = true;
      setIsPanning(false);
    } else if (e.touches.length === 1) {
      lightboxSwipeRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        time: Date.now(),
        didMultiTouch: false,
      };
      if (lightboxScale > 1) {
        setIsPanning(true);
        panStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          panX: lightboxPan.x,
          panY: lightboxPan.y,
        };
      }
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
      if (nextScale <= 1.02) {
        setLightboxPan({ x: 0, y: 0 });
      } else {
        setLightboxPan((currentPan) => clampLightboxPan(currentPan.x, currentPan.y, nextScale));
      }
    } else if (e.touches.length === 1 && isPanning && lightboxScale > 1) {
      const dx = e.touches[0].clientX - panStartRef.current.x;
      const dy = e.touches[0].clientY - panStartRef.current.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        lightboxDidGestureRef.current = true;
      }
      setLightboxPan(clampLightboxPan(panStartRef.current.panX + dx, panStartRef.current.panY + dy, lightboxScale));
    }
  };

  const handleLightboxTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length < 2) {
      lightboxTouchDistRef.current = null;
    }

    if (lightboxScale < 1.04) {
      setLightboxScale(1);
      setLightboxPan({ x: 0, y: 0 });
    }

    if (
      lightboxScale <= 1.04 &&
      !lightboxSwipeRef.current.didMultiTouch &&
      images.length > 1 &&
      e.touches.length === 0 &&
      e.changedTouches.length === 1
    ) {
      const diffX = e.changedTouches[0].clientX - lightboxSwipeRef.current.startX;
      const diffY = e.changedTouches[0].clientY - lightboxSwipeRef.current.startY;
      const timeTaken = Date.now() - lightboxSwipeRef.current.time;
      if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) && timeTaken < 700) {
        if (diffX < 0) {
          setSelectedImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        } else {
          setSelectedImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        }
        setLightboxScale(1);
        setLightboxPan({ x: 0, y: 0 });
      }
    }

    if (e.touches.length === 0) {
      setIsPanning(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md select-none overflow-hidden animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={productName}
    >
      {/* Full-Viewport Unconstrained Interactive Stage: Image Scales as a Whole Across Entire Screen */}
      <div
        className={`absolute inset-0 flex items-center justify-center touch-none ${
          lightboxScale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
        }`}
        onWheel={handleWheelZoom}
        onMouseDown={handleLightboxMouseDown}
        onMouseMove={handleLightboxMouseMove}
        onMouseUp={handleLightboxMouseUp}
        onMouseLeave={handleLightboxMouseUp}
        onTouchStart={handleLightboxTouchStart}
        onTouchMove={handleLightboxTouchMove}
        onTouchEnd={handleLightboxTouchEnd}
        onClick={(e) => {
          if (e.target === e.currentTarget && lightboxScale <= 1.02 && !lightboxDidGestureRef.current) {
            handleClose();
          }
          lightboxDidGestureRef.current = false;
        }}
      >
        <img
          src={activeImage}
          alt={productName}
          referrerPolicy="no-referrer"
          decoding="async"
          draggable={false}
          className="max-h-[82vh] sm:max-h-[86vh] max-w-[96vw] sm:max-w-[92vw] object-contain drop-shadow-2xl select-none pointer-events-none will-change-transform"
          style={{
            transform: `translate3d(${lightboxPan.x}px, ${lightboxPan.y}px, 0) scale(${lightboxScale})`,
            transition:
              isPanning || lightboxTouchDistRef.current !== null
                ? 'none'
                : 'transform 140ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          onError={(e) => handleImageLoadError(e.currentTarget)}
        />
      </div>

      {/* Top Controls Bar: Product Title Pill + Clean Isolated Close Button (No Manual Zoom Buttons) */}
      <div className="fixed top-0 inset-x-0 z-20 p-3 sm:p-5 flex items-center justify-between gap-3 pointer-events-none">
        <div className="flex-1 min-w-0 pointer-events-auto">
          <div className="inline-flex items-center gap-2 max-w-full bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
            <span className="text-xs sm:text-sm font-bold text-white truncate block max-w-[170px] sm:max-w-md">
              {productName}
            </span>
            {images.length > 1 && (
              <span
                dir="ltr"
                className="text-[10px] sm:text-xs font-mono font-extrabold text-amber-300 bg-black/45 px-2 py-0.5 rounded-full border border-white/10 shrink-0"
              >
                {selectedImgIndex + 1} / {images.length}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="pointer-events-auto min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] rounded-full bg-red-500/25 hover:bg-red-500/40 backdrop-blur-md border border-red-400/45 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-90 cursor-pointer shadow-lg shadow-black/40 shrink-0"
          aria-label={lang === 'ar' ? 'إغلاق نافذة عرض الصور' : 'Close full screen preview'}
          title={lang === 'ar' ? 'إغلاق (ESC)' : 'Close (ESC)'}
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Previous / Next Arrows (Hidden While Zoomed) */}
      {images.length > 1 && lightboxScale <= 1.05 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
              setLightboxScale(1);
              setLightboxPan({ x: 0, y: 0 });
            }}
            className="fixed top-1/2 -translate-y-1/2 start-2.5 sm:start-6 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-white/20 shadow-lg cursor-pointer"
            aria-label={lang === 'ar' ? 'الصورة السابقة' : 'Previous image'}
          >
            {isRtl ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
              setLightboxScale(1);
              setLightboxPan({ x: 0, y: 0 });
            }}
            className="fixed top-1/2 -translate-y-1/2 end-2.5 sm:end-6 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-white/20 shadow-lg cursor-pointer"
            aria-label={lang === 'ar' ? 'الصورة التالية' : 'Next image'}
          >
            {isRtl ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
          </button>
        </>
      )}

      {/* Bottom Thumbnail Switcher (Hidden While Zoomed) */}
      {images.length > 1 && lightboxScale <= 1.15 && (
        <div className="fixed bottom-4 sm:bottom-6 inset-x-0 z-20 flex justify-center px-4 pointer-events-none">
          <div
            className="pointer-events-auto flex gap-2 overflow-x-auto p-1.5 bg-black/50 backdrop-blur-md rounded-2xl border border-white/15 max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedImgIndex(idx);
                  setLightboxScale(1);
                  setLightboxPan({ x: 0, y: 0 });
                }}
                className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                  selectedImgIndex === idx
                    ? 'border-white ring-2 ring-white/50 scale-105'
                    : 'border-transparent opacity-55 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${productName} ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  decoding="async"
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageLoadError(e.currentTarget)}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
