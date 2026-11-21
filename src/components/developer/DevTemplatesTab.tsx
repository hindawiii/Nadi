import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  Code2,
  Compass,
  Copy,
  Download,
  FileJson,
  Layers,
  Shield,
  Trash2,
  Upload,
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { curatedImportableTemplates, PresetNiche } from '../../data/siteConfig';
import { sanitizeSavedTemplateForExport } from '../../lib/exportSanitizer';

export const DevTemplatesTab: React.FC = () => {
  const {
    lang,
    activePresetId,
    importTemplate,
    exportCurrentTemplate,
    savedCustomTemplates,
    saveCurrentAsTemplate,
    deleteSavedTemplate,
    loadSavedTemplate,
    showToast,
  } = useCommerce();

  const [customCodeInput, setCustomCodeInput] = useState('');
  const [templateSaveName, setTemplateSaveName] = useState('');
  const [codeValidationStatus, setCodeValidationStatus] = useState<{
    status: 'idle' | 'valid' | 'invalid';
    message: string;
    details?: { storeName?: string; productsCount?: number; themeDetected?: boolean };
  }>({ status: 'idle', message: '' });
  const [isExportCopied, setIsExportCopied] = useState(false);

  const handleValidateCustomCode = () => {
    if (!customCodeInput.trim()) {
      setCodeValidationStatus({
        status: 'invalid',
        message: lang === 'ar' ? 'الرجاء إدخال أو لصق كود القالب أولاً.' : 'Please enter or paste template code first.',
      });
      return;
    }
    try {
      const parsed = JSON.parse(customCodeInput);
      const data: PresetNiche = parsed.presetData || parsed;
      if (!data.storeName || !data.products) {
        setCodeValidationStatus({
          status: 'invalid',
          message:
            lang === 'ar'
              ? 'الكود غير مطابق: لم يتم العثور على اسم المتجر (storeName) أو مصفوفة المنتجات (products).'
              : 'Validation error: Missing storeName or products array in payload.',
        });
        return;
      }
      setCodeValidationStatus({
        status: 'valid',
        message:
          lang === 'ar'
            ? 'الكود سليم ومتوافق برمجياً 100%! جاهز للتطويع والدمج الفوري.'
            : 'Code is valid and 100% compatible! Ready for adaptation.',
        details: {
          storeName: (data.storeName as Record<string, string>)[lang] || data.storeName.ar || data.storeName.en,
          productsCount: data.products?.length || 0,
          themeDetected: !!data.theme,
        },
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setCodeValidationStatus({
        status: 'invalid',
        message: lang === 'ar' ? `خطأ في صياغة JSON: ${msg}` : `Syntax error: ${msg}`,
      });
    }
  };

  const handleApplyCustomCode = () => {
    try {
      const res = importTemplate(customCodeInput);
      if (res.success) {
        showToast(res.message);
        setCodeValidationStatus({ status: 'idle', message: '' });
        setCustomCodeInput('');
      } else {
        showToast(res.message);
      }
    } catch {
      showToast(lang === 'ar' ? 'تعذر تطويع القالب المدخل' : 'Failed to adapt template payload');
    }
  };

  const handleLoadDemoTemplate = () => {
    const demo = curatedImportableTemplates[0];
    const demoJson = JSON.stringify(demo, null, 2);
    setCustomCodeInput(demoJson);
    try {
      const parsed = JSON.parse(demoJson);
      setCodeValidationStatus({
        status: 'valid',
        message: lang === 'ar' ? 'تم تجهيز نموذج كود عطور ملكي تجريبي بنجاح!' : 'Demo royal perfume template loaded successfully!',
        details: {
          storeName: parsed.name[lang],
          productsCount: parsed.presetData.products.length,
          themeDetected: true,
        },
      });
    } catch {
      // ignore demo parse fallback
    }
    showToast(lang === 'ar' ? 'تم تحميل نموذج قالب عطور ملكي تجريبي' : 'Loaded royal perfume demo template');
  };

  const handleCopyExport = async () => {
    const exported = exportCurrentTemplate();
    try {
      await navigator.clipboard.writeText(exported);
      setIsExportCopied(true);
      showToast(lang === 'ar' ? 'تم نسخ كود القالب الحالي كـ JSON إلى الحافظة' : 'Template code copied to clipboard');
      setTimeout(() => setIsExportCopied(false), 3000);
    } catch {
      showToast(lang === 'ar' ? 'تعذر النسخ التلقائي' : 'Failed to copy to clipboard');
    }
  };

  const handleDownloadExport = () => {
    try {
      const exported = exportCurrentTemplate();
      const blob = new Blob([exported], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `store-template-${activePresetId}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(lang === 'ar' ? 'تم تحميل ملف القالب بنجاح' : 'Template file downloaded');
    } catch {
      showToast(lang === 'ar' ? 'تعذر تحميل ملف القالب' : 'Failed to download template file');
    }
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateSaveName.trim()) {
      showToast(lang === 'ar' ? 'يرجى كتابة اسم للقالب لحفظه في الخزينة' : 'Please specify a name to save the template');
      return;
    }
    saveCurrentAsTemplate(templateSaveName, templateSaveName);
    setTemplateSaveName('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCustomCodeInput(content);
        const res = importTemplate(content);
        if (res.success) {
          showToast(lang === 'ar' ? 'تم استيراد ملف القالب وتطويعه بنجاح!' : 'Template file uploaded & adapted!');
        } else {
          showToast(res.message);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      {/* Architectural Strategy Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Code2 className="w-4 h-4" />
          <span>{lang === 'ar' ? 'محرك استيراد وتطويع كود القوالب (Smart Normalizer & AST Adapter)' : 'Template Importer & Code Adapter Engine'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          {lang === 'ar' ? 'سحب، تطويع، ودمج قوالب المتاجر الخارجية بأمان تام' : 'Seamlessly Import, Adapt & Hot-Swap Any Store Template'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          {lang === 'ar'
            ? 'هل ترغب في جلب قالب من متجر خارجي ودمجه هنا دون حدوث تعارض أو انكسار في الأكواد؟ يقوم محرك الـ Adapter بمطابقة الحقول تلقائياً، وفحص صحة البنية (Schema Validation)، وتطهير الأكواد، ثم حقنها حياً في واجهة المتجر بنقرة زر واحدة دون الحاجة لإعادة كتابة كود المتجر.'
            : 'Want to import an external store template without CSS clashes or broken logic? The AST Adapter normalizes sections, products, and styles, merging them safely into the live storefront with zero conflicts.'}
        </p>
      </div>

      {/* Section 1: Pre-Built Curated Templates Ready for 1-Click Import */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <span>{lang === 'ar' ? '١. قوالب تجارية حصرية جاهزة للاستيراد الفوري بنقرة واحدة' : '1. Curated Ready-to-Import Commercial Templates'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ar' ? 'قوالب جاهزة متكاملة المنتجات والبنرات والقصص تم اختبارها وتطويعها هندسياً لتعمل فورياً.' : 'Fully adapted, tested turn-key templates ready for immediate live deployment.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {curatedImportableTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-950">
                  <img
                    src={tpl.previewImage}
                    alt={tpl.name[lang]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <span className="absolute top-3 end-3 px-3 py-1 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-amber-300 text-[11px] font-black rounded-xl">
                    {tpl.badge[lang]}
                  </span>
                  <span className="absolute bottom-3 start-3 text-xs font-bold text-white/90 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                    {tpl.nicheLabel[lang]}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <h4 className="text-base font-bold text-white">{tpl.name[lang]}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed min-h-[44px]">{tpl.description[lang]}</p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{tpl.presetData.products.length} {lang === 'ar' ? 'منتجات جاهزة' : 'products'}</span>
                    <span>{tpl.presetData.valueProps.length} {lang === 'ar' ? 'مزايا موثقة' : 'value props'}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => {
                    const res = importTemplate(tpl);
                    if (res.success) {
                      showToast(lang === 'ar' ? `تم استيراد قالب (${tpl.name.ar}) بنجاح!` : `Imported ${tpl.name.en}!`);
                    }
                  }}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 rounded-2xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'استيراد وتفعيل القالب فورياً' : 'Import & Apply Template'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Custom External Code Importer & AST Parser */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-amber-400" />
              <span>{lang === 'ar' ? '٢. محرر استيراد وتطويع كود القالب المخصص (Raw JSON / Code Importer)' : '2. Custom Raw Template Code Importer & AST Adapter'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ar'
                ? 'الصق كود قالب أي متجر خارجي هنا، وسيقوم المحرك بفحصه وتطويعه ليتوافق مع بنية المتجر بأمان.'
                : 'Paste external store JSON or schema. The engine validates and normalizes fields seamlessly.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLoadDemoTemplate}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <FileJson className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تحميل كود تجريبي لاختباره' : 'Load Demo Code'}</span>
          </button>
        </div>

        <div className="space-y-3">
          <textarea
            rows={7}
            value={customCodeInput}
            onChange={(e) => {
              setCustomCodeInput(e.target.value);
              if (codeValidationStatus.status !== 'idle') {
                setCodeValidationStatus({ status: 'idle', message: '' });
              }
            }}
            placeholder={
              lang === 'ar'
                ? '{\n  "storeName": { "ar": "اسم المتجر", "en": "Store Name" },\n  "products": [ ... ],\n  "theme": { ... }\n}'
                : 'Paste store JSON structure here...'
            }
            className="w-full p-4 bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 leading-relaxed"
            dir="ltr"
          />

          {codeValidationStatus.status !== 'idle' && (
            <div
              className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
                codeValidationStatus.status === 'valid'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              }`}
            >
              {codeValidationStatus.status === 'valid' ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <span className="font-bold block">{codeValidationStatus.message}</span>
                {codeValidationStatus.details && (
                  <div className="flex flex-wrap gap-3 text-[11px] text-slate-300 pt-1">
                    <span>
                      {lang === 'ar' ? 'اسم المتجر المكتشف:' : 'Detected Store:'}{' '}
                      <strong>{codeValidationStatus.details.storeName}</strong>
                    </span>
                    <span>·</span>
                    <span>
                      {lang === 'ar' ? 'عدد المنتجات:' : 'Products Count:'}{' '}
                      <strong>{codeValidationStatus.details.productsCount}</strong>
                    </span>
                    <span>·</span>
                    <span>
                      {lang === 'ar' ? 'الهوية البصرية:' : 'Visual Identity:'}{' '}
                      <strong>
                        {codeValidationStatus.details.themeDetected
                          ? lang === 'ar'
                            ? 'متوفرة'
                            : 'Present'
                          : lang === 'ar'
                          ? 'افتراضية'
                          : 'Default'}
                      </strong>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={handleValidateCustomCode}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center gap-2 cursor-pointer min-h-[44px]"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ar' ? 'فحص وتحليل بنية الكود (Validate Schema)' : 'Validate Schema'}</span>
            </button>

            <button
              type="button"
              onClick={handleApplyCustomCode}
              disabled={codeValidationStatus.status !== 'valid'}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 min-h-[44px] ${
                codeValidationStatus.status === 'valid'
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تطويع ودمج الكود في المتجر المباشر' : 'Adapt & Merge Code Live'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Save Current Restructured Template to Permanent Vault */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <span>{lang === 'ar' ? '٣. حفظ القالب المطور الحالي في الخزينة الدائمة (Save to Vault)' : '3. Save Restructured Template to Permanent Vault'}</span>
          </h3>
          <p className="text-xs text-slate-400">
            {lang === 'ar'
              ? 'احفظ أي تعديل أو تطويع أجريته على القالب باسم خاص حتى لا يضيع أبداً، وتتمكن من الرجوع إليه في أي وقت بنقرة واحدة.'
              : 'Save your restructured template with a custom name so it never gets lost, ready to restore anytime.'}
          </p>
        </div>

        <form onSubmit={handleSaveTemplate} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <input
            type="text"
            value={templateSaveName}
            onChange={(e) => setTemplateSaveName(e.target.value)}
            placeholder={
              lang === 'ar'
                ? 'اكتب اسماً مميزاً للقالب (مثال: قالب العطور الملكية 2026)...'
                : 'Enter a name for this template (e.g. Royal Oud Luxury 2026)...'
            }
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[44px]"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 min-h-[44px] cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{lang === 'ar' ? 'حفظ القالب في الخزينة' : 'Save Template to Vault'}</span>
          </button>
        </form>

        {/* Saved Templates Grid */}
        {savedCustomTemplates.length > 0 && (
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 block">
              {lang === 'ar' ? `قوالبك المحفوظة في الخزينة (${savedCustomTemplates.length}):` : `Your Saved Templates (${savedCustomTemplates.length}):`}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedCustomTemplates.map((savedTpl) => (
                <div
                  key={savedTpl.id}
                  className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-white truncate">
                        {savedTpl.name[lang] || savedTpl.name.ar}
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono">
                        {new Date(savedTpl.savedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block">
                      {savedTpl.presetData.products?.length || 0} {lang === 'ar' ? 'منتجات محفوظة' : 'products'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => loadSavedTemplate(savedTpl.id)}
                      className="flex-1 py-2 px-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer min-h-[38px]"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'تفعيل الآن' : 'Load'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        try {
                          const sanitizedTpl = sanitizeSavedTemplateForExport(
                            savedTpl as unknown as Record<string, unknown>
                          );
                          const json = JSON.stringify(sanitizedTpl, null, 2);
                          const blob = new Blob([json], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${savedTpl.id}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                          showToast(lang === 'ar' ? 'تم تنزيل نسخة القالب' : 'Template downloaded');
                        } catch {
                          showToast(lang === 'ar' ? 'تعذر تنزيل نسخة القالب' : 'Failed to download template');
                        }
                      }}
                      title={lang === 'ar' ? 'تحميل كملف JSON' : 'Download JSON'}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteSavedTemplate(savedTpl.id)}
                      title={lang === 'ar' ? 'حذف من الخزينة' : 'Delete'}
                      className="p-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded-xl transition-all cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section 4: Export Current Store Template & Direct File Upload */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-amber-400" />
            <span>{lang === 'ar' ? '٤. تصدير أو استيراد ملف القالب الكامل (.json)' : '4. Export or Upload Full Template File (.json)'}</span>
          </h3>
          <p className="text-xs text-slate-400">
            {lang === 'ar'
              ? 'احصل على نسخة كاملة ونظيفة من كود القالب النشط الحالي لاستخدامه في متجر آخر أو ارفع ملف قالب محفوظ مسبقاً.'
              : 'Export clean JSON snapshot of current store settings, or upload any previously exported JSON template file.'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer min-h-[44px]">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'ar' ? 'رفع ملف (.json)' : 'Upload .json'}</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleCopyExport}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer min-h-[44px]"
          >
            <Copy className="w-4 h-4 text-amber-400" />
            <span>
              {isExportCopied
                ? lang === 'ar'
                  ? 'تم النسخ بنجاح! ✓'
                  : 'Copied! ✓'
                : lang === 'ar'
                ? 'نسخ كود القالب كـ JSON'
                : 'Copy Template JSON'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleDownloadExport}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer min-h-[44px] shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تحميل كملف (.json)' : 'Download .json'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
