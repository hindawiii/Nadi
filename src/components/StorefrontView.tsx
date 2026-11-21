import React, { useState, useEffect, useRef } from 'react';
import { 
  Truck, ShieldCheck, ArrowRight, ArrowLeft, 
  CheckCircle2, ChevronRight, ChevronLeft, MessageCircle, Heart, 
  MapPin, Phone, Mail, Award, Droplets, Sun, Shield, 
  Layers, MessageSquarePlus, SlidersHorizontal, Quote, Check, BadgeCheck,
  ZoomIn, Maximize2, X, Plus, Minus, ShoppingBag, Gift, ChevronDown, ChevronUp,
  ScanFace, Gem, Flower2, LayoutGrid, Wind
} from 'lucide-react';
import { useCommerce, SectionId } from '../context/CommerceContext';
import { ProductCard } from './ProductCard';
import { InfiniteBrandTicker } from './InfiniteBrandTicker';
import { HairDevicesSpotlight } from './HairDevicesSpotlight';
import { BeforeAfterSlider } from './common/BeforeAfterSlider';
import { EditorialHero } from './EditorialHero';
import { StoreFAQSection } from './StoreFAQSection';
import { classifyProductCollection } from '../lib/productCollections';
import { resolveBeforeAfterCopy } from '../lib/sliderGestureIntent';
import {
  DEFAULT_NADI_TESTIMONIALS,
  getReviewerInitial,
  normalizeTestimonialList,
} from '../lib/testimonialSanitizer';

