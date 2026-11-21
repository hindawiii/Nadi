import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Plus, RotateCcw, Trash2, Upload } from 'lucide-react';
import type { EditorialHeroSlideConfig } from '../../data/storeContentDefaults';
import { uploadStoreMedia } from '../../services/storageService';

export interface HeroSlidesEditorProps {
  lang: 'ar' | 'en';
  slides?: EditorialHeroSlideConfig[];
  onUpdateSlides: (nextSlides: EditorialHeroSlideConfig[] | undefined) => void;
  onNotify: (message: string) => void;
}

const DEFAULT_EDITABLE_HERO_SLIDES: EditorialHeroSlideConfig[] = [
  {
    id: 'hero-skincare',
    image: '',
    collectionId: 'skin',
    sectionLabel: { ar: 'العناية بالبشرة', en: 'Skincare' },
    alt: {
      ar: 'مستحضرات نَدِي للعناية الطبيعية بالبشرة',
      en: 'NADI botanical skincare essentials',
    },
    objectPosition: 'object-[50%_38%]',
  },
  {
    id: 'hero-haircare',
    image: '',
    collectionId: 'hair',
    sectionLabel: { ar: 'العناية بالشعر', en: 'Hair Care' },
    alt: {
      ar: 'أجهزة ومستحضرات نَدِي للعناية بالشعر',
      en: 'NADI hair care and styling essentials',
    },
    objectPosition: 'object-[50%_40%]',
  },
  {
    id: 'hero-bundles',
    image: '',
    collectionId: 'box',
    sectionLabel: { ar: 'البكجات والعروض', en: 'Bundles & Offers' },
    alt: {
      ar: 'بكجات وهدايا نَدِي الفاخرة للعناية المتكاملة',
      en: 'NADI luxury curated gift bundles',
    },
    objectPosition: 'object-[50%_35%]',
  },
];

