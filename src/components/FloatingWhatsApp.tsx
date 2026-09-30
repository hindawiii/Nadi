import React, { useState, useEffect, useRef } from 'react';
import { X, Phone, PhoneCall, Copy, Check, Clock, ShieldCheck } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

/**
 * Clamps coordinates within viewport boundaries with safe paddings
 */
const clampToViewport = (x: number, y: number) => {
  if (typeof window === 'undefined') return { x, y };
  const btnSize = 64;
  const padding = 16;
  const minX = padding;
  const maxX = Math.max(padding, window.innerWidth - btnSize - padding);
  const minY = 70; // Header safe zone
  const maxY = Math.max(minY, window.innerHeight - btnSize - padding);
  return {
    x: Math.min(maxX, Math.max(minX, x)),
    y: Math.min(maxY, Math.max(minY, y)),
  };
};

/**
 * FloatingWhatsApp Component
 * 
 * Luxury Pro Draggable Floating Action Button & Speed-Dial Contact Hub.
 * Features:
 * - Column-Locked Vertical Alignment: speed-dial icons locked strictly to the FAB vertical axis
 * - Touch & Pointer Capture: buttery-smooth dragging without page scroll conflicts
 * - Z-Index Hierarchy: elevated to z-50 with backdrop at z-40 and modals at z-[60]
 * - Viewport Clamping: validates coordinates on initial mount and window resize
 * - Responsive Badge Containment: max-width safeguards to prevent any mobile overflow
 * - Native Direct Link Dispatch: avoids pop-up blocker issues across all browsers
 */
