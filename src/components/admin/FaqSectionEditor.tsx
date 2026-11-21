import React from 'react';
import { HelpCircle, MapPin, Plus, RotateCcw, Trash2 } from 'lucide-react';
import {
  FaqCategoryId,
  STORE_FAQ_CATEGORIES,
  StoreFaqItem,
} from '../../data/storeFaqData';
import {
  resolveFaqSection,
  StoreFaqSectionConfig,
} from '../../data/storeContentDefaults';

export interface FaqSectionEditorProps {
  lang: 'ar' | 'en';
  faqSection?: Partial<StoreFaqSectionConfig>;
  onUpdateFaqSection: (next: StoreFaqSectionConfig | undefined) => void;
  onNotify: (message: string) => void;
}

export const FaqSectionEditor: React.FC<FaqSectionEditorProps> = ({
  lang,
  faqSection,
  onUpdateFaqSection,
  onNotify,
}) => {
  const isAr = lang === 'ar';
  const resolved = resolveFaqSection(faqSection);

  const commit = (next: StoreFaqSectionConfig) => {
    onUpdateFaqSection(next);
  };

  const updateMeta = (key: 'kicker' | 'title' | 'ctaLabel', locale: 'ar' | 'en', value: string) => {
    commit({
      ...resolved,
      [key]: { ...resolved[key], [locale]: value },
    });
  };

  const updateItem = (idx: number, patch: Partial<StoreFaqItem>) => {
    const items = resolved.items.map((item, i) => (i === idx ? { ...item, ...patch } : item));
    commit({ ...resolved, items });
  };

  const updateItemBilingual = (
    idx: number,
    key: 'question' | 'answer',
    locale: 'ar' | 'en',
    value: string
  ) => {
    const items = resolved.items.map((item, i) =>
      i === idx ? { ...item, [key]: { ...item[key], [locale]: value } } : item
    );
    commit({ ...resolved, items });
  };

  const handleAddFaq = () => {
    const newItem: StoreFaqItem = {
      id: `faq-${Date.now()}`,
      category: 'shipping',
      question: {
        ar: 'سؤال جديد للعميلات؟',
        en: 'New customer question?',
      },
      answer: {
        ar: 'اكتبي الإجابة الواضحة والمختصرة هنا لتظهر مباشرة في المتجر.',
        en: 'Write a clear, concise answer here to display live on the storefront.',
      },
    };
    commit({ ...resolved, items: [...resolved.items, newItem] });
    onNotify(isAr ? 'تمت إضافة سؤال جديد إلى الأسئلة الشائعة' : 'Added new FAQ entry');
  };

  const handleDeleteFaq = (idx: number) => {
    if (resolved.items.length <= 1) {
      onNotify(isAr ? 'يجب الإبقاء على سؤال واحد على الأقل' : 'At least one FAQ item is required');
      return;
    }
    commit({ ...resolved, items: resolved.items.filter((_, i) => i !== idx) });
    onNotify(isAr ? 'تم حذف السؤال بنجاح' : 'FAQ entry removed');
  };

  return (
    <div id="corner-14" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-24 text-start">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-[#5A3E7A] text-white font-black text-xs flex items-center justify-center shrink-0 tabular-nums">
            14
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#5A3E7A]" />
              <span>{isAr ? 'الركن الرابع عشر: قسم الأسئلة الشائعة (FAQ)' : 'Corner 14: Store FAQ Section'}</span>
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isAr
                ? 'أضيفي أو عدّلي الأسئلة والأجوبة وتصنيفاتها (الشحن والدفع، الضمان، العناية) مع مزامنة سحابية فورية.'
                : 'Add, edit, or delete bilingual FAQ items across Shipping, Warranty, and Care with live cloud sync.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-600" />
            <span>{isAr ? 'قبل التذييل مباشرة' : 'Above Store Footer'}</span>
          </span>
          {faqSection && (
            <button
              type="button"
              onClick={() => {
                onUpdateFaqSection(undefined);
                onNotify(isAr ? 'تمت استعادة الأسئلة الشائعة الافتراضية' : 'Restored default FAQ entries');
              }}
              className="h-10 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'الافتراضي' : 'Reset'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Section Headings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {isAr ? 'العنوان العلوي المصغّر (عربي / إنجليزي)' : 'Kicker Label (AR / EN)'}
          </label>
          <div className="space-y-2">
            <input
              type="text"
              value={resolved.kicker.ar}
              onChange={(e) => updateMeta('kicker', 'ar', e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
            <input
              type="text"
              value={resolved.kicker.en}
              onChange={(e) => updateMeta('kicker', 'en', e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {isAr ? 'عنوان القسم (عربي / إنجليزي)' : 'Section Title (AR / EN)'}
          </label>
          <div className="space-y-2">
            <input
              type="text"
              value={resolved.title.ar}
              onChange={(e) => updateMeta('title', 'ar', e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold"
            />
            <input
              type="text"
              value={resolved.title.en}
              onChange={(e) => updateMeta('title', 'en', e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {isAr ? 'نص زر استفسار واتساب (عربي / إنجليزي)' : 'WhatsApp CTA Button (AR / EN)'}
          </label>
          <div className="space-y-2">
            <input
              type="text"
              value={resolved.ctaLabel.ar}
              onChange={(e) => updateMeta('ctaLabel', 'ar', e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
            <input
              type="text"
              value={resolved.ctaLabel.en}
              onChange={(e) => updateMeta('ctaLabel', 'en', e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>
        </div>
      </div>

      {/* FAQ Items List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-black text-slate-900 tabular-nums">
            {isAr ? `قائمة الأسئلة والأجوبة (${resolved.items.length})` : `Questions & Answers (${resolved.items.length})`}
          </h3>
          <button
            type="button"
            onClick={handleAddFaq}
            className="h-11 px-4 rounded-xl bg-[#5A3E7A] hover:bg-[#483162] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة سؤال جديد' : 'Add Question'}</span>
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/40 divide-y divide-slate-200/80 overflow-hidden">
          {resolved.items.map((item, idx) => (
            <div key={item.id || idx} className="p-4 sm:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-black text-[#5A3E7A] tabular-nums">
                    #{idx + 1}
                  </span>
                  <select
                    value={item.category}
                    onChange={(e) => updateItem(idx, { category: e.target.value as FaqCategoryId })}
                    className="h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    {STORE_FAQ_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label[lang]}
                      </option>
                    ))}
                  </select>
                </div>

                {resolved.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteFaq(idx)}
                    className="h-9 px-2.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'حذف' : 'Delete'}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {isAr ? 'السؤال (عربي)' : 'Question (AR)'}
                  </label>
                  <input
                    type="text"
                    value={item.question.ar}
                    onChange={(e) => updateItemBilingual(idx, 'question', 'ar', e.target.value)}
                    className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {isAr ? 'السؤال (إنجليزي)' : 'Question (EN)'}
                  </label>
                  <input
                    type="text"
                    value={item.question.en}
                    onChange={(e) => updateItemBilingual(idx, 'question', 'en', e.target.value)}
                    className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {isAr ? 'الإجابة (عربي)' : 'Answer (AR)'}
                  </label>
                  <textarea
                    rows={2}
                    value={item.answer.ar}
                    onChange={(e) => updateItemBilingual(idx, 'answer', 'ar', e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs leading-relaxed resize-y"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {isAr ? 'الإجابة (إنجليزي)' : 'Answer (EN)'}
                  </label>
                  <textarea
                    rows={2}
                    value={item.answer.en}
                    onChange={(e) => updateItemBilingual(idx, 'answer', 'en', e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs leading-relaxed resize-y"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
