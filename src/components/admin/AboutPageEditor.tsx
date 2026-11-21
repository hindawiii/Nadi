import React, { useRef, useState } from 'react';
import { BookOpen, MapPin, Plus, RotateCcw, Trash2, Upload } from 'lucide-react';
import {
  AboutStoryConfig,
  AboutValueIconId,
  AboutValueItemConfig,
  BilingualText,
  resolveAboutPageContent,
} from '../../data/storeContentDefaults';
import { uploadStoreMedia } from '../../services/storageService';

export interface AboutPageEditorProps {
  lang: 'ar' | 'en';
  storeName: BilingualText;
  aboutStory?: Partial<AboutStoryConfig>;
  onUpdateAboutStory: (next: AboutStoryConfig) => void;
  onResetAboutStory: () => void;
  onNotify: (message: string) => void;
}

export const AboutPageEditor: React.FC<AboutPageEditorProps> = ({
  lang,
  storeName,
  aboutStory,
  onUpdateAboutStory,
  onResetAboutStory,
  onNotify,
}) => {
  const isAr = lang === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const resolved = resolveAboutPageContent(aboutStory, storeName);

  const updateBilingual = (
    key:
      | 'title'
      | 'body'
      | 'missionTitle'
      | 'missionBody'
      | 'visionTitle'
      | 'visionBody'
      | 'valuesHeading'
      | 'valuesSubtitle'
      | 'ctaTitle'
      | 'ctaSubtitle'
      | 'ctaPrimary'
      | 'ctaSecondary',
    locale: 'ar' | 'en',
    val: string
  ) => {
    onUpdateAboutStory({
      ...resolved,
      [key]: { ...resolved[key], [locale]: val },
    });
  };

  const updateValueItem = (idx: number, patch: Partial<AboutValueItemConfig>) => {
    const values = resolved.values.map((v, i) => (i === idx ? { ...v, ...patch } : v));
    onUpdateAboutStory({ ...resolved, values });
  };

  const updateValueBilingual = (
    idx: number,
    key: 'title' | 'desc',
    locale: 'ar' | 'en',
    val: string
  ) => {
    const values = resolved.values.map((v, i) =>
      i === idx ? { ...v, [key]: { ...v[key], [locale]: val } } : v
    );
    onUpdateAboutStory({ ...resolved, values });
  };

  const handleAddValue = () => {
    if (resolved.values.length >= 6) {
      onNotify(isAr ? 'الحد الأقصى 6 بطاقات قيم' : 'Maximum 6 value cards allowed');
      return;
    }
    const nextVal: AboutValueItemConfig = {
      id: `val-${Date.now()}`,
      icon: 'leaf',
      title: { ar: 'ميزة جديدة', en: 'New Core Value' },
      desc: { ar: 'وصف موجز للمبدأ الذي يميز متجركِ.', en: 'Brief description of this store principle.' },
    };
    onUpdateAboutStory({ ...resolved, values: [...resolved.values, nextVal] });
    onNotify(isAr ? 'تمت إضافة بطاقة قيمة جديدة' : 'Added new value pillar');
  };

  const handleDeleteValue = (idx: number) => {
    if (resolved.values.length <= 1) {
      onNotify(isAr ? 'يجب الإبقاء على قيمة واحدة على الأقل' : 'At least one value pillar is required');
      return;
    }
    onUpdateAboutStory({
      ...resolved,
      values: resolved.values.filter((_, i) => i !== idx),
    });
    onNotify(isAr ? 'تم حذف بطاقة القيمة' : 'Value pillar removed');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadStoreMedia(file, 'banners', lang, { maxDimension: 1200, quality: 0.84 });
      onUpdateAboutStory({ ...resolved, image: res.url });
      onNotify(isAr ? 'تم رفع صورة صفحة من نحن بنجاح' : 'About page hero photo uploaded');
    } catch (err) {
      const msg = err instanceof Error ? err.message : (isAr ? 'فشل رفع الصورة' : 'Upload failed');
      onNotify(msg);
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div id="corner-15" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-24 text-start">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoUpload}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-[#5A3E7A] text-white font-black text-xs flex items-center justify-center shrink-0 tabular-nums">
            15
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#5A3E7A]" />
              <span>{isAr ? 'الركن الخامس عشر: صفحة «من نحن» وقصة المتجر' : 'Corner 15: About Us & Brand Story Page'}</span>
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isAr
                ? 'تحكمي الكامل بقصة العلامة، الصورة التحريرية، الرسالة، الرؤية، بطاقات القيم الأربعة، ودعوة التسوّق.'
                : 'Edit your brand story, editorial photo, mission, vision, value pillars, and closing call-to-action.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-600" />
            <span>{isAr ? 'صفحة من نحن' : '/about Page'}</span>
          </span>
          <button
            type="button"
            onClick={() => {
              onResetAboutStory();
              onNotify(isAr ? 'تمت استعادة محتوى صفحة من نحن الافتراضي' : 'Restored default About page content');
            }}
            className="h-10 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isAr ? 'الافتراضي' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* Story Title, Body & Photo */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              {isAr ? 'عنوان القصة (عربي)' : 'Story Heading (AR)'}
            </label>
            <input
              type="text"
              value={resolved.title.ar}
              onChange={(e) => updateBilingual('title', 'ar', e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold leading-relaxed"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              {isAr ? 'عنوان القصة (إنجليزي)' : 'Story Heading (EN)'}
            </label>
            <input
              type="text"
              value={resolved.title.en}
              onChange={(e) => updateBilingual('title', 'en', e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              {isAr ? 'نص قصة العلامة (عربي)' : 'Brand Narrative (AR)'}
            </label>
            <textarea
              rows={3}
              value={resolved.body.ar}
              onChange={(e) => updateBilingual('body', 'ar', e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed resize-y"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              {isAr ? 'نص قصة العلامة (إنجليزي)' : 'Brand Narrative (EN)'}
            </label>
            <textarea
              rows={3}
              value={resolved.body.en}
              onChange={(e) => updateBilingual('body', 'en', e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed resize-y"
            />
          </div>
        </div>

        {/* Studio Photo */}
        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-2.5">
          <label className="block text-xs font-bold text-slate-800">
            {isAr ? 'الصورة الرئيسية في صفحة من نحن' : 'About Page Studio Photograph'}
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="h-11 px-4 rounded-xl bg-purple-100 hover:bg-purple-200 text-[#5A3E7A] text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-60"
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? (isAr ? 'جاري الرفع...' : 'Uploading...') : (isAr ? 'رفع صورة' : 'Upload Photo')}</span>
            </button>
            <input
              type="url"
              value={resolved.image}
              onChange={(e) => onUpdateAboutStory({ ...resolved, image: e.target.value })}
              placeholder="https://..."
              className="flex-1 h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
            />
            {resolved.image && (
              <img
                src={resolved.image}
                alt={resolved.title[lang]}
                className="w-16 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
              />
            )}
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
          <span className="text-xs font-black text-[#5A3E7A] block">
            {isAr ? 'بطاقة الرسالة (Mission)' : 'Mission Card'}
          </span>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={resolved.missionTitle.ar}
              onChange={(e) => updateBilingual('missionTitle', 'ar', e.target.value)}
              placeholder="رسالتنا"
              className="h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold"
            />
            <input
              type="text"
              value={resolved.missionTitle.en}
              onChange={(e) => updateBilingual('missionTitle', 'en', e.target.value)}
              placeholder="Our Mission"
              className="h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>
          <textarea
            rows={2}
            value={resolved.missionBody.ar}
            onChange={(e) => updateBilingual('missionBody', 'ar', e.target.value)}
            placeholder="نص الرسالة بالعربية"
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs leading-relaxed resize-y"
          />
          <textarea
            rows={2}
            value={resolved.missionBody.en}
            onChange={(e) => updateBilingual('missionBody', 'en', e.target.value)}
            placeholder="Mission body in English"
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs leading-relaxed resize-y"
          />
        </div>

        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
          <span className="text-xs font-black text-[#5A3E7A] block">
            {isAr ? 'بطاقة الرؤية (Vision)' : 'Vision Card'}
          </span>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={resolved.visionTitle.ar}
              onChange={(e) => updateBilingual('visionTitle', 'ar', e.target.value)}
              placeholder="رؤيتنا"
              className="h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold"
            />
            <input
              type="text"
              value={resolved.visionTitle.en}
              onChange={(e) => updateBilingual('visionTitle', 'en', e.target.value)}
              placeholder="Our Vision"
              className="h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>
          <textarea
            rows={2}
            value={resolved.visionBody.ar}
            onChange={(e) => updateBilingual('visionBody', 'ar', e.target.value)}
            placeholder="نص الرؤية بالعربية"
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs leading-relaxed resize-y"
          />
          <textarea
            rows={2}
            value={resolved.visionBody.en}
            onChange={(e) => updateBilingual('visionBody', 'en', e.target.value)}
            placeholder="Vision body in English"
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs leading-relaxed resize-y"
          />
        </div>
      </div>

      {/* Values Pillars */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-black text-slate-900 tabular-nums">
            {isAr ? `ركائز وقيم العلامة (${resolved.values.length})` : `Brand Values (${resolved.values.length})`}
          </h3>
          <button
            type="button"
            onClick={handleAddValue}
            className="h-11 px-4 rounded-xl bg-[#5A3E7A] hover:bg-[#483162] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة قيمة' : 'Add Value'}</span>
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/40 divide-y divide-slate-200/80 overflow-hidden">
          {resolved.values.map((val, idx) => (
            <div key={val.id || idx} className="p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#5A3E7A] tabular-nums">#{idx + 1}</span>
                  <select
                    value={val.icon}
                    onChange={(e) => updateValueItem(idx, { icon: e.target.value as AboutValueIconId })}
                    className="h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="leaf">{isAr ? 'أيقونة طبيعية' : 'Botanical Leaf'}</option>
                    <option value="shield">{isAr ? 'أيقونة ضمان' : 'Quality Shield'}</option>
                    <option value="award">{isAr ? 'أيقونة نتائج' : 'Results Award'}</option>
                    <option value="heart">{isAr ? 'أيقونة دعم' : 'Support Heart'}</option>
                  </select>
                </div>

                {resolved.values.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteValue(idx)}
                    className="h-9 px-2.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'حذف' : 'Delete'}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  value={val.title.ar}
                  onChange={(e) => updateValueBilingual(idx, 'title', 'ar', e.target.value)}
                  placeholder="عنوان القيمة (عربي)"
                  className="h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                />
                <input
                  type="text"
                  value={val.title.en}
                  onChange={(e) => updateValueBilingual(idx, 'title', 'en', e.target.value)}
                  placeholder="Value Title (EN)"
                  className="h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                />
                <input
                  type="text"
                  value={val.desc.ar}
                  onChange={(e) => updateValueBilingual(idx, 'desc', 'ar', e.target.value)}
                  placeholder="وصف القيمة (عربي)"
                  className="h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  value={val.desc.en}
                  onChange={(e) => updateValueBilingual(idx, 'desc', 'en', e.target.value)}
                  placeholder="Value Description (EN)"
                  className="h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {isAr ? 'عنوان بانر الختام (عربي / إنجليزي)' : 'Closing Banner Title (AR / EN)'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={resolved.ctaTitle.ar}
              onChange={(e) => updateBilingual('ctaTitle', 'ar', e.target.value)}
              className="h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
            <input
              type="text"
              value={resolved.ctaTitle.en}
              onChange={(e) => updateBilingual('ctaTitle', 'en', e.target.value)}
              className="h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {isAr ? 'وصف بانر الختام (عربي / إنجليزي)' : 'Closing Banner Subtitle (AR / EN)'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={resolved.ctaSubtitle.ar}
              onChange={(e) => updateBilingual('ctaSubtitle', 'ar', e.target.value)}
              className="h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
            <input
              type="text"
              value={resolved.ctaSubtitle.en}
              onChange={(e) => updateBilingual('ctaSubtitle', 'en', e.target.value)}
              className="h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
