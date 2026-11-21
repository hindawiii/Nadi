import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import {
  FaqCategoryId,
  filterStoreFaqItems,
  STORE_FAQ_CATEGORIES,
} from '../data/storeFaqData';
import { resolveFaqSection } from '../data/storeContentDefaults';
import { openExternalUrl } from '../lib/navigation';

export const StoreFAQSection: React.FC = () => {
  const { lang, activeData } = useCommerce();
  const faqData = useMemo(() => resolveFaqSection(activeData.faqSection), [activeData.faqSection]);

  const [activeCategory, setActiveCategory] = useState<FaqCategoryId>('shipping');
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqData.items[0]?.id ?? null);

  const filteredItems = useMemo(
    () => filterStoreFaqItems(activeCategory, faqData.items),
    [activeCategory, faqData.items]
  );

  // Keep accordion selection valid when admin updates or removes FAQ items
  useEffect(() => {
    if (openFaqId && !filteredItems.some((item) => item.id === openFaqId)) {
      setOpenFaqId(filteredItems[0]?.id ?? null);
    }
  }, [filteredItems, openFaqId]);

  const handleSelectCategory = (catId: FaqCategoryId) => {
    setActiveCategory(catId);
    const nextItems = filterStoreFaqItems(catId, faqData.items);
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
      className="max-w-7xl mx-auto px-4 sm:px-6 space-y-3 sm:space-y-4 scroll-mt-20"
    >
      {/* Section Header & Single-Row Mobile Capsule Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="space-y-0.5 text-start">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#5A3E7A] tracking-wide">
            <HelpCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{faqData.kicker[lang]}</span>
          </span>
          <h2
            id="store-faq-heading"
            className="text-fluid-h2 font-black text-slate-900 font-brand-ar leading-tight"
          >
            {faqData.title[lang]}
          </h2>
        </div>

        {/* Category Filter Tabs (Balanced 3-Pillar Capsule Bar) */}
        <div
          role="tablist"
          aria-label={lang === 'ar' ? 'تصنيفات الأسئلة الشائعة' : 'FAQ categories'}
          className="grid grid-cols-3 sm:inline-flex items-center gap-1 p-1 rounded-2xl bg-slate-100/85 border border-slate-200/90 shadow-2xs w-full sm:w-auto"
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
                className={`h-10 px-2.5 sm:px-4 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A3E7A]/40 ${
                  isActive
                    ? 'bg-[#5A3E7A] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/90'
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
        {filteredItems.length === 0 ? (
          <div className="px-6 py-8 text-center text-xs sm:text-sm text-slate-500 leading-relaxed">
            {lang === 'ar'
              ? 'لا توجد أسئلة مضافة في هذا التصنيف حالياً. يمكنكِ مراسلتنا مباشرة عبر واتساب.'
              : 'No questions are listed in this category yet. Feel free to reach out on WhatsApp.'}
          </div>
        ) : (
          filteredItems.map((item) => {
            const isOpen = openFaqId === item.id;
            const panelId = `faq-panel-${item.id}`;
            return (
              <div key={item.id} className="transition-colors">
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full px-4 sm:px-6 py-3.5 sm:py-4 min-h-[52px] flex items-center justify-between gap-3 text-start hover:bg-slate-50/75 transition-colors cursor-pointer"
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
                    className="px-4 sm:px-6 pb-4 pt-0 animate-in fade-in duration-150"
                  >
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                      {item.answer[lang]}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Direct Single WhatsApp Inquiry Button */}
      <div className="flex justify-center pt-0.5">
        <button
          type="button"
          onClick={handleOpenWhatsAppSupport}
          className="w-full sm:w-auto h-11 px-5 sm:px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" aria-hidden="true">
            <path d="M12.031 2C6.502 2 2.004 6.498 2.004 12.027c0 1.768.462 3.494 1.339 5.016L1.92 22l5.083-1.333a9.983 9.983 0 0 0 5.028 1.36h.004c5.528 0 10.025-4.498 10.027-10.027A9.97 9.97 0 0 0 19.124 4.93 9.96 9.96 0 0 0 12.031 2Zm5.84 14.167c-.246.693-1.434 1.325-1.988 1.408-.506.076-1.163.107-1.878-.12-.433-.138-.988-.321-1.7-.629-2.99-1.292-4.943-4.307-5.092-4.506-.149-.199-1.216-1.617-1.216-3.084 0-1.468.77-2.189 1.043-2.487.274-.298.597-.373.796-.373.199 0 .398.002.572.01.184.009.43-.07.673.514.249.597.846 2.065.921 2.214.075.149.124.323.025.522-.1.199-.149.323-.298.498-.149.174-.314.389-.448.522-.149.149-.304.311-.131.609.174.298.774 1.276 1.662 2.068 1.142 1.018 2.104 1.334 2.403 1.483.298.149.473.124.647-.075.174-.199.746-.871.945-1.17.199-.298.398-.248.672-.149.274.1 1.741.821 2.04.97.298.149.497.224.572.348.075.125.075.722-.171 1.415Z" />
          </svg>
          <span>{faqData.ctaLabel[lang]}</span>
        </button>
      </div>
    </section>
  );
};
