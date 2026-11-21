import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Database,
  EyeOff,
  Home,
  Lock,
  Mail,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  UserCheck,
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { openExternalUrl } from '../lib/navigation';

export const PrivacyPolicyView: React.FC = () => {
  const { lang, activeData, navigateTo } = useCommerce();
  const isRtl = lang === 'ar';

  const trustHighlights = [
    {
      icon: Lock,
      title: { ar: 'تشفير سحابي معتمد', en: 'Encrypted Cloud Storage' },
      subtitle: { ar: 'حماية صارمة لبيانات الحساب والطلبات', en: 'Strict isolation for accounts & orders' },
    },
    {
      icon: ShieldCheck,
      title: { ar: 'صفر مشاركة تجارية', en: 'Zero Commercial Sharing' },
      subtitle: { ar: 'لا نبيع أو نشارك بياناتكِ لأي جهة خارجية', en: 'Never sold or shared with third parties' },
    },
    {
      icon: EyeOff,
      title: { ar: 'خصوصية التتبع العام', en: 'Private Public Tracking' },
      subtitle: { ar: 'إخفاء الاسم والهاتف والعنوان في التتبع', en: 'Personal PII masked on public lookups' },
    },
  ];

  const policySections = [
    {
      id: 'data-collected',
      icon: Database,
      tone: 'bg-purple-50 text-[#5A3E7A] border-purple-100',
      title: {
        ar: '1. البيانات التي نجمعها والغرض منها',
        en: '1. Information We Collect & Why',
      },
      body: {
        ar: 'نجمع فقط البيانات الأساسية اللازمة لإتمام طلبكِ وتوصيله بدقة: الاسم الكامل، رقم الهاتف للتواصل عند التوصيل، وعنوان الاستلام. وعند اختياركِ تسجيل الدخول عبر حساب Google، نستخدم معرّف حسابكِ فقط لمزامنة سلة المشتريات والمفضلة وسجل «طلباتي» بأمان بين أجهزتكِ.',
        en: 'We collect only the essential information required to process and deliver your order accurately: your name, contact phone number, and delivery address. When you choose to sign in with Google, your account identifier is used solely to sync your cart, wishlist, and order history securely across your devices.',
      },
    },
    {
      id: 'cloud-isolation',
      icon: Lock,
      tone: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      title: {
        ar: '2. حماية وتخزين بياناتكِ السحابية',
        en: '2. Cloud Security & Account Isolation',
      },
      body: {
        ar: 'تُحفظ سلة مشترياتكِ ومفضلتكِ وطلباتكِ داخل بنية سحابية مشفّرة ومقيّدة بقواعد صلاحيات صارمة، بحيث لا يمكن لأي مستخدمة أخرى الاطلاع على بياناتكِ أو سجل طلباتكِ، ويقتصر الوصول على صاحبة الحساب الموثّق وفريق إدارة المتجر لتنفيذ الشحن وخدمة الضمان فقط.',
        en: 'Your cart, wishlist, and orders are stored in encrypted cloud infrastructure protected by strict access rules. No other customer can view your personal details or order records; access is limited exclusively to your authenticated account and store fulfillment staff.',
      },
    },
    {
      id: 'public-tracking',
      icon: EyeOff,
      tone: 'bg-sky-50 text-sky-700 border-sky-100',
      title: {
        ar: '3. حماية الخصوصية في التتبع العام للشحنات',
        en: '3. Privacy Protection on Public Order Tracking',
      },
      body: {
        ar: 'عند استخدام ميزة «تتبع شحنتكِ» برمز التتبع (TRK-...) من أي جهاز، يعرض النظام حالة التوصيل والرقم المرجعي والإجمالي المعتمد فقط، بينما يتم حجب الاسم ورقم الهاتف وعنوان التوصيل بالكامل حفاظاً على خصوصيتكِ التامة.',
        en: 'When using the public Order Tracker with a tracking code (TRK-...) from any device, only fulfillment status, order reference, and verified total are displayed. Your name, phone number, and delivery address remain completely masked.',
      },
    },
    {
      id: 'payment-safety',
      icon: CreditCard,
      tone: 'bg-amber-50 text-amber-700 border-amber-100',
      title: {
        ar: '4. أمان طرق الدفع الإلكتروني والدفع عند الاستلام',
        en: '4. Payment Safety & Zero Credential Storage',
      },
      body: {
        ar: 'لا يقوم المتجر بتخزين أرقام البطاقات البنكية أو الرموز السرية أو كلمات مرور تطبيقات الدفع الإلكتروني (بنكك، ماي كاشي، برافو، فيزا، أبل باي، باي بال، بينانس، وريدوت باي) في أي وقت، كما نوفر خيار الدفع عند الاستلام مع معاينة الشحنة لراحة وطمأنينة كاملة.',
        en: 'Our store never stores bank card numbers, PINs, or payment app credentials (Bankak, MyCashi, Bravo, Visa, Apple Pay, PayPal, Binance, or RedotPay). We also offer Cash on Delivery with full package inspection for complete peace of mind.',
      },
    },
    {
      id: 'local-cache-pwa',
      icon: Smartphone,
      tone: 'bg-rose-50 text-rose-700 border-rose-100',
      title: {
        ar: '5. الذاكرة المؤقتة وتحسين تجربة التصفح (PWA)',
        en: '5. Local Cache & App Experience (PWA)',
      },
      body: {
        ar: 'نستخدم التخزين المحلي للمتصفح والذاكرة المؤقتة لحفظ اللغة والعملة المختارة وتسريع التصفح وتوفير عمل سلس حتى عند تذبذب الإنترنت، ويمكنكِ مسح هذه البيانات في أي لحظة من إعدادات متصفحكِ.',
        en: 'We use browser local storage and offline caching to remember your preferred language and currency, speed up browsing, and maintain smooth operation during brief network drops. You may clear this cache anytime from your browser settings.',
      },
    },
    {
      id: 'customer-rights',
      icon: UserCheck,
      tone: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      title: {
        ar: '6. حقوقكِ الكاملة في الوصول والتعديل والحذف',
        en: '6. Your Full Rights (Access, Update & Deletion)',
      },
      body: {
        ar: 'لكِ الحق الكامل في طلب مراجعة بياناتكِ المسجّلة لدينا أو تحديثها أو حذفها نهائياً في أي وقت، كما يمكنكِ تسجيل الخروج من حسابكِ بضغطة واحدة. للاستفسار أو تقديم طلب حذف بيانات، تواصلي معنا مباشرة عبر قنواتنا الرسمية أدناه.',
        en: 'You retain the full right to review, update, or request permanent deletion of your stored personal data at any time, and you may sign out with a single tap. For any privacy inquiry or deletion request, contact us directly via our official channels below.',
      },
    },
  ];

  const handlePrivacyWhatsApp = () => {
    const phone = activeData.contactInfo.whatsapp.replace(/[^0-9]/g, '');
    const text =
      lang === 'ar'
        ? `مرحباً فريق ${activeData.storeName.ar}، لديّ استفسار بخصوص سياسة الخصوصية وحماية البيانات.`
        : `Hello ${activeData.storeName.en} team, I have a question regarding your Privacy Policy and data protection.`;
    openExternalUrl(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
        {/* Unified Top Navigation & Breadcrumb */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigateTo('store')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#5A3E7A] bg-white border border-slate-200 px-4 rounded-2xl shadow-2xs transition-all min-h-[44px] cursor-pointer active:scale-95"
          >
            {isRtl ? <ArrowRight className="w-4 h-4 shrink-0" /> : <ArrowLeft className="w-4 h-4 shrink-0" />}
            <span className="whitespace-nowrap">{lang === 'ar' ? 'العودة للمتجر' : 'Back to Store'}</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Home className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {isRtl ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span className="text-[#5A3E7A] font-bold">
              {lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </span>
          </div>
        </div>

        {/* Luxury Royal Purple Trust Hero Card */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5A3E7A] via-[#483162] to-[#2F1A45] text-white p-6 sm:p-8 shadow-xl border border-purple-400/20">
          <div className="absolute -top-16 -end-16 w-56 h-56 rounded-full bg-purple-300/15 blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-5 text-start">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/15 border border-white/20 text-xs font-extrabold text-purple-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>{lang === 'ar' ? 'التزام رسمي بحماية خصوصيتكِ' : 'Official Privacy Commitment'}</span>
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-purple-200/90">
                {lang === 'ar' ? 'آخر تحديث: نوفمبر 2026' : 'Last updated: November 2026'}
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight font-brand-ar leading-tight">
                {lang === 'ar' ? 'سياسة الخصوصية وحماية البيانات' : 'Privacy Policy & Data Protection'}
              </h1>
              <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed max-w-2xl">
                {lang === 'ar'
                  ? `في متجر ${activeData.storeName.ar} نضع ثقتكِ وخصوصية بياناتكِ في صدارة أولوياتنا. توضح هذه الصفحة بشفافية كاملة كيف نتعامل مع معلوماتكِ ونحميها أثناء التسوّق والتوصيل.`
                  : `At ${activeData.storeName.en}, your trust and personal data privacy come first. This page transparently explains how we handle and protect your information during shopping and delivery.`}
              </p>
            </div>

            {/* 3 Concise Trust Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {trustHighlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 text-emerald-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <h2 className="text-xs sm:text-sm font-extrabold text-white leading-snug">
                        {item.title[lang]}
                      </h2>
                      <p className="text-[11px] text-purple-100/80 leading-relaxed">
                        {item.subtitle[lang]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Grouped Policy Sections (Material 3 Clean Dividers) */}
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {policySections.map((sec) => {
            const Icon = sec.icon;
            return (
              <article key={sec.id} className="p-5 sm:p-6 flex items-start gap-3.5 sm:gap-4 text-start">
                <div
                  className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 mt-0.5 ${sec.tone}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5 min-w-0 flex-1">
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 leading-relaxed">
                    {sec.title[lang]}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {sec.body[lang]}
                  </p>
                </div>
              </article>
            );
          })}
        </section>

        {/* Dedicated Privacy Contact Card */}
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-start">
          <div className="space-y-1">
            <h2 className="text-base font-extrabold text-slate-900 leading-relaxed">
              {lang === 'ar' ? 'هل لديكِ استفسار حول خصوصية بياناتكِ؟' : 'Questions about your privacy?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {lang === 'ar'
                ? 'فريق خدمة العملاء جاهز للرد على استفساراتكِ أو تنفيذ طلب تعديل وحذف البيانات فوراً.'
                : 'Our support team is ready to answer your questions or process any data update or deletion request.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handlePrivacyWhatsApp}
              className="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>{lang === 'ar' ? 'تواصلي عبر واتساب' : 'WhatsApp Support'}</span>
            </button>

            <a
              href={`mailto:${activeData.contactInfo.email}`}
              className="h-11 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#5A3E7A] border border-purple-200/80 text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors"
            >
              <Mail className="w-4 h-4 shrink-0" />
              <span dir="ltr">{activeData.contactInfo.email}</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
