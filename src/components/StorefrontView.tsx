import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Truck, ShieldCheck, CreditCard, ArrowRight, ArrowLeft, 
  Star, CheckCircle2, ChevronRight, ChevronLeft, MessageCircle, Heart, Eye, 
  MapPin, Phone, Mail, Award, Droplets, Sun, Sparkle, Shield, 
  Layers, MessageSquarePlus, SlidersHorizontal, Quote, ThumbsUp, Check, BadgeCheck
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { ProductCard } from './ProductCard';

export const StorefrontView: React.FC = () => {
  const { lang, activeData, setCurrentRoute, navigateTo, openProductPDP, setIsReviewModalOpen, showToast } = useCommerce();
  const isRtl = lang === 'ar';

  // Always ensure page starts at the top when entering or reloading the store
  useEffect(() => {
    if (!window.location.hash.startsWith('#product')) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSkinFilter, setActiveSkinFilter] = useState<string | null>(null);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<number, number>>({ 0: 42, 1: 37, 2: 56, 3: 29 });
  const [userVoted, setUserVoted] = useState<Record<number, boolean>>({});
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [beforeAfterPos, setBeforeAfterPos] = useState<number>(50);
  const [reviewSlide, setReviewSlide] = useState<number>(0);

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
      image: 'https://images.unsplash.com/photo-1512290900672-1f41b2f6ef8d?auto=format&fit=crop&w=700&q=80', // Pure water droplet & crystal hydration
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
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80', // Glowing radiant warm botanical serum
      fallbackImage: 'https://images.unsplash.com/photo-1608248597359-59754b2d354a?auto=format&fit=crop&w=700&q=80',
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
      image: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=700&q=80', // Fresh aloe and herbal firming botanicals
      fallbackImage: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=80',
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
      image: 'https://images.unsplash.com/photo-1556228722-d0b5b0340fe3?auto=format&fit=crop&w=700&q=80', // Rose petals & radiant botanical essence
      fallbackImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80',
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

  const iconMap: Record<string, any> = {
    Sparkles,
    Truck,
    ShieldCheck,
    CreditCard
  };

  return (
    <div className="space-y-12 sm:space-y-20 pb-16">
      
      {/* 1. HERO SECTION (Matching So Beauty style in photos 1 & 2) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-50/60 via-slate-50 to-white pt-6 sm:pt-12 pb-12 sm:pb-16 border-b border-slate-100">
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
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#5A3E7A] hover:bg-[#483162] text-white font-extrabold rounded-full text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"
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
              <div className="relative aspect-[4/3] sm:aspect-square max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={activeData.heroImage}
                  alt={activeData.heroTitle[lang]}
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                
                {/* Floating badge inside hero */}
                <div className="absolute bottom-4 start-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-purple-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-[#5A3E7A]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{lang === 'ar' ? 'نقاء نباتي معتمد' : 'Pure Botanical Formula'}</h4>
                    <p className="text-[10px] text-slate-500">{lang === 'ar' ? 'خالٍ من البارابين 100%' : '100% Paraben-Free'}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS STRIP (Matching Photo 2: نتائج فعالة، شحن سريع، أصلية 100%، دفع آمن) */}
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

      {/* 3. "اختاري بشرتك" / SKIN TYPE SOLUTIONS (Single-Row Smart Interactive 4-Card System) */}
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

        {/* 4 Smart Cards Displayed in 1 Single Row (grid-cols-4 on md+, smooth horizontal snap on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {skinTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = activeSkinFilter === type.id;
            return (
              <div
                key={type.id}
                className={`group rounded-3xl border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between bg-white relative ${
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
                {/* Visual Photographic Banner for Skin Type */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img
                    src={type.image}
                    alt={type.title[lang]}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = type.fallbackImage;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  
                  {/* Floating Badge */}
                  <span className={`absolute top-2.5 start-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-md backdrop-blur-md ${type.badgeColor}`}>
                    {type.badge[lang]}
                  </span>

                  {/* Active Indicator Stamp */}
                  {isSelected && (
                    <span className="absolute top-2.5 end-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-md flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>{lang === 'ar' ? 'مفعّل' : 'Active'}</span>
                    </span>
                  )}

                  {/* Icon Stamp */}
                  <div className="absolute bottom-2.5 end-2.5 w-8 h-8 rounded-xl bg-white/90 backdrop-blur-md shadow-md text-slate-800 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#5A3E7A]" />
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3 text-start">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      {type.ingredient[lang]}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-[#5A3E7A] transition-colors leading-tight font-brand-ar">
                      {type.title[lang]}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-2">
                      {type.desc[lang]}
                    </p>
                  </div>

                  {/* Smart Action Link */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#5A3E7A]">
                    <span>
                      {isSelected 
                        ? (lang === 'ar' ? '✓ تصفية مفعلة' : '✓ Regimen Active')
                        : (lang === 'ar' ? 'تفعيل الروتين' : 'Activate Routine')}
                    </span>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isSelected ? 'bg-[#5A3E7A] text-white' : 'bg-purple-50 group-hover:bg-[#5A3E7A] group-hover:text-white'
                    }`}>
                      {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PRODUCTS GRID (With Category Filter & Product Cards) */}
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

          {/* Controls: Filter Pills + Sort Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all min-h-[40px] whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-[#5A3E7A] text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {lang === 'ar' ? 'جميع المنتجات' : 'All Items'}
              </button>
              <button
                onClick={() => setSelectedCategory('skin')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all min-h-[40px] whitespace-nowrap ${
                  selectedCategory === 'skin'
                    ? 'bg-[#5A3E7A] text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {lang === 'ar' ? 'العناية بالبشرة' : 'Skincare'}
              </button>
              <button
                onClick={() => setSelectedCategory('box')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all min-h-[40px] whitespace-nowrap ${
                  selectedCategory === 'box'
                    ? 'bg-[#5A3E7A] text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {lang === 'ar' ? 'البكجات والتوفير' : 'Gift Sets'}
              </button>
            </div>

            {/* Smart Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-slate-200 shadow-2xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-700 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                aria-label="Sort products"
              >
                <option value="featured">{lang === 'ar' ? 'المقترحة والمميزة' : 'Featured'}</option>
                <option value="rating">{lang === 'ar' ? 'الأعلى تقييماً ★' : 'Top Rated ★'}</option>
                <option value="price-asc">{lang === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
                <option value="price-desc">{lang === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. NATURAL BLOOM CAMPAIGN BANNER (With Expressive High-End Imagery) */}
      <section id="campaign-section" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950 via-[#5A3E7A] to-pink-950 text-white p-6 sm:p-10 lg:p-12 shadow-2xl border border-purple-800/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Copy & CTA Column */}
            <div className="lg:col-span-7 space-y-5 text-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-pink-200 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Natural Bloom Campaign 2026
              </span>
              
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-relaxed sm:leading-tight tracking-tight">
                {lang === 'ar'
                  ? 'مكوّنات نباتية 100% مستخلصة بعناية لتمنحك بشرة نضرة وصحية'
                  : '100% Pure Botanical Extracts Engineered for Long-Lasting Glow'}
              </h3>
              
              <p className="text-xs sm:text-base text-purple-100/90 leading-relaxed max-w-xl">
                {lang === 'ar'
                  ? 'استمتعي بخصم يصل إلى 25% على بوكسات العناية المتكاملة، مع شحن سريع وهدية مجانية مع كل طلب.'
                  : 'Enjoy up to 25% savings on our all-in-one routine boxes with complimentary gift wrapping.'}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    const target = products.find((p) => p.bundle || p.id === 'sb-04') || products[0];
                    openProductPDP(target);
                  }}
                  className="px-6 py-3 bg-white text-[#5A3E7A] hover:bg-purple-50 font-extrabold rounded-full text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 min-h-[44px]"
                >
                  <span>{lang === 'ar' ? 'اكتشفي البوكسات الكاملة' : 'Explore Routine Bundles'}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>

                <div className="flex items-center gap-2 text-xs font-semibold text-pink-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'ar' ? 'شحن فوري + هدية مجانية' : 'Fast Delivery + Free Gift'}</span>
                </div>
              </div>
            </div>

            {/* Illustrative Photos Column (Expressing Botanical Ingredients & Luxury Gift Boxes) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4 relative">
              {/* Photo 1: Pure Botanical Ingredients & Herbal Pipette */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-white/20 aspect-square group bg-purple-900/50">
                <img
                  src="https://images.unsplash.com/photo-1608248597359-59754b2d354a?auto=format&fit=crop&w=700&q=80"
                  alt="مكونات نباتية مستخلصة بعناية"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 start-2.5 end-2.5 text-center text-[10px] sm:text-xs font-extrabold text-white bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded-xl border border-white/20">
                  {lang === 'ar' ? 'مكوّنات نباتية 100% 🌿' : '100% Botanicals 🌿'}
                </span>
              </div>

              {/* Photo 2: Luxury Skincare Routine Box */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-white/20 aspect-square group bg-purple-900/50">
                <img
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80"
                  alt="بوكسات العناية المتكاملة بخصم 25%"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 start-2.5 end-2.5 text-center text-[10px] sm:text-xs font-extrabold text-amber-300 bg-purple-950/90 backdrop-blur-sm px-2 py-1 rounded-xl border border-amber-400/30">
                  {lang === 'ar' ? 'خصم 25% على البوكس 🎁' : '25% OFF Boxes 🎁'}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. BEFORE & AFTER PROOF (Interactive Slider - Side-by-Side Cards Removed for Space Saving) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-start space-y-1.5 max-w-2xl">
          <span className="text-xs font-black text-[#5A3E7A] uppercase tracking-widest">
            {lang === 'ar' ? 'نتائج واقعية ومثبتة' : 'Proven Transformations'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {lang === 'ar' ? 'قبل وبعد (14 يوماً من النضارة)' : 'Before & After (14 Days)'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {lang === 'ar'
              ? 'مقارنة حقيقية لنضارة وترطيب البشرة قبل وبعد 14 يوماً من الاستخدام المنتظم لمنتجات So Beauty الطبيعية. اسحبي المؤشر لمعاينة الفرق.'
              : 'Real photographic comparison of skin radiance and hydration before and after 14 days of So Beauty care. Drag to compare.'}
          </p>
        </div>

        {/* Space-Saving Interactive Before/After Slider */}
        <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden select-none bg-slate-100">
            {/* "After" Image (Background) */}
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80"
              alt="After So Beauty"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80";
              }}
            />
            <span className="absolute top-4 end-4 bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-md z-10 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'بعد (14 يوماً نضارة)' : 'After (14 Days)'}</span>
            </span>

            {/* "Before" Image (Clipped Overlay) */}
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${beforeAfterPos}%` }}
            >
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80"
                alt="Before So Beauty"
                className="absolute inset-0 w-full h-full object-cover max-w-none filter grayscale contrast-125"
                style={{ width: '100%', height: '100%' }}
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80";
                }}
              />
              <span className="absolute top-4 start-4 bg-slate-900/90 backdrop-blur-sm text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-md z-10 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                <span>{lang === 'ar' ? 'قبل الاستخدام' : 'Before Treatment'}</span>
              </span>
            </div>

            {/* Slider Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-2xl flex items-center justify-center"
              style={{ [isRtl ? 'right' : 'left']: `${beforeAfterPos}%` }}
            >
              <div className="w-9 h-9 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center font-black text-sm border-2 border-[#5A3E7A]">
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

      {/* 7. VERIFIED CUSTOMER REVIEWS (Smart Luxury Testimonial Cards) */}
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
            {[testimonials[reviewSlide % testimonials.length], testimonials[(reviewSlide + 1) % testimonials.length]].map((review, idx) => {
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
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setReviewSlide(i)}
                  className={`transition-all rounded-full ${
                    reviewSlide % testimonials.length === i 
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
                onClick={() => setReviewSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-xs transition-colors min-h-[40px] min-w-[40px]"
                aria-label="Previous review"
              >
                {isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setReviewSlide((prev) => (prev + 1) % testimonials.length)}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-xs transition-colors min-h-[40px] min-w-[40px]"
                aria-label="Next review"
              >
                {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
