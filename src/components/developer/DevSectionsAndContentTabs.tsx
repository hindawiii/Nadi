import React from 'react';
import {
  BadgeCheck,
  Copy,
  Crown,
  Eye,
  EyeOff,
  Layers,
  Mail,
  MapPin,
  MessageCircle,
  Palette,
  Phone,
  RotateCcw,
  Sliders,
  Trash2,
} from 'lucide-react';
import { SectionVisibilityMap, useCommerce } from '../../context/CommerceContext';
import { siteConfig } from '../../data/siteConfig';
import { devSectionsList } from './devMeta';

export const DevSectionsTab: React.FC = () => {
  const {
    lang,
    sectionsControl,
    toggleSection,
    resetSections,
    clonedSections,
    toggleCloneSection,
    updateClonedSectionConfig,
    showToast,
  } = useCommerce();

  const handleToggleClone = (key: string, title: string) => {
    toggleCloneSection(key, title);
  };

  const handleDeleteSection = (key: keyof SectionVisibilityMap, title: string) => {
    if (sectionsControl[key]) {
      toggleSection(key);
    }
    showToast(lang === 'ar' ? `تم حذف / إخفاء قسم: ${title}` : `Deleted / Hidden section: ${title}`);
  };

  const handleShowAllSections = () => {
    devSectionsList.forEach((s) => {
      if (!sectionsControl[s.key]) {
        toggleSection(s.key);
      }
    });
    showToast(lang === 'ar' ? 'تم تفعيل وإظهار كافة الأقسام بنجاح' : 'All sections enabled successfully');
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <span>{lang === 'ar' ? 'إدارة أقسام وبنرات المتجر (Full Section Control)' : 'Storefront Sections & Banners Manager'}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {lang === 'ar'
              ? 'يمكنك إظهار أو إخفاء، استنساخ، أو حذف أي قسم أو بنر من المتجر فورياً بضغطة زر واحدة دون لمس الكود.'
              : 'Toggle visibility, clone, or remove any storefront section instantly without editing code.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleShowAllSections}
            className="px-4 py-2 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إظهار كافة الأقسام' : 'Show All'}</span>
          </button>
          <button
            type="button"
            onClick={resetSections}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'استعادة الضبط الافتراضي' : 'Reset Defaults'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devSectionsList.map((sec) => {
          const isVisible = sectionsControl[sec.key];
          const cloneConfig = clonedSections[sec.key];
          const isCloned = !!cloneConfig?.isCloned;
          const Icon = sec.icon;

          return (
            <div
              key={sec.key}
              className={`rounded-3xl border-2 transition-all flex flex-col justify-between overflow-hidden ${
                isVisible
                  ? 'bg-slate-900 border-slate-700/80 shadow-xl'
                  : 'bg-slate-900/50 border-slate-800/80 opacity-70'
              }`}
            >
              {/* Visual Preview Image Header with Location Hint Badge */}
              <div className="relative h-32 w-full overflow-hidden bg-slate-950 group">
                <img
                  src={sec.previewImage}
                  alt={sec.title[lang]}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-75 group-hover:opacity-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

                <div className="absolute top-2.5 start-2.5 px-2.5 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-[11px] font-black text-amber-300 flex items-center gap-1.5 shadow-lg">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate max-w-[210px]">{sec.locationHint[lang]}</span>
                </div>

                <div className="absolute top-2.5 end-2.5">
                  <span
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-black backdrop-blur-md shadow-md ${
                      isVisible
                        ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-600/80'
                        : 'bg-rose-950/90 text-rose-400 border border-rose-600/80'
                    }`}
                  >
                    {isVisible ? (lang === 'ar' ? 'معروض بالمتجر ✓' : 'ACTIVE') : (lang === 'ar' ? 'مخفي ✕' : 'HIDDEN')}
                  </span>
                </div>

                <div className="absolute bottom-2.5 start-2.5 flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shadow-md ${
                      isVisible ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded-lg border border-slate-800 backdrop-blur-xs">
                    {sec.key}
                  </span>
                </div>
              </div>

              {/* Section Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-sm font-extrabold text-white">{sec.title[lang]}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{sec.desc[lang]}</p>

                  {isCloned && (
                    <div className="p-2.5 bg-purple-950/70 border border-purple-700/60 rounded-xl text-[11px] text-purple-200 font-bold flex items-center justify-between gap-2 shadow-inner">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-purple-400" />
                        <span>{lang === 'ar' ? 'مفعل بنسخة مستنسخة إضافية مخصصة' : 'Custom duplicate instance active'}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-800 text-purple-100 font-extrabold">
                        {cloneConfig?.badgeAr || 'نسخة إضافية'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Controls Bar */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSection(sec.key)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isVisible
                        ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-md'
                    }`}
                  >
                    {isVisible ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'إخفاء القسم' : 'Hide'}</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'إظهار القسم' : 'Show'}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleClone(sec.key, sec.title[lang])}
                    title={lang === 'ar' ? 'استنساخ هذا القسم وتخصيصه' : 'Clone and customize section'}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                      isCloned
                        ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-500 shadow-md'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isCloned ? (lang === 'ar' ? 'مستنسخ ✓' : 'Cloned') : (lang === 'ar' ? 'استنساخ' : 'Clone')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteSection(sec.key, sec.title[lang])}
                    title={lang === 'ar' ? 'حذف القسم من المتجر' : 'Remove section'}
                    className="p-2.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white border border-rose-800/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Interactive Section Clone Customizer Suite */}
                {isCloned && (
                  <div className="mt-3 p-3.5 bg-slate-950/90 border border-purple-500/40 rounded-2xl space-y-3 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between pb-1.5 border-b border-purple-900/50">
                      <span className="text-[11px] font-black text-purple-300 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-purple-400" />
                        <span>{lang === 'ar' ? 'تخصيص نصوص وعناوين النسخة المستنسخة' : 'Customize Cloned Copy Content'}</span>
                      </span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-900/80 text-purple-200 border border-purple-600 font-mono">
                        2nd Instance
                      </span>
                    </div>

                    <div className="space-y-2 text-[11px]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">
                            {lang === 'ar' ? 'العنوان الجديد للنسخة (عربي):' : 'Custom Title (Arabic):'}
                          </label>
                          <input
                            type="text"
                            value={cloneConfig?.titleAr || ''}
                            onChange={(e) => updateClonedSectionConfig(sec.key, { titleAr: e.target.value })}
                            placeholder={sec.title.ar}
                            className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-purple-400"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">
                            {lang === 'ar' ? 'العنوان الجديد (إنجليزي):' : 'Custom Title (English):'}
                          </label>
                          <input
                            type="text"
                            value={cloneConfig?.titleEn || ''}
                            onChange={(e) => updateClonedSectionConfig(sec.key, { titleEn: e.target.value })}
                            placeholder={sec.title.en}
                            className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-purple-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">
                          {lang === 'ar' ? 'الوصف والنصوص الترويجية المخصصة:' : 'Custom Description / Slogan:'}
                        </label>
                        <input
                          type="text"
                          value={lang === 'ar' ? cloneConfig?.subtitleAr || '' : cloneConfig?.subtitleEn || ''}
                          onChange={(e) =>
                            updateClonedSectionConfig(
                              sec.key,
                              lang === 'ar' ? { subtitleAr: e.target.value } : { subtitleEn: e.target.value }
                            )
                          }
                          placeholder={lang === 'ar' ? 'مثال: تشكيلة خاصة إضافية للعناية الفائقة' : 'Custom promotional highlight'}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-400"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">
                          {lang === 'ar' ? 'شارة التمييز (Badge):' : 'Badge Tag:'}
                        </label>
                        <input
                          type="text"
                          value={cloneConfig?.badgeAr || ''}
                          onChange={(e) =>
                            updateClonedSectionConfig(sec.key, { badgeAr: e.target.value, badgeEn: e.target.value })
                          }
                          placeholder="عرض حصري"
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-400"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const DevContentTab: React.FC = () => {
  const {
    lang,
    activePresetId,
    dynamicConfig,
    setDynamicConfig,
    recordHistorySnapshot,
    resetFieldToDefault,
    isFieldModified,
  } = useCommerce();

  const fallbackPreset = siteConfig.presets[activePresetId] || siteConfig.presets.cosmetics;
  const currentPresetData = dynamicConfig?.presets?.[activePresetId] || fallbackPreset;

  const FieldResetBtn: React.FC<{ path: string; descAr: string; descEn: string }> = ({ path, descAr, descEn }) => {
    const modified = isFieldModified(path);
    return (
      <button
        type="button"
        onClick={() => resetFieldToDefault(path, descAr, descEn)}
        title={lang === 'ar' ? `استعادة القيمة الافتراضية لـ (${descAr})` : `Reset (${descEn}) to factory default`}
        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
          modified
            ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 shadow-xs'
            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 border border-transparent'
        }`}
      >
        <RotateCcw className="w-3 h-3" />
        <span>{lang === 'ar' ? (modified ? 'استعادة الافتراضي ↺' : 'افتراضي') : (modified ? 'Reset ↺' : 'Default')}</span>
      </button>
    );
  };

  const handleUpdateText = (field: string, subfield: string, val: string) => {
    recordHistorySnapshot(`تعديل ${field}.${subfield}`, `Edit ${field}.${subfield}`, `${field}.${subfield}`);
    setDynamicConfig((prev) => {
      try {
        const clone = JSON.parse(JSON.stringify(prev || siteConfig));
        if (!clone.presets) clone.presets = JSON.parse(JSON.stringify(siteConfig.presets));
        if (!clone.presets[activePresetId]) {
          clone.presets[activePresetId] = JSON.parse(
            JSON.stringify(siteConfig.presets[activePresetId] || siteConfig.presets.cosmetics)
          );
        }
        if (!clone.presets[activePresetId][field]) clone.presets[activePresetId][field] = {};
        clone.presets[activePresetId][field][subfield] = val;
        return clone;
      } catch {
        return prev;
      }
    });
  };

  const handleUpdateDirect = (field: string, val: string) => {
    recordHistorySnapshot(`تعديل ${field}`, `Edit ${field}`, field);
    setDynamicConfig((prev) => {
      try {
        const clone = JSON.parse(JSON.stringify(prev || siteConfig));
        if (!clone.presets) clone.presets = JSON.parse(JSON.stringify(siteConfig.presets));
        if (!clone.presets[activePresetId]) {
          clone.presets[activePresetId] = JSON.parse(
            JSON.stringify(siteConfig.presets[activePresetId] || siteConfig.presets.cosmetics)
          );
        }
        clone.presets[activePresetId][field] = val;
        return clone;
      } catch {
        return prev;
      }
    });
  };

  const handleUpdateContact = (field: string, val: string) => {
    recordHistorySnapshot(`تعديل بيانات التواصل (${field})`, `Edit contact (${field})`, `contactInfo.${field}`);
    setDynamicConfig((prev) => {
      try {
        const clone = JSON.parse(JSON.stringify(prev || siteConfig));
        if (!clone.presets) clone.presets = JSON.parse(JSON.stringify(siteConfig.presets));
        if (!clone.presets[activePresetId]) {
          clone.presets[activePresetId] = JSON.parse(
            JSON.stringify(siteConfig.presets[activePresetId] || siteConfig.presets.cosmetics)
          );
        }
        if (!clone.presets[activePresetId].contactInfo) {
          clone.presets[activePresetId].contactInfo = {
            address: { ar: 'المقر الرئيسي', en: 'Headquarters' },
            phone: '',
            email: '',
            whatsapp: '',
          };
        }
        clone.presets[activePresetId].contactInfo[field] = val;
        return clone;
      } catch {
        return prev;
      }
    });
  };

  const handleUpdateLogo = (val: string) => {
    recordHistorySnapshot('تعديل شعار المتجر', 'Edit store logo', 'storeLogo');
    setDynamicConfig((prev) => {
      try {
        const clone = JSON.parse(JSON.stringify(prev || siteConfig));
        if (!clone.presets) clone.presets = JSON.parse(JSON.stringify(siteConfig.presets));
        if (!clone.presets[activePresetId]) {
          clone.presets[activePresetId] = JSON.parse(
            JSON.stringify(siteConfig.presets[activePresetId] || siteConfig.presets.cosmetics)
          );
        }
        clone.presets[activePresetId].storeLogo = val;
        return clone;
      } catch {
        return prev;
      }
    });
  };

  const handleUpdateSkinDiagnosis = (cardId: string, field: string, val: string, subfield?: string) => {
    recordHistorySnapshot(
      `تعديل بطاقة تشخيص البشرة (${cardId})`,
      `Edit skin diagnosis (${cardId})`,
      'skinDiagnosisCards'
    );
    setDynamicConfig((prev) => {
      try {
        const clone = JSON.parse(JSON.stringify(prev || siteConfig));
        if (!clone.presets) clone.presets = JSON.parse(JSON.stringify(siteConfig.presets));
        if (!clone.presets[activePresetId]) {
          clone.presets[activePresetId] = JSON.parse(
            JSON.stringify(siteConfig.presets[activePresetId] || siteConfig.presets.cosmetics)
          );
        }
        if (!clone.presets[activePresetId].skinDiagnosisCards) {
          clone.presets[activePresetId].skinDiagnosisCards = JSON.parse(
            JSON.stringify(siteConfig.presets.cosmetics.skinDiagnosisCards || [])
          );
        }
        const card = clone.presets[activePresetId].skinDiagnosisCards.find((c: { id: string }) => c.id === cardId);
        if (card) {
          if (subfield) {
            if (!card[field]) card[field] = {};
            card[field][subfield] = val;
          } else {
            card[field] = val;
          }
        }
        return clone;
      } catch {
        return prev;
      }
    });
  };

  const handleUpdateTestimonial = (testId: number, field: string, val: string, subfield?: string) => {
    recordHistorySnapshot(`تعديل شهادة عميلة (${testId})`, `Edit testimonial (${testId})`, 'testimonials');
    setDynamicConfig((prev) => {
      try {
        const clone = JSON.parse(JSON.stringify(prev || siteConfig));
        if (!clone.presets) clone.presets = JSON.parse(JSON.stringify(siteConfig.presets));
        if (!clone.presets[activePresetId]) {
          clone.presets[activePresetId] = JSON.parse(
            JSON.stringify(siteConfig.presets[activePresetId] || siteConfig.presets.cosmetics)
          );
        }
        if (!clone.presets[activePresetId].testimonials) {
          clone.presets[activePresetId].testimonials = JSON.parse(
            JSON.stringify(siteConfig.presets.cosmetics.testimonials || [])
          );
        }
        const t = clone.presets[activePresetId].testimonials.find((item: { id: number }) => item.id === testId);
        if (t) {
          if (subfield) {
            if (!t[field]) t[field] = {};
            t[field][subfield] = val;
          } else {
            t[field] = val;
          }
        }
        return clone;
      } catch {
        return prev;
      }
    });
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-8">
      <div>
        <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-amber-400" />
          <span>{lang === 'ar' ? 'محرر النصوص والعناوين والصور الحي (Live CMS Engine)' : 'Live Storefront CMS & Content Engine'}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {lang === 'ar'
            ? 'تحكم كامل بنصوص البنرات، العناوين، الشعارات، الصور، وروابط الاتصال. أي تعديل ينعكس فورياً في الواجهة.'
            : 'Full control over titles, slogans, images, and contact channels. All changes reflect instantly.'}
        </p>
      </div>

      {/* Section 1: Brand & Logo */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">
          {lang === 'ar' ? '١. هوية المتجر والشعار (Store Branding & Identity)' : '1. Store Branding & Identity'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 block">
                {lang === 'ar' ? 'اسم المتجر (بالعربية):' : 'Store Name (Arabic):'}
              </label>
              <FieldResetBtn path="storeName.ar" descAr="اسم المتجر بالعربية" descEn="Store Name (AR)" />
            </div>
            <input
              type="text"
              value={currentPresetData?.storeName?.ar || ''}
              onChange={(e) => handleUpdateText('storeName', 'ar', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 block">
                {lang === 'ar' ? 'اسم المتجر (بالإنجليزية):' : 'Store Name (English):'}
              </label>
              <FieldResetBtn path="storeName.en" descAr="اسم المتجر بالإنجليزية" descEn="Store Name (EN)" />
            </div>
            <input
              type="text"
              value={currentPresetData?.storeName?.en || ''}
              onChange={(e) => handleUpdateText('storeName', 'en', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 block">
                {lang === 'ar' ? 'شعار المتجر اللفظي (Slogan بالعربية):' : 'Store Slogan (Arabic):'}
              </label>
              <FieldResetBtn path="storeSlogan.ar" descAr="شعار المتجر بالعربية" descEn="Store Slogan (AR)" />
            </div>
            <input
              type="text"
              value={currentPresetData?.storeSlogan ? currentPresetData.storeSlogan.ar : ''}
              onChange={(e) => handleUpdateText('storeSlogan', 'ar', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 block">
                {lang === 'ar' ? 'شعار المتجر اللفظي (Slogan بالإنجليزية):' : 'Store Slogan (English):'}
              </label>
              <FieldResetBtn path="storeSlogan.en" descAr="شعار المتجر بالإنجليزية" descEn="Store Slogan (EN)" />
            </div>
            <input
              type="text"
              value={currentPresetData?.storeSlogan ? currentPresetData.storeSlogan.en : ''}
              onChange={(e) => handleUpdateText('storeSlogan', 'en', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 block">
                {lang === 'ar' ? 'شريط الإعلانات العلوي (Announcement بالعربية):' : 'Top Announcement (Arabic):'}
              </label>
              <FieldResetBtn path="topAnnouncement.ar" descAr="الشريط الإعلاني بالعربية" descEn="Top Announcement (AR)" />
            </div>
            <input
              type="text"
              value={currentPresetData?.topAnnouncement ? currentPresetData.topAnnouncement.ar : ''}
              onChange={(e) => handleUpdateText('topAnnouncement', 'ar', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 block">
                {lang === 'ar' ? 'شريط الإعلانات العلوي (Announcement بالإنجليزية):' : 'Top Announcement (English):'}
              </label>
              <FieldResetBtn path="topAnnouncement.en" descAr="الشريط الإعلاني بالإنجليزية" descEn="Top Announcement (EN)" />
            </div>
            <input
              type="text"
              value={currentPresetData?.topAnnouncement ? currentPresetData.topAnnouncement.en : ''}
              onChange={(e) => handleUpdateText('topAnnouncement', 'en', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 block">
                {lang === 'ar' ? 'رابط صورة الشعار (Store Logo Image URL):' : 'Store Logo Image URL:'}
              </label>
              <div className="flex items-center gap-2">
                <FieldResetBtn path="storeLogo" descAr="شعار المتجر الصوري" descEn="Store Logo" />
                {currentPresetData?.storeLogo && (
                  <button
                    type="button"
                    onClick={() => handleUpdateLogo('')}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                  >
                    {lang === 'ar' ? 'مسح الشعار والعودة للاسم النصي' : 'Clear & Revert to Pure Text'}
                  </button>
                )}
              </div>
            </div>
            <input
              type="url"
              placeholder="https://... (Leave blank for text-only)"
              value={currentPresetData?.storeLogo || ''}
              onChange={(e) => handleUpdateLogo(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <p className="text-[11px] text-slate-400">
              {lang === 'ar'
                ? 'في حال عدم وجود صورة، يظهر اسم المتجر نصياً فاخراً. عند وضع رابط صورة هنا، تظهر الصورة تلقائياً بدلاً من الاسم الكتابي.'
                : 'If blank, displays typography. If a logo URL is entered, image displays automatically.'}
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Hero Section & Banners */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{lang === 'ar' ? '٢. نصوص وبنر الهيرو الرئيسي (Hero Banner & Headlines)' : '2. Hero Banner & Headlines'}</span>
          </h3>
          <button
            type="button"
            onClick={() => {
              resetFieldToDefault('heroTitle', 'عنوان الهيرو', 'Hero Title');
              resetFieldToDefault('heroSubtitle', 'العنوان الفرعي للهيرو', 'Hero Subtitle');
              resetFieldToDefault('heroImage', 'صورة الهيرو', 'Hero Image');
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{lang === 'ar' ? 'استعادة قسم الهيرو بالكامل ↺' : 'Reset Entire Hero ↺'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 block">
                {lang === 'ar' ? 'العنوان الرئيسي للهيرو (بالعربية):' : 'Hero Title (Arabic):'}
              </label>
              <FieldResetBtn path="heroTitle.ar" descAr="عنوان الهيرو بالعربية" descEn="Hero Title (AR)" />
            </div>
            <input
              type="text"
              value={currentPresetData?.heroTitle?.ar || ''}
              onChange={(e) => handleUpdateText('heroTitle', 'ar', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 block">
                {lang === 'ar' ? 'العنوان الرئيسي للهيرو (بالإنجليزية):' : 'Hero Title (English):'}
              </label>
              <FieldResetBtn path="heroTitle.en" descAr="عنوان الهيرو بالإنجليزية" descEn="Hero Title (EN)" />
            </div>
            <input
              type="text"
              value={currentPresetData?.heroTitle?.en || ''}
              onChange={(e) => handleUpdateText('heroTitle', 'en', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 block">
                {lang === 'ar' ? 'العنوان الفرعي للهيرو (بالعربية):' : 'Hero Subtitle (Arabic):'}
              </label>
              <FieldResetBtn path="heroSubtitle.ar" descAr="العنوان الفرعي بالعربية" descEn="Hero Subtitle (AR)" />
            </div>
            <textarea
              rows={2}
              value={currentPresetData?.heroSubtitle?.ar || ''}
              onChange={(e) => handleUpdateText('heroSubtitle', 'ar', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none"
            />
          </div>

          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 block">
                {lang === 'ar' ? 'العنوان الفرعي للهيرو (بالإنجليزية):' : 'Hero Subtitle (English):'}
              </label>
              <FieldResetBtn path="heroSubtitle.en" descAr="العنوان الفرعي بالإنجليزية" descEn="Hero Subtitle (EN)" />
            </div>
            <textarea
              rows={2}
              value={currentPresetData?.heroSubtitle?.en || ''}
              onChange={(e) => handleUpdateText('heroSubtitle', 'en', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none"
            />
          </div>

          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 block">
                {lang === 'ar' ? 'زر الشراء الرئيسي (Primary CTA بالعربية):' : 'Primary CTA Button (Arabic):'}
              </label>
              <FieldResetBtn path="heroCtaPrimary.ar" descAr="زر الشراء بالعربية" descEn="Primary CTA (AR)" />
            </div>
            <input
              type="text"
              value={currentPresetData?.heroCtaPrimary ? currentPresetData.heroCtaPrimary.ar : ''}
              onChange={(e) => handleUpdateText('heroCtaPrimary', 'ar', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 block">
                {lang === 'ar' ? 'زر الشراء الرئيسي (Primary CTA بالإنجليزية):' : 'Primary CTA Button (English):'}
              </label>
              <FieldResetBtn path="heroCtaPrimary.en" descAr="زر الشراء بالإنجليزية" descEn="Primary CTA (EN)" />
            </div>
            <input
              type="text"
              value={currentPresetData?.heroCtaPrimary ? currentPresetData.heroCtaPrimary.en : ''}
              onChange={(e) => handleUpdateText('heroCtaPrimary', 'en', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 block">
                {lang === 'ar' ? 'رابط صورة بنر الهيرو الرئيسي (Hero Image URL):' : 'Hero Image URL:'}
              </label>
              <FieldResetBtn path="heroImage" descAr="صورة واجهة الهيرو" descEn="Hero Image" />
            </div>
            <div className="flex gap-3 items-center">
              <input
                type="url"
                value={currentPresetData?.heroImage || ''}
                onChange={(e) => handleUpdateDirect('heroImage', e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              {currentPresetData?.heroImage && (
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                  <img src={currentPresetData.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Contact & Support Channels */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">
          {lang === 'ar' ? '٣. بيانات التواصل والدعم الفني (Contact Channels & Support)' : '3. Contact Channels & Support'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'ar' ? 'رقم الواتساب الرسمي (مع رمز الدولة):' : 'Official WhatsApp Number:'}</span>
              </label>
              <FieldResetBtn path="contactInfo.whatsapp" descAr="رقم الواتساب" descEn="WhatsApp Number" />
            </div>
            <input
              type="text"
              value={currentPresetData?.contactInfo?.whatsapp || ''}
              onChange={(e) => handleUpdateContact('whatsapp', e.target.value)}
              placeholder="249912345678"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              dir="ltr"
            />
          </div>

          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'ar' ? 'رقم الهاتف للاتصال المباشر:' : 'Direct Phone Number:'}</span>
              </label>
              <FieldResetBtn path="contactInfo.phone" descAr="رقم الهاتف" descEn="Phone Number" />
            </div>
            <input
              type="text"
              value={currentPresetData?.contactInfo?.phone || ''}
              onChange={(e) => handleUpdateContact('phone', e.target.value)}
              placeholder="+249 91 234 5678"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              dir="ltr"
            />
          </div>

          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'ar' ? 'البريد الإلكتروني الرسمي:' : 'Official Email Address:'}</span>
              </label>
              <FieldResetBtn path="contactInfo.email" descAr="البريد الإلكتروني" descEn="Official Email" />
            </div>
            <input
              type="email"
              value={currentPresetData?.contactInfo?.email || ''}
              onChange={(e) => handleUpdateContact('email', e.target.value)}
              placeholder="contact@store.com"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              dir="ltr"
            />
          </div>

          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{lang === 'ar' ? 'عنوان المقر الرئيسي (بالعربية):' : 'Store Address (Arabic):'}</span>
            </label>
            <input
              type="text"
              value={currentPresetData?.contactInfo?.address?.ar || ''}
              onChange={(e) => {
                const val = e.target.value;
                setDynamicConfig((prev) => {
                  try {
                    const clone = JSON.parse(JSON.stringify(prev || siteConfig));
                    if (!clone.presets) clone.presets = JSON.parse(JSON.stringify(siteConfig.presets));
                    if (!clone.presets[activePresetId]) {
                      clone.presets[activePresetId] = JSON.parse(
                        JSON.stringify(siteConfig.presets[activePresetId] || siteConfig.presets.cosmetics)
                      );
                    }
                    if (!clone.presets[activePresetId].contactInfo) {
                      clone.presets[activePresetId].contactInfo = {
                        address: { ar: '', en: '' },
                        phone: '',
                        email: '',
                        whatsapp: '',
                      };
                    }
                    clone.presets[activePresetId].contactInfo.address.ar = val;
                    return clone;
                  } catch {
                    return prev;
                  }
                });
              }}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Smart Skin Routine Diagnosis Cards */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
              {lang === 'ar' ? '٤. كروت تشخيص روتين البشرة الذكي (Skin Diagnosis Cards)' : '4. Smart Skin Diagnosis Cards'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === 'ar'
                ? 'تحكم كامل بصور البطاقات الأربعة، ونصوص المكونات الفعالة، وشارات الترطيب والنتائج.'
                : 'Customize visual imagery, active botanical ingredients, and trust badges for each skin goal.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {(currentPresetData?.skinDiagnosisCards || siteConfig.presets.cosmetics.skinDiagnosisCards || []).map((card) => (
            <div key={card.id} className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-xs font-black text-white">{card.title[lang] || card.title.ar}</span>
                </div>
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">ID: {card.id}</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 block">
                  {lang === 'ar' ? 'رابط صورة الكرت (Card Image URL):' : 'Card Image URL:'}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="url"
                    value={card.image || ''}
                    onChange={(e) => handleUpdateSkinDiagnosis(card.id, 'image', e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                  {card.image && (
                    <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-700 shrink-0 bg-slate-900">
                      <img src={card.image} alt={card.title.en} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block">{lang === 'ar' ? 'العنوان (عربي):' : 'Title (Arabic):'}</label>
                  <input
                    type="text"
                    value={card.title.ar}
                    onChange={(e) => handleUpdateSkinDiagnosis(card.id, 'title', e.target.value, 'ar')}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block">{lang === 'ar' ? 'المكوّن الفعّال (عربي):' : 'Ingredient (Arabic):'}</label>
                  <input
                    type="text"
                    value={card.ingredient.ar}
                    onChange={(e) => handleUpdateSkinDiagnosis(card.id, 'ingredient', e.target.value, 'ar')}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block">{lang === 'ar' ? 'الشارة الترويجية (عربي):' : 'Badge (Arabic):'}</label>
                <input
                  type="text"
                  value={card.badge.ar}
                  onChange={(e) => handleUpdateSkinDiagnosis(card.id, 'badge', e.target.value, 'ar')}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Customer Testimonials */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <BadgeCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{lang === 'ar' ? '٥. شهادات وتقييمات العميلات الحقيقية (Customer Testimonials)' : '5. Customer Testimonials'}</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === 'ar'
                ? 'تعديل صور الأفاتار الشخصية، والأسماء، والمدن، ونصوص التقييمات المعروضة في سلايدر المتجر.'
                : 'Control buyer avatars, verified testimonials, city origins, and review copy.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(currentPresetData?.testimonials || siteConfig.presets.cosmetics.testimonials || []).map((t) => (
            <div key={t.id} className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 block">{lang === 'ar' ? 'رابط صورة الأفاتار:' : 'Avatar Image URL:'}</label>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="url"
                      value={t.avatar || ''}
                      onChange={(e) => handleUpdateTestimonial(t.id, 'avatar', e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white"
                    />
                    {t.avatar && (
                      <img src={t.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-slate-600 shrink-0" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 block">{lang === 'ar' ? 'اسم العميلة:' : 'Name:'}</label>
                    <input
                      type="text"
                      value={t.name.ar}
                      onChange={(e) => handleUpdateTestimonial(t.id, 'name', e.target.value, 'ar')}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 block">{lang === 'ar' ? 'المدينة:' : 'City:'}</label>
                    <input
                      type="text"
                      value={t.city.ar}
                      onChange={(e) => handleUpdateTestimonial(t.id, 'city', e.target.value, 'ar')}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block">{lang === 'ar' ? 'نص الشهادة:' : 'Review Text:'}</label>
                  <textarea
                    rows={3}
                    value={t.comment.ar}
                    onChange={(e) => handleUpdateTestimonial(t.id, 'comment', e.target.value, 'ar')}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: Promo Campaign & Before-After Slider Images */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
          {lang === 'ar' ? '٦. صور العروض التسويقية وسلايدر قبل وبعد (Visual Promos & Sliders)' : '6. Visual Promos & Sliders'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{lang === 'ar' ? 'صورة بنر العرض الترويجي الرئيسي' : 'Promo Banner Image'}</span>
              <span className="text-[10px] text-amber-400 font-mono">1200x600</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="url"
                value={currentPresetData?.promoBanner?.image1 || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setDynamicConfig((prev) => {
                    try {
                      const clone = JSON.parse(JSON.stringify(prev || siteConfig));
                      if (!clone.presets[activePresetId].promoBanner) {
                        clone.presets[activePresetId].promoBanner = JSON.parse(
                          JSON.stringify(siteConfig.presets.cosmetics.promoBanner || {})
                        );
                      }
                      clone.presets[activePresetId].promoBanner.image1 = val;
                      return clone;
                    } catch {
                      return prev;
                    }
                  });
                }}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white"
              />
              {currentPresetData?.promoBanner?.image1 && (
                <img src={currentPresetData.promoBanner.image1} alt="Promo" className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0" />
              )}
            </div>
          </div>

          <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{lang === 'ar' ? 'صور مقارنة قبل وبعد التفاعلية' : 'Before/After Comparison Images'}</span>
              <span className="text-[10px] text-purple-400 font-mono">2 Images</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 w-10 shrink-0">{lang === 'ar' ? 'قبل:' : 'Before:'}</span>
                <input
                  type="url"
                  value={currentPresetData?.beforeAfterMedia?.beforeImage || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDynamicConfig((prev) => {
                      try {
                        const clone = JSON.parse(JSON.stringify(prev || siteConfig));
                        if (!clone.presets[activePresetId].beforeAfterMedia) {
                          clone.presets[activePresetId].beforeAfterMedia = JSON.parse(
                            JSON.stringify(siteConfig.presets.cosmetics.beforeAfterMedia || {})
                          );
                        }
                        clone.presets[activePresetId].beforeAfterMedia.beforeImage = val;
                        return clone;
                      } catch {
                        return prev;
                      }
                    });
                  }}
                  className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 w-10 shrink-0">{lang === 'ar' ? 'بعد:' : 'After:'}</span>
                <input
                  type="url"
                  value={currentPresetData?.beforeAfterMedia?.afterImage || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDynamicConfig((prev) => {
                      try {
                        const clone = JSON.parse(JSON.stringify(prev || siteConfig));
                        if (!clone.presets[activePresetId].beforeAfterMedia) {
                          clone.presets[activePresetId].beforeAfterMedia = JSON.parse(
                            JSON.stringify(siteConfig.presets.cosmetics.beforeAfterMedia || {})
                          );
                        }
                        clone.presets[activePresetId].beforeAfterMedia.afterImage = val;
                        return clone;
                      } catch {
                        return prev;
                      }
                    });
                  }}
                  className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
