import React, { useState } from 'react';
import { 
  Mail, Lock, User, Phone, ArrowLeft, ArrowRight, 
  Sparkles, ShieldCheck, CheckCircle2, 
  ShoppingBag, KeyRound, Smartphone, Key
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { SmartPasswordInput, SmartPinOtpInput, SmartPhoneInput } from './SmartInputField';

type AuthTab = 'signin' | 'register' | 'forgot';
type SignInMethod = 'password' | 'phone_pin';

export const LoginPageView: React.FC = () => {
  const { lang, activeData, navigateTo, showToast, cartCount } = useCommerce();
  const isRtl = lang === 'ar';

  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [signInMethod, setSignInMethod] = useState<SignInMethod>('password');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Google One-Click Auth
  const handleGoogleAuth = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast(
        lang === 'ar' 
          ? 'مرحباً بك مجدداً! تم تسجيل دخولك بنجاح عبر حساب Google' 
          : 'Welcome back! Signed in successfully with Google'
      );
      if (cartCount > 0) {
        navigateTo('cart');
      } else {
        navigateTo('store');
      }
    }, 700);
  };

  // Apple One-Click Auth
  const handleAppleAuth = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast(
        lang === 'ar' 
          ? 'تم تسجيل الدخول بنجاح عبر Apple ID' 
          : 'Signed in successfully with Apple ID'
      );
      if (cartCount > 0) {
        navigateTo('cart');
      } else {
        navigateTo('store');
      }
    }, 700);
  };

  // Email / Password / PIN Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'signin') {
      if (signInMethod === 'password') {
        if (!email || !password) {
          showToast(lang === 'ar' ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please provide both email and password');
          return;
        }
      } else {
        if (!phoneNumber || pinCode.length < 4) {
          showToast(lang === 'ar' ? 'يرجى إدخال رقم الهاتف ورمز الدخول المكون من 4 أرقام' : 'Please provide phone number and 4-digit PIN');
          return;
        }
      }

      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        showToast(
          lang === 'ar' 
            ? `أهلاً بكِ مجدداً في ${activeData.storeName.ar}! تم تسجيل الدخول بنجاح` 
            : `Welcome back to ${activeData.storeName.en}! Signed in successfully`
        );
        if (cartCount > 0) {
          navigateTo('cart');
        } else {
          navigateTo('store');
        }
      }, 700);
    } else if (activeTab === 'register') {
      if (!fullName || !email || !password) {
        showToast(lang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
        return;
      }
      if (password !== confirmPassword) {
        showToast(lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        showToast(
          lang === 'ar' 
            ? `مرحباً بكِ ${fullName}! تم إنشاء حسابكِ الفاخر بنجاح` 
            : `Welcome ${fullName}! Your luxury account has been created`
        );
        navigateTo('store');
      }, 800);
    } else if (activeTab === 'forgot') {
      if (!email) {
        showToast(lang === 'ar' ? 'يرجى إدخال البريد الإلكتروني المسجل' : 'Please enter your registered email');
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        showToast(
          lang === 'ar' 
            ? 'تم إرسال رابط آمن لإعادة تعيين كلمة المرور إلى بريدك' 
            : 'Password recovery link has been sent to your email'
        );
        setActiveTab('signin');
      }, 750);
    }
  };

  return (
    <div className="min-h-[90vh] py-8 sm:py-14 px-4 sm:px-6 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-purple-50/40 via-slate-50 to-white selection:bg-[#5A3E7A] selection:text-white">
      
      {/* Ambient background architectural blurs */}
      <div className="absolute top-0 start-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-purple-200/25 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-10 start-1/4 w-72 h-72 bg-amber-100/30 blur-3xl pointer-events-none rounded-full" />

      {/* Top Bar: Return to Store Navigation */}
      <div className="w-full max-w-lg mb-6 flex items-center justify-between z-10">
        <button
          onClick={() => navigateTo('store')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-[#5A3E7A] font-bold text-xs sm:text-sm border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all min-h-[44px] group"
        >
          {isRtl ? (
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#5A3E7A] group-hover:translate-x-0.5 transition-transform" />
          ) : (
            <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-[#5A3E7A] group-hover:-translate-x-0.5 transition-transform" />
          )}
          <span>{lang === 'ar' ? 'العودة للمتجر الرئيسي' : 'Return to Store'}</span>
        </button>

        {cartCount > 0 && (
          <button
            onClick={() => navigateTo('cart')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-purple-100/70 hover:bg-purple-100 text-[#5A3E7A] font-bold text-xs border border-purple-200/70 transition-colors min-h-[44px]"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? `السلة (${cartCount})` : `Bag (${cartCount})`}</span>
          </button>
        )}
      </div>

      {/* Main Luxury Architectural Auth Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-purple-100/90 relative z-10 backdrop-blur-md">
        
        {/* Brand Lockup: English LARGER than Arabic, Geometric Modern Luxury */}
        <div 
          onClick={() => navigateTo('store')}
          className="cursor-pointer text-center space-y-1 mb-8 flex flex-col items-center justify-center group"
          title={`${activeData.storeName.en} · ${activeData.storeName.ar}`}
        >
          {activeData.storeLogo ? (
            <img 
              src={activeData.storeLogo} 
              alt={`${activeData.storeName.en} - ${activeData.storeName.ar}`} 
              className="h-12 w-auto max-h-12 object-contain mx-auto my-1" 
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5">
              {/* English Name: Noticeably larger, modern geometric luxury */}
              <span className="font-brand-geometric font-black text-2xl sm:text-3xl text-slate-900 group-hover:text-[#5A3E7A] transition-colors tracking-[0.28em] uppercase leading-none">
                {activeData.storeName.en}
              </span>
              {/* Arabic Name: Elongated, bold, balanced underneath with safe spacing */}
              <div className="flex items-center gap-2">
                <span className="font-brand-ar font-extrabold text-base sm:text-lg text-slate-800 group-hover:text-[#5A3E7A] transition-colors leading-tight tracking-wide">
                  {activeData.storeName.ar}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#5A3E7A]" />
              </div>
            </div>
          )}
          <p className="text-xs text-[#5A3E7A] mt-2 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-purple-600" />
            <span>{activeData.storeSlogan ? activeData.storeSlogan[lang] : (lang === 'ar' ? 'إشراقة طبيعية، تليق بك.' : 'Natural radiance, made for you.')}</span>
          </p>
        </div>

        {/* Tab Switcher: Sign In / Create Account / Forgot */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-2xl mb-6 border border-slate-200/70">
          <button
            type="button"
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-extrabold rounded-xl transition-all text-center min-h-[40px] ${
              activeTab === 'signin'
                ? 'bg-white text-[#5A3E7A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-extrabold rounded-xl transition-all text-center min-h-[40px] ${
              activeTab === 'register'
                ? 'bg-white text-[#5A3E7A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'ar' ? 'إنشاء حساب جديد' : 'New Account'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('forgot')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-extrabold rounded-xl transition-all text-center min-h-[40px] ${
              activeTab === 'forgot'
                ? 'bg-white text-[#5A3E7A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'ar' ? 'استعادة كلمة السر' : 'Reset'}
          </button>
        </div>

        {/* 1-Click Fast Social Auth (Google & Apple) */}
        {activeTab !== 'forgot' && (
          <div className="space-y-3 mb-6">
            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all min-h-[48px] shadow-2xs group"
            >
              <svg className="w-5 h-5 shrink-0 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
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
              <span>{lang === 'ar' ? 'المتابعة الفورية عبر حساب Google' : 'Continue with Google Account'}</span>
            </button>

            {/* Apple Button */}
            <button
              type="button"
              onClick={handleAppleAuth}
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all min-h-[48px] shadow-2xs group"
            >
              <span className="text-base leading-none"></span>
              <span>{lang === 'ar' ? 'المتابعة باستخدام Apple' : 'Continue with Apple'}</span>
            </button>

            {/* Hairline Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-3 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {lang === 'ar' ? 'أو عبر البيانات المباشرة' : 'or continue with direct credentials'}
              </span>
            </div>
          </div>
        )}

        {/* Sub-toggle for Sign In: Email vs Quick Phone & PIN */}
        {activeTab === 'signin' && (
          <div className="flex items-center gap-2 p-1 bg-purple-50/60 rounded-xl mb-4 border border-purple-100">
            <button
              type="button"
              onClick={() => setSignInMethod('password')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                signInMethod === 'password'
                  ? 'bg-white text-[#5A3E7A] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'البريد وكلمة المرور' : 'Email & Password'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSignInMethod('phone_pin')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                signInMethod === 'phone_pin'
                  ? 'bg-white text-[#5A3E7A] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'الجوال ورمز PIN' : 'Mobile & PIN'}</span>
            </button>
          </div>
        )}

        {/* Main Authentication Forms */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* REGISTER: Full Name */}
          {activeTab === 'register' && (
            <div className="space-y-1.5 text-start">
              <label className="text-xs font-bold text-slate-700 block">
                {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute start-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: سارة أحمد' : 'e.g., Sarah Jenkins'}
                  required
                  className="w-full ps-10 pe-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E7A] focus:bg-white text-slate-900 transition-all min-h-[48px]"
                />
              </div>
            </div>
          )}

          {/* SIGN IN (Password Mode) or REGISTER or FORGOT: Email Address */}
          {((activeTab === 'signin' && signInMethod === 'password') || activeTab === 'register' || activeTab === 'forgot') && (
            <div className="space-y-1.5 text-start">
              <label className="text-xs font-bold text-slate-700 block">
                {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute start-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full ps-10 pe-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E7A] focus:bg-white text-slate-900 transition-all min-h-[48px]"
                />
              </div>
            </div>
          )}

          {/* SIGN IN (Phone Mode): Smart Phone & PIN */}
          {activeTab === 'signin' && signInMethod === 'phone_pin' && (
            <div className="space-y-4">
              <SmartPhoneInput
                value={phoneNumber}
                onChange={setPhoneNumber}
                lang={lang}
                required={true}
                label={lang === 'ar' ? 'رقم الجوال المسجل' : 'Registered Mobile Number'}
              />

              <SmartPinOtpInput
                length={4}
                value={pinCode}
                onChange={setPinCode}
                lang={lang}
                onComplete={() => {
                  showToast(lang === 'ar' ? 'تم اكتمال رمز PIN! اضغط على زر الدخول' : 'PIN entered! Click Sign In');
                }}
              />
            </div>
          )}

          {/* REGISTER: Smart Phone Number */}
          {activeTab === 'register' && (
            <SmartPhoneInput
              value={phoneNumber}
              onChange={setPhoneNumber}
              lang={lang}
              required={false}
              label={lang === 'ar' ? 'رقم الهاتف للتوصيل والإشعارات (اختياري)' : 'Phone Number for Delivery & Updates (Optional)'}
            />
          )}

          {/* SIGN IN (Password Mode): Smart Password with Transient Masking */}
          {activeTab === 'signin' && signInMethod === 'password' && (
            <div className="space-y-1 text-start">
              <div className="flex items-center justify-between">
                <div className="flex-1">
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
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('forgot')}
                  className="text-[11px] text-[#5A3E7A] hover:underline font-bold"
                >
                  {lang === 'ar' ? 'نسيت كلمة السر؟' : 'Forgot password?'}
                </button>
              </div>
            </div>
          )}

          {/* REGISTER: Smart Password with Strength Meter */}
          {activeTab === 'register' && (
            <div className="space-y-4">
              <SmartPasswordInput
                id="register-password"
                label={lang === 'ar' ? 'كلمة المرور الجديدة' : 'Create Password'}
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
                    ? (lang === 'ar' ? '⚠️ كلمات المرور غير متطابقة حتى الآن' : '⚠️ Passwords do not match yet') 
                    : undefined
                }
              />
            </div>
          )}

          {/* SIGN IN: Remember Me */}
          {activeTab === 'signin' && (
            <div className="flex items-center gap-2 pt-1 text-start">
              <input
                type="checkbox"
                id="rememberMeCheckbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#5A3E7A] focus:ring-[#5A3E7A] border-slate-300 cursor-pointer"
              />
              <label htmlFor="rememberMeCheckbox" className="text-xs text-slate-600 font-medium cursor-pointer select-none">
                {lang === 'ar' ? 'تذكرني على هذا الجهاز' : 'Remember me on this device'}
              </label>
            </div>
          )}

          {/* FORGOT: Information prompt */}
          {activeTab === 'forgot' && (
            <div className="p-3.5 bg-purple-50/70 rounded-2xl text-xs text-[#5A3E7A] leading-relaxed border border-purple-100 flex items-start gap-2 text-start">
              <KeyRound className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                {lang === 'ar'
                  ? 'أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً مشفراً لإعادة ضبط كلمة المرور في ثوانٍ معدودة.'
                  : 'Enter your registered email address and we will send you a secure link to reset your password instantly.'}
              </span>
            </div>
          )}

          {/* Primary Submit CTA Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-[#5A3E7A] to-[#483162] hover:opacity-95 text-white font-extrabold rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[48px] mt-3"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{lang === 'ar' ? 'جاري المعالجة الآمنة...' : 'Processing Securely...'}</span>
              </span>
            ) : (
              <span>
                {activeTab === 'signin' && (
                  signInMethod === 'password'
                    ? (lang === 'ar' ? 'تسجيل الدخول الفوري' : 'Sign In Now')
                    : (lang === 'ar' ? 'التحقق وتسجيل الدخول' : 'Verify & Sign In')
                )}
                {activeTab === 'register' && (lang === 'ar' ? 'إنشاء حسابك الفاخر' : 'Create Luxury Account')}
                {activeTab === 'forgot' && (lang === 'ar' ? 'إرسال رابط استعادة الحساب' : 'Send Recovery Link')}
              </span>
            )}
          </button>
        </form>

        {/* Continue as Guest Button */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigateTo('store')}
            className="w-full py-3 rounded-2xl border border-dashed border-slate-300 hover:border-[#5A3E7A] hover:bg-purple-50/40 text-slate-600 hover:text-[#5A3E7A] text-xs font-bold transition-all min-h-[44px] flex items-center justify-center gap-2"
          >
            <span>{lang === 'ar' ? 'المتابعة والتسوق كزائر (بدون حساب)' : 'Continue Shopping as Guest (No account)'}</span>
            {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Security & Purity Guarantees */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-[11px] text-slate-500 text-center">
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-50">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>{lang === 'ar' ? 'تشفير آمن 256-bit' : '256-bit SSL Secure'}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-50">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5A3E7A] shrink-0" />
            <span>{lang === 'ar' ? 'خصوصية البيانات 100%' : '100% Data Privacy'}</span>
          </div>
        </div>

      </div>

      {/* Footer reassurance note */}
      <p className="text-center text-xs text-slate-400 mt-6 z-10">
        © 2026 {activeData.storeName.en} · {activeData.storeName.ar}. {lang === 'ar' ? 'جميع المعاملات مشفرة ومحمية وفق أعلى معايير الأمان.' : 'All transactions are encrypted and secure to highest standards.'}
      </p>

    </div>
  );
};
