import React from 'react';
import {
  Crown,
  Droplets,
  Image as ImageIcon,
  MapPin,
  ShoppingBag,
  SplitSquareVertical,
  Upload,
} from 'lucide-react';
import { PromoCampaignEditor } from '../admin/PromoCampaignEditor';
import { FieldResetBtn } from './FieldResetBtn';

interface CustomizerCatalogCornersProps {
  lang: 'ar' | 'en';
  activePreset: any;
  c6Info: { name: { ar: string; en: string }; desc: { ar: string; en: string } };
  c9Info: { name: { ar: string; en: string }; desc: { ar: string; en: string }; tag: { ar: string; en: string } };
  c10Info: { name: { ar: string; en: string }; desc: { ar: string; en: string } };
  skinDiagnosisCards: any[];
  trioBannersList: any[];
  updateField: (path: string, value: any) => void;
  updateSkinCard: (idx: number, field: string, val: any) => void;
  updateTrioBanner: (idx: number, field: string, val: any) => void;
  isFieldModified: (path: string) => boolean;
  resetFieldToDefault: (path: string, descAr: string, descEn: string) => void;
  showToast: (msg: string) => void;
  onNavigateToProducts?: () => void;
  onTriggerTrioUpload: (idx: number) => void;
  onTriggerBeforeUpload: () => void;
  onTriggerAfterUpload: () => void;
}

