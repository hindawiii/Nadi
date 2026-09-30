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
export const ScrollToTopProgress: React.FC = () => {
  const { lang, sectionsControl } = useCommerce();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Check if feature is enabled in central sectionsControl (defaults to true)
  const isEnabled = sectionsControl?.scrollToTop ?? true;

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          
          if (docHeight > 0) {
            const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
            setScrollProgress(progress);
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
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isEnabled) return null;

  // SVG circular calculation: radius 20, circumference = 2 * π * 20 ≈ 125.66
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-6 start-6 z-30 transition-all duration-300 ease-out select-none ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
          : 'opacity-0 translate-y-6 pointer-events-none scale-90'
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label={lang === 'ar' ? 'الصعود لأعلى الصفحة' : 'Scroll to top of page'}
        title={lang === 'ar' ? `نسبة التصفح: ${Math.round(scrollProgress)}% - انقر للصعود` : `Scrolled ${Math.round(scrollProgress)}% - Click to top`}
        className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:shadow-slate-900/20 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center transition-transform duration-200 active:scale-95 hover:scale-105 cursor-pointer"
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
            className="text-slate-200/80 dark:text-slate-800"
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
        <div className="relative z-10 flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:text-[var(--theme-primary,#6366f1)] transition-colors">
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2] group-hover:-translate-y-0.5 transition-transform duration-200" />
        </div>

        {/* Tooltip on hover */}
        <span className="absolute -top-9 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap shadow-md">
          {Math.round(scrollProgress)}%
        </span>
      </button>
    </div>
  );
};
