import React from 'react';
import {
  Award,
  Layers,
  MapPin,
  Megaphone,
  Plus,
  ShoppingBag,
  Sliders,
  Trash2,
  Upload,
} from 'lucide-react';
import { HeroSlidesEditor } from '../admin/HeroSlidesEditor';
import { FieldResetBtn } from './FieldResetBtn';

interface CustomizerTopCornersProps {
  lang: 'ar' | 'en';
  activePreset: any;
  preset: any;
  updateField: (path: string, value: any) => void;
  isFieldModified: (path: string) => boolean;
  resetFieldToDefault: (path: string, descAr: string, descEn: string) => void;
  showToast: (msg: string) => void;
  onTriggerLogoUpload: () => void;
  onTriggerHeroUpload: () => void;
}

export const CustomizerTopCorners: React.FC<CustomizerTopCornersProps> = ({
  lang,
  activePreset,
  preset,
  updateField,
  isFieldModified,
  resetFieldToDefault,
  showToast,
  onTriggerLogoUpload,
  onTriggerHeroUpload,
}) => {
  const renderReset = (path: string, descAr: string, descEn: string) => (
    <FieldResetBtn
      lang={lang}
      path={path}
      descAr={descAr}
      descEn={descEn}
      isFieldModified={isFieldModified}
      resetFieldToDefault={resetFieldToDefault}
    />
  );

  return (
    <>
      {/* CORNER 1: TOP ANNOUNCEMENT BAR */}
      <div id="corner-1" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              1
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-purple-600" />
                <span>{lang === 'ar' ? 'الركن الأول: شريط الإعلانات الترويجي العلوي' : 'Corner 1: Top Announcement Bar'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'ar' ? 'النصوص والعروض المتحركة في أعلى نقطة بالمتجر فوق شريط التنقل' : 'Topmost ticker slides above the header navigation'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-xl flex items-center gap-1.5 w-fit">
              <MapPin className="w-3.5 h-3.5 text-purple-600" />
              <span>{lang === 'ar' ? 'أعلى قمة المتجر' : 'Storefront Topmost'}</span>
            </span>
            {renderReset('announcementSlides', 'شرائح الشريط العلوي', 'Announcement Slides')}
          </div>
        </div>

        {/* Top Announcement Main Text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-2xl bg-purple-50/20 border border-purple-100">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-bold text-slate-700 block">
                {lang === 'ar' ? 'الإعلان الثابت الرئيسي (بالعربية):' : 'Main Announcement (Arabic):'}
              </label>
              {renderReset('topAnnouncement.ar', 'الإعلان الثابت بالعربية', 'Main Announcement (AR)')}
            </div>
            <input
              type="text"
              value={preset.topAnnouncement?.ar || ''}
              onChange={(e) => updateField('topAnnouncement.ar', e.target.value)}
              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-bold text-slate-700 block">
                {lang === 'ar' ? 'الإعلان الثابت الرئيسي (بالإنجليزية):' : 'Main Announcement (English):'}
              </label>
              {renderReset('topAnnouncement.en', 'الإعلان الثابت بالإنجليزية', 'Main Announcement (EN)')}
            </div>
            <input
              type="text"
              value={preset.topAnnouncement?.en || ''}
              onChange={(e) => updateField('topAnnouncement.en', e.target.value)}
              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>
        </div>

        {/* Slides List */}
        <div className="space-y-4">
          {(
            preset.announcementSlides || [
              { ar: 'شحن فوري سريع ومجاني للطلبات فوق 50$', en: 'Free express shipping on orders over $50' },
              { ar: 'تركيبات نباتية أصلية ونقية 100% معتمدة', en: '100% Certified pure botanical formulas' },
              { ar: 'ضمان ذهبي شامل لمدة عامين على الأجهزة', en: 'Full 2-year warranty on all beauty devices' },
            ]
          ).map((slide: any, sIdx: number) => {
            const textAr = typeof slide === 'object' ? slide.ar || slide.text?.ar || '' : String(slide);
            const textEn = typeof slide === 'object' ? slide.en || slide.text?.en || '' : String(slide);
            return (
              <div key={sIdx} className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900">
                    {lang === 'ar' ? `الشريحة الإعلانية المتحركة #${sIdx + 1}` : `Ticker Slide #${sIdx + 1}`}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">
                      {lang === 'ar' ? 'النص بالعربية:' : 'Text (Arabic):'}
                    </label>
                    <input
                      type="text"
                      value={textAr}
                      onChange={(e) => {
                        const slides = JSON.parse(
                          JSON.stringify(
                            preset.announcementSlides || [
                              { ar: 'شحن فوري سريع ومجاني للطلبات فوق 50$', en: 'Free express shipping on orders over $50' },
                              { ar: 'تركيبات نباتية أصلية ونقية 100% معتمدة', en: '100% Certified pure botanical formulas' },
                              { ar: 'ضمان ذهبي شامل لمدة عامين على الأجهزة', en: 'Full 2-year warranty on all beauty devices' },
                            ]
                          )
                        );
                        if (!slides[sIdx]) slides[sIdx] = { ar: '', en: '' };
                        slides[sIdx].ar = e.target.value;
                        updateField('announcementSlides', slides);
                      }}
                      className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">
                      {lang === 'ar' ? 'النص بالإنجليزية:' : 'Text (English):'}
                    </label>
                    <input
                      type="text"
                      value={textEn}
                      onChange={(e) => {
                        const slides = JSON.parse(
                          JSON.stringify(
                            preset.announcementSlides || [
                              { ar: 'شحن فوري سريع ومجاني للطلبات فوق 50$', en: 'Free express shipping on orders over $50' },
                              { ar: 'تركيبات نباتية أصلية ونقية 100% معتمدة', en: '100% Certified pure botanical formulas' },
                              { ar: 'ضمان ذهبي شامل لمدة عامين على الأجهزة', en: 'Full 2-year warranty on all beauty devices' },
                            ]
                          )
                        );
                        if (!slides[sIdx]) slides[sIdx] = { ar: '', en: '' };
                        slides[sIdx].en = e.target.value;
                        updateField('announcementSlides', slides);
                      }}
                      className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CORNER 2: HEADER & STORE BRANDING */}
      <div id="corner-2" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              2
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                <span>{lang === 'ar' ? 'الركن الثاني: الهيدر وشعار وهوية المتجر' : 'Corner 2: Header & Store Branding'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'ar' ? 'اسم المتجر، شعار المتجر (نصي أو صوري)، وروابط التنقل الرئيسية' : 'Store name, logo (text or image upload), and header branding'}
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-xl flex items-center gap-1.5 w-fit">
            <MapPin className="w-3.5 h-3.5 text-purple-600" />
            <span>{lang === 'ar' ? 'شريط الهيدر والتنقل' : 'Header Navigation Bar'}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                {lang === 'ar' ? 'اسم المتجر (بالعربية):' : 'Store Name (Arabic):'}
              </label>
              {renderReset('storeName.ar', 'اسم المتجر بالعربية', 'Store Name (AR)')}
            </div>
            <input
              type="text"
              value={activePreset.storeName?.ar || ''}
              onChange={(e) => updateField('storeName.ar', e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                {lang === 'ar' ? 'اسم المتجر (بالإنجليزية):' : 'Store Name (English):'}
              </label>
              {renderReset('storeName.en', 'اسم المتجر بالإنجليزية', 'Store Name (EN)')}
            </div>
            <input
              type="text"
              value={activePreset.storeName?.en || ''}
              onChange={(e) => updateField('storeName.en', e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                {lang === 'ar' ? 'الشعار اللفظي (Slogan بالعربية):' : 'Slogan (Arabic):'}
              </label>
              {renderReset('storeSlogan.ar', 'الشعار اللفظي بالعربية', 'Slogan (AR)')}
            </div>
            <input
              type="text"
              value={activePreset.storeSlogan?.ar || ''}
              onChange={(e) => updateField('storeSlogan.ar', e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                {lang === 'ar' ? 'الشعار اللفظي (Slogan بالإنجليزية):' : 'Slogan (English):'}
              </label>
              {renderReset('storeSlogan.en', 'الشعار اللفظي بالإنجليزية', 'Slogan (EN)')}
            </div>
            <input
              type="text"
              value={activePreset.storeSlogan?.en || ''}
              onChange={(e) => updateField('storeSlogan.en', e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Logo Upload Box */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800">
              {lang === 'ar' ? 'شعار المتجر الصوري (Logo Upload / URL):' : 'Store Graphic Logo:'}
            </label>
            <div className="flex items-center gap-2">
              {renderReset('storeLogo', 'شعار المتجر الصوري', 'Store Logo')}
              {activePreset.storeLogo && (
                <button
                  type="button"
                  onClick={() => {
                    updateField('storeLogo', '');
                    showToast(lang === 'ar' ? 'تم حذف الشعار والاعتماد على الاسم النصي' : 'Reverted to clean text logo');
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                >
                  {lang === 'ar' ? 'مسح الشعار والاعتماد على النص' : 'Clear Image'}
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={onTriggerLogoUpload}
              className="w-full sm:w-auto h-11 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shrink-0 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>{lang === 'ar' ? 'رفع الشعار من جهازك' : 'Upload Logo File'}</span>
            </button>

            <input
              type="url"
              value={activePreset.storeLogo || ''}
              onChange={(e) => updateField('storeLogo', e.target.value)}
              placeholder="https://... (Leave blank for text-only luxury mode)"
              className="flex-1 w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
            />

            {activePreset.storeLogo && (
              <div className="w-12 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1 shrink-0 shadow-xs">
                <img src={activePreset.storeLogo} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CORNER 3: HERO BANNER SECTION */}
      <div id="corner-3" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              3
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <span>{lang === 'ar' ? 'الركن الثالث: البنر الترحيبي الرئيسي (Hero Section)' : 'Corner 3: Hero Banner Section'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'ar' ? 'صورة الواجهة الكبرى، العنوان الترحيبي، العنوان الفرعي، والشارة الجاذبة' : 'Main hero visual banner, headline, subtitle, and primary call-to-action'}
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-xl flex items-center gap-1.5 w-fit">
            <MapPin className="w-3.5 h-3.5 text-purple-600" />
            <span>{lang === 'ar' ? 'أعلى الصفحة الرئيسية' : 'Storefront Top Hero'}</span>
          </span>
        </div>

        {/* Hero Main Image Upload */}
        <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-purple-900">
              {lang === 'ar' ? 'صورة واجهة الهيرو الكبيرة (Hero Visual Image):' : 'Hero Visual Banner Image:'}
            </label>
            {renderReset('heroImage', 'صورة الهيرو الرئيسية', 'Hero Image')}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={onTriggerHeroUpload}
              className="w-full sm:w-auto h-11 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>{lang === 'ar' ? 'رفع صورة من جهازك' : 'Upload from Device'}</span>
            </button>
            <input
              type="url"
              value={activePreset.heroImage || ''}
              onChange={(e) => updateField('heroImage', e.target.value)}
              placeholder="https://..."
              className="flex-1 w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
            />
            {activePreset.heroImage && (
              <div className="relative group shrink-0">
                <img src={activePreset.heroImage} alt="Hero" className="w-16 h-11 rounded-xl object-cover border border-purple-200 shadow-xs" />
                <span className="absolute -top-1 -end-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
              </div>
            )}
          </div>
        </div>

        {/* Hero Titles & Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                {lang === 'ar' ? 'العنوان الرئيسي للهيرو (بالعربية):' : 'Hero Headline (Arabic):'}
              </label>
              {renderReset('heroTitle.ar', 'عنوان الهيرو بالعربية', 'Hero Title (AR)')}
            </div>
            <input
              type="text"
              value={activePreset.heroTitle?.ar || ''}
              onChange={(e) => updateField('heroTitle.ar', e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                {lang === 'ar' ? 'العنوان الرئيسي للهيرو (بالإنجليزية):' : 'Hero Headline (English):'}
              </label>
              {renderReset('heroTitle.en', 'عنوان الهيرو بالإنجليزية', 'Hero Title (EN)')}
            </div>
            <input
              type="text"
              value={activePreset.heroTitle?.en || ''}
              onChange={(e) => updateField('heroTitle.en', e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                {lang === 'ar' ? 'العنوان الفرعي الوصفي (بالعربية):' : 'Hero Subtitle (Arabic):'}
              </label>
              {renderReset('heroSubtitle.ar', 'العنوان الفرعي بالعربية', 'Hero Subtitle (AR)')}
            </div>
            <input
              type="text"
              value={activePreset.heroSubtitle?.ar || ''}
              onChange={(e) => updateField('heroSubtitle.ar', e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                {lang === 'ar' ? 'العنوان الفرعي الوصفي (بالإنجليزية):' : 'Hero Subtitle (English):'}
              </label>
              {renderReset('heroSubtitle.en', 'العنوان الفرعي بالإنجليزية', 'Hero Subtitle (EN)')}
            </div>
            <input
              type="text"
              value={activePreset.heroSubtitle?.en || ''}
              onChange={(e) => updateField('heroSubtitle.en', e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                {lang === 'ar' ? 'زر الشراء الرئيسي (بالعربية):' : 'Primary CTA Button (AR):'}
              </label>
              {renderReset('heroCtaPrimary.ar', 'زر الطلب الرئيسي بالعربية', 'Primary CTA (AR)')}
            </div>
            <input
              type="text"
              value={preset.heroCtaPrimary?.ar || ''}
              onChange={(e) => updateField('heroCtaPrimary.ar', e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                {lang === 'ar' ? 'زر الشراء الرئيسي (بالإنجليزية):' : 'Primary CTA Button (EN):'}
              </label>
              {renderReset('heroCtaPrimary.en', 'زر الطلب الرئيسي بالإنجليزية', 'Primary CTA (EN)')}
            </div>
            <input
              type="text"
              value={preset.heroCtaPrimary?.en || ''}
              onChange={(e) => updateField('heroCtaPrimary.en', e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                {lang === 'ar' ? 'الزر الثانوي للهيرو (بالعربية):' : 'Secondary CTA Button (AR):'}
              </label>
              {renderReset('heroCtaSecondary.ar', 'زر الهيرو الثانوي بالعربية', 'Secondary CTA (AR)')}
            </div>
            <input
              type="text"
              value={preset.heroCtaSecondary?.ar || ''}
              onChange={(e) => updateField('heroCtaSecondary.ar', e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                {lang === 'ar' ? 'الزر الثانوي للهيرو (بالإنجليزية):' : 'Secondary CTA Button (EN):'}
              </label>
              {renderReset('heroCtaSecondary.en', 'زر الهيرو الثانوي بالإنجليزية', 'Secondary CTA (EN)')}
            </div>
            <input
              type="text"
              value={preset.heroCtaSecondary?.en || ''}
              onChange={(e) => updateField('heroCtaSecondary.en', e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>
        </div>

        <HeroSlidesEditor
          lang={lang}
          slides={activePreset.heroSlides}
          onUpdateSlides={(nextSlides) => updateField('heroSlides', nextSlides)}
          onNotify={(message) => showToast(message)}
        />
      </div>

      {/* CORNER 4: INFINITE BRAND TICKER */}
      <div id="corner-4" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              4
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-600" />
                <span>{lang === 'ar' ? 'الركن الرابع: شريط الماركات المتحرك (Infinite Brand Ticker)' : 'Corner 4: Infinite Brand Ticker'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'ar' ? 'شريط الماركات والشركاء المتدفق أسفل الهيرو مباشرة' : 'Flowing brand ticker directly below the hero section'}
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl flex items-center gap-1.5 w-fit">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>{lang === 'ar' ? 'أسفل الهيرو مباشرة' : 'Below Hero Section'}</span>
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">
              {lang === 'ar' ? 'قائمة الماركات المعروضة في الشريط:' : 'Ticker Brand Names:'}
            </label>
            {renderReset('brandTicker', 'شريط الماركات', 'Brand Ticker')}
          </div>

          <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            {((preset.brandTicker as string[]) || ['Siltek', 'Okema', 'Clara', 'Sheglam', 'Nadi Bloom']).map((b: string, idx: number) => (
              <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
                <span>{b}</span>
                <button
                  type="button"
                  onClick={() => {
                    const cur = ((preset.brandTicker as string[]) || ['Siltek', 'Okema', 'Clara', 'Sheglam', 'Nadi Bloom']).filter((_: string, i: number) => i !== idx);
                    updateField('brandTicker', cur);
                  }}
                  className="text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              id="new-brand-input"
              placeholder={lang === 'ar' ? 'إضافة اسم ماركة جديدة...' : 'Add new brand name...'}
              className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const input = e.currentTarget;
                  if (input.value.trim()) {
                    const cur = [...((preset.brandTicker as string[]) || ['Siltek', 'Okema', 'Clara', 'Sheglam', 'Nadi Bloom']), input.value.trim()];
                    updateField('brandTicker', cur);
                    input.value = '';
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById('new-brand-input') as HTMLInputElement;
                if (input && input.value.trim()) {
                  const cur = [...((preset.brandTicker as string[]) || ['Siltek', 'Okema', 'Clara', 'Sheglam', 'Nadi Bloom']), input.value.trim()];
                  updateField('brandTicker', cur);
                  input.value = '';
                }
              }}
              className="h-10 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إضافة' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* CORNER 5: CATEGORIES FILTER */}
      <div id="corner-5" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              5
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-purple-600" />
                <span>{lang === 'ar' ? 'الركن الخامس: تصنيفات وتبويبات المتجر السريعة' : 'Corner 5: Categories Navigation'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'ar' ? 'شريط التبويبات والتصنيفات الدائرية لتصفية المنتجات' : 'Pill tabs and filter buttons for category navigation'}
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl flex items-center gap-1.5 w-fit">
            <MapPin className="w-3.5 h-3.5 text-slate-600" />
            <span>{lang === 'ar' ? 'أعلى كتالوج المنتجات' : 'Above Products Catalog'}</span>
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <p className="text-xs text-slate-600">
            {lang === 'ar'
              ? 'التصنيفات المعتمدة حالياً في المتجر الحي تُستخرج وتُحدّث تلقائياً بناءً على تصنيفات المنتجات المضافة في الكتالوج (مثل: العناية بالبشرة، أجهزة الشعر، بوكسات التوفير).'
              : 'Storefront category filters are dynamically linked to product categories (Skincare, Hair Devices, Value Bundles).'}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
              {lang === 'ar' ? 'كافة المنتجات' : 'All Products'}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
              {lang === 'ar' ? 'العناية بالبشرة' : 'Skincare Formulations'}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
              {lang === 'ar' ? 'أجهزة الشعر' : 'Hair Styling Devices'}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
              {lang === 'ar' ? 'بكجات التوفير' : 'Value Bundles'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
