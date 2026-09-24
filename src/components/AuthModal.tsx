import React, { useState } from 'react';
import { X, Mail, Sparkles, Check } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { SmartPasswordInput } from './SmartInputField';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, lang, showToast } = useCommerce();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsAuthModalOpen(false);
      showToast(lang === 'ar' ? 'تم تسجيل الدخول بنجاح عبر حساب Google' : 'Signed in successfully with Google');
    }, 600);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast(lang === 'ar' ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please provide email and password');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsAuthModalOpen(false);
      showToast(lang === 'ar' ? 'مرحباً بك! تم تسجيل دخولك بنجاح' : 'Welcome back! You are logged in');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button with Safe Distance */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 end-4 w-11 h-11 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100/70 hover:bg-slate-200/80 transition-colors flex items-center justify-center min-w-[44px] min-h-[44px] z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title with Safe Padding */}
        <div className="text-center space-y-1 mb-6 px-10 sm:px-12">
          <h3 className="text-2xl font-black text-slate-900">
            {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
          </h3>
          <p className="text-xs text-slate-500">
            {lang === 'ar' ? 'أهلاً بكِ في عالم So Beauty للعناية الطبيعية' : 'Welcome back to So Beauty natural care'}
          </p>
        </div>

        {/* Google One-Click Login */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm flex items-center justify-center gap-3 transition-all min-h-[48px] shadow-xs"
        >
          {/* Google G Logo */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
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
          <span>{lang === 'ar' ? 'تسجيل الدخول عبر Google' : 'Sign in with Google'}</span>
        </button>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-3 text-xs text-slate-400 font-semibold">
            {lang === 'ar' ? 'أو' : 'or'}
          </span>
        </div>

        {/* Email / Password Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-1.5 text-start">
            <label className="text-xs font-bold text-slate-700">
              {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3E7A] focus:bg-white transition-all text-slate-800"
              />
            </div>
          </div>

          <SmartPasswordInput
            id="modal-password"
            label={lang === 'ar' ? 'كلمة المرور' : 'Password'}
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            required={true}
            lang={lang}
            showStrengthMeter={false}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#5A3E7A] hover:bg-[#493163] text-white font-extrabold rounded-2xl text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[48px]"
          >
            <span>{isSubmitting ? (lang === 'ar' ? 'جاري التحقق...' : 'Signing in...') : (lang === 'ar' ? 'دخول' : 'Sign In')}</span>
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-6 text-center space-y-2 text-xs">
          <p className="text-slate-500">
            <span>{lang === 'ar' ? 'ليس لديك حساب؟ ' : "Don't have an account? "}</span>
            <button
              onClick={() => showToast(lang === 'ar' ? 'يمكنك المتابعة والتسوق كزائر، أو تسجيل الدخول السريع عبر Google.' : 'You can checkout as guest or sign in with Google.')}
              className="text-[#5A3E7A] font-bold hover:underline"
            >
              {lang === 'ar' ? 'أنشئ حساباً' : 'Create one'}
            </button>
          </p>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            {lang === 'ar' ? 'العودة للرئيسية' : 'Return to Home'}
          </button>
        </div>

      </div>
    </div>
  );
};
