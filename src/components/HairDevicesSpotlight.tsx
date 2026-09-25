import React, { useState, useRef } from 'react';
import { 
  ArrowUp, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { Product } from '../data/siteConfig';
import { ProductCard } from './ProductCard';

// High-fidelity hair styling devices with full specifications for PDP & cart
export const hairStylingDevices: Product[] = [
  {
    id: "hd-01",
    name: { 
      ar: "جهاز تجعيد الشعر من سل تيك - SLTK-12", 
      en: "Siltek Triple Barrel Hair Waver - SLTK-12" 
    },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 29.44, // Equivalent to ~110.4 SAR / SDG
    originalPriceUSD: 46.00, // Equivalent to ~172.5 SAR
    discountPercentage: 36,
    stock: 8,
    badge: { ar: "وفر 36%", en: "36% OFF" },
    rating: 5.0,
    reviewsCount: 142,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "مكواة تجعيد وتمويج الشعر الثلاثية الأسطوانات بتورمالين السيراميك لحماية ألياف الشعر من الحرارة العالية ومنحه تمويجات شاطئية عريضة ولامعة في ثوانٍ معدودة.",
        en: "Triple barrel tourmaline ceramic waver engineered to protect hair strands from thermal damage while crafting lustrous, natural beach waves in seconds."
      },
      usage: {
        ar: "قسمي الشعر إلى خصلات متساوية، ثم اضغطي الجهاز على الخصلة لمدة 5 إلى 8 ثوانٍ من الجذور حتى الأطراف.",
        en: "Divide hair into even sections, gently clamp down for 5-8 seconds from roots to ends for bouncy textured waves."
      },
      ingredientsOrSpecs: {
        ar: "أسطوانات ثلاثية سيراميك 25مم | تحكم بالحرارة حتى 220°C | سلك دوار 360 درجة | ضمان سنتين شامل معتمد.",
        en: "25mm Triple Ceramic Barrels | Temp up to 220°C | 360° Swivel Cord | Full 2-Year Certified Warranty."
      },
      reviews: {
        ar: "تقييم 5/5. 'الجهاز يجنن وسهل جداً ويعطي ويفي طبيعي وثابت ليومين!'",
        en: "5/5 Stars. 'Incredible wave texture that stays in place all day without crunchiness.'"
      }
    }
  },
  {
    id: "hd-02",
    name: { 
      ar: "جهاز تمويج الشعر بيتش بيب من شيقلام - 25مم", 
      en: "Sheglam Beach Babe Hair Waver - 25mm" 
    },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 22.55, // Equivalent to ~84.58 SAR
    originalPriceUSD: 32.22, // Equivalent to ~120.83 SAR
    discountPercentage: 30,
    stock: 2, // Scarcity alert triggers!
    badge: { ar: "وفر 30%", en: "30% OFF" },
    rating: 4.9,
    reviewsCount: 98,
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "جهاز تمويج فوري وردي بتصميم مريح وعصري، يعتمد تقنية التسخين السريع PTC لتمويجات حيوية بدون تجعد وبحماية فائقة لترطيب الشعر.",
        en: "Signature blush pink deep waver featuring PTC rapid heating technology for soft, frizz-free waves with maximum moisture retention."
      },
      usage: {
        ar: "يستخدم على شعر جاف تماماً، اختاري درجة الحرارة المناسبة لنوع شعركِ واضغطي بلطف على طول الخصلة.",
        en: "Use on completely dry hair. Select your ideal heat level and clamp down gently along hair sections."
      },
      ingredientsOrSpecs: {
        ar: "قطر الأسطوانة 25مم | لوحات سيراميك زيت الأرجان | إيقاف تلقائي بعد 60 دقيقة | ضمان سنتين شامل معتمد.",
        en: "25mm Barrel | Argan Oil-Infused Ceramic | 60-min Auto Shutoff | 2-Year Certified Warranty."
      },
      reviews: {
        ar: "تقييم 4.9/5. 'لونه وردي كيوت وخفيف باليد ويسوي الشعر بسرعة البرق.'",
        en: "4.9/5 Stars. 'Lightweight, ergonomic and styles thick hair effortlessly fast.'"
      }
    }
  },
  {
    id: "hd-03",
    name: { 
      ar: "مكواة تجعيد الشعر الفورية كيوبيدز تشارم من شيقلام - 32 مم", 
      en: "Cupid's Charm Instant Auto Hair Curler - 32mm" 
    },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 25.97, // Equivalent to ~97.42 SAR
    originalPriceUSD: 37.11, // Equivalent to ~139.17 SAR
    discountPercentage: 30,
    stock: 6,
    badge: { ar: "وفر 30%", en: "30% OFF" },
    rating: 5.0,
    reviewsCount: 115,
    images: [
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "مكواة التجعيد الأوتوماتيكية الذكية كيوبيدز تشارم مع حجرة حماية عازلة للحرارة بنسبة 100% لمنع ملامسة الجلد، وتجعيد آلي بلمسة زر واحدة.",
        en: "Smart automatic rotating curling wand featuring full anti-scald thermal shielding and one-touch bi-directional rotation for salon bouncy curls."
      },
      usage: {
        ar: "ضعي خصلة رفيعة في الفتحة المخصصة واضغطي زر الدوران، سينتظر الجهاز التوقيت المناسب ويصدر نغمة تنبيه عند اكتمال اللفة.",
        en: "Insert a thin section of hair into the chamber, press rotation button, and release when the smart timer beeps."
      },
      ingredientsOrSpecs: {
        ar: "أسطوانة 32مم كبرى | دوران مزدوج يمين ويسار | حماية من التشابك الذكي | ضمان سنتين شامل معتمد.",
        en: "32mm Large Barrel | Dual Direction Rotation | Anti-Tangle Sensor | 2-Year Certified Warranty."
      },
      reviews: {
        ar: "تقييم 5/5. 'أفضل اختراع للبنات اللي ما يعرفوا يلفوا شعرهم، بدون أي حروق!'",
        en: "5/5 Stars. 'Foolproof curls with zero burns. Complete game changer for quick mornings.'"
      }
    }
  },
  {
    id: "hd-04",
    name: { 
      ar: "فرشاة تصفيف الشعر 6 في 1 من سل تيك - SLTK-10", 
      en: "Siltek 6-in-1 Multi Hair Styler Air Brush - SLTK-10" 
    },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 63.78, // Equivalent to ~239.2 SAR
    originalPriceUSD: 99.66, // Equivalent to ~373.75 SAR
    discountPercentage: 36,
    stock: 3, // Scarcity alert
    badge: { ar: "وفر 36%", en: "36% OFF" },
    rating: 5.0,
    reviewsCount: 189,
    images: [
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "المصفف الهوائي الاحترافي المتكامل بست رؤوس قابلة للتبديل (تجفيف سريع، تكثيف، تمليس، لف هوائي بكواندا، وفرشاة مستديرة) بقوة 1400 واط.",
        en: "The all-in-one 6-in-1 hot air styling system powered by high-speed airflow (Coanda effect curlers, volumizer brush, oval smoother, and concentrated dryer)."
      },
      usage: {
        ar: "ركبي الرأس المناسب على المقبض الذكي، واستخدمي تدفق الهواء البارد أو الساخن لتصفيف وتثبيت الشعر في خطوة واحدة.",
        en: "Snap the desired attachment onto the ergonomic handle and style while drying with adjustable heat and cold shot lock."
      },
      ingredientsOrSpecs: {
        ar: "محرك رقمي عالي السرعة 110,000 دورة/دقيقة | 6 رؤوس مغناطيسية | تقنية الأيونات السالبة | ضمان سنتين شامل معتمد.",
        en: "110,000 RPM Digital Motor | 6 Interchangeable Attachments | Negative Ion Care | 2-Year Certified Warranty."
      },
      reviews: {
        ar: "تقييم 5/5. 'بديل مذهل وفخم جداً للعلامات الغالية، يجفف ويسرح في 10 دقائق فقط.'",
        en: "5/5 Stars. 'Super salon blowout finish without burning hair. The volume brush is magical.'"
      }
    }
  },
  {
    id: "hd-05",
    name: { 
      ar: "مكواة تمليس الشعر الاحترافية كلارا بالأيونات", 
      en: "Clara Pro Ionic Tourmaline Flat Iron" 
    },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 51.00,
    originalPriceUSD: 68.00,
    discountPercentage: 25,
    stock: 7,
    badge: { ar: "وفر 25%", en: "25% OFF" },
    rating: 4.95,
    reviewsCount: 84,
    images: [
      "https://images.unsplash.com/photo-1522337094346-290f26a0b58a?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "مكواة تمليس شعر انسيابية بالصفائح العريضة المطلية بالسيراميك التيتانيوم والأيونات السالبة، تمنحك شعراً حريرياً أملس من تمريرة واحدة.",
        en: "Precision titanium ceramic straightener with floating plates and continuous negative ion stream for ultra-glossy sleek finish in one stroke."
      },
      usage: {
        ar: "مرري المكواة بسلاسة على خصلة رفيعة بسرعة معتدلة من الجذور نحو الأطراف للحصول على شعر ناعم كالحرير.",
        en: "Glide gently down dry strands at a steady pace for salon-level mirror shine."
      },
      ingredientsOrSpecs: {
        ar: "صفائح تيتانيوم عائمة 1.25 إنش | تسخين سريع خلال 15 ثانية | حرارة تصل 230°C | ضمان سنتين شامل معتمد.",
        en: "1.25' Floating Titanium Plates | 15s Rapid Heat | Up to 230°C | 2-Year Certified Warranty."
      },
      reviews: {
        ar: "تقييم 4.95/5. 'تخلي الشعر ناعم كأنه معالج بالبروتين وتبقى النتيجة ثابتة حتى مع الرطوبة.'",
        en: "4.95/5 Stars. 'Keeps frizzy hair ultra flat and sleek even in humid weather.'"
      }
    }
  },
  {
    id: "hd-06",
    name: { 
      ar: "مجفف الشعر الذكي السريع فائق الهدوء أوكيما", 
      en: "Okema Ultra-Quiet Smart Ionic Blow Dryer" 
    },
    category: { ar: "أجهزة الشعر", en: "Hair Devices" },
    basePriceUSD: 61.20,
    originalPriceUSD: 85.00,
    discountPercentage: 28,
    stock: 5,
    badge: { ar: "وفر 28%", en: "28% OFF" },
    rating: 5.0,
    reviewsCount: 76,
    images: [
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=80"
    ],
    tabs: {
      description: {
        ar: "مجفف شعر رقمي خفيف الوزن بمحرك ذكي بدون فرش، يوفر تدفق هواء فائق السرعة مع خفض الضوضاء وحماية حرارية ذكية تمنع جفاف الأطراف.",
        en: "Lightweight smart brushless hair dryer generating hurricane airflow with whisper-quiet acoustics and microchip temperature regulation."
      },
      usage: {
        ar: "استخدمي فوهة التكثيف أو موزع الهواء الكيرلي مع التحكم بسرعات الهواء الثلاث لتجفيف صحي وسريع.",
        en: "Attach diffuser or styling nozzle to dry curly or straight styles efficiently."
      },
      ingredientsOrSpecs: {
        ar: "وزن خفيف 380 غرام فقط | 3 درجات حرارة + زر هواء بارد | فوهة مغناطيسية | ضمان سنتين شامل معتمد.",
        en: "Ultra-Lightweight 380g | 3 Speeds & Heat Settings + Cool Shot | Magnetic Nozzle | 2-Year Certified Warranty."
      },
      reviews: {
        ar: "تقييم 5/5. 'صوته واطي جداً ومريح لليد ويجفف شعري الطويل في 7 دقائق فقط.'",
        en: "5/5 Stars. 'Incredibly quiet yet powerful. Dries thick hair in under 8 minutes.'"
      }
    }
  }
];

