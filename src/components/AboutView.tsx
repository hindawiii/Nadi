import React from 'react';
import { 
  Sparkles, ShieldCheck, Heart, Eye, Target, 
  ArrowRight, ArrowLeft, Leaf, Award, CheckCircle2, ChevronLeft, ChevronRight, Home 
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

export const AboutView: React.FC = () => {
  const { lang, activeData, navigateTo } = useCommerce();
  const isRtl = lang === 'ar';

  const values = [
    {
      title: { ar: 'مكوّنات طبيعية', en: 'Pure Botanical' },
      desc: { 
        ar: 'خلاصات نباتية نقيّة بلا مواد كيميائية قاسية، مستخلصة ومحفوظة بأعلى درجات العناية.', 
        en: '100% pure botanical extracts without harsh synthetics, carefully preserved.' 
      },
      icon: Leaf,
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-100'
    },
    {
      title: { ar: 'جودة مضمونة', en: 'Guaranteed Quality' },
      desc: { 
        ar: 'منتجات أصلية 100% مختبرة بعناية لضمان أعلى مستويات الأمان والفعالية لبشرتك.', 
        en: '100% genuine lab-tested formulas for skin safety and proven impact.' 
      },
      icon: ShieldCheck,
      bg: 'bg-purple-50 text-purple-700 border-purple-100'
    },
    {
      title: { ar: 'نتائج ملموسة', en: 'Visible Results' },
      desc: { 
        ar: 'تركيبات فعّالة تمنح بشرتك إشراقة حقيقية وترطيباً عميقاً تلاحظينه من الأيام الأولى.', 
        en: 'Potent formulations that deliver lasting glow and deep moisture you feel in days.' 
      },
      icon: Sparkles,
      bg: 'bg-amber-50 text-amber-700 border-amber-100'
    },
    {
      title: { ar: 'خدمة صادقة', en: 'Honest Care' },
      desc: { 
        ar: 'دعم قريب واستشارات شخصية على واتساب مع عملائنا في كل خطوة من روتينهم.', 
        en: 'Dedicated personalized consultations via WhatsApp at every step of your routine.' 
      },
      icon: Heart,
      bg: 'bg-rose-50 text-rose-700 border-rose-100'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between select-none">
      
      {/* Main Content Area */}
      <div className="space-y-12 sm:space-y-16 py-8 sm:py-12">
        
        {/* 1. BREADCRUMB & INTRO STORY (Matching Photo 1) */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <button 
              onClick={() => navigateTo('store')} 
              className="hover:text-[#5A3E7A] flex items-center gap-1 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
            </button>
            {isRtl ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span className="text-purple-800 font-bold">{lang === 'ar' ? 'من نحن' : 'About Us'}</span>
          </div>

          {/* Section Subtitle Tag */}
          <div className="text-start">
            <span className="text-xs sm:text-sm font-extrabold text-[#5A3E7A] uppercase tracking-widest">
              {lang === 'ar' ? 'من نحن' : 'About Us'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-1">
              {activeData.aboutStory.title[lang]}
            </h1>
          </div>

          {/* Poetic Narrative */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed text-start">
            {activeData.aboutStory.body[lang]}
          </p>

          {/* Studio Hero Photograph (Matching Photo 1: Skincare in wooden bowl with palm leaves & plumeria flowers) */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] sm:aspect-[16/10] bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=80"
              alt="So Beauty Skincare Botanical Presentation"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
            <div className="absolute bottom-4 start-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-purple-100 flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#5A3E7A]" />
              <span className="text-xs font-bold text-slate-800">
                {lang === 'ar' ? 'نقاء نباتي 100% مستوحى من الطبيعة' : '100% Pure Botanical Radiance'}
              </span>
            </div>
          </div>

        </section>

        {/* 2. MISSION & VISION CARDS (Matching Photo 2) */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          
          {/* Mission Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#5A3E7A] flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {lang === 'ar' ? 'رسالتنا' : 'Our Mission'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {lang === 'ar'
                ? 'أن نجعل العناية الطبيعية بالبشرة تجربةً يومية سهلة وممتعة لكل امرأة، عبر منتجات موثوقة بأسعار عادلة وخدمة تليق بكِ.'
                : 'To make natural skincare an effortless, delightful daily ritual for every woman through trusted authentic formulas, honest pricing, and royal customer care.'}
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#5A3E7A] flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {lang === 'ar' ? 'رؤيتنا' : 'Our Vision'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {lang === 'ar'
                ? 'أن نكون الوجهة الأولى في السودان لمنتجات العناية الطبيعية، ونبني مجتمعاً يحتفي بجمال البشرة الحقيقي ويدعم ثقة كل أنثى في إشراقتها.'
                : 'To become the leading premier destination in Sudan and the region for natural skincare, nurturing a community celebrating authentic skin health.'}
            </p>
          </div>

        </section>

        {/* 3. OUR 4 PILLARS & VALUES (Matching Photo 3) */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          
          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {lang === 'ar' ? 'قيمنا' : 'Our Core Values'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              {lang === 'ar' ? 'المبادئ الأساسية التي تضمن لكِ تجربة استثنائية مع كل قطرة' : 'The guiding principles behind every bottle and formula'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {values.map((v, idx) => {
              const IconComp = v.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col items-center sm:items-start text-center sm:text-start space-y-3 hover:border-purple-300 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${v.bg}`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {v.title[lang]}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {v.desc[lang]}
                  </p>
                </div>
              );
            })}
          </div>

        </section>

        {/* 4. CALL TO ACTION BANNER (Matching Photo 3) */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-purple-100 shadow-xl text-center space-y-6">
            <div className="max-w-lg mx-auto space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                {lang === 'ar' ? `ابدئي رحلتكِ مع ${activeData.storeName.ar}` : `Begin Your Journey with ${activeData.storeName.en}`}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {lang === 'ar'
                  ? 'اكتشفي مجموعتنا من منتجات العناية الطبيعية واختاري ما يناسب بشرتكِ لتستمتعي بإشراقة صحية تدوم.'
                  : 'Explore our curated botanicals and discover the tailored routine that unlocks your natural radiance.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-sm mx-auto">
              <button
                onClick={() => navigateTo('store')}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#5A3E7A] hover:bg-[#483162] text-white font-extrabold rounded-full text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 min-h-[48px]"
              >
                <span>{lang === 'ar' ? 'تسوّقي الآن' : 'Shop Now'}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  navigateTo('store');
                  setTimeout(() => {
                    const el = document.getElementById('campaign-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-full text-sm transition-all flex items-center justify-center min-h-[48px]"
              >
                <span>{lang === 'ar' ? 'بوكسات العناية' : 'Routine Bundles'}</span>
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
