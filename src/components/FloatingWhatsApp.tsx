import React, { useState, useEffect, useRef } from 'react';
import { Move, X } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

export const FloatingWhatsApp: React.FC = () => {
  const { lang, activeData, isCartOpen, isAuthModalOpen, isReviewModalOpen, currentRoute } = useCommerce();
  const phone = activeData.contactInfo.whatsapp;

  // Custom position state when user drags the button
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Smart Tooltip: Visible on mount for 4.5 seconds, then auto-collapses
  const [isAutoVisible, setIsAutoVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  const dragStartRef = useRef<{ startX: number; startY: number; buttonX: number; buttonY: number; moved: boolean }>({
    startX: 0,
    startY: 0,
    buttonX: 0,
    buttonY: 0,
    moved: false,
  });
  const buttonRef = useRef<HTMLDivElement>(null);

  // Auto-collapse after 4.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAutoVisible(false);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  if (isCartOpen || isAuthModalOpen || isReviewModalOpen || currentRoute === 'cart') return null;

  const handleOpenWhatsApp = () => {
    const greeting = lang === 'ar'
      ? `مرحباً ${activeData.storeName.ar}، أود استشارة خبيرة العناية والاستفسار عن المنتجات والعروض المتوفرة.`
      : `Hello ${activeData.storeName.en}, I would like to consult the skincare expert about products and current offers.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(greeting)}`, '_blank');
  };

  // Clamp within viewport
  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max));

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    dragStartRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      buttonX: rect.left,
      buttonY: rect.top,
      moved: false,
    };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartRef.current.startX;
    const deltaY = touch.clientY - dragStartRef.current.startY;

    if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
      dragStartRef.current.moved = true;
    }

    const newX = clamp(dragStartRef.current.buttonX + deltaX, 12, window.innerWidth - 68);
    const newY = clamp(dragStartRef.current.buttonY + deltaY, 12, window.innerHeight - 68);

    setPosition({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (!dragStartRef.current.moved) {
      handleOpenWhatsApp();
    }
  };

  // Mouse handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      buttonX: rect.left,
      buttonY: rect.top,
      moved: false,
    };
    setIsDragging(true);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - dragStartRef.current.startX;
      const deltaY = moveEvent.clientY - dragStartRef.current.startY;

      if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        dragStartRef.current.moved = true;
      }

      const newX = clamp(dragStartRef.current.buttonX + deltaX, 12, window.innerWidth - 68);
      const newY = clamp(dragStartRef.current.buttonY + deltaY, 12, window.innerHeight - 68);
      setPosition({ x: newX, y: newY });
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      if (!dragStartRef.current.moved) {
        handleOpenWhatsApp();
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Determine if the smart tooltip should be expanded
  const shouldShowTooltip = !isDismissed && !isDragging && (isAutoVisible || isHovered);

  return (
    <div
      ref={buttonRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={
        position
          ? { left: `${position.x}px`, top: `${position.y}px`, right: 'auto', bottom: 'auto' }
          : undefined
      }
      className={`fixed z-50 flex items-center gap-2 select-none touch-none ${
        !position ? 'bottom-6 end-6' : ''
      } ${isDragging ? 'scale-105 opacity-90 transition-none' : 'transition-transform duration-300'}`}
    >
      {/* ========================================================================= */}
      {/* SMART AUTO-COLLAPSING TOOLTIP (Collapses after 4.5s or expands on hover)  */}
      {/* ========================================================================= */}
      <div 
        className={`transition-all duration-500 ease-out origin-end overflow-hidden flex items-center ${
          shouldShowTooltip 
            ? 'max-w-xs opacity-100 scale-100 pe-1.5' 
            : 'max-w-0 opacity-0 scale-95 pointer-events-none pe-0'
        }`}
      >
        <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur-xl px-3.5 py-2 rounded-2xl shadow-2xl border border-emerald-100 text-xs font-bold text-slate-800 whitespace-nowrap">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] sm:text-xs text-slate-800 font-bold">
            {lang === 'ar' ? 'استشارة مجانية مع خبيرة العناية 🌸 (اسحبي للتحريك)' : 'Free Skincare Consultation 🌸 (Drag to move)'}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDismissed(true);
            }}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
            title={lang === 'ar' ? 'إغلاق' : 'Close'}
            aria-label="Dismiss tooltip"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LUXURY LAYERED SQUIRCLE WHATSAPP BUTTON (Inspired by uploaded image #4)   */}
      {/* ========================================================================= */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative group cursor-grab active:cursor-grabbing p-1"
        title={lang === 'ar' ? 'انقري للمحادثة أو اسحبي لنقل الزر إلى أي مكان' : 'Click to chat or drag to reposition'}
      >
        {/* Layer 1: Ambient Backdrop Layer (Tilted Translucent Squircle) */}
        <div className="absolute inset-1 rounded-[22px] bg-emerald-400/35 backdrop-blur-sm transform rotate-6 scale-100 pointer-events-none transition-transform duration-500 group-hover:rotate-12 group-hover:scale-105" />

        {/* Layer 2: Secondary Glow Layer (Opposite Angle) */}
        <div className="absolute inset-1 rounded-[22px] bg-teal-500/25 transform -rotate-3 scale-95 pointer-events-none transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-100" />

        {/* Layer 3: Main Foreground Luxury Squircle */}
        <div className="relative w-14 h-14 rounded-[20px] bg-gradient-to-br from-[#25D366] via-[#128C7E] to-[#075E54] text-white shadow-2xl shadow-emerald-900/35 border border-emerald-200/40 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-active:scale-95 overflow-hidden">
          {/* Subtle Glass Highlight Reflex */}
          <div className="absolute top-0 start-0 end-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-[19px] pointer-events-none" />

          {/* Precision WhatsApp Vector Icon */}
          <svg 
            viewBox="0 0 24 24" 
            className="w-7 h-7 fill-white drop-shadow-xs relative z-10 transition-transform duration-300 group-hover:scale-110" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.05 20.16C10.57 20.16 9.12 19.76 7.85 19L7.55 18.82L4.43 19.64L5.26 16.6L5.06 16.29C4.24 14.98 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16ZM16.57 14.41C16.32 14.28 15.1 13.68 14.88 13.6C14.65 13.52 14.49 13.48 14.32 13.73C14.16 13.98 13.69 14.53 13.55 14.69C13.41 14.86 13.26 14.88 13.01 14.75C12.77 14.63 11.98 14.37 11.04 13.53C10.31 12.88 9.81 12.07 9.67 11.83C9.53 11.58 9.65 11.45 9.77 11.33C9.88 11.22 10.02 11.04 10.14 10.9C10.26 10.76 10.3 10.66 10.38 10.5C10.46 10.33 10.42 10.19 10.36 10.07C10.3 9.94 9.81 8.74 9.61 8.25C9.41 7.77 9.21 7.83 9.06 7.83C8.92 7.82 8.76 7.82 8.59 7.82C8.43 7.82 8.16 7.88 7.94 8.13C7.71 8.37 7.08 8.96 7.08 10.17C7.08 11.38 7.96 12.54 8.09 12.71C8.21 12.87 9.82 15.36 12.3 16.42C12.89 16.67 13.35 16.83 13.71 16.94C14.3 17.13 14.84 17.1 15.27 17.04C15.75 16.97 16.74 16.44 16.94 15.86C17.15 15.28 17.15 14.79 17.09 14.69C17.02 14.59 16.82 14.53 16.57 14.41Z" />
          </svg>
        </div>

        {/* Live Active Online Ping Dot */}
        <span className="absolute top-0 end-0 flex h-4 w-4 z-20 pointer-events-none">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-85" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white shadow-xs" />
        </span>

        {/* Subtle Drag Handle Mini Indicator */}
        <span 
          className="absolute -bottom-1 -start-1 w-5 h-5 rounded-full bg-white text-emerald-800 shadow-md border border-emerald-200 flex items-center justify-center opacity-0 group-hover:opacity-90 transition-opacity z-20 pointer-events-none"
          title={lang === 'ar' ? 'اسحبي للتحريك' : 'Drag'}
        >
          <Move className="w-2.5 h-2.5" />
        </span>
      </div>
    </div>
  );
};

