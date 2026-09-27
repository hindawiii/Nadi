import React from 'react';
import { Truck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

interface FreeShippingBarProps {
  thresholdUSD?: number;
  className?: string;
  variant?: 'compact' | 'full';
}

/**
 * FreeShippingBar:
 * A smart dynamic progress bar inspired by luxury retailers (Sephora, Farfetch)
 * that motivates customers to achieve royal free delivery, increasing AOV.
 */
export const FreeShippingBar: React.FC<FreeShippingBarProps> = ({
  thresholdUSD = 50,
  className = '',
  variant = 'full'
}) => {
  const { lang, cart, activeData, formatPrice, convertPrice } = useCommerce();
  const isRtl = lang === 'ar';

  // Calculate cart subtotal in USD
  const subtotalUSD = cart.reduce((acc, item) => acc + item.product.basePriceUSD * item.quantity, 0);
  const remainingUSD = Math.max(thresholdUSD - subtotalUSD, 0);
  const progressPercent = Math.min(Math.round((subtotalUSD / thresholdUSD) * 100), 100);
  const isQualified = subtotalUSD >= thresholdUSD;

  const thresholdFormatted = formatPrice(convertPrice(thresholdUSD));
  const remainingFormatted = formatPrice(convertPrice(remainingUSD));

  if (variant === 'compact') {
    if (cart.length === 0) {
      return (
        <div className={`flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-medium text-purple-50 truncate ${className}`}>
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-300 animate-pulse" />
          <span className="truncate">{activeData.topAnnouncement[lang]}</span>
        </div>
      );
    }

    return (
      <div className={`flex items-center gap-2 text-[10px] sm:text-xs font-bold ${className}`}>
        <Truck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
        {isQualified ? (
          <span className="text-emerald-300 flex items-center gap-1 truncate">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{lang === 'ar' ? 'مبارك! حصلتِ على شحن مجاني ملكي لكافة طلباتك 🎉' : 'Unlocked Royal Free Shipping! 🎉'}</span>
          </span>
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-white truncate">
              {lang === 'ar' 
                ? `أنتِ على بعد ${remainingFormatted} فقط من الشحن المجاني الملكي!`
                : `Only ${remainingFormatted} away from Free Royal Shipping!`}
            </span>
            <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden shrink-0 hidden xs:block">
              <div 
                className="h-full bg-gradient-to-r from-amber-300 to-emerald-400 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`p-4 sm:p-5 bg-gradient-to-br from-purple-50/80 via-white to-amber-50/50 rounded-2xl sm:rounded-3xl border border-purple-100/80 shadow-xs space-y-3 ${className}`}>
      {/* Title & Motivational Message */}
      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            isQualified ? 'bg-emerald-500 text-white' : 'bg-[#5A3E7A] text-amber-300'
          }`}>
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-slate-800 block">
              {isQualified
                ? (lang === 'ar' ? 'تهانينا! شحن ملكي مجاني 🚚' : 'Congratulations! Free Royal Delivery 🚚')
                : (lang === 'ar' ? 'شحن ملكي مجاني متاح' : 'Royal Free Delivery Available')}
            </span>
            <p className="text-[11px] text-slate-500">
              {isQualified
                ? (lang === 'ar' ? 'تم تطبيق الشحن المجاني التلقائي على كافة طلبك' : 'Royal free delivery automatically applied to your entire order')
                : (lang === 'ar'
                    ? `أضيفي منتجات بقيمة ${remainingFormatted} للحصول على شحن مجاني (للطلبات فوق ${thresholdFormatted})`
                    : `Add ${remainingFormatted} more to unlock free shipping (on orders over ${thresholdFormatted})`)}
            </p>
          </div>
        </div>

        <span className={`text-xs font-black px-2.5 py-1 rounded-full shrink-0 ${
          isQualified ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-[#5A3E7A]'
        }`}>
          {progressPercent}%
        </span>
      </div>

      {/* Dynamic Animated Progress Bar */}
      <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
        <div 
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            isQualified 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
              : 'bg-gradient-to-r from-[#5A3E7A] via-purple-600 to-amber-400'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
