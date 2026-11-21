import React, { useState, useRef } from 'react';
import {
  Crown,
  Layers,
  RotateCcw,
  ExternalLink,
  Sliders,
  Undo2,
  X,
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { siteConfig } from '../data/siteConfig';
import { SectionsLayoutReorder } from './common/SectionsLayoutReorder';
import { ErrorBoundary } from './common/ErrorBoundary';
import { uploadStoreMedia, MediaFolder } from '../services/storageService';
import { FaqSectionEditor } from './admin/FaqSectionEditor';
import { AboutPageEditor } from './admin/AboutPageEditor';
import { PrivacyPolicyEditor } from './admin/PrivacyPolicyEditor';
import { getCustomizerAdaptiveMeta, PresetNicheKey } from './customizer/FieldResetBtn';
import { CustomizerTopCorners } from './customizer/CustomizerTopCorners';
import { CustomizerCatalogCorners } from './customizer/CustomizerCatalogCorners';
import { CustomizerTrustCorners } from './customizer/CustomizerTrustCorners';

export interface UnifiedStoreCustomizerProps {
  onNavigateToProducts?: () => void;
  presetId?: PresetNicheKey;
}

export const UnifiedStoreCustomizer: React.FC<UnifiedStoreCustomizerProps> = ({
  onNavigateToProducts,
  presetId,
}) => {
  const {
    lang,
    dynamicConfig,
    setDynamicConfig,
    activePresetId,
    setActivePresetId,
    showToast,
    navigateTo,
    canUndo,
    undoLastChange,
    resetFieldToDefault,
    isFieldModified,
    recordHistorySnapshot,
    historyStack,
    resetPresetToFactoryDefault,
  } = useCommerce();

  const effectivePresetId: PresetNicheKey = (presetId || activePresetId) as PresetNicheKey;
  const isCurrentActive = effectivePresetId === activePresetId;
  const activePreset = dynamicConfig.presets[effectivePresetId] || dynamicConfig.presets.cosmetics;
  const preset = activePreset as any;

  const [activeCornerId, setActiveCornerId] = useState<string>('corner-1');
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);

  // Direct file upload references
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const beforeImgFileInputRef = useRef<HTMLInputElement>(null);
  const afterImgFileInputRef = useRef<HTMLInputElement>(null);
  const trioBannerFileInputRef = useRef<HTMLInputElement>(null);
  const [activeTrioIdx, setActiveTrioIdx] = useState<number | null>(null);

  const { c6Info, c9Info, c10Info, cornersList } = getCustomizerAdaptiveMeta(effectivePresetId);

  // Upload compressed image to Firebase Storage (with compact compressed fallback when offline)
  const uploadAsset = async (file: File, folder: MediaFolder): Promise<string> => {
    const options =
      folder === 'branding'
        ? { maxDimension: 600, quality: 0.85 }
        : { maxDimension: 1200, quality: 0.82 };
    const res = await uploadStoreMedia(file, folder, lang, options);
    return res.url;
  };

  // Generic Field Updater with History Tracking & Safe Fallback
  const updateField = (path: string, value: any) => {
    try {
      recordHistorySnapshot(`تعديل ${path}`, `Edit ${path}`, path);
      setDynamicConfig((prev) => {
        const clone = JSON.parse(JSON.stringify(prev));
        const parts = path.split('.');
        let cur = clone.presets[effectivePresetId];
        if (!cur) {
          clone.presets[effectivePresetId] = JSON.parse(
            JSON.stringify(siteConfig.presets[effectivePresetId] || siteConfig.presets.cosmetics)
          );
          cur = clone.presets[effectivePresetId];
        }
        for (let i = 0; i < parts.length - 1; i++) {
          if (!cur[parts[i]]) cur[parts[i]] = {};
          cur = cur[parts[i]];
        }
        cur[parts[parts.length - 1]] = value;
        try {
          localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
        } catch {
          // LocalStorage cache write is best-effort; Firestore remains source of truth
        }
        return clone;
      });
    } catch (err) {
      console.error('[UnifiedStoreCustomizer] updateField error:', err);
      showToast(lang === 'ar' ? 'تعذر حفظ التعديل، حاول مرة أخرى.' : 'Failed to save change, please retry.');
    }
  };

  // Handle file uploads
  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldPath: string,
    successMsgAr: string,
    successMsgEn: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const folder: MediaFolder =
      fieldPath === 'storeLogo' ? 'branding' : fieldPath === 'heroImage' ? 'hero' : 'banners';
    try {
      const uploadedUrl = await uploadAsset(file, folder);
      updateField(fieldPath, uploadedUrl);
      showToast(lang === 'ar' ? successMsgAr : successMsgEn);
    } catch (err: any) {
      showToast(err?.message || (lang === 'ar' ? 'خطأ أثناء رفع الملف' : 'Error uploading file'));
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  // Corner Jump Navigation Helper
  const scrollToCorner = (id: string) => {
    setActiveCornerId(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Nested list helpers with safe fallbacks
  const trioBannersList =
    activePreset.trioBanners && activePreset.trioBanners.length > 0
      ? activePreset.trioBanners
      : siteConfig.presets.cosmetics.trioBanners || [];

  const updateTrioBanner = (idx: number, field: string, val: any) => {
    const list = JSON.parse(JSON.stringify(trioBannersList));
    if (!list[idx]) list[idx] = {};
    const parts = field.split('.');
    if (parts.length === 2) {
      if (!list[idx][parts[0]]) list[idx][parts[0]] = {};
      list[idx][parts[0]][parts[1]] = val;
    } else {
      list[idx][field] = val;
    }
    updateField('trioBanners', list);
  };

  const skinDiagnosisCards =
    activePreset.skinDiagnosisCards && activePreset.skinDiagnosisCards.length > 0
      ? activePreset.skinDiagnosisCards
      : siteConfig.presets.cosmetics.skinDiagnosisCards || [];

  const updateSkinCard = (idx: number, field: string, val: any) => {
    const list = JSON.parse(JSON.stringify(skinDiagnosisCards));
    if (!list[idx]) list[idx] = {};
    const parts = field.split('.');
    if (parts.length === 2) {
      if (!list[idx][parts[0]]) list[idx][parts[0]] = {};
      list[idx][parts[0]][parts[1]] = val;
    } else {
      list[idx][field] = val;
    }
    updateField('skinDiagnosisCards', list);
  };

  const testimonialsList =
    activePreset.testimonials && activePreset.testimonials.length > 0
      ? activePreset.testimonials
      : siteConfig.presets.cosmetics.testimonials || [];

  const updateTestimonial = (idx: number, field: string, val: any) => {
    const list = JSON.parse(JSON.stringify(testimonialsList));
    if (!list[idx]) list[idx] = {};
    const parts = field.split('.');
    if (parts.length === 2) {
      if (!list[idx][parts[0]]) list[idx][parts[0]] = {};
      list[idx][parts[0]][parts[1]] = val;
    } else {
      list[idx][field] = val;
    }
    updateField('testimonials', list);
  };

  const notifyMessage = (message: string) => showToast(message);

  return (
    <div className="space-y-8 select-none">
      {/* Hidden File Inputs for Direct Device Uploads */}
      <input
        type="file"
        ref={logoFileInputRef}
        onChange={(e) => handleFileSelect(e, 'storeLogo', 'تم رفع الشعار بنجاح!', 'Logo uploaded successfully!')}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={heroFileInputRef}
        onChange={(e) => handleFileSelect(e, 'heroImage', 'تم رفع صورة الهيرو بنجاح!', 'Hero image uploaded!')}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={beforeImgFileInputRef}
        onChange={(e) => handleFileSelect(e, 'beforeAfterMedia.beforeImage', 'تم رفع صورة (قبل)!', 'Before photo uploaded!')}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={afterImgFileInputRef}
        onChange={(e) => handleFileSelect(e, 'beforeAfterMedia.afterImage', 'تم رفع صورة (بعد)!', 'After photo uploaded!')}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={trioBannerFileInputRef}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file || activeTrioIdx === null) return;
          try {
            const uploadedUrl = await uploadAsset(file, 'banners');
            updateTrioBanner(activeTrioIdx, 'image', uploadedUrl);
            showToast(lang === 'ar' ? 'تم رفع صورة الماركة بنجاح!' : 'Brand banner image uploaded!');
          } catch (err: any) {
            showToast(err?.message || 'Upload error');
          } finally {
            if (e.target) e.target.value = '';
          }
        }}
        accept="image/*"
        className="hidden"
      />

      {/* 1. MASTER BANNER & QUICK ACTIONS BAR */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 end-0 -mt-10 -me-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
                <Crown className="w-3.5 h-3.5" />
                <span>{activePreset.nicheLabel?.[lang] || activePreset.storeName?.[lang] || effectivePresetId}</span>
              </div>
              {isCurrentActive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{lang === 'ar' ? 'مفعل بالمتجر الحي' : 'Active on Store'}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-slate-300 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>{lang === 'ar' ? 'كامن – جاهز للتفعيل' : 'Inactive Hub'}</span>
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              {lang === 'ar'
                ? `ركن إدارة وتخصيص: ${activePreset.nicheLabel?.[lang] || effectivePresetId}`
                : `Store Customizer: ${activePreset.nicheLabel?.[lang] || effectivePresetId}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'ar'
                ? 'ركن موحد متكامل مرتب بدقة متطابقة 1:1 مع الترتيب البصري الحقيقي للمتجر. يمكنك التعديل المباشر، استعادة الافتراضي، أو تمكين هذا النظام بالمتجر الحي بنقرة زر واحدة.'
                : '1:1 Linear store customizer. Edit content, reset factory defaults, and activate this system on the live storefront.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!isCurrentActive ? (
              <button
                type="button"
                onClick={() => {
                  setActivePresetId(effectivePresetId);
                  showToast({
                    type: 'success',
                    message:
                      lang === 'ar'
                        ? `تم تمكين قالب (${activePreset.nicheLabel?.[lang] || effectivePresetId}) بالمتجر الحي بنجاح!`
                        : `Activated (${effectivePresetId}) on live storefront!`,
                  });
                }}
                className="h-11 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
              >
                <Sliders className="w-4 h-4 text-purple-900" />
                <span>{lang === 'ar' ? 'تمكين القالب بالمتجر الحي' : 'Activate On Storefront'}</span>
              </button>
            ) : effectivePresetId !== 'cosmetics' ? (
              <button
                type="button"
                onClick={() => {
                  setActivePresetId('cosmetics');
                  showToast({
                    type: 'info',
                    message:
                      lang === 'ar'
                        ? 'تم إلغاء التمكين والعودة للمتجر الافتراضي بنجاح! ↩'
                        : 'Deactivated preset and reverted to default store! ↩',
                  });
                }}
                className="h-11 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                title={lang === 'ar' ? 'إلغاء التمكين والعودة للمتجر الافتراضي' : 'Deactivate and return to default'}
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>{lang === 'ar' ? 'إلغاء التمكين الافتراضي ↩' : 'Disable / Revert Default ↩'}</span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => resetPresetToFactoryDefault(effectivePresetId)}
              className="h-11 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/35 text-rose-200 border border-rose-500/40 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              title={lang === 'ar' ? 'استعادة ضبط المصنع بالكامل لهذا النظام' : 'Factory Reset this preset'}
            >
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <span>{lang === 'ar' ? 'استعادة ضبط المصنع للقالب ↺' : 'Factory Reset Store ↺'}</span>
            </button>

            <button
              type="button"
              onClick={undoLastChange}
              disabled={!canUndo}
              className={`h-11 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                canUndo
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md font-black'
                  : 'bg-white/10 text-slate-400 cursor-not-allowed border border-white/10'
              }`}
              title={lang === 'ar' ? 'تراجع عن آخر تعديل' : 'Undo last change'}
            >
              <Undo2 className="w-4 h-4" />
              <span>{lang === 'ar' ? `تراجع (${historyStack.length})` : `Undo (${historyStack.length})`}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsReorderModalOpen(true)}
              className="h-11 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
              title={lang === 'ar' ? 'سحب وترتيب أقسام المتجر' : 'Sections Layout & Reorder'}
            >
              <Layers className="w-4 h-4 text-purple-200" />
              <span>{lang === 'ar' ? 'سحب وترتيب الأقسام' : 'Reorder Sections'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('store')}
              className="h-11 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>{lang === 'ar' ? 'معاينة المتجر الحي' : 'View Storefront'}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-90" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. STICKY QUICK-JUMP INDEX */}
      <div className="sticky top-2 z-40 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl border border-slate-200 shadow-md overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[11px] font-black text-slate-500 uppercase px-2 flex items-center gap-1">
            <span>{lang === 'ar' ? 'انتقال سريع:' : 'Jump to:'}</span>
          </span>
          {cornersList.map((c) => {
            const isActive = activeCornerId === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => scrollToCorner(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200/60'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full text-[10px] font-mono flex items-center justify-center ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {c.num}
                </span>
                <span>{c.name[lang]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. THE 16 SEQUENTIAL CORNERS (ISOLATED WITH ERROR BOUNDARIES) */}
      <div className="space-y-8">
        <ErrorBoundary scope="Customizer:TopCorners">
          <CustomizerTopCorners
            lang={lang}
            activePreset={activePreset}
            preset={preset}
            updateField={updateField}
            isFieldModified={isFieldModified}
            resetFieldToDefault={resetFieldToDefault}
            showToast={notifyMessage}
            onTriggerLogoUpload={() => logoFileInputRef.current?.click()}
            onTriggerHeroUpload={() => heroFileInputRef.current?.click()}
          />
        </ErrorBoundary>

        <ErrorBoundary scope="Customizer:CatalogCorners">
          <CustomizerCatalogCorners
            lang={lang}
            activePreset={activePreset}
            c6Info={c6Info}
            c9Info={c9Info}
            c10Info={c10Info}
            skinDiagnosisCards={skinDiagnosisCards}
            trioBannersList={trioBannersList}
            updateField={updateField}
            updateSkinCard={updateSkinCard}
            updateTrioBanner={updateTrioBanner}
            isFieldModified={isFieldModified}
            resetFieldToDefault={resetFieldToDefault}
            showToast={notifyMessage}
            onNavigateToProducts={onNavigateToProducts}
            onTriggerTrioUpload={(idx) => {
              setActiveTrioIdx(idx);
              trioBannerFileInputRef.current?.click();
            }}
            onTriggerBeforeUpload={() => beforeImgFileInputRef.current?.click()}
            onTriggerAfterUpload={() => afterImgFileInputRef.current?.click()}
          />
        </ErrorBoundary>

        <ErrorBoundary scope="Customizer:TrustCorners">
          <CustomizerTrustCorners
            lang={lang}
            activePreset={activePreset}
            preset={preset}
            testimonialsList={testimonialsList}
            updateField={updateField}
            updateTestimonial={updateTestimonial}
            isFieldModified={isFieldModified}
            resetFieldToDefault={resetFieldToDefault}
          />
        </ErrorBoundary>

        <ErrorBoundary scope="Customizer:FaqSection">
          <FaqSectionEditor
            lang={lang}
            faqSection={activePreset.faqSection}
            onUpdateFaqSection={(next) => updateField('faqSection', next)}
            onNotify={notifyMessage}
          />
        </ErrorBoundary>

        <ErrorBoundary scope="Customizer:AboutPage">
          <AboutPageEditor
            lang={lang}
            storeName={activePreset.storeName}
            aboutStory={activePreset.aboutStory}
            onUpdateAboutStory={(next) => updateField('aboutStory', next)}
            onResetAboutStory={() => resetFieldToDefault('aboutStory', 'صفحة من نحن', 'About Page')}
            onNotify={notifyMessage}
          />
        </ErrorBoundary>

        <ErrorBoundary scope="Customizer:PrivacyPolicy">
          <PrivacyPolicyEditor
            lang={lang}
            storeName={activePreset.storeName}
            privacyPolicy={activePreset.privacyPolicy}
            onUpdatePrivacyPolicy={(next) => updateField('privacyPolicy', next)}
            onNotify={notifyMessage}
          />
        </ErrorBoundary>
      </div>

      {/* Embedded High-Fidelity Sections Layout & Reorder Modal */}
      {isReorderModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsReorderModalOpen(false)}
        >
          <div
            className="max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-3xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsReorderModalOpen(false)}
                className="absolute top-4 end-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                title={lang === 'ar' ? 'إغلاق' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
              <ErrorBoundary scope="Customizer:SectionsReorderModal">
                <SectionsLayoutReorder onClose={() => setIsReorderModalOpen(false)} showStorefrontLink={false} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
