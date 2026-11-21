import React, { useState } from 'react';
import { Check, Palette, RotateCcw, Shield, Sliders, Type } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { curatedPalettes, curatedTypographyPairs } from '../../data/siteConfig';

export const DevColorsTab: React.FC = () => {
  const {
    lang,
    activePaletteId,
    setActivePaletteId,
    customPalette,
    setCustomPalette,
    showToast,
  } = useCommerce();

  const currentActivePalette = curatedPalettes.find((p) => p.id === activePaletteId) || curatedPalettes[0];
  const [customPrimary, setCustomPrimary] = useState(customPalette?.primary || currentActivePalette.primary);
  const [customAccent, setCustomAccent] = useState(customPalette?.accent || currentActivePalette.accent);
  const [customSurface, setCustomSurface] = useState(customPalette?.surface || currentActivePalette.surface);

  const handleSaveCustomPalette = () => {
    setCustomPalette({
      primary: customPrimary,
      accent: customAccent,
      surface: customSurface,
    });
    showToast(lang === 'ar' ? 'تم تطبيق منظومة الألوان المخصصة بنجاح!' : 'Custom color palette applied successfully!');
  };

  const handleResetToPresetPalette = () => {
    setCustomPalette(null);
    setActivePaletteId('imperial-orchid');
    const resetP = curatedPalettes[0];
    setCustomPrimary(resetP.primary);
    setCustomAccent(resetP.accent);
    setCustomSurface(resetP.surface);
    showToast(lang === 'ar' ? 'تمت استعادة باليت الألوان الافتراضي' : 'Restored default palette');
  };

  return (
    <div className="space-y-8">
      {/* Architectural Strategy Banner */}
      <div className="bg-gradient-to-r from-purple-500/15 via-slate-900 to-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
          <Palette className="w-4 h-4" />
          <span>{lang === 'ar' ? 'منظومة باليتات الألوان المتجانسة (60-30-10 Design System)' : 'Harmonious Color Palette Design System'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          {lang === 'ar' ? 'تناغم لوني علمي يضمن التباين والجمال دون أي تداخل في الكود' : 'Scientifically Harmonized Palettes with WCAG AA Compliance'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          {lang === 'ar'
            ? 'تعتمد هذه المنظومة على قاعدة التوزيع العالمية (60% لنقاء السطوح والخلفيات، 30% لهوية العلامة الأساسية، 10% لأزرار الشراء ونقاط التفاعل CTA)، وتُحقن ديناميكياً عبر متغيرات CSS دون أي مساس بكود المتجر الأصلي.'
            : 'Built on the 60-30-10 color harmony rule (60% surface base, 30% brand primary, 10% CTA accent) injected via dynamic CSS variables with zero code pollution.'}
        </p>
      </div>

      {/* Section 1: Curated Harmonious Palettes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-amber-400" />
              <span>{lang === 'ar' ? '١. باليتات الألوان الفاخرة المعتمدة (٦ منظومات متناسقة)' : '1. Curated Luxury Harmonious Palettes (6 Schemes)'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ar'
                ? 'اختر أي منظومة لتطبيقها فورياً على كامل واجهة المتجر بنقرة زر واحدة.'
                : 'Select any palette to hot-swap colors across header, hero, cards, buttons & badges.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {curatedPalettes.map((palette) => {
            const isActive = activePaletteId === palette.id && !customPalette;
            return (
              <div
                key={palette.id}
                onClick={() => {
                  setActivePaletteId(palette.id);
                  setCustomPrimary(palette.primary);
                  setCustomAccent(palette.accent);
                  setCustomSurface(palette.surface);
                  showToast(lang === 'ar' ? `تم تفعيل باليت: ${palette.name.ar}` : `Applied ${palette.name.en}`);
                }}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                  isActive
                    ? 'bg-slate-900 border-amber-400 shadow-xl shadow-amber-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">{palette.category[lang]}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 rounded-md">
                      WCAG AA 4.5:1 Pass
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-white">{palette.name[lang]}</h4>

                  <div className="grid grid-cols-4 h-12 rounded-xl overflow-hidden border border-slate-700 shadow-inner">
                    <div style={{ backgroundColor: palette.primary }} title={`Primary (30%): ${palette.primary}`} className="flex items-end p-1 text-[9px] font-mono text-white font-bold opacity-90">30%</div>
                    <div style={{ backgroundColor: palette.accent }} title={`Accent CTA (10%): ${palette.accent}`} className="flex items-end p-1 text-[9px] font-mono text-white font-bold opacity-90">10%</div>
                    <div style={{ backgroundColor: palette.surface }} title={`Surface (60%): ${palette.surface}`} className="flex items-end p-1 text-[9px] font-mono text-slate-700 font-bold opacity-90">60%</div>
                    <div style={{ backgroundColor: palette.borderTint }} title={`Border: ${palette.borderTint}`} className="flex items-end p-1 text-[9px] font-mono text-slate-800 font-bold opacity-90">Tint</div>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Primary: <strong>{palette.primary}</strong></span>
                    <span>CTA: <strong>{palette.accent}</strong></span>
                  </div>
                </div>

                <button
                  type="button"
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {isActive ? (lang === 'ar' ? 'الباليت الفعّال حالياً ✓' : 'Active Palette ✓') : (lang === 'ar' ? 'تطبيق هذا الباليت' : 'Apply Palette')}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Custom Palette Studio */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <span>{lang === 'ar' ? '٢. استوديو تصميم منظومة الألوان المخصصة (Custom Studio)' : '2. Custom Color Palette Studio'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ar'
                ? 'اختر بدقة درجات الألوان الخاصة بهويتك واختبر توازنها فورياً.'
                : 'Pick custom Hex codes for primary identity, interactive accent CTA, and base surfaces.'}
            </p>
          </div>

          {customPalette && (
            <span className="px-3 py-1 bg-purple-950/80 border border-purple-800/60 text-purple-300 text-xs font-bold rounded-xl self-start sm:self-auto">
              {lang === 'ar' ? 'مفعل حالياً: باليت مخصص يدوي' : 'Custom Palette Active'}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Primary */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              {lang === 'ar' ? 'لون هوية العلامة الرئيسي (Primary 30%):' : 'Primary Brand Color (30%):'}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customPrimary}
                onChange={(e) => setCustomPrimary(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={customPrimary}
                onChange={(e) => setCustomPrimary(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                dir="ltr"
              />
            </div>
            <p className="text-[10px] text-slate-500">{lang === 'ar' ? 'للعناوين، شريط الإعلانات، وأيقونات المتجر.' : 'Headers, announcement bar, brand icons.'}</p>
          </div>

          {/* Accent CTA */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              {lang === 'ar' ? 'لون أزرار الشراء والتمييز (Accent CTA 10%):' : 'Accent CTA Button Color (10%):'}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customAccent}
                onChange={(e) => setCustomAccent(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={customAccent}
                onChange={(e) => setCustomAccent(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                dir="ltr"
              />
            </div>
            <p className="text-[10px] text-slate-500">{lang === 'ar' ? 'لأزرار الإضافة للسلة، شارات الخصم، والتنبيهات.' : 'Add-to-cart buttons, discount badges, active states.'}</p>
          </div>

          {/* Surface */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              {lang === 'ar' ? 'لون السطوح ونقاء الخلفية (Surface 60%):' : 'Clean Surface & Background (60%):'}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customSurface}
                onChange={(e) => setCustomSurface(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={customSurface}
                onChange={(e) => setCustomSurface(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                dir="ltr"
              />
            </div>
            <p className="text-[10px] text-slate-500">{lang === 'ar' ? 'خلفية المتجر، كروت المنتجات، والقوائم الهادئة.' : 'Store body background, card backgrounds.'}</p>
          </div>
        </div>

        {/* Mini Live Preview */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950 space-y-3">
          <span className="text-xs font-bold text-slate-400 block">{lang === 'ar' ? 'معاينة حية سريعة للتناسق اللوني:' : 'Miniature Live Harmony Preview:'}</span>
          <div style={{ backgroundColor: customSurface }} className="p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4 transition-colors">
            <div className="space-y-1">
              <span style={{ color: customPrimary }} className="text-sm font-extrabold block">
                {lang === 'ar' ? 'عنوان تجريبي بهوية المتجر' : 'Sample Brand Identity Headline'}
              </span>
              <span className="text-xs text-slate-600 block">
                {lang === 'ar' ? 'نص توضيحي على خلفية السطح الهادئة' : 'Descriptive text on clean base surface'}
              </span>
            </div>
            <button
              type="button"
              style={{ backgroundColor: customAccent, color: '#FFFFFF' }}
              className="px-4 py-2 rounded-xl text-xs font-bold shadow-md pointer-events-none"
            >
              {lang === 'ar' ? 'زر الشراء (CTA)' : 'Buy Now (CTA)'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap pt-2">
          <button
            type="button"
            onClick={handleSaveCustomPalette}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-black text-xs shadow-md transition-all flex items-center gap-2 min-h-[44px] cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{lang === 'ar' ? 'حفظ وتطبيق الباليت المخصص حياً' : 'Save & Apply Custom Palette'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetToPresetPalette}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 min-h-[44px] cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{lang === 'ar' ? 'استعادة الباليت الافتراضي للنشاط' : 'Restore Default Palette'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const DevTypographyTab: React.FC = () => {
  const { lang, activeTypographyId, setActiveTypographyId, showToast } = useCommerce();

  return (
    <div className="space-y-8">
      {/* Architectural Strategy Banner */}
      <div className="bg-gradient-to-r from-blue-500/15 via-slate-900 to-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Type className="w-4 h-4" />
          <span>{lang === 'ar' ? 'منظومة الخطوط التايبوغرافية المتجانسة (Harmonious Dual Pairing System)' : 'Harmonious Typography Pairing System'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          {lang === 'ar' ? 'توليفات خطية ثنائية اللغة فائقة التناغم مع حماية التشكيل العربي' : 'Bilingual Font Pairs Engineered for Flawless Readability & Tashkeel'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          {lang === 'ar'
            ? 'تعتمد هذه المنظومة على التزاوج الدقيق بين خط العناوين (Display/Headings) لمنح المتجر طابعاً مميزاً وفاخراً، وخط المتن (Body) المختار بمقروئية مريحة مع تباعد أسطر آمن (leading-relaxed 1.625) يحمي حركات التشكيل (Tashkeel) العربية من الانكسار أو التداخل.'
            : 'Dual-font architecture pairing luxurious display headings with high-legibility body fonts at a protected 1.625 line-height ratio, preventing Arabic diacritics (Tashkeel) collision and layout shifts.'}
        </p>
      </div>

      {/* Section 1: Curated Font Pairs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <Type className="w-5 h-5 text-amber-400" />
              <span>{lang === 'ar' ? '١. التوليفات الخطية المتجانسة الأربعة المعتمدة' : '1. Curated Bilingual Font Pairs'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ar'
                ? 'اختر أي توليفة ليتم تطبيقها فورياً على العناوين والمتن وقوائم المتجر.'
                : 'Click to instantly swap heading & body typography across the storefront.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {curatedTypographyPairs.map((pair) => {
            const isActive = activeTypographyId === pair.id;
            return (
              <div
                key={pair.id}
                onClick={() => {
                  setActiveTypographyId(pair.id);
                  showToast(lang === 'ar' ? `تم تفعيل توليفة: ${pair.name.ar}` : `Applied ${pair.name.en}`);
                }}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-5 ${
                  isActive
                    ? 'bg-slate-900 border-amber-400 shadow-xl shadow-amber-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-400">{pair.category[lang]}</span>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 bg-blue-950/80 text-blue-300 border border-blue-800/60 rounded-md">
                      Line Height {pair.lineHeight} (Tashkeel Safe)
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-white">{pair.name[lang]}</h4>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                        {lang === 'ar' ? 'خط العناوين (Headings)' : 'Headings Font'}
                      </span>
                      <span className="font-bold text-amber-300 block text-xs mt-0.5">
                        {pair.headingFamilyAr} / {pair.headingFamilyEn}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                        {lang === 'ar' ? 'خط المتن (Body)' : 'Body Font'}
                      </span>
                      <span className="font-bold text-slate-200 block text-xs mt-0.5">
                        {pair.bodyFamilyAr} / {pair.bodyFamilyEn}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                    <h5
                      style={{
                        fontFamily:
                          lang === 'ar'
                            ? `${pair.headingFamilyAr}, Cairo, serif`
                            : `${pair.headingFamilyEn}, Playfair Display, serif`,
                      }}
                      className="text-base sm:text-lg font-bold text-white leading-tight"
                    >
                      {pair.sampleHeading[lang]}
                    </h5>
                    <p
                      style={{
                        fontFamily:
                          lang === 'ar'
                            ? `${pair.bodyFamilyAr}, sans-serif`
                            : `${pair.bodyFamilyEn}, sans-serif`,
                        lineHeight: pair.lineHeight,
                      }}
                      className="text-xs text-slate-400"
                    >
                      {pair.sampleBody[lang]}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {isActive ? (lang === 'ar' ? 'التوليفة الفعّالة حالياً ✓' : 'Active Font Pair ✓') : (lang === 'ar' ? 'تطبيق هذه التوليفة الخطية' : 'Apply Font Pair')}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Typography Architecture Principles */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-400" />
          <span>{lang === 'ar' ? '٢. ركائز الحماية المعمارية للتايبوغرافي في المتجر' : '2. Architectural Typography Protections'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
            <span className="text-amber-400 text-sm font-bold block">١. حماية التشكيل (Tashkeel Guard)</span>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'ar'
                ? 'تطبيق تباعد أسطر 1.625 يضمن عدم اصطدام الفتحة أو الضمة أو التنوين بالسطر الذي يعلوه إطلاقاً.'
                : 'Relaxed 1.625 line-height prevents vertical overlap of Arabic accents.'}
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
            <span className="text-amber-400 text-sm font-bold block">٢. الاتجاهات المنطقية (Logical Properties)</span>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'ar'
                ? 'الاعتماد الكلي على ms و me و start و end يضمن انتقال الخطوط والتخطيط بسلاسة بين العربية والإنجليزية دون انكسار.'
                : 'Zero physical margins ensures 100% natural RTL/LTR flipping.'}
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
            <span className="text-amber-400 text-sm font-bold block">٣. انعدام التداخل (Zero Code Collision)</span>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'ar'
                ? 'حقن الخطوط يتم عبر متغيرات CSS نقية على مستوى :root دون الحاجة لتعديل أو إعادة كتابة مكونات المتجر.'
                : 'CSS Variables at root level guarantee zero component regression.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
