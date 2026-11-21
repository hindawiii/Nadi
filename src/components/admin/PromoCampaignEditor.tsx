import React, { useRef, useState } from 'react';
import { Plus, RotateCcw, Trash2, Upload } from 'lucide-react';
import {
  DEFAULT_PROMO_SLIDES,
  PromoBannerConfig,
  PromoBannerSlideConfig,
  resolvePromoSlides,
} from '../../data/storeContentDefaults';
import { uploadStoreMedia } from '../../services/storageService';

export interface PromoCampaignEditorProps {
  lang: 'ar' | 'en';
  promoBanner?: Partial<PromoBannerConfig>;
  onUpdateField: (path: string, value: unknown) => void;
  onNotify: (message: string) => void;
}

export const PromoCampaignEditor: React.FC<PromoCampaignEditorProps> = ({
  lang,
  promoBanner,
  onUpdateField,
  onNotify,
}) => {
  const isAr = lang === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeSlideIdxRef = useRef<number | null>(null);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const slides: PromoBannerSlideConfig[] = resolvePromoSlides(promoBanner);

  const commitSlides = (nextSlides: PromoBannerSlideConfig[]) => {
    onUpdateField('promoBanner.slides', nextSlides);
    // Keep legacy image1/image2 synced for backward compatibility
    if (nextSlides[0]) {
      onUpdateField('promoBanner.image1', nextSlides[0].image);
      onUpdateField('promoBanner.image1Badge', nextSlides[0].badge);
    }
    if (nextSlides[1]) {
      onUpdateField('promoBanner.image2', nextSlides[1].image);
      onUpdateField('promoBanner.image2Badge', nextSlides[1].badge);
    }
  };

  const updateSlideField = (
    idx: number,
    key: 'image' | 'badge' | 'title' | 'desc',
    val: string,
    locale?: 'ar' | 'en'
  ) => {
    const next = slides.map((s, i) => {
      if (i !== idx) return s;
      if (key === 'image') return { ...s, image: val };
      return {
        ...s,
        [key]: {
          ...s[key],
          [locale || 'ar']: val,
        },
      };
    });
    commitSlides(next);
  };

  const handleAddSlide = () => {
    if (slides.length >= 6) {
      onNotify(isAr ? 'الحد الأقصى 6 شرائح في قسم العرض الخاص' : 'Maximum 6 special offer slides');
      return;
    }
    const nextNum = slides.length + 1;
    commitSlides([
      ...slides,
      {
        id: `promo-slide-${Date.now()}`,
        image: DEFAULT_PROMO_SLIDES[0].image,
        badge: { ar: `ميزة ${nextNum}`, en: `Highlight ${nextNum}` },
        title: { ar: `عنوان الشريحة ${nextNum}`, en: `Slide ${nextNum} Title` },
        desc: { ar: 'وصف مختصر يبرز فائدة العرض الخاص.', en: 'Short highlight describing the special offer.' },
      },
    ]);
    onNotify(isAr ? 'تمت إضافة شريحة جديدة للعرض الخاص' : 'Added a new special offer slide');
  };

  const handleDeleteSlide = (idx: number) => {
    if (slides.length <= 1) {
      onNotify(isAr ? 'يجب الإبقاء على شريحة واحدة على الأقل' : 'At least one slide is required');
      return;
    }
    commitSlides(slides.filter((_, i) => i !== idx));
    onNotify(isAr ? 'تم حذف الشريحة بنجاح' : 'Slide deleted');
  };

  const handleTriggerUpload = (idx: number) => {
    activeSlideIdxRef.current = idx;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetIdx = activeSlideIdxRef.current;
    if (!file || targetIdx === null) return;

    setUploadingIdx(targetIdx);
    try {
      const res = await uploadStoreMedia(file, 'banners', lang, { maxDimension: 1200, quality: 0.82 });
      updateSlideField(targetIdx, 'image', res.url);
      onNotify(isAr ? `تم رفع صورة الشريحة #${targetIdx + 1}` : `Uploaded slide #${targetIdx + 1} image`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : (isAr ? 'فشل رفع الصورة' : 'Upload failed');
      onNotify(msg);
    } finally {
      setUploadingIdx(null);
      activeSlideIdxRef.current = null;
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="space-y-6 text-start">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Section Copy & CTAs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {isAr ? 'شارة العرض (عربي)' : 'Offer Badge (AR)'}
          </label>
          <input
            type="text"
            value={promoBanner?.badge?.ar || ''}
            onChange={(e) => onUpdateField('promoBanner.badge.ar', e.target.value)}
            placeholder="عرض خاص"
            className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold leading-relaxed"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {isAr ? 'شارة العرض (إنجليزي)' : 'Offer Badge (EN)'}
          </label>
          <input
            type="text"
            value={promoBanner?.badge?.en || ''}
            onChange={(e) => onUpdateField('promoBanner.badge.en', e.target.value)}
            placeholder="Special Offer"
            className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {isAr ? 'العنوان الرئيسي للعرض (عربي)' : 'Offer Headline (AR)'}
          </label>
          <input
            type="text"
            value={promoBanner?.title?.ar || ''}
            onChange={(e) => onUpdateField('promoBanner.title.ar', e.target.value)}
            className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold leading-relaxed"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {isAr ? 'العنوان الرئيسي للعرض (إنجليزي)' : 'Offer Headline (EN)'}
          </label>
          <input
            type="text"
            value={promoBanner?.title?.en || ''}
            onChange={(e) => onUpdateField('promoBanner.title.en', e.target.value)}
            className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {isAr ? 'الوصف الفرعي للعرض (عربي)' : 'Offer Subtitle (AR)'}
          </label>
          <input
            type="text"
            value={promoBanner?.subtitle?.ar || ''}
            onChange={(e) => onUpdateField('promoBanner.subtitle.ar', e.target.value)}
            className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {isAr ? 'الوصف الفرعي للعرض (إنجليزي)' : 'Offer Subtitle (EN)'}
          </label>
          <input
            type="text"
            value={promoBanner?.subtitle?.en || ''}
            onChange={(e) => onUpdateField('promoBanner.subtitle.en', e.target.value)}
            className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {isAr ? 'نص زر الطلب الأول (عربي / إنجليزي)' : 'Primary CTA Label (AR / EN)'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={promoBanner?.ctaText?.ar || ''}
              onChange={(e) => onUpdateField('promoBanner.ctaText.ar', e.target.value)}
              placeholder="اطلبي البوكس"
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
            <input
              type="text"
              value={promoBanner?.ctaText?.en || ''}
              onChange={(e) => onUpdateField('promoBanner.ctaText.en', e.target.value)}
              placeholder="Order Box"
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {isAr ? 'نص زر السلة الثانوي (عربي / إنجليزي)' : 'Secondary CTA Label (AR / EN)'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={promoBanner?.secondaryCtaText?.ar || ''}
              onChange={(e) => onUpdateField('promoBanner.secondaryCtaText.ar', e.target.value)}
              placeholder="أضيفي للسلة"
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
            <input
              type="text"
              value={promoBanner?.secondaryCtaText?.en || ''}
              onChange={(e) => onUpdateField('promoBanner.secondaryCtaText.en', e.target.value)}
              placeholder="Add to Bag"
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>
        </div>
      </div>

      {/* All 4 Slides Manager */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-black text-slate-900">
              {isAr ? `شرائح العرض الترويجي (${slides.length} شرائح)` : `Campaign Showcase Slides (${slides.length})`}
            </h3>
            <p className="text-xs text-slate-500">
              {isAr
                ? 'عدّلي صور ونصوص الشرائح الأربعة بالكامل (بما فيها الشريحتان الثالثة والرابعة).'
                : 'Edit images, titles, badges, and descriptions for all 4 slides including slides 3 & 4.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                commitSlides(DEFAULT_PROMO_SLIDES);
                onNotify(isAr ? 'تمت استعادة الشرائح الأربعة الافتراضية' : 'Restored default 4 promo slides');
              }}
              className="h-11 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'الافتراضي' : 'Reset'}</span>
            </button>
            <button
              type="button"
              onClick={handleAddSlide}
              className="h-11 px-4 rounded-xl bg-[#5A3E7A] hover:bg-[#483162] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة شريحة' : 'Add Slide'}</span>
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/40 divide-y divide-slate-200/80 overflow-hidden">
          {slides.map((slide, idx) => (
            <div key={slide.id || idx} className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black text-[#5A3E7A] tabular-nums">
                  {isAr ? `الشريحة #${idx + 1}` : `Slide #${idx + 1}`}
                </span>
                {slides.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteSlide(idx)}
                    className="h-9 px-2.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'حذف' : 'Delete'}</span>
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <button
                  type="button"
                  disabled={uploadingIdx === idx}
                  onClick={() => handleTriggerUpload(idx)}
                  className="h-11 px-4 rounded-xl bg-purple-100 hover:bg-purple-200 text-[#5A3E7A] text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-60"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>
                    {uploadingIdx === idx
                      ? (isAr ? 'جاري الرفع...' : 'Uploading...')
                      : (isAr ? 'رفع صورة' : 'Upload')}
                  </span>
                </button>
                <input
                  type="url"
                  value={slide.image}
                  onChange={(e) => updateSlideField(idx, 'image', e.target.value)}
                  placeholder="https://..."
                  className="flex-1 h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                />
                {slide.image && (
                  <img
                    src={slide.image}
                    alt={slide.title[lang]}
                    className="w-12 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {isAr ? 'عنوان الشريحة (عربي)' : 'Slide Title (AR)'}
                  </label>
                  <input
                    type="text"
                    value={slide.title.ar}
                    onChange={(e) => updateSlideField(idx, 'title', e.target.value, 'ar')}
                    className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {isAr ? 'عنوان الشريحة (إنجليزي)' : 'Slide Title (EN)'}
                  </label>
                  <input
                    type="text"
                    value={slide.title.en}
                    onChange={(e) => updateSlideField(idx, 'title', e.target.value, 'en')}
                    className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {isAr ? 'الشارة المختصرة (عربي / إنجليزي)' : 'Slide Badge (AR / EN)'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={slide.badge.ar}
                      onChange={(e) => updateSlideField(idx, 'badge', e.target.value, 'ar')}
                      className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      value={slide.badge.en}
                      onChange={(e) => updateSlideField(idx, 'badge', e.target.value, 'en')}
                      className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {isAr ? 'الوصف في التوسع الكامل (عربي / إنجليزي)' : 'Lightbox Caption (AR / EN)'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={slide.desc.ar}
                      onChange={(e) => updateSlideField(idx, 'desc', e.target.value, 'ar')}
                      className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      value={slide.desc.en}
                      onChange={(e) => updateSlideField(idx, 'desc', e.target.value, 'en')}
                      className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
