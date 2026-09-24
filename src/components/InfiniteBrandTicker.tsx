import React from 'react';
import { Sparkles } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

interface InfiniteBrandTickerProps {
  className?: string;
}

export const InfiniteBrandTicker: React.FC<InfiniteBrandTickerProps> = ({ className = '' }) => {
  const { lang, activeData } = useCommerce();
  const isRtl = lang === 'ar';

  // Repetition segments to ensure continuous seamless infinite loop with zero gaps
  const items = [
    {
      brand: activeData.storeName.ar || 'نَـــــدِي',
      slogan: activeData.storeSlogan.ar || 'إشراقة طبيعية، تليق بك.',
      isArabic: true,
      tag: 'جمال ونقاء نباتي',
    },
    {
      brand: activeData.storeName.en || 'NADI',
      slogan: activeData.storeSlogan.en || 'Natural radiance, made for you.',
      isArabic: false,
      tag: 'Pure Botanical Radiance',
    },
    {
      brand: activeData.storeName.ar || 'نَـــــدِي',
      slogan: 'عناية فائقة تلائم رقة بشرتك',
      isArabic: true,
      tag: 'خلاصات طبيعية 100%',
    },
    {
      brand: activeData.storeName.en || 'NADI',
      slogan: activeData.storeSlogan.en || 'Natural radiance, made for you.',
      isArabic: false,
      tag: 'Dermatologically Tested',
    },
  ];

  // We duplicate the list to create the seamless mathematical continuous loop (Track A + Track B)
  const marqueeList = [...items, ...items];

  const handleScrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      aria-label={isRtl ? "شريط العلامة والشعار اللانهائي" : "Brand and Slogan Infinite Ticker"}
      className={`relative w-full overflow-hidden bg-gradient-to-r from-[#3D2355] via-[#5A3E7A] to-[#3D2355] text-white py-3 sm:py-3.5 border-y border-amber-300/25 shadow-md select-none group cursor-pointer ${className}`}
      onClick={handleScrollToProducts}
      role="region"
    >
      {/* Subtle luxury background shimmer accent */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-300/10 via-transparent to-transparent pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Screen-reader accessible announcement */}
      <span className="sr-only">
        {activeData.storeName[lang]} - {activeData.storeSlogan[lang]}
      </span>

      {/* Edge gradient mask for smooth fading */}
      <div className="mask-fade-edges overflow-hidden relative w-full">
        <div 
          className={`flex items-center gap-6 sm:gap-10 w-max shrink-0 pause-on-hover ${
            isRtl ? 'animate-marquee-rtl' : 'animate-marquee-ltr'
          }`}
          aria-hidden="true"
        >
          {marqueeList.map((item, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-3 sm:gap-5 shrink-0 px-2 group/item"
            >
              {/* Brand Name with Haute-Couture Styling */}
              <span className="font-extrabold tracking-widest text-amber-200 text-sm sm:text-base drop-shadow-xs transition-colors group-hover/item:text-amber-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping inline-block" />
                {item.brand}
              </span>

              {/* Sparkling Four-Point Star Separator */}
              <span className="text-amber-300/70 text-xs sm:text-sm font-light select-none">
                ✦
              </span>

              {/* Slogan */}
              <span className="text-xs sm:text-sm md:text-[15px] font-semibold tracking-wide text-purple-50 group-hover/item:text-white transition-colors">
                {item.slogan}
              </span>

              {/* Subtle Botanical / Radiance Badge */}
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white/10 text-amber-100/90 border border-white/10">
                <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                {item.tag}
              </span>

              {/* Trailing Elegant Divider */}
              <div className="w-6 sm:w-10 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent shrink-0 ms-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Subtle hover hint indicator */}
      <div className="absolute end-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1.5 text-[10px] text-amber-200/60 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-medium px-2 py-0.5 rounded-full bg-black/20 backdrop-blur-xs">
        <span>{isRtl ? 'اضغط للاستكشاف' : 'Click to explore'}</span>
      </div>
    </section>
  );
};
