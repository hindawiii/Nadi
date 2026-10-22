import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Truck, ShieldCheck, CreditCard, ArrowRight, ArrowLeft, 
  Star, CheckCircle2, ChevronRight, ChevronLeft, MessageCircle, Heart, 
  MapPin, Phone, Mail, Award, Droplets, Sun, Sparkle, Shield, 
  Layers, MessageSquarePlus, SlidersHorizontal, Quote, ThumbsUp, Check, BadgeCheck,
  ZoomIn, Maximize2, X, Plus, Minus, ShoppingBag, Gift
} from 'lucide-react';
import { useCommerce, SectionId } from '../context/CommerceContext';
import { ProductCard } from './ProductCard';
import { InfiniteBrandTicker } from './InfiniteBrandTicker';
import { HairDevicesSpotlight } from './HairDevicesSpotlight';

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
  const [helpfulVotes, setHelpfulVotes] = useState<Record<number, number>>({ 0: 42, 1: 37, 2: 56, 3: 29 });
  const [userVoted, setUserVoted] = useState<Record<number, boolean>>({});
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [beforeAfterPos, setBeforeAfterPos] = useState<number>(50);
  const [reviewSlide, setReviewSlide] = useState<number>(0);

  // Diamond Offer interactive states
  const [activePromoSlide, setActivePromoSlide] = useState<number>(0);
  const [isDiamondBundleModalOpen, setIsDiamondBundleModalOpen] = useState<boolean>(false);
  const [diamondBundleQty, setDiamondBundleQty] = useState<number>(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Promo Banner Slides definition
  const promoSlides = [
    {
      id: 1,
      image: activeData.promoBanner?.image1 || "https://images.unsplash.com/photo-1608248597359-59754b2d354a?auto=format&fit=crop&w=800&q=80",
      badge: activeData.promoBanner?.image1Badge ? activeData.promoBanner.image1Badge[lang] : (isRtl ? 'مكوّنات نباتية 100% 🌿' : '100% Botanicals 🌿'),
      title: isRtl ? 'خلاصات نباتية نقية موثقة' : '100% Pure Certified Botanicals',
      desc: isRtl ? 'مستخلصة على البارد بعناية فائقة لتغذية أعماق خلايا البشرة وتحفيز الحيوية الطبيعية.' : 'Cold-pressed botanical extracts deeply nourishing skin layers.'
    },
    {
      id: 2,
      image: activeData.promoBanner?.image2 || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      badge: activeData.promoBanner?.image2Badge ? activeData.promoBanner.image2Badge[lang] : (isRtl ? 'خصم 25% على البوكس 🎁' : '25% OFF Box 🎁'),
      title: isRtl ? 'بوكس النضارة الكامل الشامل' : 'Natural Bloom Complete Routine Box',
      desc: isRtl ? 'البرنامج الأكثر شمولاً الذي يضم 4 مستحضرات عناية متكاملة تمنح بشرتك نضارة قطرات الندى.' : 'The complete 4-step radiance routine in a luxury gift package.'
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
      badge: isRtl ? 'حقيبة مخملية هدية 👝' : 'Complimentary Velvet Pouch 👝',
      title: isRtl ? 'حقيبة مخملية + عينات تجريبية مجاناً' : 'Complimentary Velvet Cosmetic Pouch',
      desc: isRtl ? 'تأتيك كهدية تقديرية مجانية مبطنة لحفظ مستحضراتك بأمان مع 3 عينات تجريبية سفرية.' : 'Included free with every Diamond Box order to protect your essentials.'
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      badge: isRtl ? 'نتائج مثبتة خلال 14 يوماً 🌟' : 'Visible 14-Day Results 🌟',
      title: isRtl ? 'نضارة وترطيب عميق مستدام' : 'Deep Hydration & Long-Lasting Glow',
      desc: isRtl ? 'نتائج سريرية واستطلاعية مؤكدة بنسبة رضا تتجاوز 98% في استعادة نضارة البشرة.' : 'Clinically observed improvements with over 98% customer satisfaction.'
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

  // Filter products by category and active smart skin routine
  const filteredProducts = products.filter((p) => {
    if (activeSkinFilter) {
      if (activeSkinFilter === 'hydrated' && !p.id.includes('01') && !p.id.includes('04')) return false;
      if (activeSkinFilter === 'even' && !p.id.includes('02') && !p.id.includes('04')) return false;
      if (activeSkinFilter === 'firm' && !p.id.includes('03') && !p.id.includes('04')) return false;
      if (activeSkinFilter === 'radiant' && !p.id.includes('02') && !p.id.includes('03') && !p.id.includes('04')) return false;
    }
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'hair') {
      return p.category.en.toLowerCase().includes('hair') || p.category.ar.includes('شعر') || p.id.startsWith('hd-');
    }
    if (selectedCategory === 'skin') {
      return p.category.en.toLowerCase().includes('skin') || p.category.ar.includes('بشرة') || p.id.startsWith('sb-01') || p.id.startsWith('sb-02') || p.id.startsWith('sb-03');
    }
    if (selectedCategory === 'box') {
      return p.category.en.toLowerCase().includes('box') || p.category.en.toLowerCase().includes('gift') || p.category.ar.includes('بكج') || !!p.bundle;
    }
    return p.category.en.toLowerCase().includes(selectedCategory.toLowerCase()) || p.category.ar.includes(selectedCategory);
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.basePriceUSD - b.basePriceUSD;
    if (sortBy === 'price-desc') return b.basePriceUSD - a.basePriceUSD;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // 'featured' keeps curated order
  });

  const skinTypes = [
    {
      id: 'hydrated',
      title: { ar: 'بشرة مرطبة', en: 'Moisturized Skin' },
      ingredient: { ar: 'حمض الهيالورونيك المكثف', en: 'Intense Hyaluronic Acid' },
      desc: { ar: 'حمض الهيالورونيك المكثف لحبس الرطوبة ومحاربة الجفاف.', en: 'Hyaluronic acid deep hydration barrier.' },
      icon: Droplets,
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80', // High-end dewy skin hydration
      fallbackImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80',
      badge: { ar: 'ترطيب عميق 💧', en: 'Deep Moisture 💧' },
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
      badge: { ar: 'تفتيح وتوحيد ☀️', en: 'Even Tone ☀️' },
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
      badge: { ar: 'شد ومرونة 🌿', en: 'Firm & Elastic 🌿' },
      bg: 'bg-purple-50/70 border-purple-200/80 hover:border-purple-400 text-purple-900',
      badgeColor: 'bg-purple-700 text-white'
    },
    {
      id: 'radiant',
      title: { ar: 'بشرة مشرقة', en: 'Radiant Skin' },
      ingredient: { ar: 'زيوت اللافندر والورد', en: 'Rose & Lavender Infusion' },
      desc: { ar: 'زيوت اللافندر والورد لنضارة فورية وإشراقة طبيعية تدوم.', en: 'Lavender & Rose extracts for healthy glow.' },
      icon: Sparkle,
      image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=700&q=80', // Radiant glow with botanical dropper
      fallbackImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80',
      badge: { ar: 'إشراقة طبيعية ✨', en: 'Natural Glow ✨' },
      bg: 'bg-rose-50/70 border-rose-200/80 hover:border-rose-400 text-rose-900',
      badgeColor: 'bg-rose-600 text-white'
    }
  ];

  const testimonials = [
    {
      id: 0,
      name: { ar: 'فاطمة أم عبد الله', en: 'Fatima Um Abdallah' },
      city: { ar: 'أم درمان، السودان', en: 'Omdurman, Sudan' },
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      purchasedProduct: { ar: 'مرطب الهيالورونيك المكثف', en: 'Intense Hyaluronic Moisturizer', id: 'sb-01' },
      date: { ar: 'منذ أسبوعين', en: '2 weeks ago' },
      comment: {
        ar: 'أحس بالفرق من أول أسبوع! النضارة واضحة وتوصيلهم كان سريع ومحترم جداً في أم درمان. أنصح به كل صديقاتي.',
        en: 'Felt the noticeable glow in the first week! Ultra-fast and polite delivery in Omdurman. Highly recommended!'
      },
      badge: { ar: 'مشتري مؤكد ✓', en: 'Verified Buyer ✓' }
    },
    {
      id: 1,
      name: { ar: 'لولي ك.', en: 'Loli K.' },
      city: { ar: 'الخرطوم، السودان', en: 'Khartoum, Sudan' },
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      purchasedProduct: { ar: 'سيروم فيتامين سي النقي', en: 'Pure Vitamin C Serum', id: 'sb-02' },
      date: { ar: 'منذ شهر', en: '1 month ago' },
      comment: {
        ar: 'المنتجات فعلاً غيرت روتين بشرتي، طبيعية وخفيفة ونتيجتها واضحة من أول استخدامين. تجربة ممتازة جداً.',
        en: 'Truly transformed my skin routine. Completely pure, lightweight and results appear immediately.'
      },
      badge: { ar: 'عميلة VIP دائم', en: 'VIP Customer' }
    },
    {
      id: 2,
      name: { ar: 'مروة الطاهر', en: 'Marwa Al-Tahir' },
      city: { ar: 'الرياض، السعودية', en: 'Riyadh, Saudi Arabia' },
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      purchasedProduct: { ar: 'مجموعة بوكس التوفير الكاملة', en: 'Natural Bloom Complete Box', id: 'sb-04' },
      date: { ar: 'منذ 3 أسابيع', en: '3 weeks ago' },
      comment: {
        ar: 'أفضل منتجات عناية جربتها. مكونات أصلية ومضمونة وما سببت لي أي تحسس، وتغليف البكج فخم ومبهر.',
        en: 'The finest skincare formulas I have used. Genuine ingredients with zero irritation, beautifully packaged.'
      },
      badge: { ar: 'مشتري مؤكد ✓', en: 'Verified Buyer ✓' }
    },
    {
      id: 3,
      name: { ar: 'ولاء أحمد', en: 'Walaa Ahmed' },
      city: { ar: 'بحري، السودان', en: 'Bahri, Sudan' },
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      purchasedProduct: { ar: 'كريم لافندر الليلي للترميم', en: 'Lavender Night Cream', id: 'sb-03' },
      date: { ar: 'منذ 5 أيام', en: '5 days ago' },
      comment: {
        ar: 'خدمة العملاء على الواتساب قمة في الذوق والمساعدة، ساعدوني في اختيار المرطب والسيروم المناسب لنوع بشرتي.',
        en: 'WhatsApp consultation was extremely helpful and gentle. Guided me precisely to the ideal moisturizer.'
      },
      badge: { ar: 'استشارة موثقة ✓', en: 'Consultation Verified ✓' }
    }
  ];

  // Dynamic Skin Routine Diagnosis from activeData or fallback
  const effectiveSkinDiagnosis = (activeData?.skinDiagnosisCards && activeData.skinDiagnosisCards.length > 0)
    ? activeData.skinDiagnosisCards.map(s => ({
        ...s,
        icon: s.id === 'hydrated' ? Droplets : (s.id === 'even' ? Sun : (s.id === 'firm' ? Shield : Sparkle))
      }))
    : skinTypes;

  // Dynamic Verified Testimonials from activeData or fallback (approved or seed reviews)
  const rawTestimonials = (activeData?.testimonials && activeData.testimonials.length > 0)
    ? activeData.testimonials
    : testimonials;
  const approvedTestimonials = rawTestimonials.filter((t: any) => t.status === 'approved' || !t.status);
  const effectiveTestimonials = approvedTestimonials.length > 0 ? approvedTestimonials : rawTestimonials;

  const iconMap: Record<string, any> = {
    Sparkles,
    Truck,
    ShieldCheck,
    CreditCard
  };

  const sectionsContent: Record<SectionId, React.ReactNode> = {
    // 1. HERO SECTION (Matching So Beauty style in photos 1 & 2)
    hero: sectionsControl.hero ? (
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50/60 via-slate-50 to-white pt-6 sm:pt-12 pb-4 sm:pb-6 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Hero Copy */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-start">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/90 text-[#5A3E7A] text-xs sm:text-sm font-extrabold border border-purple-200/90 shadow-xs backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5 text-purple-700 animate-pulse" />
                  <span>{activeData.storeSlogan ? activeData.storeSlogan[lang] : (lang === 'ar' ? 'إشراقة طبيعية، تليق بك.' : 'Natural radiance, made for you.')}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.25] font-brand-ar">
                  {activeData.heroTitle[lang]}
                </h1>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {activeData.heroSubtitle[lang]}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-8 py-3.5 bg-theme-primary hover:bg-theme-primary-hover text-white font-extrabold rounded-full text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"
                  >
                    <span>{activeData.heroCtaPrimary[lang]}</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById('campaign-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold rounded-full text-sm sm:text-base transition-all duration-300 flex items-center justify-center min-h-[48px] shadow-xs cursor-pointer"
                  >
                    <span>{activeData.heroCtaSecondary[lang]}</span>
                  </button>
                </div>

                {/* Social trust badge */}
                <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-500 font-medium">
                  <div className="flex -space-x-2 rtl:space-x-reverse">
                    <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="avatar" />
                    <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="avatar" />
                    <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="avatar" />
                  </div>
                  <span>
                    {lang === 'ar' ? 'أكثر من 1,200+ عميلة موثقة راضية تماماً' : 'Over 1,200+ happy verified customers'}
                  </span>
                </div>
              </div>

              {/* Hero Image Presentation */}
              <div className="lg:col-span-6 relative">
                <div className="relative aspect-[4/5] sm:aspect-[4/4.8] max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src={activeData.heroImage}
                    alt={activeData.heroTitle[lang]}
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
                </div>
              </div>

            </div>
          </div>
        </section>
      ) : null,

      // LUXURY INFINITE BRAND & SLOGAN TICKER
      brandTicker: sectionsControl.brandTicker ? (
        <InfiniteBrandTicker className="mt-1 mb-6 sm:mt-2 sm:mb-8" />
      ) : null,

      // 2. VALUE PROPOSITIONS STRIP (Matching Photo 2: نتائج فعالة، شحن سريع، أصلية 100%، دفع آمن)
      valueProps: sectionsControl.valueProps ? (
        <>
          <section className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
              {activeData.valueProps.map((item, idx) => {
                const Icon = iconMap[item.icon] || Sparkles;
                return (
                  <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-start gap-3 p-2">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5A3E7A] flex items-center justify-center shrink-0 border border-purple-100 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                        {item.title[lang]}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {item.desc[lang]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* CLONED VALUE PROPOSITIONS INSTANCE */}
          {clonedSections?.valueProps?.isCloned && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 animate-in fade-in duration-300">
          <div className="bg-gradient-to-r from-purple-950/90 via-slate-900 to-purple-950/90 text-white p-6 sm:p-8 rounded-3xl border-2 border-purple-500/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-purple-800/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  {clonedSections.valueProps.badgeAr || 'نسخة إضافية مخصصة ✨'}
                </span>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {lang === 'ar' ? (clonedSections.valueProps.titleAr || 'ضماناتنا وعروضنا الحصرية') : (clonedSections.valueProps.titleEn || 'Exclusive Guarantees')}
                </h3>
              </div>
              <p className="text-xs text-purple-200/80 hidden sm:block">
                {lang === 'ar' ? (clonedSections.valueProps.subtitleAr || 'مزايا إضافية لراحة عملائنا') : (clonedSections.valueProps.subtitleEn || 'Tailored perks')}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-2">
              {activeData.valueProps.map((item, idx) => {
                const Icon = iconMap[item.icon] || Sparkles;
                return (
                  <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-start gap-3 p-2 bg-slate-900/60 rounded-2xl border border-purple-900/40">
                    <div className="w-11 h-11 rounded-xl bg-purple-600/30 text-purple-300 flex items-center justify-center shrink-0 border border-purple-500/40 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-xs sm:text-sm text-white">
                        {item.title[lang]}
                      </h4>
                      <p className="text-[11px] text-slate-300 leading-tight">
                        {item.desc[lang]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        )}
        </>
      ) : null,

      // 3. "اختاري بشرتك" / SKIN TYPE SOLUTIONS (Single-Row Smart Interactive 4-Card System)
      routineDiagnosis: (sectionsControl.routineDiagnosis && activePresetId === 'cosmetics') ? (
        <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1.5 text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-purple-900 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>{lang === 'ar' ? 'تشخيص ذكي مخصص لبشرتكِ' : 'Smart Tailored Regimen'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-brand-ar">
              {lang === 'ar' ? 'اختاري ما يلائم بشرتكِ' : 'Tailored For Your Skin'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              {lang === 'ar'
                ? 'انقري على نوع بشرتكِ لتصفية الروتين الملائم فوراً ومشاهدة المنتجات المتوافقة مع احتياجاتكِ.'
                : 'Click your skin type to instantly activate tailored regimen and filter matching botanical products.'}
            </p>
          </div>

          {activeSkinFilter && (
            <button
              onClick={() => {
                setActiveSkinFilter(null);
                showToast(lang === 'ar' ? 'تمت العودة لجميع المنتجات' : 'Reset to all products');
              }}
              className="self-start sm:self-auto px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <span>{lang === 'ar' ? '✕ إلغاء تصفية البشرة' : '✕ Clear Skin Filter'}</span>
            </button>
          )}
        </div>

        {/* 4 Smart Cards: Exactly 4 in a single row on Tablet & Desktop (md:grid-cols-4), and 2 side-by-side on Mobile (grid-cols-2) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
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

      // 4. PRODUCTS GRID (With Category Filter & Product Cards)
      productsCatalog: sectionsControl.productsCatalog ? (
        <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-widest">
              {lang === 'ar' ? 'الأكثر طلباً وتألقاً' : 'Best Sellers & New Arrivals'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {lang === 'ar' ? 'منتجاتنا' : 'Our Products'}
            </h2>
          </div>

          {/* Controls: Compact Filter Pills + Integrated Smart Sort in 1 Single Balanced Row */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none py-1">
            {/* Filter Pills - Compact, Ergonomic, and Clean */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-theme-primary text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50'
                }`}
              >
                {lang === 'ar' ? 'الكل' : 'All'}
              </button>
              <button
                onClick={() => setSelectedCategory('skin')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === 'skin'
                    ? 'bg-theme-primary text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50'
                }`}
              >
                {lang === 'ar' ? 'عناية بالبشرة' : 'Skincare'}
              </button>
              <button
                onClick={() => setSelectedCategory('box')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === 'box'
                    ? 'bg-theme-primary text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50'
                }`}
              >
                {lang === 'ar' ? 'بكجات وعروض' : 'Gift Sets'}
              </button>
              <button
                onClick={() => setSelectedCategory('hair')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === 'hair'
                    ? 'bg-theme-primary text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50'
                }`}
              >
                {lang === 'ar' ? 'أجهزة وتصفيف' : 'Hair Devices'}
              </button>
            </div>

            {/* Smart Sort Dropdown - Compact & Crisp on the same single row */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs shrink-0 ms-auto">
              <SlidersHorizontal className="w-3 h-3 text-[#5A3E7A] shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[11px] sm:text-xs font-bold text-slate-700 focus:outline-none cursor-pointer py-0.5"
                aria-label="Sort products"
              >
                <option value="featured">{lang === 'ar' ? 'المقترحة' : 'Featured'}</option>
                <option value="rating">{lang === 'ar' ? 'الأعلى تقييماً ★' : 'Top Rated ★'}</option>
                <option value="price-asc">{lang === 'ar' ? 'السعر: الأقل للأعلى' : 'Price: Low to High'}</option>
                <option value="price-desc">{lang === 'ar' ? 'السعر: الأعلى للأقل' : 'Price: High to Low'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid: 2 columns on mobile, strictly 3 columns on tablet & desktop with optimized tight spacing */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3.5 md:gap-4">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
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
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950 via-[#5A3E7A] to-pink-950 text-white p-6 sm:p-8 lg:p-10 shadow-2xl border border-purple-800/40">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Copy & CTA Column */}
                <div className="lg:col-span-6 space-y-4 text-start">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-pink-200 border border-white/20">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    {activeData.promoBanner?.badge ? activeData.promoBanner.badge[lang] : 'Special Campaign 2026'}
                  </span>
                  
                  {/* Balanced, Proportioned Heading Scale according to Luxe Pro Guidelines */}
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-relaxed tracking-tight text-white">
                    {activeData.promoBanner?.title ? activeData.promoBanner.title[lang] : (lang === 'ar'
                      ? 'وفّري 25% مع بوكس العناية بالنضارة الكاملة'
                      : 'Save 25% On Complete Botanical Glow Routine')}
                  </h3>
                  
                  <p className="text-xs sm:text-sm lg:text-base text-purple-100/90 leading-relaxed max-w-xl">
                    {activeData.promoBanner?.subtitle ? activeData.promoBanner.subtitle[lang] : (lang === 'ar'
                      ? 'احصلي على حقيبة التجميل المخملية + عينات تجريبية مجانية + شحن سريع لكافة الطلبات فوق 20,000 ج.س'
                      : 'Get a luxury velvet pouch + free botanical trial samples + fast delivery on all qualifying orders.')}
                  </p>



                  {/* CTA Buttons - Opens in-page Quick View Modal without leaving page */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        setDiamondBundleQty(1);
                        setIsDiamondBundleModalOpen(true);
                      }}
                      className="px-6 py-3 bg-white text-[#5A3E7A] hover:bg-purple-50 font-black rounded-full text-xs sm:text-sm shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 min-h-[44px] cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#5A3E7A]" />
                      <span>
                        {activeData.promoBanner?.ctaText ? activeData.promoBanner.ctaText[lang] : (lang === 'ar' ? 'اطلبي البوكس الآن' : 'Order Routine Bundle')}
                      </span>
                      {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => {
                        addToCart(targetBundle, 1);
                        showToast({
                          message: isRtl ? 'تمت إضافة بوكس نَدِي إلى سلتك بنجاح! 🎁' : 'Bundle added to cart! 🎁',
                          type: 'cart_add'
                        });
                        setIsCartOpen(true);
                      }}
                      className="px-4 py-3 bg-purple-900/60 hover:bg-purple-900/90 text-white border border-white/20 font-bold rounded-full text-xs sm:text-sm backdrop-blur-sm transition-all flex items-center gap-2 min-h-[44px] cursor-pointer"
                    >
                      <span>{isRtl ? 'إضافة سريعة للسلة (خصم 25%)' : 'Quick Add (-25%)'}</span>
                    </button>
                  </div>
                </div>

                {/* Enriched & Clean Hero Showcase Column */}
                <div className="lg:col-span-6 space-y-3.5">
                  {/* Clean & Expansive Hero Frame (Grand Showcase: No accidental lightbox popups, strictly via expansion button) */}
                  <div 
                    className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 w-full aspect-[4/5] sm:aspect-[4/4.6] min-h-[400px] sm:min-h-[480px] lg:min-h-[520px] group bg-purple-950/70 transition-all duration-300 select-none"
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
                    {/* Top Row: Badge + Title Aligned Horizontally with Fullscreen Expand Button */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap min-w-0">
                        <span className="inline-block text-[11px] sm:text-xs font-bold text-amber-300 bg-purple-950/90 px-3 py-1 rounded-lg border border-amber-400/30 shrink-0 shadow-xs">
                          {promoSlides[activePromoSlide].badge}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate max-w-[200px] sm:max-w-none">
                          {promoSlides[activePromoSlide].title}
                        </h4>
                      </div>

                      {/* Dedicated Fullscreen Expand Button Aligned Perfectly with Badge */}
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

                  {/* Interactive Miniature Cards (الكروت الصغيرة قابلة للضغط والتكبير) */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {promoSlides.map((slide, idx) => {
                      const isActive = activePromoSlide === idx;
                      return (
                        <button
                          key={slide.id}
                          onClick={() => setActivePromoSlide(idx)}
                          className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer group text-start ${
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
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                          <div className="absolute bottom-1 inset-x-1 text-center">
                            <span className="text-[9px] font-bold text-white line-clamp-1 drop-shadow-sm">
                              {slide.badge.split(' ')[0]} {slide.badge.split(' ')[1] || ''}
                            </span>
                          </div>
                          {isActive && (
                            <div className="absolute top-1 end-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-purple-950" />
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

      // 6. BEFORE & AFTER PROOF (Interactive Slider - Completely Dynamic)
      beforeAfter: (sectionsControl.beforeAfter && activePresetId === 'cosmetics') ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-start space-y-1.5 max-w-2xl">
          <span className="text-xs font-black text-[#5A3E7A] uppercase tracking-widest">
            {activeData.beforeAfterMedia?.badge ? activeData.beforeAfterMedia.badge[lang] : (lang === 'ar' ? 'نتائج واقعية ومثبتة' : 'Proven Transformations')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {activeData.beforeAfterMedia?.title ? activeData.beforeAfterMedia.title[lang] : (lang === 'ar' ? 'قبل وبعد (14 يوماً من النضارة)' : 'Before & After (14 Days)')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {activeData.beforeAfterMedia?.subtitle ? activeData.beforeAfterMedia.subtitle[lang] : (lang === 'ar'
              ? 'مقارنة حقيقية لنضارة وترطيب البشرة قبل وبعد 14 يوماً من الاستخدام المنتظم لمنتجات نَدِي الطبيعية. اسحبي المؤشر لمعاينة الفرق.'
              : 'Real photographic comparison of skin radiance and hydration before and after 14 days of NADI care. Drag to compare.')}
          </p>
        </div>

        {/* Space-Saving Interactive Before/After Slider */}
        <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div 
            className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden select-none bg-slate-100 shadow-inner border border-slate-200 cursor-ew-resize group"
            onPointerDown={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const handleMove = (moveEvent: PointerEvent) => {
                const x = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width));
                const pct = (x / rect.width) * 100;
                setBeforeAfterPos(Math.round(isRtl ? 100 - pct : pct));
              };
              const handleUp = () => {
                window.removeEventListener('pointermove', handleMove);
                window.removeEventListener('pointerup', handleUp);
              };
              window.addEventListener('pointermove', handleMove);
              window.addEventListener('pointerup', handleUp);
              const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
              const pct = (x / rect.width) * 100;
              setBeforeAfterPos(Math.round(isRtl ? 100 - pct : pct));
            }}
          >
            {/* "After" Image (Background - Luminous, Hydrated, Fresh Radiant Skin) */}
            <img
              src={activeData.beforeAfterMedia?.afterImage || "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80"}
              alt="After Skincare"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none brightness-105 saturate-110"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80";
              }}
            />
            <span className="absolute top-4 end-4 bg-emerald-600/95 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full shadow-lg z-10 flex items-center gap-1.5 pointer-events-none border border-emerald-400/40">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {lang === 'ar' ? 'بعد' : 'After'}
              </span>
            </span>

            {/* "Before" Image (Clipped Overlay with 0% Distortion using clipPath) */}
            <div 
              className="absolute inset-0 w-full h-full pointer-events-none select-none"
              style={{
                clipPath: isRtl 
                  ? `inset(0 ${beforeAfterPos}% 0 0)` 
                  : `inset(0 0 0 ${beforeAfterPos}%)`
              }}
            >
              <img
                src={activeData.beforeAfterMedia?.beforeImage || "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80"}
                alt="Before Skincare"
                referrerPolicy="no-referrer"
                className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none ${
                  (activeData.beforeAfterMedia?.beforeImage === activeData.beforeAfterMedia?.afterImage || !activeData.beforeAfterMedia?.beforeImage || activeData.beforeAfterMedia?.beforeImage.includes('1570172619644'))
                    ? 'saturate-60 brightness-90 contrast-120 sepia-[0.16]'
                    : ''
                }`}
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80";
                }}
              />
            </div>

            <span className="absolute top-4 start-4 bg-slate-900/90 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full shadow-lg z-10 flex items-center gap-1.5 pointer-events-none border border-slate-700/60">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              <span>
                {lang === 'ar' ? 'قبل' : 'Before'}
              </span>
            </span>

            {/* Precision Slider Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] z-20 pointer-events-none -translate-x-1/2 flex items-center justify-center"
              style={{ insetInlineStart: `${beforeAfterPos}%` }}
            >
              <div className="w-9 h-9 rounded-full bg-white text-slate-900 shadow-2xl flex items-center justify-center font-black text-sm border-2 border-[#5A3E7A]">
                ↔
              </div>
            </div>
          </div>

          {/* Interactive Range Input with Safe Distance */}
          <div className="flex items-center gap-4 px-2 pt-1">
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
              {lang === 'ar' ? 'اسحبي لمعاينة الفرق:' : 'Drag to compare:'}
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={beforeAfterPos}
              onChange={(e) => setBeforeAfterPos(Number(e.target.value))}
              className="w-full accent-[#5A3E7A] cursor-ew-resize h-2 bg-slate-200 rounded-lg"
              aria-label="Before after comparison slider"
            />
          </div>
        </div>
      </section>
      ) : null,

      // 7. VERIFIED CUSTOMER REVIEWS (Smart Luxury Testimonial Cards)
      testimonials: sectionsControl.testimonials ? (
        <>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1.5 text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{lang === 'ar' ? '4.9/5 من أكثر من 500 تقييم موثق' : '4.9/5 from 500+ Verified Reviews'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-brand-ar">
              {lang === 'ar' ? 'آراء عملائنا' : 'Customer Reviews'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {lang === 'ar' 
                ? 'شهادات حقيقية وموثقة من عميلاتنا في السودان والخليج مع تفاصيل المنتجات المقتناة.'
                : 'Authentic verified reviews and purchased regimen insights from real buyers.'}
            </p>
          </div>

          {/* Share Experience CTA Button (Safe touch target with safe margin) */}
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 min-h-[44px]"
          >
            <MessageSquarePlus className="w-4 h-4 text-slate-950" />
            <span>{lang === 'ar' ? '+ شاركينا تجربتك' : '+ Share Your Experience'}</span>
          </button>
        </div>

        {/* Smart Luxury Testimonial Cards Carousel: 1 on mobile, 2 on tablet/desktop */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {[effectiveTestimonials[reviewSlide % effectiveTestimonials.length], effectiveTestimonials[(reviewSlide + 1) % effectiveTestimonials.length]].filter(Boolean).map((review, idx) => {
              const reviewId = review.id;
              const hasVoted = !!userVoted[reviewId];
              const votesCount = helpfulVotes[reviewId] || 40;

              return (
                <div 
                  key={idx} 
                  className={`bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5 relative overflow-hidden group ${
                    idx === 1 ? 'hidden md:flex' : 'flex'
                  }`}
                >
                  {/* Subtle Luxury Gradient Accent on Top */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-amber-400 to-rose-400" />

                  {/* Header: Stars + Verified Badge + Date */}
                  <div className="space-y-4 text-start">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-1.5">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs font-black text-slate-800 ms-1">5.0</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400">
                          {review.date[lang]}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{review.badge[lang]}</span>
                        </span>
                      </div>
                    </div>

                    {/* Testimonial Quote */}
                    <div className="relative">
                      <Quote className="w-8 h-8 text-purple-100 absolute -top-3 -start-2 -z-0 opacity-80" />
                      <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium relative z-10 italic">
                        "{review.comment[lang]}"
                      </p>
                    </div>

                    {/* Smart Badge: Purchased Product Tag (Interactive Deep Link) */}
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          const targetProd = products.find(p => p.id === review.purchasedProduct.id) || products[0];
                          openProductPDP(targetProd);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50/80 hover:bg-purple-100 text-[#5A3E7A] text-xs font-extrabold transition-colors border border-purple-200/60 group/btn"
                        title={lang === 'ar' ? 'عرض هذا المنتج' : 'View Product'}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>{lang === 'ar' ? 'المنتج المقتنى:' : 'Purchased:'}</span>
                        <span className="underline decoration-purple-300 group-hover/btn:decoration-[#5A3E7A]">
                          {review.purchasedProduct[lang]}
                        </span>
                        {isRtl ? <ArrowLeft className="w-3 h-3 ms-1" /> : <ArrowRight className="w-3 h-3 ms-1" />}
                      </button>
                    </div>
                  </div>

                  {/* Footer: User Details + Helpful Reaction Counter */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-start">
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

                    {/* Interactive 'Helpful' Reaction Button */}
                    <button
                      onClick={() => {
                        if (hasVoted) return;
                        setUserVoted(prev => ({ ...prev, [reviewId]: true }));
                        setHelpfulVotes(prev => ({ ...prev, [reviewId]: (prev[reviewId] || 40) + 1 }));
                        showToast(lang === 'ar' ? 'شكراً لتقييمك لمصداقية الرأي 👍' : 'Thank you for your feedback! 👍');
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all min-h-[36px] ${
                        hasVoted 
                          ? 'bg-purple-100 text-[#5A3E7A] ring-1 ring-purple-300' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                      title={lang === 'ar' ? 'هل كان هذا الرأي مفيداً؟' : 'Was this review helpful?'}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-current' : ''}`} />
                      <span>{votesCount}</span>
                      <span className="hidden sm:inline text-[10px]">
                        {lang === 'ar' ? 'مفيد' : 'Helpful'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carousel Controls with Safe Distance */}
          <div className="mt-6 flex items-center justify-between">
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-purple-200/60 pb-4">
            <div className="space-y-1.5 text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-900 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{clonedSections.testimonials.badgeAr || (lang === 'ar' ? 'تجارب إضافية موثقة ✨' : 'Additional Highlights ✨')}</span>
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
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
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
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
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
    <div className="space-y-12 sm:space-y-20 pb-16">
      {sectionsOrder.map((sectionId) => (
        <React.Fragment key={sectionId}>
          {sectionsContent[sectionId]}
        </React.Fragment>
      ))}

      {/* IN-PAGE DIAMOND BUNDLE QUICK VIEW MODAL (معاينة وشراء البوكس الماسي الفورية في الصفحة الرئيسية) */}
      {isDiamondBundleModalOpen && (() => {
        const targetBundle = products.find((p) => p.id === 'sb-04' || p.bundle) || products[0];
        const currentPriceObj = convertPrice(targetBundle.basePriceUSD * diamondBundleQty);
        const originalPriceObj = targetBundle.originalPriceUSD ? convertPrice(targetBundle.originalPriceUSD * diamondBundleQty) : null;

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="relative max-w-xl w-full bg-white rounded-3xl shadow-2xl border border-purple-200 overflow-hidden my-8 text-slate-900 text-start">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-950 via-[#5A3E7A] to-pink-950 text-white p-5 sm:p-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-pink-200 block">
                      {isRtl ? 'عرض استثنائي محدود' : 'Limited Exclusive'}
                    </span>
                    <h3 className="text-base sm:text-lg font-black leading-snug">
                      {activeData.promoBanner?.badge ? activeData.promoBanner.badge[lang] : (isRtl ? 'عرض نَــــدِي الماسي الخاص 💎' : 'Exclusive Diamond Offer 💎')}
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
                    <Sparkles className="w-3.5 h-3.5" />
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
                      message: isRtl ? `تمت إضافة ${diamondBundleQty} من بوكس نَدِي الماسي لسلتك بنجاح! 🎁` : `Added ${diamondBundleQty} Diamond Box to your cart! 🎁`,
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
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
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
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-extrabold rounded-full text-xs shadow-lg transition-all flex items-center gap-2 min-h-[42px] cursor-pointer"
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
