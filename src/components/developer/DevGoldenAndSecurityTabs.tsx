import React, { useState } from 'react';
import {
  Check,
  CheckCircle,
  Download,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Rocket,
  RotateCcw,
  Shield,
  ShieldCheck,
  Terminal,
  Trash2,
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { siteConfig } from '../../data/siteConfig';

export const DevGoldenSnapshotTab: React.FC = () => {
  const {
    lang,
    activePresetId,
    dynamicConfig,
    goldenSnapshot,
    saveGoldenSnapshot,
    rollbackToGoldenState,
  } = useCommerce();

  const [isConfirmingRollback, setIsConfirmingRollback] = useState(false);

  const fallbackPreset = siteConfig.presets[activePresetId] || siteConfig.presets.cosmetics;
  const currentPresetData = dynamicConfig?.presets?.[activePresetId] || fallbackPreset;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-emerald-500/30 space-y-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-emerald-500/20 text-emerald-400 rounded-2xl shrink-0 border border-emerald-500/30">
            <Shield className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
              <span>نظام الحصانة والتجميد البرمجي (Code Immutability Guard)</span>
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
            <span className="text-[11px] font-bold text-slate-400 block">
              {lang === 'ar' ? 'حالة التجميد والحصانة:' : 'Immutability Status:'}
            </span>
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>{lang === 'ar' ? 'محصن ومجمد (Frozen Baseline Active)' : 'Frozen Baseline Active'}</span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block">
              {lang === 'ar' ? 'آخر لقطة استقرار محفوظة:' : 'Last Saved Snapshot:'}
            </span>
            <div className="text-amber-300 font-extrabold text-xs truncate">
              {goldenSnapshot?.savedAt
                ? new Date(goldenSnapshot.savedAt).toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')
                : lang === 'ar'
                ? 'نسخة المصنع المعتمدة الأصلية'
                : 'Baseline Verified State'}
            </div>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block">
              {lang === 'ar' ? 'عدد المنتجات المحصنة:' : 'Protected Products:'}
            </span>
            <div className="text-white font-black text-sm">
              {currentPresetData?.products?.length || 0} {lang === 'ar' ? 'منتجات مؤمنة' : 'Products Protected'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-start w-full sm:w-auto">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ar' ? 'إجراءات الحفظ والاسترجاع الفوري' : 'Snapshot & Rollback Actions'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'ar'
                ? 'احفظ نسختك الحالية كنقطة استقرار ذهبية، أو استرجعها في أي وقت.'
                : 'Lock your verified state as a Golden Snapshot, or roll back anytime.'}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={saveGoldenSnapshot}
              className="flex-1 sm:flex-none px-5 py-3 rounded-2xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'ar' ? 'حفظ نقطة استقرار ذهبية' : 'Save Golden Snapshot'}</span>
            </button>

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
                <span>{lang === 'ar' ? 'استعادة الحالة الذهبية' : 'Restore Golden State'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Principles of Code Lock */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/50 space-y-2 text-xs text-emerald-200/90 leading-relaxed">
          <span className="font-extrabold text-emerald-300 block text-sm">
            {lang === 'ar' ? 'كيف يحمي هذا النظام متجرك في المستقبل؟' : 'How does this protect your store?'}
          </span>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] sm:text-xs">
            <li>
              <strong>تجميد الكائنات (Object.freeze):</strong> يمنع أي كود جديد من تعديل المسميات الأساسية للمتجر بالخطأ.
            </li>
            <li>
              <strong>عزل الإحداثيات المنطقية:</strong> الكروت والإشعارات تستخدم حصرياً خصائص{' '}
              <code className="text-amber-300">start/end</code> لمنع أي انعكاس عشوائي بين العربي والإنجليزي.
            </li>
            <li>
              <strong>صمام الأمان الذاتي (Self-Healing Shield):</strong> إذا أُضيف منتج مستقبلاً بدون صورة أو بسعر مشوه، يتم تصحيحه تلقائياً في الخلفية ولا يتوقف المتجر نهائياً.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

interface DevSecurityTabProps {
  onWipeCatalog: (presetKey: string) => void;
  onRestoreCatalog: (presetKey: string) => void;
  onMasterClientHandover: () => void;
}

export const DevSecurityTab: React.FC<DevSecurityTabProps> = ({
  onWipeCatalog,
  onRestoreCatalog,
  onMasterClientHandover,
}) => {
  const {
    lang,
    activePresetId,
    dynamicConfig,
    setDynamicConfig,
    isDeveloperModeLocked,
    toggleLockDeveloperMode,
    updateDeveloperPin,
    updateAdminPin,
    restoreDefaultOrders,
    showToast,
  } = useCommerce();

  const [newDevPin, setNewDevPin] = useState('');
  const [confirmDevPin, setConfirmDevPin] = useState('');
  const [newAdminPin, setNewAdminPin] = useState('');
  const [devPhoneInput, setDevPhoneInput] = useState(
    dynamicConfig?.security?.developerRecoveryPhone || '+966 50 889 9772'
  );
  const [devEmailInput, setDevEmailInput] = useState(
    dynamicConfig?.security?.developerRecoveryEmail || 'dev.core@luxe-ecommerce.pro'
  );

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
      try {
        const clone = JSON.parse(JSON.stringify(prev));
        if (!clone.security) clone.security = { ...siteConfig.security };
        clone.security.developerRecoveryPhone = devPhoneInput.trim();
        clone.security.developerRecoveryEmail = devEmailInput.trim();
        try {
          localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
        } catch {
          // ignore storage quota
        }
        return clone;
      } catch {
        return prev;
      }
    });
    showToast(
      lang === 'ar'
        ? 'تم تحديث بيانات الاتصال المعتمدة لمطور النظام بنجاح!'
        : 'Developer 2FA contact info saved successfully!'
    );
  };

  return (
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
            {isDeveloperModeLocked
              ? lang === 'ar'
                ? 'اللوحة مقفلة ومحجوبة'
                : 'Locked & Concealed'
              : lang === 'ar'
              ? 'اللوحة نشطة ومتاحة لك'
              : 'Active / Unlocked'}
          </span>
        </div>

        <button
          type="button"
          onClick={toggleLockDeveloperMode}
          className={`px-6 py-3 rounded-2xl text-xs font-extrabold shadow-lg transition-all min-h-[44px] cursor-pointer ${
            isDeveloperModeLocked
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
          }`}
        >
          {isDeveloperModeLocked
            ? lang === 'ar'
              ? 'إلغاء القفل واستعادة لوحة المطور'
              : 'Unlock Developer Mode'
            : lang === 'ar'
            ? 'تفعيل القفل وحجب لوحة المطور فورياً'
            : 'Lock & Hide Developer Mode'}
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            type="button"
            onClick={() => onWipeCatalog(activePresetId)}
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

          <button
            type="button"
            onClick={onMasterClientHandover}
            className="p-4 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-start space-y-1.5 transition-all cursor-pointer active:scale-95 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Rocket className="w-4 h-4 text-indigo-400" />
                <span>{lang === 'ar' ? 'تصفير شامل للتسليم' : 'Master Zero-State'}</span>
              </span>
              <span className="text-[10px] font-black text-indigo-400">Zero-State</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              {lang === 'ar' ? 'تفريغ المنتجات والطلبات والتقييمات مع الحفاظ على التصميم' : 'Purge products, orders & reviews cleanly'}
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              onRestoreCatalog(activePresetId);
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

      {/* SECTION 4: CLOUD CRYPTOGRAPHIC & OWNER RECOVERY STATUS */}
      <div className="bg-slate-950 p-6 rounded-3xl border border-emerald-900/60 space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {lang === 'ar' ? 'حماية SHA-256 + تحقق المالك' : 'SHA-256 + Owner Google Recovery'}
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              {lang === 'ar' ? 'نظام حماية الرموز واستعادة الطوارئ الآمنة' : 'Hardened PIN Cryptography & Owner Recovery'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
              {lang === 'ar'
                ? 'يتم تشفير كافة رموز الدخول فور تحديثها بخوارزمية SHA-256 مع إزالة مفاتيح الطوارئ المكشوفة. تتم استعادة الوصول عند الطوارئ حصرياً عبر توثيق حساب Google للمالك.'
                : 'All administrative and developer PINs are encrypted with salted SHA-256 on update. Emergency recovery is restricted to verified owner Google authentication.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
