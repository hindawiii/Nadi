import React, { useState, useRef, useEffect } from 'react';
import {
  Shield, Lock, KeyRound, Eye, EyeOff, CheckCircle2,
  AlertTriangle, ArrowLeft, ArrowRight, Check,
  Globe, Terminal, X, Key, ShieldCheck, LogOut, ShieldAlert
} from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useCommerce } from '../../context/CommerceContext';
import { auth } from '../../lib/firebase';
import { verifySecretSync } from '../../lib/security';

export interface SmartAuthPortalProps {
  portalType: 'admin' | 'developer';
  pinLength: number; // 4 for admin, 6 for developer
  defaultPin: string; // Used ONLY internally to warn verified owner if factory PIN is unchanged — never shown on screen
  title: { ar: string; en: string };
  subtitle: { ar: string; en: string };
  roleBadge: { ar: string; en: string };
  accent: 'purple' | 'amber';
  onAuthenticate: (pin: string) => boolean;
  onReturnToStore: () => void;
  savedAuthKey?: string;
  savedPinKey?: string;
}

export const SmartAuthPortal: React.FC<SmartAuthPortalProps> = ({
  portalType,
  pinLength,
  defaultPin,
  title,
  subtitle,
  roleBadge,
  accent,
  onAuthenticate,
  onReturnToStore,
  savedAuthKey,
  savedPinKey,
}) => {
  const {
    lang,
    setLang,
    showToast,
    dynamicConfig,
    isCloudAdminVerified,
    firebaseAdminEmail,
    logoutCustomer,
    resetAdminPinWithOwnerAuth,
    resetDeveloperPinWithAdminAuth,
  } = useCommerce();
  const isRtl = lang === 'ar';

  // Warn verified owner (without exposing PIN digits) if factory PIN is still active
  const isFactoryPinActive = verifySecretSync(
    defaultPin,
    portalType === 'admin'
      ? dynamicConfig?.security?.adminPin || ''
      : dynamicConfig?.security?.developerPin || ''
  );

  // Purge any legacy persisted PIN or auth-bypass keys on portal mount
  useEffect(() => {
    try {
      if (savedAuthKey) {
        localStorage.removeItem(savedAuthKey);
        localStorage.removeItem(`${savedAuthKey}_pref`);
      }
      if (savedPinKey) {
        localStorage.removeItem(savedPinKey);
        localStorage.removeItem(`${savedPinKey}_pref`);
      }
    } catch (_) {}
  }, [savedAuthKey, savedPinKey]);

  // Step 1: Firebase Cloud Owner Verification state
  const [isGoogleVerifying, setIsGoogleVerifying] = useState(false);

  // Verified Owner PIN Reset Modal state (available for both Admin & Developer once Cloud Owner is verified)
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  const [recoveryNewPin, setRecoveryNewPin] = useState('');

  const handleGoogleOwnerVerify = async () => {
    setIsGoogleVerifying(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const cred = await signInWithPopup(auth, provider);
      if (cred.user.emailVerified && cred.user.email === 'mohsentiben@gmail.com') {
        showToast({
          type: 'success',
          message:
            lang === 'ar'
              ? 'تم التحقق من هوية المالك السحابي بنجاح! أدخل الرمز السري لإكمال الدخول.'
              : 'Verified cloud owner identity! Enter your session PIN to unlock.',
        });
      } else {
        showToast(
          lang === 'ar'
            ? 'هذا الحساب لا يملك صلاحية المالك السحابي لهذا المتجر.'
            : 'This Google account is not authorized as the store owner.'
        );
      }
    } catch (err) {
      console.warn('Google owner verification aborted or failed:', err);
      showToast(
        lang === 'ar'
          ? 'تعذر إتمام التحقق عبر Google. يرجى السماح بالنوافذ المنبثقة والمحاولة مجدداً.'
          : 'Could not complete Google verification. Please check popup permissions and try again.'
      );
    } finally {
      setIsGoogleVerifying(false);
    }
  };

  const handleSubmitRecoveryNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    const expectedRegex = pinLength === 4 ? /^\d{4}$/ : /^\d{6}$/;
    if (!expectedRegex.test(recoveryNewPin.trim())) {
      showToast(
        lang === 'ar'
          ? `يرجى إدخال رمز جديد مكون من ${pinLength} أرقام`
          : `Please enter a valid ${pinLength}-digit PIN`
      );
      return;
    }
    const ok =
      portalType === 'admin'
        ? resetAdminPinWithOwnerAuth(recoveryNewPin.trim())
        : resetDeveloperPinWithAdminAuth(recoveryNewPin.trim());
    if (ok) {
      setIsRecoveryModalOpen(false);
      setRecoveryNewPin('');
    }
  };

  // Step 2: Session-only PIN digits (never pre-populated from localStorage)
  const [digits, setDigits] = useState<string[]>(() => Array(pinLength).fill(''));
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  // Brute-force lockout protection: 3 failed attempts lock portal for 30 seconds
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    try {
      const stored = sessionStorage.getItem(`luxe_auth_fails_${portalType}`);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [lockoutSeconds, setLockoutSeconds] = useState<number>(() => {
    try {
      const lockoutUntil = sessionStorage.getItem(`luxe_auth_lockout_${portalType}`);
      if (lockoutUntil) {
        const remaining = Math.ceil((parseInt(lockoutUntil, 10) - Date.now()) / 1000);
        return remaining > 0 ? remaining : 0;
      }
    } catch {}
    return 0;
  });

  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          try {
            sessionStorage.removeItem(`luxe_auth_lockout_${portalType}`);
            sessionStorage.setItem(`luxe_auth_fails_${portalType}`, '0');
          } catch {}
          setFailedAttempts(0);
          setHasError(false);
          setErrorMessage('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds, portalType]);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first empty digit once Cloud Owner is verified and not locked out
  useEffect(() => {
    if (!isCloudAdminVerified || lockoutSeconds > 0) return;
    const firstEmpty = digits.findIndex((d) => d === '');
    const targetIdx = firstEmpty === -1 ? 0 : firstEmpty;
    inputRefs.current[targetIdx]?.focus();
  }, [isCloudAdminVerified, lockoutSeconds]);

  const handleDigitChange = (index: number, value: string) => {
    setHasError(false);
    setErrorMessage('');

    const sanitized = value.replace(/\D/g, '');
    if (!sanitized) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    const lastChar = sanitized.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = lastChar;
    setDigits(newDigits);

    if (index < pinLength - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index] === '' && index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
        setFocusedIndex(index - 1);
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIdx = isRtl ? Math.min(pinLength - 1, index + 1) : Math.max(0, index - 1);
      inputRefs.current[prevIdx]?.focus();
      setFocusedIndex(prevIdx);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIdx = isRtl ? Math.max(0, index - 1) : Math.min(pinLength - 1, index + 1);
      inputRefs.current[nextIdx]?.focus();
      setFocusedIndex(nextIdx);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      triggerAuthentication();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, pinLength);
    if (!pastedData) return;

    const newDigits = [...digits];
    for (let i = 0; i < pinLength; i++) {
      newDigits[i] = pastedData[i] || '';
    }
    setDigits(newDigits);

    const focusTarget = Math.min(pastedData.length, pinLength - 1);
    inputRefs.current[focusTarget]?.focus();
    setFocusedIndex(focusTarget);

    if (pastedData.length === pinLength) {
      setTimeout(() => {
        validateAndSubmit(newDigits.join(''));
      }, 100);
    }
  };

  const validateAndSubmit = (fullPin: string) => {
    if (!isCloudAdminVerified) {
      setHasError(true);
      setErrorMessage(
        lang === 'ar'
          ? 'يجب توثيق هوية المالك عبر Google أولاً قبل إدخال الرمز السري.'
          : 'You must verify your store owner Google account first.'
      );
      return;
    }

    if (lockoutSeconds > 0) {
      setHasError(true);
      setErrorMessage(
        lang === 'ar'
          ? `البوابة مجمدة مؤقتاً لحماية الأمان. يرجى الانتظار ${lockoutSeconds} ثانية.`
          : `Security lockout active. Please wait ${lockoutSeconds}s.`
      );
      return;
    }

    if (fullPin.length < pinLength) {
      setHasError(true);
      setErrorMessage(
        lang === 'ar'
          ? `يرجى إدخال كافة الأرقام (${pinLength} أرقام مطلوبة)`
          : `Please fill all ${pinLength} digits`
      );
      return;
    }

    const success = onAuthenticate(fullPin);

    if (success) {
      setIsSuccess(true);
      setHasError(false);
      setFailedAttempts(0);
      try {
        sessionStorage.removeItem(`luxe_auth_fails_${portalType}`);
        sessionStorage.removeItem(`luxe_auth_lockout_${portalType}`);
      } catch {}
    } else {
      const nextFails = failedAttempts + 1;
      setFailedAttempts(nextFails);
      try {
        sessionStorage.setItem(`luxe_auth_fails_${portalType}`, String(nextFails));
      } catch {}

      if (nextFails >= 3) {
        const lockUntil = Date.now() + 30000;
        try {
          sessionStorage.setItem(`luxe_auth_lockout_${portalType}`, String(lockUntil));
        } catch {}
        setLockoutSeconds(30);
        setHasError(true);
        setIsSuccess(false);
        setErrorMessage(
          lang === 'ar'
            ? 'تم تجميد المحاولات مؤقتاً لمدة 30 ثانية لتكرار إدخال رمز خاطئ 3 مرات.'
            : 'Locked for 30s due to 3 consecutive failed PIN attempts.'
        );
      } else {
        setHasError(true);
        setIsSuccess(false);
        const remainingTries = 3 - nextFails;
        setErrorMessage(
          lang === 'ar'
            ? `رمز الدخول غير صحيح. (متبقي ${remainingTries} ${remainingTries === 1 ? 'محاولة' : 'محاولات'} قبل القفل المؤقت)`
            : `Invalid PIN. (${remainingTries} attempts remaining before temporary lock)`
        );
        setTimeout(() => {
          inputRefs.current[0]?.focus();
          setFocusedIndex(0);
        }, 350);
      }
    }
  };

  const triggerAuthentication = () => {
    validateAndSubmit(digits.join(''));
  };

  const handleClearAll = () => {
    setDigits(Array(pinLength).fill(''));
    setHasError(false);
    setErrorMessage('');
    inputRefs.current[0]?.focus();
    setFocusedIndex(0);
  };

  // Color Tokens based on Accent
  const isPurple = accent === 'purple';
  const glowGradient = isPurple
    ? 'from-purple-900/30 via-slate-950 to-slate-950'
    : 'from-amber-900/25 via-slate-950 to-slate-950';

  const badgeColors = isPurple
    ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
    : 'bg-amber-500/15 text-amber-300 border-amber-500/30';

  const primaryBtnColors = isPurple
    ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white shadow-purple-900/50'
    : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-900/50';

  const digitActiveRing = isPurple
    ? 'border-purple-400 ring-4 ring-purple-500/20 bg-slate-900 shadow-lg shadow-purple-500/10'
    : 'border-amber-400 ring-4 ring-amber-500/20 bg-slate-900 shadow-lg shadow-amber-500/10';

  const isFull = digits.every((d) => d !== '');

  return (
    <div
      className={`min-h-screen w-full bg-slate-950 bg-gradient-to-b ${glowGradient} text-white flex flex-col justify-between items-center p-4 sm:p-6 md:p-10 select-none relative overflow-x-clip`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Ambient background decoration */}
      <div className="absolute top-1/4 -start-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -end-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between z-10 py-2">
        <button
          type="button"
          onClick={onReturnToStore}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition-all active:scale-95 cursor-pointer min-h-[44px]"
        >
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{lang === 'ar' ? 'الرجوع للمتجر' : 'Return to Storefront'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer min-h-[44px]"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </header>

      {/* Center Interactive 2-Layer Authentication Card */}
      <main className="w-full max-w-lg my-auto py-8 z-10">
        <div
          className={`bg-slate-900/90 backdrop-blur-2xl border ${
            hasError ? 'border-rose-500/50' : isSuccess ? 'border-emerald-500/60' : 'border-slate-800/80'
          } rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 sm:space-y-8 transition-all duration-300 ${
            hasError ? 'animate-shake' : ''
          }`}
        >
          {/* Icon and Branding Badge */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <div
                className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center border shadow-xl ${
                  isPurple
                    ? 'bg-purple-950/60 border-purple-500/30 text-purple-300'
                    : 'bg-amber-950/60 border-amber-500/30 text-amber-300'
                }`}
              >
                {isSuccess ? (
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
                ) : portalType === 'developer' ? (
                  <Terminal className="w-10 h-10" />
                ) : (
                  <Shield className="w-10 h-10" />
                )}
              </div>

              {/* Status Dot */}
              <span
                className={`absolute bottom-0 end-0 w-5 h-5 rounded-full border-2 border-slate-900 ${
                  isSuccess
                    ? 'bg-emerald-500'
                    : hasError
                    ? 'bg-rose-500'
                    : isCloudAdminVerified
                    ? 'bg-emerald-400'
                    : isPurple
                    ? 'bg-purple-500'
                    : 'bg-amber-500'
                }`}
              />
            </div>

            <div className="space-y-2">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${badgeColors}`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{roleBadge[lang]}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-relaxed">
                {title[lang]}
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                {subtitle[lang]}
              </p>
            </div>
          </div>

          {/* LAYER 1: Mandatory Firebase Verified Cloud Owner Gate */}
          {!isCloudAdminVerified ? (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/75 border border-slate-800 space-y-3 text-start">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isPurple ? 'bg-purple-500/15 text-purple-300' : 'bg-amber-500/15 text-amber-300'
                  }`}>
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-white">
                      {lang === 'ar'
                        ? 'المرحلة 1 من 2: توثيق هوية المالك السحابي (إلزامي)'
                        : 'Step 1 of 2: Cloud Owner Identity Verification (Required)'}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {lang === 'ar'
                        ? 'لا يمكن فتح لوحة التحكم أو اختبار الرمز السري قبل تسجيل الدخول بحساب Google المعتمد للمالك.'
                        : 'Dashboard access and PIN entry are locked until you sign in with the verified store owner Google account.'}
                    </p>
                  </div>
                </div>

                {firebaseAdminEmail && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/35 text-xs text-rose-200 flex items-start gap-2 leading-relaxed">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="font-bold">
                        {lang === 'ar'
                          ? 'الحساب الحالي غير مصرح له بصلاحيات المالك:'
                          : 'Current signed-in account lacks owner privileges:'}
                      </p>
                      <p className="font-mono text-rose-300 truncate mt-0.5" dir="ltr">
                        {firebaseAdminEmail}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleGoogleOwnerVerify}
                disabled={isGoogleVerifying}
                className={`w-full py-4 rounded-2xl font-black text-sm shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer min-h-[48px] disabled:opacity-60 ${primaryBtnColors}`}
              >
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>
                  {isGoogleVerifying
                    ? lang === 'ar'
                      ? 'جاري التحقق عبر Google...'
                      : 'Verifying with Google...'
                    : lang === 'ar'
                    ? 'توثيق حساب المالك عبر Google'
                    : 'Verify Store Owner with Google'}
                </span>
              </button>

              <p className="text-center text-xs text-slate-500 leading-relaxed">
                {lang === 'ar'
                  ? 'التحقق محمي بواسطة Firebase Authentication وقواعد Firestore السحابية.'
                  : 'Enforced by Firebase Authentication & Cloud Firestore security rules.'}
              </p>
            </div>
          ) : (
            /* LAYER 2: Verified Owner Confirmed -> Unlock Secondary Session PIN Lock */
            <div className="space-y-6">
              {/* Verified Owner Status Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/35 border border-emerald-500/35 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="min-w-0 text-start">
                    <p className="text-xs font-extrabold text-emerald-300">
                      {lang === 'ar' ? 'تم توثيق المالك السحابي بنجاح' : 'Cloud Owner Verified'}
                    </p>
                    <p className="text-xs font-mono text-emerald-200/80 truncate" dir="ltr">
                      {firebaseAdminEmail}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    void logoutCustomer();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 min-h-[44px]"
                  title={lang === 'ar' ? 'تسجيل الخروج من الحساب السحابي' : 'Sign out cloud account'}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'تبديل' : 'Switch'}</span>
                </button>
              </div>

              {/* Advisory ONLY for verified owner if factory PIN has not been customized yet (never reveals PIN digits) */}
              {isFactoryPinActive && (
                <div className="p-3.5 rounded-2xl bg-amber-950/35 border border-amber-500/35 flex items-start gap-2.5 text-xs text-amber-200 text-start leading-relaxed">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    {lang === 'ar'
                      ? 'تنبيه أمني للمالك: ما زال الرمز الافتراضي الأولي مفعّلاً. نوصي بتعيين رمز خاص بك فور الدخول أو عبر زر إعادة التعيين أدناه.'
                      : 'Owner security notice: Factory PIN is still active. We recommend setting your own custom PIN right away.'}
                  </span>
                </div>
              )}

              {/* Smart Separate Digit Boxes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1 gap-2">
                  <span>
                    {lang === 'ar'
                      ? `المرحلة 2 من 2 — رمز الجلسة (${pinLength} أرقام):`
                      : `Step 2 of 2 — Session PIN (${pinLength} digits):`}
                  </span>

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer px-2.5 rounded-xl hover:bg-slate-800 min-h-[44px]"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="w-4 h-4 text-amber-400" />
                        <span>{lang === 'ar' ? 'إخفاء' : 'Hide'}</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 text-slate-400" />
                        <span>{lang === 'ar' ? 'إظهار' : 'Show'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Segmented Digit Grid */}
                <div
                  className={`grid ${pinLength === 4 ? 'grid-cols-4' : 'grid-cols-6'} gap-2 sm:gap-3`}
                  dir="ltr"
                >
                  {digits.map((digit, idx) => {
                    const isFocused = focusedIndex === idx;
                    const isFilled = digit !== '';

                    return (
                      <div key={idx} className="relative flex flex-col items-center">
                        <input
                          ref={(el) => {
                            inputRefs.current[idx] = el;
                          }}
                          type={showPassword ? 'text' : 'password'}
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(idx, e)}
                          onPaste={handlePaste}
                          onFocus={() => setFocusedIndex(idx)}
                          disabled={lockoutSeconds > 0}
                          className={`w-full h-14 sm:h-16 text-center text-xl sm:text-2xl font-mono font-black rounded-2xl border transition-all duration-200 outline-none ${
                            lockoutSeconds > 0
                              ? 'border-slate-800 bg-slate-900/40 text-slate-600 cursor-not-allowed opacity-60'
                              : hasError
                              ? 'border-rose-500 bg-rose-950/30 text-rose-200 ring-2 ring-rose-500/30'
                              : isSuccess
                              ? 'border-emerald-500 bg-emerald-950/30 text-emerald-200 ring-2 ring-emerald-500/30'
                              : isFocused
                              ? digitActiveRing
                              : isFilled
                              ? 'border-slate-600 bg-slate-800 text-white'
                              : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-700'
                          }`}
                        />

                        <div
                          className={`h-1 rounded-full mt-1.5 transition-all duration-200 ${
                            isFocused
                              ? isPurple
                                ? 'w-6 bg-purple-400'
                                : 'w-6 bg-amber-400'
                              : isFilled
                              ? 'w-2 bg-slate-600'
                              : 'w-1 bg-transparent'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Error Message with Clear Button */}
                {hasError && (
                  <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-2xl flex items-center justify-between gap-3 text-xs text-rose-300 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="font-semibold leading-relaxed">{errorMessage}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-xs font-bold underline hover:text-white shrink-0 cursor-pointer px-2 min-h-[44px]"
                    >
                      {lang === 'ar' ? 'مسح' : 'Clear'}
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons & Verified Owner PIN Reset */}
              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  onClick={triggerAuthentication}
                  disabled={isSuccess || lockoutSeconds > 0}
                  className={`w-full py-4 rounded-2xl font-black text-sm shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer min-h-[48px] ${
                    lockoutSeconds > 0
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
                      : primaryBtnColors
                  } ${
                    !isFull && lockoutSeconds === 0 ? 'opacity-90' : 'hover:opacity-100 hover:scale-[1.01]'
                  }`}
                >
                  {isSuccess ? (
                    <>
                      <Check className="w-5 h-5 animate-spin" />
                      <span>{lang === 'ar' ? 'جاري فتح اللوحة...' : 'Unlocking Dashboard...'}</span>
                    </>
                  ) : lockoutSeconds > 0 ? (
                    <>
                      <Lock className="w-4 h-4 text-rose-400" />
                      <span>
                        {lang === 'ar'
                          ? `مقفول مؤقتاً (${lockoutSeconds} ثانية)`
                          : `Locked (${lockoutSeconds}s)`}
                      </span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'تأكيد الدخول للوحة' : 'Verify & Enter Dashboard'}</span>
                    </>
                  )}
                </button>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <ShieldCheck className={`w-4 h-4 ${isPurple ? 'text-purple-400' : 'text-amber-400'}`} />
                    <span>
                      {lang === 'ar'
                        ? 'جلسة ذاكرة مؤقتة بدون حفظ الرمز محلياً'
                        : 'In-memory session · No local PIN storage'}
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setIsRecoveryModalOpen(true)}
                    className={`font-bold flex items-center gap-1.5 transition-colors cursor-pointer underline min-h-[44px] ${
                      isPurple ? 'text-purple-300 hover:text-purple-200' : 'text-amber-400 hover:text-amber-300'
                    }`}
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>
                      {lang === 'ar' ? 'تعيين أو استعادة الرمز السري' : 'Set / Reset PIN'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* VERIFIED OWNER PIN RESET MODAL (Both Admin & Developer) */}
        {isRecoveryModalOpen && isCloudAdminVerified && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
            <div
              className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl space-y-5 text-start relative"
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              <button
                type="button"
                onClick={() => setIsRecoveryModalOpen(false)}
                aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
                className="absolute top-4 end-4 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 pe-10">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${
                    isPurple
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}
                >
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white leading-relaxed">
                    {portalType === 'admin'
                      ? lang === 'ar'
                        ? 'تعيين رمز إدارة جديد'
                        : 'Set New Admin PIN'
                      : lang === 'ar'
                      ? 'تعيين رمز مطور جديد'
                      : 'Set New Developer PIN'}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {lang === 'ar'
                      ? 'مصرح به بناءً على جلسة المالك الموثقة عبر Google'
                      : 'Authorized via verified Google Owner session'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmitRecoveryNewPin} className="space-y-4 pt-1">
                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="truncate font-mono" dir="ltr">
                    {firebaseAdminEmail}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    {lang === 'ar'
                      ? `الرمز السري الجديد (${pinLength} أرقام):`
                      : `New Session PIN (${pinLength} digits):`}
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={pinLength}
                    value={recoveryNewPin}
                    onChange={(e) => setRecoveryNewPin(e.target.value.replace(/\D/g, ''))}
                    placeholder={'•'.repeat(pinLength)}
                    className="w-full h-12 text-center font-mono text-xl font-black rounded-2xl bg-slate-950 border border-slate-700 focus:border-amber-400 text-white outline-none focus:ring-2 focus:ring-amber-400/40"
                    dir="ltr"
                  />
                </div>

                <button
                  type="submit"
                  disabled={recoveryNewPin.length !== pinLength}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <Check className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'حفظ الرمز المشفر وفتح اللوحة' : 'Save Encrypted PIN & Unlock'}</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="w-full max-w-4xl text-center py-4 z-10 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-900">
        <span>
          {lang === 'ar'
            ? 'بوابة محمية بتحقق Google السحابي وقفل جلسة SHA-256'
            : 'Protected by Firebase Owner Auth & SHA-256 Session Lock'}
        </span>
        <span className="font-mono text-slate-400">
          SECURITY PROTOCOL v4.0 • NADI COMMERCE
        </span>
      </footer>
    </div>
  );
};
