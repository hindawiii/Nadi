import React, { useState } from 'react';
import { 
  Shield, KeyRound, Sparkles, Sliders, Palette, Layout, 
  Eye, EyeOff, Lock, AlertTriangle, Check, RefreshCw, 
  Smartphone, Watch, Shirt, Glasses 
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

export const DeveloperPanel: React.FC = () => {
  const { 
    lang, isDevAuthenticated, loginDeveloper, logoutDeveloper, 
    activePresetId, setActivePresetId, dynamicConfig, setDynamicConfig, 
    isDeveloperModeLocked, toggleLockDeveloperMode, setCurrentRoute, 
    showToast 
  } = useCommerce();

  const isRtl = lang === 'ar';
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'content' | 'security'>('presets');

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

  const currentPresetData = dynamicConfig.presets[activePresetId];

  // Inline content updater
  const handleUpdateText = (field: string, subfield: string, val: string) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      clone.presets[activePresetId][field][subfield] = val;
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Top Developer Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                MASTER DEVELOPER ENGINE v2.6
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {lang === 'ar' ? 'محرك التحكم المعماري وتغيير الهوية' : 'Multi-Niche Architecture Studio'}
            </h1>
            <p className="text-xs text-slate-400">
              {lang === 'ar' ? 'النشاط المفعّل حالياً:' : 'Active Niche:'}{' '}
              <span className="font-bold text-amber-300">{currentPresetData.nicheLabel[lang]}</span>
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
        <div className="flex gap-3 border-b border-slate-800 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'presets'
                ? 'bg-amber-500 text-slate-950 shadow-lg font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>{lang === 'ar' ? 'مبدل الأنشطة الرباعي (4-Niche Presets)' : '4-Niche Presets'}</span>
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'content'
                ? 'bg-amber-500 text-slate-950 shadow-lg font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تعديل النصوص والشعار الحي (CMS)' : 'Inline CMS & Typography'}</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'security'
                ? 'bg-rose-500 text-white shadow-lg font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{lang === 'ar' ? 'آلية التدمير الذاتي والحماية (Self-Destruct)' : 'Self-Destruct Guard'}</span>
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

        {/* TAB 2: INLINE CMS & TYPOGRAPHY */}
        {activeTab === 'content' && (
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                {lang === 'ar' ? 'محرر النصوص والعناوين الحي (Inline CMS)' : 'Inline Storefront Content CMS'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'ar'
                  ? 'أي تعديل هنا ينعكس فورياً على الواجهة الأمامية للمتجر ويتم حفظه محلياً.'
                  : 'Edits update the live storefront layout and persist locally.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Store Name */}
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <label className="text-xs font-bold text-amber-400 block">
                  {lang === 'ar' ? 'اسم المتجر (بالعربية):' : 'Store Name (Arabic):'}
                </label>
                <input
                  type="text"
                  value={currentPresetData.storeName.ar}
                  onChange={(e) => handleUpdateText('storeName', 'ar', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <label className="text-xs font-bold text-amber-400 block">
                  {lang === 'ar' ? 'اسم المتجر (بالإنجليزية):' : 'Store Name (English):'}
                </label>
                <input
                  type="text"
                  value={currentPresetData.storeName.en}
                  onChange={(e) => handleUpdateText('storeName', 'en', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Store Logo Image URL */}
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-400 block">
                    {lang === 'ar' ? 'رابط صورة الشعار (Store Logo Image URL):' : 'Store Logo Image URL:'}
                  </label>
                  {currentPresetData.storeLogo && (
                    <button
                      type="button"
                      onClick={() => handleUpdateLogo('')}
                      className="text-[11px] text-rose-400 hover:text-rose-300 font-bold"
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
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
                <p className="text-[11px] text-slate-400">
                  {lang === 'ar'
                    ? 'في حال عدم وجود صورة، يظهر اسم المتجر نصياً (الإنجليزية بالأعلى والعربية بالأسفل). عند وضع رابط صورة هنا، تظهر الصورة تلقائياً بدلاً من الاسم الكتابي.'
                    : 'If blank, displays pure text (English top, Arabic bottom). If a logo URL is entered, image displays automatically.'}
                </p>
              </div>

              {/* Hero Title */}
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <label className="text-xs font-bold text-amber-400 block">
                  {lang === 'ar' ? 'العنوان الرئيسي للهيرو (بالعربية):' : 'Hero Title (Arabic):'}
                </label>
                <input
                  type="text"
                  value={currentPresetData.heroTitle.ar}
                  onChange={(e) => handleUpdateText('heroTitle', 'ar', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <label className="text-xs font-bold text-amber-400 block">
                  {lang === 'ar' ? 'العنوان الرئيسي للهيرو (بالإنجليزية):' : 'Hero Title (English):'}
                </label>
                <input
                  type="text"
                  value={currentPresetData.heroTitle.en}
                  onChange={(e) => handleUpdateText('heroTitle', 'en', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
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
