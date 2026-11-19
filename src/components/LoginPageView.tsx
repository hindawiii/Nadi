import React, { useState } from 'react';
import {
  Mail,
  User,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  KeyRound,
  AlertCircle,
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { SmartPasswordInput } from './SmartInputField';
import { auth } from '../lib/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import {
  applyFirebaseAuthPersistence,
  saveCustomerSessionCache,
} from '../lib/authPersistence';

type AuthMode = 'signin' | 'register' | 'forgot';

export const LoginPageView: React.FC = () => {
  const { lang, activeData, navigateTo, showToast, cartCount } = useCommerce();
  const isRtl = lang === 'ar';

  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [authGuidance, setAuthGuidance] = useState<{
    message: string;
    suggestGoogle: boolean;
  } | null>(null);

  const switchAuthMode = (nextMode: AuthMode) => {
    setAuthMode(nextMode);
    setAuthGuidance(null);
  };

  // Map Firebase Auth error codes to clear bilingual feedback + optional 1-click Google recovery
  const getFirebaseAuthErrorDetails = (
    code: string
  ): { message: string; suggestGoogle: boolean } => {
    switch (code) {
      case 'auth/user-not-found':
        return {
          message:
            lang === 'ar'
              ? 'البريد الإلكتروني غير مسجل في المتجر، يمكنكِ إنشاء حساب جديد أو الدخول مباشرة عبر Google.'
              : 'No account found with this email. You can create a new account or sign in with Google.',
          suggestGoogle: true,
        };
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return {
          message:
            lang === 'ar'
              ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة. إذا سبق لكِ الدخول بحساب Google، يمكنكِ المتابعة به مباشرة أدناه.'
              : 'Incorrect email or password. If you previously signed in with Google, continue with Google below.',
          suggestGoogle: true,
        };
      case 'auth/account-exists-with-different-credential':
        return {
          message:
            lang === 'ar'
              ? 'هذا البريد مرتبط مسبقاً بحساب Google. اضغطي أدناه للمتابعة السريعة عبر Google.'
              : 'This email is already linked to Google. Tap below to continue with Google.',
          suggestGoogle: true,
        };
      case 'auth/email-already-in-use':
        return {
          message:
            lang === 'ar'
              ? 'هذا البريد مسجل مسبقاً، يرجى تسجيل الدخول مباشرة أو المتابعة عبر Google.'
              : 'This email is already registered. Please sign in directly or continue with Google.',
          suggestGoogle: true,
        };
      case 'auth/weak-password':
        return {
          message:
            lang === 'ar'
              ? 'كلمة المرور ضعيفة، يرجى اختيار 6 خانات على الأقل.'
              : 'Password is too weak. Please use at least 6 characters.',
          suggestGoogle: false,
        };
      case 'auth/invalid-email':
        return {
          message:
            lang === 'ar'
              ? 'صيغة البريد الإلكتروني غير صالحة، يرجى مراجعة العنوان.'
              : 'Invalid email address format. Please check your email.',
          suggestGoogle: false,
        };
      case 'auth/popup-closed-by-user':
        return {
          message:
            lang === 'ar'
              ? 'تم إغلاق نافذة تسجيل الدخول قبل إتمام العملية.'
              : 'Sign-in window was closed before completing.',
          suggestGoogle: false,
        };
      case 'auth/popup-blocked':
        return {
          message:
            lang === 'ar'
              ? 'المتصفح حظر النافذة المنبثقة، يرجى السماح بالنوافذ المنبثقة ثم المحاولة مجدداً.'
              : 'Sign-in popup was blocked by your browser. Please allow popups and try again.',
          suggestGoogle: false,
        };
      case 'auth/operation-not-allowed':
      case 'auth/admin-restricted-operation':
        return {
          message:
            lang === 'ar'
              ? 'الدخول بالبريد الإلكتروني غير مفعّل حالياً في إعدادات المتجر. يمكنكِ الدخول فوراً بنقرة واحدة عبر حساب Google.'
              : 'Email sign-in is not enabled in the store settings yet. Sign in instantly with one tap via Google.',
          suggestGoogle: true,
        };
      default:
        return {
          message:
            lang === 'ar'
              ? 'تعذر إتمام الدخول بالبريد حالياً. يمكنكِ التحقق من الاتصال أو الدخول فوراً عبر Google.'
              : 'Could not complete email sign-in right now. Check your connection or continue instantly with Google.',
          suggestGoogle: true,
        };
    }
  };

  // Primary 1-Tap Verified Google Auth via Firebase
  const handleGoogleAuth = async () => {
    setAuthGuidance(null);
    setIsSubmitting(true);
    try {
      await applyFirebaseAuthPersistence(auth, rememberMe);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const res = await signInWithPopup(auth, provider);
      const user = res.user;
      const resolvedName =
        user.displayName ||
        user.email?.split('@')[0] ||
        (lang === 'ar' ? 'عميلة نَـدِي' : 'NADI Customer');

      saveCustomerSessionCache(
        {
          uid: user.uid,
          email: user.email,
          name: resolvedName,
          photoURL: user.photoURL,
          provider: 'google',
          authenticatedAt: new Date().toISOString(),
        },
        rememberMe
      );

      showToast(
        lang === 'ar'
          ? `مرحباً بكِ ${resolvedName}! تم تسجيل دخولكِ بنجاح عبر Google`
          : `Welcome ${resolvedName}! Signed in successfully with Google`
      );

      navigateTo(cartCount > 0 ? 'cart' : 'store');
    } catch (err: unknown) {
      const authError = err as { code?: string };
      console.warn('Firebase Google Auth error:', err);
      const details = getFirebaseAuthErrorDetails(authError?.code || '');
      setAuthGuidance({ message: details.message, suggestGoogle: false });
      showToast(details.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Email / Password / Recovery Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthGuidance(null);

    if (authMode === 'signin') {
      if (!email.trim() || !password) {
        showToast(
          lang === 'ar'
            ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور'
            : 'Please enter both email and password'
        );
        return;
      }

      setIsSubmitting(true);
      try {
        await applyFirebaseAuthPersistence(auth, rememberMe);
        const res = await signInWithEmailAndPassword(auth, email.trim(), password);
        const resolvedName = res.user.displayName || email.trim().split('@')[0];

        saveCustomerSessionCache(
          {
            uid: res.user.uid,
            email: res.user.email,
            name: resolvedName,
            provider: 'email',
            authenticatedAt: new Date().toISOString(),
          },
          rememberMe
        );

        showToast(
          lang === 'ar'
            ? `أهلاً بكِ مجدداً في ${activeData.storeName.ar}! تم تسجيل الدخول بنجاح`
            : `Welcome back to ${activeData.storeName.en}! Signed in successfully`
        );

        navigateTo(cartCount > 0 ? 'cart' : 'store');
      } catch (err: unknown) {
        const authError = err as { code?: string };
        console.warn('Sign-in error:', err);
        const details = getFirebaseAuthErrorDetails(authError?.code || '');
        setAuthGuidance(details);
        showToast(details.message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (authMode === 'register') {
      if (!fullName.trim() || !email.trim() || !password) {
        showToast(
          lang === 'ar'
            ? 'يرجى ملء جميع الحقول المطلوبة'
            : 'Please fill in all required fields'
        );
        return;
      }
      if (password !== confirmPassword) {
        showToast(
          lang === 'ar'
            ? 'كلمات المرور غير متطابقة'
            : 'Passwords do not match'
        );
        return;
      }
      if (password.length < 6) {
        showToast(
          lang === 'ar'
            ? 'كلمة المرور يجب ألا تقل عن 6 خانات'
            : 'Password must be at least 6 characters'
        );
        return;
      }

      setIsSubmitting(true);
      try {
        await applyFirebaseAuthPersistence(auth, rememberMe);
        const res = await createUserWithEmailAndPassword(auth, email.trim(), password);
        try {
          await updateProfile(res.user, { displayName: fullName.trim() });
        } catch {
          // Non-fatal profile display name sync error
        }

        saveCustomerSessionCache(
          {
            uid: res.user.uid,
            email: res.user.email,
            name: fullName.trim(),
            provider: 'email',
            authenticatedAt: new Date().toISOString(),
          },
          rememberMe
        );

        showToast(
          lang === 'ar'
            ? `مرحباً بكِ ${fullName.trim()}! تم إنشاء حسابكِ في ${activeData.storeName.ar} بنجاح`
            : `Welcome ${fullName.trim()}! Your account has been created`
        );
        navigateTo(cartCount > 0 ? 'cart' : 'store');
      } catch (err: unknown) {
        const authError = err as { code?: string };
        console.warn('Registration error:', err);
        const details = getFirebaseAuthErrorDetails(authError?.code || '');
        setAuthGuidance(details);
        showToast(details.message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (authMode === 'forgot') {
      if (!email.trim()) {
        showToast(
          lang === 'ar'
            ? 'يرجى إدخال البريد الإلكتروني المسجل'
            : 'Please enter your registered email address'
        );
        return;
      }

      setIsSubmitting(true);
      try {
        await sendPasswordResetEmail(auth, email.trim());
        showToast(
          lang === 'ar'
            ? 'تم إرسال رابط آمن لإعادة تعيين كلمة المرور إلى بريدكِ الإلكتروني'
            : 'A secure password reset link has been sent to your email'
        );
        switchAuthMode('signin');
      } catch (err: unknown) {
        const authError = err as { code?: string };
        console.warn('Password reset error:', err);
        const details = getFirebaseAuthErrorDetails(authError?.code || '');
        setAuthGuidance(details);
        showToast(details.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-[82vh] py-6 sm:py-10 px-4 sm:px-6 flex flex-col items-center justify-start sm:justify-center relative overflow-hidden bg-gradient-to-b from-purple-50/40 via-slate-50/70 to-white selection:bg-[#5A3E7A] selection:text-white">
      {/* Subtle Ambient Backdrop */}
      <div
        className="absolute top-0 inset-x-0 mx-auto w-full max-w-3xl h-72 bg-purple-200/20 blur-3xl pointer-events-none rounded-full"
        aria-hidden="true"
      />

      {/* Compact Top Navigation Bar */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between gap-3 z-10">
        <button
          type="button"
          onClick={() => navigateTo('store')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-[#5A3E7A] font-semibold text-sm border border-slate-200/90 shadow-2xs transition-colors min-h-[44px] cursor-pointer active:scale-[0.98]"
        >
          {isRtl ? (
            <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
          ) : (
            <ArrowLeft className="w-4 h-4 text-slate-500 shrink-0" />
          )}
          <span className="whitespace-nowrap">
            {lang === 'ar' ? 'العودة للمتجر' : 'Back to Store'}
          </span>
        </button>

        {cartCount > 0 && (
          <button
            type="button"
            onClick={() => navigateTo('cart')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-purple-50 hover:bg-purple-100/80 text-[#5A3E7A] font-semibold text-sm border border-purple-200/70 transition-colors min-h-[44px] cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>{lang === 'ar' ? `السلة (${cartCount})` : `Bag (${cartCount})`}</span>
          </button>
        )}
      </div>

      {/* Main Luxury Editorial Auth Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-purple-950/[0.05] border border-slate-200/80 relative z-10">
        {/* Focused Heading (Avoids duplicating the full navbar brand lockup) */}
        <div className="text-center space-y-1.5 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed">
            {authMode === 'forgot'
              ? lang === 'ar'
                ? 'استعادة كلمة المرور'
                : 'Reset Your Password'
              : authMode === 'register'
                ? lang === 'ar'
                  ? `إنشاء حساب في ${activeData.storeName.ar}`
                  : `Create Your ${activeData.storeName.en} Account`
                : lang === 'ar'
                  ? `أهلاً بكِ في ${activeData.storeName.ar}`
                  : `Welcome to ${activeData.storeName.en}`}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {authMode === 'forgot'
              ? lang === 'ar'
                ? 'أدخلي بريدكِ المسجل وسنرسل لكِ رابط إعادة التعيين فوراً.'
                : 'Enter your registered email and we will send a secure reset link.'
              : lang === 'ar'
                ? 'احفظي طلباتكِ ومفضلتكِ وتابعي شحناتكِ من أي جهاز.'
                : 'Sync your orders, saved wishlist, and live shipment tracking.'}
          </p>
        </div>

        {/* Hero-First 1-Tap Verified Google Sign-In */}
        {authMode !== 'forgot' && (
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-2xl bg-[#5A3E7A] hover:bg-[#4A3266] disabled:opacity-60 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all min-h-[48px] shadow-md shadow-[#5A3E7A]/20 active:scale-[0.99] cursor-pointer"
            >
              <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </span>
              <span className="whitespace-nowrap">
                {lang === 'ar'
                  ? 'المتابعة السريعة عبر Google'
                  : 'Continue with Google'}
              </span>
            </button>

            <p className="text-center text-xs text-slate-500 leading-relaxed">
              {lang === 'ar'
                ? 'الدخول الأسرع والموثّق بنقرة واحدة بدون كلمة مرور.'
                : 'Fastest verified one-tap sign-in with no password required.'}
            </p>

            {/* Hairline Divider */}
            <div className="relative py-2 text-center">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-3 text-xs text-slate-500 font-medium">
                {lang === 'ar' ? 'أو بالبريد الإلكتروني' : 'or with email'}
              </span>
            </div>

            {/* Clean 2-Tab Single-Line Switcher */}
            <div
              className="grid grid-cols-2 bg-slate-100 p-1 rounded-2xl border border-slate-200/70"
              role="tablist"
              aria-label={lang === 'ar' ? 'طريقة الحساب' : 'Account mode'}
            >
              <button
                type="button"
                role="tab"
                aria-selected={authMode === 'signin'}
                onClick={() => switchAuthMode('signin')}
                className={`py-2.5 px-3 text-sm font-bold rounded-xl transition-all text-center min-h-[44px] whitespace-nowrap cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-white text-[#5A3E7A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={authMode === 'register'}
                onClick={() => switchAuthMode('register')}
                className={`py-2.5 px-3 text-sm font-bold rounded-xl transition-all text-center min-h-[44px] whitespace-nowrap cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-white text-[#5A3E7A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'ar' ? 'حساب جديد' : 'Create Account'}
              </button>
            </div>
          </div>
        )}

        {/* Email / Password / Recovery Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'register' && (
            <div className="space-y-1.5 text-start">
              <label
                htmlFor="register-fullname"
                className="text-sm font-semibold text-slate-700 block leading-relaxed"
              >
                {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}{' '}
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute start-3.5 pointer-events-none" />
                <input
                  id="register-fullname"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: سارة أحمد' : 'e.g., Sarah Jenkins'}
                  required
                  className="w-full ps-10 pe-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E7A] focus:bg-white text-slate-900 transition-all min-h-[48px]"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div className="space-y-1.5 text-start">
            <label
              htmlFor="auth-email"
              className="text-sm font-semibold text-slate-700 block leading-relaxed"
            >
              {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}{' '}
              <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute start-3.5 pointer-events-none" />
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                dir="ltr"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (authGuidance) setAuthGuidance(null);
                }}
                placeholder="name@example.com"
                required
                className="w-full ps-10 pe-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E7A] focus:bg-white text-slate-900 transition-all min-h-[48px] text-start"
              />
            </div>
          </div>

          {/* Sign In Password */}
          {authMode === 'signin' && (
            <div className="space-y-2 text-start">
              <SmartPasswordInput
                id="signin-password"
                label={lang === 'ar' ? 'كلمة المرور' : 'Password'}
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                required={true}
                lang={lang}
                showStrengthMeter={false}
              />

              {/* Remember Me (wired to Firebase Auth persistence) + Inline Recovery Link */}
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <label
                  htmlFor="rememberMeCheckbox"
                  className="inline-flex items-center gap-2.5 min-h-[44px] text-xs sm:text-sm text-slate-600 font-medium cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    id="rememberMeCheckbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#5A3E7A] border-slate-300 cursor-pointer"
                  />
                  <span>{lang === 'ar' ? 'تذكرني' : 'Remember me'}</span>
                </label>

                <button
                  type="button"
                  onClick={() => switchAuthMode('forgot')}
                  className="text-xs sm:text-sm text-[#5A3E7A] hover:underline font-semibold min-h-[44px] px-1 inline-flex items-center cursor-pointer whitespace-nowrap"
                >
                  {lang === 'ar' ? 'نسيت كلمة السر؟' : 'Forgot password?'}
                </button>
              </div>
            </div>
          )}

          {/* Register Passwords */}
          {authMode === 'register' && (
            <div className="space-y-4">
              <SmartPasswordInput
                id="register-password"
                label={lang === 'ar' ? 'كلمة المرور' : 'Create Password'}
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                required={true}
                lang={lang}
                showStrengthMeter={true}
              />

              <SmartPasswordInput
                id="register-confirm-password"
                label={lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="••••••••"
                required={true}
                lang={lang}
                showStrengthMeter={false}
                helperText={
                  confirmPassword && password !== confirmPassword
                    ? lang === 'ar'
                      ? 'كلمات المرور غير متطابقة حتى الآن'
                      : 'Passwords do not match yet'
                    : undefined
                }
              />
            </div>
          )}

          {/* Recovery Guidance Banner */}
          {authMode === 'forgot' && (
            <div className="p-3.5 bg-purple-50/70 rounded-2xl text-xs sm:text-sm text-[#5A3E7A] leading-relaxed border border-purple-100 flex items-start gap-2.5 text-start">
              <KeyRound className="w-4 h-4 shrink-0 mt-1" />
              <span>
                {lang === 'ar'
                  ? 'إذا كنتِ قد سجلتِ عبر حساب Google، يمكنكِ الدخول مباشرة عبر Google بدون الحاجة لكلمة مرور.'
                  : 'If you originally signed in with Google, simply use Continue with Google without resetting a password.'}
              </span>
            </div>
          )}

          {/* Persistent Inline Auth Guidance & 1-Click Google Recovery */}
          {authGuidance && (
            <div
              role="alert"
              className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 space-y-3 text-start"
            >
              <div className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-1" aria-hidden="true" />
                <p className="font-semibold">{authGuidance.message}</p>
              </div>
              {authGuidance.suggestGoogle && (
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#5A3E7A] hover:bg-[#4A3266] disabled:opacity-60 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 min-h-[44px] transition-colors cursor-pointer"
                >
                  <span>
                    {lang === 'ar'
                      ? 'المتابعة الآن عبر Google'
                      : 'Continue with Google Now'}
                  </span>
                </button>
              )}
            </div>
          )}

          {/* Secondary / Form Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 font-bold rounded-2xl text-sm sm:text-base transition-all flex items-center justify-center gap-2 min-h-[48px] cursor-pointer active:scale-[0.99] disabled:opacity-60 ${
              authMode === 'forgot'
                ? 'bg-[#5A3E7A] hover:bg-[#4A3266] text-white shadow-md shadow-[#5A3E7A]/20'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
            }`}
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{lang === 'ar' ? 'جاري التحقق...' : 'Processing...'}</span>
              </span>
            ) : (
              <span>
                {authMode === 'signin' && (lang === 'ar' ? 'تسجيل الدخول بالبريد' : 'Sign In with Email')}
                {authMode === 'register' && (lang === 'ar' ? 'إنشاء الحساب' : 'Create Account')}
                {authMode === 'forgot' && (lang === 'ar' ? 'إرسال رابط الاستعادة' : 'Send Reset Link')}
              </span>
            )}
          </button>

          {/* Return from Forgot Mode */}
          {authMode === 'forgot' && (
            <button
              type="button"
              onClick={() => switchAuthMode('signin')}
              className="w-full py-2.5 px-4 rounded-2xl text-sm font-semibold text-[#5A3E7A] hover:bg-purple-50 transition-colors min-h-[44px] cursor-pointer"
            >
              {lang === 'ar' ? 'العودة إلى تسجيل الدخول' : 'Back to Sign In'}
            </button>
          )}
        </form>

        {/* Continue as Guest */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigateTo('store')}
            className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 hover:border-[#5A3E7A]/40 hover:bg-purple-50/40 text-slate-700 hover:text-[#5A3E7A] text-sm font-semibold transition-colors min-h-[44px] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>
              {lang === 'ar'
                ? 'المتابعة والتسوق كزائر بدون حساب'
                : 'Continue Shopping as Guest'}
            </span>
            {isRtl ? (
              <ArrowLeft className="w-4 h-4 shrink-0" />
            ) : (
              <ArrowRight className="w-4 h-4 shrink-0" />
            )}
          </button>
        </div>

        {/* Clean Unboxed Trust Footnote (Zero Cramped Wrapping Pills) */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500 text-center leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>
            {lang === 'ar'
              ? 'اتصال مشفّر وآمن عبر Google Firebase · خصوصية تامة لبياناتكِ'
              : 'Encrypted sign-in via Google Firebase · Complete data privacy'}
          </span>
        </div>
      </div>

      {/* Minimal Copyright Footnote */}
      <p className="text-center text-xs text-slate-400 mt-5 z-10 leading-relaxed">
        © 2026 {activeData.storeName.en} · {activeData.storeName.ar}
      </p>
    </div>
  );
};
