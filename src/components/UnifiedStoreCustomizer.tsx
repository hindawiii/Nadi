import React, { useState, useRef } from 'react';
import { 
  Sparkles, Layers, Image as ImageIcon, MapPin, 
  RotateCcw, Upload, ArrowUpRight, MessageCircle, 
  Phone, Mail, CheckCircle2, Star, ShieldCheck, 
  Droplets, ExternalLink, ArrowRight, ArrowLeft,
  ChevronDown, ChevronUp, ShoppingBag, Eye, Plus, Trash2,
  Sliders, Award, Truck, Check, HelpCircle, Undo2
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { siteConfig, Product } from '../data/siteConfig';

export interface UnifiedStoreCustomizerProps {
  onNavigateToProducts?: () => void;
  presetId?: 'cosmetics' | 'fashion' | 'eyewear' | 'electronics';
}

export const UnifiedStoreCustomizer: React.FC<UnifiedStoreCustomizerProps> = ({ 
  onNavigateToProducts,
  presetId 
}) => {
  const { 
    lang, dynamicConfig, setDynamicConfig, activePresetId, setActivePresetId,
    showToast, navigateTo, canUndo, undoLastChange, 
    resetFieldToDefault, isFieldModified, recordHistorySnapshot,
    historyStack, resetPresetToFactoryDefault
  } = useCommerce();

  const isRtl = lang === 'ar';
  const effectivePresetId = presetId || activePresetId;
  const isCurrentActive = effectivePresetId === activePresetId;
  const activePreset = dynamicConfig.presets[effectivePresetId] || dynamicConfig.presets.cosmetics;
  const preset = activePreset as any;
  const [activeCornerId, setActiveCornerId] = useState<string>('corner-1');

  // Direct file upload references
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const promo1FileInputRef = useRef<HTMLInputElement>(null);
  const promo2FileInputRef = useRef<HTMLInputElement>(null);
  const beforeImgFileInputRef = useRef<HTMLInputElement>(null);
  const afterImgFileInputRef = useRef<HTMLInputElement>(null);
  const trioBannerFileInputRef = useRef<HTMLInputElement>(null);
  const [activeTrioIdx, setActiveTrioIdx] = useState<number | null>(null);

  // Read file as Data URL helper
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.size > 4 * 1024 * 1024) {
        reject(new Error(lang === 'ar' ? 'حجم الصورة كبير جداً، يرجى اختيار ملف أقل من 4 ميجابايت' : 'Image is too large. Please select a file under 4MB.'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  // Generic Field Updater with History Tracking
  const updateField = (path: string, value: any) => {
    recordHistorySnapshot(`تعديل ${path}`, `Edit ${path}`, path);
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let cur = clone.presets[effectivePresetId];
      if (!cur) {
        clone.presets[effectivePresetId] = JSON.parse(JSON.stringify(siteConfig.presets[effectivePresetId] || siteConfig.presets.cosmetics));
        cur = clone.presets[effectivePresetId];
      }
      for (let i = 0; i < parts.length - 1; i++) {
        if (!cur[parts[i]]) cur[parts[i]] = {};
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
      try {
        localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
      } catch (e) {}
      return clone;
    });
  };

  // Reusable Granular Reset Button Component
  const FieldResetBtn: React.FC<{
    path: string;
    descAr: string;
    descEn: string;
  }> = ({ path, descAr, descEn }) => {
    const modified = isFieldModified(path);
    return (
      <button
        type="button"
        onClick={() => resetFieldToDefault(path, descAr, descEn)}
        title={lang === 'ar' ? `استعادة القيمة الافتراضية لـ (${descAr})` : `Reset (${descEn}) to factory default`}
        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
          modified
            ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 shadow-xs'
            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent'
        }`}
      >
        <RotateCcw className="w-3 h-3" />
        <span>{lang === 'ar' ? (modified ? 'استعادة الافتراضي ↺' : 'افتراضي') : (modified ? 'Reset ↺' : 'Default')}</span>
      </button>
    );
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
    try {
      const dataUrl = await readFileAsDataURL(file);
      updateField(fieldPath, dataUrl);
      showToast(lang === 'ar' ? successMsgAr : successMsgEn);
    } catch (err: any) {
      showToast(err.message || 'Error uploading file');
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  // Corner Jump Navigation Helper
  const scrollToCorner = (id: string) => {
    setActiveCornerId(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; // offset for sticky navigation bar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Adaptive niche-specific helpers for 100% Context-Aware Customizer
  const getCorner6Info = () => {
    switch (effectivePresetId) {
      case 'fashion':
        return {
          name: { ar: 'كتالوج الإطلالات وتنسيق الأزياء', en: 'Lookbook & Outfit Styling' },
          desc: { ar: 'تنسيق أزياء الموسم، تفاصيل الأقمشة، ومجموعات الموديل التحريرية', en: 'Curated seasonal outfits, fabric composition & editorial looks' },
          icon: Sparkles
        };
      case 'electronics':
        return {
          name: { ar: 'جدول المواصفات والخصائص الذكية', en: 'Tech Specs & Matrix' },
          desc: { ar: 'مصفوفة المعالجات، قدرات الشاشات، سعة البطاريات، ومقاييس الأداء', en: 'Chipset benchmarks, display refresh rate & battery specs' },
          icon: Sliders
        };
      case 'eyewear':
        return {
          name: { ar: 'أبعاد الإطارات وعدسات الحماية (AR)', en: 'Frame Specs & AR Optics' },
          desc: { ar: 'مقاسات الإطارات التيتانيوم، حماية الأشعة فوق البنفسجية، وتجربة الـ AR', en: 'Titanium frame sizing, UV400 lens grades & AR try-on' },
          icon: Star
        };
      default:
        return {
          name: { ar: 'تشخيص الروتين والعناية الذكية', en: 'Skin Routine Diagnosis' },
          desc: { ar: 'بطاقات خطوات الروتين الأربعة (الغسول، السيروم، المرطب، الحماية)', en: '4-step skincare routine cards with botanical ingredients' },
          icon: Droplets
        };
    }
  };

  const getCorner9Info = () => {
    switch (effectivePresetId) {
      case 'fashion':
        return {
          name: { ar: 'دور الأزياء وبكجات تسوق الإطلالة', en: 'Fashion Houses & Shop The Look' },
          desc: { ar: 'بنرات دور الأزياء الإيطالية وبكجات تسوق الإطلالة الكاملة المنسقة', en: 'Italian couture banners and complete bundle look packages' },
          tag: { ar: '📍 قسم أزياء الموسم', en: '📍 Season Outfits' }
        };
      case 'electronics':
        return {
          name: { ar: 'أجهزة المستقبل وبنرات العتاد الذكي', en: 'Flagship Tech & Gadget Trio' },
          desc: { ar: 'بنرات أحدث المعالجات والأجهزة الذكية وملحقات الأداء العالي', en: 'Next-gen silicon hardware and flagship gadget spotlight' },
          tag: { ar: '📍 قسم الأجهزة التقنية', en: '📍 Tech Spotlight' }
        };
      case 'eyewear':
        return {
          name: { ar: 'إطارات التيتانيوم وماركات البصريات', en: 'Titanium Frames & Designer Trio' },
          desc: { ar: 'بنرات تشكيلات المصممين الحصرية وإطارات التيتانيوم خفيفة الوزن', en: 'Ultra-lightweight titanium collections and designer optics' },
          tag: { ar: '📍 قسم النظارات المميزة', en: '📍 Eyewear Spotlight' }
        };
      default:
        return {
          name: { ar: 'أجهزة الشعر وبنرات الماركات (Trio)', en: 'Hair Devices & Trio Banners' },
          desc: { ar: 'بنرات الماركات الثلاث (سيل تك، أوكيما، كلارا) وسلايدر أجهزة الشعر', en: '3 Brand spotlight banners and smooth horizontal devices carousel' },
          tag: { ar: '📍 قسم أجهزة الشعر', en: '📍 Hair Devices Section' }
        };
    }
  };

  const getCorner10Info = () => {
    switch (effectivePresetId) {
      case 'fashion':
        return {
          name: { ar: 'مقارنة التنسيق (نهاري vs مسائي)', en: 'Styling (Day vs Night)' },
          desc: { ar: 'مقارنة مرئية تفاعلية لتنسيق القطعة للإطلالة النهارية والرسمية المسائية', en: 'Interactive split-screen proof: Casual Daywear vs Evening Gala look' }
        };
      case 'electronics':
        return {
          name: { ar: 'مقارنة الأداء والسرعة (Benchmark)', en: 'Speed & Benchmarks Proof' },
          desc: { ar: 'مقارنة بصرية حية لمعدل الإطارات وسرعة المعالجة بين الجيل السابق والجديد', en: 'Live visual comparison: Next-gen refresh rate vs legacy performance' }
        };
      case 'eyewear':
        return {
          name: { ar: 'وضوح الرؤية مع العدسات المستقطبة', en: 'Polarized Vision Proof' },
          desc: { ar: 'محاكاة حية لتأثير العدسات المستقطبة وعزل التوهج الشمسي المباشر', en: 'Split-screen proof: Raw harsh glare vs polarized HD visual clarity' }
        };
      default:
        return {
          name: { ar: 'قبل وبعد (Visual Proof Slider)', en: 'Before & After Proof Slider' },
          desc: { ar: 'شريط المقارنة التفاعلي لنتائج العناية الفورية قبل وبعد الاستخدام', en: 'Interactive before & after slider proving visible skincare results' }
        };
    }
  };

  const c6Info = getCorner6Info();
  const c9Info = getCorner9Info();
  const c10Info = getCorner10Info();

  // The 13 Sequential Corners Definition (Context-Aware for all 4 global niches)
  const cornersList = [
    { id: 'corner-1', num: 1, name: { ar: 'شريط الإعلانات العلوي', en: 'Top Announcement Bar' }, icon: Sparkles },
    { id: 'corner-2', num: 2, name: { ar: 'الهيدر وشعار وهوية المتجر', en: 'Header & Store Branding' }, icon: Award },
    { id: 'corner-3', num: 3, name: { ar: 'البنر الترحيبي الرئيسي', en: 'Hero Banner Section' }, icon: Layers },
    { id: 'corner-4', num: 4, name: { ar: 'شريط الماركات المتحرك', en: 'Infinite Brand Ticker' }, icon: Sliders },
    { id: 'corner-5', num: 5, name: { ar: 'تصنيفات وتبويبات المتجر', en: 'Categories Navigation' }, icon: ShoppingBag },
    { id: 'corner-6', num: 6, name: c6Info.name, icon: c6Info.icon },
    { id: 'corner-7', num: 7, name: { ar: 'كتالوج المنتجات والمخزون', en: 'Products Catalog & Pricing' }, icon: ShoppingBag },
    { id: 'corner-8', num: 8, name: { ar: 'بنرات العروض المزدوجة', en: 'Dual Campaign Banners' }, icon: ImageIcon },
    { id: 'corner-9', num: 9, name: c9Info.name, icon: Sparkles },
    { id: 'corner-10', num: 10, name: c10Info.name, icon: Star },
    { id: 'corner-11', num: 11, name: { ar: 'آراء وتقييمات العملاء', en: 'Customer Testimonials' }, icon: Star },
    { id: 'corner-12', num: 12, name: { ar: 'شريط مزايا المتجر والثقة', en: 'Store Value Props' }, icon: ShieldCheck },
    { id: 'corner-13', num: 13, name: { ar: 'التذييل ومعلومات التواصل', en: 'Footer & WhatsApp' }, icon: Phone },
  ];

  // Trio banners fallback
  const trioBannersList = activePreset.trioBanners && activePreset.trioBanners.length > 0
    ? activePreset.trioBanners
    : (siteConfig.presets.cosmetics.trioBanners || []);

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

  // Skin diagnosis cards fallback
  const skinDiagnosisCards = activePreset.skinDiagnosisCards && activePreset.skinDiagnosisCards.length > 0
    ? activePreset.skinDiagnosisCards
    : (siteConfig.presets.cosmetics.skinDiagnosisCards || []);

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

  // Testimonials list fallback
  const testimonialsList = activePreset.testimonials && activePreset.testimonials.length > 0
    ? activePreset.testimonials
    : (siteConfig.presets.cosmetics.testimonials || []);

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
        ref={promo1FileInputRef} 
        onChange={(e) => handleFileSelect(e, 'promoBanner.image1', 'تم رفع صورة العرض 1!', 'Promo 1 image uploaded!')} 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={promo2FileInputRef} 
        onChange={(e) => handleFileSelect(e, 'promoBanner.image2', 'تم رفع صورة العرض 2!', 'Promo 2 image uploaded!')} 
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
            const dataUrl = await readFileAsDataURL(file);
            updateTrioBanner(activeTrioIdx, 'image', dataUrl);
            showToast(lang === 'ar' ? 'تم رفع صورة الماركة بنجاح!' : 'Brand banner image uploaded!');
          } catch (err: any) {
            showToast(err.message || 'Upload error');
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
                <Sparkles className="w-3.5 h-3.5" />
                <span>{activePreset.nicheLabel?.[lang] || activePreset.storeName?.[lang] || effectivePresetId}</span>
              </div>
              {isCurrentActive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{lang === 'ar' ? '🟢 مفعل بالمتجر الحي' : '🟢 Active on Store'}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-slate-300 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>{lang === 'ar' ? '⚪ كامن – جاهز للتفعيل' : '⚪ Inactive Hub'}</span>
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
            {/* Activate Storefront Button (when not currently active) */}
            {!isCurrentActive ? (
              <button
                type="button"
                onClick={() => {
                  setActivePresetId(effectivePresetId);
                  showToast({
                    type: 'success',
                    message: lang === 'ar' 
                      ? `تم تمكين قالب (${activePreset.nicheLabel?.[lang] || effectivePresetId}) بالمتجر الحي بنجاح! ⚡` 
                      : `Activated (${effectivePresetId}) on live storefront! ⚡`
                  });
                }}
                className="h-11 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-purple-900" />
                <span>{lang === 'ar' ? 'تمكين القالب بالمتجر الحي ⚡' : 'Activate On Storefront ⚡'}</span>
              </button>
            ) : effectivePresetId !== 'cosmetics' ? (
              <button
                type="button"
                onClick={() => {
                  setActivePresetId('cosmetics');
                  showToast({
                    type: 'info',
                    message: lang === 'ar'
                      ? 'تم إلغاء التمكين والعودة للمتجر الافتراضي بنجاح! ↩'
                      : 'Deactivated preset and reverted to default store! ↩'
                  });
                }}
                className="h-11 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                title={lang === 'ar' ? 'إلغاء التمكين والعودة للمتجر الافتراضي' : 'Deactivate and return to default'}
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>{lang === 'ar' ? 'إلغاء التمكين الافتراضي ↩' : 'Disable / Revert Default ↩'}</span>
              </button>
            ) : null}

            {/* Factory Reset Preset Button */}
            <button
              type="button"
              onClick={() => resetPresetToFactoryDefault(effectivePresetId)}
              className="h-11 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/35 text-rose-200 border border-rose-500/40 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              title={lang === 'ar' ? 'استعادة ضبط المصنع بالكامل لهذا النظام' : 'Factory Reset this preset'}
            >
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <span>{lang === 'ar' ? 'استعادة ضبط المصنع للقالب ↺' : 'Factory Reset Store ↺'}</span>
            </button>

            {/* Global Undo Button */}
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

            {/* View Live Store Button */}
            <button
              type="button"
              onClick={() => navigateTo('store')}
              className="h-11 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>{lang === 'ar' ? 'معاينة المتجر الحي' : 'View Storefront'}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. STICKY QUICK-JUMP INDEX (فهرس التنقل السريع بين الأركان الـ 13) */}
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
                <span className={`w-4 h-4 rounded-full text-[10px] font-mono flex items-center justify-center ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {c.num}
                </span>
                <span>{c.name[lang]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. THE 13 SEQUENTIAL CORNERS OF THE STORE                */}
      {/* ======================================================== */}
      <div className="space-y-8">

        {/* ---------------------------------------------------- */}
        {/* CORNER 1: TOP ANNOUNCEMENT BAR                       */}
        {/* ---------------------------------------------------- */}
        <div id="corner-1" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
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
                <span>{lang === 'ar' ? '📍 أعلى قمة المتجر' : '📍 Storefront Topmost'}</span>
              </span>
              <FieldResetBtn path="announcementSlides" descAr="شرائح الشريط العلوي" descEn="Announcement Slides" />
            </div>
          </div>

          {/* Top Announcement Main Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-2xl bg-purple-50/20 border border-purple-100">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-bold text-slate-700 block">
                  {lang === 'ar' ? 'الإعلان الثابت الرئيسي (بالعربية):' : 'Main Announcement (Arabic):'}
                </label>
                <FieldResetBtn path="topAnnouncement.ar" descAr="الإعلان الثابت بالعربية" descEn="Main Announcement (AR)" />
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
                <FieldResetBtn path="topAnnouncement.en" descAr="الإعلان الثابت بالإنجليزية" descEn="Main Announcement (EN)" />
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
            {(preset.announcementSlides || [
              { ar: 'شحن فوري سريع ومجاني للطلبات فوق 50$ 🚚', en: 'Free express shipping on orders over $50 🚚' },
              { ar: 'تركيبات نباتية أصلية ونقية 100% معتمدة 🌿', en: '100% Certified pure botanical formulas 🌿' },
              { ar: 'ضمان ذهبي شامل لمدة عامين على الأجهزة 🛡️', en: 'Full 2-year warranty on all beauty devices 🛡️' }
            ]).map((slide: any, sIdx: number) => {
              const textAr = typeof slide === 'object' ? (slide.ar || slide.text?.ar || '') : String(slide);
              const textEn = typeof slide === 'object' ? (slide.en || slide.text?.en || '') : String(slide);
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
                          const slides = JSON.parse(JSON.stringify(preset.announcementSlides || [
                            { ar: 'شحن فوري سريع ومجاني للطلبات فوق 50$ 🚚', en: 'Free express shipping on orders over $50 🚚' },
                            { ar: 'تركيبات نباتية أصلية ونقية 100% معتمدة 🌿', en: '100% Certified pure botanical formulas 🌿' },
                            { ar: 'ضمان ذهبي شامل لمدة عامين على الأجهزة 🛡️', en: 'Full 2-year warranty on all beauty devices 🛡️' }
                          ]));
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
                          const slides = JSON.parse(JSON.stringify(preset.announcementSlides || [
                            { ar: 'شحن فوري سريع ومجاني للطلبات فوق 50$ 🚚', en: 'Free express shipping on orders over $50 🚚' },
                            { ar: 'تركيبات نباتية أصلية ونقية 100% معتمدة 🌿', en: '100% Certified pure botanical formulas 🌿' },
                            { ar: 'ضمان ذهبي شامل لمدة عامين على الأجهزة 🛡️', en: 'Full 2-year warranty on all beauty devices 🛡️' }
                          ]));
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

        {/* ---------------------------------------------------- */}
        {/* CORNER 2: HEADER & STORE BRANDING                    */}
        {/* ---------------------------------------------------- */}
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
              <span>{lang === 'ar' ? '📍 شريط الهيدر والتنقل' : '📍 Header Navigation Bar'}</span>
            </span>
          </div>

          {/* Store Names & Slogan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  {lang === 'ar' ? 'اسم المتجر (بالعربية):' : 'Store Name (Arabic):'}
                </label>
                <FieldResetBtn path="storeName.ar" descAr="اسم المتجر بالعربية" descEn="Store Name (AR)" />
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
                <FieldResetBtn path="storeName.en" descAr="اسم المتجر بالإنجليزية" descEn="Store Name (EN)" />
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
                <FieldResetBtn path="storeSlogan.ar" descAr="الشعار اللفظي بالعربية" descEn="Slogan (AR)" />
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
                <FieldResetBtn path="storeSlogan.en" descAr="الشعار اللفظي بالإنجليزية" descEn="Slogan (EN)" />
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
                <FieldResetBtn path="storeLogo" descAr="شعار المتجر الصوري" descEn="Store Logo" />
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
                onClick={() => logoFileInputRef.current?.click()}
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

        {/* ---------------------------------------------------- */}
        {/* CORNER 3: HERO BANNER SECTION                        */}
        {/* ---------------------------------------------------- */}
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
              <span>{lang === 'ar' ? '📍 أعلى الصفحة الرئيسية' : '📍 Storefront Top Hero'}</span>
            </span>
          </div>

          {/* Hero Main Image Upload */}
          <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-purple-900">
                {lang === 'ar' ? 'صورة واجهة الهيرو الكبيرة (Hero Visual Image):' : 'Hero Visual Banner Image:'}
              </label>
              <FieldResetBtn path="heroImage" descAr="صورة الهيرو الرئيسية" descEn="Hero Image" />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => heroFileInputRef.current?.click()}
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
                <FieldResetBtn path="heroTitle.ar" descAr="عنوان الهيرو بالعربية" descEn="Hero Title (AR)" />
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
                <FieldResetBtn path="heroTitle.en" descAr="عنوان الهيرو بالإنجليزية" descEn="Hero Title (EN)" />
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
                <FieldResetBtn path="heroSubtitle.ar" descAr="العنوان الفرعي بالعربية" descEn="Hero Subtitle (AR)" />
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
                <FieldResetBtn path="heroSubtitle.en" descAr="العنوان الفرعي بالإنجليزية" descEn="Hero Subtitle (EN)" />
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
                <FieldResetBtn path="heroCtaPrimary.ar" descAr="زر الطلب الرئيسي بالعربية" descEn="Primary CTA (AR)" />
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
                <FieldResetBtn path="heroCtaPrimary.en" descAr="زر الطلب الرئيسي بالإنجليزية" descEn="Primary CTA (EN)" />
              </div>
              <input
                type="text"
                value={preset.heroCtaPrimary?.en || ''}
                onChange={(e) => updateField('heroCtaPrimary.en', e.target.value)}
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* CORNER 4: INFINITE BRAND TICKER                      */}
        {/* ---------------------------------------------------- */}
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
              <span>{lang === 'ar' ? '📍 أسفل الهيرو مباشرة' : '📍 Below Hero Section'}</span>
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                {lang === 'ar' ? 'قائمة الماركات المعروضة في الشريط:' : 'Ticker Brand Names:'}
              </label>
              <FieldResetBtn path="brandTicker" descAr="شريط الماركات" descEn="Brand Ticker" />
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

            {/* Quick Add Brand */}
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

        {/* ---------------------------------------------------- */}
        {/* CORNER 5: CATEGORIES FILTER                          */}
        {/* ---------------------------------------------------- */}
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
              <span>{lang === 'ar' ? '📍 أعلى كتالوج المنتجات' : '📍 Above Products Catalog'}</span>
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
                {lang === 'ar' ? '✨ كافة المنتجات' : '✨ All Products'}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
                {lang === 'ar' ? '🌿 العناية بالبشرة' : '🌿 Skincare Formulations'}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
                {lang === 'ar' ? '⚡ أجهزة الشعر' : '⚡ Hair Styling Devices'}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
                {lang === 'ar' ? '🎁 بكجات التوفير' : '🎁 Value Bundles'}
              </span>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* CORNER 6: SMART SKIN ROUTINE DIAGNOSIS               */}
        {/* ---------------------------------------------------- */}
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
                <p className="text-xs text-slate-500">
                  {c6Info.desc[lang]}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl flex items-center gap-1.5 w-fit">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'ar' ? '📍 منتصف المتجر' : '📍 Mid-Storefront'}</span>
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

        {/* ---------------------------------------------------- */}
        {/* CORNER 7: PRODUCTS CATALOG & PRICING                 */}
        {/* ---------------------------------------------------- */}
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
              <span>{lang === 'ar' ? '📍 قلب المتجر الحي' : '📍 Storefront Center Grid'}</span>
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

        {/* ---------------------------------------------------- */}
        {/* CORNER 8: DUAL CAMPAIGN PROMO BANNERS                */}
        {/* ---------------------------------------------------- */}
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
              <span>{lang === 'ar' ? '📍 أسفل شبكة المنتجات' : '📍 Below Products Grid'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1 */}
            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 block">{lang === 'ar' ? 'الصندوق الترويجي الأول (بوكس 1)' : 'Promo Box 1'}</span>
                <FieldResetBtn path="promoBanner.image1" descAr="صورة العرض 1" descEn="Promo Box 1" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => promo1FileInputRef.current?.click()}
                  className="h-10 px-3 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'رفع' : 'Upload'}</span>
                </button>
                <input
                  type="url"
                  value={activePreset.promoBanner?.image1 || ''}
                  onChange={(e) => updateField('promoBanner.image1', e.target.value)}
                  placeholder="https://..."
                  className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                />
                {activePreset.promoBanner?.image1 && (
                  <img src={activePreset.promoBanner.image1} alt="Promo 1" className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                )}
              </div>
            </div>

            {/* Box 2 */}
            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 block">{lang === 'ar' ? 'الصندوق الترويجي الثاني (بوكس 2)' : 'Promo Box 2'}</span>
                <FieldResetBtn path="promoBanner.image2" descAr="صورة العرض 2" descEn="Promo Box 2" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => promo2FileInputRef.current?.click()}
                  className="h-10 px-3 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'رفع' : 'Upload'}</span>
                </button>
                <input
                  type="url"
                  value={activePreset.promoBanner?.image2 || ''}
                  onChange={(e) => updateField('promoBanner.image2', e.target.value)}
                  placeholder="https://..."
                  className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                />
                {activePreset.promoBanner?.image2 && (
                  <img src={activePreset.promoBanner.image2} alt="Promo 2" className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* CORNER 9: HAIR DEVICES SPOTLIGHT & TRIO BANNERS      */}
        {/* ---------------------------------------------------- */}
        <div id="corner-9" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                9
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{lang === 'ar' ? `الركن التاسع: ${c9Info.name.ar}` : `Corner 9: ${c9Info.name.en}`}</span>
                </h2>
                <p className="text-xs text-slate-500">
                  {c9Info.desc[lang]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl flex items-center gap-1.5 w-fit">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>{c9Info.tag[lang]}</span>
              </span>
              <FieldResetBtn path="trioBanners" descAr="بنرات الماركات الثلاثية" descEn="Brand Trio Banners" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trioBannersList.map((banner, bIdx) => (
              <div key={banner.id || bIdx} className="bg-slate-50/70 p-5 rounded-3xl border border-slate-200/80 space-y-4">
                {/* Live Card Preview */}
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

                {/* Edit Controls */}
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
                        onClick={() => {
                          setActiveTrioIdx(bIdx);
                          trioBannerFileInputRef.current?.click();
                        }}
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

        {/* ---------------------------------------------------- */}
        {/* CORNER 10: BEFORE & AFTER VISUAL PROOF               */}
        {/* ---------------------------------------------------- */}
        <div id="corner-10" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                10
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Star className="w-4 h-4 text-purple-600" />
                  <span>{lang === 'ar' ? `الركن العاشر: ${c10Info.name.ar}` : `Corner 10: ${c10Info.name.en}`}</span>
                </h2>
                <p className="text-xs text-slate-500">
                  {c10Info.desc[lang]}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl flex items-center gap-1.5 w-fit">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'ar' ? '📍 سلايدر النتائج الحقيقية' : '📍 Real Results Section'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 block">{lang === 'ar' ? 'صورة (قبل - Before):' : 'Before Photo:'}</span>
                <FieldResetBtn path="beforeAfterMedia.beforeImage" descAr="صورة قبل" descEn="Before Photo" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => beforeImgFileInputRef.current?.click()}
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
                <FieldResetBtn path="beforeAfterMedia.afterImage" descAr="صورة بعد" descEn="After Photo" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => afterImgFileInputRef.current?.click()}
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

        {/* ---------------------------------------------------- */}
        {/* CORNER 11: CUSTOMER TESTIMONIALS                     */}
        {/* ---------------------------------------------------- */}
        <div id="corner-11" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                11
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{lang === 'ar' ? 'الركن الحادي عشر: آراء وتقييمات العملاء الموثقة' : 'Corner 11: Customer Testimonials'}</span>
                </h2>
                <p className="text-xs text-slate-500">
                  {lang === 'ar' ? 'تجارب وآراء العميلات، الأسماء، المدن، وصور الأفاتار' : 'Customer reviews, star ratings, verified badges, and testimonials'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl flex items-center gap-1.5 w-fit">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>{lang === 'ar' ? '📍 سلايدر آراء العملاء' : '📍 Reviews Section'}</span>
              </span>
              <FieldResetBtn path="testimonials" descAr="آراء العملاء" descEn="Testimonials" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonialsList.map((t, tIdx) => (
              <div key={t.id || tIdx} className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block">{lang === 'ar' ? 'رابط الأفاتار:' : 'Avatar URL:'}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={t.avatar || ''}
                      onChange={(e) => updateTestimonial(tIdx, 'avatar', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 h-8 px-2 bg-white border border-slate-200 rounded-lg text-[11px] font-mono"
                    />
                    {t.avatar && (
                      <img src={t.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block">{lang === 'ar' ? 'الاسم:' : 'Name:'}</label>
                    <input
                      type="text"
                      value={t.name?.ar || ''}
                      onChange={(e) => updateTestimonial(tIdx, 'name.ar', e.target.value)}
                      className="w-full h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block">{lang === 'ar' ? 'المدينة:' : 'City:'}</label>
                    <input
                      type="text"
                      value={t.city?.ar || ''}
                      onChange={(e) => updateTestimonial(tIdx, 'city.ar', e.target.value)}
                      className="w-full h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block">{lang === 'ar' ? 'نص التقييم:' : 'Review Text:'}</label>
                  <textarea
                    rows={3}
                    value={t.comment?.ar || ''}
                    onChange={(e) => updateTestimonial(tIdx, 'comment.ar', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* CORNER 12: STORE VALUE PROPS & TRUST SHIELD          */}
        {/* ---------------------------------------------------- */}
        <div id="corner-12" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                12
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>{lang === 'ar' ? 'الركن الثاني عشر: شريط مزايا المتجر وشارات الأمان' : 'Corner 12: Store Value Props'}</span>
                </h2>
                <p className="text-xs text-slate-500">
                  {lang === 'ar' ? 'مزايا الضمان الذهبي، التوصيل السريع، والأصالة النباتية 100%' : 'Trust badges, certified warranty, fast delivery, and purity guarantees'}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl flex items-center gap-1.5 w-fit">
              <MapPin className="w-3.5 h-3.5 text-slate-600" />
              <span>{lang === 'ar' ? '📍 أعلى تذييل المتجر' : '📍 Above Store Footer'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'ar' ? 'ضمان سنتين شامل معتمد 🛡️' : 'Certified 2-Year Warranty 🛡️'}</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                {lang === 'ar' ? 'يظهر تلقائياً على كافة كروت أجهزة الشعر والجمال لتعزيز قرار الشراء.' : 'Displays on hair styling hardware devices.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
              <div className="flex items-center gap-2 text-purple-800 font-bold text-xs">
                <Award className="w-4 h-4 text-purple-600" />
                <span>{lang === 'ar' ? 'نقاء نباتي أصلي 100% 🌿' : '100% Pure Botanical 🌿'}</span>
              </div>
              <p className="text-[11px] text-purple-700 leading-relaxed">
                {lang === 'ar' ? 'يظهر تلقائياً على كافة كروت سيرومات ومنتجات العناية بالبشرة.' : 'Displays on botanical skincare products.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                <Truck className="w-4 h-4 text-amber-600" />
                <span>{lang === 'ar' ? 'شحن فوري ومتابعة واتساب 🚚' : 'Instant Delivery Hotline 🚚'}</span>
              </div>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                {lang === 'ar' ? 'ربط فوري بأرقام التوصيل والشحن مع رسائل تأكيد آلية.' : 'Instant delivery updates and WhatsApp alerts.'}
              </p>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* CORNER 13: FOOTER & CONTACT INFORMATION              */}
        {/* ---------------------------------------------------- */}
        <div id="corner-13" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                13
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-purple-600" />
                  <span>{lang === 'ar' ? 'الركن الثالث عشر: تذييل المتجر وروابط التواصل (Footer & WhatsApp)' : 'Corner 13: Footer & Contact Info'}</span>
                </h2>
                <p className="text-xs text-slate-500">
                  {lang === 'ar' ? 'رقم الواتساب الرسمي، الهاتف، البريد، العنوان، نبذة من نحن، وروابط السوشيال ميديا' : 'WhatsApp hotline, phone, email, address, about story, and social links'}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl flex items-center gap-1.5 w-fit">
              <MapPin className="w-3.5 h-3.5 text-slate-600" />
              <span>{lang === 'ar' ? '📍 قاع المتجر (التذييل)' : '📍 Bottom Footer'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  {lang === 'ar' ? 'رقم الواتساب الرسمي (بدون + أو مسافات):' : 'Official WhatsApp Hotline:'}
                </label>
                <FieldResetBtn path="contactInfo.whatsapp" descAr="رقم الواتساب" descEn="WhatsApp Hotline" />
              </div>
              <input
                type="text"
                value={activePreset.contactInfo?.whatsapp || ''}
                onChange={(e) => updateField('contactInfo.whatsapp', e.target.value)}
                placeholder="249900776688"
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  {lang === 'ar' ? 'رقم الهاتف المباشر:' : 'Phone Number:'}
                </label>
                <FieldResetBtn path="contactInfo.phone" descAr="رقم الهاتف" descEn="Phone Number" />
              </div>
              <input
                type="text"
                value={activePreset.contactInfo?.phone || ''}
                onChange={(e) => updateField('contactInfo.phone', e.target.value)}
                placeholder="+249 900 77 66 88"
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  {lang === 'ar' ? 'البريد الإلكتروني للدعم:' : 'Support Email:'}
                </label>
                <FieldResetBtn path="contactInfo.email" descAr="البريد الإلكتروني" descEn="Support Email" />
              </div>
              <input
                type="email"
                value={activePreset.contactInfo?.email || ''}
                onChange={(e) => updateField('contactInfo.email', e.target.value)}
                placeholder="care@nadi.sd"
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  {lang === 'ar' ? 'عنوان المعرض أو المقر:' : 'Store Physical Address:'}
                </label>
                <FieldResetBtn path="contactInfo.address.ar" descAr="عنوان المتجر" descEn="Address (AR)" />
              </div>
              <input
                type="text"
                value={activePreset.contactInfo?.address?.ar || ''}
                onChange={(e) => updateField('contactInfo.address.ar', e.target.value)}
                placeholder="الخرطوم - الرياض، تقاطع شارع المشتل مع الجزار"
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* About Story */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 block">
                {lang === 'ar' ? 'نبذة من نحن في تذييل المتجر (About Story):' : 'About Store Story (Footer):'}
              </label>
              <FieldResetBtn path="aboutStory.body.ar" descAr="نبذة المتجر" descEn="About Story" />
            </div>
            <textarea
              rows={3}
              value={preset.aboutStory?.body?.ar || ''}
              onChange={(e) => updateField('aboutStory.body.ar', e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed resize-none"
            />
          </div>

          {/* Social Links */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <label className="text-xs font-bold text-slate-800 block">
              {lang === 'ar' ? 'روابط شبكات التواصل الاجتماعي (Social Links):' : 'Social Media Accounts:'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Instagram:</label>
                <input
                  type="text"
                  value={preset.socialLinks?.instagram || ''}
                  onChange={(e) => updateField('socialLinks.instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">TikTok:</label>
                <input
                  type="text"
                  value={preset.socialLinks?.tiktok || ''}
                  onChange={(e) => updateField('socialLinks.tiktok', e.target.value)}
                  placeholder="https://tiktok.com/@..."
                  className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Twitter / X:</label>
                <input
                  type="text"
                  value={preset.socialLinks?.twitter || ''}
                  onChange={(e) => updateField('socialLinks.twitter', e.target.value)}
                  placeholder="https://x.com/..."
                  className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
