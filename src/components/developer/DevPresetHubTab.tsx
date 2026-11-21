import React from 'react';
import {
  Check,
  CheckCircle2,
  Eye,
  Layers,
  Layout,
  Palette,
  RotateCcw,
  ShoppingBag,
  Trash2,
  Undo2,
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { curatedPalettes, curatedTypographyPairs, siteConfig } from '../../data/siteConfig';
import { UnifiedStoreCustomizer } from '../UnifiedStoreCustomizer';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { DevPresetId, devPresetsList } from './devMeta';

interface DevPresetHubTabProps {
  presetId: DevPresetId;
  onWipeCatalog: (presetKey: string) => void;
}

export const DevPresetHubTab: React.FC<DevPresetHubTabProps> = ({ presetId, onWipeCatalog }) => {
  const {
    lang,
    activePresetId,
    setActivePresetId,
    dynamicConfig,
    activePaletteId,
    setActivePaletteId,
    customPalette,
    activeTypographyId,
    setActiveTypographyId,
    showToast,
    navigateTo,
    canUndo,
    undoLastChange,
    resetPresetToFactoryDefault,
  } = useCommerce();

  const currentHubMeta = devPresetsList.find((p) => p.id === presetId) || devPresetsList[0];
  const Icon = currentHubMeta.icon;
  const isCurrentActive = activePresetId === presetId;
  const currentPresetData = dynamicConfig?.presets?.[presetId] || siteConfig.presets[presetId];
  const currentActivePalette = curatedPalettes.find((p) => p.id === activePaletteId) || curatedPalettes[0];

  return (
    <div className="space-y-8">
      {/* 1. MASTER HUB BANNER & COMMAND BAR */}
      <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-r ${currentHubMeta.gradientBg} border shadow-2xl relative overflow-hidden`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
                <Icon className="w-3.5 h-3.5" />
                <span>{currentHubMeta.name[lang]}</span>
              </div>

              {isCurrentActive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{lang === 'ar' ? 'القالب المفعّل حالياً بالمتجر الحي ولوحة الإدارة' : 'Active On Live Storefront'}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-slate-300 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>{lang === 'ar' ? 'ركن كامن – جاهز للتخصيص والتجربة والتمكين' : 'Inactive Hub – Ready to Enable'}</span>
                </span>
              )}

              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-slate-900/60 border border-slate-700 text-slate-400">
                ID: {presetId}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {lang === 'ar'
                ? `ركن نظام: ${currentPresetData?.nicheLabel?.[lang] || currentHubMeta.name[lang]}`
                : `System Hub: ${currentPresetData?.nicheLabel?.[lang] || currentHubMeta.name[lang]}`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentHubMeta.desc[lang]}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <strong>{currentPresetData?.products?.length || 0}</strong> {lang === 'ar' ? 'منتجات جاهزة' : 'products ready'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                <span>{lang === 'ar' ? 'الباليت الموصى به:' : 'Palette:'}</span>
                <strong className="text-white">{currentActivePalette.name[lang]}</strong>
              </span>
            </div>
          </div>

          {/* Hub Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {!isCurrentActive ? (
              <button
                type="button"
                onClick={() => {
                  setActivePresetId(presetId);
                  showToast({
                    type: 'success',
                    message:
                      lang === 'ar'
                        ? `تم تمكين قالب (${currentHubMeta.name.ar}) وتطبيقه على المتجر الحي ولوحة الإدارة بنجاح!`
                        : `Enabled (${currentHubMeta.name.en}) preset on live store and admin!`,
                  });
                }}
                className="h-11 px-5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
              >
                <Layers className="w-4 h-4 text-purple-950" />
                <span>{lang === 'ar' ? 'تمكين قالب هذا المتجر بالمتجر الحي' : 'Activate On Storefront'}</span>
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <div className="h-11 px-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'ar' ? 'قيد التشغيل بالمتجر الحي' : 'Running on Live Store'}</span>
                </div>

                {presetId !== 'cosmetics' && (
                  <button
                    type="button"
                    onClick={() => {
                      setActivePresetId('cosmetics');
                      showToast({
                        type: 'info',
                        message:
                          lang === 'ar'
                            ? 'تم إلغاء التمكين والعودة إلى المتجر الافتراضي بنجاح! ↩'
                            : 'Deactivated preset and returned to default store! ↩',
                      });
                    }}
                    className="h-11 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                    title={lang === 'ar' ? 'إلغاء التمكين والعودة للنظام الافتراضي' : 'Deactivate and return to default'}
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === 'ar' ? 'إلغاء التمكين الافتراضي ↩' : 'Disable / Revert Default ↩'}</span>
                  </button>
                )}
              </div>
            )}

            {/* One-Click Catalog Wipe for Client Handover */}
            <button
              type="button"
              onClick={() => onWipeCatalog(presetId)}
              className="h-11 px-4 rounded-2xl bg-amber-500/20 hover:bg-amber-500/35 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              title={lang === 'ar' ? 'تفريغ منتجات هذا الكتالوج لتسليم المتجر لعميل جديد' : 'Wipe demo products for this preset to prepare store for client'}
            >
              <Trash2 className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ar' ? 'تفريغ الكتالوج للعميل' : 'Wipe Catalog for Client'}</span>
            </button>

            {/* Factory Reset Preset Button */}
            <button
              type="button"
              onClick={() => resetPresetToFactoryDefault(presetId)}
              className="h-11 px-4 rounded-2xl bg-rose-500/20 hover:bg-rose-500/35 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              title={lang === 'ar' ? 'استعادة التصميم المصنعي الافتراضي النقي لهذا النظام فقط' : 'Restore pure factory defaults for this preset'}
            >
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <span>{lang === 'ar' ? 'استعادة ضبط المصنع للقالب ↺' : 'Factory Reset Preset ↺'}</span>
            </button>

            {/* Live Preview Button */}
            <button
              type="button"
              onClick={() => navigateTo('store')}
              className="h-11 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Eye className="w-4 h-4 text-slate-400" />
              <span>{lang === 'ar' ? 'معاينة المتجر' : 'Store View'}</span>
            </button>

            {/* Undo Button */}
            {canUndo && (
              <button
                type="button"
                onClick={undoLastChange}
                className="h-11 px-4 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Undo2 className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تراجع (Undo)' : 'Undo'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. THEME HARMONY SUITE FOR THIS NICHE */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ar' ? 'منظومة الألوان والخطوط المتجانسة المقترحة لهذا النشاط' : 'Harmonious Color & Typography System'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ar'
                ? 'اختر الباليت أو الخط المتناسق لتطبيقه فوراً على هذا المتجر دون أي انكسار أو تضارب.'
                : 'Hot-swap harmonious palettes or typography pairs tailored for this business niche.'}
            </p>
          </div>
          <span className="text-[11px] font-mono px-3 py-1 rounded-xl bg-slate-950 text-slate-400 border border-slate-800">
            60-30-10 Color Rule
          </span>
        </div>

        {/* Quick Palettes Grid */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-300 block">
            {lang === 'ar' ? 'الباليتات المتناسقة الموصى بها:' : 'Recommended Palettes:'}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {curatedPalettes.map((palette) => {
              const isPaletteActive = activePaletteId === palette.id && !customPalette;
              return (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => {
                    setActivePaletteId(palette.id);
                    showToast(lang === 'ar' ? `تم تفعيل باليت: ${palette.name.ar}` : `Applied ${palette.name.en}`);
                  }}
                  className={`p-3 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                    isPaletteActive
                      ? 'bg-slate-800 border-amber-400 shadow-md ring-1 ring-amber-400'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white truncate max-w-[85%]">
                      {palette.name[lang]}
                    </span>
                    {isPaletteActive && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  </div>

                  <div className="grid grid-cols-3 h-5 rounded-lg overflow-hidden border border-white/10">
                    <span style={{ backgroundColor: palette.primary }} title={`Primary: ${palette.primary}`} />
                    <span style={{ backgroundColor: palette.accent }} title={`Accent: ${palette.accent}`} />
                    <span style={{ backgroundColor: palette.surface }} title={`Surface: ${palette.surface}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Typography Grid */}
        <div className="space-y-3 pt-3 border-t border-slate-800/80">
          <span className="text-xs font-bold text-slate-300 block">
            {lang === 'ar' ? 'أزواج الخطوط المتجانسة المقترحة:' : 'Recommended Typography Pairs:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {curatedTypographyPairs.map((pair) => {
              const isTypoActive = activeTypographyId === pair.id;
              return (
                <button
                  key={pair.id}
                  type="button"
                  onClick={() => {
                    setActiveTypographyId(pair.id);
                    showToast(lang === 'ar' ? `تم تفعيل خط: ${pair.name.ar}` : `Applied ${pair.name.en}`);
                  }}
                  className={`p-3.5 rounded-2xl border text-start transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isTypoActive
                      ? 'bg-slate-800 border-amber-400 shadow-md ring-1 ring-amber-400'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-xs font-bold text-white block truncate">
                      {pair.name[lang]}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {pair.headingFamilyAr} · {pair.headingFamilyEn}
                    </span>
                  </div>
                  {isTypoActive && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. INTEGRATED FULL 13-CORNER STOREFRONT CUSTOMIZER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Layout className="w-5 h-5 text-amber-400" />
              <span>
                {lang === 'ar'
                  ? `ركن التعديل الموحد الشامل (كامل محتوى متجر ${currentHubMeta.name.ar})`
                  : `Full 13-Corner Linear Customizer (${currentHubMeta.name.en})`}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ar'
                ? 'تعديل مباشر وشامل لكافة أقسام هذا المتجر من الهيدر حتى التذييل، متزامن فورياً ومحفوظ بشكل مستقل.'
                : 'Complete top-to-bottom customizer for this ecosystem. Live synced & stored independently.'}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl">
          <ErrorBoundary scope={`DevTab:HubCustomizer:${presetId}`}>
            <UnifiedStoreCustomizer
              presetId={presetId}
              onNavigateToProducts={() => {
                navigateTo('store');
              }}
            />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};
