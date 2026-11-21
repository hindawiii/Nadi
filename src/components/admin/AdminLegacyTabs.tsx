import React, { useRef, useState } from 'react';
import {
  BadgeCheck,
  Crown,
  Droplets,
  Layers,
  MapPin,
  Plus,
  Sliders,
  Trash2,
  Upload,
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { siteConfig } from '../../data/siteConfig';
import { uploadStoreMedia, MediaFolder } from '../../services/storageService';
import { FieldResetBtn } from '../customizer/FieldResetBtn';

export type LegacyAdminTabKey = 'content' | 'devices' | 'banners' | 'branding';

interface AdminLegacyTabsProps {
  tab: LegacyAdminTabKey;
}

/**
 * Modular container for legacy secondary admin editors ('content', 'devices', 'banners', 'branding').
 * Preserved for backward compatibility alongside UnifiedStoreCustomizer.
 */
export const AdminLegacyTabs: React.FC<AdminLegacyTabsProps> = ({ tab }) => {
  const {
    lang,
    dynamicConfig,
    setDynamicConfig,
    activePresetId,
    showToast,
    resetFieldToDefault,
    isFieldModified,
    recordHistorySnapshot,
  } = useCommerce();

  const activePreset = dynamicConfig.presets[activePresetId];
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const trioBannerFileInputRef = useRef<HTMLInputElement>(null);
  const promo1FileInputRef = useRef<HTMLInputElement>(null);
  const promo2FileInputRef = useRef<HTMLInputElement>(null);
  const beforeImgFileInputRef = useRef<HTMLInputElement>(null);
  const afterImgFileInputRef = useRef<HTMLInputElement>(null);
  const [activeTrioBannerIdx, setActiveTrioBannerIdx] = useState<number | null>(null);

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

  const updateField = (path: string, value: any) => {
    recordHistorySnapshot(`تعديل ${path}`, `Edit ${path}`, path);
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let cur = clone.presets[activePresetId];
      for (let i = 0; i < parts.length - 1; i++) {
        if (!cur[parts[i]]) cur[parts[i]] = {};
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
      try {
        localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
      } catch {
        // Best-effort cache
      }
      return clone;
    });
  };

  const uploadAsset = async (file: File, folder: MediaFolder): Promise<string> => {
    const options =
      folder === 'branding' ? { maxDimension: 600, quality: 0.85 } : { maxDimension: 1200, quality: 0.82 };
    const result = await uploadStoreMedia(file, folder, lang, options);
    return result.url;
  };

  const handleFieldUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    folder: MediaFolder,
    fieldPath: string,
    msgAr: string,
    msgEn: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const uploadedUrl = await uploadAsset(file, folder);
      updateField(fieldPath, uploadedUrl);
      showToast(lang === 'ar' ? msgAr : msgEn);
    } catch (err: any) {
      showToast(err?.message || (lang === 'ar' ? 'تعذر رفع ملف الصورة' : 'Error uploading image'));
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const updateTrioBanner = (index: number, field: string, value: any) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      if (!clone.presets[activePresetId].trioBanners) {
        clone.presets[activePresetId].trioBanners = JSON.parse(
          JSON.stringify(siteConfig.presets.cosmetics.trioBanners || [])
        );
      }
      const banner = clone.presets[activePresetId].trioBanners[index];
      if (banner) {
        if (field.includes('.')) {
          const [f, sub] = field.split('.');
          if (!banner[f]) banner[f] = {};
          banner[f][sub] = value;
        } else {
          banner[field] = value;
        }
      }
      try {
        localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
      } catch {
        // Best-effort cache
      }
      return clone;
    });
  };

  const updateSkinDiagnosisCard = (cardId: string, field: string, value: any) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      if (!clone.presets[activePresetId].skinDiagnosisCards) {
        clone.presets[activePresetId].skinDiagnosisCards = JSON.parse(
          JSON.stringify(siteConfig.presets.cosmetics.skinDiagnosisCards || [])
        );
      }
      const card = clone.presets[activePresetId].skinDiagnosisCards.find((c: any) => c.id === cardId);
      if (card) {
        if (field.includes('.')) {
          const [f, sub] = field.split('.');
          if (!card[f]) card[f] = {};
          card[f][sub] = value;
        } else {
          card[field] = value;
        }
      }
      try {
        localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
      } catch {
        // Best-effort cache
      }
      return clone;
    });
  };

  const updateTestimonialItem = (testId: number | string, field: string, value: any) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      if (!clone.presets[activePresetId].testimonials) {
        clone.presets[activePresetId].testimonials = JSON.parse(
          JSON.stringify(siteConfig.presets.cosmetics.testimonials || [])
        );
      }
      const item = clone.presets[activePresetId].testimonials.find((t: any) => String(t.id) === String(testId));
      if (item) {
        if (field.includes('.')) {
          const [f, sub] = field.split('.');
          if (!item[f]) item[f] = {};
          item[f][sub] = value;
        } else {
          item[field] = value;
        }
      }
      try {
        localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
      } catch {
        // Best-effort cache
      }
      return clone;
    });
  };

  const trioBannersList =
    activePreset.trioBanners && activePreset.trioBanners.length > 0
      ? activePreset.trioBanners
      : siteConfig.presets.cosmetics.trioBanners || [];

  return (
    <>
      <input
        type="file"
        ref={logoFileInputRef}
        onChange={(e) => handleFieldUpload(e, 'branding', 'storeLogo', 'تم رفع شعار المتجر بنجاح!', 'Store logo uploaded!')}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={heroFileInputRef}
        onChange={(e) => handleFieldUpload(e, 'hero', 'heroImage', 'تم رفع صورة الهيرو بنجاح!', 'Hero image uploaded!')}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={promo1FileInputRef}
        onChange={(e) => handleFieldUpload(e, 'banners', 'promoBanner.image1', 'تم تحديث صورة البوكس الأولى!', 'Promo image 1 updated!')}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={promo2FileInputRef}
        onChange={(e) => handleFieldUpload(e, 'banners', 'promoBanner.image2', 'تم تحديث صورة البوكس الثانية!', 'Promo image 2 updated!')}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={beforeImgFileInputRef}
        onChange={(e) => handleFieldUpload(e, 'banners', 'beforeAfterMedia.beforeImage', 'تم تحديث صورة (قبل)!', 'Before image updated!')}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={afterImgFileInputRef}
        onChange={(e) => handleFieldUpload(e, 'banners', 'beforeAfterMedia.afterImage', 'تم تحديث صورة (بعد)!', 'After image updated!')}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={trioBannerFileInputRef}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file || activeTrioBannerIdx === null) return;
          try {
            const uploadedUrl = await uploadAsset(file, 'banners');
            updateTrioBanner(activeTrioBannerIdx, 'image', uploadedUrl);
            showToast(lang === 'ar' ? 'تم تحديث صورة كرت التشكيلة بنجاح!' : 'Brand banner image updated!');
          } catch (err: any) {
            showToast(err?.message || (lang === 'ar' ? 'تعذر رفع ملف الصورة' : 'Error uploading image'));
          } finally {
            setActiveTrioBannerIdx(null);
            if (e.target) e.target.value = '';
          }
        }}
        accept="image/*"
        className="hidden"
      />

      {tab === 'content' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {lang === 'ar' ? 'تعديل نصوص المتجر والشريطين المتحركين' : 'Store Texts & Animated Tickers'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'ar'
                ? 'يمكنك هنا تغيير نصوص الشريط العلوي المتحرك، نصوص الشريط اللانهائي للبراند، ونصوص واجهة الهيرو والبنرات الترويجية.'
                : 'Customize top announcement ticker slides, brand infinite marquee, hero texts, and campaign banner.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[#5A3E7A]">
                <Sliders className="w-5 h-5" />
                <h3 className="font-extrabold text-sm sm:text-base">
                  {lang === 'ar' ? '1. شرائح الشريط الإعلاني العلوي المتحرك' : '1. Top Announcement Ticker Slides'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  const currentSlides = activePreset.announcementSlides || [];
                  updateField('announcementSlides', [...currentSlides, { ar: 'نص إعلاني جديد هنا', en: 'New announcement text here' }]);
                  showToast(lang === 'ar' ? 'تمت إضافة شريحة إعلانية جديدة' : 'Slide added');
                }}
                className="px-3 py-1.5 rounded-xl bg-[#5A3E7A] text-white text-xs font-bold hover:bg-[#483162] flex items-center gap-1 cursor-pointer w-fit"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'إضافة شريحة' : 'Add Slide'}</span>
              </button>
            </div>
            <div className="space-y-3">
              {(activePreset.announcementSlides || []).map((slide, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border border-purple-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-900">
                      {lang === 'ar' ? `الشريحة الإعلانية (${idx + 1}):` : `Slide (${idx + 1}):`}
                    </span>
                    {(activePreset.announcementSlides || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const currentSlides = [...(activePreset.announcementSlides || [])];
                          currentSlides.splice(idx, 1);
                          updateField('announcementSlides', currentSlides);
                        }}
                        className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'حذف' : 'Delete'}</span>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={slide.ar}
                      onChange={(e) => {
                        const next = [...(activePreset.announcementSlides || [])];
                        next[idx] = { ...next[idx], ar: e.target.value };
                        updateField('announcementSlides', next);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />
                    <input
                      type="text"
                      value={slide.en}
                      onChange={(e) => {
                        const next = [...(activePreset.announcementSlides || [])];
                        next[idx] = { ...next[idx], en: e.target.value };
                        updateField('announcementSlides', next);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              {lang === 'ar' ? '2. واجهة الهيرو الرئيسية (Hero Section)' : '2. Main Hero Section'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-500 block">{lang === 'ar' ? 'العنوان (AR):' : 'Hero Title (AR):'}</label>
                  {renderReset('heroTitle.ar', 'عنوان الهيرو بالعربية', 'Hero Title (AR)')}
                </div>
                <input
                  type="text"
                  value={activePreset.heroTitle?.ar || ''}
                  onChange={(e) => updateField('heroTitle.ar', e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-500 block">{lang === 'ar' ? 'العنوان (EN):' : 'Hero Title (EN):'}</label>
                  {renderReset('heroTitle.en', 'عنوان الهيرو بالإنجليزية', 'Hero Title (EN)')}
                </div>
                <input
                  type="text"
                  value={activePreset.heroTitle?.en || ''}
                  onChange={(e) => updateField('heroTitle.en', e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>
              <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => heroFileInputRef.current?.click()}
                  className="w-full sm:w-auto px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'رفع صورة من جهازك' : 'Upload File'}</span>
                </button>
                <input
                  type="url"
                  value={activePreset.heroImage || ''}
                  onChange={(e) => updateField('heroImage', e.target.value)}
                  placeholder="https://..."
                  className="flex-1 w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'devices' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-5">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" />
              <span>{lang === 'ar' ? 'تشكيلات وماركات أجهزة الشعر (Trio Banners)' : 'Brand Collections & Device Trio'}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trioBannersList.map((banner, bIdx) => (
              <div key={banner.id || bIdx} className="bg-slate-50/70 p-5 rounded-3xl border border-slate-200/80 space-y-3 text-xs">
                <input
                  type="text"
                  value={banner.brand}
                  onChange={(e) => updateTrioBanner(bIdx, 'brand', e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900"
                />
                <input
                  type="text"
                  value={banner.title?.ar || ''}
                  onChange={(e) => updateTrioBanner(bIdx, 'title.ar', e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTrioBannerIdx(bIdx);
                      trioBannerFileInputRef.current?.click();
                    }}
                    className="h-10 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'رفع' : 'Upload'}</span>
                  </button>
                  <input
                    type="url"
                    value={banner.image || ''}
                    onChange={(e) => updateTrioBanner(bIdx, 'image', e.target.value)}
                    className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'banners' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <Crown className="w-5 h-5 text-rose-500" />
            <span>{lang === 'ar' ? 'البنرات الترويجية والوسائط البصرية' : 'Campaign Banners & Visual Proof'}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-purple-800 block">{lang === 'ar' ? 'الصورة الأولى (بوكس 1)' : 'Promo Box 1'}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => promo1FileInputRef.current?.click()}
                  className="h-10 px-3 rounded-xl bg-white border border-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'رفع' : 'Upload'}</span>
                </button>
                <input
                  type="url"
                  value={activePreset.promoBanner?.image1 || ''}
                  onChange={(e) => updateField('promoBanner.image1', e.target.value)}
                  className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-rose-800 block">{lang === 'ar' ? 'الصورة الثانية (بوكس 2)' : 'Promo Box 2'}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => promo2FileInputRef.current?.click()}
                  className="h-10 px-3 rounded-xl bg-white border border-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'رفع' : 'Upload'}</span>
                </button>
                <input
                  type="url"
                  value={activePreset.promoBanner?.image2 || ''}
                  onChange={(e) => updateField('promoBanner.image2', e.target.value)}
                  className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">{lang === 'ar' ? 'صورة (قبل):' : 'Before Photo:'}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => beforeImgFileInputRef.current?.click()}
                  className="h-10 px-3 rounded-xl bg-white border border-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'رفع' : 'Upload'}</span>
                </button>
                <input
                  type="url"
                  value={activePreset.beforeAfterMedia?.beforeImage || ''}
                  onChange={(e) => updateField('beforeAfterMedia.beforeImage', e.target.value)}
                  className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">{lang === 'ar' ? 'صورة (بعد):' : 'After Photo:'}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => afterImgFileInputRef.current?.click()}
                  className="h-10 px-3 rounded-xl bg-white border border-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'رفع' : 'Upload'}</span>
                </button>
                <input
                  type="url"
                  value={activePreset.beforeAfterMedia?.afterImage || ''}
                  onChange={(e) => updateField('beforeAfterMedia.afterImage', e.target.value)}
                  className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50/40 rounded-2xl border border-blue-100 space-y-3">
            <h3 className="text-sm font-black text-blue-950 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-600" />
              <span>{lang === 'ar' ? 'كروت تشخيص روتين البشرة' : 'Skin Diagnosis Cards'}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(activePreset.skinDiagnosisCards || siteConfig.presets.cosmetics.skinDiagnosisCards || []).map((card) => (
                <div key={card.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-900 block">{card.title[lang] || card.title.ar}</span>
                  <input
                    type="text"
                    value={card.image || ''}
                    onChange={(e) => updateSkinDiagnosisCard(card.id, 'image', e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-amber-50/30 rounded-2xl border border-amber-100 space-y-3">
            <h3 className="text-sm font-black text-amber-950 flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-amber-500" />
              <span>{lang === 'ar' ? 'شهادات العميلات' : 'Customer Testimonials'}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(activePreset.testimonials || siteConfig.presets.cosmetics.testimonials || []).map((t) => (
                <div key={t.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <input
                    type="text"
                    value={t.name.ar}
                    onChange={(e) => updateTestimonialItem(t.id, 'name.ar', e.target.value)}
                    className="w-full h-8 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                  <textarea
                    rows={2}
                    value={t.comment.ar}
                    onChange={(e) => updateTestimonialItem(t.id, 'comment.ar', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'branding' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              <span>{lang === 'ar' ? 'إعدادات هوية المتجر وبيانات التذييل (Footer)' : 'Brand Identity & Footer Information'}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-600">{lang === 'ar' ? 'اسم المتجر بالعربية:' : 'Store Name (AR):'}</label>
                {renderReset('storeName.ar', 'اسم المتجر بالعربية', 'Store Name (AR)')}
              </div>
              <input
                type="text"
                value={activePreset.storeName.ar}
                onChange={(e) => updateField('storeName.ar', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-600">{lang === 'ar' ? 'اسم المتجر بالإنجليزية:' : 'Store Name (EN):'}</label>
                {renderReset('storeName.en', 'اسم المتجر بالإنجليزية', 'Store Name (EN)')}
              </div>
              <input
                type="text"
                value={activePreset.storeName.en}
                onChange={(e) => updateField('storeName.en', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <button
              type="button"
              onClick={() => logoFileInputRef.current?.click()}
              className="w-full sm:w-auto px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'رفع الشعار من جهازك' : 'Upload Logo File'}</span>
            </button>
            <input
              type="url"
              value={activePreset.storeLogo || ''}
              onChange={(e) => updateField('storeLogo', e.target.value)}
              placeholder="https://..."
              className="flex-1 w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                {lang === 'ar' ? 'رقم الواتساب الرسمي:' : 'WhatsApp Number:'}
              </label>
              <input
                type="text"
                value={activePreset.contactInfo.whatsapp}
                onChange={(e) => updateField('contactInfo.whatsapp', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                {lang === 'ar' ? 'رقم الهاتف المباشر:' : 'Direct Phone:'}
              </label>
              <input
                type="text"
                value={activePreset.contactInfo.phone}
                onChange={(e) => updateField('contactInfo.phone', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                {lang === 'ar' ? 'البريد الإلكتروني:' : 'Customer Email:'}
              </label>
              <input
                type="email"
                value={activePreset.contactInfo.email}
                onChange={(e) => updateField('contactInfo.email', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                {lang === 'ar' ? 'عنوان المتجر:' : 'Store Address:'}
              </label>
              <input
                type="text"
                value={activePreset.contactInfo.address.ar}
                onChange={(e) => updateField('contactInfo.address.ar', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