export const CustomizerCatalogCorners: React.FC<CustomizerCatalogCornersProps> = ({
  lang,
  activePreset,
  c6Info,
  c9Info,
  c10Info,
  skinDiagnosisCards,
  trioBannersList,
  updateField,
  updateSkinCard,
  updateTrioBanner,
  isFieldModified,
  resetFieldToDefault,
  showToast,
  onNavigateToProducts,
  onTriggerTrioUpload,
  onTriggerBeforeUpload,
  onTriggerAfterUpload,
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
      {/* CORNER 6: SMART SKIN ROUTINE DIAGNOSIS */}
      <div id="corner-6" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              6
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-purple-600" />
                <span>{lang === 'ar' ? `الركن السادس: ${c6Info.name.ar}` : `Corner 6: ${c6Info.name.en}`}</span>
              </h2>
              <p className="text-xs text-slate-500">{c6Info.desc[lang]}</p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl flex items-center gap-1.5 w-fit">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>{lang === 'ar' ? 'منتصف المتجر' : 'Mid-Storefront'}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skinDiagnosisCards.map((card, cIdx) => (
            <div key={card.id || cIdx} className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900">{card.title?.[lang] || card.title?.ar}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                  {card.id}
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 block">{lang === 'ar' ? 'رابط صورة الخطوة:' : 'Step Image URL:'}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={card.image || ''}
                    onChange={(e) => updateSkinCard(cIdx, 'image', e.target.value)}
                    placeholder="https://..."
                    className="flex-1 h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                  />
                  {card.image && (
                    <img src={card.image} alt="Step" className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block">{lang === 'ar' ? 'العنوان:' : 'Title:'}</label>
                  <input
                    type="text"
                    value={card.title?.ar || ''}
                    onChange={(e) => updateSkinCard(cIdx, 'title.ar', e.target.value)}
                    className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block">{lang === 'ar' ? 'المكوّن الفعّال:' : 'Ingredient:'}</label>
                  <input
                    type="text"
                    value={card.ingredient?.ar || ''}
                    onChange={(e) => updateSkinCard(cIdx, 'ingredient.ar', e.target.value)}
                    className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block">{lang === 'ar' ? 'الشارة الترويجية:' : 'Promo Badge:'}</label>
                <input
                  type="text"
                  value={card.badge?.ar || ''}
                  onChange={(e) => updateSkinCard(cIdx, 'badge.ar', e.target.value)}
                  className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CORNER 7: PRODUCTS CATALOG & PRICING */}
      <div id="corner-7" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              7
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-purple-600" />
                <span>{lang === 'ar' ? 'الركن السابع: كتالوج المنتجات والمخزون والأسعار' : 'Corner 7: Products Catalog & Pricing'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'ar' ? 'شبكة المنتجات الأساسية، الأسعار، شارات الخصم وحالة التوفر' : 'Main product grid, pricing, inventory stock, and scarcity alerts'}
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1.5 w-fit">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'ar' ? 'قلب المتجر الحي' : 'Storefront Center Grid'}</span>
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-emerald-50/40 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-start">
            <span className="text-xs font-black text-emerald-950 block">
              {lang === 'ar' ? 'إجمالي المنتجات المسجلة في المتجر:' : 'Total Registered Catalog Products:'}
            </span>
            <p className="text-sm font-bold text-emerald-700">
              {lang === 'ar'
                ? `يوجد ${activePreset.products?.length || 0} منتج مفعل بالكتالوج مع تحديث مباشر للمخزون.`
                : `${activePreset.products?.length || 0} products active in catalog with live inventory tracking.`}
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToProducts}
            className="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer shrink-0 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{lang === 'ar' ? 'فتح جدول المنتجات والأسعار المتقدم ↗' : 'Open Advanced Products Table ↗'}</span>
          </button>
        </div>
      </div>

      {/* CORNER 8: DUAL CAMPAIGN PROMO BANNERS */}
      <div id="corner-8" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              8
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-600" />
                <span>{lang === 'ar' ? 'الركن الثامن: بنرات الحملات الترويجية المزدوجة' : 'Corner 8: Dual Campaign Promo Banners'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'ar' ? 'الصندوقان الترويجيان المتجاوران لعروض التخفيضات وبكجات الهدايا' : 'Dual side-by-side promotional campaign visual banners'}
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl flex items-center gap-1.5 w-fit">
            <MapPin className="w-3.5 h-3.5 text-slate-600" />
            <span>{lang === 'ar' ? 'قسم العرض الخاص' : 'Special Offer Section'}</span>
          </span>
        </div>

        <PromoCampaignEditor
          lang={lang}
          promoBanner={activePreset.promoBanner}
          onUpdateField={updateField}
          onNotify={(message) => showToast(message)}
        />
      </div>

      {/* CORNER 9: HAIR DEVICES SPOTLIGHT & TRIO BANNERS */}
      <div id="corner-9" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              9
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>{lang === 'ar' ? `الركن التاسع: ${c9Info.name.ar}` : `Corner 9: ${c9Info.name.en}`}</span>
              </h2>
              <p className="text-xs text-slate-500">{c9Info.desc[lang]}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl flex items-center gap-1.5 w-fit">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>{c9Info.tag[lang]}</span>
            </span>
            {renderReset('trioBanners', 'بنرات الماركات الثلاثية', 'Brand Trio Banners')}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trioBannersList.map((banner, bIdx) => (
            <div key={banner.id || bIdx} className="bg-slate-50/70 p-5 rounded-3xl border border-slate-200/80 space-y-4">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${banner.bgGradient || 'from-purple-100 to-pink-100'} border border-slate-200/60 relative overflow-hidden min-h-[140px] flex flex-col justify-between`}>
                <div className="flex items-center justify-between z-10">
                  <span className="font-serif font-black tracking-widest text-slate-900 text-sm uppercase">
                    {banner.brand}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/5 text-slate-800 border border-black/10">
                    {lang === 'ar' ? 'معاينة حية' : 'Live Card'}
                  </span>
                </div>

                {banner.image && (
                  <div className="absolute inset-y-0 end-0 w-1/2 overflow-hidden opacity-95">
                    <img src={banner.image} alt={banner.brand} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="relative z-10 max-w-[65%] space-y-0.5 pt-4 text-start">
                  <h4 className="font-black text-xs text-slate-950 truncate">
                    {banner.title?.[lang] || banner.title?.ar}
                  </h4>
                  <p className="text-[10px] font-medium text-slate-700 truncate">
                    {banner.subtitle?.[lang] || banner.subtitle?.ar}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">{lang === 'ar' ? 'اسم الماركة:' : 'Brand Name:'}</label>
                  <input
                    type="text"
                    value={banner.brand || ''}
                    onChange={(e) => updateTrioBanner(bIdx, 'brand', e.target.value)}
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">{lang === 'ar' ? 'العنوان بالعربية:' : 'Title (AR):'}</label>
                  <input
                    type="text"
                    value={banner.title?.ar || ''}
                    onChange={(e) => updateTrioBanner(bIdx, 'title.ar', e.target.value)}
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">{lang === 'ar' ? 'العنوان الفرعي بالعربية:' : 'Subtitle (AR):'}</label>
                  <input
                    type="text"
                    value={banner.subtitle?.ar || ''}
                    onChange={(e) => updateTrioBanner(bIdx, 'subtitle.ar', e.target.value)}
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">{lang === 'ar' ? 'صورة الماركة:' : 'Image URL / Upload:'}</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onTriggerTrioUpload(bIdx)}
                      className="h-9 px-3 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'رفع' : 'Upload'}</span>
                    </button>
                    <input
                      type="url"
                      value={banner.image || ''}
                      onChange={(e) => updateTrioBanner(bIdx, 'image', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 h-9 px-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CORNER 10: BEFORE & AFTER VISUAL PROOF */}
      <div id="corner-10" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
              10
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <SplitSquareVertical className="w-4 h-4 text-purple-600" />
                <span>{lang === 'ar' ? `الركن العاشر: ${c10Info.name.ar}` : `Corner 10: ${c10Info.name.en}`}</span>
              </h2>
              <p className="text-xs text-slate-500">{c10Info.desc[lang]}</p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl flex items-center gap-1.5 w-fit">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>{lang === 'ar' ? 'سلايدر النتائج الحقيقية' : 'Real Results Section'}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 block">{lang === 'ar' ? 'صورة (قبل - Before):' : 'Before Photo:'}</span>
              {renderReset('beforeAfterMedia.beforeImage', 'صورة قبل', 'Before Photo')}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onTriggerBeforeUpload}
                className="h-10 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'رفع' : 'Upload'}</span>
              </button>
              <input
                type="url"
                value={activePreset.beforeAfterMedia?.beforeImage || ''}
                onChange={(e) => updateField('beforeAfterMedia.beforeImage', e.target.value)}
                placeholder="https://..."
                className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
              />
              {activePreset.beforeAfterMedia?.beforeImage && (
                <img src={activePreset.beforeAfterMedia.beforeImage} alt="Before" className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 block">{lang === 'ar' ? 'صورة (بعد - After):' : 'After Photo:'}</span>
              {renderReset('beforeAfterMedia.afterImage', 'صورة بعد', 'After Photo')}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onTriggerAfterUpload}
                className="h-10 px-3 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'رفع' : 'Upload'}</span>
              </button>
              <input
                type="url"
                value={activePreset.beforeAfterMedia?.afterImage || ''}
                onChange={(e) => updateField('beforeAfterMedia.afterImage', e.target.value)}
                placeholder="https://..."
                className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
              />
              {activePreset.beforeAfterMedia?.afterImage && (
                <img src={activePreset.beforeAfterMedia.afterImage} alt="After" className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
