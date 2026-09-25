import React, { useState } from 'react';
import { 
  Shield, KeyRound, Sparkles, Sliders, Palette, Layout, 
  Eye, EyeOff, Lock, AlertTriangle, Check, RefreshCw, 
  Smartphone, Watch, Shirt, Glasses, RotateCcw, Layers, Droplets, Star, ShoppingBag, Image,
  Copy, Trash2, CheckCircle2, ChevronRight, Plus, ExternalLink, Phone, Mail, MapPin, MessageCircle, ArrowUpRight,
  Download, Upload, Code2, Type, FileJson, CheckCircle, HelpCircle, Sparkle
} from 'lucide-react';
import { useCommerce, SectionVisibilityMap } from '../context/CommerceContext';
import { 
  curatedPalettes, curatedTypographyPairs, curatedImportableTemplates, 
  ImportableTemplate, ColorPalette, TypographyPair, PresetNiche 
} from '../data/siteConfig';

export const DeveloperPanel: React.FC = () => {
  const { 
    lang, isDevAuthenticated, loginDeveloper, logoutDeveloper, 
    activePresetId, setActivePresetId, dynamicConfig, setDynamicConfig, 
    isDeveloperModeLocked, toggleLockDeveloperMode, setCurrentRoute, 
    showToast, sectionsControl, toggleSection, resetSections,
    activePaletteId, setActivePaletteId, customPalette, setCustomPalette,
    activeTypographyId, setActiveTypographyId, importTemplate, exportCurrentTemplate,
    savedCustomTemplates, saveCurrentAsTemplate, deleteSavedTemplate, loadSavedTemplate
  } = useCommerce();

  const isRtl = lang === 'ar';
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'templates' | 'colors' | 'typography' | 'sections' | 'content' | 'security'>('presets');

  // Custom template import/export state
  const [customCodeInput, setCustomCodeInput] = useState('');
  const [templateSaveName, setTemplateSaveName] = useState('');
  const [codeValidationStatus, setCodeValidationStatus] = useState<{
    status: 'idle' | 'valid' | 'invalid';
    message: string;
    details?: { storeName?: string; productsCount?: number; themeDetected?: boolean };
  }>({ status: 'idle', message: '' });
  const [isExportCopied, setIsExportCopied] = useState(false);

  // Custom palette builder state
  const currentActivePalette = curatedPalettes.find(p => p.id === activePaletteId) || curatedPalettes[0];
  const [customPrimary, setCustomPrimary] = useState(customPalette?.primary || currentActivePalette.primary);
  const [customAccent, setCustomAccent] = useState(customPalette?.accent || currentActivePalette.accent);
  const [customSurface, setCustomSurface] = useState(customPalette?.surface || currentActivePalette.surface);

  // Security Gate
  if (!isDevAuthenticated) {
    const handlePinSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const success = loginDeveloper(pinInput);
      if (!success) {
        setPinError(true);
        setPinInput('');
      } else {
        setPinError(false);
      }
    };

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-2xl mx-auto flex items-center justify-center border border-amber-500/40">
            <Shield className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold text-white">
              {lang === 'ar' ? 'بوابة المطور البرمجية العليا (/developer)' : 'Supreme Developer Console (/developer)'}
            </h2>
            <p className="text-xs text-amber-200/80">
              {lang === 'ar'
                ? 'محمية برمز رئيسي من 6 أرقام (الافتراضي: 998877)'
                : 'Secured by 6-digit Master Key (Default: 998877)'}
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="relative">
              <KeyRound className="w-5 h-5 text-amber-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••••"
                className={`w-full ps-11 pe-4 py-3 text-center tracking-[1em] text-lg font-mono font-bold bg-slate-800 text-white border rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                  pinError ? 'border-rose-500 bg-rose-950/40' : 'border-slate-700'
                }`}
                autoFocus
              />
            </div>

            {pinError && (
              <p className="text-xs font-semibold text-rose-400">
                {lang === 'ar' ? 'رمز المطور غير صحيح. حاول مجدداً.' : 'Invalid Master PIN. Please retry.'}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 rounded-2xl font-black text-sm shadow-lg transition-all min-h-[48px]"
            >
              {lang === 'ar' ? 'تأكيد الدخول للنواة' : 'Authenticate Console'}
            </button>
          </form>

          <button
            onClick={() => setCurrentRoute('store')}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            {lang === 'ar' ? 'الرجوع للمتجر' : 'Return to Storefront'}
          </button>
        </div>
      </div>
    );
  }

  const presetsList = [
    {
      id: 'cosmetics' as const,
      name: { ar: 'متجر التجميل والعناية (So Beauty)', en: 'Cosmetics & Skincare (So Beauty)' },
      desc: { ar: 'تنسيق ناعم، ألوان باستيل لافندر، قسم للبشرة ومقارنة قبل وبعد.', en: 'Pastel lavender, dewy aesthetics, skin routine picker, before/after proof.' },
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'fashion' as const,
      name: { ar: 'متجر أزياء وملابس (Elegance)', en: 'High Fashion & Apparel (Elegance)' },
      desc: { ar: 'تصميم أنيق داكن، شبكة صور عريضة، وبكجات تسوق الإطلالة.', en: 'Editorial minimalism, Italian tailoring, Shop The Look bundle.' },
      icon: Shirt,
      color: 'from-neutral-700 to-stone-900'
    },
    {
      id: 'eyewear' as const,
      name: { ar: 'متجر نظارات وبصريات (Vision)', en: 'Optics & Eyewear (Vision)' },
      desc: { ar: 'حواف رقيقة، تفاصيل أبعاد الإطار، ومحاكي كاميرا الواقع المعزز AR.', en: 'Bespoke titanium frames with live virtual AR try-on camera.' },
      icon: Glasses,
      color: 'from-cyan-600 to-slate-900'
    },
    {
      id: 'electronics' as const,
      name: { ar: 'متجر أجهزة وإلكترونيات (TechZone)', en: 'Gadgets & Electronics (TechZone)' },
      desc: { ar: 'ثيم تكنولوجي حديث، جدول مواصفات متقدم، وتنبيهات الحجز المسبق.', en: 'High-tech matrix, tech specs accordion, zero-stock WhatsApp override.' },
      icon: Watch,
      color: 'from-blue-600 to-indigo-800'
    }
  ];

  const sectionsList: {
    key: keyof SectionVisibilityMap;
    title: { ar: string; en: string };
    desc: { ar: string; en: string };
    icon: any;
    tag: { ar: string; en: string };
  }[] = [
    {
      key: 'hero',
      title: { ar: 'البنر الرئيسي للهيرو', en: 'Hero Section' },
      desc: { ar: 'العنوان البارز، الشعار الترويجي، وأزرار توجيه العميل المباشرة.', en: 'Primary headline, slogan badge, and main call-to-action buttons.' },
      icon: Sparkles,
      tag: { ar: 'رئيسي', en: 'Core' }
    },
    {
      key: 'brandTicker',
      title: { ar: 'شريط الماركات المتحرك', en: 'Brand & Slogan Ticker' },
      desc: { ar: 'شريط لامتناهي متحرك يعرض هوية المتجر والماركات المعتمدة.', en: 'Smooth infinite loop showcasing brand credentials & marquee slogans.' },
      icon: RefreshCw,
      tag: { ar: 'هوية', en: 'Branding' }
    },
    {
      key: 'valueProps',
      title: { ar: 'شريط المزايا والقيمة', en: 'Value Propositions Strip' },
      desc: { ar: 'شريط الضمانات الأربعة: نتائج فعالة، شحن سريع، أصلية 100%، دفع آمن.', en: '4-pillar trust badges: Proven Results, Fast Shipping, 100% Original, Secure COD.' },
      icon: Shield,
      tag: { ar: 'ثقة', en: 'Trust' }
    },
    {
      key: 'routineDiagnosis',
      title: { ar: 'تشخيص البشرة الذكي', en: 'Smart Skin Routine Diagnosis' },
      desc: { ar: 'بطاقات التصفية التفاعلية الأربعة لاختيار الروتين الملائم للبشرة.', en: '4 interactive solution cards filtering products by tailored skin needs.' },
      icon: Droplets,
      tag: { ar: 'تفاعلي', en: 'Interactive' }
    },
    {
      key: 'productsCatalog',
      title: { ar: 'كتالوج المنتجات وفلاتر التصنيف', en: 'Products Grid & Filters' },
      desc: { ar: 'شبكة المنتجات الرئيسية مع فلاتر التصنيف وشارات الخصم وأزرار الشراء.', en: 'Dynamic products catalog with live sorting, filter pills & discount badges.' },
      icon: ShoppingBag,
      tag: { ar: 'تجارة', en: 'Commerce' }
    },
    {
      key: 'hairDevices',
      title: { ar: 'أجهزة الشعر وبنرات الماركات', en: 'Hair Devices & Brand Spotlight' },
      desc: { ar: 'بنرات الماركات (سيل تك، أوكيما، كلارا) مع تبويبات الأجهزة وتصفحها.', en: 'Styling devices carousel with brand spotlight banners & tabbed categories.' },
      icon: Layers,
      tag: { ar: 'تسويق', en: 'Spotlight' }
    },
    {
      key: 'promoBanner',
      title: { ar: 'البنر الترويجي للحملات', en: 'Promo Campaign Banner' },
      desc: { ar: 'بنر حملة المكونات الطبيعية والبوكسات مع نسبة الخصم والصور المميزة.', en: 'High-impact editorial campaign banner with gift boxes and special discounts.' },
      icon: Image,
      tag: { ar: 'حملات', en: 'Campaign' }
    },
    {
      key: 'beforeAfter',
      title: { ar: 'مقارنة قبل وبعد التفاعلية', en: 'Before & After Transformation Slider' },
      desc: { ar: 'سلايدر السحب التفاعلي لمقارنة نضارة البشرة قبل وبعد 14 يوماً.', en: 'Interactive touch slider comparing real photographic results over 14 days.' },
      icon: Eye,
      tag: { ar: 'مصداقية', en: 'Social Proof' }
    },
    {
      key: 'testimonials',
      title: { ar: 'شهادات وتقييمات العميلات', en: 'Customer Reviews Carousel' },
      desc: { ar: 'شهادات موثقة مع تقييم 5 نجوم وتفاصيل المنتجات المقتناة وزر المشاركة.', en: 'Verified buyer testimonials with product tags, helpful voting & modal submit.' },
      icon: Star,
      tag: { ar: 'تقييمات', en: 'Reviews' }
    },
  ];

  const currentPresetData = dynamicConfig.presets[activePresetId];

  const [clonedSections, setClonedSections] = useState<Record<string, boolean>>({});

  // Inline content updater
  const handleUpdateText = (field: string, subfield: string, val: string) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      if (!clone.presets[activePresetId][field]) {
        clone.presets[activePresetId][field] = {};
      }
      clone.presets[activePresetId][field][subfield] = val;
      return clone;
    });
  };

  const handleUpdateDirect = (field: string, val: string) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      clone.presets[activePresetId][field] = val;
      return clone;
    });
  };

  const handleUpdateContact = (field: string, val: string) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      clone.presets[activePresetId].contactInfo[field] = val;
      return clone;
    });
  };

  const handleUpdateLogo = (val: string) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      clone.presets[activePresetId].storeLogo = val;
      return clone;
    });
  };

  const handleToggleClone = (key: string, title: string) => {
    setClonedSections((prev) => {
      const nextState = !prev[key];
      showToast(lang === 'ar' 
        ? (nextState ? `تم استنساخ قسم: ${title} وإدراجه كنسخة ثانية` : `تم إزالة النسخة المستنسخة من قسم: ${title}`)
        : (nextState ? `Cloned extra instance of: ${title}` : `Removed duplicate instance of: ${title}`)
      );
      return { ...prev, [key]: nextState };
    });
  };

  const handleDeleteSection = (key: keyof SectionVisibilityMap, title: string) => {
    if (sectionsControl[key]) {
      toggleSection(key);
    }
    showToast(lang === 'ar' ? `تم حذف / إخفاء قسم: ${title}` : `Deleted / Hidden section: ${title}`);
  };

  const handleShowAllSections = () => {
    sectionsList.forEach((s) => {
      if (!sectionsControl[s.key]) {
        toggleSection(s.key);
      }
    });
    showToast(lang === 'ar' ? 'تم تفعيل وإظهار كافة الأقسام بنجاح' : 'All sections enabled successfully');
  };

  // Template Importer & Code Adapter Helpers
  const handleValidateCustomCode = () => {
    if (!customCodeInput.trim()) {
      setCodeValidationStatus({
        status: 'invalid',
        message: lang === 'ar' ? 'الرجاء إدخال أو لصق كود القالب أولاً.' : 'Please enter or paste template code first.'
      });
      return;
    }
    try {
      const parsed = JSON.parse(customCodeInput);
      const data: PresetNiche = parsed.presetData || parsed;
      if (!data.storeName || !data.products) {
        setCodeValidationStatus({
          status: 'invalid',
          message: lang === 'ar' 
            ? 'الكود غير مطابق: لم يتم العثور على اسم المتجر (storeName) أو مصفوفة المنتجات (products).'
            : 'Validation error: Missing storeName or products array in payload.'
        });
        return;
      }
      setCodeValidationStatus({
        status: 'valid',
        message: lang === 'ar' ? 'الكود سليم ومتوافق برمجياً 100%! جاهز للتطويع والدمج الفوري.' : 'Code is valid and 100% compatible! Ready for adaptation.',
        details: {
          storeName: (data.storeName as any)[lang] || data.storeName.ar || data.storeName.en,
          productsCount: data.products?.length || 0,
          themeDetected: !!data.theme
        }
      });
    } catch (e: any) {
      setCodeValidationStatus({
        status: 'invalid',
        message: lang === 'ar' ? `خطأ في صياغة JSON: ${e.message}` : `Syntax error: ${e.message}`
      });
    }
  };

  const handleApplyCustomCode = () => {
    const res = importTemplate(customCodeInput);
    if (res.success) {
      showToast(res.message);
      setCodeValidationStatus({ status: 'idle', message: '' });
      setCustomCodeInput('');
    } else {
      showToast(res.message);
    }
  };

  const handleLoadDemoTemplate = () => {
    const demo = curatedImportableTemplates[0];
    const demoJson = JSON.stringify(demo, null, 2);
    setCustomCodeInput(demoJson);
    try {
      const parsed = JSON.parse(demoJson);
      setCodeValidationStatus({
        status: 'valid',
        message: lang === 'ar' ? 'تم تجهيز نموذج كود عطور ملكي تجريبي بنجاح!' : 'Demo royal perfume template loaded successfully!',
        details: {
          storeName: parsed.name[lang],
          productsCount: parsed.presetData.products.length,
          themeDetected: true
        }
      });
    } catch (e) {}
    showToast(lang === 'ar' ? 'تم تحميل نموذج قالب عطور ملكي تجريبي' : 'Loaded royal perfume demo template');
  };

  const handleCopyExport = async () => {
    const exported = exportCurrentTemplate();
    try {
      await navigator.clipboard.writeText(exported);
      setIsExportCopied(true);
      showToast(lang === 'ar' ? 'تم نسخ كود القالب الحالي كـ JSON إلى الحافظة' : 'Template code copied to clipboard');
      setTimeout(() => setIsExportCopied(false), 3000);
    } catch (e) {
      showToast(lang === 'ar' ? 'تعذر النسخ التلقائي' : 'Failed to copy to clipboard');
    }
  };

  const handleDownloadExport = () => {
    const exported = exportCurrentTemplate();
    const blob = new Blob([exported], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `store-template-${activePresetId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(lang === 'ar' ? 'تم تحميل ملف القالب بنجاح' : 'Template file downloaded');
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateSaveName.trim()) {
      showToast(lang === 'ar' ? 'يرجى كتابة اسم للقالب لحفظه في الخزينة' : 'Please specify a name to save the template');
      return;
    }
    saveCurrentAsTemplate(templateSaveName, templateSaveName);
    setTemplateSaveName('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCustomCodeInput(content);
        const res = importTemplate(content);
        if (res.success) {
          showToast(lang === 'ar' ? 'تم استيراد ملف القالب وتطويعه بنجاح!' : 'Template file uploaded & adapted!');
        } else {
          showToast(res.message);
        }
      }
    };
    reader.readAsText(file);
  };

  // Color Palette Helpers
  const handleSaveCustomPalette = () => {
    setCustomPalette({
      primary: customPrimary,
      accent: customAccent,
      surface: customSurface
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
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Top Developer Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                MASTER DEVELOPER ENGINE v2.8 PRO
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {lang === 'ar' ? 'محرك التحكم المعماري وتطويع القوالب' : 'Architecture & Template Normalizer Studio'}
            </h1>
            <p className="text-xs text-slate-400">
              {lang === 'ar' ? 'النشاط المفعّل حالياً:' : 'Active Niche:'}{' '}
              <span className="font-bold text-amber-300">{currentPresetData.nicheLabel[lang]}</span>
              {' · '}
              {lang === 'ar' ? 'باليت الألوان:' : 'Color Palette:'}{' '}
              <span className="font-semibold text-rose-300">{currentActivePalette.name[lang]}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentRoute('store')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              🏪 {lang === 'ar' ? 'معاينة المتجر حياً' : 'Preview Storefront'}
            </button>
            <button
              onClick={logoutDeveloper}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition-colors"
            >
              🔒 {lang === 'ar' ? 'قفل الخروج' : 'Lock Console'}
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2.5 border-b border-slate-800 pb-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'presets'
                ? 'bg-amber-500 text-slate-950 shadow-lg font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>{lang === 'ar' ? 'الأنشطة الرباعية (Presets)' : 'Presets'}</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'templates'
                ? 'bg-amber-500 text-slate-950 shadow-lg font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>{lang === 'ar' ? 'مستورد ومطوع القوالب (Templates & Code Adapter)' : 'Template Importer & Adapter'}</span>
          </button>

          <button
            onClick={() => setActiveTab('colors')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'colors'
                ? 'bg-amber-500 text-slate-950 shadow-lg font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>{lang === 'ar' ? 'منظومة الألوان المتجانسة (Color Harmony)' : 'Color Harmony System'}</span>
          </button>

          <button
            onClick={() => setActiveTab('typography')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'typography'
                ? 'bg-amber-500 text-slate-950 shadow-lg font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>{lang === 'ar' ? 'منظومة الخطوط المتجانسة (Typography)' : 'Typography Pairs'}</span>
          </button>

          <button
            onClick={() => setActiveTab('sections')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'sections'
                ? 'bg-amber-500 text-slate-950 shadow-lg font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{lang === 'ar' ? 'إدارة الأقسام (Sections)' : 'Sections'}</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'content'
                ? 'bg-amber-500 text-slate-950 shadow-lg font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sparkle className="w-4 h-4" />
            <span>{lang === 'ar' ? 'المحتوى والشعار (CMS)' : 'Live CMS'}</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-rose-500 text-white shadow-lg font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{lang === 'ar' ? 'الحماية والتأمين (Security)' : 'Security Guard'}</span>
          </button>
        </div>

        {/* TAB 1: 4-NICHE PRESET SWITCHER */}
        {activeTab === 'presets' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400">
              💡 {lang === 'ar'
                ? 'بنقرة زر واحدة يتحول الهيكل البرمجي بالكامل، الخطوط، الألوان، المنتجات، ونظام العرض لتناسب القطاع المختار.'
                : 'One click shifts typography, colors, datasets, and layout behaviors across the entire web app.'}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {presetsList.map((preset) => {
                const Icon = preset.icon;
                const isActive = activePresetId === preset.id;

                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      setActivePresetId(preset.id);
                      showToast(lang === 'ar' ? `تم التبديل بنجاح إلى: ${preset.name.ar}` : `Switched to ${preset.name.en}`);
                    }}
                    className={`relative p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'bg-slate-900 border-amber-400 shadow-xl shadow-amber-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute top-4 end-4 px-3 py-1 bg-amber-400 text-slate-950 font-black text-[11px] rounded-full flex items-center gap-1 shadow-md">
                        <Check className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'النشاط الفعّال حالياً' : 'ACTIVE'}</span>
                      </span>
                    )}

                    <div className="space-y-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${preset.color} flex items-center justify-center text-white shadow-lg`}>
                        <Icon className="w-6 h-6" />
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-lg font-extrabold text-white">
                          {preset.name[lang]}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {preset.desc[lang]}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500">
                        {dynamicConfig.presets[preset.id].products.length} {lang === 'ar' ? 'منتجات جاهزة' : 'products'}
                      </span>
                      <button
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                          isActive
                            ? 'bg-amber-400 text-slate-950 font-extrabold'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {isActive ? (lang === 'ar' ? 'قيد التشغيل' : 'In Use') : (lang === 'ar' ? 'تفعيل هذا النشاط' : 'Switch To This')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: TEMPLATES & CODE ADAPTER */}
        {activeTab === 'templates' && (
          <div className="space-y-8">
            {/* Architectural Strategy Banner */}
            <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Code2 className="w-4 h-4" />
                <span>{lang === 'ar' ? 'محرك استيراد وتطويع كود القوالب (Smart Normalizer & AST Adapter)' : 'Template Importer & Code Adapter Engine'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {lang === 'ar' ? 'سحب، تطويع، ودمج قوالب المتاجر الخارجية بأمان تام' : 'Seamlessly Import, Adapt & Hot-Swap Any Store Template'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                {lang === 'ar'
                  ? 'هل ترغب في جلب قالب من متجر خارجي ودمجه هنا دون حدوث تعارض أو انكسار في الأكواد؟ يقوم محرك الـ Adapter بمطابقة الحقول تلقائياً، وفحص صحة البنية (Schema Validation)، وتطهير الأكواد، ثم حقنها حياً في واجهة المتجر بنقرة زر واحدة دون الحاجة لإعادة كتابة كود المتجر.'
                  : 'Want to import an external store template without CSS clashes or broken logic? The AST Adapter normalizes sections, products, and styles, merging them safely into the live storefront with zero conflicts.'}
              </p>
            </div>

            {/* Section 1: Pre-Built Curated Templates Ready for 1-Click Import */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>{lang === 'ar' ? '١. قوالب تجارية حصرية جاهزة للاستيراد الفوري بنقرة واحدة' : '1. Curated Ready-to-Import Commercial Templates'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lang === 'ar' ? 'قوالب جاهزة متكاملة المنتجات والبنرات والقصص تم اختبارها وتطويعها هندسياً لتعمل فورياً.' : 'Fully adapted, tested turn-key templates ready for immediate live deployment.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {curatedImportableTemplates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-xl"
                  >
                    <div>
                      <div className="relative h-44 overflow-hidden bg-slate-950">
                        <img
                          src={tpl.previewImage}
                          alt={tpl.name[lang]}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                        <span className="absolute top-3 end-3 px-3 py-1 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-amber-300 text-[11px] font-black rounded-xl">
                          {tpl.badge[lang]}
                        </span>
                        <span className="absolute bottom-3 start-3 text-xs font-bold text-white/90 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                          {tpl.nicheLabel[lang]}
                        </span>
                      </div>

                      <div className="p-5 space-y-3">
                        <h4 className="text-base font-bold text-white">
                          {tpl.name[lang]}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed min-h-[44px]">
                          {tpl.description[lang]}
                        </p>

                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                          <span>{tpl.presetData.products.length} {lang === 'ar' ? 'منتجات جاهزة' : 'products'}</span>
                          <span>{tpl.presetData.valueProps.length} {lang === 'ar' ? 'مزايا موثقة' : 'value props'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <button
                        type="button"
                        onClick={() => {
                          const res = importTemplate(tpl);
                          if (res.success) {
                            showToast(lang === 'ar' ? `تم استيراد قالب (${tpl.name.ar}) بنجاح!` : `Imported ${tpl.name.en}!`);
                          }
                        }}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 rounded-2xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>{lang === 'ar' ? 'استيراد وتفعيل القالب فورياً' : 'Import & Apply Template'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Custom External Code Importer & AST Parser */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                    <Upload className="w-5 h-5 text-amber-400" />
                    <span>{lang === 'ar' ? '٢. محرر استيراد وتطويع كود القالب المخصص (Raw JSON / Code Importer)' : '2. Custom Raw Template Code Importer & AST Adapter'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lang === 'ar'
                      ? 'الصق كود قالب أي متجر خارجي هنا، وسيقوم المحرك بفحصه وتطويعه ليتوافق مع بنية المتجر بأمان.'
                      : 'Paste external store JSON or schema. The engine validates and normalizes fields seamlessly.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLoadDemoTemplate}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <FileJson className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'تحميل كود تجريبي لاختباره' : 'Load Demo Code'}</span>
                </button>
              </div>

              <div className="space-y-3">
                <textarea
                  rows={7}
                  value={customCodeInput}
                  onChange={(e) => {
                    setCustomCodeInput(e.target.value);
                    if (codeValidationStatus.status !== 'idle') {
                      setCodeValidationStatus({ status: 'idle', message: '' });
                    }
                  }}
                  placeholder={lang === 'ar' ? '{\n  "storeName": { "ar": "اسم المتجر", "en": "Store Name" },\n  "products": [ ... ],\n  "theme": { ... }\n}' : 'Paste store JSON structure here...'}
                  className="w-full p-4 bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 leading-relaxed"
                  dir="ltr"
                />

                {codeValidationStatus.status !== 'idle' && (
                  <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
                    codeValidationStatus.status === 'valid'
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                  }`}>
                    {codeValidationStatus.status === 'valid' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <span className="font-bold block">{codeValidationStatus.message}</span>
                      {codeValidationStatus.details && (
                        <div className="flex flex-wrap gap-3 text-[11px] text-slate-300 pt-1">
                          <span>{lang === 'ar' ? 'اسم المتجر المكتشف:' : 'Detected Store:'} <strong>{codeValidationStatus.details.storeName}</strong></span>
                          <span>·</span>
                          <span>{lang === 'ar' ? 'عدد المنتجات:' : 'Products Count:'} <strong>{codeValidationStatus.details.productsCount}</strong></span>
                          <span>·</span>
                          <span>{lang === 'ar' ? 'الهوية البصرية:' : 'Visual Identity:'} <strong>{codeValidationStatus.details.themeDetected ? (lang === 'ar' ? 'متوفرة' : 'Present') : (lang === 'ar' ? 'افتراضية' : 'Default')}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleValidateCustomCode}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center gap-2 cursor-pointer min-h-[44px]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'ar' ? 'فحص وتحليل بنية الكود (Validate Schema)' : 'Validate Schema'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleApplyCustomCode}
                    disabled={codeValidationStatus.status !== 'valid'}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 min-h-[44px] ${
                      codeValidationStatus.status === 'valid'
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'تطويع ودمج الكود في المتجر المباشر' : 'Adapt & Merge Code Live'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Section 3: Save Current Restructured Template to Permanent Vault */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <span>{lang === 'ar' ? '٣. حفظ القالب المطور الحالي في الخزينة الدائمة (Save to Vault)' : '3. Save Restructured Template to Permanent Vault'}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'ar'
                    ? 'احفظ أي تعديل أو تطويع أجريته على القالب باسم خاص حتى لا يضيع أبداً، وتتمكن من الرجوع إليه في أي وقت بنقرة واحدة.'
                    : 'Save your restructured template with a custom name so it never gets lost, ready to restore anytime.'}
                </p>
              </div>

              <form onSubmit={handleSaveTemplate} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <input
                  type="text"
                  value={templateSaveName}
                  onChange={(e) => setTemplateSaveName(e.target.value)}
                  placeholder={lang === 'ar' ? 'اكتب اسماً مميزاً للقالب (مثال: قالب العطور الملكية 2026)...' : 'Enter a name for this template (e.g. Royal Oud Luxury 2026)...'}
                  className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[44px]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 min-h-[44px] cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'ar' ? '💾 حفظ القالب في الخزينة' : 'Save Template to Vault'}</span>
                </button>
              </form>

              {/* Saved Templates Grid */}
              {savedCustomTemplates.length > 0 && (
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-300 block">
                    {lang === 'ar' ? `قوالبك المحفوظة في الخزينة (${savedCustomTemplates.length}):` : `Your Saved Templates (${savedCustomTemplates.length}):`}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedCustomTemplates.map((savedTpl) => (
                      <div
                        key={savedTpl.id}
                        className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-white truncate">
                              {savedTpl.name[lang] || savedTpl.name.ar}
                            </span>
                            <span className="text-[10px] text-amber-400 font-mono">
                              {new Date(savedTpl.savedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 block">
                            {savedTpl.presetData.products?.length || 0} {lang === 'ar' ? 'منتجات محفوظة' : 'products'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                          <button
                            type="button"
                            onClick={() => loadSavedTemplate(savedTpl.id)}
                            className="flex-1 py-2 px-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer min-h-[38px]"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{lang === 'ar' ? 'تفعيل الآن' : 'Load'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const json = JSON.stringify(savedTpl, null, 2);
                              const blob = new Blob([json], { type: 'application/json' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${savedTpl.id}.json`;
                              a.click();
                              URL.revokeObjectURL(url);
                              showToast(lang === 'ar' ? 'تم تنزيل نسخة القالب' : 'Template downloaded');
                            }}
                            title={lang === 'ar' ? 'تحميل كملف JSON' : 'Download JSON'}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteSavedTemplate(savedTpl.id)}
                            title={lang === 'ar' ? 'حذف من الخزينة' : 'Delete'}
                            className="p-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded-xl transition-all cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Export Current Store Template & Direct File Upload */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1 max-w-xl">
                <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                  <Download className="w-5 h-5 text-amber-400" />
                  <span>{lang === 'ar' ? '٤. تصدير أو استيراد ملف القالب الكامل (.json)' : '4. Export or Upload Full Template File (.json)'}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'ar'
                    ? 'احصل على نسخة كاملة ونظيفة من كود القالب النشط الحالي لاستخدامه في متجر آخر أو ارفع ملف قالب محفوظ مسبقاً.'
                    : 'Export clean JSON snapshot of current store settings, or upload any previously exported JSON template file.'}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer min-h-[44px]">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'ar' ? 'رفع ملف (.json)' : 'Upload .json'}</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleCopyExport}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>{isExportCopied ? (lang === 'ar' ? 'تم النسخ بنجاح! ✓' : 'Copied! ✓') : (lang === 'ar' ? 'نسخ كود القالب كـ JSON' : 'Copy Template JSON')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadExport}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer min-h-[44px] shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'تحميل كملف (.json)' : 'Download .json'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: COLOR HARMONY SYSTEM */}
        {activeTab === 'colors' && (
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
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>{lang === 'ar' ? '١. باليتات الألوان الفاخرة المعتمدة (٦ منظومات متناسقة)' : '1. Curated Luxury Harmonious Palettes (6 Schemes)'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lang === 'ar' ? 'اختر أي منظومة لتطبيقها فورياً على كامل واجهة المتجر بنقرة زر واحدة.' : 'Select any palette to hot-swap colors across header, hero, cards, buttons & badges.'}
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
                          <span className="text-[11px] font-bold text-slate-400">
                            {palette.category[lang]}
                          </span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 rounded-md">
                            WCAG AA 4.5:1 Pass
                          </span>
                        </div>

                        <h4 className="text-sm font-extrabold text-white">
                          {palette.name[lang]}
                        </h4>

                        {/* Swatches visual */}
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
        )}

        {/* TAB: TYPOGRAPHY PAIRING SYSTEM */}
        {activeTab === 'typography' && (
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
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>{lang === 'ar' ? '١. التوليفات الخطية المتجانسة الأربعة المعتمدة' : '1. Curated Bilingual Font Pairs'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lang === 'ar' ? 'اختر أي توليفة ليتم تطبيقها فورياً على العناوين والمتن وقوائم المتجر.' : 'Click to instantly swap heading & body typography across the storefront.'}
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
                          <span className="text-[11px] font-bold text-slate-400">
                            {pair.category[lang]}
                          </span>
                          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 bg-blue-950/80 text-blue-300 border border-blue-800/60 rounded-md">
                            Line Height {pair.lineHeight} (Tashkeel Safe)
                          </span>
                        </div>

                        <h4 className="text-base font-extrabold text-white">
                          {pair.name[lang]}
                        </h4>

                        {/* Font breakdown */}
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

                        {/* Live Preview Sample */}
                        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                          <h5
                            style={{
                              fontFamily: lang === 'ar' ? `${pair.headingFamilyAr}, Cairo, serif` : `${pair.headingFamilyEn}, Playfair Display, serif`
                            }}
                            className="text-base sm:text-lg font-bold text-white leading-tight"
                          >
                            {pair.sampleHeading[lang]}
                          </h5>
                          <p
                            style={{
                              fontFamily: lang === 'ar' ? `${pair.bodyFamilyAr}, sans-serif` : `${pair.bodyFamilyEn}, sans-serif`,
                              lineHeight: pair.lineHeight
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
        )}

        {/* TAB 2: SECTIONS & BANNERS MANAGER */}
        {activeTab === 'sections' && (
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sectionsList.map((sec) => {
                const isVisible = sectionsControl[sec.key];
                const isCloned = !!clonedSections[sec.key];
                const Icon = sec.icon;

                return (
                  <div
                    key={sec.key}
                    className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-4 ${
                      isVisible 
                        ? 'bg-slate-900 border-slate-700/80 shadow-lg' 
                        : 'bg-slate-900/40 border-slate-800/80 opacity-60'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isVisible ? 'bg-amber-400/20 text-amber-400' : 'bg-slate-800 text-slate-500'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {sec.title[lang]}
                            </span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                              {sec.key}
                            </span>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isVisible 
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60' 
                            : 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
                        }`}>
                          {isVisible ? (lang === 'ar' ? 'معروض' : 'ACTIVE') : (lang === 'ar' ? 'مخفي' : 'HIDDEN')}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed min-h-[32px]">
                        {sec.desc[lang]}
                      </p>

                      {isCloned && (
                        <div className="px-2.5 py-1 bg-purple-950/60 border border-purple-800/60 rounded-lg text-[10px] text-purple-300 font-bold flex items-center gap-1.5">
                          <Copy className="w-3 h-3 text-purple-400" />
                          <span>{lang === 'ar' ? 'مفعل بنسخة مستنسخة إضافية في الواجهة' : 'Duplicate instance activated'}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      {/* Visibility Toggle Button */}
                      <button
                        type="button"
                        onClick={() => toggleSection(sec.key)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isVisible 
                            ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30' 
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold'
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

                      {/* Clone / Duplicate Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleClone(sec.key, sec.title[lang])}
                        title={lang === 'ar' ? 'استنساخ هذا القسم' : 'Clone section'}
                        className={`p-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          isCloned
                            ? 'bg-purple-600 text-white border-purple-500'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        }`}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(sec.key, sec.title[lang])}
                        title={lang === 'ar' ? 'حذف القسم من المتجر' : 'Remove section'}
                        className="p-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white border border-rose-800/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: INLINE CMS & TYPOGRAPHY */}
        {activeTab === 'content' && (
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
                🏷️ {lang === 'ar' ? '١. هوية المتجر والشعار (Store Branding & Identity)' : '1. Store Branding & Identity'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Store Name */}
                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <label className="text-xs font-bold text-slate-300 block">
                    {lang === 'ar' ? 'اسم المتجر (بالعربية):' : 'Store Name (Arabic):'}
                  </label>
                  <input
                    type="text"
                    value={currentPresetData.storeName.ar}
                    onChange={(e) => handleUpdateText('storeName', 'ar', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <label className="text-xs font-bold text-slate-300 block">
                    {lang === 'ar' ? 'اسم المتجر (بالإنجليزية):' : 'Store Name (English):'}
                  </label>
                  <input
                    type="text"
                    value={currentPresetData.storeName.en}
                    onChange={(e) => handleUpdateText('storeName', 'en', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                {/* Slogan */}
                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <label className="text-xs font-bold text-slate-300 block">
                    {lang === 'ar' ? 'شعار المتجر اللفظي (Slogan بالعربية):' : 'Store Slogan (Arabic):'}
                  </label>
                  <input
                    type="text"
                    value={currentPresetData.storeSlogan ? currentPresetData.storeSlogan.ar : ''}
                    onChange={(e) => handleUpdateText('storeSlogan', 'ar', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <label className="text-xs font-bold text-slate-300 block">
                    {lang === 'ar' ? 'شعار المتجر اللفظي (Slogan بالإنجليزية):' : 'Store Slogan (English):'}
                  </label>
                  <input
                    type="text"
                    value={currentPresetData.storeSlogan ? currentPresetData.storeSlogan.en : ''}
                    onChange={(e) => handleUpdateText('storeSlogan', 'en', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                {/* Announcement Bar */}
                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <label className="text-xs font-bold text-slate-300 block">
                    {lang === 'ar' ? 'شريط الإعلانات العلوي (Announcement بالعربية):' : 'Top Announcement (Arabic):'}
                  </label>
                  <input
                    type="text"
                    value={currentPresetData.topAnnouncement ? currentPresetData.topAnnouncement.ar : ''}
                    onChange={(e) => handleUpdateText('topAnnouncement', 'ar', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <label className="text-xs font-bold text-slate-300 block">
                    {lang === 'ar' ? 'شريط الإعلانات العلوي (Announcement بالإنجليزية):' : 'Top Announcement (English):'}
                  </label>
                  <input
                    type="text"
                    value={currentPresetData.topAnnouncement ? currentPresetData.topAnnouncement.en : ''}
                    onChange={(e) => handleUpdateText('topAnnouncement', 'en', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                {/* Store Logo Image URL */}
                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 block">
                      {lang === 'ar' ? 'رابط صورة الشعار (Store Logo Image URL):' : 'Store Logo Image URL:'}
                    </label>
                    {currentPresetData.storeLogo && (
                      <button
                        type="button"
                        onClick={() => handleUpdateLogo('')}
                        className="text-[11px] text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                      >
                        {lang === 'ar' ? 'مسح الشعار والعودة للاسم النصي' : 'Clear & Revert to Pure Text'}
                      </button>
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="https://... (Leave blank for text-only)"
                    value={currentPresetData.storeLogo || ''}
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
              <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                🌟 {lang === 'ar' ? '٢. نصوص وبنر الهيرو الرئيسي (Hero Banner & Headlines)' : '2. Hero Banner & Headlines'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Hero Title */}
                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <label className="text-xs font-bold text-slate-300 block">
                    {lang === 'ar' ? 'العنوان الرئيسي للهيرو (بالعربية):' : 'Hero Title (Arabic):'}
                  </label>
                  <input
                    type="text"
                    value={currentPresetData.heroTitle.ar}
                    onChange={(e) => handleUpdateText('heroTitle', 'ar', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <label className="text-xs font-bold text-slate-300 block">
                    {lang === 'ar' ? 'العنوان الرئيسي للهيرو (بالإنجليزية):' : 'Hero Title (English):'}
                  </label>
                  <input
                    type="text"
                    value={currentPresetData.heroTitle.en}
                    onChange={(e) => handleUpdateText('heroTitle', 'en', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                {/* Hero Subtitle */}
                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <label className="text-xs font-bold text-slate-300 block">
                    {lang === 'ar' ? 'العنوان الفرعي للهيرو (بالعربية):' : 'Hero Subtitle (Arabic):'}
                  </label>
                  <textarea
                    rows={2}
                    value={currentPresetData.heroSubtitle.ar}
                    onChange={(e) => handleUpdateText('heroSubtitle', 'ar', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none"
                  />
                </div>

                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <label className="text-xs font-bold text-slate-300 block">
                    {lang === 'ar' ? 'العنوان الفرعي للهيرو (بالإنجليزية):' : 'Hero Subtitle (English):'}
                  </label>
                  <textarea
                    rows={2}
                    value={currentPresetData.heroSubtitle.en}
                    onChange={(e) => handleUpdateText('heroSubtitle', 'en', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none"
                  />
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <label className="text-xs font-bold text-slate-300 block">
                    {lang === 'ar' ? 'زر الشراء الرئيسي (Primary CTA بالعربية):' : 'Primary CTA Button (Arabic):'}
                  </label>
                  <input
                    type="text"
                    value={currentPresetData.heroCtaPrimary ? currentPresetData.heroCtaPrimary.ar : ''}
                    onChange={(e) => handleUpdateText('heroCtaPrimary', 'ar', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <label className="text-xs font-bold text-slate-300 block">
                    {lang === 'ar' ? 'زر الشراء الرئيسي (Primary CTA بالإنجليزية):' : 'Primary CTA Button (English):'}
                  </label>
                  <input
                    type="text"
                    value={currentPresetData.heroCtaPrimary ? currentPresetData.heroCtaPrimary.en : ''}
                    onChange={(e) => handleUpdateText('heroCtaPrimary', 'en', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                {/* Hero Image */}
                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 md:col-span-2">
                  <label className="text-xs font-bold text-slate-300 block">
                    {lang === 'ar' ? 'رابط صورة بنر الهيرو الرئيسي (Hero Image URL):' : 'Hero Image URL:'}
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="url"
                      value={currentPresetData.heroImage || ''}
                      onChange={(e) => handleUpdateDirect('heroImage', e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                    {currentPresetData.heroImage && (
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
                📞 {lang === 'ar' ? '٣. بيانات التواصل والدعم الفني (Contact Channels & Support)' : '3. Contact Channels & Support'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* WhatsApp */}
                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'ar' ? 'رقم الواتساب الرسمي (مع رمز الدولة):' : 'Official WhatsApp Number:'}</span>
                  </label>
                  <input
                    type="text"
                    value={currentPresetData.contactInfo.whatsapp}
                    onChange={(e) => handleUpdateContact('whatsapp', e.target.value)}
                    placeholder="249912345678"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                    dir="ltr"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'ar' ? 'رقم الهاتف للاتصال المباشر:' : 'Direct Phone Number:'}</span>
                  </label>
                  <input
                    type="text"
                    value={currentPresetData.contactInfo.phone}
                    onChange={(e) => handleUpdateContact('phone', e.target.value)}
                    placeholder="+249 91 234 5678"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                    dir="ltr"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === 'ar' ? 'البريد الإلكتروني الرسمي:' : 'Official Email Address:'}</span>
                  </label>
                  <input
                    type="email"
                    value={currentPresetData.contactInfo.email}
                    onChange={(e) => handleUpdateContact('email', e.target.value)}
                    placeholder="contact@store.com"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                    dir="ltr"
                  />
                </div>

                {/* Address */}
                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{lang === 'ar' ? 'عنوان المقر الرئيسي (بالعربية):' : 'Store Address (Arabic):'}</span>
                  </label>
                  <input
                    type="text"
                    value={currentPresetData.contactInfo.address.ar}
                    onChange={(e) => {
                      setDynamicConfig((prev) => {
                        const clone = JSON.parse(JSON.stringify(prev));
                        clone.presets[activePresetId].contactInfo.address.ar = e.target.value;
                        return clone;
                      });
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: SELF-DESTRUCT GUARD */}
        {activeTab === 'security' && (
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-rose-900/50 space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl shrink-0">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  {lang === 'ar' ? 'آلية الحماية وتأمين الكود النهائي (Self-Destruct Guard)' : 'Intellectual Property Protection Guard'}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                  {lang === 'ar'
                    ? 'عند بيع المتجر أو تسليمه للعميل وتفعيل هذا الخيار، يقوم النظام بحجب وحذف مسار /developer بالكامل وإيقاف مبدل الأنشطة، ليظهر المتجر كمتجر ثابت أصيل لنشاط واحد، مما يمنع العميل أو أي مبرمج خارجي من كشف النواة البرمجية المزدوجة.'
                    : 'When handing over the codebase to a client, activating this flag purges the /developer route and locks the preset, protecting your proprietary multi-niche engine.'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-white block">
                  {lang === 'ar' ? 'حالة القفل الحالية:' : 'Current Lock Status:'}
                </span>
                <span className={`text-xs font-semibold ${isDeveloperModeLocked ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isDeveloperModeLocked ? (lang === 'ar' ? '🔒 اللوحة مقفلة ومحجوبة' : '🔒 Locked & Concealed') : (lang === 'ar' ? '🔓 اللوحة نشطة ومتاحة لك' : '🔓 Active / Unlocked')}
                </span>
              </div>

              <button
                onClick={toggleLockDeveloperMode}
                className={`px-6 py-3 rounded-2xl text-xs font-extrabold shadow-lg transition-all min-h-[44px] ${
                  isDeveloperModeLocked
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                }`}
              >
                {isDeveloperModeLocked
                  ? (lang === 'ar' ? 'إلغاء القفل واستعادة لوحة المطور' : 'Unlock Developer Mode')
                  : (lang === 'ar' ? 'تفعيل القفل وحجب لوحة المطور فورياً' : 'Lock & Hide Developer Mode')}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
