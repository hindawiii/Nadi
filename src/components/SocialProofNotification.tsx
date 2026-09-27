import React, { useState, useEffect } from 'react';
import { CheckCircle2, X, ShoppingBag, MapPin, Sparkles } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

interface RecentOrder {
  id: string;
  name: { ar: string; en: string };
  location: { ar: string; en: string };
  productName: { ar: string; en: string };
  productImage: string;
  timeAgo: { ar: string; en: string };
}

export const SocialProofNotification: React.FC = () => {
  const { lang, activeData, currentRoute, sectionsControl, navigateTo, openProductPDP } = useCommerce();
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissedByUser, setIsDismissedByUser] = useState(false);

  const isRtl = lang === 'ar';

  // Realistic recent customer orders
  const recentOrders: RecentOrder[] = [
    {
      id: 'ord-1',
      name: { ar: 'سارة م.', en: 'Sarah M.' },
      location: { ar: 'الرياض، السعودية', en: 'Riyadh, KSA' },
      productName: { ar: 'سيروم فيتامين سي النقي', en: 'Pure Vitamin C Serum' },
      productImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80',
      timeAgo: { ar: 'منذ 3 دقائق', en: '3 mins ago' }
    },
    {
      id: 'ord-2',
      name: { ar: 'فاطمة ع.', en: 'Fatima A.' },
      location: { ar: 'أم درمان، السودان', en: 'Omdurman, Sudan' },
      productName: { ar: 'مرطب الهيالورونيك المكثف', en: 'Intense Hyaluronic Moisturizer' },
      productImage: 'https://images.unsplash.com/photo-1608248597359-59754b2d354a?auto=format&fit=crop&w=150&q=80',
      timeAgo: { ar: 'منذ 7 دقائق', en: '7 mins ago' }
    },
    {
      id: 'ord-3',
      name: { ar: 'نورة الدوسري', en: 'Noura Al-Dossary' },
      location: { ar: 'دبي، الإمارات', en: 'Dubai, UAE' },
      productName: { ar: 'كريم لافندر الليلي للترميم', en: 'Lavender Night Cream' },
      productImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=150&q=80',
      timeAgo: { ar: 'منذ 14 دقيقة', en: '14 mins ago' }
    },
    {
      id: 'ord-4',
      name: { ar: 'ريهام خ.', en: 'Reham K.' },
      location: { ar: 'الخرطوم، السودان', en: 'Khartoum, Sudan' },
      productName: { ar: 'مجموعة النضارة والترميم المتكاملة', en: 'Complete Radiance Bundle' },
      productImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=150&q=80',
      timeAgo: { ar: 'منذ 22 دقيقة', en: '22 mins ago' }
    }
  ];

  // Cycling loop: Show for 5.5s, hide for 10s
  useEffect(() => {
    if (isDismissedByUser) return;
    if (sectionsControl && sectionsControl.socialProof === false) return;

    // Initial appearance after 4 seconds of entering store
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    const cycleInterval = setInterval(() => {
      // Hide current
      setIsVisible(false);

      // Wait 9 seconds, then show next
      setTimeout(() => {
        if (!isDismissedByUser) {
          setCurrentIndex(prev => (prev + 1) % recentOrders.length);
          setIsVisible(true);

          // Auto-hide after 5.5s
          setTimeout(() => {
            setIsVisible(false);
          }, 5500);
        }
      }, 9000);
    }, 15000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(cycleInterval);
    };
  }, [isDismissedByUser, sectionsControl]);

  // Don't show in checkout/login or developer mode
  if (currentRoute === 'cart' || currentRoute === 'login' || currentRoute === 'developer') return null;
  if (sectionsControl && sectionsControl.socialProof === false) return null;
  if (isDismissedByUser) return null;

  const currentOrder = recentOrders[currentIndex];

  const handleClickProduct = () => {
    const prod = activeData.products.find(p => 
      p.name.ar === currentOrder.productName.ar || p.name.en === currentOrder.productName.en
    );
    if (prod) {
      openProductPDP(prod);
    } else {
      navigateTo('store');
    }
    setIsVisible(false);
  };

  return (
    <div
      className={`fixed bottom-20 sm:bottom-6 end-4 sm:end-24 z-35 max-w-xs sm:max-w-sm transition-all duration-400 ease-out select-none ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
      }`}
    >
      <div 
        onClick={handleClickProduct}
        className="bg-white/95 backdrop-blur-xl border border-purple-100/90 shadow-2xl rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 cursor-pointer hover:border-purple-300 transition-all group"
      >
        {/* Product Thumbnail with Verified Dot */}
        <div className="relative shrink-0">
          <img
            src={currentOrder.productImage}
            alt={currentOrder.productName[lang]}
            className="w-12 h-12 rounded-xl object-cover ring-1 ring-purple-100 shadow-2xs group-hover:scale-105 transition-transform"
          />
          <span className="absolute -bottom-1 -end-1 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center ring-2 ring-white">
            <CheckCircle2 className="w-2.5 h-2.5" />
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 text-start">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <span className="font-extrabold text-slate-800">{currentOrder.name[lang]}</span>
            <span>•</span>
            <span className="flex items-center gap-0.5 text-slate-500 truncate">
              <MapPin className="w-2.5 h-2.5 text-purple-600 shrink-0" />
              <span>{currentOrder.location[lang]}</span>
            </span>
          </div>

          <p className="text-xs font-bold text-slate-900 truncate mt-0.5 group-hover:text-[#5A3E7A] transition-colors">
            {lang === 'ar' ? 'طلبت للتو: ' : 'Just ordered: '}
            <span className="text-[#5A3E7A]">{currentOrder.productName[lang]}</span>
          </p>

          <span className="text-[10px] text-slate-400 mt-0.5 block">
            {currentOrder.timeAgo[lang]}
          </span>
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
            setIsDismissedByUser(true);
          }}
          className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors shrink-0"
          aria-label="Dismiss"
          title={lang === 'ar' ? 'إغلاق الإشعار' : 'Dismiss'}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
