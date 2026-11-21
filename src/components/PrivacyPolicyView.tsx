import React, { useMemo } from 'react';
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
import {
  PrivacyHighlightIconId,
  PrivacySectionIconId,
  resolvePrivacyPolicyContent,
} from '../data/storeContentDefaults';

const HIGHLIGHT_ICON_MAP: Record<PrivacyHighlightIconId, typeof Lock> = {
  lock: Lock,
  shield: ShieldCheck,
  eyeOff: EyeOff,
};

const SECTION_ICON_MAP: Record<PrivacySectionIconId, { Icon: typeof Database; tone: string }> = {
  database: { Icon: Database, tone: 'bg-purple-50 text-[#5A3E7A] border-purple-100' },
  lock: { Icon: Lock, tone: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  eyeOff: { Icon: EyeOff, tone: 'bg-sky-50 text-sky-700 border-sky-100' },
  creditCard: { Icon: CreditCard, tone: 'bg-amber-50 text-amber-700 border-amber-100' },
  smartphone: { Icon: Smartphone, tone: 'bg-rose-50 text-rose-700 border-rose-100' },
  userCheck: { Icon: UserCheck, tone: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
};

export const PrivacyPolicyView: React.FC = () => {
  const { lang, activeData, navigateTo } = useCommerce();
  const isRtl = lang === 'ar';

  const policy = useMemo(
    () => resolvePrivacyPolicyContent(activeData.privacyPolicy, activeData.storeName),
    [activeData.privacyPolicy, activeData.storeName]
  );

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
                <span>{policy.kicker[lang]}</span>
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-purple-200/90">
                {policy.lastUpdated[lang]}
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight font-brand-ar leading-tight">
                {policy.title[lang]}
              </h1>
              <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed max-w-2xl">
                {policy.intro[lang]}
              </p>
            </div>

            {/* Trust Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {policy.highlights.map((item, idx) => {
                const Icon = HIGHLIGHT_ICON_MAP[item.icon] || Lock;
                return (
                  <div
                    key={item.id || idx}
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
          {policy.sections.map((sec, idx) => {
            const meta = SECTION_ICON_MAP[sec.icon] || SECTION_ICON_MAP.database;
            const Icon = meta.Icon;
            return (
              <article key={sec.id || idx} className="p-5 sm:p-6 flex items-start gap-3.5 sm:gap-4 text-start">
                <div
                  className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 mt-0.5 ${meta.tone}`}
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
              {policy.contactTitle[lang]}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {policy.contactSubtitle[lang]}
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
