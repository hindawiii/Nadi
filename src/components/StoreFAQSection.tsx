import React, { useMemo, useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import {
  FaqCategoryId,
  filterStoreFaqItems,
  STORE_FAQ_CATEGORIES,
} from '../data/storeFaqData';
import { openExternalUrl } from '../lib/navigation';

export const StoreFAQSection: React.FC = () => {
  const { lang, activeData } = useCommerce();
  const [activeCategory, setActiveCategory] = useState<FaqCategoryId>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-cod-payment');

  const filteredItems = useMemo(
    () => filterStoreFaqItems(activeCategory),
    [activeCategory]
  );

  const handleSelectCategory = (catId: FaqCategoryId) => {
    setActiveCategory(catId);
    const nextItems = filterStoreFaqItems(catId);
    setOpenFaqId(nextItems[0]?.id ?? null);
  };

  const handleOpenWhatsAppSupport = () => {
    const phone = activeData.contactInfo.whatsapp;
    const text =
      lang === 'ar'
        ? `مرحباً فريق ${activeData.storeName.ar}، لديّ استفسار حول المنتجات والتوصيل.`
        : `Hello ${activeData.storeName.en} team, I have a quick question about products and delivery.`;
    openExternalUrl(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`);
  };

  return (
    <section
      id="faq-section"
      aria-labelledby="store-faq-heading"
      className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="space-y-1 text-start max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#5A3E7A] tracking-wide">
            <HelpCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{lang === 'ar' ? 'إجابات واضحة قبل الطلب' : 'Clear Answers Before You Order'}</span>
          </span>
          <h2
            id="store-faq-heading"
            className="text-fluid-h2 font-black text-slate-900 font-brand-ar leading-relaxed"
          >
            {lang === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {lang === 'ar'
              ? 'كل ما تحتاجين معرفته عن التوصيل، الدفع عند الاستلام، ضمان السنتين، واختيار الروتين المناسب.'
              : 'Everything you need to know about delivery, cash on delivery, 2-year warranty, and routine selection.'}
          </p>
        </div>

        {/* Category Filter Tabs (Unified Phase 1 Slim Squircle Architecture) */}
        <div
          role="tablist"
          aria-label={lang === 'ar' ? 'تصنيفات الأسئلة الشائعة' : 'FAQ categories'}
          className="inline-flex items-center gap-1 p-1 rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-x-auto scrollbar-none max-w-full"
        >
          {STORE_FAQ_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelectCategory(cat.id)}
                className={`h-9 sm:h-10 px-3.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#5A3E7A] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                {cat.label[lang]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grouped Accordion List (Material 3 / Luxe Pro Clean Dividers) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredItems.map((item) => {
          const isOpen = openFaqId === item.id;
          const panelId = `faq-panel-${item.id}`;
          return (
            <div key={item.id} className="transition-colors">
              <button
                type="button"
                onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="w-full px-5 sm:px-6 py-4 sm:py-5 min-h-[56px] flex items-center justify-between gap-4 text-start hover:bg-slate-50/75 transition-colors cursor-pointer"
              >
                <span className="text-sm sm:text-base font-extrabold text-slate-900 leading-relaxed">
                  {item.question[lang]}
                </span>
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                    isOpen
                      ? 'bg-[#5A3E7A] text-white rotate-180'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                </span>
              </button>

              {isOpen && (
                <div
                  id={panelId}
                  className="px-5 sm:px-6 pb-5 pt-0 animate-in fade-in duration-150"
                >
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl border-s-2 border-[#5A3E7A]/30 ps-3.5">
                    {item.answer[lang]}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Concise WhatsApp Consultation Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 rounded-2xl bg-purple-50/65 border border-purple-200/70">
        <div className="text-start space-y-0.5">
          <p className="text-xs sm:text-sm font-extrabold text-slate-900">
            {lang === 'ar'
              ? 'لديكِ استفسار آخر أو ترغبين في استشارة مجانية لاختيار روتينكِ؟'
              : 'Have another question or want a free routine consultation?'}
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            {lang === 'ar'
              ? 'فريق خدمة العميلات جاهز لمساعدتكِ مباشرة عبر واتساب.'
              : 'Our care specialists are ready to assist you directly on WhatsApp.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenWhatsAppSupport}
          className="h-10 sm:h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{lang === 'ar' ? 'تحدثي معنا عبر واتساب' : 'Chat on WhatsApp'}</span>
        </button>
      </div>
    </section>
  );
};
