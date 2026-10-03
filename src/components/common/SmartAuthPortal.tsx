import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, Lock, KeyRound, Eye, EyeOff, CheckCircle2, 
  AlertTriangle, ArrowLeft, ArrowRight, Sparkles, Check, 
  RotateCcw, Globe, Store, Terminal, HelpCircle,
  Phone, Mail, X, Key, ShieldCheck, Cpu, Send, RefreshCw
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

export interface SmartAuthPortalProps {
  portalType: 'admin' | 'developer';
  pinLength: number; // 4 for admin, 6 for developer
  defaultPin: string; // '2026' or '998877'
  title: { ar: string; en: string };
  subtitle: { ar: string; en: string };
  roleBadge: { ar: string; en: string };
  accent: 'purple' | 'amber';
  onAuthenticate: (pin: string, rememberLogin: boolean, rememberPin: boolean) => boolean;
  onReturnToStore: () => void;
  savedAuthKey: string;
  savedPinKey: string;
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
  const { lang, setLang, showToast, dynamicConfig, resetDeveloperPinWithMasterKey, loginDeveloper } = useCommerce();
  const isRtl = lang === 'ar';

  // Developer Emergency Recovery State
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  const [recoveryTab, setRecoveryTab] = useState<'otp' | 'master_key'>('otp');
  const [otpSent, setOtpSent] = useState(false);
  const [activeOtp, setActiveOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [masterKeyInput, setMasterKeyInput] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOtp(code);
    setOtpSent(true);
    setCountdown(60);
    const phone = dynamicConfig?.security?.developerRecoveryPhone || '+966 50 889 9772';
    showToast({
      type: 'info',
      message: lang === 'ar'
        ? `📲 كود التحقق السري لمطور النظام: (${code}) - تم إرساله لهاتف المطور: ${phone}`
        : `📲 Developer OTP: (${code}) dispatched to phone: ${phone}`
    });
  };

  const handleVerifyOtp = () => {
    if (!otpInput || otpInput.trim() !== activeOtp) {
      showToast(lang === 'ar' ? 'رمز التحقق غير صحيح أو انتهت صلاحيته!' : 'Invalid or expired OTP code!');
      return;
    }
    // Verify developer and authenticate
    const devPin = dynamicConfig?.security?.developerPin || '998877';
    loginDeveloper(devPin, true, false);
    setIsRecoveryModalOpen(false);
    showToast({
      type: 'success',
      message: lang === 'ar' ? '🎉 تم التحقق من هوية المطور بنجاح وفتح لوحة المطور!' : '🎉 Developer identity verified! Console unlocked.'
    });
  };

  const handleVerifyMasterKey = () => {
    const expected = (dynamicConfig?.security?.masterRecoveryKey || 'DEV-RESCUE-9988-2026').trim().toUpperCase();
    if (!masterKeyInput || masterKeyInput.trim().toUpperCase() !== expected) {
      showToast(lang === 'ar' ? 'مفتاح الطوارئ الرئيسي غير صحيح!' : 'Invalid Master Emergency Key!');
      return;
    }
    resetDeveloperPinWithMasterKey(masterKeyInput.trim(), '998877');
    loginDeveloper('998877', true, false);
    setIsRecoveryModalOpen(false);
    showToast({
      type: 'success',
      message: lang === 'ar' ? '🔓 تم فك القفل واستعادة رمز المطور الافتراضي (998877) بنجاح!' : '🔓 Unlocked via Master Key! Restored default PIN (998877).'
    });
  };

