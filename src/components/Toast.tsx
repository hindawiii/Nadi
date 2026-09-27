import React from 'react';
import { 
  CheckCircle2, 
  Heart, 
  Trash2, 
  Info, 
  X, 
  ArrowLeft, 
  ArrowRight 
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { StoreCartIcon } from './common/StoreCartIcon';

/**
 * Toast Component - Luxe Pro Floating Island Notification System
 * 
 * Features:
 * - Refined Pearl/Crystal Glass aesthetic (Soft white backdrop-blur-2xl with ambient glow).
 * - Ultra-comfortable on the eyes, eliminating harsh dark bars on light boutique themes.
 * - Perfectly synchronized single-source-of-truth StoreCartIcon matching the entire storefront.
 * - Non-clipping typography with smart flexible layout.
 * - Top-Center Safe Area positioning with smooth micro-interactions.
 */
export const Toast: React.FC = () => {
  const { lang, toastMessage, toastData, dismissToast } = useCommerce();
  const isRtl = lang === 'ar';

  if (!toastMessage && !toastData) return null;

  const currentType = toastData?.type || 'info';
  const displayMsg = toastData?.message || toastMessage;
  const actionText = toastData?.actionText;
  const onAction = toastData?.onAction;

  // Determine Type-Specific Luxe Color Palettes & Icons
  const getTypeConfig = () => {
    switch (currentType) {
      case 'cart_add':
        return {
          icon: <StoreCartIcon size="sm" className="w-4.5 h-4.5 text-emerald-700 shrink-0" />,
          badgeBg: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
          border: 'border-emerald-200/90 hover:border-emerald-300',
          glow: 'shadow-xl shadow-emerald-950/5',
          btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs',
        };
      case 'cart_remove':
        return {
          icon: <Trash2 className="w-4 h-4 text-rose-600 shrink-0" />,
          badgeBg: 'bg-rose-50 text-rose-800 border border-rose-200/80',
          border: 'border-rose-200/90 hover:border-rose-300',
          glow: 'shadow-xl shadow-rose-950/5',
          btnBg: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs',
        };
      case 'wishlist_add':
        return {
          icon: <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0 animate-pulse" />,
          badgeBg: 'bg-rose-50 text-rose-800 border border-rose-200/80',
          border: 'border-rose-200/90 hover:border-rose-300',
          glow: 'shadow-xl shadow-rose-950/5',
          btnBg: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs',
        };
      case 'wishlist_remove':
        return {
          icon: <Heart className="w-4 h-4 text-slate-400 shrink-0" />,
          badgeBg: 'bg-slate-100 text-slate-700 border border-slate-200',
          border: 'border-slate-200 hover:border-slate-300',
          glow: 'shadow-xl shadow-slate-950/5',
          btnBg: 'bg-slate-700 hover:bg-slate-800 text-white shadow-xs',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />,
          badgeBg: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
          border: 'border-emerald-200/90 hover:border-emerald-300',
          glow: 'shadow-xl shadow-emerald-950/5',
          btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs',
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-4.5 h-4.5 text-[#5A3E7A] shrink-0" />,
          badgeBg: 'bg-purple-50 text-[#5A3E7A] border border-purple-200/80',
          border: 'border-purple-200/80 hover:border-purple-300',
          glow: 'shadow-xl shadow-purple-950/5',
          btnBg: 'bg-[#5A3E7A] hover:bg-[#483162] text-white shadow-xs',
        };
    }
  };

  const config = getTypeConfig();

  return (
    <aside 
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-3 sm:top-5 inset-x-0 mx-auto w-fit max-w-[94vw] sm:max-w-xl z-[9999] pointer-events-none select-none transition-all duration-300 ease-out animate-in fade-in slide-in-from-top-3"
    >
      <div 
        className={`pointer-events-auto bg-white/95 text-slate-900 py-2 px-3 sm:py-2.5 sm:px-4 rounded-2xl sm:rounded-full shadow-2xl ${config.glow} border ${config.border} backdrop-blur-2xl flex items-center justify-between gap-2.5 sm:gap-3.5 ring-1 ring-black/5`}
      >
        {/* Leading Unified Icon & Clean Context Text */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${config.badgeBg}`}>
            {config.icon}
          </div>
          <div className="truncate max-w-[190px] xs:max-w-[260px] sm:max-w-[320px]">
            <span className="leading-snug block truncate text-slate-800 font-bold text-xs sm:text-sm">
              {displayMsg}
            </span>
          </div>
        </div>

        {/* Action Link Button (e.g. View Cart / View Bag) */}
        {actionText && onAction && (
          <button
            type="button"
            onClick={() => {
              dismissToast();
              onAction();
            }}
            className={`shrink-0 flex items-center gap-1.5 text-[11px] sm:text-xs font-black px-3 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer min-h-[34px] ${config.btnBg}`}
          >
            <span>{actionText}</span>
            {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        )}

        {/* Soft Dismiss Button */}
        <button
          type="button"
          onClick={dismissToast}
          aria-label={lang === 'ar' ? 'إغلاق الإشعار' : 'Dismiss notification'}
          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>
    </aside>
  );
};

