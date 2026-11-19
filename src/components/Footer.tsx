import React from 'react';
import { 
  Compass, Leaf, ShieldCheck, Truck, RotateCcw, MapPin, 
  Phone, Mail, Home, Package,
  Info, MessageSquare, CheckCircle2,
  Wallet, Instagram, Facebook
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

export const Footer: React.FC = () => {
  const { lang, activeData, navigateTo } = useCommerce();
  const isRtl = lang === 'ar';

  return (
    <footer className="relative bg-gradient-to-b from-[#5A3E7A] via-[#483162] to-[#2E1840] text-white pt-12 sm:pt-14 pb-24 sm:pb-14 overflow-hidden select-none border-t border-purple-800/40">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 inset-x-0 mx-auto w-full max-w-7xl h-36 bg-purple-400/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-10 sm:space-y-12">
        
        {/* ========================================================================= */}
        {/* RESPONSIVE FOOTER STRUCTURE (LUXE PRO MATRIX):                            */}
        {/* - DESKTOP (lg+): 4 perfectly balanced, spacious columns                   */}
        {/* - TABLET (sm to lg): 2x2 spacious, highly legible columns                 */}
        {/* - MOBILE (< sm): Clean, structured flow with generous touch targets       */}
        {/* ========================================================================= */}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 xl:gap-12 items-start">
          
          {/* Section 1: Distinct Brand White Card + Bio */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-start space-y-4 w-full">
            {/* The Dedicated White Brand Card for Crystal Clarity */}
            <div 
              onClick={() => navigateTo('store')}
              className="bg-white rounded-3xl p-5 text-center shadow-xl border border-white/20 cursor-pointer group hover:shadow-2xl transition-all duration-300 w-full max-w-sm flex flex-col items-center justify-center"
            >
              {activeData.storeLogo ? (
                <img 
                  src={activeData.storeLogo} 
                  alt={`${activeData.storeName.en} - ${activeData.storeName.ar}`} 
                  className="h-12 w-auto max-h-12 object-contain mx-auto my-1" 
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  {/* English Name: Modern Geometric Luxury Uppercase (Always on Top & LARGER) */}
                  <h2 className="font-brand-geometric font-black text-2xl sm:text-3xl text-[#5A3E7A] tracking-[0.26em] uppercase block leading-none">
                    {activeData.storeName.en}
                  </h2>
                  {/* Arabic Name: Elongated, prominent & elegant underneath with safe distance */}
                  <div className="flex items-center gap-2">
                    <span className="font-brand-ar font-black text-base sm:text-lg text-slate-800 group-hover:text-[#5A3E7A] transition-colors leading-tight tracking-wide">
                      {activeData.storeName.ar.includes('ـ') ? activeData.storeName.ar : (activeData.storeName.ar === 'نَدِي' || activeData.storeName.ar === 'ندي' ? 'نَـــــدِي' : activeData.storeName.ar)}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5A3E7A]/60" />
                  </div>
                </div>
              )}
              <p className="text-xs text-[#5A3E7A] font-bold mt-2 leading-relaxed">
                {activeData.storeSlogan ? activeData.storeSlogan[lang] : (lang === 'ar'
                  ? 'إشراقة طبيعية، تليق بك.'
                  : 'Natural radiance, made for you.')}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-1.5 max-w-sm w-full">
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                {activeData.footerAbout?.title ? activeData.footerAbout.title[lang] : (lang === 'ar' ? 'عناية طبيعية أصلية' : 'Authentic Natural Care')}
              </h3>
              <p className="text-xs text-purple-100/85 leading-relaxed font-normal">
                {activeData.footerAbout?.description ? activeData.footerAbout.description[lang] : (lang === 'ar'
                  ? 'منتجات عناية طبيعية أصلية مع استشارات مخصصة قبل وبعد الشراء.'
                  : 'Authentic natural skincare with dedicated guidance before and after purchase.')}
              </p>
            </div>
          </div>

          {/* Section 2: تسوّق واكتشف (Shop & Discover) */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-start space-y-3 w-full">
            <h4 className="text-sm font-extrabold text-white flex items-center justify-center sm:justify-start gap-2 pb-2.5 border-b border-white/15 w-full">
              <Compass className="w-4 h-4 text-purple-300" />
              <span>{lang === 'ar' ? 'تسوّق واكتشف' : 'Shop & Discover'}</span>
            </h4>
            <ul className="space-y-2 text-xs text-purple-100/90 font-medium w-full">
              <li>
                <button 
                  onClick={() => navigateTo('store')} 
                  className="hover:text-amber-300 transition-colors flex items-center justify-center sm:justify-start gap-2.5 py-1.5 text-center sm:text-start w-full group min-h-[40px]"
                >
                  <Home className="w-4 h-4 text-purple-300 group-hover:text-amber-300 shrink-0 transition-colors" />
                  <span>{lang === 'ar' ? 'الصفحة الرئيسية' : 'Home Page'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    navigateTo('store');
                    setTimeout(() => {
                      document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }} 
                  className="hover:text-amber-300 transition-colors flex items-center justify-center sm:justify-start gap-2.5 py-1.5 text-center sm:text-start w-full group min-h-[40px]"
                >
                  <Package className="w-4 h-4 text-purple-300 group-hover:text-amber-300 shrink-0 transition-colors" />
                  <span>{lang === 'ar' ? 'جميع المنتجات' : 'All Products'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    navigateTo('store');
                    setTimeout(() => {
                      document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }} 
                  className="hover:text-amber-300 transition-colors flex items-center justify-center sm:justify-start gap-2.5 py-1.5 text-center sm:text-start w-full group min-h-[40px]"
                >
                  <Leaf className="w-4 h-4 text-emerald-300 group-hover:text-amber-300 shrink-0 transition-colors" />
                  <span>{lang === 'ar' ? 'العناية بالبشرة' : 'Skincare'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    navigateTo('store');
                    setTimeout(() => {
                      document.getElementById('campaign-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }} 
                  className="hover:text-amber-300 transition-colors flex items-center justify-center sm:justify-start gap-2.5 py-1.5 text-center sm:text-start w-full group min-h-[40px]"
                >
                  <Truck className="w-4 h-4 text-purple-300 group-hover:text-amber-300 shrink-0 transition-colors" />
                  <span>{lang === 'ar' ? 'العروض والبكجات' : 'Offers & Sets'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Section 3: خدمة العملاء (Customer Service) */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-start space-y-3 w-full">
            <h4 className="text-sm font-extrabold text-white flex items-center justify-center sm:justify-start gap-2 pb-2.5 border-b border-white/15 w-full">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'خدمة العملاء' : 'Customer Care'}</span>
            </h4>
            <ul className="space-y-2 text-xs text-purple-100/90 font-medium w-full">
              <li>
                <button 
                  onClick={() => navigateTo('tracker')} 
                  className="hover:text-amber-300 transition-colors flex items-center justify-center sm:justify-start gap-2.5 py-1.5 text-center sm:text-start w-full group min-h-[40px]"
                >
                  <Truck className="w-4 h-4 text-purple-300 group-hover:text-amber-300 shrink-0 transition-colors" />
                  <span>{lang === 'ar' ? 'تتبع شحنتكِ' : 'Track Your Order'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('about')} 
                  className="hover:text-amber-300 transition-colors flex items-center justify-center sm:justify-start gap-2.5 py-1.5 text-center sm:text-start w-full group min-h-[40px]"
                >
                  <Info className="w-4 h-4 text-purple-300 group-hover:text-amber-300 shrink-0 transition-colors" />
                  <span>{lang === 'ar' ? 'من نحن' : 'About Us'}</span>
                </button>
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2.5 py-1.5 min-h-[40px]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lang === 'ar' ? 'منتجات أصلية 100%' : '100% Authentic Products'}</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2.5 py-1.5 min-h-[40px]">
                <RotateCcw className="w-4 h-4 text-purple-300 shrink-0" />
                <span>{lang === 'ar' ? 'استبدال واسترجاع مرن' : 'Flexible Returns'}</span>
              </li>
            </ul>
          </div>

          {/* Section 4: قنوات التواصل (Communication & Socials) */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-start space-y-3 w-full">
            <h4 className="text-sm font-extrabold text-white flex items-center justify-center sm:justify-start gap-2 pb-2.5 border-b border-white/15 w-full">
              <MessageSquare className="w-4 h-4 text-purple-300" />
              <span>{lang === 'ar' ? 'قنوات التواصل' : 'Communication Channels'}</span>
            </h4>
            
            <div className="space-y-2 text-xs text-purple-100/90 w-full">
              <div className="flex items-center justify-center sm:justify-start gap-2.5 py-1.5">
                <MapPin className="w-4 h-4 text-purple-300 shrink-0" />
                <span className="leading-relaxed">{activeData.contactInfo.address[lang]}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2.5 py-1.5">
                <Phone className="w-4 h-4 text-purple-300 shrink-0" />
                <span dir="ltr" className="font-mono font-bold tracking-wider">{activeData.contactInfo.phone}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2.5 py-1.5">
                <Mail className="w-4 h-4 text-purple-300 shrink-0" />
                <span className="truncate">{activeData.contactInfo.email}</span>
              </div>
            </div>

            {/* Social Media Badges */}
            <div className="pt-2 space-y-2.5 flex flex-col items-center sm:items-start w-full">
              <span className="text-[11px] text-purple-200 block font-semibold text-center sm:text-start">
                {lang === 'ar' ? 'تابعنا عبر السوشيال ميديا:' : 'Follow Us on Social Media:'}
              </span>
              <div className="flex items-center justify-center sm:justify-start gap-2.5">
                <a
                  href={`https://api.whatsapp.com/send?phone=${activeData.contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-md transition-transform hover:scale-110"
                  aria-label="WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
                {(activeData.contactInfo.instagramUrl ?? 'https://instagram.com') && (
                  <a
                    href={activeData.contactInfo.instagramUrl || 'https://instagram.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center shadow-md transition-transform hover:scale-110 border border-white/20"
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
                    className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center shadow-md transition-transform hover:scale-110 border border-white/20"
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
        {/* PAYMENT BADGES: Global First, then Sudan Wallets          */}
        {/* ======================================================== */}
        <div className="py-6 border-y border-white/10 space-y-3 text-center">
          <p className="text-xs font-bold text-purple-200 tracking-wider">
            {lang === 'ar' ? 'طرق الدفع المعتمدة' : 'Accepted Payment Methods'}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {/* Binance Pay */}
            <div className="h-9 px-3 rounded-xl bg-white text-slate-900 font-extrabold text-xs flex items-center gap-1.5 shadow-xs border border-slate-200">
              <span className="w-3.5 h-3.5 rounded-full bg-[#F3BA2F] text-slate-950 font-black text-[9px] flex items-center justify-center">B</span>
              <span className="text-[11px] font-black">Binance Pay</span>
            </div>

            {/* RedotPay */}
            <div className="h-9 px-3 rounded-xl bg-white text-rose-600 font-extrabold text-xs flex items-center gap-1.5 shadow-xs border border-slate-200">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-600 text-white font-black text-[9px] flex items-center justify-center">R</span>
              <span className="text-[11px] font-black">RedotPay</span>
            </div>

            {/* PayPal */}
            <div className="h-9 px-3 rounded-xl bg-white text-[#003087] font-black text-xs flex items-center gap-1.5 shadow-xs border border-slate-200">
              <span className="w-3.5 h-3.5 rounded-full bg-[#003087] text-white font-black text-[9px] flex items-center justify-center">P</span>
              <span className="text-[11px] font-black italic">PayPal</span>
            </div>

            {/* Visa */}
            <div className="h-9 px-3 rounded-xl bg-white text-[#1A1F71] font-black text-xs flex items-center justify-center shadow-xs border border-slate-200">
              <span className="italic tracking-tighter text-sm font-black">VISA</span>
            </div>

            {/* Apple Pay */}
            <div
              dir="ltr"
              className="h-9 px-3 rounded-xl bg-white text-slate-900 font-bold text-xs flex items-center gap-1 shadow-xs border border-slate-200"
              aria-label="Apple Pay"
            >
              <svg
                viewBox="0 0 384 512"
                className="w-3 h-3.5 fill-current shrink-0 -mt-0.5"
                aria-hidden="true"
              >
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
              </svg>
              <span className="text-[11px] font-extrabold tracking-tight">Pay</span>
            </div>

            {/* Bankak (بنكك / Bankak) */}
            <div className="h-9 px-3 rounded-xl bg-white text-[#006A4E] font-black text-xs flex items-center gap-1.5 shadow-xs border border-slate-200">
              <Wallet className="w-3.5 h-3.5 text-[#006A4E]" />
              <span className="text-[11px] font-extrabold">
                {lang === 'ar' ? 'بنكك' : 'Bankak'}
              </span>
            </div>

            {/* My Cashi (ماي كاشي / MyCashi) */}
            <div className="h-9 px-3 rounded-xl bg-white text-[#5A3E7A] font-black text-xs flex items-center gap-1.5 shadow-xs border border-slate-200">
              <span className="w-3.5 h-3.5 rounded-full bg-[#5A3E7A] text-white font-black text-[9px] flex items-center justify-center">C</span>
              <span className="text-[11px] font-extrabold">
                {lang === 'ar' ? 'ماي كاشي' : 'MyCashi'}
              </span>
            </div>

            {/* Bravo (برافو / Bravo Pay) */}
            <div className="h-9 px-3 rounded-xl bg-white text-indigo-700 font-black text-xs flex items-center gap-1.5 shadow-xs border border-slate-200">
              <span className="w-3.5 h-3.5 rounded-full bg-indigo-600 text-white font-black text-[9px] flex items-center justify-center">B</span>
              <span className="text-[11px] font-extrabold">
                {lang === 'ar' ? 'برافو' : 'Bravo'}
              </span>
            </div>

            {/* Cash on Delivery (COD) */}
            <div className="h-9 px-3 rounded-xl bg-white text-slate-800 font-black text-xs flex items-center gap-1.5 shadow-xs border border-slate-200">
              <Truck className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[11px] font-extrabold">
                {lang === 'ar' ? 'الدفع عند الاستلام' : 'Cash On Delivery'}
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BOTTOM BAR - COPYRIGHT                                   */}
        {/* ======================================================== */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-start text-xs text-purple-200/90 font-medium">
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