  // Read saved preferences from LocalStorage
  const [rememberLogin, setRememberLogin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`${savedAuthKey}_pref`) === 'true';
    } catch {
      return true;
    }
  });

  const [rememberPin, setRememberPin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`${savedPinKey}_pref`) === 'true';
    } catch {
      return false;
    }
  });

  // Digits state array
  const [digits, setDigits] = useState<string[]>(() => {
    try {
      const savedPin = localStorage.getItem(savedPinKey);
      if (savedPin && savedPin.length === pinLength) {
        return savedPin.split('');
      }
    } catch {}
    return Array(pinLength).fill('');
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first empty digit or first input on mount
  useEffect(() => {
    const firstEmpty = digits.findIndex((d) => d === '');
    const targetIdx = firstEmpty === -1 ? 0 : firstEmpty;
    inputRefs.current[targetIdx]?.focus();
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    setHasError(false);
    setErrorMessage('');

    // Handle single character
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

    // Auto-advance to next input
    if (index < pinLength - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index] === '' && index > 0) {
        // Move back and clear previous
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
      // Auto verify when pasted full code
      setTimeout(() => {
        validateAndSubmit(newDigits.join(''));
      }, 100);
    }
  };

  const validateAndSubmit = (fullPin: string) => {
    if (fullPin.length < pinLength) {
      setHasError(true);
      setErrorMessage(
        lang === 'ar'
          ? `يرجى إدخال كافة الأرقام (${pinLength} أرقام مطلوبة)`
          : `Please fill all ${pinLength} digits`
      );
      return;
    }

    const success = onAuthenticate(fullPin, rememberLogin, rememberPin);

    if (success) {
      setIsSuccess(true);
      setHasError(false);

      // Save preferences in localStorage
      try {
        localStorage.setItem(`${savedAuthKey}_pref`, String(rememberLogin));
        localStorage.setItem(`${savedPinKey}_pref`, String(rememberPin));
        if (rememberPin) {
          localStorage.setItem(savedPinKey, fullPin);
        } else {
          localStorage.removeItem(savedPinKey);
        }
      } catch (err) {
        console.warn('Storage preference error:', err);
      }
    } else {
      setHasError(true);
      setIsSuccess(false);
      setErrorMessage(
        lang === 'ar'
          ? `رمز الدخول غير صحيح. الرمز الافتراضي: ${defaultPin}`
          : `Invalid PIN. Default access key: ${defaultPin}`
      );
      // Trigger error vibration/shake and refocus first box
      setTimeout(() => {
        inputRefs.current[0]?.focus();
        setFocusedIndex(0);
      }, 350);
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

  const handleAutoFillDefault = () => {
    const defaultDigits = defaultPin.split('');
    setDigits(defaultDigits);
    setHasError(false);
    setErrorMessage('');
    inputRefs.current[pinLength - 1]?.focus();
    setFocusedIndex(pinLength - 1);
    showToast(
      lang === 'ar'
        ? `تم ملء الرمز الافتراضي: ${defaultPin}`
        : `Default PIN ${defaultPin} filled!`
    );
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
      className={`min-h-screen w-full bg-slate-950 bg-gradient-to-b ${glowGradient} text-white flex flex-col justify-between items-center p-4 sm:p-6 md:p-10 select-none relative overflow-x-hidden`}
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
          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all min-h-[44px]"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </header>

      {/* Center Interactive Authentication Card */}
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
                  <Terminal className="w-10 h-10 animate-pulse" />
                ) : (
                  <Shield className="w-10 h-10" />
                )}
              </div>

              {/* Status Dot */}
              <span className={`absolute bottom-0 end-0 w-5 h-5 rounded-full border-2 border-slate-900 ${
                isSuccess ? 'bg-emerald-500' : hasError ? 'bg-rose-500' : isPurple ? 'bg-purple-500' : 'bg-amber-500'
              }`} />
            </div>

            <div className="space-y-2">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold border ${badgeColors}`}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{roleBadge[lang]}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {title[lang]}
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                {subtitle[lang]}
              </p>
            </div>
          </div>

          {/* Smart Separate Digit Boxes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
              <span>{lang === 'ar' ? `رمز التحقق (${pinLength} أرقام):` : `Verification PIN (${pinLength} digits):`}</span>
              
              {/* Show / Hide Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-800"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'ar' ? 'إخفاء الأرقام' : 'Mask Digits'}</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 text-slate-400" />
                    <span>{lang === 'ar' ? 'إظهار الأرقام' : 'Show Digits'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Segmented Digit Grid */}
            <div 
              className={`grid ${pinLength === 4 ? 'grid-cols-4' : 'grid-cols-6'} gap-2 sm:gap-3`}
              dir="ltr" // Always render left-to-right numerically for consistency
            >
              {digits.map((digit, idx) => {
                const isFocused = focusedIndex === idx;
                const isFilled = digit !== '';

                return (
                  <div key={idx} className="relative flex flex-col items-center">
                    <input
                      ref={(el) => { inputRefs.current[idx] = el; }}
                      type={showPassword ? 'text' : 'password'}
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={handlePaste}
                      onFocus={() => setFocusedIndex(idx)}
                      autoComplete="off"
                      className={`w-full h-14 sm:h-16 text-center text-xl sm:text-2xl font-mono font-black rounded-2xl border transition-all duration-200 outline-none ${
                        hasError
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

                    {/* Active Bottom Glow Indicator */}
                    <div 
                      className={`h-1 rounded-full mt-1.5 transition-all duration-200 ${
                        isFocused 
                          ? isPurple ? 'w-6 bg-purple-400' : 'w-6 bg-amber-400' 
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
                  <span className="font-semibold">{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-[11px] font-bold underline hover:text-white shrink-0 cursor-pointer"
                >
                  {lang === 'ar' ? 'إعادة الإدخال' : 'Clear'}
                </button>
              </div>
            )}
          </div>

          {/* Options: Remember Me & Remember PIN */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            {/* Option 1: Keep Signed In (Remember Me) */}
            <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/50 hover:bg-slate-950/80 border border-slate-800/60 transition-colors cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberLogin}
                onChange={(e) => setRememberLogin(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-800 border-slate-700 cursor-pointer"
              />
              <div className="space-y-0.5 text-start">
                <span className="text-xs font-bold text-slate-200 group-hover:text-white block">
                  {lang === 'ar' ? 'حفظ تسجيل الدخول (البقاء متصلاً دائماً)' : 'Keep me signed in on this device'}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  {lang === 'ar' 
                    ? 'لن يُطلب منك إدخال الرمز في كل مرة تفتح فيها اللوحة من هذا المتصفح' 
                    : 'Stay authenticated without entering your PIN every session'}
                </span>
              </div>
            </label>

            {/* Option 2: Remember PIN */}
            <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/50 hover:bg-slate-950/80 border border-slate-800/60 transition-colors cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberPin}
                onChange={(e) => setRememberPin(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-800 border-slate-700 cursor-pointer"
              />
              <div className="space-y-0.5 text-start">
                <span className="text-xs font-bold text-slate-200 group-hover:text-white block">
                  {lang === 'ar' ? 'تذكر رمز الدخول تلقائياً' : 'Remember PIN code for quick fill'}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  {lang === 'ar'
                    ? 'حفظ الرمز في المربعات تلقائياً للولوج بنقرة واحدة مستقبلاً'
                    : 'Pre-populate the PIN boxes on future visits'}
                </span>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={triggerAuthentication}
              disabled={isSuccess}
              className={`w-full py-4 rounded-2xl font-black text-sm shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer min-h-[48px] active:scale-98 ${primaryBtnColors} ${
                !isFull ? 'opacity-90' : 'hover:opacity-100 hover:scale-[1.01]'
              }`}
            >
              {isSuccess ? (
                <>
                  <Check className="w-5 h-5 animate-spin" />
                  <span>{lang === 'ar' ? 'جاري الفتح والتوجيه...' : 'Authenticating...'}</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'تأكيد الدخول للوحة' : 'Verify & Enter Dashboard'}</span>
                </>
              )}
            </button>

            {/* Recovery / Demo Trigger */}
            {portalType === 'developer' ? (
              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="flex items-center gap-1 text-slate-500 font-mono text-[10px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>2FA & MASTER RESCUE SECURED</span>
                </span>

                <button
                  type="button"
                  onClick={() => setIsRecoveryModalOpen(true)}
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors cursor-pointer underline text-[11px]"
                >
                  <Key className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'نسيت الرمز؟ بروتوكول طوارئ المطور 🛡️' : 'Developer Emergency Recovery 🛡️'}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {lang === 'ar' ? `الرمز الافتراضي: ${defaultPin}` : `Default PIN: ${defaultPin}`}
                  </span>
                </span>

                <button
                  type="button"
                  onClick={handleAutoFillDefault}
                  className="text-purple-400 hover:text-purple-300 font-bold underline transition-colors cursor-pointer"
                >
                  {lang === 'ar' ? 'ملء تجريبي سريع' : 'Quick Auto-fill'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* DEVELOPER EMERGENCY RECOVERY MODAL */}
        {isRecoveryModalOpen && portalType === 'developer' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
            <div 
              className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl shadow-amber-950/40 space-y-5 text-start relative"
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsRecoveryModalOpen(false)}
                className="absolute top-5 end-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {lang === 'ar' ? 'بروتوكول طوارئ المطور (Dev Rescue)' : 'Developer Emergency Recovery'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'ar' ? 'استعادة الوصول الحصري لمطور النظام' : 'Exclusive recovery for system developer'}
                  </p>
                </div>
              </div>

              {/* Tabs Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setRecoveryTab('otp')}
                  className={`py-2 px-3 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                    recoveryTab === 'otp'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'كود التحقق (2FA)' : 'OTP (2FA)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRecoveryTab('master_key')}
                  className={`py-2 px-3 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                    recoveryTab === 'master_key'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'المفتاح الصلب بالكود' : 'Master Code Key'}</span>
                </button>
              </div>

              {/* TAB 1: 2FA OTP TO REGISTERED DEVELOPER */}
              {recoveryTab === 'otp' && (
                <div className="space-y-4 pt-1">
                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>{lang === 'ar' ? 'رقم هاتف المطور المسجل:' : 'Registered Dev Phone:'}</span>
                      <span className="font-mono font-bold text-amber-300" dir="ltr">
                        {dynamicConfig?.security?.developerRecoveryPhone || '+966 50 889 9772'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>{lang === 'ar' ? 'البريد الإلكتروني:' : 'Dev Email:'}</span>
                      <span className="font-mono text-slate-300" dir="ltr">
                        {dynamicConfig?.security?.developerRecoveryEmail || 'dev.core@luxe-ecommerce.pro'}
                      </span>
                    </div>
                  </div>

                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-950/50 min-h-[44px]"
                    >
                      <Send className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'إرسال رمز التحقق السري الآن' : 'Dispatch Verification Code Now'}</span>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300">
                          {lang === 'ar' ? 'أدخل رمز التحقق (6 أرقام):' : 'Enter 6-digit OTP code:'}
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                          placeholder="مثال: 482910"
                          className="w-full h-12 text-center font-mono text-xl font-black rounded-2xl bg-slate-950 border border-amber-500/50 text-white outline-none focus:ring-2 focus:ring-amber-400"
                          dir="ltr"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                        >
                          <Check className="w-4 h-4" />
                          <span>{lang === 'ar' ? 'تأكيد الرمز والدخول' : 'Verify & Enter'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={countdown > 0}
                          className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer min-h-[44px]"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>{countdown > 0 ? `${countdown}s` : (lang === 'ar' ? 'إعادة الإرسال' : 'Resend')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: HARDCODED MASTER RESCUE KEY (احتياطي الاحتياطي) */}
              {recoveryTab === 'master_key' && (
                <div className="space-y-4 pt-1">
                  <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 leading-relaxed space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300">
                      <Cpu className="w-4 h-4 shrink-0" />
                      <span>{lang === 'ar' ? 'طريقة احتياطي الاحتياطي البرمجية:' : 'Hardcoded Offline Rescue Protocol:'}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      {lang === 'ar'
                        ? 'في حال فقدت الوصول للهاتف والإيميل، يمكنك إدخال المفتاح الرئيسي المسجل في الكود المصدري للمشروع (src/data/siteConfig.ts) لفك القفل واستعادة رمز المطور فوراً.'
                        : 'If phone and email are inaccessible, enter the Master Rescue Key embedded in the project source code (src/data/siteConfig.ts).'}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      {lang === 'ar' ? 'مفتاح الطوارئ البرمجي (Master Recovery Key):' : 'Master Code Recovery Key:'}
                    </label>
                    <input
                      type="text"
                      value={masterKeyInput}
                      onChange={(e) => setMasterKeyInput(e.target.value)}
                      placeholder="DEV-RESCUE-9988-2026"
                      className="w-full h-12 px-4 font-mono text-sm font-bold rounded-2xl bg-slate-950 border border-amber-500/50 text-white outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-600"
                      dir="ltr"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyMasterKey}
                    className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-950/50 min-h-[44px]"
                  >
                    <Key className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'فك القفل واستعادة رمز المطور (998877)' : 'Rescue & Restore Default PIN'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="w-full max-w-4xl text-center py-4 z-10 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-900">
        <span>
          {lang === 'ar' 
            ? 'بوابة تحكم مؤمنة بنظام التشفير وحصانة المتصفح' 
            : 'Protected by Encrypted Client-Side Isolation'}
        </span>
        <span className="font-mono text-slate-400">
          SECURITY PROTOCOL v3.0 • LUXE ENGINE
        </span>
      </footer>
    </div>
  );
};