export const HeroSlidesEditor: React.FC<HeroSlidesEditorProps> = ({
  lang,
  slides,
  onUpdateSlides,
  onNotify,
}) => {
  const isAr = lang === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const activeUploadIdxRef = useRef<number | null>(null);

  const effectiveSlides: EditorialHeroSlideConfig[] =
    Array.isArray(slides) && slides.length > 0 ? slides : DEFAULT_EDITABLE_HERO_SLIDES;

  const commitSlides = (next: EditorialHeroSlideConfig[]) => {
    onUpdateSlides(next);
  };

  const updateSlideAt = (idx: number, patch: Partial<EditorialHeroSlideConfig>) => {
    const next = effectiveSlides.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    commitSlides(next);
  };

  const updateBilingualAt = (
    idx: number,
    key: 'sectionLabel' | 'alt',
    locale: 'ar' | 'en',
    val: string
  ) => {
    const next = effectiveSlides.map((s, i) =>
      i === idx ? { ...s, [key]: { ...s[key], [locale]: val } } : s
    );
    commitSlides(next);
  };

  const handleAddSlide = () => {
    if (effectiveSlides.length >= 6) {
      onNotify(isAr ? 'الحد الأقصى هو 6 شرائح في البنر التحريري' : 'Maximum 6 hero slides allowed');
      return;
    }
    const nextNum = effectiveSlides.length + 1;
    commitSlides([
      ...effectiveSlides,
      {
        id: `hero-slide-${Date.now()}`,
        image: '',
        collectionId: 'skin',
        sectionLabel: { ar: `تشكيلة جديدة ${nextNum}`, en: `Collection ${nextNum}` },
        alt: { ar: `شريحة البنر ${nextNum}`, en: `Hero slide ${nextNum}` },
        objectPosition: 'object-[50%_38%]',
      },
    ]);
    onNotify(isAr ? 'تمت إضافة شريحة جديدة للبنر التحريري' : 'Added a new editorial hero slide');
  };

  const handleDeleteSlide = (idx: number) => {
    if (effectiveSlides.length <= 1) {
      onNotify(isAr ? 'يجب الإبقاء على شريحة واحدة على الأقل' : 'At least one hero slide is required');
      return;
    }
    commitSlides(effectiveSlides.filter((_, i) => i !== idx));
    onNotify(isAr ? 'تم حذف الشريحة بنجاح' : 'Hero slide removed');
  };

  const handleTriggerUpload = (idx: number) => {
    activeUploadIdxRef.current = idx;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetIdx = activeUploadIdxRef.current;
    if (!file || targetIdx === null) return;

    setUploadingIdx(targetIdx);
    try {
      const res = await uploadStoreMedia(file, 'hero', lang, { maxDimension: 1400, quality: 0.84 });
      updateSlideAt(targetIdx, { image: res.url });
      onNotify(isAr ? `تم رفع صورة الشريحة #${targetIdx + 1} بنجاح` : `Slide #${targetIdx + 1} image uploaded`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : (isAr ? 'فشل رفع الصورة' : 'Image upload failed');
      onNotify(msg);
    } finally {
      setUploadingIdx(null);
      activeUploadIdxRef.current = null;
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="pt-4 border-t border-slate-100 space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5 text-start">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#5A3E7A] shrink-0" />
            <span>
              {isAr
                ? `شرائح البانر التحريري المتحرك (${effectiveSlides.length})`
                : `Editorial Hero Slides (${effectiveSlides.length})`}
            </span>
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {isAr
              ? 'تحكمي بصور وأسماء جميع شرائح الواجهة الرئيسية (اتركي رابط الصورة فارغاً لاستخدام الصورة الافتراضية المدمجة).'
              : 'Manage photos, labels, and target collections for each hero slide (leave image URL blank to use built-in default photography).'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {Array.isArray(slides) && slides.length > 0 && (
            <button
              type="button"
              onClick={() => {
                onUpdateSlides(undefined);
                onNotify(isAr ? 'تمت استعادة شرائح البانر الافتراضية' : 'Restored default editorial hero slides');
              }}
              className="h-11 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'الافتراضي' : 'Reset'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleAddSlide}
            className="h-11 px-4 rounded-xl bg-[#5A3E7A] hover:bg-[#483162] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة شريحة' : 'Add Slide'}</span>
          </button>
        </div>
      </div>

      {/* Grouped Material 3 List with Hairline Dividers */}
      <div className="rounded-2xl border border-slate-200/90 bg-slate-50/40 divide-y divide-slate-200/80 overflow-hidden">
        {effectiveSlides.map((slide, idx) => (
          <div key={slide.id || idx} className="p-4 sm:p-5 space-y-3 text-start">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black text-[#5A3E7A] tabular-nums">
                {isAr ? `الشريحة #${String(idx + 1).padStart(2, '0')}` : `Slide #${String(idx + 1).padStart(2, '0')}`}
              </span>

              {effectiveSlides.length > 1 && (
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

            {/* Image Upload + URL Row */}
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
                    : (isAr ? 'رفع صورة' : 'Upload Photo')}
                </span>
              </button>

              <input
                type="url"
                value={slide.image || ''}
                onChange={(e) => updateSlideAt(idx, { image: e.target.value })}
                placeholder={isAr ? 'رابط الصورة (اختياري — الافتراضي مدمج)' : 'Image URL (optional — defaults to built-in)'}
                className="flex-1 h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A3E7A]/40"
              />

              {slide.image && (
                <img
                  src={slide.image}
                  alt={slide.sectionLabel[lang]}
                  className="w-16 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                />
              )}
            </div>

            {/* Bilingual Section Label & Linked Collection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {isAr ? 'اسم القسم بالشريط السفلي (عربي)' : 'Section Jump Label (AR)'}
                </label>
                <input
                  type="text"
                  value={slide.sectionLabel?.ar || ''}
                  onChange={(e) => updateBilingualAt(idx, 'sectionLabel', 'ar', e.target.value)}
                  className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A3E7A]/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {isAr ? 'اسم القسم بالشريط السفلي (إنجليزي)' : 'Section Jump Label (EN)'}
                </label>
                <input
                  type="text"
                  value={slide.sectionLabel?.en || ''}
                  onChange={(e) => updateBilingualAt(idx, 'sectionLabel', 'en', e.target.value)}
                  className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A3E7A]/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {isAr ? 'الركن المرتبط عند النقر' : 'Linked Collection'}
                </label>
                <select
                  value={slide.collectionId || 'skin'}
                  onChange={(e) =>
                    updateSlideAt(idx, {
                      collectionId: e.target.value as 'skin' | 'hair' | 'box',
                    })
                  }
                  className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A3E7A]/40"
                >
                  <option value="skin">{isAr ? 'العناية بالبشرة' : 'Skincare'}</option>
                  <option value="hair">{isAr ? 'أجهزة والعناية بالشعر' : 'Hair Care & Devices'}</option>
                  <option value="box">{isAr ? 'البكجات والعروض' : 'Bundles & Offers'}</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
