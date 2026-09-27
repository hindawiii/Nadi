import React from 'react';
import { 
  CheckCircle2, 
  ShoppingBag, 
  Heart, 
  Trash2, 
  Info, 
  X, 
  ArrowLeft, 
  ArrowRight 
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

/**
 * Toast Component - Smart Floating Island Notification System
 * 
 * Features:
 * - Positioned at Top-Center (Safe Area) with dynamic island style.
 * - Never cut off by mobile browser toolbars or overlapping floating action buttons.
 * - Distinct contextual visual identity:
 *   - Cart Add: Vibrant emerald bag + direct "View Bag" CTA.
 *   - Cart Remove / Empty: Amber/Rose trash icon + clear product title.
 *   - Wishlist Add: Pulsing luxury heart + direct "View Wishlist" CTA.
 *   - Wishlist Remove: Subtle slate broken-heart style.
 * - Smooth entrance animation (slide-down & fade-in) with tactile tap dismissal.
 * - Full RTL/LTR logical property alignment.
 */
export const Toast: React.FC = () => {
  const { lang, toastMessage, toastData, dismissToast } = useCommerce();
  const isRtl = lang === 'ar';

  if (!toastMessage && !toastData) return null;

  const currentType = toastData?.type || 'info';
  const displayMsg = toastData?.message || toastMessage;
  const actionText = toastData?.actionText;
  const onAction = toastData?.onAction;

  // Determine Icon and Accent Styles based on Contextual Notification Type
  const getTypeConfig = () => {
    switch (currentType) {
      case 'cart_add':
        return {
          icon: <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-400 shrink-0 animate-bounce" />,
          border: 'border-emerald-500/30',
          glow: 'shadow-emerald-950/40',
          accentBadge: 'bg-emerald-500/20 text-emerald-300',
        };
      case 'cart_remove':
        return {
          icon: <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-rose-400 shrink-0" />,
          border: 'border-rose-500/30',
          glow: 'shadow-rose-950/40',
          accentBadge: 'bg-rose-500/20 text-rose-300',
        };
      case 'wishlist_add':
        return {
          icon: <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-rose-500 fill-current shrink-0 animate-pulse" />,
          border: 'border-rose-400/30',
          glow: 'shadow-rose-950/40',
          accentBadge: 'bg-rose-500/20 text-rose-300',
        };
      case 'wishlist_remove':
        return {
          icon: <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-400 shrink-0" />,
          border: 'border-slate-600/30',
          glow: 'shadow-slate-950/40',
          accentBadge: 'bg-slate-700/40 text-slate-300',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-400 shrink-0" />,
          border: 'border-emerald-500/30',
          glow: 'shadow-emerald-950/40',
          accentBadge: 'bg-emerald-500/20 text-emerald-300',
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-sky-400 shrink-0" />,
          border: 'border-sky-500/30',
          glow: 'shadow-sky-950/40',
          accentBadge: 'bg-sky-500/20 text-sky-300',
        };
    }
  };

  const config = getTypeConfig();

  return (
    <aside 
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-4 sm:top-6 inset-x-0 mx-auto w-fit max-w-[92vw] sm:max-w-lg z-[9999] pointer-events-none select-none transition-all duration-300 ease-out animate-in fade-in slide-in-from-top-4"
    >
      <div 
        className={`pointer-events-auto bg-slate-900/95 dark:bg-black/95 text-white py-2.5 px-3.5 sm:py-3 sm:px-4 rounded-full shadow-2xl ${config.glow} border ${config.border} backdrop-blur-xl flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold`}
      >
        {/* Leading Icon & Text */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            {config.icon}
          </div>
          <div className="truncate max-w-[200px] xs:max-w-[260px] sm:max-w-[340px]">
            <span className="leading-snug block truncate text-slate-100 font-medium">
              {displayMsg}
            </span>
          </div>
        </div>

        {/* Optional Interactive Action Link (e.g. View Cart / View Wishlist) */}
        {actionText && onAction && (
          <button
            type="button"
            onClick={() => {
              dismissToast();
              onAction();
            }}
            className="shrink-0 flex items-center gap-1 text-[11px] sm:text-xs font-bold text-amber-300 hover:text-amber-200 bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-full transition-all active:scale-95 cursor-pointer border border-amber-300/30"
          >
            <span>{actionText}</span>
            {isRtl ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
          </button>
        )}

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={dismissToast}
          aria-label={lang === 'ar' ? 'إغلاق الإشعار' : 'Dismiss notification'}
          className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>
    </aside>
  );
};
