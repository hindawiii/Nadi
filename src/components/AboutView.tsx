import React, { useMemo } from 'react';
import {
  ShieldCheck, Heart, Eye, Target,
  ArrowRight, ArrowLeft, Leaf, Award, ChevronLeft, ChevronRight, Home
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { handleImageLoadError } from '../lib/imageResilience';
import {
  AboutValueIconId,
  resolveAboutPageContent,
} from '../data/storeContentDefaults';

const ABOUT_VALUE_ICON_MAP: Record<AboutValueIconId, { Icon: typeof Leaf; bg: string }> = {
  leaf: { Icon: Leaf, bg: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  shield: { Icon: ShieldCheck, bg: 'bg-purple-50 text-purple-700 border-purple-100' },
  award: { Icon: Award, bg: 'bg-amber-50 text-amber-700 border-amber-100' },
  heart: { Icon: Heart, bg: 'bg-rose-50 text-rose-700 border-rose-100' },
};

export const AboutView: React.FC = () => {
  const { lang, activeData, navigateTo } = useCommerce();
  const isRtl = lang === 'ar';

  const content = useMemo(
    () => resolveAboutPageContent(activeData.aboutStory, activeData.storeName),
    [activeData.aboutStory, activeData.storeName]
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between select-none">

      {/* Main Content Area */}
      <div className="space-y-12 sm:space-y-16 py-8 sm:py-12">

        {/* 1. BREADCRUMB & INTRO STORY */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">

          {/* Unified Top Back Navigation Bar */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigateTo('store')}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-[#5A3E7A] bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-2xs transition-all min-h-[44px] cursor-pointer active:scale-95"
            >
              {isRtl ? <ArrowRight className="w-4 h-4 shrink-0" /> : <ArrowLeft className="w-4 h-4 shrink-0" />}
              <span className="whitespace-nowrap">{lang === 'ar' ? 'العودة للمتجر' : 'Back to Store'}</span>
            </button>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Home className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {isRtl ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              <span className="text-[#5A3E7A] font-bold">{lang === 'ar' ? 'من نحن' : 'About Us'}</span>
            </div>
          </div>

          {/* Section Subtitle Tag */}
          <div className="text-start">
            <span className="text-xs sm:text-sm font-extrabold text-[#5A3E7A] uppercase tracking-widest">
              {lang === 'ar' ? 'من نحن' : 'About Us'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-1">
              {content.title[lang]}
            </h1>
          </div>

          {/* Poetic Narrative */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed text-start">
            {content.body[lang]}
          </p>

          {/* Studio Hero Photograph */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] sm:aspect-[16/10] bg-slate-100">
            <img
              src={content.image}
              alt={content.title[lang]}
              referrerPolicy="no-referrer"
              decoding="async"
              onError={(e) => handleImageLoadError(e.currentTarget)}
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
          </div>

        </section>

        {/* 2. MISSION & VISION CARDS */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">

          {/* Mission Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4 hover:shadow-md transition-shadow text-start">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#5A3E7A] flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {content.missionTitle[lang]}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {content.missionBody[lang]}
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4 hover:shadow-md transition-shadow text-start">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#5A3E7A] flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {content.visionTitle[lang]}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {content.visionBody[lang]}
            </p>
          </div>

        </section>

        {/* 3. OUR PILLARS & VALUES */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">

          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {content.valuesHeading[lang]}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              {content.valuesSubtitle[lang]}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {content.values.map((v, idx) => {
              const meta = ABOUT_VALUE_ICON_MAP[v.icon] || ABOUT_VALUE_ICON_MAP.leaf;
              const IconComp = meta.Icon;
              return (
                <div
                  key={v.id || idx}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col items-center sm:items-start text-center sm:text-start space-y-3 hover:border-purple-300 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${meta.bg}`}>
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

        {/* 4. CALL TO ACTION BANNER */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-purple-100 shadow-xl text-center space-y-6">
            <div className="max-w-lg mx-auto space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                {content.ctaTitle[lang]}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {content.ctaSubtitle[lang]}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-sm mx-auto">
              <button
                type="button"
                onClick={() => navigateTo('store')}
                className="w-full sm:w-auto px-6 h-11 bg-[#5A3E7A] hover:bg-[#483162] text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{content.ctaPrimary[lang]}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  navigateTo('store');
                  setTimeout(() => {
                    const el = document.getElementById('campaign-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="w-full sm:w-auto px-6 h-11 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center cursor-pointer"
              >
                <span>{content.ctaSecondary[lang]}</span>
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
