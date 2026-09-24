import React from 'react';
import { 
  Sparkles, ShieldCheck, Truck, RotateCcw, MapPin, 
  Phone, Mail, Home, Package, ShoppingBag,
  Info, MessageSquare, CheckCircle2,
  Wallet, Layers, Instagram, Facebook
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

export const Footer: React.FC = () => {
  const { lang, activeData, navigateTo } = useCommerce();
  const isRtl = lang === 'ar';

  return (
    <footer className="relative bg-gradient-to-b from-[#5A3E7A] via-[#483162] to-[#2E1840] text-white pt-12 sm:pt-14 pb-10 overflow-hidden select-none border-t border-purple-800/40">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 start-1/2 -translate-x-1/2 w-full max-w-7xl h-36 bg-purple-400/10 blur-3xl pointer-events-none" />

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
              className="bg-white rounded-3xl p-5 text-center shadow-xl border border-white/20 cursor-pointer group hover:shadow-2xl transition-all duration-300 w-full max-w-sm"
            >
              <h2 className="font-brand-en font-black tracking-widest text-xl sm:text-2xl text-slate-900 group-hover:text-[#5A3E7A] transition-colors leading-tight">
                SO BEAUTY
              </h2>
              <span className="font-brand-ar font-black text-xs sm:text-sm text-[#5A3E7A] tracking-wider block mt-1">
                سو بيوتي
              </span>
              <p className="text-[11px] text-slate-500 font-semibold mt-1.5 leading-relaxed">
                {lang === 'ar'
                  ? 'أحدث منتجات العناية بالبشرة والجمال الطبيعي'
                  : 'Pure Botanical Skincare & Natural Radiance'}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-1.5 max-w-sm w-full">
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                {lang === 'ar' ? 'عالم الجمال والعناية' : 'World of Botanical Care'}
              </h3>
              <p className="text-xs text-purple-100/85 leading-relaxed font-normal">
                {lang === 'ar'
                  ? 'وجهتكم الأولى لمنتجات العناية الطبيعية بالبشرة والمستخلصات النباتية الأصلية مع ضمان شامل وخدمة استشارات ما بعد الشراء.'
                  : 'Your premier destination for authentic natural skincare and pure botanicals with comprehensive purity guarantee.'}
              </p>
            </div>

            {/* Verification Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/70 text-emerald-300 text-xs font-bold border border-purple-400/25 backdrop-blur-sm shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{lang === 'ar' ? 'منتجات أصلية معتمدة 100%' : '100% Certified Authentic'}</span>
            </div>
          </div>

          {/* Section 2: تسوّق واكتشف (Shop & Discover) */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-start space-y-3 w-full">
            <h4 className="text-sm font-extrabold text-white flex items-center justify-center sm:justify-start gap-2 pb-2.5 border-b border-white/15 w-full">
              <Sparkles className="w-4 h-4 text-purple-300" />
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
                  <span>{lang === 'ar' ? 'تصفح الكتالوج بالكامل' : 'Browse Entire Catalog'}</span>
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
                  <Sparkles className="w-4 h-4 text-purple-300 group-hover:text-amber-300 shrink-0 transition-colors" />
                  <span>{lang === 'ar' ? 'العناية الطبيعية بالبشرة' : 'Natural Skincare Solutions'}</span>
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
                  <span>{lang === 'ar' ? 'أحدث العروض والبكجات' : 'Latest Offers & Routine Sets'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Section 3: خدمة العملاء (Customer Service) */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-start space-y-3 w-full">
            <h4 className="text-sm font-extrabold text-white flex items-center justify-center sm:justify-start gap-2 pb-2.5 border-b border-white/15 w-full">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'خدمة العملاء والضمان' : 'Customer Service & Purity'}</span>
            </h4>
            <ul className="space-y-2 text-xs text-purple-100/90 font-medium w-full">
              <li>
                <button 
                  onClick={() => navigateTo('tracker')} 
                  className="hover:text-amber-300 transition-colors flex items-center justify-center sm:justify-start gap-2.5 py-1.5 text-center sm:text-start w-full group min-h-[40px]"
                >
                  <Truck className="w-4 h-4 text-purple-300 group-hover:text-amber-300 shrink-0 transition-colors" />
                  <span>{lang === 'ar' ? 'تتبع شحنتك المباشرة' : 'Live Order Tracking'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('about')} 
                  className="hover:text-amber-300 transition-colors flex items-center justify-center sm:justify-start gap-2.5 py-1.5 text-center sm:text-start w-full group min-h-[40px]"
                >
                  <Info className="w-4 h-4 text-purple-300 group-hover:text-amber-300 shrink-0 transition-colors" />
                  <span>{lang === 'ar' ? 'من نحن وقصة المتجر' : 'About Our Story'}</span>
                </button>
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2.5 py-1.5 min-h-[40px]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lang === 'ar' ? 'ضمان المنتجات الأصلية 100%' : '100% Genuine Guarantee'}</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2.5 py-1.5 min-h-[40px]">
                <RotateCcw className="w-4 h-4 text-purple-300 shrink-0" />
                <span>{lang === 'ar' ? 'خدمة العملاء والاستبدال المرن' : 'Customer Care & Flexible Returns'}</span>
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
                  href={`https://wa.me/${activeData.contactInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-md transition-transform hover:scale-110"
                  aria-label="WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center shadow-md transition-transform hover:scale-110 border border-white/20"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center shadow-md transition-transform hover:scale-110 border border-white/20"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* SMART MERGE: Global & Local Certified Payment Gateways    */}
        {/* ======================================================== */}
        <div className="py-6 border-y border-white/10 space-y-3 text-center">
          <p className="text-xs font-bold text-purple-200 tracking-wider">
            {lang === 'ar' ? 'طرق الدفع والتسوق الآمن المعتمدة عالمياً ومحلياً' : 'Certified Secure Payment Methods'}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {/* Visa */}
            <div className="h-9 px-3.5 rounded-xl bg-white text-[#1A1F71] font-black text-xs flex items-center justify-center shadow-xs border border-slate-200">
              <span className="italic tracking-tighter text-sm">VISA</span>
            </div>

            {/* MasterCard */}
            <div className="h-9 px-3.5 rounded-xl bg-white text-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-xs border border-slate-200">
              <div className="flex -space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#EB001B] inline-block opacity-90" />
                <span className="w-4 h-4 rounded-full bg-[#F79E1B] inline-block opacity-90" />
              </div>
              <span className="text-[11px] font-extrabold tracking-tight">Mastercard</span>
            </div>

            {/* Apple Pay */}
            <div className="h-9 px-3.5 rounded-xl bg-white text-slate-900 font-bold text-xs flex items-center gap-1 shadow-xs border border-slate-200">
              <span className="text-xs"></span>
              <span className="text-[11px] font-extrabold">Pay</span>
            </div>

            {/* Mada */}
            <div className="h-9 px-3.5 rounded-xl bg-white text-[#007A3D] font-black text-xs flex items-center justify-center shadow-xs border border-slate-200">
              <span className="text-[11px] font-extrabold tracking-wider">mada | مدى</span>
            </div>

            {/* Bankak (بنكك - بنك الخرطوم) */}
            <div className="h-9 px-3.5 rounded-xl bg-white text-[#006A4E] font-black text-xs flex items-center gap-1.5 shadow-xs border border-slate-200">
              <Wallet className="w-3.5 h-3.5 text-[#006A4E]" />
              <span className="text-[11px] font-extrabold">بنكك (Bankak)</span>
            </div>

            {/* Cash on Delivery (COD) */}
            <div className="h-9 px-3.5 rounded-xl bg-white text-slate-800 font-black text-xs flex items-center gap-1.5 shadow-xs border border-slate-200">
              <Truck className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[11px] font-extrabold">
                {lang === 'ar' ? 'الدفع عند الاستلام' : 'Cash On Delivery'}
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BOTTOM BAR                                               */}
        {/* ======================================================== */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start text-xs text-purple-200/90 font-medium">
          <p>
            © 2026 {activeData.storeName.en} · {activeData.storeName.ar}. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] text-purple-200/80">
            <span>{lang === 'ar' ? 'تسوق آمن وموثوق' : 'Secure & Trusted'}</span>
            <span>•</span>
            <span>{lang === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</span>
            <span>•</span>
            <span>{lang === 'ar' ? 'توصيل سريع' : 'Fast Delivery'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
