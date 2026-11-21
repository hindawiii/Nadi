import React from 'react';
import {
  CheckCircle2,
  Gem,
  Gift,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
  X,
} from 'lucide-react';
import type { Product } from '../../data/siteConfig';
import type { ToastData } from '../../context/CommerceContext';

interface DiamondBundleModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
  isRtl: boolean;
  targetBundle: Product | undefined;
  promoBadge?: { ar: string; en: string };
  qty: number;
  setQty: React.Dispatch<React.SetStateAction<number>>;
  convertPrice: (usdPrice: number) => { text: string };
  addToCart: (product: Product, quantity?: number) => void;
  showToast: (msgOrData: string | ToastData) => void;
  setIsCartOpen: (open: boolean) => void;
  openProductPDP: (product: Product) => void;
}

export const DiamondBundleModal: React.FC<DiamondBundleModalProps> = ({
  isOpen,
  onClose,
  lang,
  isRtl,
  targetBundle,
  promoBadge,
  qty,
  setQty,
  convertPrice,
  addToCart,
  showToast,
  setIsCartOpen,
  openProductPDP,
}) => {
  if (!isOpen || !targetBundle) return null;

  const currentPriceObj = convertPrice(targetBundle.basePriceUSD * qty);
  const originalPriceObj = targetBundle.originalPriceUSD
    ? convertPrice(targetBundle.originalPriceUSD * qty)
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative max-w-xl w-full bg-white rounded-3xl shadow-2xl border border-purple-200 overflow-hidden my-8 text-slate-900 text-start">
        <div className="bg-gradient-to-r from-purple-950 via-[#5A3E7A] to-pink-950 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <Gem className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-pink-200 block">
                {isRtl ? 'عرض خاص' : 'Special Offer'}
              </span>
              <h3 className="text-base sm:text-lg font-black leading-snug">
                {(
                  promoBadge
                    ? promoBadge[lang]
                    : isRtl
                      ? 'عرض البوكس المتكامل'
                      : 'Complete Box Offer'
                ).replace(/\s*[\u{1F48E}\u2728\u2B50\u{1F31F}\u2605\u2726]/gu, '')}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="flex gap-4 items-center p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
            <img
              src={targetBundle.images[0]}
              alt={targetBundle.name[lang]}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-purple-200 shadow-sm shrink-0"
            />
            <div className="space-y-1">
              <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-pink-600 text-white">
                {isRtl ? 'خصم 25% فوري' : 'Instant 25% OFF'}
              </span>
              <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                {targetBundle.name[lang]}
              </h4>
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-black text-[#5A3E7A]">
                  {currentPriceObj.text}
                </span>
                {originalPriceObj && (
                  <span className="text-xs text-slate-400 line-through">
                    {originalPriceObj.text}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <h5 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-purple-600" />
              <span>{isRtl ? 'محتويات بوكس العناية المتكامل 4 في 1:' : 'Included In Routine Box 4-in-1:'}</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isRtl ? '1. مرطب الهيالورونيك المكثف (حجم كامل)' : '1. Hyaluronic Moisturizer (Full)'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isRtl ? '2. سيروم فيتامين سي النقي (حجم كامل)' : '2. Pure Vitamin C Serum (Full)'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isRtl ? '3. كريم لافندر الليلي للترميم (حجم كامل)' : '3. Lavender Night Cream (Full)'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-200 text-pink-900 flex items-center gap-2 font-bold">
                <Gift className="w-4 h-4 text-pink-600 shrink-0" />
                <span>{isRtl ? '4. حقيبة تجميل مخملية + عينات سفرية مجاناً' : '4. Free Luxury Velvet Pouch'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isRtl ? 'ضمان نقاء نباتي 100%' : '100% Vegan Certified'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
              <Truck className="w-3.5 h-3.5" />
              {isRtl ? 'شحن سريع ومجاني' : 'Free Express Delivery'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isRtl ? 'نتائج مثبتة خلال 14 يوماً' : '14-Day Proven Radiance'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs sm:text-sm font-bold text-slate-700">
              {isRtl ? 'الكمية المطلوبة من البوكس:' : 'Bundle Quantity:'}
            </span>
            <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                className="p-1.5 rounded-lg bg-white shadow-xs hover:bg-slate-200 disabled:opacity-40 transition-all min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-black text-sm px-2 min-w-[24px] text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                className="p-1.5 rounded-lg bg-white shadow-xs hover:bg-slate-200 transition-all min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              addToCart(targetBundle, qty);
              onClose();
              showToast({
                message: isRtl
                  ? `تمت إضافة ${qty} من بوكس نَدِي الماسي لسلتك بنجاح!`
                  : `Added ${qty} Diamond Box to your cart!`,
                type: 'cart_add',
              });
              setIsCartOpen(true);
            }}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-900 to-pink-900 text-white hover:from-purple-950 hover:to-pink-950 font-black text-xs sm:text-sm shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            <span>
              {isRtl
                ? `أضيفي البوكس للسلة فورا (${currentPriceObj.text})`
                : `Add Bundle to Cart (${currentPriceObj.text})`}
            </span>
          </button>

          <button
            onClick={() => {
              onClose();
              openProductPDP(targetBundle);
            }}
            className="w-full sm:w-auto py-3 px-4 rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-slate-200 font-bold text-xs transition-all text-center min-h-[44px] flex items-center justify-center cursor-pointer"
          >
            {isRtl ? 'عرض تفاصيل المنتج في صفحة كاملة' : 'View Full Details Page'}
          </button>
        </div>
      </div>
    </div>
  );
};