export const FloatingWhatsApp: React.FC = () => {
  const { lang, activeData, isCartOpen, isAuthModalOpen, isReviewModalOpen, currentRoute, showToast } = useCommerce();
  const isRtl = lang === 'ar';
  const phone = activeData.contactInfo.whatsapp;
  const directPhone = activeData.contactInfo.phone || phone;

  // Dual option menu toggle state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Luxury phone popup dialog state
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Draggable floating position state { x, y } in viewport pixels with immediate viewport clamping
  const [position, setPosition] = useState<{ x: number; y: number } | null>(() => {
    try {
      const saved = sessionStorage.getItem('so_beauty_wa_pos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') {
          return clampToViewport(parsed.x, parsed.y);
        }
      }
    } catch {}
    return null;
  });

  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasMovedRef = useRef(false);

  // Smart Tooltip: Visible on mount for 4 seconds, or until user scrolls / dismisses
  const [isAutoVisible, setIsAutoVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('so_beauty_wa_note_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  // Auto-collapse tooltip after 4 seconds
  useEffect(() => {
    if (isDismissed) {
      setIsAutoVisible(false);
      return;
    }
    const timer = setTimeout(() => {
      setIsAutoVisible(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [isDismissed]);

  // Smart Scroll Dismissal: When user scrolls, gracefully collapse tooltip
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsAutoVisible(false);
        setIsDismissed(true);
        try {
          sessionStorage.setItem('so_beauty_wa_note_dismissed', 'true');
        } catch {}
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close speed-dial menu or phone modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsPhoneModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Window resize handler: Keep active position within valid screen bounds
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => {
        if (!prev) return null;
        return clampToViewport(prev.x, prev.y);
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset position when language changes if user hasn't explicitly customized it
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('so_beauty_wa_pos');
      if (!saved) {
        setPosition(null);
      }
    } catch {}
  }, [lang]);

  // SPATIAL AWARENESS: Determine screen quadrant dynamically
  // If position is null (initial default):
  // - In Arabic (RTL): default corner is bottom-left (isLeftHalf = true, isTopHalf = false)
  // - In English (LTR): default corner is bottom-right (isLeftHalf = false, isTopHalf = false)
  const isLeftHalf = position !== null
    ? position.x < (typeof window !== 'undefined' ? window.innerWidth / 2 : 300)
    : isRtl;

  const isTopHalf = position !== null
    ? position.y < 240
    : false;

  // DRAG ENGINE (Pointer Down Handler with Pointer Capture & native gesture isolation)
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    // Only primary mouse button or touch/pen
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const targetBtn = e.currentTarget;
    const pointerId = e.pointerId;

    try {
      targetBtn.setPointerCapture?.(pointerId);
    } catch {}

    const startX = e.clientX;
    const startY = e.clientY;
    const rect = containerRef.current?.getBoundingClientRect();
    const initialPosX = rect ? rect.left : (isLeftHalf ? 24 : window.innerWidth - 88);
    const initialPosY = rect ? rect.top : (window.innerHeight - 88);

    hasMovedRef.current = false;
    let localMoved = false;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      // 6px threshold prevents minor touch tremors from triggering drag
      if (!localMoved && Math.hypot(deltaX, deltaY) > 6) {
        localMoved = true;
        hasMovedRef.current = true;
        setIsDragging(true);
        setIsAutoVisible(false);
      }

      if (!localMoved) return;

      const clamped = clampToViewport(initialPosX + deltaX, initialPosY + deltaY);
      setPosition(clamped);
    };

    const onPointerUp = (upEvent: PointerEvent) => {
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

        setPosition(current => {
          if (!current) return null;
          try {
            sessionStorage.setItem('so_beauty_wa_pos', JSON.stringify(current));
          } catch {}
          return current;
        });
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  // Hide on modal pages or dedicated routes
  if (isCartOpen || isAuthModalOpen || isReviewModalOpen || currentRoute === 'cart' || currentRoute === 'login') {
    return null;
  }

  // WhatsApp Action Handler - Resilient Universal Direct Anchor Dispatch
  const handleOpenWhatsApp = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsMenuOpen(false);
    const greeting = lang === 'ar'
      ? `مرحباً ${activeData.storeName.ar}، أود الاستفسار والتواصل بخصوص منتجات العناية الطبيعية والعروض المتوفرة.`
      : `Hello ${activeData.storeName.en}, I would like to consult with you regarding natural skincare products and current offers.`;
    
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(greeting);
    const universalUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
    
    // Create direct anchor element to bypass popup blockers reliably
    const anchor = document.createElement('a');
    anchor.href = universalUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  // Open Luxury Phone Modal
  const handleOpenPhoneModal = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsMenuOpen(false);
    setIsPhoneModalOpen(true);
  };

  // Direct Phone Call Action (from inside modal)
  const handleExecuteCall = () => {
    const cleanedNumber = directPhone.replace(/[^0-9+]/g, '');
    window.location.href = `tel:${cleanedNumber}`;
  };

  // Copy phone number to clipboard with feedback
  const handleCopyNumber = () => {
    try {
      navigator.clipboard.writeText(directPhone);
      setIsCopied(true);
      showToast({
        type: 'success',
        message: lang === 'ar' ? 'تم نسخ رقم الهاتف بنجاح' : 'Phone number copied to clipboard'
      });
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      showToast({
        type: 'info',
        message: lang === 'ar' ? `رقم الهاتف: ${directPhone}` : `Phone: ${directPhone}`
      });
    }
  };

  // Explicitly dismiss the "تواصل معنا" note
  const handleDismissNote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDismissed(true);
    setIsAutoVisible(false);
    try {
      sessionStorage.setItem('so_beauty_wa_note_dismissed', 'true');
    } catch {}
  };

  // Toggle speed-dial menu reliably on tap / click
  const toggleMenu = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (hasMovedRef.current) {
      hasMovedRef.current = false;
      return;
    }
    setIsMenuOpen(prev => !prev);
    setIsAutoVisible(false);
  };

  // Smart condition: only show tooltip when menu & modal are closed, not dismissed, and timer active
  const shouldShowTooltip = !isMenuOpen && !isPhoneModalOpen && !isDismissed && isAutoVisible && !isDragging;

  return (
    <>
      {/* Invisible backdrop to dismiss speed-dial menu on tap outside - z-40 sits below z-50 container */}
      {isMenuOpen && (
        <div 
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[1px] transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* ========================================================================= */}
      {/* 1. LUXURY SMART PHONE POPUP MODAL (نافذة منبثقة ذكية وفاخرة لعرض الهاتف)    */}
      {/* Highest Z-Index: z-[60] so it sits above all widgets and menus            */}
      {/* ========================================================================= */}
      {isPhoneModalOpen && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsPhoneModalOpen(false)}
          aria-modal="true"
          role="dialog"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden animate-in zoom-in-95 duration-200 space-y-6"
          >
            {/* Top Luxury Gradient Accent Bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-[#5A3E7A]" />

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pt-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-lg shadow-emerald-950/20 shrink-0">
                  <PhoneCall className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    {lang === 'ar' ? 'الاتصال المباشر والدعم' : 'Direct Support & Inquiries'}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {lang === 'ar' ? 'متاح الآن للرد الفوري' : 'Online & Ready to Help'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Close Button with 44px Touch Target */}
              <button
                type="button"
                onClick={() => setIsPhoneModalOpen(false)}
                className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center justify-center shrink-0 cursor-pointer active:scale-95"
                aria-label={lang === 'ar' ? 'إغلاق النافذة' : 'Close modal'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Luxury Phone Display Box */}
            <div className="bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-slate-800/60 dark:to-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-center shadow-inner">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {lang === 'ar' ? 'رقم الهاتف المعتمد للمتجر' : 'Official Store Phone Number'}
              </span>

              {/* Phone Number Display */}
              <div 
                className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-wider font-mono select-all"
                dir="ltr"
              >
                {directPhone}
              </div>

              {/* Copy Action Button */}
              <button
                type="button"
                onClick={handleCopyNumber}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-700 dark:text-emerald-400">{lang === 'ar' ? 'تم نسخ الرقم بنجاح!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>{lang === 'ar' ? 'نسخ رقم الهاتف' : 'Copy Number'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Action Buttons: Direct Call & WhatsApp */}
            <div className="space-y-2.5">
              {/* Primary: Direct Call Now */}
              <button
                type="button"
                onClick={handleExecuteCall}
                className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-950/20 transition-all cursor-pointer active:scale-95"
              >
                <Phone className="w-5 h-5 fill-current" />
                <span>{lang === 'ar' ? 'اتصال هاتفي مباشر الآن' : 'Call Directly Now'}</span>
              </button>

              {/* Secondary: Instant WhatsApp */}
              <button
                type="button"
                onClick={() => {
                  setIsPhoneModalOpen(false);
                  handleOpenWhatsApp();
                }}
                className="w-full min-h-[48px] py-3 px-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-sm flex items-center justify-center gap-2.5 transition-colors cursor-pointer active:scale-95"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366] shrink-0" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.05 20.16C10.57 20.16 9.12 19.76 7.85 19L7.55 18.82L4.43 19.64L5.26 16.6L5.06 16.29C4.24 14.98 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16ZM16.57 14.41C16.32 14.28 15.1 13.68 14.88 13.6C14.65 13.52 14.49 13.48 14.32 13.73C14.16 13.98 13.69 14.53 13.55 14.69C13.41 14.86 13.26 14.88 13.01 14.75C12.77 14.63 11.98 14.37 11.04 13.53C10.31 12.88 9.81 12.07 9.67 11.83C9.53 11.58 9.65 11.45 9.77 11.33C9.88 11.22 10.02 11.04 10.14 10.9C10.26 10.76 10.3 10.66 10.38 10.5C10.46 10.33 10.42 10.19 10.36 10.07C10.3 9.94 9.81 8.74 9.61 8.25C9.41 7.77 9.21 7.83 9.06 7.83C8.92 7.82 8.76 7.82 8.59 7.82C8.43 7.82 8.16 7.88 7.94 8.13C7.71 8.37 7.08 8.96 7.08 10.17C7.08 11.38 7.96 12.54 8.09 12.71C8.21 12.87 9.82 15.36 12.3 16.42C12.89 16.67 13.35 16.83 13.71 16.94C14.3 17.13 14.84 17.1 15.27 17.04C15.75 16.97 16.74 16.44 16.94 15.86C17.15 15.28 17.15 14.79 17.09 14.69C17.02 14.59 16.82 14.53 16.57 14.41Z" />
                </svg>
                <span>{lang === 'ar' ? 'أو المحادثة الفورية عبر واتساب' : 'Or Chat via WhatsApp'}</span>
              </button>
            </div>

            {/* Working Hours & Trust Info Note */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{lang === 'ar' ? 'يومياً: ٩:٠٠ ص – ١١:٠٠ م' : 'Daily: 9:00 AM – 11:00 PM'}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{lang === 'ar' ? 'دعم رسمي معتمد' : 'Verified Support'}</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DRAGGABLE FLOATING ACTION CONTAINER                                    */}
      {/* Elevated strictly to z-50 to remain above all background bars and drawers */}
      {/* ========================================================================= */}
      <div 
        ref={containerRef}
        style={position ? {
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          bottom: 'auto',
          right: 'auto',
          zIndex: 50,
          touchAction: 'none',
        } : undefined}
        className={!position 
          ? "fixed bottom-6 end-6 z-50 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center select-none touch-none" 
          : "fixed z-50 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center select-none touch-none"}
      >
        
        {/* ========================================================================= */}
        {/* COLUMN-LOCKED SPEED-DIAL POPUP OPTIONS                                    */}
        {/* Container is strictly w-full (centered on the FAB vertical axis)         */}
        {/* Action icons are locked in the center, text badges float to the safe side */}
        {/* ========================================================================= */}
        <div 
          className={`absolute inset-x-0 w-full flex flex-col gap-3 items-center transition-all duration-300 ease-out z-50 ${
            isTopHalf ? 'top-full mt-3 origin-top' : 'bottom-full mb-3 origin-bottom'
          } ${
            isMenuOpen 
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
              : 'opacity-0 translate-y-3 scale-95 pointer-events-none max-h-0 overflow-hidden'
          }`}
        >
          {/* OPTION 1: DIRECT PHONE CALL -> OPENS LUXURY SMART MODAL */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0">
            {/* The Circle Action Button: Centered dead-on in the vertical column directly above the FAB */}
            <button
              type="button"
              onClick={handleOpenPhoneModal}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-950/25 border-2 border-white dark:border-slate-800 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer shrink-0"
              title={lang === 'ar' ? `عرض رقم الهاتف: ${directPhone}` : `View Phone: ${directPhone}`}
              aria-label="Direct Phone Modal"
            >
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 fill-current drop-shadow-xs" />
            </button>

            {/* The Text Badge: Side-anchored to the circle, always pointing towards the screen center */}
            <button 
              type="button"
              onClick={handleOpenPhoneModal}
              className={`absolute top-1/2 -translate-y-1/2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-900/40 text-xs font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap max-w-[calc(100vw-96px)] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 transition-all flex items-center gap-2 cursor-pointer active:scale-95 z-20 ${
                isLeftHalf ? 'left-full ml-3' : 'right-full mr-3'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{lang === 'ar' ? 'عرض الرقم والاتصال' : 'View Phone & Call'}</span>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline shrink-0" dir="ltr">{directPhone}</span>
            </button>
          </div>

          {/* OPTION 2: WHATSAPP CHAT */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0">
            {/* The Circle Action Button: Centered dead-on in the vertical column directly above the FAB */}
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#25D366] via-[#128C7E] to-[#075E54] text-white shadow-xl shadow-emerald-950/25 border-2 border-white dark:border-slate-800 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer shrink-0"
              title={lang === 'ar' ? 'محادثة واتساب سريعة' : 'WhatsApp Instant Chat'}
              aria-label="WhatsApp Instant Chat"
            >
              <svg 
                viewBox="0 0 24 24" 
                className="w-6 h-6 fill-white drop-shadow-xs" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.05 20.16C10.57 20.16 9.12 19.76 7.85 19L7.55 18.82L4.43 19.64L5.26 16.6L5.06 16.29C4.24 14.98 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16ZM16.57 14.41C16.32 14.28 15.1 13.68 14.88 13.6C14.65 13.52 14.49 13.48 14.32 13.73C14.16 13.98 13.69 14.53 13.55 14.69C13.41 14.86 13.26 14.88 13.01 14.75C12.77 14.63 11.98 14.37 11.04 13.53C10.31 12.88 9.81 12.07 9.67 11.83C9.53 11.58 9.65 11.45 9.77 11.33C9.88 11.22 10.02 11.04 10.14 10.9C10.26 10.76 10.3 10.66 10.38 10.5C10.46 10.33 10.42 10.19 10.36 10.07C10.3 9.94 9.81 8.74 9.61 8.25C9.41 7.77 9.21 7.83 9.06 7.83C8.92 7.82 8.76 7.82 8.59 7.82C8.43 7.82 8.16 7.88 7.94 8.13C7.71 8.37 7.08 8.96 7.08 10.17C7.08 11.38 7.96 12.54 8.09 12.71C8.21 12.87 9.82 15.36 12.3 16.42C12.89 16.67 13.35 16.83 13.71 16.94C14.3 17.13 14.84 17.1 15.27 17.04C15.75 16.97 16.74 16.44 16.94 15.86C17.15 15.28 17.15 14.79 17.09 14.69C17.02 14.59 16.82 14.53 16.57 14.41Z" />
              </svg>
            </button>

            {/* The Text Badge: Side-anchored to the circle, always pointing towards the screen center */}
            <button 
              type="button"
              onClick={handleOpenWhatsApp}
              className={`absolute top-1/2 -translate-y-1/2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-900/40 text-xs font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap max-w-[calc(100vw-96px)] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 transition-all flex items-center gap-2 cursor-pointer active:scale-95 z-20 ${
                isLeftHalf ? 'left-full ml-3' : 'right-full mr-3'
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366] shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.05 20.16C10.57 20.16 9.12 19.76 7.85 19L7.55 18.82L4.43 19.64L5.26 16.6L5.06 16.29C4.24 14.98 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16ZM16.57 14.41C16.32 14.28 15.1 13.68 14.88 13.6C14.65 13.52 14.49 13.48 14.32 13.73C14.16 13.98 13.69 14.53 13.55 14.69C13.41 14.86 13.26 14.88 13.01 14.75C12.77 14.63 11.98 14.37 11.04 13.53C10.31 12.88 9.81 12.07 9.67 11.83C9.53 11.58 9.65 11.45 9.77 11.33C9.88 11.22 10.02 11.04 10.14 10.9C10.26 10.76 10.3 10.66 10.38 10.5C10.46 10.33 10.42 10.19 10.36 10.07C10.3 9.94 9.81 8.74 9.61 8.25C9.41 7.77 9.21 7.83 9.06 7.83C8.92 7.82 8.76 7.82 8.59 7.82C8.43 7.82 8.16 7.88 7.94 8.13C7.71 8.37 7.08 8.96 7.08 10.17C7.08 11.38 7.96 12.54 8.09 12.71C8.21 12.87 9.82 15.36 12.3 16.42C12.89 16.67 13.35 16.83 13.71 16.94C14.3 17.13 14.84 17.1 15.27 17.04C15.75 16.97 16.74 16.44 16.94 15.86C17.15 15.28 17.15 14.79 17.09 14.69C17.02 14.59 16.82 14.53 16.57 14.41Z" />
              </svg>
              <span className="truncate">{lang === 'ar' ? 'محادثة واتساب' : 'WhatsApp Chat'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SMART AUTO-COLLAPSING TOOLTIP ("تواصل معنا" / "Contact Us")                */}
        {/* Side-anchored to the main FAB: floats inward to screen center              */}
        {/* ========================================================================= */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 transition-all duration-300 ease-out overflow-hidden flex items-center pointer-events-none z-20 ${
            isLeftHalf ? 'left-full ml-3' : 'right-full mr-3'
          } ${
            shouldShowTooltip
              ? 'max-w-xs opacity-100 scale-100 pointer-events-auto' 
              : 'max-w-0 opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <div 
            onClick={toggleMenu}
            className="flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-3.5 py-2 rounded-2xl shadow-2xl border border-emerald-100 dark:border-emerald-900/40 text-xs font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap cursor-pointer hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 transition-colors"
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs text-slate-900 dark:text-white font-extrabold">
              {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </span>
            <button
              type="button"
              onClick={handleDismissNote}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ms-1"
              title={lang === 'ar' ? 'إغلاق' : 'Close'}
              aria-label="Dismiss tooltip"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LUXURY TRIGGER SQUIRCLE BUTTON (Draggable with Pointer Capture & Touch)    */}
        {/* ========================================================================= */}
        <button
          type="button"
          onPointerDown={handlePointerDown}
          onClick={(e) => {
            if (hasMovedRef.current) {
              e.preventDefault();
              e.stopPropagation();
              hasMovedRef.current = false;
              return;
            }
            toggleMenu(e);
          }}
          aria-expanded={isMenuOpen}
          aria-label={lang === 'ar' ? 'خيارات التواصل السريع' : 'Instant Contact Options'}
          className={`relative group p-1 focus:outline-none focus:ring-4 focus:ring-emerald-400/30 rounded-[22px] transition-transform select-none touch-none ${
            isDragging ? 'scale-105 shadow-2xl opacity-95 cursor-grabbing' : 'active:scale-95 cursor-grab'
          }`}
          title={lang === 'ar' ? 'اسحب لتحريك الزر لأي مكان، أو انقر لفتح الخيارات' : 'Drag anywhere on screen, or click to open options'}
        >
          {/* Layer 1: Ambient Glow */}
          <div className={`absolute inset-1 rounded-[22px] bg-emerald-400/35 backdrop-blur-sm pointer-events-none transition-all duration-500 ${
            isMenuOpen ? 'rotate-12 scale-105' : 'rotate-6 scale-100 group-hover:rotate-12 group-hover:scale-105'
          }`} />

          {/* Layer 2: Secondary Glow */}
          <div className={`absolute inset-1 rounded-[22px] bg-teal-500/25 pointer-events-none transition-all duration-500 ${
            isMenuOpen ? '-rotate-6 scale-100' : '-rotate-3 scale-95 group-hover:-rotate-6 group-hover:scale-100'
          }`} />

          {/* Layer 3: Main Foreground Luxury Squircle Button */}
          <div className={`relative w-14 h-14 rounded-[20px] bg-gradient-to-br from-[#25D366] via-[#128C7E] to-[#075E54] text-white shadow-2xl shadow-emerald-950/35 border border-emerald-200/40 flex items-center justify-center transition-all duration-300 ${
            isMenuOpen ? 'scale-95 bg-gradient-to-br from-slate-800 to-slate-900 ring-2 ring-emerald-400' : 'group-hover:scale-105'
          } overflow-hidden`}>
            {/* Subtle Glass Highlight Reflex */}
            <div className="absolute top-0 start-0 end-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-[19px] pointer-events-none" />

            {/* Icon Switcher: X when menu is open, WhatsApp when menu is closed */}
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white drop-shadow-xs relative z-10 transition-transform duration-300 animate-in zoom-in-75" />
            ) : (
              <svg 
                viewBox="0 0 24 24" 
                className="w-7 h-7 fill-white drop-shadow-xs relative z-10 transition-transform duration-300 group-hover:scale-110" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.05 20.16C10.57 20.16 9.12 19.76 7.85 19L7.55 18.82L4.43 19.64L5.26 16.6L5.06 16.29C4.24 14.98 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16ZM16.57 14.41C16.32 14.28 15.1 13.68 14.88 13.6C14.65 13.52 14.49 13.48 14.32 13.73C14.16 13.98 13.69 14.53 13.55 14.69C13.41 14.86 13.26 14.88 13.01 14.75C12.77 14.63 11.98 14.37 11.04 13.53C10.31 12.88 9.81 12.07 9.67 11.83C9.53 11.58 9.65 11.45 9.77 11.33C9.88 11.22 10.02 11.04 10.14 10.9C10.26 10.76 10.3 10.66 10.38 10.5C10.46 10.33 10.42 10.19 10.36 10.07C10.3 9.94 9.81 8.74 9.61 8.25C9.41 7.77 9.21 7.83 9.06 7.83C8.92 7.82 8.76 7.82 8.59 7.82C8.43 7.82 8.16 7.88 7.94 8.13C7.71 8.37 7.08 8.96 7.08 10.17C7.08 11.38 7.96 12.54 8.09 12.71C8.21 12.87 9.82 15.36 12.3 16.42C12.89 16.67 13.35 16.83 13.71 16.94C14.3 17.13 14.84 17.1 15.27 17.04C15.75 16.97 16.74 16.44 16.94 15.86C17.15 15.28 17.15 14.79 17.09 14.69C17.02 14.59 16.82 14.53 16.57 14.41Z" />
              </svg>
            )}
          </div>

          {/* Live Active Online Ping Dot (Only when menu is closed) */}
          {!isMenuOpen && (
            <span className="absolute top-0 end-0 flex h-4 w-4 z-20 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-85" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-slate-800 shadow-xs" />
            </span>
          )}
        </button>
      </div>
    </>
  );
};
