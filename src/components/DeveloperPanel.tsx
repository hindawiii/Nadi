import React, { useState } from 'react';
import { 
  Shield, KeyRound, Sparkles, Sliders, Palette, Layout, 
  Eye, EyeOff, Lock, AlertTriangle, Check, RefreshCw, 
  Smartphone, Watch, Shirt, Glasses, RotateCcw, Layers, Droplets, Star, ShoppingBag, Image,
  Copy, Trash2, CheckCircle2, ChevronRight, Plus, ExternalLink, Phone, Mail, MapPin, MessageCircle, ArrowUpRight,
  Download, Upload, Code2, Type, FileJson, CheckCircle, HelpCircle, Sparkle, ArrowUp,
  Database, Cpu, HardDrive, Terminal, Activity, Undo2, Rocket
} from 'lucide-react';
import { useCommerce, SectionVisibilityMap } from '../context/CommerceContext';
import { 
  siteConfig, curatedPalettes, curatedTypographyPairs, curatedImportableTemplates, 
  ImportableTemplate, ColorPalette, TypographyPair, PresetNiche 
} from '../data/siteConfig';
import { SmartAuthPortal } from './common/SmartAuthPortal';
import { UnifiedStoreCustomizer } from './UnifiedStoreCustomizer';

export const DeveloperPanel: React.FC = () => {
  const { 
    lang, isDevAuthenticated, loginDeveloper, logoutDeveloper, 
    activePresetId, setActivePresetId, dynamicConfig, setDynamicConfig, 
    clearAllOrders, restoreDefaultOrders,
    updateDeveloperPin, updateAdminPin, resetDeveloperPinWithMasterKey,
    isDeveloperModeLocked, toggleLockDeveloperMode, setCurrentRoute, navigateTo,
    showToast, sectionsControl, toggleSection, resetSections,
    clonedSections, toggleCloneSection, updateClonedSectionConfig,
    activePaletteId, setActivePaletteId, customPalette, setCustomPalette,
    activeTypographyId, setActiveTypographyId, importTemplate, exportCurrentTemplate,
    savedCustomTemplates, saveCurrentAsTemplate, deleteSavedTemplate, loadSavedTemplate,
    goldenSnapshot, saveGoldenSnapshot, rollbackToGoldenState,
    historyStack, canUndo, undoLastChange, resetFieldToDefault, isFieldModified,
    resetEntireSectionToDefault, recordHistorySnapshot, resetPresetToFactoryDefault
  } = useCommerce();

  const isRtl = lang === 'ar';
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'cosmetics' | 'fashion' | 'eyewear' | 'electronics' | 'golden' | 'templates' | 'security' | 'colors' | 'typography' | 'sections' | 'content'
  >(activePresetId);
  const [isConfirmingRollback, setIsConfirmingRollback] = useState(false);

  // Developer & Admin PIN Security States
  const [newDevPin, setNewDevPin] = useState('');
  const [confirmDevPin, setConfirmDevPin] = useState('');
  const [newAdminPin, setNewAdminPin] = useState('');
  const [devPhoneInput, setDevPhoneInput] = useState(dynamicConfig?.security?.developerRecoveryPhone || '+966 50 889 9772');
  const [devEmailInput, setDevEmailInput] = useState(dynamicConfig?.security?.developerRecoveryEmail || 'dev.core@luxe-ecommerce.pro');

  const handleUpdateDevPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDevPin !== confirmDevPin) {
      showToast(lang === 'ar' ? 'رمزا المطور غير متطابقين!' : 'Developer PINs do not match!');
      return;
    }
    const success = updateDeveloperPin(newDevPin);
    if (success) {
      setNewDevPin('');
      setConfirmDevPin('');
    }
  };

  const handleUpdateAdminPin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = updateAdminPin(newAdminPin);
    if (success) {
      setNewAdminPin('');
    }
  };

  const handleUpdateDevRecoveryContacts = (e: React.FormEvent) => {
    e.preventDefault();
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      if (!clone.security) clone.security = { ...siteConfig.security };
      clone.security.developerRecoveryPhone = devPhoneInput.trim();
      clone.security.developerRecoveryEmail = devEmailInput.trim();
      try {
        localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
      } catch (_) {}
      return clone;
    });
    showToast(lang === 'ar' ? 'تم تحديث بيانات الاتصال المعتمدة لمطور النظام بنجاح!' : 'Developer 2FA contact info saved successfully!');
  };

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
    return (
      <SmartAuthPortal
        portalType="developer"
        pinLength={6}
        defaultPin="998877"
        title={{
          ar: 'بوابة المطور البرمجية العليا (/developer)',
          en: 'Supreme Developer Console (/developer)'
        }}
        subtitle={{
          ar: 'التحكم بالمعمارية البرمجية، محول القوالب، باليت الألوان، والدرع البرمجي الذهبي',
          en: 'Architecture controls, template adapter, palettes, and golden snapshot shield'
        }}
        roleBadge={{
          ar: 'صلاحيات المطور العليا (Master Developer)',
          en: 'Master Developer Access'
        }}
        accent="amber"
        onAuthenticate={(pin, rememberLogin, rememberPin) => loginDeveloper(pin, rememberLogin, rememberPin)}
        onReturnToStore={() => navigateTo('store')}
        savedAuthKey="luxe_dev_auth_saved"
        savedPinKey="luxe_dev_saved_pin"
      />
    );
  }

  const presetsList = [
    {
      id: 'cosmetics' as const,
      name: { ar: 'متجر التجميل والعناية (NADI / So Beauty)', en: 'Cosmetics & Skincare (NADI)' },
      desc: { ar: 'تنسيق ناعم، ألوان باستيل لافندر، قسم للبشرة ومقارنة قبل وبعد.', en: 'Pastel lavender, dewy aesthetics, skin routine picker, before/after proof.' },
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      gradientBg: 'from-purple-950/80 via-pink-950/40 to-slate-950 border-purple-500/30'
    },
    {
      id: 'fashion' as const,
      name: { ar: 'متجر أزياء وملابس (Elegance Studio)', en: 'High Fashion & Apparel (Elegance)' },
      desc: { ar: 'تصميم أنيق داكن، شبكة صور عريضة، وبكجات تسوق الإطلالة.', en: 'Editorial minimalism, Italian tailoring, Shop The Look bundle.' },
      icon: Shirt,
      color: 'from-neutral-700 to-stone-900',
      gradientBg: 'from-neutral-900 via-stone-900 to-slate-950 border-neutral-700/50'
    },
    {
      id: 'eyewear' as const,
      name: { ar: 'متجر نظارات وبصريات (Vision Optics)', en: 'Optics & Eyewear (Vision)' },
      desc: { ar: 'حواف رقيقة، تفاصيل أبعاد الإطار، ومحاكي كاميرا الواقع المعزز AR.', en: 'Bespoke titanium frames with live virtual AR try-on camera.' },
      icon: Glasses,
      color: 'from-cyan-600 to-slate-900',
      gradientBg: 'from-cyan-950/80 via-slate-900 to-slate-950 border-cyan-500/30'
    },
    {
      id: 'electronics' as const,
      name: { ar: 'متجر أجهزة وإلكترونيات (TechZone Matrix)', en: 'Gadgets & Electronics (TechZone)' },
      desc: { ar: 'ثيم تكنولوجي حديث، جدول مواصفات متقدم، وتنبيهات الحجز المسبق.', en: 'High-tech matrix, tech specs accordion, zero-stock WhatsApp override.' },
      icon: Watch,
      color: 'from-blue-600 to-indigo-800',
      gradientBg: 'from-blue-950/80 via-indigo-950/40 to-slate-950 border-blue-500/30'
    }
  ];

  const sectionsList: {
    key: keyof SectionVisibilityMap;
    title: { ar: string; en: string };
    desc: { ar: string; en: string };
    icon: any;
    tag: { ar: string; en: string };
    locationHint: { ar: string; en: string };
    previewImage: string;
  }[] = [
    {
      key: 'hero',
      title: { ar: 'البنر الرئيسي للهيرو', en: 'Hero Section' },
      desc: { ar: 'العنوان البارز، الشعار الترويجي، وأزرار توجيه العميل المباشرة.', en: 'Primary headline, slogan badge, and main call-to-action buttons.' },
      icon: Sparkles,
      tag: { ar: 'رئيسي', en: 'Core' },
      locationHint: { ar: '📍 أعلى الصفحة الرئيسية (قمة المتجر)', en: '📍 Top of Storefront (Above the Fold)' },
      previewImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80'
    },
    {
      key: 'brandTicker',
      title: { ar: 'شريط الماركات المتحرك', en: 'Brand & Slogan Ticker' },
      desc: { ar: 'شريط لامتناهي متحرك يعرض هوية المتجر والماركات المعتمدة.', en: 'Smooth infinite loop showcasing brand credentials & marquee slogans.' },
      icon: RefreshCw,
      tag: { ar: 'هوية', en: 'Branding' },
      locationHint: { ar: '📍 أسفل بنر الهيرو مباشرة (شريط متحرك)', en: '📍 Directly below hero (Marquee strip)' },
      previewImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
    },
    {
      key: 'valueProps',
      title: { ar: 'شريط المزايا والقيمة', en: 'Value Propositions Strip' },
      desc: { ar: 'شريط الضمانات الأربعة: نتائج فعالة، شحن سريع، أصلية 100%، دفع آمن.', en: '4-pillar trust badges: Proven Results, Fast Shipping, 100% Original, Secure COD.' },
      icon: Shield,
      tag: { ar: 'ثقة', en: 'Trust' },
      locationHint: { ar: '📍 شريط الضمانات والمزايا الأربعة للمصداقية', en: '📍 Trust & 4-Pillars Guarantee Strip' },
      previewImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80'
    },
    {
      key: 'routineDiagnosis',
      title: { ar: 'تشخيص البشرة الذكي', en: 'Smart Skin Routine Diagnosis' },
      desc: { ar: 'بطاقات التصفية التفاعلية الأربعة لاختيار الروتين الملائم للبشرة.', en: '4 interactive solution cards filtering products by tailored skin needs.' },
      icon: Droplets,
      tag: { ar: 'تفاعلي', en: 'Interactive' },
      locationHint: { ar: '📍 قسم اختيار وتشخيص روتين البشرة التفاعلي', en: '📍 Interactive Skin Routine Diagnosis' },
      previewImage: 'https://images.unsplash.com/photo-1512290900672-1f41b2f6ef8d?auto=format&fit=crop&w=600&q=80'
    },
    {
      key: 'productsCatalog',
      title: { ar: 'كتالوج المنتجات وفلاتر التصنيف', en: 'Products Grid & Filters' },
      desc: { ar: 'شبكة المنتجات الرئيسية مع فلاتر التصنيف وشارات الخصم وأزرار الشراء.', en: 'Dynamic products catalog with live sorting, filter pills & discount badges.' },
      icon: ShoppingBag,
      tag: { ar: 'تجارة', en: 'Commerce' },
      locationHint: { ar: '📍 شبكة المنتجات الرئيسية وفلاتر التصنيف', en: '📍 Main Products Catalog & Filter Grid' },
      previewImage: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80'
    },
    {
      key: 'hairDevices',
      title: { ar: 'أجهزة الشعر وبنرات الماركات', en: 'Hair Devices & Brand Spotlight' },
      desc: { ar: 'بنرات الماركات (سيل تك، أوكيما، كلارا) مع تبويبات الأجهزة وتصفحها.', en: 'Styling devices carousel with brand spotlight banners & tabbed categories.' },
      icon: Layers,
      tag: { ar: 'تسويق', en: 'Spotlight' },
      locationHint: { ar: '📍 أجهزة الشعر وبنرات الماركات المميزة', en: '📍 Hair Styling Devices & Brand Spotlight' },
      previewImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
    },
    {
      key: 'promoBanner',
      title: { ar: 'البنر الترويجي للحملات', en: 'Promo Campaign Banner' },
      desc: { ar: 'بنر حملة المكونات الطبيعية والبوكسات مع نسبة الخصم والصور المميزة.', en: 'High-impact editorial campaign banner with gift boxes and special discounts.' },
      icon: Image,
      tag: { ar: 'حملات', en: 'Campaign' },
      locationHint: { ar: '📍 البنر الترويجي للحملات والخصومات الكبرى', en: '📍 Mid-Page Promotional Campaign Banner' },
      previewImage: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=600&q=80'
    },
    {
      key: 'beforeAfter',
      title: { ar: 'مقارنة قبل وبعد التفاعلية', en: 'Before & After Transformation Slider' },
      desc: { ar: 'سلايدر السحب التفاعلي لمقارنة نضارة البشرة قبل وبعد 14 يوماً.', en: 'Interactive touch slider comparing real photographic results over 14 days.' },
      icon: Eye,
      tag: { ar: 'مصداقية', en: 'Social Proof' },
      locationHint: { ar: '📍 سلايدر مقارنة قبل وبعد 14 يوماً باللمس', en: '📍 Interactive Before & After Touch Slider' },
      previewImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
    },
    {
      key: 'testimonials',
      title: { ar: 'شهادات وتقييمات العميلات', en: 'Customer Reviews Carousel' },
      desc: { ar: 'شهادات موثقة مع تقييم 5 نجوم وتفاصيل المنتجات المقتناة وزر المشاركة.', en: 'Verified buyer testimonials with product tags, helpful voting & modal submit.' },
      icon: Star,
      tag: { ar: 'تقييمات', en: 'Reviews' },
      locationHint: { ar: '📍 شهادات وتقييمات العميلات الموثقة 5 نجوم', en: '📍 Customer Testimonials & Reviews Carousel' },
      previewImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
    },
    {
      key: 'scrollToTop',
      title: { ar: 'زر الصعود للأعلى بحلقة الامتلاء الذكية', en: 'Circular Progress Scroll-to-Top' },
      desc: { ar: 'زر عائم ذكي بحلقة دائرية تمتلئ تدريجياً بنسبة نزول الزائر في الصفحة وتصعد به بنعومة.', en: 'Floating smart button with circular progress ring filling proportionally to scroll depth.' },
      icon: ArrowUp,
      tag: { ar: 'ملاحة ذكية', en: 'Navigation' },
      locationHint: { ar: '📍 زر الصعود للأعلى الدائري الذكي العائم', en: '📍 Floating Circular Scroll-To-Top Button' },
      previewImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80'
    },
    {
      key: 'floatingWhatsApp',
      title: { ar: 'زر الدعم والواتساب العائم المتطور', en: 'Floating WhatsApp & Call Speed-Dial' },
      desc: { ar: 'زر الاتصال والمحادثة السريعة الفوري مع دعم السحب والنافذة الذكية لمطابقة الهاتف.', en: 'Speed-dial floating actions for instant WhatsApp consultation and direct verified phone calls.' },
      icon: MessageCircle,
      tag: { ar: 'دعم العملاء', en: 'Support' },
      locationHint: { ar: '📍 زر التواصل والواتساب وسرعة الاتصال العائم', en: '📍 Floating WhatsApp & Speed-Dial Hub' },
      previewImage: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=600&q=80'
    },
  ];

  // Field-level Reset to Default Button Component
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
            ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 shadow-xs'
            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 border border-transparent'
        }`}
      >
        <RotateCcw className="w-3 h-3" />
        <span>{lang === 'ar' ? (modified ? 'استعادة الافتراضي ↺' : 'افتراضي') : (modified ? 'Reset ↺' : 'Default')}</span>
      </button>
    );
  };

  // Safeguard currentPresetData against missing preset or corrupted storage
  const fallbackPreset = siteConfig.presets[activePresetId] || siteConfig.presets.cosmetics;
  const currentPresetData = dynamicConfig?.presets?.[activePresetId] || fallbackPreset;

  // Inline content updater with safety guards
  const handleUpdateText = (field: string, subfield: string, val: string) => {
    recordHistorySnapshot(
      `تعديل ${field}.${subfield}`,
      `Edit ${field}.${subfield}`,
      `${field}.${subfield}`
    );
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev || siteConfig));
      if (!clone.presets) clone.presets = JSON.parse(JSON.stringify(siteConfig.presets));
      if (!clone.presets[activePresetId]) {
        clone.presets[activePresetId] = JSON.parse(JSON.stringify(siteConfig.presets[activePresetId] || siteConfig.presets.cosmetics));
      }
      if (!clone.presets[activePresetId][field]) {
        clone.presets[activePresetId][field] = {};
      }
      clone.presets[activePresetId][field][subfield] = val;
      return clone;
    });
  };

  const handleUpdateDirect = (field: string, val: string) => {
    recordHistorySnapshot(
      `تعديل ${field}`,
      `Edit ${field}`,
      field
    );
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev || siteConfig));
      if (!clone.presets) clone.presets = JSON.parse(JSON.stringify(siteConfig.presets));
      if (!clone.presets[activePresetId]) {
        clone.presets[activePresetId] = JSON.parse(JSON.stringify(siteConfig.presets[activePresetId] || siteConfig.presets.cosmetics));
      }
      clone.presets[activePresetId][field] = val;
      return clone;
    });
  };

  const handleUpdateContact = (field: string, val: string) => {
    recordHistorySnapshot(
      `تعديل بيانات التواصل (${field})`,
      `Edit contact (${field})`,
      `contactInfo.${field}`
    );
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev || siteConfig));
      if (!clone.presets) clone.presets = JSON.parse(JSON.stringify(siteConfig.presets));
      if (!clone.presets[activePresetId]) {
        clone.presets[activePresetId] = JSON.parse(JSON.stringify(siteConfig.presets[activePresetId] || siteConfig.presets.cosmetics));
      }
      if (!clone.presets[activePresetId].contactInfo) {
        clone.presets[activePresetId].contactInfo = {
          address: { ar: 'المقر الرئيسي', en: 'Headquarters' },
          phone: '',
          email: '',
          whatsapp: ''
        };
      }
      clone.presets[activePresetId].contactInfo[field] = val;
      return clone;
    });
  };

  const handleUpdateLogo = (val: string) => {
    recordHistorySnapshot(
      'تعديل شعار المتجر',
      'Edit store logo',
      'storeLogo'
    );
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev || siteConfig));
      if (!clone.presets) clone.presets = JSON.parse(JSON.stringify(siteConfig.presets));
      if (!clone.presets[activePresetId]) {
        clone.presets[activePresetId] = JSON.parse(JSON.stringify(siteConfig.presets[activePresetId] || siteConfig.presets.cosmetics));
      }
      clone.presets[activePresetId].storeLogo = val;
      return clone;
    });
  };

  const handleUpdateSkinDiagnosis = (cardId: string, field: string, val: string, subfield?: string) => {
    recordHistorySnapshot(
      `تعديل بطاقة تشخيص البشرة (${cardId})`,
      `Edit skin diagnosis (${cardId})`,
      'skinDiagnosisCards'
    );
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev || siteConfig));
      if (!clone.presets) clone.presets = JSON.parse(JSON.stringify(siteConfig.presets));
      if (!clone.presets[activePresetId]) {
        clone.presets[activePresetId] = JSON.parse(JSON.stringify(siteConfig.presets[activePresetId] || siteConfig.presets.cosmetics));
      }
      if (!clone.presets[activePresetId].skinDiagnosisCards) {
        clone.presets[activePresetId].skinDiagnosisCards = JSON.parse(JSON.stringify(siteConfig.presets.cosmetics.skinDiagnosisCards || []));
      }
      const card = clone.presets[activePresetId].skinDiagnosisCards.find((c: any) => c.id === cardId);
      if (card) {
        if (subfield) {
          if (!card[field]) card[field] = {};
          card[field][subfield] = val;
        } else {
          card[field] = val;
        }
      }
      return clone;
    });
  };

  const handleUpdateTestimonial = (testId: number, field: string, val: string, subfield?: string) => {
    recordHistorySnapshot(
      `تعديل شهادة عميلة (${testId})`,
      `Edit testimonial (${testId})`,
      'testimonials'
    );
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev || siteConfig));
      if (!clone.presets) clone.presets = JSON.parse(JSON.stringify(siteConfig.presets));
      if (!clone.presets[activePresetId]) {
        clone.presets[activePresetId] = JSON.parse(JSON.stringify(siteConfig.presets[activePresetId] || siteConfig.presets.cosmetics));
      }
      if (!clone.presets[activePresetId].testimonials) {
        clone.presets[activePresetId].testimonials = JSON.parse(JSON.stringify(siteConfig.presets.cosmetics.testimonials || []));
      }
      const t = clone.presets[activePresetId].testimonials.find((item: any) => item.id === testId);
      if (t) {
        if (subfield) {
          if (!t[field]) t[field] = {};
          t[field][subfield] = val;
        } else {
          t[field] = val;
        }
      }
      return clone;
    });
  };

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
    sectionsList.forEach((s) => {
      if (!sectionsControl[s.key]) {
        toggleSection(s.key);
      }
    });
    showToast(lang === 'ar' ? 'تم تفعيل وإظهار كافة الأقسام بنجاح' : 'All sections enabled successfully');
  };

  // One-Click Catalog Wipe for Client Handover
  const handleWipeCatalogForPreset = (presetKey: string) => {
    if (!window.confirm(lang === 'ar' 
      ? `تحذير المطور: هل ترغب في تفريغ كتالوج منتجات نظام (${presetKey}) بالكامل لتسليم المتجر لعميل جديد؟`
      : `Developer Warning: Wipe all products for preset (${presetKey}) to prepare for client handover?`)) {
      return;
    }
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      if (clone.presets && clone.presets[presetKey]) {
        clone.presets[presetKey].products = [];
      }
      try {
        localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
        localStorage.setItem('luxe_commerce_config_v1', JSON.stringify(clone));
      } catch (_) {}
      return clone;
    });
    showToast(
      lang === 'ar'
        ? `تم تفريغ كتالوج منتجات (${presetKey}) بنجاح! المتجر جاهز لإضافة منتجات العميل.`
        : `Catalog for (${presetKey}) wiped successfully! Ready for client inventory.`
    );
  };

  const handleRestoreCatalogForPreset = (presetKey: string) => {
    if (!window.confirm(lang === 'ar' 
      ? `هل ترغب في استرجاع المنتجات النموذجية الافتراضية لنظام (${presetKey})؟`
      : `Restore default demo products for preset (${presetKey})?`)) {
      return;
    }
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const defaultProducts = siteConfig.presets[presetKey as keyof typeof siteConfig.presets]?.products || siteConfig.presets.cosmetics.products;
      if (clone.presets && clone.presets[presetKey]) {
        clone.presets[presetKey].products = JSON.parse(JSON.stringify(defaultProducts));
      }
      try {
        localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
        localStorage.setItem('luxe_commerce_config_v1', JSON.stringify(clone));
      } catch (_) {}
      return clone;
    });
    showToast(
      lang === 'ar'
        ? `تمت استعادة المنتجات النموذجية لنظام (${presetKey}) بنجاح!`
        : `Default demo products for (${presetKey}) restored!`
    );
  };

  const handleMasterClientHandover = () => {
    if (!window.confirm(lang === 'ar'
      ? 'تحذير تصفير شامل: سيتم تفريغ كافة المنتجات والطلبات والتقييمات التجريبية لتسليم المتجر كـ (Zero-State Clean) للعميل، مع الحفاظ على الهوية والألوان والتصميم. هل تود المتابعة؟'
      : 'Master Zero-State Reset: Wipe demo products, orders, and reviews for clean client handover. Proceed?')) {
      return;
    }
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      if (clone.presets && clone.presets[activePresetId]) {
        clone.presets[activePresetId].products = [];
        clone.presets[activePresetId].testimonials = [];
      }
      try {
        localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
        localStorage.setItem('luxe_commerce_config_v1', JSON.stringify(clone));
      } catch (_) {}
      return clone;
    });
    clearAllOrders();
    showToast(lang === 'ar' ? '🎉 تم التصفير الشامل بنجاح! المتجر جاهز للتسليم الفوري للعميل.' : '🎉 Store reset to zero-state successfully! Ready for client.');
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
        
        {/* Top Developer Command Bar */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
              </span>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                SUPREME ARCHITECTURE CONSOLE v3.0 PRO
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {lang === 'ar' ? 'محرك التحكم المعماري وتطويع القوالب' : 'Architecture & Template Normalizer Studio'}
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              {lang === 'ar' 
                ? 'إدارة محول القوالب، باليتات الألوان، الخطوط المتجانسة، صمام الأمان الذهبي، واختبار استقرار البيانات في الوقت الفعلي.' 
                : 'Full architectural control over presets, theme palettes, typography pairs, and golden stability shield.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Smart Undo Button */}
            <button
              type="button"
              onClick={undoLastChange}
              disabled={!canUndo}
              title={lang === 'ar' ? 'تراجع عن آخر تعديل (Undo)' : 'Undo last modification'}
              className={`h-11 px-4 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 ${
                canUndo 
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 shadow-sm' 
                  : 'bg-slate-800/40 text-slate-500 border border-slate-800 cursor-not-allowed opacity-50'
              }`}
            >
              <Undo2 className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تراجع (Undo)' : 'Undo'}</span>
              {historyStack.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black">
                  {historyStack.length}
                </span>
              )}
            </button>

            <button
              onClick={() => navigateTo('store')}
              className="h-11 px-5 rounded-2xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              <Eye className="w-4 h-4 text-slate-400" />
              <span>{lang === 'ar' ? 'معاينة المتجر حياً' : 'Preview Storefront'}</span>
            </button>
            <button
              onClick={logoutDeveloper}
              className="h-11 px-5 rounded-2xl text-xs font-bold bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Lock className="w-4 h-4 text-rose-400" />
              <span>{lang === 'ar' ? 'قفل اللوحة' : 'Lock Console'}</span>
            </button>
          </div>
        </div>

        {/* System Architecture Telemetry Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">{lang === 'ar' ? 'النشاط المفعّل' : 'Active Preset'}</span>
              <Cpu className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-sm font-black text-white truncate">
              {currentPresetData?.nicheLabel?.[lang] || activePresetId}
            </p>
            <span className="text-[10px] text-amber-400 font-mono block">
              ID: {activePresetId}
            </span>
          </div>

          <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">{lang === 'ar' ? 'الباليت النشط' : 'Active Palette'}</span>
              <Palette className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-sm font-black text-white truncate">
              {currentActivePalette.name[lang]}
            </p>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: currentActivePalette.primary }} />
              <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: currentActivePalette.accent }} />
              <span className="text-[10px] text-slate-400 font-mono">{currentActivePalette.primary}</span>
            </div>
          </div>

          <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">{lang === 'ar' ? 'صمام الأمان الذهبي' : 'Golden Shield'}</span>
              <Shield className={`w-4 h-4 ${goldenSnapshot ? 'text-emerald-400' : 'text-slate-500'}`} />
            </div>
            <p className="text-sm font-black text-white">
              {goldenSnapshot ? (lang === 'ar' ? 'محمي ومحفوظ ✅' : 'Protected ✅') : (lang === 'ar' ? 'غير مسجل ⚠️' : 'Unsaved ⚠️')}
            </p>
            <span className="text-[10px] text-slate-400 font-mono block truncate">
              {goldenSnapshot ? new Date(goldenSnapshot.savedAt).toLocaleTimeString() : (lang === 'ar' ? 'ينصح بأخذ لقطة' : 'Snapshot advised')}
            </span>
          </div>

          <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">{lang === 'ar' ? 'بصمة التخزين' : 'Storage Size'}</span>
              <HardDrive className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-sm font-black text-white font-mono">
              ~{(JSON.stringify(dynamicConfig || siteConfig).length / 1024).toFixed(1)} KB
            </p>
            <span className="text-[10px] text-emerald-400 font-mono block">
              Healthy & Valid JSON
            </span>
          </div>
        </div>

        {/* Tab Selector - Luxe Pro Navigation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
            <span>{lang === 'ar' ? '🏢 أركان أنظمة المتاجر الأربعة المستقلة والمتزامنة:' : '🏢 The 4 Autonomous Store System Hubs:'}</span>
            <span className="text-[10px] text-amber-400 font-mono">Real-Time Reactive State</span>
          </div>

          {/* 4 Ecosystem Hubs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {presetsList.map((preset) => {
              const Icon = preset.icon;
              const isSelected = activeTab === preset.id;
              const isCurrentlyActiveStore = activePresetId === preset.id;

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setActiveTab(preset.id)}
                  className={`p-4 rounded-3xl border text-start transition-all cursor-pointer flex flex-col justify-between gap-3 min-h-[90px] relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-900 border-amber-400 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-2xl bg-gradient-to-br ${preset.color} flex items-center justify-center text-white shadow-xs shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-black truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {preset.name[lang]}
                      </span>
                    </div>

                    {isCurrentlyActiveStore && (
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                        🟢 {lang === 'ar' ? 'مُمكّن' : 'Active'}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {preset.desc[lang]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Master Tools Secondary Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-bold text-slate-500 px-1">
              {lang === 'ar' ? 'أدوات المطور العليا:' : 'Master Tools:'}
            </span>

            <button
              type="button"
              onClick={() => setActiveTab('golden')}
              className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'golden'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-900/80 text-emerald-400 border border-emerald-950/80 hover:bg-slate-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? '🛡️ درع الثبات الذهبي' : '🛡️ Golden Shield'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'templates'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? '🧩 مستورد ومطوع القوالب' : '🧩 Template Adapter'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-rose-500 text-white font-black shadow-md'
                  : 'bg-slate-900/80 text-rose-400 border border-rose-950/80 hover:bg-slate-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? '🔒 الحماية والتأمين' : '🔒 Security Guard'}</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* THE 4 AUTONOMOUS STORE SYSTEM HUBS                       */}
        {/* (Cosmetics, Fashion, Eyewear, Electronics)               */}
        {/* ======================================================== */}
        {(activeTab === 'cosmetics' || activeTab === 'fashion' || activeTab === 'eyewear' || activeTab === 'electronics') && (() => {
          const currentHubMeta = presetsList.find(p => p.id === activeTab) || presetsList[0];
          const Icon = currentHubMeta.icon;
          const isCurrentActive = activePresetId === activeTab;
          const currentPresetData = dynamicConfig.presets[activeTab] || siteConfig.presets[activeTab];

          return (
            <div className="space-y-8">
              {/* 1. MASTER HUB BANNER & COMMAND BAR */}
              <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-r ${currentHubMeta.gradientBg} border shadow-2xl relative overflow-hidden`}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{currentHubMeta.name[lang]}</span>
                      </div>

                      {isCurrentActive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{lang === 'ar' ? '🟢 القالب المفعّل حالياً بالمتجر الحي ولوحة الإدارة' : '🟢 Active On Live Storefront'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-slate-300 text-xs font-bold">
                          <span className="w-2 h-2 rounded-full bg-slate-400" />
                          <span>{lang === 'ar' ? '⚪ ركن كامن – جاهز للتخصيص والتجربة والتمكين' : '⚪ Inactive Hub – Ready to Enable'}</span>
                        </span>
                      )}

                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-slate-900/60 border border-slate-700 text-slate-400">
                        ID: {activeTab}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {lang === 'ar' 
                        ? `ركن نظام: ${currentPresetData?.nicheLabel?.[lang] || currentHubMeta.name[lang]}` 
                        : `System Hub: ${currentPresetData?.nicheLabel?.[lang] || currentHubMeta.name[lang]}`}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {currentHubMeta.desc[lang]}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 pt-1">
                      <span className="flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                        <strong>{currentPresetData?.products?.length || 0}</strong> {lang === 'ar' ? 'منتجات جاهزة' : 'products ready'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-purple-400" />
                        <span>{lang === 'ar' ? 'الباليت الموصى به:' : 'Palette:'}</span>
                        <strong className="text-white">{currentActivePalette.name[lang]}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Hub Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Enable Preset Button */}
                    {!isCurrentActive ? (
                      <button
                        type="button"
                        onClick={() => {
                          setActivePresetId(activeTab);
                          showToast({
                            type: 'success',
                            message: lang === 'ar' 
                              ? `تم تمكين قالب (${currentHubMeta.name.ar}) وتطبيقه على المتجر الحي ولوحة الإدارة بنجاح! ⚡` 
                              : `Enabled (${currentHubMeta.name.en}) preset on live store and admin! ⚡`
                          });
                        }}
                        className="h-11 px-5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
                      >
                        <Sparkles className="w-4 h-4 text-purple-950" />
                        <span>{lang === 'ar' ? 'تمكين قالب هذا المتجر بالمتجر الحي ⚡' : 'Activate On Storefront ⚡'}</span>
                      </button>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="h-11 px-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>{lang === 'ar' ? 'قيد التشغيل بالمتجر الحي ✅' : 'Running on Live Store ✅'}</span>
                        </div>

                        {activeTab !== 'cosmetics' && (
                          <button
                            type="button"
                            onClick={() => {
                              setActivePresetId('cosmetics');
                              showToast({
                                type: 'info',
                                message: lang === 'ar'
                                  ? 'تم إلغاء التمكين والعودة إلى المتجر الافتراضي بنجاح! ↩'
                                  : 'Deactivated preset and returned to default store! ↩'
                              });
                            }}
                            className="h-11 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                            title={lang === 'ar' ? 'إلغاء التمكين والعودة للنظام الافتراضي' : 'Deactivate and return to default'}
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                            <span>{lang === 'ar' ? 'إلغاء التمكين الافتراضي ↩' : 'Disable / Revert Default ↩'}</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* One-Click Catalog Wipe for Client Handover */}
                    <button
                      type="button"
                      onClick={() => handleWipeCatalogForPreset(activeTab)}
                      className="h-11 px-4 rounded-2xl bg-amber-500/20 hover:bg-amber-500/35 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                      title={lang === 'ar' ? 'تفريغ منتجات هذا الكتالوج لتسليم المتجر لعميل جديد' : 'Wipe demo products for this preset to prepare store for client'}
                    >
                      <Trash2 className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'ar' ? 'تفريغ الكتالوج للعميل 🗑️' : 'Wipe Catalog for Client 🗑️'}</span>
                    </button>

                    {/* Factory Reset Preset Button */}
                    <button
                      type="button"
                      onClick={() => resetPresetToFactoryDefault(activeTab)}
                      className="h-11 px-4 rounded-2xl bg-rose-500/20 hover:bg-rose-500/35 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                      title={lang === 'ar' ? 'استعادة التصميم المصنعي الافتراضي النقي لهذا النظام فقط' : 'Restore pure factory defaults for this preset'}
                    >
                      <RotateCcw className="w-4 h-4 text-rose-400" />
                      <span>{lang === 'ar' ? 'استعادة ضبط المصنع للقالب ↺' : 'Factory Reset Preset ↺'}</span>
                    </button>

                    {/* Live Preview Button */}
                    <button
                      type="button"
                      onClick={() => navigateTo('store')}
                      className="h-11 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                    >
                      <Eye className="w-4 h-4 text-slate-400" />
                      <span>{lang === 'ar' ? 'معاينة المتجر' : 'Store View'}</span>
                    </button>

                    {/* Undo Button */}
                    {canUndo && (
                      <button
                        type="button"
                        onClick={undoLastChange}
                        className="h-11 px-4 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                      >
                        <Undo2 className="w-4 h-4" />
                        <span>{lang === 'ar' ? 'تراجع (Undo)' : 'Undo'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. THEME HARMONY SUITE FOR THIS NICHE */}
              <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      <Palette className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'ar' ? 'منظومة الألوان والخطوط المتجانسة المقترحة لهذا النشاط' : 'Harmonious Color & Typography System'}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {lang === 'ar' 
                        ? 'اختر الباليت أو الخط المتناسق لتطبيقه فوراً على هذا المتجر دون أي انكسار أو تضارب.' 
                        : 'Hot-swap harmonious palettes or typography pairs tailored for this business niche.'}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono px-3 py-1 rounded-xl bg-slate-950 text-slate-400 border border-slate-800">
                    60-30-10 Color Rule
                  </span>
                </div>

                {/* Quick Palettes Grid */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-300 block">
                    {lang === 'ar' ? 'الباليتات المتناسقة الموصى بها:' : 'Recommended Palettes:'}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {curatedPalettes.map((palette) => {
                      const isPaletteActive = activePaletteId === palette.id && !customPalette;
                      return (
                        <button
                          key={palette.id}
                          type="button"
                          onClick={() => {
                            setActivePaletteId(palette.id);
                            showToast(lang === 'ar' ? `تم تفعيل باليت: ${palette.name.ar}` : `Applied ${palette.name.en}`);
                          }}
                          className={`p-3 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                            isPaletteActive 
                              ? 'bg-slate-800 border-amber-400 shadow-md ring-1 ring-amber-400' 
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-white truncate max-w-[85%]">
                              {palette.name[lang]}
                            </span>
                            {isPaletteActive && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                          </div>

                          <div className="grid grid-cols-3 h-5 rounded-lg overflow-hidden border border-white/10">
                            <span style={{ backgroundColor: palette.primary }} title={`Primary: ${palette.primary}`} />
                            <span style={{ backgroundColor: palette.accent }} title={`Accent: ${palette.accent}`} />
                            <span style={{ backgroundColor: palette.surface }} title={`Surface: ${palette.surface}`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Typography Grid */}
                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <span className="text-xs font-bold text-slate-300 block">
                    {lang === 'ar' ? 'أزواج الخطوط المتجانسة المقترحة:' : 'Recommended Typography Pairs:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {curatedTypographyPairs.map((pair) => {
                      const isTypoActive = activeTypographyId === pair.id;
                      return (
                        <button
                          key={pair.id}
                          type="button"
                          onClick={() => {
                            setActiveTypographyId(pair.id);
                            showToast(lang === 'ar' ? `تم تفعيل خط: ${pair.name.ar}` : `Applied ${pair.name.en}`);
                          }}
                          className={`p-3.5 rounded-2xl border text-start transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isTypoActive 
                              ? 'bg-slate-800 border-amber-400 shadow-md ring-1 ring-amber-400' 
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="space-y-0.5 min-w-0">
                            <span className="text-xs font-bold text-white block truncate">
                              {pair.name[lang]}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {pair.headingFamilyAr} · {pair.headingFamilyEn}
                            </span>
                          </div>
                          {isTypoActive && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 3. INTEGRATED FULL 13-CORNER STOREFRONT CUSTOMIZER */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <span>{lang === 'ar' ? `ركن التعديل الموحد الشامل (كامل محتوى متجر ${currentHubMeta.name.ar})` : `Full 13-Corner Linear Customizer (${currentHubMeta.name.en})`}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {lang === 'ar'
                        ? 'تعديل مباشر وشامل لكافة أقسام هذا المتجر من الهيدر حتى التذييل، متزامن فورياً ومحفوظ بشكل مستقل.'
                        : 'Complete top-to-bottom customizer for this ecosystem. Live synced & stored independently.'}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl">
                  <UnifiedStoreCustomizer 
                    presetId={activeTab} 
                    onNavigateToProducts={() => {
                      navigateTo('store');
                    }} 
                  />
                </div>
              </div>
            </div>
          );
        })()}

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sectionsList.map((sec) => {
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

                      {/* Location Pin Badge */}
                      <div className="absolute top-2.5 start-2.5 px-2.5 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-[11px] font-black text-amber-300 flex items-center gap-1.5 shadow-lg">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate max-w-[210px]">{sec.locationHint[lang]}</span>
                      </div>

                      {/* Live Visibility Status Badge */}
                      <div className="absolute top-2.5 end-2.5">
                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black backdrop-blur-md shadow-md ${
                          isVisible 
                            ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-600/80' 
                            : 'bg-rose-950/90 text-rose-400 border border-rose-600/80'
                        }`}>
                          {isVisible ? (lang === 'ar' ? 'معروض بالمتجر ✓' : 'ACTIVE') : (lang === 'ar' ? 'مخفي ✕' : 'HIDDEN')}
                        </span>
                      </div>

                      {/* Key Indicator & Icon Badge */}
                      <div className="absolute bottom-2.5 start-2.5 flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center shadow-md ${
                          isVisible ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                        }`}>
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
                        <h3 className="text-sm font-extrabold text-white">
                          {sec.title[lang]}
                        </h3>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {sec.desc[lang]}
                        </p>

                        {/* Cloned Instance Notice */}
                        {isCloned && (
                          <div className="p-2.5 bg-purple-950/70 border border-purple-700/60 rounded-xl text-[11px] text-purple-200 font-bold flex items-center justify-between gap-2 shadow-inner">
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
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
                        {/* Visibility Toggle Button */}
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

                        {/* Clone / Duplicate Button */}
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

                        {/* Delete Button */}
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
                              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                              <span>{lang === 'ar' ? 'تخصيص نصوص وعناوين النسخة المستنسخة' : 'Customize Cloned Copy Content'}</span>
                            </span>
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-900/80 text-purple-200 border border-purple-600 font-mono">
                              2nd Instance
                            </span>
                          </div>

                          <div className="space-y-2 text-[11px]">
                            {/* Cloned Title (AR & EN) */}
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

                            {/* Cloned Subtitle (AR) */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1">
                                {lang === 'ar' ? 'الوصف والنصوص الترويجية المخصصة:' : 'Custom Description / Slogan:'}
                              </label>
                              <input
                                type="text"
                                value={lang === 'ar' ? (cloneConfig?.subtitleAr || '') : (cloneConfig?.subtitleEn || '')}
                                onChange={(e) => updateClonedSectionConfig(sec.key, lang === 'ar' ? { subtitleAr: e.target.value } : { subtitleEn: e.target.value })}
                                placeholder={lang === 'ar' ? 'مثال: تشكيلة خاصة إضافية للعناية الفائقة' : 'Custom promotional highlight'}
                                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-400"
                              />
                            </div>

                            {/* Cloned Badge */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1">
                                {lang === 'ar' ? 'شارة التمييز (Badge):' : 'Badge Tag:'}
                              </label>
                              <input
                                type="text"
                                value={cloneConfig?.badgeAr || ''}
                                onChange={(e) => updateClonedSectionConfig(sec.key, { badgeAr: e.target.value, badgeEn: e.target.value })}
                                placeholder="عرض حصري ✨"
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

                {/* Slogan */}
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

                {/* Announcement Bar */}
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

                {/* Store Logo Image URL */}
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
                <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                  🌟 {lang === 'ar' ? '٢. نصوص وبنر الهيرو الرئيسي (Hero Banner & Headlines)' : '2. Hero Banner & Headlines'}
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
                {/* Hero Title */}
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

                {/* Hero Subtitle */}
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

                {/* CTA Buttons */}
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

                {/* Hero Image */}
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
                📞 {lang === 'ar' ? '٣. بيانات التواصل والدعم الفني (Contact Channels & Support)' : '3. Contact Channels & Support'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* WhatsApp */}
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

                {/* Phone */}
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

                {/* Email */}
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

                {/* Address */}
                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{lang === 'ar' ? 'عنوان المقر الرئيسي (بالعربية):' : 'Store Address (Arabic):'}</span>
                  </label>
                  <input
                    type="text"
                    value={currentPresetData?.contactInfo?.address?.ar || ''}
                    onChange={(e) => {
                      setDynamicConfig((prev) => {
                        const clone = JSON.parse(JSON.stringify(prev || siteConfig));
                        if (!clone.presets) clone.presets = JSON.parse(JSON.stringify(siteConfig.presets));
                        if (!clone.presets[activePresetId]) {
                          clone.presets[activePresetId] = JSON.parse(JSON.stringify(siteConfig.presets[activePresetId] || siteConfig.presets.cosmetics));
                        }
                        if (!clone.presets[activePresetId].contactInfo) {
                          clone.presets[activePresetId].contactInfo = { address: { ar: '', en: '' }, phone: '', email: '', whatsapp: '' };
                        }
                        clone.presets[activePresetId].contactInfo.address.ar = e.target.value;
                        return clone;
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
                    💧 {lang === 'ar' ? '٤. كروت تشخيص روتين البشرة الذكي (Skin Diagnosis Cards)' : '4. Smart Skin Diagnosis Cards'}
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

                    {/* Image URL & Thumbnail preview */}
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
                  <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                    ⭐ {lang === 'ar' ? '٥. شهادات وتقييمات العميلات الحقيقية (Customer Testimonials)' : '5. Customer Testimonials'}
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
                      {/* Avatar URL & Preview */}
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
                🖼️ {lang === 'ar' ? '٦. صور العروض التسويقية وسلايدر قبل وبعد (Visual Promos & Sliders)' : '6. Visual Promos & Sliders'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Promo Campaign Banner Image */}
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
                          const clone = JSON.parse(JSON.stringify(prev || siteConfig));
                          if (!clone.presets[activePresetId].promoBanner) {
                            clone.presets[activePresetId].promoBanner = JSON.parse(JSON.stringify(siteConfig.presets.cosmetics.promoBanner || {}));
                          }
                          clone.presets[activePresetId].promoBanner.image1 = val;
                          return clone;
                        });
                      }}
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white"
                    />
                    {currentPresetData?.promoBanner?.image1 && (
                      <img src={currentPresetData.promoBanner.image1} alt="Promo" className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0" />
                    )}
                  </div>
                </div>

                {/* Before / After Images */}
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
                            const clone = JSON.parse(JSON.stringify(prev || siteConfig));
                            if (!clone.presets[activePresetId].beforeAfterMedia) {
                              clone.presets[activePresetId].beforeAfterMedia = JSON.parse(JSON.stringify(siteConfig.presets.cosmetics.beforeAfterMedia || {}));
                            }
                            clone.presets[activePresetId].beforeAfterMedia.beforeImage = val;
                            return clone;
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
                            const clone = JSON.parse(JSON.stringify(prev || siteConfig));
                            if (!clone.presets[activePresetId].beforeAfterMedia) {
                              clone.presets[activePresetId].beforeAfterMedia = JSON.parse(JSON.stringify(siteConfig.presets.cosmetics.beforeAfterMedia || {}));
                            }
                            clone.presets[activePresetId].beforeAfterMedia.afterImage = val;
                            return clone;
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
        )}

        {/* TAB 8: GOLDEN STABILITY SHIELD & ANTI-REGRESSION LOCK */}
        {activeTab === 'golden' && (
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-emerald-500/30 space-y-6 shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="p-3.5 bg-emerald-500/20 text-emerald-400 rounded-2xl shrink-0 border border-emerald-500/30">
                  <Shield className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                    <span>🛡️ نظام الحصانة والتجميد البرمجي (Code Immutability Guard)</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white pt-1">
                    {lang === 'ar' ? 'درع استقرار المتجر ومنع التغييرات العشوائية' : 'Store Stability Shield & Anti-Regression Guard'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                    {lang === 'ar'
                      ? 'تم تصميم هذا النظام خصيصاً لحماية كود المتجر، ونصوصه، وعلامته التجارية، وتصاميمه من التلف أو التغيير غير المقصود أثناء كتابة التحديثات الجديدة. يمكنك أخذ "لقطة ذهبية" مجمدة وحفظها، أو العودة إليها بضغطة زر واحدة في حال حدوث أي خطأ.'
                      : 'Protects store codebase, branding texts, and component states against accidental changes, regressions, or prompt drift. Take an immutable snapshot or restore at any time with one click.'}
                  </p>
                </div>
              </div>

              {/* Status Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 block">{lang === 'ar' ? 'حالة التجميد والحصانة:' : 'Immutability Status:'}</span>
                  <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'محصن ومجمد (Frozen Baseline Active)' : 'Frozen Baseline Active'}</span>
                  </div>
                </div>

                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 block">{lang === 'ar' ? 'آخر لقطة استقرار محفوظة:' : 'Last Saved Snapshot:'}</span>
                  <div className="text-amber-300 font-extrabold text-xs truncate">
                    {goldenSnapshot?.savedAt 
                      ? new Date(goldenSnapshot.savedAt).toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US') 
                      : (lang === 'ar' ? 'نسخة المصنع المعتمدة الأصلية' : 'Baseline Verified State')}
                  </div>
                </div>

                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 block">{lang === 'ar' ? 'عدد المنتجات المحصنة:' : 'Protected Products:'}</span>
                  <div className="text-white font-black text-sm">
                    {currentPresetData?.products?.length || 0} {lang === 'ar' ? 'منتجات مؤمنة' : 'Products Protected'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-start w-full sm:w-auto">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'ar' ? 'إجراءات الحفظ والاسترجاع الفوري' : 'Snapshot & Rollback Actions'}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'ar' 
                      ? 'احفظ نسختك الحالية كنقطة استقرار ذهبية، أو استرجعها في أي وقت.' 
                      : 'Lock your verified state as a Golden Snapshot, or roll back anytime.'}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                  {/* Create Snapshot Button */}
                  <button
                    type="button"
                    onClick={saveGoldenSnapshot}
                    className="flex-1 sm:flex-none px-5 py-3 rounded-2xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                  >
                    <Download className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'حفظ نقطة استقرار ذهبية 🛡️' : 'Save Golden Snapshot 🛡️'}</span>
                  </button>

                  {/* Restore Button with in-UI confirmation */}
                  {isConfirmingRollback ? (
                    <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-amber-500/50">
                      <span className="text-[11px] text-amber-300 font-bold px-2">
                        {lang === 'ar' ? 'تأكيد الاستعادة؟' : 'Confirm rollback?'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsConfirmingRollback(false);
                          rollbackToGoldenState();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all cursor-pointer"
                      >
                        {lang === 'ar' ? 'نعم، استعد الآن' : 'Yes, Restore'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsConfirmingRollback(false)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                      >
                        {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsConfirmingRollback(true)}
                      className="flex-1 sm:flex-none px-5 py-3 rounded-2xl text-xs font-black bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/40 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'استعادة الحالة الذهبية 🔄' : 'Restore Golden State 🔄'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Principles of Code Lock */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/50 space-y-2 text-xs text-emerald-200/90 leading-relaxed">
                <span className="font-extrabold text-emerald-300 block text-sm">
                  📌 {lang === 'ar' ? 'كيف يحمي هذا النظام متجرك في المستقبل؟' : 'How does this protect your store?'}
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] sm:text-xs">
                  <li><strong>تجميد الكائنات (Object.freeze):</strong> يمنع أي كود جديد من تعديل المسميات الأساسية للمتجر بالخطأ.</li>
                  <li><strong>عزل الإحداثيات المنطقية:</strong> الكروت والإشعارات تستخدم حصرياً خصائص <code className="text-amber-300">start/end</code> لمنع أي انعكاس عشوائي بين العربي والإنجليزي.</li>
                  <li><strong>صمام الأمان الذاتي (Self-Healing Shield):</strong> إذا أُضيف منتج مستقبلاً بدون صورة أو بسعر مشوه، يتم تصحيحه تلقائياً في الخلفية ولا يتوقف المتجر نهائياً.</li>
                </ul>
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

            {/* One-Click Catalog Wipe & Client Handover Tool */}
            <div className="bg-slate-950 p-6 rounded-3xl border border-indigo-900/60 space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl shrink-0">
                  <Rocket className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {lang === 'ar' ? 'تجهيز وتسليم المتجر للعميل' : 'Client Handover'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    {lang === 'ar' ? 'أداة تفريغ الكتالوج وتجهيز المتجر للعميل بضغطة زر' : 'One-Click Client Handover & Catalog Wipe'}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                    {lang === 'ar'
                      ? 'خيار آمن ومحمي في لوحة المطور لتفريغ منتجات العرض التجريبية بضغطة زر واحدة عند تسليم المتجر لعميل جديد، لتجهيز المتجر للبيع التجاري الفوري دون الحاجة لحذف الكروت يدوياً كرت بعد كرت.'
                      : 'Prepare the store for instant commercial sale and handover by purging demo catalog cards in 1 click instead of deleting cards one by one.'}
                  </p>
                </div>
              </div>

              {/* Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {/* 1. Wipe Catalog of Active Preset */}
                <button
                  type="button"
                  onClick={() => handleWipeCatalogForPreset(activePresetId)}
                  className="p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-start space-y-1.5 transition-all cursor-pointer active:scale-95 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Trash2 className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'ar' ? 'تفريغ كتالوج المنتجات' : 'Wipe Catalog'}</span>
                    </span>
                    <span className="text-[10px] font-mono text-amber-400/80">
                      {dynamicConfig.presets[activePresetId]?.products?.length || 0} {lang === 'ar' ? 'منتج' : 'items'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {lang === 'ar' ? 'مسح كافة منتجات المعاينة للقالب المفعّل حالياً' : 'Purge demo products for active store preset'}
                  </p>
                </button>

                {/* 2. Master Zero-State Reset */}
                <button
                  type="button"
                  onClick={handleMasterClientHandover}
                  className="p-4 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-start space-y-1.5 transition-all cursor-pointer active:scale-95 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                      <Rocket className="w-4 h-4 text-indigo-400" />
                      <span>{lang === 'ar' ? 'تصفير شامل للتسليم 🚀' : 'Master Zero-State 🚀'}</span>
                    </span>
                    <span className="text-[10px] font-black text-indigo-400">Zero-State</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {lang === 'ar' ? 'تفريغ المنتجات والطلبات والتقييمات مع الحفاظ على التصميم' : 'Purge products, orders & reviews cleanly'}
                  </p>
                </button>

                {/* 3. Restore Default Catalog */}
                <button
                  type="button"
                  onClick={() => {
                    handleRestoreCatalogForPreset(activePresetId);
                    restoreDefaultOrders();
                  }}
                  className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-start space-y-1.5 transition-all cursor-pointer active:scale-95 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <RotateCcw className="w-4 h-4 text-slate-400" />
                      <span>{lang === 'ar' ? 'استعادة الكتالوج النموذجي' : 'Restore Demo Catalog'}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Demo</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {lang === 'ar' ? 'استرجاع المنتجات النموذجية للمعاينة في أي وقت' : 'Restore default demo items anytime for demo'}
                  </p>
                </button>
              </div>
            </div>

            {/* SECTION 2: PIN MANAGEMENT (DEVELOPER & ADMIN) */}
            <div className="bg-slate-950 p-6 rounded-3xl border border-amber-500/30 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl shrink-0">
                  <KeyRound className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {lang === 'ar' ? 'تأمين الصلاحيات' : 'Credentials Security'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    {lang === 'ar' ? 'إدارة الرموز السرية (Developer & Admin PINs)' : 'Developer & Admin PIN Management'}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                    {lang === 'ar'
                      ? 'يمكنك هنا تعيين رمز سري جديد للوحة المطور (6 أرقام) وتعيين رمز سري جديد للوحة تحكم الأدمن (4 أرقام) بكل أمان.'
                      : 'Set a new 6-digit PIN for Supreme Developer Console and a 4-digit PIN for Merchant Admin Panel.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                {/* 1. Developer PIN Card */}
                <form onSubmit={handleUpdateDevPin} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'ar' ? 'رمز لوحة المطور (6 أرقام)' : 'Developer Console PIN (6 Digits)'}</span>
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {lang === 'ar' ? 'الرمز مفعّل' : 'Active'}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">
                        {lang === 'ar' ? 'الرمز الجديد (6 أرقام عددية):' : 'New 6-Digit PIN:'}
                      </label>
                      <input
                        type="password"
                        maxLength={6}
                        inputMode="numeric"
                        value={newDevPin}
                        onChange={(e) => setNewDevPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••••"
                        className="w-full h-11 px-3 text-center font-mono text-base font-bold rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-white outline-none"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">
                        {lang === 'ar' ? 'تأكيد الرمز الجديد:' : 'Confirm New PIN:'}
                      </label>
                      <input
                        type="password"
                        maxLength={6}
                        inputMode="numeric"
                        value={confirmDevPin}
                        onChange={(e) => setConfirmDevPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••••"
                        className="w-full h-11 px-3 text-center font-mono text-base font-bold rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-white outline-none"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={newDevPin.length !== 6 || confirmDevPin.length !== 6}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all min-h-[44px]"
                  >
                    <Check className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'حفظ وتحديث رمز المطور' : 'Update Developer PIN'}</span>
                  </button>
                </form>

                {/* 2. Admin PIN Card */}
                <form onSubmit={handleUpdateAdminPin} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-purple-400" />
                      <span>{lang === 'ar' ? 'رمز لوحة الأدمن (4 أرقام)' : 'Admin Panel PIN (4 Digits)'}</span>
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {lang === 'ar' ? 'الرمز مفعّل' : 'Active'}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">
                        {lang === 'ar' ? 'الرمز الجديد للوحة التحكم (4 أرقام):' : 'New 4-Digit Admin PIN:'}
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        inputMode="numeric"
                        value={newAdminPin}
                        onChange={(e) => setNewAdminPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="w-full h-11 px-3 text-center font-mono text-base font-bold rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-white outline-none"
                        dir="ltr"
                      />
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed pt-2">
                      {lang === 'ar'
                        ? 'يستخدم هذا الرمز لحماية مسار (/admin) الخاص بالتاجر لإدارة المنتجات والطلبات.'
                        : 'Used to protect the merchant dashboard (/admin) for catalog and orders.'}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={newAdminPin.length !== 4}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all min-h-[44px]"
                  >
                    <Check className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'حفظ وتحديث رمز الأدمن' : 'Update Admin PIN'}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* SECTION 3: DEVELOPER 2FA & RECOVERY CONTACTS */}
            <form onSubmit={handleUpdateDevRecoveryContacts} className="bg-slate-950 p-6 rounded-3xl border border-sky-900/60 space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-sky-500/20 text-sky-400 rounded-2xl shrink-0">
                  <Phone className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      {lang === 'ar' ? 'قناة التحقق الحصرية' : '2FA Channel'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    {lang === 'ar' ? 'بيانات التحقق المزدوج (2FA) لمطور النظام' : 'Developer 2FA Identity Contacts'}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                    {lang === 'ar'
                      ? 'هذه البيانات خاصة بك أنت كمطور المتجر وليست للعميل التاجر، حيث يتم إرسال كود التحقق السري إليها عند استعادة كلمة المرور.'
                      : 'Exclusive contact endpoints for the developer (not the merchant). Verification OTPs are sent here for authentication.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-sky-400" />
                    <span>{lang === 'ar' ? 'رقم هاتف المطور (لاستقبال كود التحقق):' : 'Developer Mobile (OTP receiver):'}</span>
                  </label>
                  <input
                    type="text"
                    value={devPhoneInput}
                    onChange={(e) => setDevPhoneInput(e.target.value)}
                    placeholder="+966 50 889 9772"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white outline-none focus:border-sky-500"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-sky-400" />
                    <span>{lang === 'ar' ? 'البريد الإلكتروني المعتمد للمطور:' : 'Developer Email:'}</span>
                  </label>
                  <input
                    type="email"
                    value={devEmailInput}
                    onChange={(e) => setDevEmailInput(e.target.value)}
                    placeholder="dev.core@luxe-ecommerce.pro"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white outline-none focus:border-sky-500"
                    dir="ltr"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[44px]"
              >
                <Check className="w-4 h-4" />
                <span>{lang === 'ar' ? 'حفظ وتحديث بيانات الاتصال' : 'Save 2FA Contacts'}</span>
              </button>
            </form>

            {/* SECTION 4: HARDCODED MASTER EMERGENCY RECOVERY KEY (احتياطي الاحتياطي) */}
            <div className="bg-slate-950 p-6 rounded-3xl border border-rose-900/60 space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl shrink-0">
                  <Cpu className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {lang === 'ar' ? 'خطة الطوارئ القصوى (Plan C)' : 'Extreme Emergency Plan C'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    {lang === 'ar' ? 'مفتاح الطوارئ البرمجي الصلب (Master Recovery Key)' : 'Hardcoded Offline Master Recovery Key'}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                    {lang === 'ar'
                      ? 'إذا فقدت هاتفك وإيميلك معاً، يمكنك استخدام هذا المفتاح البرمجي الصلب لفك القفل واستعادة رمز المطور فورياً دون الحاجة للإنترنت أو استقبال رسائل.'
                      : 'If you ever lose access to both phone and email, enter this offline Master Key in the rescue window to override any lock.'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-rose-950 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-300">
                    {lang === 'ar' ? 'المفتاح البرمجي الرئيسي الصلب:' : 'Master Hardcoded Emergency Key:'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-rose-300 bg-rose-950/60 px-3 py-1.5 rounded-xl border border-rose-800/60 tracking-wider" dir="ltr">
                      {dynamicConfig?.security?.masterRecoveryKey || 'DEV-RESCUE-9988-2026'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(dynamicConfig?.security?.masterRecoveryKey || 'DEV-RESCUE-9988-2026');
                        showToast(lang === 'ar' ? 'تم نسخ مفتاح الطوارئ الرئيسي للحافظة' : 'Master Key copied to clipboard');
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title={lang === 'ar' ? 'نسخ المفتاح' : 'Copy Key'}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                  <p className="font-bold text-slate-300">
                    {lang === 'ar' ? '📍 أين تجد هذا المفتاح وكلمة السر في الكود المصدري؟' : '📍 Where to find this key and credentials in code?'}
                  </p>
                  <p className="font-mono text-amber-400/90 text-[11px]" dir="ltr">
                    File: src/data/siteConfig.ts &rarr; line 215: developerPin: "998877"
                  </p>
                  <p className="font-mono text-amber-400/90 text-[11px]" dir="ltr">
                    File: src/context/CommerceContext.tsx &rarr; loginDeveloper & masterRecoveryKey
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
