import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShoppingBag, Sparkles } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

interface OrderProof {
  customerName: { ar: string; en: string };
  city: { ar: string; en: string };
  productIndex: number;
  timeAgo: { ar: string; en: string };
}

const mockOrders: OrderProof[] = [
  { customerName: { ar: 'ريم القحطاني', en: 'Reem Al-Qahtani' }, city: { ar: 'الرياض', en: 'Riyadh' }, productIndex: 0, timeAgo: { ar: 'منذ دقيقتين', en: '2 mins ago' } },
  { customerName: { ar: 'سارة المنصور', en: 'Sarah Al-Mansoor' }, city: { ar: 'جدة', en: 'Jeddah' }, productIndex: 1, timeAgo: { ar: 'منذ 5 دقائق', en: '5 mins ago' } },
  { customerName: { ar: 'فاطمة الكعبي', en: 'Fatima Al-Kaabi' }, city: { ar: 'دبي', en: 'Dubai' }, productIndex: 2, timeAgo: { ar: 'منذ 8 دقائق', en: '8 mins ago' } },
  { customerName: { ar: 'نورة عثمان', en: 'Noura Osman' }, city: { ar: 'الخرطوم', en: 'Khartoum' }, productIndex: 3, timeAgo: { ar: 'منذ 3 دقائق', en: '3 mins ago' } },
  { customerName: { ar: 'هند الشمري', en: 'Hind Al-Shammari' }, city: { ar: 'الدمام', en: 'Dammam' }, productIndex: 0, timeAgo: { ar: 'منذ 11 دقيقة', en: '11 mins ago' } },
  { customerName: { ar: 'مريم الأحمد', en: 'Mariam Al-Ahmad' }, city: { ar: 'الكويت', en: 'Kuwait City' }, productIndex: 1, timeAgo: { ar: 'منذ 4 دقائق', en: '4 mins ago' } },
];

/**
 * SocialProofNotification:
 * Luxury, non-intrusive social proof toast showing recent verified purchases
 * to build trust and increase conversion rates.
 */
export const SocialProofNotification: React.FC = () => {
  const { lang, activeData, currentRoute, navigateTo, openProductPDP } = useCommerce();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const products = activeData.products;

  useEffect(() => {
    if (isDismissed || products.length === 0 || currentRoute === 'developer' || currentRoute === 'admin') {
      setIsVisible(false);
      return;
    }

    // Initial delay before first popup appears (8 seconds)
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 8000);

    return () => clearTimeout(initialTimer);
  }, [isDismissed, products.length, currentRoute]);

  // Periodic rotation
  useEffect(() => {
    if (isDismissed || isPaused || currentRoute === 'developer' || currentRoute === 'admin') return;

    const interval = setInterval(() => {
      setIsVisible(prev => {
        if (prev) {
          // Hide currently visible toast
          return false;
        } else {
          // Switch to next order and show
          setCurrentIndex(idx => (idx + 1) % mockOrders.length);
          return true;
        }
      });
    }, 7000);

    return () => clearInterval(interval);
  }, [isDismissed, isPaused, currentRoute]);

  if (!isVisible || isDismissed || products.length === 0 || currentRoute === 'developer' || currentRoute === 'admin') {
    return null;
  }

  const order = mockOrders[currentIndex];
  const targetProduct = products[order.productIndex % products.length] || products[0];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="fixed bottom-22 sm:bottom-6 start-4 sm:start-22 z-35 max-w-[340px] sm:max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-500 select-none"
    >
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 shadow-xl flex items-center gap-3 relative group">
        {/* Product Image Thumbnail */}
        <div 
          onClick={() => {
            openProductPDP(targetProduct);
          }}
          className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer border border-slate-200"
        >
          <img
            src={targetProduct.images[0]}
            alt={targetProduct.name[lang]}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
          />
          <span className="absolute bottom-0 inset-x-0 bg-emerald-600/90 text-[8px] text-white font-bold text-center py-0.5 leading-none">
            {lang === 'ar' ? 'طلب مؤكد' : 'Verified'}
          </span>
        </div>

        {/* Order Details */}
        <div 
          onClick={() => {
            openProductPDP(targetProduct);
          }}
          className="flex-1 min-w-0 cursor-pointer space-y-0.5"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-900 truncate">
              {order.customerName[lang]}
            </span>
            <span className="text-[10px] text-slate-500 font-medium shrink-0">
              ({order.city[lang]})
            </span>
          </div>

          <p className="text-[11px] text-slate-600 truncate font-medium">
            {lang === 'ar' ? 'طلبت للتو:' : 'just purchased:'}{' '}
            <strong className="text-[#5A3E7A]">{targetProduct.name[lang]}</strong>
          </p>

          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span>{order.timeAgo[lang]}</span>
            <span>•</span>
            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>{lang === 'ar' ? 'تم الشحن' : 'Dispatched'}</span>
            </span>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
            setIsDismissed(true);
          }}
          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
          title={lang === 'ar' ? 'إغلاق الإشعار' : 'Dismiss notification'}
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