type SubCategoryKey = 'all' | 'waving' | 'straightener' | 'dryer';

export const HairDevicesSpotlight: React.FC = () => {
  const { lang, showToast } = useCommerce();
  const isRtl = lang === 'ar';

  const [activeSubCategory, setActiveSubCategory] = useState<SubCategoryKey>('waving');

  // Horizontal Carousel Drag & Scroll State
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Sub-category filters
  const tabs = [
    {
      id: 'waving' as SubCategoryKey,
      label: { ar: 'مكواة تجعيد و تمويج الشعر', en: 'Curling & Waving Irons' },
    },
    {
      id: 'straightener' as SubCategoryKey,
      label: { ar: 'مكواة تمليس الشعر', en: 'Hair Straighteners' },
    },
    {
      id: 'dryer' as SubCategoryKey,
      label: { ar: 'مجفف الشعر', en: 'Hair Dryers & Blowers' },
    },
    {
      id: 'all' as SubCategoryKey,
      label: { ar: 'عرض كافة الأجهزة', en: 'All Devices' },
    },
  ];

  // Top 3 Visual Trio Banners corresponding to photo 1
  const trioBanners = [
    {
      id: 'siltek-banner',
      brand: 'Siltek',
      title: { ar: 'مكواة التمويج الثلاثية', en: 'Triple Barrel Waver' },
      subtitle: { ar: 'تمويجات عريضة تدوم طويلاً', en: 'Long-lasting Deep Waves' },
      targetTab: 'waving' as SubCategoryKey,
      bgGradient: 'from-[#0b2923] via-[#123830] to-[#081a17]',
      accentColor: '#2B827A',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'okema-banner',
      brand: 'Okema®',
      title: { ar: 'المصفف الذكي متعدد الرؤوس', en: 'Multi-Styler Air Brush' },
      subtitle: { ar: 'تصفيف وتجفيف متكامل 6 في 1', en: '6-in-1 Complete Styling' },
      targetTab: 'dryer' as SubCategoryKey,
      bgGradient: 'from-[#e4ded6] via-[#dfd7cc] to-[#cfc4b5]',
      isDarkText: true,
      accentColor: '#b48a58',
      image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'clara-banner',
      brand: 'CLARA',
      title: { ar: 'مكواة التمليس والأيونات', en: 'Ceramic Ion Flat Iron' },
      subtitle: { ar: 'شعر حريري فائق النعومة', en: 'Silk Sleek Results' },
      targetTab: 'straightener' as SubCategoryKey,
      bgGradient: 'from-[#f5e6e8] via-[#eedbe0] to-[#e4ccd3]',
      isDarkText: true,
      accentColor: '#cf7588',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
    },
  ];

  // Filter products based on sub-category
  const filteredProducts = hairStylingDevices.filter((item) => {
    if (activeSubCategory === 'all') return true;
    if (activeSubCategory === 'waving') {
      return item.id === 'hd-01' || item.id === 'hd-02' || item.id === 'hd-03';
    }
    if (activeSubCategory === 'straightener') {
      return item.id === 'hd-05' || item.id === 'hd-02';
    }
    if (activeSubCategory === 'dryer') {
      return item.id === 'hd-04' || item.id === 'hd-06';
    }
    return true;
  });

  // Switch tab and smoothly reset horizontal scroll to start
  const handleTabChange = (tabId: SubCategoryKey) => {
    setActiveSubCategory(tabId);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  // Smooth Mouse Drag Handlers for Desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section 
      id="hair-devices-section"
      className="max-w-7xl mx-auto px-4 sm:px-6 my-10 sm:my-16 space-y-8 select-none relative"
      aria-label={lang === 'ar' ? 'قسم أجهزة الشعر' : 'Hair Styling Devices Section'}
    >
      {/* 1. TOP TRIO BRAND BANNERS (Matching Photo 1: Siltek, Okema, Clara) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {trioBanners.map((banner) => {
          const isActive = activeSubCategory === banner.targetTab;
          return (
            <div
              key={banner.id}
              onClick={() => {
                handleTabChange(banner.targetTab);
                showToast(
                  lang === 'ar' 
                    ? `تم عرض تشكيلة: ${banner.brand}` 
                    : `Filtered by ${banner.brand}`
                );
              }}
              className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer bg-gradient-to-br ${banner.bgGradient} border ${
                isActive ? 'ring-2 ring-[#2B827A] shadow-md border-[#2B827A]' : 'border-slate-200/60 shadow-xs'
              } min-h-[190px] flex flex-col justify-between group`}
            >
              {/* Brand Logo Watermark / Top Header */}
              <div className="flex items-center justify-between z-10">
                <span 
                  className={`text-lg sm:text-xl font-black tracking-widest uppercase font-serif ${
                    banner.isDarkText ? 'text-slate-900' : 'text-amber-200'
                  }`}
                >
                  {banner.brand}
                </span>

                <span 
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-xs transition-colors ${
                    banner.isDarkText 
                      ? 'bg-black/5 text-slate-800 border-black/10 group-hover:bg-black/10' 
                      : 'bg-white/10 text-white border-white/20 group-hover:bg-white/20'
                  }`}
                >
                  {lang === 'ar' ? 'عرض التشكيلة' : 'Explore'}
                </span>
              </div>

              {/* Central / Background Visual Device Photo */}
              <div className="absolute inset-y-0 end-0 w-1/2 overflow-hidden opacity-90 group-hover:opacity-100 transition-opacity">
                <img
                  src={banner.image}
                  alt={banner.title[lang]}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 mix-blend-multiply"
                  loading="lazy"
                />
                <div 
                  className={`absolute inset-0 bg-gradient-to-r ${
                    isRtl 
                      ? 'from-transparent via-transparent to-current' 
                      : 'from-current via-transparent to-transparent'
                  } opacity-20 pointer-events-none`} 
                />
              </div>

              {/* Banner Text Content */}
              <div className="relative z-10 max-w-[65%] space-y-1 pt-6 text-start">
                <h3 
                  className={`font-black text-base sm:text-lg leading-snug ${
                    banner.isDarkText ? 'text-slate-950' : 'text-white'
                  }`}
                >
                  {banner.title[lang]}
                </h3>
                <p 
                  className={`text-xs font-medium leading-relaxed ${
                    banner.isDarkText ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  {banner.subtitle[lang]}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. SECTION HEADER WITH DECORATIVE ACCENT LINES (—— اجهزة الشعر ——) */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 pt-4">
        <div className="w-12 sm:w-20 h-0.5 bg-[#2B827A] rounded-full" />
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-brand-ar">
          {lang === 'ar' ? 'اجهزة الشعر' : 'Hair Styling Devices'}
        </h2>
        <div className="w-12 sm:w-20 h-0.5 bg-[#2B827A] rounded-full" />
      </div>

      {/* 3. SUB-CATEGORY TABS / PILLS */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        {tabs.map((tab) => {
          const isActive = activeSubCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all min-h-[44px] flex items-center gap-2 border select-none ${
                isActive
                  ? 'bg-[#2B827A] text-white border-[#2B827A] shadow-md shadow-[#2B827A]/20 scale-102'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-[#2B827A]/40 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label[lang]}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
            </button>
          );
        })}
      </div>

      {/* 4. HORIZONTAL SMOOTH CAROUSEL (3 UNIFIED SMART CARDS DEFAULT ON DESKTOP, TOUCH & MOUSE SWIPE) */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="flex gap-5 sm:gap-6 overflow-x-auto pb-6 pt-2 px-1 scroll-smooth snap-x snap-mandatory scrollbar-none cursor-grab active:cursor-grabbing touch-pan-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isCarouselItem={true} 
            />
          ))}
        </div>

        {/* Subtle Swipe Hint for Users (Mobile & Desktop) */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium pt-1">
          <span>{lang === 'ar' ? '← اسحبي يميناً ويساراً لتصفح باقي الأجهزة →' : '← Drag or swipe to explore all devices →'}</span>
        </div>
      </div>

      {/* 5. BOTTOM NAVIGATION & VIEW ALL LINK */}
      <div className="flex items-center justify-center pt-2">
        <button
          onClick={() => {
            handleTabChange('all');
            showToast(lang === 'ar' ? 'عرض كافة أجهزة الشعر' : 'Displaying all hair devices');
          }}
          className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-slate-700 hover:text-[#2B827A] transition-colors py-2 px-4 rounded-full hover:bg-slate-100 min-h-[44px]"
        >
          <span>{lang === 'ar' ? 'عرض الكل' : 'View All'}</span>
          {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* 6. FLOATING SCROLL TO TOP BUTTON (Matching Bottom-Start in Photo 1) */}
      <button
        onClick={scrollToTop}
        aria-label={lang === 'ar' ? 'الصعود لأعلى الصفحة' : 'Scroll to Top'}
        className="fixed bottom-6 start-6 z-40 w-11 h-11 rounded-full bg-white text-slate-800 border border-slate-200/80 shadow-lg hover:shadow-xl hover:bg-slate-50 flex items-center justify-center transition-all duration-300 hover:scale-105 group"
      >
        <ArrowUp className="w-5 h-5 text-[#2B827A] group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </section>
  );
};
