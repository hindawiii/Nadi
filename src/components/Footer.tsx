import React from 'react';
import {
  Compass, Leaf, ShieldCheck, Truck, MapPin,
  Phone, Mail, Package, Gift, HelpCircle,
  Info, MessageSquare, Sparkles, Lock,
  Wallet, Instagram, Facebook
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

export const Footer: React.FC = () => {
  const { lang, activeData, navigateTo } = useCommerce();

  return (
    <footer className="relative bg-gradient-to-b from-[#5A3E7A] via-[#483162] to-[#2E1840] text-white pt-6 sm:pt-9 pb-7 sm:pb-8 overflow-hidden select-none border-t border-purple-800/40">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 inset-x-0 mx-auto w-full max-w-7xl h-28 bg-purple-400/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-5 sm:space-y-7">
        {/* ========================================================================= */}
        {/* RESPONSIVE COMPACT FOOTER MATRIX:                                         */}
        {/* - DESKTOP (lg+): 4 balanced columns side-by-side                          */}
        {/* - MOBILE & TABLET (< lg): Brand card full-width, Shop & Care 3x3          */}
        {/*   clickable columns side-by-side, Contact row full-width below            */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-5 lg:gap-8 xl:gap-10 items-start">

          {/* Section 1: Distinct Brand White Card (Acts as Home navigation + Slogan) */}
          <div className="col-span-2 lg:col-span-1 flex flex-col items-center lg:items-start w-full">
            <button
              type="button"
              onClick={() => navigateTo('store')}
              className="bg-white rounded-2xl p-4 text-center shadow-lg border border-white/20 cursor-pointer group hover:shadow-xl transition-all duration-300 w-full max-w-sm flex flex-col items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              {activeData.storeLogo ? (
                <img
                  src={activeData.storeLogo}
                  alt={`${activeData.storeName.en} - ${activeData.storeName.ar}`}
                  className="h-11 w-auto max-h-11 object-contain mx-auto my-0.5"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-1.5 text-center">
                  <h2 className="font-brand-geometric font-black text-2xl sm:text-[1.7rem] text-[#5A3E7A] tracking-[0.26em] uppercase block leading-none">
                    {activeData.storeName.en}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="font-brand-ar font-black text-base text-slate-800 group-hover:text-[#5A3E7A] transition-colors leading-tight tracking-wide">
                      {activeData.storeName.ar.includes('ـ')
                        ? activeData.storeName.ar
                        : (activeData.storeName.ar === 'نَدِي' || activeData.storeName.ar === 'ندي'
                            ? 'نَـــــدِي'
                            : activeData.storeName.ar)}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5A3E7A]/60" />
                  </div>
                </div>
              )}
              <p className="text-xs text-[#5A3E7A] font-bold mt-2 leading-relaxed">
                {activeData.storeSlogan
                  ? activeData.storeSlogan[lang]
                  : (lang === 'ar'
                      ? 'إشراقة طبيعية، تليق بك.'
                      : 'Natural radiance, made for you.')}
              </p>
            </button>
          </div>

          {/* Section 2: تسوّق واكتشف (Shop & Discover — 3 Direct Clickable Pillars) */}
          <div className="col-span-1 flex flex-col items-start text-start space-y-2 w-full">
            <h4 className="text-[13px] sm:text-sm font-extrabold text-white flex items-center justify-start gap-1.5 sm:gap-2 pb-1.5 border-b border-white/15 w-full">
              <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-300 shrink-0" />
              <span>{lang === 'ar' ? 'تسوّق واكتشف' : 'Shop & Discover'}</span>
            </h4>
            <ul className="space-y-0.5 text-xs text-purple-100/90 font-medium w-full">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigateTo('store');
                    setTimeout(() => {
                      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-amber-300 transition-colors flex items-center justify-start gap-2 py-1 text-start w-full group min-h-[42px] sm:min-h-[44px] cursor-pointer"
                >
                  <Package className="w-3.5 h-3.5 text-purple-300 group-hover:text-amber-300 shrink-0 transition-colors" />
                  <span className="leading-snug">{lang === 'ar' ? 'جميع المنتجات' : 'All Products'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigateTo('store');
                    setTimeout(() => {
                      document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-amber-300 transition-colors flex items-center justify-start gap-2 py-1 text-start w-full group min-h-[42px] sm:min-h-[44px] cursor-pointer"
                >
                  <Leaf className="w-3.5 h-3.5 text-emerald-300 group-hover:text-amber-300 shrink-0 transition-colors" />
                  <span className="leading-snug">{lang === 'ar' ? 'العناية بالبشرة' : 'Skincare'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigateTo('store');
                    setTimeout(() => {
                      document.getElementById('hair-devices-carousel')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-amber-300 transition-colors flex items-center justify-start gap-2 py-1 text-start w-full group min-h-[42px] sm:min-h-[44px] cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-300 group-hover:text-amber-300 shrink-0 transition-colors" />
                  <span className="leading-snug">{lang === 'ar' ? 'أجهزة الشعر' : 'Hair Devices'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigateTo('store');
                    setTimeout(() => {
                      document.getElementById('campaign-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-amber-300 transition-colors flex items-center justify-start gap-2 py-1 text-start w-full group min-h-[42px] sm:min-h-[44px] cursor-pointer"
                >
                  <Gift className="w-3.5 h-3.5 text-amber-300 group-hover:text-amber-200 shrink-0 transition-colors" />
                  <span className="leading-snug">{lang === 'ar' ? 'العروض والبكجات' : 'Offers & Sets'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Section 3: خدمة العملاء (Customer Care — 3 Real Clickable Links, Zero Dead Filler) */}
          <div className="col-span-1 flex flex-col items-start text-start space-y-2 w-full">
            <h4 className="text-[13px] sm:text-sm font-extrabold text-white flex items-center justify-start gap-1.5 sm:gap-2 pb-1.5 border-b border-white/15 w-full">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
              <span>{lang === 'ar' ? 'خدمة العملاء' : 'Customer Care'}</span>
            </h4>
            <ul className="space-y-0.5 text-xs text-purple-100/90 font-medium w-full">
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('tracker')}
                  className="hover:text-amber-300 transition-colors flex items-center justify-start gap-2 py-1 text-start w-full group min-h-[42px] sm:min-h-[44px] cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 text-purple-300 group-hover:text-amber-300 shrink-0 transition-colors" />
                  <span className="leading-snug">{lang === 'ar' ? 'تتبع شحنتكِ' : 'Track Your Order'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('about')}
                  className="hover:text-amber-300 transition-colors flex items-center justify-start gap-2 py-1 text-start w-full group min-h-[42px] sm:min-h-[44px] cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-purple-300 group-hover:text-amber-300 shrink-0 transition-colors" />
                  <span className="leading-snug">{lang === 'ar' ? 'من نحن' : 'About Us'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigateTo('store');
                    setTimeout(() => {
                      document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-amber-300 transition-colors flex items-center justify-start gap-2 py-1 text-start w-full group min-h-[42px] sm:min-h-[44px] cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-purple-300 group-hover:text-amber-300 shrink-0 transition-colors" />
                  <span className="leading-snug">{lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('privacy')}
                  className="hover:text-amber-300 transition-colors flex items-center justify-start gap-2 py-1 text-start w-full group min-h-[42px] sm:min-h-[44px] cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-300 group-hover:text-amber-300 shrink-0 transition-colors" />
                  <span className="leading-snug">{lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Section 4: قنوات التواصل (Communication & Socials) */}
          <div className="col-span-2 lg:col-span-1 flex flex-col items-start text-start space-y-2.5 w-full pt-3 lg:pt-0 border-t border-white/10 lg:border-t-0">
            <h4 className="text-[13px] sm:text-sm font-extrabold text-white flex items-center justify-start gap-2 pb-1.5 border-b border-white/15 w-full">
              <MessageSquare className="w-4 h-4 text-purple-300 shrink-0" />
              <span>{lang === 'ar' ? 'قنوات التواصل' : 'Communication Channels'}</span>
            </h4>

            <div className="space-y-1 text-xs text-purple-100/90 w-full">
              <div className="flex items-center justify-start gap-2 py-0.5">
                <MapPin className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                <span className="leading-relaxed">{activeData.contactInfo.address[lang]}</span>
              </div>
              <div className="flex items-center justify-start gap-2 py-0.5">
                <Phone className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                <span dir="ltr" className="font-mono font-bold tracking-wider">{activeData.contactInfo.phone}</span>
              </div>
              <div className="flex items-center justify-start gap-2 py-0.5">
                <Mail className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                <span className="truncate">{activeData.contactInfo.email}</span>
              </div>
            </div>

            {/* Social Media Links (Sleek 36px icons matching footer typography scale) */}
            <div className="pt-1 flex items-center justify-between lg:flex-col lg:items-start gap-2.5 w-full">
              <span className="text-[11px] text-purple-200 font-semibold">
                {lang === 'ar' ? 'تابعنا عبر السوشيال ميديا:' : 'Follow Us:'}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={`https://api.whatsapp.com/send?phone=${activeData.contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#1ebe5b] text-white flex items-center justify-center shadow-sm transition-transform hover:scale-105 active:scale-95"
                  aria-label="WhatsApp"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M12.031 2C6.502 2 2.004 6.498 2.004 12.027c0 1.768.462 3.494 1.339 5.016L1.92 22l5.083-1.333a9.983 9.983 0 0 0 5.028 1.36h.004c5.528 0 10.025-4.498 10.027-10.027A9.97 9.97 0 0 0 19.124 4.93 9.96 9.96 0 0 0 12.031 2Zm5.84 14.167c-.246.693-1.434 1.325-1.988 1.408-.506.076-1.163.107-1.878-.12-.433-.138-.988-.321-1.7-.629-2.99-1.292-4.943-4.307-5.092-4.506-.149-.199-1.216-1.617-1.216-3.084 0-1.468.77-2.189 1.043-2.487.274-.298.597-.373.796-.373.199 0 .398.002.572.01.184.009.43-.07.673.514.249.597.846 2.065.921 2.214.075.149.124.323.025.522-.1.199-.149.323-.298.498-.149.174-.314.389-.448.522-.149.149-.304.311-.131.609.174.298.774 1.276 1.662 2.068 1.142 1.018 2.104 1.334 2.403 1.483.298.149.473.124.647-.075.174-.199.746-.871.945-1.17.199-.298.398-.248.672-.149.274.1 1.741.821 2.04.97.298.149.497.224.572.348.075.125.075.722-.171 1.415Z" />
                  </svg>
                </a>
                {(activeData.contactInfo.instagramUrl ?? 'https://instagram.com') && (
                  <a
                    href={activeData.contactInfo.instagramUrl || 'https://instagram.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center shadow-sm transition-transform hover:scale-105 active:scale-95 border border-white/20"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {(activeData.contactInfo.facebookUrl ?? 'https://facebook.com') && (
                  <a
                    href={activeData.contactInfo.facebookUrl || 'https://facebook.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center shadow-sm transition-transform hover:scale-105 active:scale-95 border border-white/20"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* PAYMENT BADGES: Ultra-Slim Continuous Luxury Marquee     */}
        {/* ======================================================== */}
        <div className="py-3.5 sm:py-4 border-y border-white/10 space-y-2 text-center">
          <p className="text-[11px] sm:text-xs font-bold text-purple-200/90 tracking-wider">
            {lang === 'ar' ? 'طرق الدفع المعتمدة' : 'Accepted Payment Methods'}
          </p>

          <div
            dir="ltr"
            aria-label={lang === 'ar' ? 'طرق الدفع المعتمدة' : 'Accepted payment methods'}
            className="relative overflow-hidden mask-fade-edges py-0.5"
          >
            <div className="animate-payment-marquee pause-on-hover items-center">
              {[0, 1].map((loopIdx) => (
                <div
                  key={loopIdx}
                  aria-hidden={loopIdx === 1}
                  className="flex items-center gap-2 pe-2 shrink-0"
                >
                  <div className="h-7 px-2.5 rounded-lg bg-white/95 text-[#006A4E] flex items-center gap-1.5 shadow-2xs border border-white/25 whitespace-nowrap">
                    <Wallet className="w-3 h-3 text-[#006A4E] shrink-0" />
                    <span className="text-[11px] font-extrabold leading-none">
                      {lang === 'ar' ? 'بنكك' : 'Bankak'}
                    </span>
                  </div>

                  <div className="h-7 px-2.5 rounded-lg bg-white/95 text-[#5A3E7A] flex items-center gap-1.5 shadow-2xs border border-white/25 whitespace-nowrap">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#5A3E7A] text-white font-black text-[8px] flex items-center justify-center shrink-0">C</span>
                    <span className="text-[11px] font-extrabold leading-none">
                      {lang === 'ar' ? 'ماي كاشي' : 'MyCashi'}
                    </span>
                  </div>

                  <div className="h-7 px-2.5 rounded-lg bg-white/95 text-indigo-700 flex items-center gap-1.5 shadow-2xs border border-white/25 whitespace-nowrap">
                    <span className="w-3.5 h-3.5 rounded-full bg-indigo-600 text-white font-black text-[8px] flex items-center justify-center shrink-0">B</span>
                    <span className="text-[11px] font-extrabold leading-none">
                      {lang === 'ar' ? 'برافو' : 'Bravo'}
                    </span>
                  </div>

                  <div className="h-7 px-2.5 rounded-lg bg-white/95 text-[#1A1F71] flex items-center justify-center shadow-2xs border border-white/25 whitespace-nowrap">
                    <span className="italic tracking-tighter text-xs font-black leading-none">VISA</span>
                  </div>

                  <div
                    className="h-7 px-2.5 rounded-lg bg-white/95 text-slate-900 flex items-center gap-1 shadow-2xs border border-white/25 whitespace-nowrap"
                    aria-label="Apple Pay"
                  >
                    <svg
                      viewBox="0 0 384 512"
                      className="w-2.5 h-3 fill-current shrink-0 -mt-0.5"
                      aria-hidden="true"
                    >
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                    </svg>
                    <span className="text-[11px] font-extrabold tracking-tight leading-none">Pay</span>
                  </div>

                  <div className="h-7 px-2.5 rounded-lg bg-white/95 text-[#003087] flex items-center gap-1.5 shadow-2xs border border-white/25 whitespace-nowrap">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#003087] text-white font-black text-[8px] flex items-center justify-center shrink-0">P</span>
                    <span className="text-[11px] font-black italic leading-none">PayPal</span>
                  </div>

                  <div className="h-7 px-2.5 rounded-lg bg-white/95 text-slate-900 flex items-center gap-1 shadow-2xs border border-white/25 whitespace-nowrap">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#F3BA2F] text-slate-950 font-black text-[8px] flex items-center justify-center shrink-0">B</span>
                    <span className="text-[11px] font-black leading-none">Binance</span>
                  </div>

                  <div className="h-7 px-2.5 rounded-lg bg-white/95 text-rose-600 flex items-center gap-1 shadow-2xs border border-white/25 whitespace-nowrap">
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-600 text-white font-black text-[8px] flex items-center justify-center shrink-0">R</span>
                    <span className="text-[11px] font-black leading-none">RedotPay</span>
                  </div>

                  <div className="h-7 px-2.5 rounded-lg bg-white/95 text-slate-800 flex items-center gap-1.5 shadow-2xs border border-white/25 whitespace-nowrap">
                    <Truck className="w-3 h-3 text-amber-600 shrink-0" />
                    <span className="text-[11px] font-extrabold leading-none">
                      {lang === 'ar' ? 'عند الاستلام' : 'Cash on Delivery'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BOTTOM BAR - COPYRIGHT                                   */}
        {/* ======================================================== */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-start text-xs text-purple-200/90 font-medium">
          <p>
            © 2026 {activeData.storeName.en} · {activeData.storeName.ar}. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <p className="text-[11px] text-purple-200/80">
            {lang === 'ar' ? 'توصيل سريع · دعم مباشر عبر واتساب' : 'Fast Delivery · Direct WhatsApp Support'}
          </p>
        </div>
      </div>
    </footer>
  );
};
