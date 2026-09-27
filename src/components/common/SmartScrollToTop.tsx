import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

/**
 * SmartScrollToTop:
 * A luxury floating back-to-top button featuring a dynamic circular SVG progress ring
 * that visualizes the page scroll depth (0% to 100%) in real-time.
 */
export const SmartScrollToTop: React.FC = () => {
  const { lang } = useCommerce();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(Math.max(currentProgress, 0), 100));
      }
      setIsVisible(window.scrollY > 260);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div 
      className="fixed bottom-6 start-6 z-40 animate-in fade-in zoom-in-90 duration-300 select-none"
      style={{ direction: 'ltr' }}
    >
      <button
        type="button"
        onClick={scrollToTop}
        className="relative w-12 h-12 rounded-full bg-white/95 backdrop-blur-md shadow-xl hover:shadow-2xl border border-slate-200/80 flex items-center justify-center group transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5A3E7A]/40"
        aria-label={lang === 'ar' ? 'الرجوع لأعلى الصفحة' : 'Scroll back to top'}
        title={lang === 'ar' ? `الصعود للأعلى (${Math.round(scrollProgress)}%)` : `Back to top (${Math.round(scrollProgress)}%)`}
      >
        {/* Circular SVG Progress Ring */}
        <svg 
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5" 
          viewBox="0 0 48 48"
        >
          {/* Subtle track background */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            className="text-slate-100"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
          />
          {/* Active Fill Ring */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            className="text-theme-primary transition-[stroke-dashoffset] duration-150 ease-out"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Arrow Icon */}
        <ArrowUp className="w-5 h-5 text-slate-700 group-hover:text-theme-primary transition-all duration-300 group-hover:-translate-y-0.5" />
      </button>
    </div>
  );
};
