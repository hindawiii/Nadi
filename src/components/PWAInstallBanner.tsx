import React, { useState } from 'react';
import { Download, X, Share, PlusSquare, Sparkles, Smartphone, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useCommerce } from '../context/CommerceContext';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install, dismiss } = usePWAInstall();
  const { lang, activeData } = useCommerce();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already installed or neither installable nor iOS, suppress banner
  if (isInstalled || (!isInstallable && !isIOS)) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <>
      {/* Floating Bottom Promotional Install Banner */}
      <aside 
        aria-label={lang === 'ar' ? 'تثبيت التطبيق' : 'Install Application'}
        className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:end-6 sm:max-w-md z-45 animate-in slide-in-from-bottom-5 duration-300"
      >
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-purple-200/80 shadow-2xl p-4 sm:p-4.5 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            {/* App Icon + Information */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md border border-purple-100 shrink-0 bg-purple-900">
                <img 
                  src="/pwa-192x192.png" 
                  alt="NADI App Icon" 
                  className="w-full h-full object-cover"
                />
                <span className="absolute -bottom-1 -end-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-purple-950" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                    {lang === 'ar' 
                      ? (activeData.storeName.ar.includes('ـ') ? activeData.storeName.ar : 'نَـــــدِي للجمال الفاخر') 
                      : `${activeData.storeName.en} Luxury App`}
                  </h4>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-800">
                    PWA
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                  {lang === 'ar' 
                    ? 'تسوق أسرع، تصفح بدون نت، ووصول فوري للعروض.' 
                    : 'Faster shopping, offline access & instant offers.'}
                </p>
              </div>
            </div>

            {/* Close / Dismiss Button */}
            <button
              type="button"
              onClick={dismiss}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label={lang === 'ar' ? 'إغلاق الإشعار' : 'Dismiss notice'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="flex-1 h-10 px-4 rounded-xl bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-900 hover:opacity-95 active:scale-[0.98] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Download className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                {isInstalling 
                  ? (lang === 'ar' ? 'جارٍ التثبيت...' : 'Installing...')
                  : (lang === 'ar' ? 'تثبيت التطبيق على جهازك' : 'Install App to Device')}
              </span>
            </button>

            <button
              type="button"
              onClick={dismiss}
              className="h-10 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors min-h-[44px]"
            >
              {lang === 'ar' ? 'لاحقاً' : 'Later'}
            </button>
          </div>
        </div>
      </aside>

      {/* Guided iOS Safari Modal */}
      {showIOSModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setShowIOSModal(false)}
        >
          <div 
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-purple-100 space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-purple-800" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {lang === 'ar' ? 'التثبيت على آيفون / آيباد' : 'Install on iPhone / iPad'}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">Safari iOS Guide</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step-by-step instructions */}
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-xs">
                  1
                </div>
                <div className="text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-0.5">
                    {lang === 'ar' ? 'زر المشاركة (Share)' : 'Tap the Share Button'}
                  </span>
                  {lang === 'ar' 
                    ? 'اضغط على زر المشاركة الموجود في شريط سفاري السفلي أو العلوي.'
                    : 'Tap the Share icon located in Safari toolbar.'}
                  <div className="mt-1 flex items-center gap-1.5 text-blue-600 font-bold">
                    <Share className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'أيقونة المشاركة' : 'Share Icon'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold text-xs">
                  2
                </div>
                <div className="text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-0.5">
                    {lang === 'ar' ? 'إضافة إلى الصفحة الرئيسية' : 'Add to Home Screen'}
                  </span>
                  {lang === 'ar'
                    ? 'مرر للأسفل في القائمة واضغط على "إضافة إلى الصفحة الرئيسية".'
                    : 'Scroll down and tap "Add to Home Screen".'}
                  <div className="mt-1 flex items-center gap-1.5 text-purple-600 font-bold">
                    <PlusSquare className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'إضافة إلى الشاشة الرئيسية' : 'Add to Home Screen'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs text-emerald-900 leading-relaxed">
                  <span className="font-bold block mb-0.5">
                    {lang === 'ar' ? 'تم! استمتع بالتجربة' : 'Done! Ready for instant access'}
                  </span>
                  {lang === 'ar'
                    ? 'سيظهر تطبيق نَـــــدِي بين تطبيقاتك مع إمكانية التصفح دون الحاجة لمتصفح.'
                    : 'NADI App will appear on your Home Screen for full offline & instant shopping.'}
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full h-11 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              {lang === 'ar' ? 'فهمت ذلك، إغلاق' : 'Got it, Close'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Reusable menu item for the mobile drawer / header
export const PWAInstallMenuItem: React.FC<{ onActionComplete?: () => void }> = ({ onActionComplete }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { lang } = useCommerce();
  const [showIOSModal, setShowIOSModal] = useState(false);

  if (isInstalled || (!isInstallable && !isIOS)) {
    return null;
  }

  const handleClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }
    await install();
    onActionComplete?.();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="w-full text-start p-3 rounded-2xl bg-gradient-to-r from-purple-900/10 via-purple-700/10 to-transparent border border-purple-200/70 hover:border-purple-300 transition-colors flex items-center justify-between min-h-[46px]"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#5A3E7A] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Download className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-slate-900 block leading-tight">
              {lang === 'ar' ? 'تثبيت التطبيق على جهازك' : 'Install Web App'}
            </span>
            <span className="text-[11px] text-purple-800 font-semibold">
              {lang === 'ar' ? 'سرعة فائقة وتصفح أوفلاين' : 'Fast & Offline Ready'}
            </span>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-amber-400 text-slate-950 rounded-full">
          {lang === 'ar' ? 'تثبيت' : 'Install'}
        </span>
      </button>

      {/* Guided iOS Safari Modal */}
      {showIOSModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setShowIOSModal(false)}
        >
          <div 
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-purple-100 space-y-5"
            onClick={(e) => e.stopPropagation()}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">
                {lang === 'ar' ? 'التثبيت على آيفون / آيباد' : 'Install on iPhone / iPad'}
              </h3>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'ar' 
                ? 'اضغط على زر المشاركة (Share) في شريط متصفح سفاري، ثم اختر "إضافة إلى الشاشة الرئيسية" (Add to Home Screen).' 
                : 'Tap the Share icon in Safari toolbar, then choose "Add to Home Screen".'}
            </p>
            <button
              type="button"
              onClick={() => {
                setShowIOSModal(false);
                onActionComplete?.();
              }}
              className="w-full h-11 rounded-2xl bg-purple-900 text-white text-xs font-bold"
            >
              {lang === 'ar' ? 'حسناً' : 'OK'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
