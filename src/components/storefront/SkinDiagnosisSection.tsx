import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Droplets,
  Flower2,
  ScanFace,
  Shield,
  Sun,
} from 'lucide-react';
import type { PresetNiche } from '../../data/siteConfig';

interface SkinDiagnosisSectionProps {
  lang: 'ar' | 'en';
  isRtl: boolean;
  activeSkinFilter: string | null;
  setActiveSkinFilter: (val: string | null) => void;
  skinDiagnosisCards?: PresetNiche['skinDiagnosisCards'];
  showToast: (msg: string) => void;
}

const DEFAULT_SKIN_TYPES = [
  {
    id: 'hydrated',
    title: { ar: 'بشرة مرطبة', en: 'Moisturized Skin' },
    ingredient: { ar: 'حمض الهيالورونيك المكثف', en: 'Intense Hyaluronic Acid' },
    desc: { ar: 'حمض الهيالورونيك المكثف لحبس الرطوبة ومحاربة الجفاف.', en: 'Hyaluronic acid deep hydration barrier.' },
    icon: Droplets,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80',
    fallbackImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80',
    badge: { ar: 'ترطيب عميق', en: 'Deep Moisture' },
    bg: 'bg-blue-50/70 border-blue-200/80 hover:border-blue-400 text-blue-900',
    badgeColor: 'bg-blue-600 text-white',
  },
  {
    id: 'even',
    title: { ar: 'بشرة موحّدة', en: 'Even Tone Skin' },
    ingredient: { ar: 'فيتامين سي العضوي', en: 'Pure Organic Vitamin C' },
    desc: { ar: 'فيتامين سي العضوي لتفتيح التصبغات وتوحيد لون البشرة.', en: 'Active Vitamin C to combat hyperpigmentation.' },
    icon: Sun,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
    fallbackImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80',
    badge: { ar: 'تفتيح وتوحيد', en: 'Even Tone' },
    bg: 'bg-amber-50/70 border-amber-200/80 hover:border-amber-400 text-amber-900',
    badgeColor: 'bg-amber-600 text-white',
  },
  {
    id: 'firm',
    title: { ar: 'بشرة مشدودة', en: 'Firm Skin' },
    ingredient: { ar: 'خلاصات الكولاجين النباتي', en: 'Botanical Collagen Boost' },
    desc: { ar: 'مستخلصات نباتية لتجديد الكولاجين والمرونة الطبيعية.', en: 'Plant botanicals restoring elasticity.' },
    icon: Shield,
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=700&q=80',
    fallbackImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80',
    badge: { ar: 'شد ومرونة', en: 'Firm & Elastic' },
    bg: 'bg-purple-50/70 border-purple-200/80 hover:border-purple-400 text-purple-900',
    badgeColor: 'bg-purple-700 text-white',
  },
  {
    id: 'radiant',
    title: { ar: 'بشرة مشرقة', en: 'Radiant Skin' },
    ingredient: { ar: 'زيوت اللافندر والورد', en: 'Rose & Lavender Infusion' },
    desc: { ar: 'زيوت اللافندر والورد لنضارة فورية وإشراقة طبيعية تدوم.', en: 'Lavender & Rose extracts for healthy glow.' },
    icon: Flower2,
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=700&q=80',
    fallbackImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80',
    badge: { ar: 'إشراقة طبيعية', en: 'Natural Glow' },
    bg: 'bg-rose-50/70 border-rose-200/80 hover:border-rose-400 text-rose-900',
    badgeColor: 'bg-rose-600 text-white',
  },
];

export const SkinDiagnosisSection: React.FC<SkinDiagnosisSectionProps> = ({
  lang,
  isRtl,
  activeSkinFilter,
  setActiveSkinFilter,
  skinDiagnosisCards,
  showToast,
}) => {
  const effectiveSkinDiagnosis =
    skinDiagnosisCards && skinDiagnosisCards.length > 0
      ? skinDiagnosisCards.map((s) => ({
          ...s,
          badge: {
            ar: s.badge.ar.replace(/\s*[\u2728\u2B50\u{1F31F}\u2605\u2726]/gu, '').trim(),
            en: s.badge.en.replace(/\s*[\u2728\u2B50\u{1F31F}\u2605\u2726]/gu, '').trim(),
          },
          icon:
            s.id === 'hydrated'
              ? Droplets
              : s.id === 'even'
                ? Sun
                : s.id === 'firm'
                  ? Shield
                  : Flower2,
        }))
      : DEFAULT_SKIN_TYPES;

  return (
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

      {/* 4 Smart Cards: Exactly 4 in a single row on larger devices (sm:grid-cols-4), and 2 on Mobile (grid-cols-2) */}
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
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80';
                    }
                  }}
                />

                {isSelected && (
                  <div className="absolute top-2 end-2 sm:top-2.5 sm:end-2.5 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-emerald-600 text-white shadow-md flex items-center gap-1">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span>{lang === 'ar' ? 'مفعّل' : 'Active'}</span>
                  </div>
                )}
              </div>

              <div className="p-2.5 sm:p-4 lg:p-5 flex flex-col justify-between flex-1 space-y-2 sm:space-y-3 text-start">
                <div className="space-y-1.5">
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

                <div className="pt-1.5 sm:pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs font-bold text-[#5A3E7A]">
                  <span className="truncate">
                    {isSelected
                      ? lang === 'ar'
                        ? '✓ تصفية مفعلة'
                        : '✓ Regimen Active'
                      : lang === 'ar'
                        ? 'تفعيل الروتين'
                        : 'Activate Routine'}
                  </span>
                  <span
                    className={`w-5 h-5 sm:w-7 sm:h-7 shrink-0 rounded-full flex items-center justify-center transition-all ${
                      isSelected ? 'bg-[#5A3E7A] text-white' : 'bg-purple-50 group-hover:bg-[#5A3E7A] group-hover:text-white'
                    }`}
                  >
                    {isRtl ? (
                      <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    ) : (
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
