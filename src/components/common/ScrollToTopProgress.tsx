import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

/**
 * ScrollToTopProgress Component
 * 
 * Features:
 * - Smart Circular Progress Ring indicating exact scroll depth.
 * - Luxe Pro Look & Feel: Clean geometry, subtle backdrop blur, and smooth transitions.
 * - Bidirectional (RTL/LTR) logical positioning that never collides with floating WhatsApp.
 * - Smooth instant elevation to top upon tap.
 * - Accessibility-compliant 48px touch target with ARIA label.
 */
export interface ScrollToTopProgressProps {
  /** When true, renders strictly as an embedded button inside FloatingActionDock (no independent fixed wrapper). */
  embedded?: boolean;
  /** Controlled scroll progress (0-100) when rendered inside FloatingActionDock. */
  externalProgress?: number;
  /** Smoothly hides when an external overlay asks to suppress it. */
  isHidden?: boolean;
}

export const ScrollToTopProgress: React.FC<ScrollToTopProgressProps> = ({
  embedded = false,
  externalProgress,
  isHidden = false,
}) => {
  const { lang, sectionsControl } = useCommerce();
  const [internalProgress, setInternalProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Check if feature is enabled in central sectionsControl (defaults to true)
  const isEnabled = sectionsControl?.scrollToTop ?? true;

  useEffect(() => {
    if (embedded && typeof externalProgress === 'number') return;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          
          if (docHeight > 0) {
            const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
            setInternalProgress(progress);
          }

          // Show when user scrolls down more than 280px
          setIsVisible(scrollTop > 280);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [embedded, externalProgress]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isEnabled) return null;

  const scrollProgress = typeof externalProgress === 'number' ? externalProgress : internalProgress;

  // SVG circular calculation: radius 20, circumference = 2 * π * 20 ≈ 125.66
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  const buttonNode = (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={lang === 'ar' ? 'الصعود لأعلى الصفحة' : 'Scroll to top of page'}
      title={lang === 'ar' ? `نسبة التصفح: ${Math.round(scrollProgress)}% - انقر للصعود` : `Scrolled ${Math.round(scrollProgress)}% - Click to top`}
      className="group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:shadow-slate-900/20 border border-slate-200/80 flex items-center justify-center transition-transform duration-200 active:scale-95 hover:scale-105 cursor-pointer"
    >
      {/* SVG Progress Ring */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
        viewBox="0 0 48 48"
      >
        {/* Background Track */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-slate-200/80"
        />
        {/* Progress Indicator */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="transparent"
          stroke="var(--theme-primary, #6366f1)"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-150 ease-out"
        />
      </svg>

      {/* Center Arrow Icon & Optional Hover Percentage */}
      <div className="relative z-10 flex items-center justify-center text-slate-700 group-hover:text-[var(--theme-primary,#6366f1)] transition-colors">
        <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2] group-hover:-translate-y-0.5 transition-transform duration-200" />
      </div>

      {/* Tooltip on hover */}
      <span className="absolute -top-9 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap shadow-md">
        {Math.round(scrollProgress)}%
      </span>
    </button>
  );

  if (embedded) {
    return buttonNode;
  }

  const shouldDisplay = isVisible && !isHidden;

  return (
    <div
      className={`fixed end-3 sm:end-6 bottom-[calc(env(safe-area-inset-bottom)+1rem)] sm:bottom-6 z-30 transition-all duration-300 ease-out select-none ${
        shouldDisplay
          ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
          : 'opacity-0 translate-y-6 pointer-events-none scale-90'
      }`}
    >
      {buttonNode}
    </div>
  );
};

