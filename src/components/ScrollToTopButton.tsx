import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

/**
 * ScrollToTopButton:
 * Smart luxury floating button with a dynamic circular SVG progress ring
 * that fills from 0% to 100% as the customer scrolls down the store.
 * Automatically hides at the top of the page, and smoothly scrolls to top on click.
 */
export const ScrollToTopButton: React.FC = () => {
  const { lang, currentRoute } = useCommerce();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;

      if (totalScroll > 0) {
        const progress = Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100));
        setScrollProgress(progress);
      }

      // Show button once user has scrolled past 140px
      if (currentScroll > 140) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // SVG circular progress calculation (radius = 20, circumference = 2 * PI * 20 = ~125.66)
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  // Hide in developer console
  if (currentRoute === 'developer') return null;

  return (
    <div
      className={`fixed bottom-6 start-6 z-40 transition-all duration-300 select-none ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
      }`}
    >
      <button
        type="button"
        onClick={handleScrollToTop}
        className="relative group w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-purple-100 flex items-center justify-center text-[#5A3E7A] hover:text-[#483162] hover:shadow-2xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-300/30"
        title={lang === 'ar' ? `الصعود للأعلى (${Math.round(scrollProgress)}%)` : `Back to top (${Math.round(scrollProgress)}%)`}
        aria-label={lang === 'ar' ? 'الرجوع إلى أعلى الصفحة' : 'Scroll to top'}
      >
        {/* SVG Circular Progress Track & Fill */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
          viewBox="0 0 48 48"
        >
          {/* Background track circle */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            className="stroke-slate-100 text-slate-100"
            strokeWidth="3.2"
            fill="transparent"
          />
          {/* Animated fill progress circle */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            className="stroke-[#5A3E7A] transition-all duration-150 ease-out"
            strokeWidth="3.2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Icon */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <ArrowUp className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.4] group-hover:-translate-y-0.5 transition-transform duration-200" />
        </div>

        {/* Progress Percentage Badge on Hover */}
        <span className="absolute -top-7 start-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap pointer-events-none">
          {Math.round(scrollProgress)}%
        </span>
      </button>
    </div>
  );
};