export const StorefrontView: React.FC = () => {
  const { 
    lang, activeData, setCurrentRoute, navigateTo, 
    openProductPDP, setIsReviewModalOpen, showToast, 
    sectionsControl, sectionsOrder, activePresetId, clonedSections,
    addToCart, convertPrice, setIsCartOpen
  } = useCommerce();
  const isRtl = lang === 'ar';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSkinFilter, setActiveSkinFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const [reviewSlide, setReviewSlide] = useState<number>(0);
  const reviewTouchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    if (!isSortMenuOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) {
        setIsSortMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSortMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleKey);
    };
  }, [isSortMenuOpen]);

  const sortOptions: Array<{ value: 'featured' | 'rating' | 'price-asc' | 'price-desc'; label: { ar: string; en: string } }> = [
    { value: 'featured', label: { ar: 'المقترحة', en: 'Featured' } },
    { value: 'rating', label: { ar: 'الأعلى تقييماً', en: 'Top Rated' } },
    { value: 'price-asc', label: { ar: 'الأقل سعراً', en: 'Price: Low to High' } },
    { value: 'price-desc', label: { ar: 'الأعلى سعراً', en: 'Price: High to Low' } },
  ];
  const activeSortOption = sortOptions.find((opt) => opt.value === sortBy) || sortOptions[0];

  // Progressive Disclosure / Accordion Products Pagination: 8 on mobile (4 rows of 2), 12 on tablet/desktop (4 rows of 3)
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(() => 
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const defaultBatchSize = isMobileScreen ? 8 : 12;
  const [visibleProductsCount, setVisibleProductsCount] = useState<number>(defaultBatchSize);

  // Reset pagination on category or skin filter switch
  useEffect(() => {
    setVisibleProductsCount(isMobileScreen ? 8 : 12);
  }, [isMobileScreen, selectedCategory, activeSkinFilter]);

  // Diamond Offer interactive states
  const [activePromoSlide, setActivePromoSlide] = useState<number>(0);
  const [isDiamondBundleModalOpen, setIsDiamondBundleModalOpen] = useState<boolean>(false);
  const [diamondBundleQty, setDiamondBundleQty] = useState<number>(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Promo Banner Slides definition (Concise, zero-duplication highlights)
  const promoSlides = [
    {
      id: 1,
      image: activeData.promoBanner?.image1 || "https://images.unsplash.com/photo-1608248597359-25b82877fb18?auto=format&fit=crop&w=800&q=80",
      badge: activeData.promoBanner?.image1Badge ? activeData.promoBanner.image1Badge[lang] : (isRtl ? 'مكوّنات نباتية 100%' : '100% Botanicals'),
      title: isRtl ? 'خلاصات نباتية نقية 100%' : '100% Pure Botanical Extracts',
      desc: isRtl ? 'مكوّنات معصورة على البارد تغذّي البشرة بعمق.' : 'Cold-pressed extracts that nourish skin deeply.'
    },
    {
      id: 2,
      image: activeData.promoBanner?.image2 || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
      badge: activeData.promoBanner?.image2Badge ? activeData.promoBanner.image2Badge[lang] : (isRtl ? '4 مستحضرات متكاملة' : '4-Piece Complete Box'),
      title: isRtl ? '4 مستحضرات متكاملة في بوكس واحد' : '4 Daily Essentials in One Box',
      desc: isRtl ? 'روتينكِ اليومي الكامل في عبوة هدايا أنيقة.' : 'Your full daily routine in one gift box.'
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
      badge: isRtl ? 'هدية مجانية' : 'Complimentary Gift',
      title: isRtl ? 'حقيبة مخملية + 3 عينات سفرية هدية' : 'Velvet Pouch + 3 Travel Samples',
      desc: isRtl ? 'مرفقة مجاناً مع البوكس لحفظ مستحضراتكِ.' : 'Included free with the box for travel storage.'
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      badge: isRtl ? 'نتائج 14 يوماً' : '14-Day Results',
      title: isRtl ? 'ترطيب ونضارة ملحوظة خلال 14 يوماً' : 'Visible Hydration & Glow in 14 Days',
      desc: isRtl ? 'فرق واضح في نعومة وإشراقة البشرة خلال أسبوعين.' : 'Noticeable glow and softness in two weeks.'
    }
  ];

  // Keyboard navigation for Fullscreen Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setActivePromoSlide((prev) => isRtl ? (prev === promoSlides.length - 1 ? 0 : prev + 1) : (prev === 0 ? promoSlides.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActivePromoSlide((prev) => isRtl ? (prev === 0 ? promoSlides.length - 1 : prev - 1) : (prev === promoSlides.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, isRtl, promoSlides.length]);

  const products = activeData.products;

  // Step 1: Apply active smart skin diagnosis filter first so category pill counters stay 100% live & accurate
  const skinFilteredProducts = products.filter((p) => {
    if (!activeSkinFilter) return true;
    const pName = (p.name.ar + ' ' + p.name.en + ' ' + p.tabs.description.ar).toLowerCase();
    if (activeSkinFilter === 'hydrated') {
      return p.id.includes('01') || p.id.includes('04') || ['sb-06', 'sb-15', 'sb-16', 'sb-22', 'sb-27', 'sb-32'].includes(p.id) || pName.includes('هيالورونيك') || pName.includes('ترطيب') || pName.includes('صبار') || pName.includes('سيراميد');
    }
    if (activeSkinFilter === 'even') {
      return p.id.includes('02') || p.id.includes('04') || ['sb-07', 'sb-21', 'sb-25', 'sb-31'].includes(p.id) || pName.includes('فيتامين سي') || pName.includes('نياسيناميد') || pName.includes('تفتيح') || pName.includes('تصبغات');
    }
    if (activeSkinFilter === 'firm') {
      return p.id.includes('03') || p.id.includes('04') || ['sb-10', 'sb-14', 'sb-19', 'sb-26', 'sb-34'].includes(p.id) || pName.includes('كولاجين') || pName.includes('ريتينول') || pName.includes('ببتيد') || pName.includes('شد');
    }
    if (activeSkinFilter === 'radiant') {
      return p.id.includes('02') || p.id.includes('03') || p.id.includes('04') || ['sb-09', 'sb-12', 'sb-13', 'sb-20', 'sb-30'].includes(p.id) || pName.includes('إشراقة') || pName.includes('نضارة') || pName.includes('ورد') || pName.includes('ذهب');
    }
    return true;
  });

  const matchesCollection = (p: (typeof products)[number], catId: string) => {
    if (catId === 'all') return true;
    if (catId === 'skin' || catId === 'box' || catId === 'hair') {
      return classifyProductCollection(p) === catId;
    }
    return p.category.en.toLowerCase().includes(catId.toLowerCase()) || p.category.ar.includes(catId);
  };

  const productCollections = [
    { id: 'all', icon: LayoutGrid, label: { ar: 'الكل', en: 'All' }, count: skinFilteredProducts.length },
    { id: 'skin', icon: Droplets, label: { ar: 'عناية بالبشرة', en: 'Skincare' }, count: skinFilteredProducts.filter((p) => matchesCollection(p, 'skin')).length },
    { id: 'box', icon: Gift, label: { ar: 'بكجات وعروض', en: 'Gift Sets' }, count: skinFilteredProducts.filter((p) => matchesCollection(p, 'box')).length },
    { id: 'hair', icon: Wind, label: { ar: 'أجهزة الشعر', en: 'Hair Devices' }, count: skinFilteredProducts.filter((p) => matchesCollection(p, 'hair')).length },
  ].filter((cat) => cat.id === 'all' || activePresetId === 'cosmetics' || cat.count > 0);

  // Step 2: Filter products by selected collection pill
  const filteredProducts = skinFilteredProducts.filter((p) => matchesCollection(p, selectedCategory));

  // Sort products (with balanced round-robin interleaving on default cosmetics 'All' view so bundles & hair devices appear immediately)
  const sortedProducts = (() => {
    if (
      activePresetId === 'cosmetics' &&
      selectedCategory === 'all' &&
      sortBy === 'featured' &&
      !activeSkinFilter
    ) {
      const skincareItems: typeof filteredProducts = [];
      const bundleItems: typeof filteredProducts = [];
      const hairItems: typeof filteredProducts = [];

      for (const p of filteredProducts) {
        const col = classifyProductCollection(p);
        if (col === 'box') {
          bundleItems.push(p);
        } else if (col === 'hair') {
          hairItems.push(p);
        } else {
          skincareItems.push(p);
        }
      }

      const interleaved: typeof filteredProducts = [];
      const maxLen = Math.max(skincareItems.length, bundleItems.length, hairItems.length);

      for (let i = 0; i < maxLen; i++) {
        if (i < skincareItems.length) interleaved.push(skincareItems[i]);
        if (i < bundleItems.length) interleaved.push(bundleItems[i]);
        if (i < hairItems.length) interleaved.push(hairItems[i]);
      }

      return interleaved;
    }

    return [...filteredProducts].sort((a, b) => {
      if (sortBy === 'price-asc') return a.basePriceUSD - b.basePriceUSD;
      if (sortBy === 'price-desc') return b.basePriceUSD - a.basePriceUSD;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // 'featured' keeps curated order
    });
  })();

  const skinTypes = [
    {
      id: 'hydrated',
      title: { ar: 'بشرة مرطبة', en: 'Moisturized Skin' },
      ingredient: { ar: 'حمض الهيالورونيك المكثف', en: 'Intense Hyaluronic Acid' },
      desc: { ar: 'حمض الهيالورونيك المكثف لحبس الرطوبة ومحاربة الجفاف.', en: 'Hyaluronic acid deep hydration barrier.' },
      icon: Droplets,
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80', // High-end dewy skin hydration
      fallbackImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80',
      badge: { ar: 'ترطيب عميق', en: 'Deep Moisture' },
      bg: 'bg-blue-50/70 border-blue-200/80 hover:border-blue-400 text-blue-900',
      badgeColor: 'bg-blue-600 text-white'
    },
    {
      id: 'even',
      title: { ar: 'بشرة موحّدة', en: 'Even Tone Skin' },
      ingredient: { ar: 'فيتامين سي العضوي', en: 'Pure Organic Vitamin C' },
      desc: { ar: 'فيتامين سي العضوي لتفتيح التصبغات وتوحيد لون البشرة.', en: 'Active Vitamin C to combat hyperpigmentation.' },
      icon: Sun,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80', // Pure even-toned natural beauty
      fallbackImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80',
      badge: { ar: 'تفتيح وتوحيد', en: 'Even Tone' },
      bg: 'bg-amber-50/70 border-amber-200/80 hover:border-amber-400 text-amber-900',
      badgeColor: 'bg-amber-600 text-white'
    },
    {
      id: 'firm',
      title: { ar: 'بشرة مشدودة', en: 'Firm Skin' },
      ingredient: { ar: 'خلاصات الكولاجين النباتي', en: 'Botanical Collagen Boost' },
      desc: { ar: 'مستخلصات نباتية لتجديد الكولاجين والمرونة الطبيعية.', en: 'Plant botanicals restoring elasticity.' },
      icon: Shield,
      image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=700&q=80', // Youthful firm facial contour
      fallbackImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80',
      badge: { ar: 'شد ومرونة', en: 'Firm & Elastic' },
      bg: 'bg-purple-50/70 border-purple-200/80 hover:border-purple-400 text-purple-900',
      badgeColor: 'bg-purple-700 text-white'
    },
    {
      id: 'radiant',
      title: { ar: 'بشرة مشرقة', en: 'Radiant Skin' },
      ingredient: { ar: 'زيوت اللافندر والورد', en: 'Rose & Lavender Infusion' },
      desc: { ar: 'زيوت اللافندر والورد لنضارة فورية وإشراقة طبيعية تدوم.', en: 'Lavender & Rose extracts for healthy glow.' },
      icon: Flower2,
      image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=700&q=80', // Radiant glow with botanical dropper
      fallbackImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80',
      badge: { ar: 'إشراقة طبيعية', en: 'Natural Glow' },
      bg: 'bg-rose-50/70 border-rose-200/80 hover:border-rose-400 text-rose-900',
      badgeColor: 'bg-rose-600 text-white'
    }
  ];

  // Dynamic Skin Routine Diagnosis from activeData or fallback
  const effectiveSkinDiagnosis = (activeData?.skinDiagnosisCards && activeData.skinDiagnosisCards.length > 0)
    ? activeData.skinDiagnosisCards.map(s => ({
        ...s,
        badge: {
          ar: s.badge.ar.replace(/\s*[\u2728\u2B50\u{1F31F}\u2605\u2726]/gu, '').trim(),
          en: s.badge.en.replace(/\s*[\u2728\u2B50\u{1F31F}\u2605\u2726]/gu, '').trim()
        },
        icon: s.id === 'hydrated' ? Droplets : (s.id === 'even' ? Sun : (s.id === 'firm' ? Shield : Flower2))
      }))
    : skinTypes;

  // Dynamic Verified Testimonials normalized to ensure natural copy and zero duplicate checkmarks
  const rawTestimonials = (activeData?.testimonials && activeData.testimonials.length > 0)
    ? activeData.testimonials
    : DEFAULT_NADI_TESTIMONIALS;
  const approvedTestimonials = rawTestimonials.filter((t: any) => t.status === 'approved' || !t.status);
  const effectiveTestimonials = normalizeTestimonialList(
    approvedTestimonials.length > 0 ? approvedTestimonials : rawTestimonials,
    activePresetId
  );

  const sectionsContent: Record<SectionId, React.ReactNode> = {
    // 1. FULL-BLEED EDITORIAL HERO (3 local store-section photographs: Skincare, Hair Care, Bundles)
    hero: sectionsControl.hero ? (
      <EditorialHero
        lang={lang}
        activePresetId={activePresetId}
        slogan={
          activeData.storeSlogan || {
            ar: 'إشراقة طبيعية، تليق بك.',
            en: 'Natural radiance, made for you.',
          }
        }
        title={activeData.heroTitle}
        subtitle={activeData.heroSubtitle}
        ctaPrimary={activeData.heroCtaPrimary}
        ctaSecondary={activeData.heroCtaSecondary}
        customHeroImage={activeData.heroImage}
        onPrimaryAction={() => {
          document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onSecondaryAction={() => {
          document.getElementById('campaign-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onSelectCollection={(collectionId) => {
          setActiveSkinFilter(null);
          setSelectedCategory(collectionId);
          document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    ) : null,

    // LUXURY INFINITE BRAND & SLOGAN TICKER (Docked seamlessly under Editorial Hero)
    brandTicker: sectionsControl.brandTicker ? (
      <InfiniteBrandTicker className="!mt-0" />
    ) : null,

    // 2. VALUE PROPOSITIONS STRIP (Removed completely per user approval — Option 1)
    valueProps: null,

      // 3. "اختاري بشرتك" / SKIN TYPE SOLUTIONS (Single-Row Smart Interactive 4-Card System)
      routineDiagnosis: (sectionsControl.routineDiagnosis && activePresetId === 'cosmetics') ? (
        <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-3.5 sm:space-y-4 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="space-y-1.5 text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-purple-900 text-xs font-bold">
              <ScanFace className="w-3.5 h-3.5 text-purple-600" />
              <span>{lang === 'ar' ? 'اختاري حسب بشرتكِ' : 'By Skin Goal'}</span>
            </div>
            <h2 className="text-fluid-h2 font-extrabold text-slate-900 font-brand-ar leading-tight">
              {lang === 'ar' ? 'اختاري ما يلائم بشرتكِ' : 'Tailored For Your Skin'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              {lang === 'ar'
                ? 'اختاري احتياج بشرتكِ لعرض الروتين الأنسب.'
                : 'Pick your skin goal to view matching products.'}
            </p>
          </div>

          {activeSkinFilter && (
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setActiveSkinFilter(null);
                  showToast(lang === 'ar' ? 'تمت العودة لجميع المنتجات' : 'Reset to all products');
                }}
                className="h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>{lang === 'ar' ? '✕ إلغاء تصفية البشرة' : '✕ Clear Skin Filter'}</span>
              </button>
            </div>
          )}
        </div>

        {/* 4 Smart Cards: Exactly 4 in a single row on all larger devices (sm:grid-cols-4), and 2 on Mobile (grid-cols-2) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-2 lg:gap-3">
          {effectiveSkinDiagnosis.map((type) => {
            const Icon = type.icon;
            const isSelected = activeSkinFilter === type.id;
            return (
              <div
                key={type.id}
                className={`group rounded-2xl sm:rounded-3xl border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between bg-white relative ${
                  isSelected 
                    ? 'ring-2 ring-[#5A3E7A] shadow-lg border-[#5A3E7A] scale-[1.02]' 
                    : `${type.bg} border-slate-200/80`
                }`}
                onClick={() => {
                  if (isSelected) {
                    setActiveSkinFilter(null);
                    showToast(lang === 'ar' ? 'تم عرض جميع المنتجات' : 'Showing all products');
                  } else {
                    setActiveSkinFilter(type.id);
                    showToast(
                      lang === 'ar' 
                        ? `تم تفعيل فلتر: ${type.title.ar} (شاهد المنتجات بالأسفل)` 
                        : `Activated ${type.title.en} routine filter`
                    );
                    setTimeout(() => {
                      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 150);
                  }
                }}
              >
                {/* Pure Photographic Visual - 100% Clean Canvas without Obstructive Badges or Dark Overlays */}
                <div className="relative aspect-[16/11] sm:aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img
                    src={type.image}
                    alt={type.title[lang]}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => {
                      if (type.fallbackImage && e.currentTarget.src !== type.fallbackImage) {
                        e.currentTarget.src = type.fallbackImage;
                      } else {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80";
                      }
                    }}
                  />

                  {/* Active Selection Badge (Only small indicator when selected) */}
                  {isSelected && (
                    <div className="absolute top-2 end-2 sm:top-2.5 sm:end-2.5 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-emerald-600 text-white shadow-md flex items-center gap-1">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      <span>{lang === 'ar' ? 'مفعّل' : 'Active'}</span>
                    </div>
                  )}
                </div>

                {/* Content Details (Refined and harmonized without image clutter) */}
                <div className="p-2.5 sm:p-4 lg:p-5 flex flex-col justify-between flex-1 space-y-2 sm:space-y-3 text-start">
                  <div className="space-y-1.5">
                    {/* Top Meta: Icon + Benefit Badge + Ingredient */}
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold shadow-2xs ${type.badgeColor}`}>
                        <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                        <span className="truncate">{type.badge[lang]}</span>
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-medium text-slate-400 truncate">
                        {type.ingredient[lang]}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-base lg:text-lg font-extrabold text-slate-900 group-hover:text-[#5A3E7A] transition-colors leading-tight font-brand-ar truncate">
                      {type.title[lang]}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed font-normal line-clamp-2">
                      {type.desc[lang]}
                    </p>
                  </div>

                  {/* Smart Action Link */}
                  <div className="pt-1.5 sm:pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs font-bold text-[#5A3E7A]">
                    <span className="truncate">
                      {isSelected 
                        ? (lang === 'ar' ? '✓ تصفية مفعلة' : '✓ Regimen Active')
                        : (lang === 'ar' ? 'تفعيل الروتين' : 'Activate Routine')}
                    </span>
                    <span className={`w-5 h-5 sm:w-7 sm:h-7 shrink-0 rounded-full flex items-center justify-center transition-all ${
                      isSelected ? 'bg-[#5A3E7A] text-white' : 'bg-purple-50 group-hover:bg-[#5A3E7A] group-hover:text-white'
                    }`}>
                      {isRtl ? <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      ) : null,

      // 4. PRODUCTS GRID (With Horizontal Pill Bar Collections & Product Cards)
      productsCatalog: sectionsControl.productsCatalog ? (
        <section id="products-section" className="max-w-7xl mx-auto px-2.5 sm:px-6 space-y-3 sm:space-y-4 scroll-mt-20">
        <div className="space-y-2.5 border-b border-slate-100 pb-3">
          {/* Top Row: Section Heading + Compact Smart Sort Selector */}
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <span className="text-[11px] sm:text-xs font-bold text-purple-700 uppercase tracking-widest block">
                {lang === 'ar' ? 'تصفّحي حسب الركن' : 'Browse by Collection'}
              </span>
              <h2 className="text-fluid-h2 font-extrabold text-slate-900 font-brand-ar leading-tight">
                {lang === 'ar' ? 'أركان منتجاتنا' : 'Our Collections'}
              </h2>
            </div>

            {/* Custom Popover Sort Dropdown (Anchored strictly below trigger, zero native OS popup drift) */}
            <div className="relative shrink-0" ref={sortMenuRef}>
              <button
                type="button"
                onClick={() => setIsSortMenuOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isSortMenuOpen}
                aria-label={lang === 'ar' ? 'ترتيب المنتجات' : 'Sort products'}
                className={`inline-flex items-center gap-2 bg-white hover:bg-slate-50 px-3.5 rounded-full border shadow-2xs min-h-[44px] text-xs font-bold text-slate-700 transition-all cursor-pointer ${
                  isSortMenuOpen ? 'border-[#5A3E7A] ring-2 ring-purple-100' : 'border-slate-200/90'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#5A3E7A] shrink-0" />
                <span className="whitespace-nowrap">{activeSortOption.label[lang]}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${isSortMenuOpen ? 'rotate-180 text-[#5A3E7A]' : ''}`} />
              </button>

              {isSortMenuOpen && (
                <div
                  role="listbox"
                  aria-label={lang === 'ar' ? 'خيارات الترتيب' : 'Sort options'}
                  className="absolute top-full mt-2 end-0 w-48 bg-white/95 backdrop-blur-xl text-slate-800 rounded-2xl shadow-2xl border border-purple-100/80 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150 divide-y divide-slate-50"
                >
                  {sortOptions.map((option) => {
                    const isSelected = sortBy === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSortBy(option.value);
                          setIsSortMenuOpen(false);
                        }}
                        className={`w-full text-start px-3.5 py-2.5 min-h-[44px] text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                          isSelected
                            ? 'font-bold text-[#5A3E7A] bg-purple-50/70'
                            : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span className="truncate">{option.label[lang]}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#5A3E7A] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Unified Smart Capsule Collections Dock (Mirrors Header Action Dock geometry & rhythm) */}
          <div className="w-full overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div
              role="tablist"
              aria-label={lang === 'ar' ? 'أركان منتجاتنا' : 'Product collections'}
              className="inline-flex items-center gap-1 p-1 bg-slate-100/85 border border-slate-200/85 rounded-2xl shadow-2xs backdrop-blur-xs snap-x snap-mandatory"
            >
              {productCollections.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`shrink-0 snap-start inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 rounded-xl text-[11.5px] sm:text-[13px] font-bold transition-all whitespace-nowrap min-h-[42px] sm:min-h-[44px] cursor-pointer active:scale-[0.98] ${
                      isActive
                        ? 'bg-theme-primary text-white shadow-sm shadow-purple-900/15'
                        : 'text-slate-700 hover:text-[#5A3E7A] hover:bg-white/90'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-purple-100' : 'text-[#5A3E7A]/80'}`} />
                    <span>{cat.label[lang]}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-lg text-[10px] font-extrabold tabular-nums leading-none ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-500 border border-slate-200/70'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Cards Grid: Balanced gap-2 on mobile/tablet and lg:gap-3 on large desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2 lg:gap-3 transition-all duration-500 ease-out">
          {sortedProducts.slice(0, visibleProductsCount).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Progressive Disclosure Accordion Controller */}
        {sortedProducts.length > defaultBatchSize && (
          <div className="pt-4 sm:pt-6 flex flex-col items-center justify-center space-y-3 sm:space-y-4 max-w-sm sm:max-w-md mx-auto">
            {/* Elegant Micro Progress Bar & Live Counter */}
            <div className="w-full space-y-1.5 text-center">
              <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-slate-500 px-1">
                <span>
                  {lang === 'ar'
                    ? `تم عرض ${Math.min(visibleProductsCount, sortedProducts.length)} من أصل ${sortedProducts.length} منتجاً`
                    : `Showing ${Math.min(visibleProductsCount, sortedProducts.length)} of ${sortedProducts.length} products`}
                </span>
                <span className="font-bold text-[#5A3E7A]">
                  {Math.round((Math.min(visibleProductsCount, sortedProducts.length) / sortedProducts.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#5A3E7A] to-purple-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(Math.min(visibleProductsCount, sortedProducts.length) / sortedProducts.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Action Buttons: Harmonized Luxe White Pill Accordion Expand & Collapse */}
            <div className="flex items-center gap-2.5 sm:gap-3 w-full justify-center flex-wrap">
              {visibleProductsCount < sortedProducts.length && (
                <button
                  type="button"
                  onClick={() => {
                    setVisibleProductsCount((prev) => prev + defaultBatchSize);
                  }}
                  className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-slate-800 hover:text-[#5A3E7A] bg-white hover:bg-purple-50/40 border border-slate-200/90 hover:border-[#5A3E7A]/40 transition-all duration-300 py-2 px-5 rounded-full min-h-[42px] shadow-sm hover:shadow active:scale-95 cursor-pointer"
                >
                  <LayoutGrid className="w-4 h-4 text-[#5A3E7A]" />
                  <span>
                    {lang === 'ar' 
                      ? `عرض المزيد (+${Math.min(defaultBatchSize, sortedProducts.length - visibleProductsCount)})` 
                      : `Show More (+${Math.min(defaultBatchSize, sortedProducts.length - visibleProductsCount)})`}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>
              )}

              {visibleProductsCount > defaultBatchSize && (
                <button
                  type="button"
                  onClick={() => {
                    setVisibleProductsCount(defaultBatchSize);
                    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#5A3E7A] bg-white hover:bg-purple-50/40 border border-slate-200/90 hover:border-[#5A3E7A]/40 transition-all duration-300 py-2 px-5 rounded-full min-h-[42px] shadow-sm hover:shadow active:scale-95 cursor-pointer"
                >
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                  <span>{lang === 'ar' ? 'عرض أقل' : 'Show Less'}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </section>
      ) : null,

      // DEDICATED HAIR DEVICES & STYLING SPOTLIGHT (Matching Photo: Siltek, Okema, Clara with Sub-Tabs & Direct Buy)
      hairDevices: (sectionsControl.hairDevices && activePresetId === 'cosmetics') ? (
        <HairDevicesSpotlight />
      ) : null,

      // 5. NATURAL BLOOM CAMPAIGN BANNER (Completely Dynamic from activeData.promoBanner)
      promoBanner: sectionsControl.promoBanner ? (() => {
        const targetBundle = products.find((p) => p.id === 'sb-04' || p.bundle) || products[0];

        return (
          <section id="campaign-section" className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950 via-[#5A3E7A] to-pink-950 text-white p-4 sm:p-8 lg:p-10 shadow-2xl border border-purple-800/40">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center">
                
                {/* Copy & CTA Column */}
                <div className="lg:col-span-6 space-y-3 sm:space-y-4 text-start">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-pink-200 border border-white/20">
                    <Gem className="w-3.5 h-3.5 text-amber-300" />
                    {activeData.promoBanner?.badge ? activeData.promoBanner.badge[lang] : (lang === 'ar' ? 'عرض خاص' : 'Special Offer')}
                  </span>
                  
                  {/* Balanced, Proportioned Heading Scale according to Luxe Pro Guidelines */}
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-relaxed tracking-tight text-white">
                    {activeData.promoBanner?.title ? activeData.promoBanner.title[lang] : (lang === 'ar'
                      ? 'وفّري 25% على بوكس العناية الكامل'
                      : 'Save 25% on the Complete Care Box')}
                  </h3>
                  
                  <p className="text-xs sm:text-sm lg:text-base text-purple-100/90 leading-relaxed max-w-xl">
                    {activeData.promoBanner?.subtitle ? activeData.promoBanner.subtitle[lang] : (lang === 'ar'
                      ? 'مع حقيبة مخملية وعينات مجانية وتوصيل سريع.'
                      : 'Includes a velvet pouch, free samples & fast shipping.')}
                  </p>

                  {/* Unified Single-Row Smart Glassmorphic Dual-CTA Capsule (Zero Truncation & Zero Wrapping) */}
                  <div className="pt-0.5 w-full sm:w-auto sm:inline-block">
                    <div className="grid grid-cols-2 items-center gap-1 p-1 rounded-2xl bg-white/12 backdrop-blur-md border border-white/20 shadow-lg w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => {
                          if (!targetBundle) {
                            showToast(isRtl ? 'لا توجد باقات متاحة في الكتالوج حالياً' : 'No bundles are currently available in catalog');
                            return;
                          }
                          setDiamondBundleQty(1);
                          setIsDiamondBundleModalOpen(true);
                        }}
                        className="h-11 px-1.5 sm:px-4 bg-white text-[#5A3E7A] hover:bg-purple-50 font-extrabold rounded-xl text-[11px] sm:text-sm shadow-sm active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5A3E7A] shrink-0" aria-hidden="true" />
                        <span>
                          {lang === 'ar' ? 'اطلبي البوكس' : 'Order Box'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (!targetBundle) {
                            showToast(isRtl ? 'لا توجد باقات متاحة في الكتالوج حالياً' : 'No bundles are currently available in catalog');
                            return;
                          }
                          addToCart(targetBundle, 1);
                          showToast({
                            message: isRtl ? 'تمت إضافة البوكس إلى السلة.' : 'Bundle added to bag.',
                            type: 'cart_add'
                          });
                          setIsCartOpen(true);
                        }}
                        className="h-11 px-1.5 sm:px-4 bg-purple-950/35 hover:bg-purple-950/60 text-white font-extrabold rounded-xl text-[11px] sm:text-sm active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                      >
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-200 shrink-0" aria-hidden="true" />
                        <span>{isRtl ? 'أضيفي للسلة' : 'Add to Bag'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enriched & Clean Hero Showcase Column */}
                <div className="lg:col-span-6 space-y-2.5 sm:space-y-3.5">
                  {/* Balanced Showcase Frame (Sweet-spot height on mobile so photo feels luxurious while controls stay visible) */}
                  <div 
                    className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 w-full h-[290px] sm:h-[370px] lg:h-[460px] group bg-purple-950/70 transition-all duration-300 select-none"
                  >
                    <img
                      src={promoSlides[activePromoSlide].image}
                      alt={promoSlides[activePromoSlide].title}
                      className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  </div>

                  {/* Dedicated Meta & Navigation Control Card (Top Row: Badge + Expand | Bottom Row: Spacious Navigation) */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm text-start space-y-3">
                    {/* Top Row: Single Clear Slide Title + Fullscreen Expand Button (Zero Redundant Badge) */}
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug min-w-0">
                        {promoSlides[activePromoSlide].title}
                      </h4>

                      {/* Dedicated Fullscreen Expand Button */}
                      <button
                        type="button"
                        onClick={() => setIsLightboxOpen(true)}
                        className="p-2 sm:p-2.5 bg-purple-950/80 hover:bg-purple-900 active:bg-purple-950 text-white hover:text-amber-300 rounded-xl border border-white/20 transition-all hover:scale-105 active:scale-95 w-10 h-10 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center cursor-pointer shadow-sm group"
                        title={isRtl ? 'توسيع وعرض بالحجم الكامل' : 'Full Screen Expand'}
                        aria-label={isRtl ? 'توسيع وعرض بالحجم الكامل' : 'Full Screen Expand'}
                      >
                        <Maximize2 className="w-4 h-4 text-white group-hover:text-amber-300 transition-colors" />
                      </button>
                    </div>

                    {/* Bottom Row: Centered, Balanced Navigation Pod with Comfortable Touch Spacing */}
                    <div className="pt-2.5 border-t border-white/10 flex items-center justify-center gap-2.5 sm:gap-4 w-full">
                      {/* Previous Slide Button */}
                      <button
                        type="button"
                        onClick={() => setActivePromoSlide((prev) => (prev === 0 ? promoSlides.length - 1 : prev - 1))}
                        className="py-2.5 px-3.5 sm:px-5 bg-purple-950/80 hover:bg-purple-900 active:bg-purple-950 text-white rounded-xl border border-white/20 transition-all hover:scale-105 active:scale-95 min-h-[44px] flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        aria-label={isRtl ? 'الشريحة السابقة' : 'Previous slide'}
                        title={isRtl ? 'الشريحة السابقة' : 'Previous slide'}
                      >
                        {isRtl ? <ChevronRight className="w-5 h-5 text-white" /> : <ChevronLeft className="w-5 h-5 text-white" />}
                        <span className="text-xs font-semibold">{isRtl ? 'السابق' : 'Prev'}</span>
                      </button>

                      {/* Slide Counter */}
                      <span className="text-xs sm:text-sm font-bold text-white bg-black/50 px-4 sm:px-6 py-2.5 rounded-xl border border-white/15 min-w-[70px] sm:min-w-[80px] text-center shadow-inner tracking-wider">
                        {activePromoSlide + 1} / {promoSlides.length}
                      </span>

                      {/* Next Slide Button */}
                      <button
                        type="button"
                        onClick={() => setActivePromoSlide((prev) => (prev === promoSlides.length - 1 ? 0 : prev + 1))}
                        className="py-2.5 px-3.5 sm:px-5 bg-purple-950/80 hover:bg-purple-900 active:bg-purple-950 text-white rounded-xl border border-white/20 transition-all hover:scale-105 active:scale-95 min-h-[44px] flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        aria-label={isRtl ? 'الشريحة التالية' : 'Next slide'}
                        title={isRtl ? 'الشريحة التالية' : 'Next slide'}
                      >
                        <span className="text-xs font-semibold">{isRtl ? 'التالي' : 'Next'}</span>
                        {isRtl ? <ChevronLeft className="w-5 h-5 text-white" /> : <ChevronRight className="w-5 h-5 text-white" />}
                      </button>
                    </div>
                  </div>

                  {/* Interactive Miniature Cards (Pure Photography Thumbnails — Zero Truncated Text Clutter) */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {promoSlides.map((slide, idx) => {
                      const isActive = activePromoSlide === idx;
                      return (
                        <button
                          key={slide.id}
                          type="button"
                          onClick={() => setActivePromoSlide(idx)}
                          aria-label={slide.title}
                          aria-current={isActive ? 'true' : undefined}
                          className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer group ${
                            isActive 
                              ? 'border-amber-400 ring-2 ring-amber-400/50 scale-[1.03] shadow-lg' 
                              : 'border-white/20 hover:border-white/50 opacity-75 hover:opacity-100'
                          }`}
                          title={slide.title}
                        >
                          <img 
                            src={slide.image} 
                            alt={slide.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {isActive && (
                            <div className="absolute top-1.5 end-1.5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-purple-950" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </section>
        );
      })() : null,

      // 6. BEFORE & AFTER PROOF (Interactive Slider - Completely Dynamic, Deduplicated Copy)
      beforeAfter: (sectionsControl.beforeAfter && activePresetId === 'cosmetics') ? (() => {
        const baCopy = resolveBeforeAfterCopy(activeData.beforeAfterMedia, lang);
        return (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-3.5 sm:space-y-4">
            <div className="text-start space-y-1 max-w-2xl">
              <span className="text-xs font-black text-[#5A3E7A] uppercase tracking-widest block">
                {baCopy.badge}
              </span>
              <h2 className="text-fluid-h2 font-black text-slate-900 font-brand-ar leading-tight">
                {baCopy.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {baCopy.subtitle}
              </p>
            </div>

            {/* Isolated 60fps Scroll-Safe Before/After Comparison Slider */}
            <BeforeAfterSlider
              beforeImage={activeData.beforeAfterMedia?.beforeImage}
              afterImage={activeData.beforeAfterMedia?.afterImage}
              lang={lang}
              isRtl={isRtl}
            />
          </section>
        );
      })() : null,

      // 7. VERIFIED CUSTOMER REVIEWS (Smart Luxury Testimonial Cards)
      testimonials: sectionsControl.testimonials ? (
        <>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-3.5 sm:space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2.5 sm:pb-3">
          <div className="space-y-0.5 sm:space-y-1 text-start">
            <h2 className="text-fluid-h2 font-black text-slate-900 font-brand-ar tracking-tight">
              {lang === 'ar' ? 'آراء عميلاتنا' : 'Customer Reviews'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              {lang === 'ar' 
                ? 'تجارب موثّقة من عميلات نَـدِي'
                : 'Verified experiences from NADI clients'}
            </p>
          </div>

          {/* Share Experience CTA Button: 3-Stop Plum-to-Amber Luxury Gradient matching Card Accent */}
          <button
            type="button"
            onClick={() => setIsReviewModalOpen(true)}
            className="shrink-0 h-10 sm:h-11 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-[#5A3E7A] via-[#8B5478] to-[#C67D2E] hover:from-[#4C3368] hover:via-[#7A4768] hover:to-[#B26E24] text-white font-extrabold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 sm:gap-2 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A3E7A] focus-visible:ring-offset-2"
          >
            <MessageSquarePlus className="w-4 h-4 text-white shrink-0" aria-hidden="true" />
            <span>{lang === 'ar' ? '+ شاركينا' : '+ Share'}</span>
          </button>
        </div>

        {/* Smart Luxury Testimonial Cards Carousel: Touch-Swipe enabled + Prev/Next Arrows */}
        <div
          className="relative touch-pan-y select-none"
          onTouchStart={(e) => {
            if (effectiveTestimonials.length <= 1) return;
            const touch = e.touches[0];
            reviewTouchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
          }}
          onTouchEnd={(e) => {
            const start = reviewTouchStartRef.current;
            reviewTouchStartRef.current = null;
            if (!start || effectiveTestimonials.length <= 1) return;
            const touch = e.changedTouches[0];
            const diffX = touch.clientX - start.x;
            const diffY = touch.clientY - start.y;
            const elapsed = Date.now() - start.time;

            // Trigger slide change only on intentional horizontal swipe (prevents accidental vertical scroll interference)
            if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY) * 1.2 && elapsed < 900) {
              const goNext = isRtl ? diffX > 0 : diffX < 0;
              setReviewSlide((prev) =>
                goNext
                  ? (prev + 1) % effectiveTestimonials.length
                  : (prev - 1 + effectiveTestimonials.length) % effectiveTestimonials.length
              );
            }
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6">
            {[effectiveTestimonials[reviewSlide % effectiveTestimonials.length], effectiveTestimonials[(reviewSlide + 1) % effectiveTestimonials.length]].filter(Boolean).map((review, idx) => {
              const reviewerInitial = getReviewerInitial(review.name[lang]);

              return (
                <div 
                  key={`${review.id}-${idx}`}
                  className={`bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between gap-4 relative overflow-hidden group ${
                    idx === 1 ? 'hidden sm:flex' : 'flex'
                  }`}
                >
                  {/* Signature Luxury Gradient Accent on Top (Harmonizes with Share CTA Gradient) */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-amber-400 to-rose-400" aria-hidden="true" />

                  {/* Header: Rating + Clean Single-Checkmark Verified Badge */}
                  <div className="space-y-3.5 text-start">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-[#5A3E7A] border border-purple-200/80 text-xs font-black tabular-nums">
                        <BadgeCheck className="w-3.5 h-3.5 text-[#5A3E7A]" aria-hidden="true" />
                        <span>{Number(review.rating || 5).toFixed(1)} / 5</span>
                      </span>

                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/90">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                        <span>{review.badge[lang]}</span>
                      </span>
                    </div>

                    {/* Testimonial Quote */}
                    <div className="relative pt-1">
                      <Quote className="w-7 h-7 text-purple-100 absolute -top-2 -start-1.5 -z-0 opacity-80" aria-hidden="true" />
                      <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium relative z-10">
                        «{review.comment[lang]}»
                      </p>
                    </div>

                    {/* Purchased Product Deep-Link Pill */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const targetProd = products.find(p => p.id === review.purchasedProduct.id) || products[0];
                          openProductPDP(targetProd);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 min-h-[38px] rounded-xl bg-purple-50/80 hover:bg-purple-100 text-[#5A3E7A] text-xs font-extrabold transition-colors border border-purple-200/60 group/btn cursor-pointer"
                        title={lang === 'ar' ? 'عرض هذا المنتج' : 'View Product'}
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#5A3E7A] shrink-0" aria-hidden="true" />
                        <span className="underline decoration-purple-300 group-hover/btn:decoration-[#5A3E7A]">
                          {review.purchasedProduct[lang]}
                        </span>
                        {isRtl ? <ArrowLeft className="w-3 h-3 ms-0.5 shrink-0" aria-hidden="true" /> : <ArrowRight className="w-3 h-3 ms-0.5 shrink-0" aria-hidden="true" />}
                      </button>
                    </div>
                  </div>

                  {/* Clean Footer: Luxury Monogram Avatar + Name/City + Review Date */}
                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3 text-start">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        aria-hidden="true"
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5A3E7A] to-[#8B5478] text-white font-extrabold text-sm flex items-center justify-center ring-2 ring-purple-100 shadow-2xs shrink-0"
                      >
                        {reviewerInitial}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug truncate">
                          {review.name[lang]}
                        </h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
                          <span className="truncate">{review.city[lang]}</span>
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                      {review.date[lang]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carousel Controls with Safe Distance */}
          <div className="mt-4 sm:mt-5 flex items-center justify-between">
            {/* Dots Pagination */}
            <div className="flex items-center gap-1.5">
              {effectiveTestimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setReviewSlide(i)}
                  className={`transition-all rounded-full ${
                    reviewSlide % effectiveTestimonials.length === i 
                      ? 'w-7 h-2 bg-[#5A3E7A]' 
                      : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setReviewSlide((prev) => (prev - 1 + effectiveTestimonials.length) % effectiveTestimonials.length)}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-xs transition-colors min-h-[40px] min-w-[40px]"
                aria-label="Previous review"
              >
                {isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setReviewSlide((prev) => (prev + 1) % effectiveTestimonials.length)}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-xs transition-colors min-h-[40px] min-w-[40px]"
                aria-label="Next review"
              >
                {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7.B CLONED CUSTOMER REVIEWS (When cloned by merchant/developer) */}
      {clonedSections?.testimonials?.isCloned && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-3.5 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-purple-200/60 pb-4">
            <div className="space-y-1.5 text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-900 text-xs font-bold">
                <Award className="w-3.5 h-3.5 text-purple-700" />
                <span>{(clonedSections.testimonials.badgeAr || (lang === 'ar' ? 'تجارب إضافية موثقة' : 'Additional Highlights')).replace(/\s*[\u2728\u2B50\u{1F31F}\u2605\u2726]/gu, '')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-brand-ar">
                {lang === 'ar' ? (clonedSections.testimonials.titleAr || 'قصص نجاح وتجارب عميلاتنا الإضافية') : (clonedSections.testimonials.titleEn || 'Additional Verified Testimonials')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {lang === 'ar' 
                  ? (clonedSections.testimonials.subtitleAr || 'مجموعة إضافية من آراء وتجارب عميلاتنا الموثقة مع منتجاتنا الأصلية')
                  : (clonedSections.testimonials.subtitleEn || 'Curated secondary insights from our happy community')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {effectiveTestimonials.slice(0, 2).map((review) => (
              <div
                key={`cloned-review-${review.id}`}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 text-start relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-[#5A3E7A] border border-purple-200/80 text-xs font-black">
                      <BadgeCheck className="w-3.5 h-3.5 text-[#5A3E7A]" />
                      <span>{Number((review as any).rating || 5).toFixed(1)} / 5</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-900 border border-purple-200">
                      {review.badge[lang]}
                    </span>
                  </div>

                  <div className="relative">
                    <Quote className="w-8 h-8 text-purple-100 absolute -top-3 -start-2 -z-0 opacity-80" />
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium relative z-10 italic">
                      "{review.comment[lang]}"
                    </p>
                  </div>

                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-900 text-xs font-bold border border-purple-200">
                      <ShoppingBag className="w-3.5 h-3.5 text-purple-600" />
                      <span>{lang === 'ar' ? 'المنتج المقتنى:' : 'Purchased:'}</span>
                      <span className="font-extrabold">{review.purchasedProduct[lang]}</span>
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-purple-100 flex items-center justify-between text-start">
                  <div className="flex items-center gap-3">
                    <img 
                      src={review.avatar} 
                      alt={review.name[lang]} 
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-100 shadow-2xs"
                    />
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                        {review.name[lang]}
                      </h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{review.city[lang]}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {review.date[lang]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
        )}
        </>
      ) : null,
  };

  return (
    <div className="space-y-8 sm:space-y-14 pb-6 sm:pb-10">
      {sectionsOrder.map((sectionId) => (
        <React.Fragment key={sectionId}>
          {sectionsContent[sectionId]}
        </React.Fragment>
      ))}

      {/* Storefront FAQ Accordion Section (Placed cleanly right above the Footer) */}
      <StoreFAQSection />

      {/* IN-PAGE DIAMOND BUNDLE QUICK VIEW MODAL (معاينة وشراء البوكس الماسي الفورية في الصفحة الرئيسية) */}
      {isDiamondBundleModalOpen && (() => {
        const targetBundle = products.find((p) => p.id === 'sb-04' || p.bundle) || products[0];
        if (!targetBundle) return null;
        const currentPriceObj = convertPrice(targetBundle.basePriceUSD * diamondBundleQty);
        const originalPriceObj = targetBundle.originalPriceUSD ? convertPrice(targetBundle.originalPriceUSD * diamondBundleQty) : null;

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="relative max-w-xl w-full bg-white rounded-3xl shadow-2xl border border-purple-200 overflow-hidden my-8 text-slate-900 text-start">
              
              {/* Modal Header */}
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
                      {(activeData.promoBanner?.badge ? activeData.promoBanner.badge[lang] : (isRtl ? 'عرض البوكس المتكامل' : 'Complete Box Offer')).replace(/\s*[\u{1F48E}\u2728\u2B50\u{1F31F}\u2605\u2726]/gu, '')}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setIsDiamondBundleModalOpen(false)}
                  className="p-2.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Product Glance */}
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

                {/* Bundle Regimen Contents */}
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

                {/* Value Propositions */}
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

                {/* Quantity Selector */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs sm:text-sm font-bold text-slate-700">
                    {isRtl ? 'الكمية المطلوبة من البوكس:' : 'Bundle Quantity:'}
                  </span>
                  <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setDiamondBundleQty((q) => Math.max(1, q - 1))}
                      disabled={diamondBundleQty <= 1}
                      className="p-1.5 rounded-lg bg-white shadow-xs hover:bg-slate-200 disabled:opacity-40 transition-all min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-black text-sm px-2 min-w-[24px] text-center">
                      {diamondBundleQty}
                    </span>
                    <button
                      onClick={() => setDiamondBundleQty((q) => Math.min(10, q + 1))}
                      className="p-1.5 rounded-lg bg-white shadow-xs hover:bg-slate-200 transition-all min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    addToCart(targetBundle, diamondBundleQty);
                    setIsDiamondBundleModalOpen(false);
                    showToast({
                      message: isRtl ? `تمت إضافة ${diamondBundleQty} من بوكس نَدِي الماسي لسلتك بنجاح!` : `Added ${diamondBundleQty} Diamond Box to your cart!`,
                      type: 'cart_add'
                    });
                    setIsCartOpen(true);
                  }}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-900 to-pink-900 text-white hover:from-purple-950 hover:to-pink-950 font-black text-xs sm:text-sm shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-300" />
                  <span>
                    {isRtl ? `أضيفي البوكس للسلة فورا (${currentPriceObj.text})` : `Add Bundle to Cart (${currentPriceObj.text})`}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsDiamondBundleModalOpen(false);
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
      })()}

      {/* FULLSCREEN IMAGE LIGHTBOX MODAL (عرض وتوسع الصور الاحترافي مع أسهم التنقل) */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200 select-none"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar: Badge, Counter & Close Button */}
          <div className="w-full flex items-center justify-between z-30 max-w-5xl mx-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-amber-300 border border-white/20">
                <BadgeCheck className="w-3.5 h-3.5 text-amber-300" />
                {promoSlides[activePromoSlide].badge}
              </span>
              <span className="text-xs font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                {activePromoSlide + 1} / {promoSlides.length}
              </span>
            </div>

            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2.5 bg-white/15 hover:bg-white/25 text-white rounded-full transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center border border-white/20 hover:scale-105"
              aria-label="Close Lightbox"
              title={isRtl ? 'إغلاق المعاينة' : 'Close Preview'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center Area: Left Arrow + Main Image + Right Arrow */}
          <div 
            className="relative w-full max-w-5xl mx-auto flex-1 flex items-center justify-center px-2 sm:px-12 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating Previous Arrow Button - High-Visibility Crisp White Glow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActivePromoSlide((prev) => (prev === 0 ? promoSlides.length - 1 : prev - 1));
              }}
              className="absolute start-0 sm:start-2 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 bg-white/20 hover:bg-white/35 active:bg-white/40 text-white rounded-full backdrop-blur-xl border-2 border-white/60 transition-all hover:scale-110 active:scale-95 shadow-[0_0_25px_rgba(255,255,255,0.3)] min-w-[48px] sm:min-w-[54px] min-h-[48px] sm:min-h-[54px] flex items-center justify-center cursor-pointer z-30 group"
              aria-label={isRtl ? 'الصورة السابقة' : 'Previous image'}
              title={isRtl ? 'الصورة السابقة' : 'Previous image'}
            >
              {isRtl ? <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.5] group-hover:scale-110 transition-transform drop-shadow" /> : <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.5] group-hover:scale-110 transition-transform drop-shadow" />}
            </button>

            {/* Main Showcase Image */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/20 max-h-[55vh] sm:max-h-[62vh] bg-slate-950 flex items-center justify-center">
              <img
                key={promoSlides[activePromoSlide].id}
                src={promoSlides[activePromoSlide].image}
                alt={promoSlides[activePromoSlide].title}
                className="max-h-[55vh] sm:max-h-[62vh] w-auto max-w-full object-contain mx-auto animate-in fade-in zoom-in-95 duration-200"
              />
            </div>

            {/* Floating Next Arrow Button - High-Visibility Crisp White Glow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActivePromoSlide((prev) => (prev === promoSlides.length - 1 ? 0 : prev + 1));
              }}
              className="absolute end-0 sm:end-2 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 bg-white/20 hover:bg-white/35 active:bg-white/40 text-white rounded-full backdrop-blur-xl border-2 border-white/60 transition-all hover:scale-110 active:scale-95 shadow-[0_0_25px_rgba(255,255,255,0.3)] min-w-[48px] sm:min-w-[54px] min-h-[48px] sm:min-h-[54px] flex items-center justify-center cursor-pointer z-30 group"
              aria-label={isRtl ? 'الصورة التالية' : 'Next image'}
              title={isRtl ? 'الصورة التالية' : 'Next image'}
            >
              {isRtl ? <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.5] group-hover:scale-110 transition-transform drop-shadow" /> : <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.5] group-hover:scale-110 transition-transform drop-shadow" />}
            </button>
          </div>

          {/* Bottom Area: Caption, Thumbnails & CTA */}
          <div 
            className="w-full max-w-2xl mx-auto flex flex-col items-center gap-3 text-center text-white z-30 pt-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title & Desc */}
            <div className="space-y-1 px-4">
              <h4 className="text-sm sm:text-base font-extrabold text-white">
                {promoSlides[activePromoSlide].title}
              </h4>
              {promoSlides[activePromoSlide].desc && (
                <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed max-w-lg line-clamp-2">
                  {promoSlides[activePromoSlide].desc}
                </p>
              )}
            </div>

            {/* Interactive Thumbnail Dots / Strips within Lightbox */}
            <div className="flex items-center gap-2 pt-1">
              {promoSlides.map((slide, idx) => {
                const isActive = activePromoSlide === idx;
                return (
                  <button
                    key={slide.id}
                    onClick={() => setActivePromoSlide(idx)}
                    className={`relative rounded-lg overflow-hidden w-12 h-12 sm:w-14 sm:h-14 border-2 transition-all cursor-pointer ${
                      isActive 
                        ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105' 
                        : 'border-white/20 hover:border-white/50 opacity-60 hover:opacity-100'
                    }`}
                    title={slide.title}
                  >
                    <img 
                      src={slide.image} 
                      alt={slide.title} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>

            {/* Action CTA inside Lightbox */}
            <div className="pt-1 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => {
                  setIsLightboxOpen(false);
                  setDiamondBundleQty(1);
                  setIsDiamondBundleModalOpen(true);
                }}
                className="h-10 sm:h-11 px-5 bg-[#5A3E7A] hover:bg-[#483162] text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span>{isRtl ? 'اطلبي هذا البوكس الآن (خصم 25%)' : 'Order This Bundle (-25%)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
