import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Droplets,
  SlidersHorizontal,
  Check,
  Gift,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Wind,
} from 'lucide-react';
import { useCommerce, SectionId } from '../context/CommerceContext';
import { ProductCard } from './ProductCard';
import { InfiniteBrandTicker } from './InfiniteBrandTicker';
import { HairDevicesSpotlight } from './HairDevicesSpotlight';
import { BeforeAfterSlider } from './common/BeforeAfterSlider';
import { EditorialHero } from './EditorialHero';
import { StoreFAQSection } from './StoreFAQSection';
import { SkinDiagnosisSection } from './storefront/SkinDiagnosisSection';
import { PromoCampaignSection } from './storefront/PromoCampaignSection';
import { TestimonialsSection } from './storefront/TestimonialsSection';
import { DiamondBundleModal } from './storefront/DiamondBundleModal';
import { PromoLightboxModal } from './storefront/PromoLightboxModal';
import { classifyProductCollection } from '../lib/productCollections';
import { resolveBeforeAfterCopy } from '../lib/sliderGestureIntent';
import { resolvePromoSlides } from '../data/storeContentDefaults';

export const StorefrontView: React.FC = () => {
  const {
    lang, activeData,
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

  // Promo Banner Slides resolved from cloud-synced Admin config (backward compatible with legacy image1/image2)
  const promoSlides = useMemo(() => {
    return resolvePromoSlides(activeData.promoBanner).map((slide) => ({
      id: slide.id,
      image: slide.image,
      badge: slide.badge[lang],
      title: slide.title[lang],
      desc: slide.desc[lang],
    }));
  }, [activeData.promoBanner, lang]);

  // Keep activePromoSlide within valid bounds if admin removes slides
  const safePromoSlideIdx = promoSlides.length > 0 ? activePromoSlide % promoSlides.length : 0;

  const products = activeData.products;
  const targetBundle = useMemo(
    () => products.find((p) => p.id === 'sb-04' || p.bundle) || products[0],
    [products]
  );

  // Step 1: Apply active smart skin diagnosis filter first so category pill counters stay 100% live & accurate
  const skinFilteredProducts = useMemo(() => {
    if (!activeSkinFilter) return products;
    return products.filter((p) => {
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
  }, [products, activeSkinFilter]);

  const matchesCollection = useCallback((p: (typeof products)[number], catId: string) => {
    if (catId === 'all') return true;
    if (catId === 'skin' || catId === 'box' || catId === 'hair') {
      return classifyProductCollection(p) === catId;
    }
    return p.category.en.toLowerCase().includes(catId.toLowerCase()) || p.category.ar.includes(catId);
  }, []);

  const productCollections = useMemo(() => {
    return [
      { id: 'all', icon: LayoutGrid, label: { ar: 'الكل', en: 'All' }, count: skinFilteredProducts.length },
      { id: 'skin', icon: Droplets, label: { ar: 'عناية بالبشرة', en: 'Skincare' }, count: skinFilteredProducts.filter((p) => matchesCollection(p, 'skin')).length },
      { id: 'box', icon: Gift, label: { ar: 'بكجات وعروض', en: 'Gift Sets' }, count: skinFilteredProducts.filter((p) => matchesCollection(p, 'box')).length },
      { id: 'hair', icon: Wind, label: { ar: 'أجهزة الشعر', en: 'Hair Devices' }, count: skinFilteredProducts.filter((p) => matchesCollection(p, 'hair')).length },
    ].filter((cat) => cat.id === 'all' || activePresetId === 'cosmetics' || cat.count > 0);
  }, [skinFilteredProducts, matchesCollection, activePresetId]);

  // Step 2: Filter products by selected collection pill
  const filteredProducts = useMemo(
    () => skinFilteredProducts.filter((p) => matchesCollection(p, selectedCategory)),
    [skinFilteredProducts, matchesCollection, selectedCategory]
  );

  // Sort products (with balanced round-robin interleaving on default cosmetics 'All' view so bundles & hair devices appear immediately)
  const sortedProducts = useMemo(() => {
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
  }, [activePresetId, selectedCategory, sortBy, activeSkinFilter, filteredProducts]);

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
        customSlides={activeData.heroSlides}
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
        <SkinDiagnosisSection
          lang={lang}
          isRtl={isRtl}
          activeSkinFilter={activeSkinFilter}
          setActiveSkinFilter={setActiveSkinFilter}
          skinDiagnosisCards={activeData?.skinDiagnosisCards}
          showToast={showToast}
        />
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
      promoBanner: sectionsControl.promoBanner ? (
        <PromoCampaignSection
          lang={lang}
          isRtl={isRtl}
          promoBanner={activeData.promoBanner}
          targetBundle={targetBundle}
          promoSlides={promoSlides}
          safePromoSlideIdx={safePromoSlideIdx}
          setActivePromoSlide={setActivePromoSlide}
          onOpenBundleModal={() => {
            setDiamondBundleQty(1);
            setIsDiamondBundleModalOpen(true);
          }}
          onOpenLightbox={() => setIsLightboxOpen(true)}
          addToCart={addToCart}
          showToast={showToast}
          setIsCartOpen={setIsCartOpen}
        />
      ) : null,

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
        <TestimonialsSection
          lang={lang}
          isRtl={isRtl}
          activePresetId={activePresetId}
          testimonials={activeData?.testimonials}
          products={products}
          clonedTestimonialConfig={clonedSections?.testimonials}
          openProductPDP={openProductPDP}
          onOpenReviewModal={() => setIsReviewModalOpen(true)}
        />
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

      {/* IN-PAGE DIAMOND BUNDLE QUICK VIEW MODAL */}
      <DiamondBundleModal
        isOpen={isDiamondBundleModalOpen}
        onClose={() => setIsDiamondBundleModalOpen(false)}
        lang={lang}
        isRtl={isRtl}
        targetBundle={targetBundle}
        promoBadge={activeData.promoBanner?.badge}
        qty={diamondBundleQty}
        setQty={setDiamondBundleQty}
        convertPrice={convertPrice}
        addToCart={addToCart}
        showToast={showToast}
        setIsCartOpen={setIsCartOpen}
        openProductPDP={openProductPDP}
      />

      {/* FULLSCREEN IMAGE LIGHTBOX MODAL */}
      <PromoLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        isRtl={isRtl}
        slides={promoSlides}
        activeSlideIdx={safePromoSlideIdx}
        setActiveSlideIdx={setActivePromoSlide}
        onOrderBundle={() => {
          setIsLightboxOpen(false);
          setDiamondBundleQty(1);
          setIsDiamondBundleModalOpen(true);
        }}
      />

    </div>
  );
};
