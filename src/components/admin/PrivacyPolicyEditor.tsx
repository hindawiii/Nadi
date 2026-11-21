import React from 'react';
import { MapPin, Plus, RotateCcw, ShieldCheck, Trash2 } from 'lucide-react';
import {
  BilingualText,
  PrivacyPolicyConfig,
  PrivacyPolicySectionConfig,
  PrivacySectionIconId,
  resolvePrivacyPolicyContent,
} from '../../data/storeContentDefaults';

export interface PrivacyPolicyEditorProps {
  lang: 'ar' | 'en';
  storeName: BilingualText;
  privacyPolicy?: Partial<PrivacyPolicyConfig>;
  onUpdatePrivacyPolicy: (next: PrivacyPolicyConfig | undefined) => void;
  onNotify: (message: string) => void;
}

export const PrivacyPolicyEditor: React.FC<PrivacyPolicyEditorProps> = ({
  lang,
  storeName,
  privacyPolicy,
  onUpdatePrivacyPolicy,
  onNotify,
}) => {
  const isAr = lang === 'ar';
  const resolved = resolvePrivacyPolicyContent(privacyPolicy, storeName);

  const updateMeta = (
    key: 'kicker' | 'lastUpdated' | 'title' | 'intro' | 'contactTitle' | 'contactSubtitle',
    locale: 'ar' | 'en',
    val: string
  ) => {
    onUpdatePrivacyPolicy({
      ...resolved,
      [key]: { ...resolved[key], [locale]: val },
    });
  };

  const updateHighlight = (
    idx: number,
    key: 'title' | 'subtitle',
    locale: 'ar' | 'en',
    val: string
  ) => {
    const highlights = resolved.highlights.map((h, i) =>
      i === idx ? { ...h, [key]: { ...h[key], [locale]: val } } : h
    );
    onUpdatePrivacyPolicy({ ...resolved, highlights });
  };

  const updateSectionIcon = (idx: number, icon: PrivacySectionIconId) => {
    const sections = resolved.sections.map((s, i) => (i === idx ? { ...s, icon } : s));
    onUpdatePrivacyPolicy({ ...resolved, sections });
  };

  const updateSectionBilingual = (
    idx: number,
    key: 'title' | 'body',
    locale: 'ar' | 'en',
    val: string
  ) => {
    const sections = resolved.sections.map((s, i) =>
      i === idx ? { ...s, [key]: { ...s[key], [locale]: val } } : s
    );
    onUpdatePrivacyPolicy({ ...resolved, sections });
  };

  const handleAddClause = () => {
    const num = resolved.sections.length + 1;
    const nextClause: PrivacyPolicySectionConfig = {
      id: `policy-clause-${Date.now()}`,
      icon: 'userCheck',
      title: {
        ar: `${num}. بند خصوصية إضافي`,
        en: `${num}. Additional Privacy Clause`,
      },
      body: {
        ar: 'اكتبي تفاصيل البند القانوني هنا بوضوح وشفافية.',
        en: 'Write the clear legal or privacy details for this clause here.',
      },
    };
    onUpdatePrivacyPolicy({
      ...resolved,
      sections: [...resolved.sections, nextClause],
    });
    onNotify(isAr ? 'تمت إضافة بند جديد إلى سياسة الخصوصية' : 'Added new privacy clause');
  };

  const handleDeleteClause = (idx: number) => {
    if (resolved.sections.length <= 1) {
      onNotify(isAr ? 'يجب الإبقاء على بند واحد على الأقل' : 'At least one policy clause is required');
      return;
    }
    onUpdatePrivacyPolicy({
      ...resolved,
      sections: resolved.sections.filter((_, i) => i !== idx),
    });
    onNotify(isAr ? 'تم حذف البند بنجاح' : 'Privacy clause deleted');
  };

  return (
    <div id="corner-16" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 scroll-mt-24 text-start">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-[#5A3E7A] text-white font-black text-xs flex items-center justify-center shrink-0 tabular-nums">
            16
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#5A3E7A]" />
              <span>{isAr ? 'الركن السادس عشر: صفحة سياسة الخصوصية وحماية البيانات' : 'Corner 16: Privacy Policy Page'}</span>
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isAr
                ? 'عدّلي تاريخ التحديث، المقدمة، ركائز الثقة الثلاث، وجميع بنود الخصوصية باللغتين العربية والإنجليزية.'
                : 'Customize the update date, hero intro, 3 trust highlights, and all bilingual privacy clauses.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-600" />
            <span>{isAr ? 'صفحة سياسة الخصوصية' : '/privacy Page'}</span>
          </span>
          {privacyPolicy && (
            <button
              type="button"
              onClick={() => {
                onUpdatePrivacyPolicy(undefined);
                onNotify(isAr ? 'تمت استعادة سياسة الخصوصية الافتراضية' : 'Restored default Privacy Policy');
              }}
              className="h-10 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'الافتراضي' : 'Reset'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Header & Intro */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {isAr ? 'عنوان الصفحة الرئيسي (عربي)' : 'Page Headline (AR)'}
          </label>
          <input
            type="text"
            value={resolved.title.ar}
            onChange={(e) => updateMeta('title', 'ar', e.target.value)}
            className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold leading-relaxed"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {isAr ? 'عنوان الصفحة الرئيسي (إنجليزي)' : 'Page Headline (EN)'}
          </label>
          <input
            type="text"
            value={resolved.title.en}
            onChange={(e) => updateMeta('title', 'en', e.target.value)}
            className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {isAr ? 'تاريخ آخر تحديث (عربي / إنجليزي)' : 'Last Updated Date (AR / EN)'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={resolved.lastUpdated.ar}
              onChange={(e) => updateMeta('lastUpdated', 'ar', e.target.value)}
              className="h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
            <input
              type="text"
              value={resolved.lastUpdated.en}
              onChange={(e) => updateMeta('lastUpdated', 'en', e.target.value)}
              className="h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {isAr ? 'شارة الالتزام العلوية (عربي / إنجليزي)' : 'Top Kicker Badge (AR / EN)'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={resolved.kicker.ar}
              onChange={(e) => updateMeta('kicker', 'ar', e.target.value)}
              className="h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
            <input
              type="text"
              value={resolved.kicker.en}
              onChange={(e) => updateMeta('kicker', 'en', e.target.value)}
              className="h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {isAr ? 'المقدمة التوضيحية (عربي)' : 'Hero Introduction (AR)'}
          </label>
          <textarea
            rows={2}
            value={resolved.intro.ar}
            onChange={(e) => updateMeta('intro', 'ar', e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed resize-y"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {isAr ? 'المقدمة التوضيحية (إنجليزي)' : 'Hero Introduction (EN)'}
          </label>
          <textarea
            rows={2}
            value={resolved.intro.en}
            onChange={(e) => updateMeta('intro', 'en', e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed resize-y"
          />
        </div>
      </div>

      {/* 3 Trust Highlights */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <h3 className="text-sm font-black text-slate-900">
          {isAr ? 'ركائز الثقة السريعة (أعلى الصفحة)' : 'Hero Trust Highlights'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {resolved.highlights.map((hl, idx) => (
            <div key={hl.id || idx} className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-2">
              <span className="text-[11px] font-black text-[#5A3E7A] block tabular-nums">
                {isAr ? `ركيزة #${idx + 1}` : `Pillar #${idx + 1}`}
              </span>
              <input
                type="text"
                value={hl.title.ar}
                onChange={(e) => updateHighlight(idx, 'title', 'ar', e.target.value)}
                placeholder="العنوان (عربي)"
                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold"
              />
              <input
                type="text"
                value={hl.title.en}
                onChange={(e) => updateHighlight(idx, 'title', 'en', e.target.value)}
                placeholder="Title (EN)"
                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold"
              />
              <input
                type="text"
                value={hl.subtitle.ar}
                onChange={(e) => updateHighlight(idx, 'subtitle', 'ar', e.target.value)}
                placeholder="الوصف (عربي)"
                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs"
              />
              <input
                type="text"
                value={hl.subtitle.en}
                onChange={(e) => updateHighlight(idx, 'subtitle', 'en', e.target.value)}
                placeholder="Subtitle (EN)"
                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Policy Clauses */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-black text-slate-900 tabular-nums">
            {isAr ? `بنود سياسة الخصوصية (${resolved.sections.length})` : `Privacy Policy Clauses (${resolved.sections.length})`}
          </h3>
          <button
            type="button"
            onClick={handleAddClause}
            className="h-11 px-4 rounded-xl bg-[#5A3E7A] hover:bg-[#483162] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة بند جديد' : 'Add Clause'}</span>
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/40 divide-y divide-slate-200/80 overflow-hidden">
          {resolved.sections.map((sec, idx) => (
            <div key={sec.id || idx} className="p-4 sm:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#5A3E7A] tabular-nums">#{idx + 1}</span>
                  <select
                    value={sec.icon}
                    onChange={(e) => updateSectionIcon(idx, e.target.value as PrivacySectionIconId)}
                    className="h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="database">{isAr ? 'البيانات' : 'Database'}</option>
                    <option value="lock">{isAr ? 'التشفير والحماية' : 'Security Lock'}</option>
                    <option value="eyeOff">{isAr ? 'إخفاء البيانات' : 'Privacy Mask'}</option>
                    <option value="creditCard">{isAr ? 'الدفع' : 'Payments'}</option>
                    <option value="smartphone">{isAr ? 'التطبيق والكاش' : 'PWA & Cache'}</option>
                    <option value="userCheck">{isAr ? 'حقوق العميل' : 'Customer Rights'}</option>
                  </select>
                </div>

                {resolved.sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteClause(idx)}
                    className="h-9 px-2.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'حذف' : 'Delete'}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={sec.title.ar}
                  onChange={(e) => updateSectionBilingual(idx, 'title', 'ar', e.target.value)}
                  placeholder="عنوان البند (عربي)"
                  className="h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                />
                <input
                  type="text"
                  value={sec.title.en}
                  onChange={(e) => updateSectionBilingual(idx, 'title', 'en', e.target.value)}
                  placeholder="Clause Title (EN)"
                  className="h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                />
                <textarea
                  rows={3}
                  value={sec.body.ar}
                  onChange={(e) => updateSectionBilingual(idx, 'body', 'ar', e.target.value)}
                  placeholder="تفاصيل البند (عربي)"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs leading-relaxed resize-y"
                />
                <textarea
                  rows={3}
                  value={sec.body.en}
                  onChange={(e) => updateSectionBilingual(idx, 'body', 'en', e.target.value)}
                  placeholder="Clause Body (EN)"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs leading-relaxed resize-y"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Privacy Support Card */}
      <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {isAr ? 'عنوان بطاقة التواصل للخصوصية (عربي / إنجليزي)' : 'Privacy Contact Heading (AR / EN)'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={resolved.contactTitle.ar}
              onChange={(e) => updateMeta('contactTitle', 'ar', e.target.value)}
              className="h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
            <input
              type="text"
              value={resolved.contactTitle.en}
              onChange={(e) => updateMeta('contactTitle', 'en', e.target.value)}
              className="h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            {isAr ? 'وصف بطاقة التواصل (عربي / إنجليزي)' : 'Privacy Contact Subtitle (AR / EN)'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={resolved.contactSubtitle.ar}
              onChange={(e) => updateMeta('contactSubtitle', 'ar', e.target.value)}
              className="h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
            <input
              type="text"
              value={resolved.contactSubtitle.en}
              onChange={(e) => updateMeta('contactSubtitle', 'en', e.target.value)}
              className="h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
