import React, { useEffect, useRef, useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { FloatingWhatsApp } from '../FloatingWhatsApp';
import { ScrollToTopProgress } from './ScrollToTopProgress';
import {
  FLOATING_DOCK_STORAGE_KEY,
  LEGACY_WA_STORAGE_KEY,
  DockPosition,
  clampDockToViewport,
  getFloatingDockHeight,
  isDockNearTopEdge,
  snapDockToNearestEdge,
} from '../../lib/floatingDockGeometry';

/**
 * FloatingActionDock
 *
 * Unified bottom-anchored vertical Flexbox dock (Option B):
 * - Top slot: FloatingWhatsApp FAB & upward Speed-Dial contact hub
 * - Bottom slot: ScrollToTopProgress circular ring that smoothly expands below
 *   WhatsApp on scroll down (lifting WhatsApp smoothly upward with guaranteed
 *   12px/14px spacing) and collapses automatically when back near the top.
 * - Unified Drag & Magnetic Edge-Snap: dragging moves the entire stack together
 *   and snaps cleanly to the nearest left/right viewport edge on release,
 *   making overlap between the two floating buttons mathematically impossible.
 */
export const FloatingActionDock: React.FC = () => {
  const { lang, sectionsControl, isCartOpen, isReviewModalOpen, currentRoute } = useCommerce();
  const isRtl = lang === 'ar';

  const isWhatsAppAllowed =
    Boolean(sectionsControl.floatingWhatsApp) &&
    !isCartOpen &&
    !isReviewModalOpen &&
    currentRoute !== 'cart' &&
    currentRoute !== 'login';

  const isScrollToTopAllowed = Boolean(sectionsControl.scrollToTop ?? true);

  const [isWaMenuOpen, setIsWaMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrollVisible, setIsScrollVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Unified draggable dock position { x, bottom } with legacy key cleanup
  const [position, setPosition] = useState<DockPosition | null>(() => {
    try {
      // Clear legacy single-button coordinate key so stale positions cannot cause overlap
      sessionStorage.removeItem(LEGACY_WA_STORAGE_KEY);
      const saved = sessionStorage.getItem(FLOATING_DOCK_STORAGE_KEY);
      if (saved && typeof window !== 'undefined') {
        const parsed = JSON.parse(saved);
        if (typeof parsed?.x === 'number' && typeof parsed?.bottom === 'number') {
          const maxDockHeight = getFloatingDockHeight(window.innerWidth, 2);
          return snapDockToNearestEdge(
            parsed.x,
            parsed.bottom,
            window.innerWidth,
            window.innerHeight,
            maxDockHeight
          );
        }
      }
    } catch {}
    return null;
  });

  const [isDragging, setIsDragging] = useState(false);
  const dockRef = useRef<HTMLDivElement | null>(null);
  const hasMovedRef = useRef(false);

  // Reset WA menu state whenever WhatsApp becomes hidden (e.g., route switch)
  useEffect(() => {
    if (!isWhatsAppAllowed && isWaMenuOpen) {
      setIsWaMenuOpen(false);
    }
  }, [isWhatsAppAllowed, isWaMenuOpen]);

  // Unified rAF scroll listener driving both ScrollToTop visibility/progress and subtle dimming
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 300);

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          if (docHeight > 0) {
            setScrollProgress(Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)));
          } else {
            setScrollProgress(0);
          }
          setIsScrollVisible(scrollTop > 280);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  // Keep magnetically docked position safely clamped on viewport resize
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        if (!prev) return null;
        const maxDockHeight = getFloatingDockHeight(window.innerWidth, 2);
        return snapDockToNearestEdge(
          prev.x,
          prev.bottom,
          window.innerWidth,
          window.innerHeight,
          maxDockHeight
        );
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset default corner on language switch if user hasn't explicitly dragged the dock
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(FLOATING_DOCK_STORAGE_KEY);
      if (!saved) {
        setPosition(null);
      }
    } catch {}
  }, [lang]);

  if (!isWhatsAppAllowed && !isScrollToTopAllowed) {
    return null;
  }

  // Spatial awareness for WhatsApp tooltip & speed-dial expansion direction
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 390;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 844;
  const activeDockHeight = getFloatingDockHeight(
    viewportWidth,
    (isWhatsAppAllowed ? 1 : 0) + (isScrollToTopAllowed && isScrollVisible ? 1 : 0)
  );

  const isLeftHalf = position !== null ? position.x < viewportWidth / 2 : isRtl;
  const isTopHalf =
    position !== null
      ? isDockNearTopEdge(position.bottom, viewportHeight, activeDockHeight)
      : false;

  // Unified drag engine with pointer capture & true magnetic edge-snap on release
  const handleDockPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const targetBtn = e.currentTarget;
    const pointerId = e.pointerId;
    try {
      targetBtn.setPointerCapture?.(pointerId);
    } catch {}

    const startX = e.clientX;
    const startY = e.clientY;
    const rect = dockRef.current?.getBoundingClientRect();
    const initialX = rect ? rect.left : isLeftHalf ? 12 : window.innerWidth - 60;
    const initialBottom = rect ? window.innerHeight - rect.bottom : 16;

    hasMovedRef.current = false;
    let localMoved = false;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      // 6px threshold avoids accidental drags from normal touch taps
      if (!localMoved && Math.hypot(deltaX, deltaY) > 6) {
        localMoved = true;
        hasMovedRef.current = true;
        setIsDragging(true);
      }

      if (!localMoved) return;

      const maxDockHeight = getFloatingDockHeight(window.innerWidth, 2);
      const nextPos = clampDockToViewport(
        initialX + deltaX,
        initialBottom - deltaY,
        window.innerWidth,
        window.innerHeight,
        maxDockHeight
      );
      setPosition(nextPos);
    };

    const onPointerUp = () => {
      try {
        targetBtn.releasePointerCapture?.(pointerId);
      } catch {}

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      if (localMoved) {
        setTimeout(() => {
          setIsDragging(false);
        }, 80);

        setPosition((current) => {
          if (!current) return null;
          const maxDockHeight = getFloatingDockHeight(window.innerWidth, 2);
          const snapped = snapDockToNearestEdge(
            current.x,
            current.bottom,
            window.innerWidth,
            window.innerHeight,
            maxDockHeight
          );
          try {
            sessionStorage.setItem(FLOATING_DOCK_STORAGE_KEY, JSON.stringify(snapped));
          } catch {}
          return snapped;
        });
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  // Hide the bottom scroll button only if WA speed-dial is forced downward while parked near the top
  const showScrollSlot = isScrollToTopAllowed && isScrollVisible && !(isWaMenuOpen && isTopHalf);

  return (
    <div
      ref={dockRef}
      style={
        position
          ? {
              position: 'fixed',
              left: `${position.x}px`,
              bottom: `${position.bottom}px`,
              top: 'auto',
              right: 'auto',
              zIndex: 50,
            }
          : undefined
      }
      className={`${
        !position
          ? 'fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] end-3 sm:bottom-6 sm:end-6 z-50'
          : `fixed z-50 ${!isDragging ? 'transition-[left,bottom,opacity] duration-300 ease-out' : ''}`
      } flex flex-col items-center select-none transition-opacity duration-300 ${
        isScrolling && !isWaMenuOpen && !isDragging ? 'opacity-80 hover:opacity-100' : 'opacity-100'
      }`}
    >
      {/* TOP SLOT: Floating WhatsApp & Upward Speed-Dial Hub */}
      {isWhatsAppAllowed && (
        <FloatingWhatsApp
          embedded
          isLeftHalfOverride={isLeftHalf}
          isTopHalfOverride={isTopHalf}
          isDraggingOverride={isDragging}
          hasMovedRefOverride={hasMovedRef}
          onDragPointerDown={handleDockPointerDown}
          onMenuOpenChange={setIsWaMenuOpen}
        />
      )}

      {/* BOTTOM SLOT: Scroll-to-Top Progress Ring (smoothly expands below WhatsApp, lifting it upward) */}
      {isScrollToTopAllowed && (
        <div
          className={`flex items-center justify-center transition-all duration-300 ease-out ${
            showScrollSlot
              ? `h-11 sm:h-12 ${isWhatsAppAllowed ? 'mt-3 sm:mt-3.5' : 'mt-0'} opacity-100 scale-100 pointer-events-auto overflow-visible`
              : 'h-0 mt-0 opacity-0 scale-75 pointer-events-none overflow-hidden'
          }`}
        >
          <ScrollToTopProgress embedded externalProgress={scrollProgress} />
        </div>
      )}
    </div>
  );
};
