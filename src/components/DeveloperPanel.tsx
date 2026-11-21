import React, { useState } from 'react';
import {
  AlertTriangle,
  Code2,
  Cpu,
  Eye,
  HardDrive,
  Lock,
  Palette,
  Shield,
  Undo2,
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { curatedPalettes, siteConfig } from '../data/siteConfig';
import { SmartAuthPortal } from './common/SmartAuthPortal';
import { ConfirmDialogModal } from './common/ConfirmDialogModal';
import { ErrorBoundary } from './common/ErrorBoundary';
import { DevConfirmConfig, DevTabKey, devPresetsList } from './developer/devMeta';
import { DevPresetHubTab } from './developer/DevPresetHubTab';
import { DevTemplatesTab } from './developer/DevTemplatesTab';
import { DevColorsTab, DevTypographyTab } from './developer/DevThemeStudioTabs';
import { DevContentTab, DevSectionsTab } from './developer/DevSectionsAndContentTabs';
import { DevGoldenSnapshotTab, DevSecurityTab } from './developer/DevGoldenAndSecurityTabs';

export const DeveloperPanel: React.FC = () => {
  const {
    lang,
    isDevAuthenticated,
    isCloudAdminVerified,
    loginDeveloper,
    logoutDeveloper,
    activePresetId,
    dynamicConfig,
    setDynamicConfig,
    clearAllOrders,
    navigateTo,
    showToast,
    activePaletteId,
    goldenSnapshot,
    historyStack,
    canUndo,
    undoLastChange,
  } = useCommerce();

  const [activeTab, setActiveTab] = useState<DevTabKey>(activePresetId);
  const [confirmDialog, setConfirmDialog] = useState<DevConfirmConfig | null>(null);

  const currentActivePalette = curatedPalettes.find((p) => p.id === activePaletteId) || curatedPalettes[0];

  // Security Gate: Require both Verified Cloud Owner & active Developer session unlock
  if (!isDevAuthenticated || !isCloudAdminVerified) {
    return (
      <SmartAuthPortal
        portalType="developer"
        pinLength={6}
        defaultPin="998877"
        title={{
          ar: 'بوابة المطور البرمجية العليا (/developer)',
          en: 'Supreme Developer Console (/developer)',
        }}
        subtitle={{
          ar: 'التحكم بالمعمارية البرمجية، محول القوالب، باليت الألوان، والدرع البرمجي الذهبي',
          en: 'Architecture controls, template adapter, palettes, and golden snapshot shield',
        }}
        roleBadge={{
          ar: 'صلاحيات المطور العليا (Master Developer)',
          en: 'Master Developer Access',
        }}
        accent="amber"
        onAuthenticate={(pin) => loginDeveloper(pin)}
        onReturnToStore={() => navigateTo('store')}
        savedAuthKey="luxe_dev_auth_saved"
        savedPinKey="luxe_dev_saved_pin"
      />
    );
  }

  const fallbackPreset = siteConfig.presets[activePresetId] || siteConfig.presets.cosmetics;
  const currentPresetData = dynamicConfig?.presets?.[activePresetId] || fallbackPreset;

  const handleWipeCatalogForPreset = (presetKey: string) => {
    setConfirmDialog({
      isOpen: true,
      title: lang === 'ar' ? 'تفريغ كتالوج النظام' : 'Wipe Preset Catalog',
      message:
        lang === 'ar'
          ? `تحذير المطور: هل ترغب في تفريغ كتالوج منتجات نظام (${presetKey}) بالكامل لتسليم المتجر لعميل جديد؟`
          : `Developer Warning: Wipe all products for preset (${presetKey}) to prepare for client handover?`,
      confirmLabel: lang === 'ar' ? 'تفريغ الكتالوج' : 'Wipe Catalog',
      variant: 'danger',
      onConfirm: () => {
        setDynamicConfig((prev) => {
          try {
            const clone = JSON.parse(JSON.stringify(prev));
            if (clone.presets && clone.presets[presetKey]) {
              clone.presets[presetKey].products = [];
            }
            try {
              localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
            } catch {
              // ignore storage quota
            }
            return clone;
          } catch {
            return prev;
          }
        });
        setConfirmDialog(null);
        showToast(
          lang === 'ar'
            ? `تم تفريغ كتالوج منتجات (${presetKey}) بنجاح! المتجر جاهز لإضافة منتجات العميل.`
            : `Catalog for (${presetKey}) wiped successfully! Ready for client inventory.`
        );
      },
    });
  };

  const handleRestoreCatalogForPreset = (presetKey: string) => {
    setConfirmDialog({
      isOpen: true,
      title: lang === 'ar' ? 'استعادة المنتجات الافتراضية' : 'Restore Default Catalog',
      message:
        lang === 'ar'
          ? `هل ترغب في استرجاع المنتجات النموذجية الافتراضية لنظام (${presetKey})؟`
          : `Restore default demo products for preset (${presetKey})?`,
      confirmLabel: lang === 'ar' ? 'استعادة المنتجات' : 'Restore Products',
      variant: 'warning',
      onConfirm: () => {
        setDynamicConfig((prev) => {
          try {
            const clone = JSON.parse(JSON.stringify(prev));
            const defaultProducts =
              siteConfig.presets[presetKey as keyof typeof siteConfig.presets]?.products ||
              siteConfig.presets.cosmetics.products;
            if (clone.presets && clone.presets[presetKey]) {
              clone.presets[presetKey].products = JSON.parse(JSON.stringify(defaultProducts));
            }
            try {
              localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
            } catch {
              // ignore storage quota
            }
            return clone;
          } catch {
            return prev;
          }
        });
        setConfirmDialog(null);
        showToast(
          lang === 'ar'
            ? `تمت استعادة المنتجات النموذجية لنظام (${presetKey}) بنجاح!`
            : `Default demo products for (${presetKey}) restored!`
        );
      },
    });
  };

  const handleMasterClientHandover = () => {
    setConfirmDialog({
      isOpen: true,
      title: lang === 'ar' ? 'التصفير الشامل لتسليم العميل' : 'Master Zero-State Handover Reset',
      message:
        lang === 'ar'
          ? 'تحذير تصفير شامل: سيتم تفريغ كافة المنتجات والطلبات والتقييمات التجريبية لتسليم المتجر كـ (Zero-State Clean) للعميل، مع الحفاظ على الهوية والألوان والتصميم. هل تود المتابعة؟'
          : 'Master Zero-State Reset: Wipe demo products, orders, and reviews for clean client handover. Proceed?',
      confirmLabel: lang === 'ar' ? 'تأكيد التصفير الشامل' : 'Confirm Master Reset',
      variant: 'danger',
      onConfirm: () => {
        setDynamicConfig((prev) => {
          try {
            const clone = JSON.parse(JSON.stringify(prev));
            if (clone.presets && clone.presets[activePresetId]) {
              clone.presets[activePresetId].products = [];
              clone.presets[activePresetId].testimonials = [];
            }
            try {
              localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
            } catch {
              // ignore storage quota
            }
            return clone;
          } catch {
            return prev;
          }
        });
        clearAllOrders();
        setConfirmDialog(null);
        showToast(
          lang === 'ar'
            ? 'تم التصفير الشامل بنجاح! المتجر جاهز للتسليم الفوري للعميل.'
            : 'Store reset to zero-state successfully! Ready for client.'
        );
      },
    });
  };

  const storageSizeKb = (() => {
    try {
      return (JSON.stringify(dynamicConfig || siteConfig).length / 1024).toFixed(1);
    } catch {
      return '0.0';
    }
  })();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
        {/* Top Developer Command Bar */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
              </span>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                SUPREME ARCHITECTURE CONSOLE v3.0 PRO
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {lang === 'ar' ? 'محرك التحكم المعماري وتطويع القوالب' : 'Architecture & Template Normalizer Studio'}
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              {lang === 'ar'
                ? 'إدارة محول القوالب، باليتات الألوان، الخطوط المتجانسة، صمام الأمان الذهبي، واختبار استقرار البيانات في الوقت الفعلي.'
                : 'Full architectural control over presets, theme palettes, typography pairs, and golden stability shield.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={undoLastChange}
              disabled={!canUndo}
              title={lang === 'ar' ? 'تراجع عن آخر تعديل (Undo)' : 'Undo last modification'}
              className={`h-11 px-4 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 ${
                canUndo
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 shadow-sm'
                  : 'bg-slate-800/40 text-slate-500 border border-slate-800 cursor-not-allowed opacity-50'
              }`}
            >
              <Undo2 className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تراجع (Undo)' : 'Undo'}</span>
              {historyStack.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black">
                  {historyStack.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigateTo('store')}
              className="h-11 px-5 rounded-2xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              <Eye className="w-4 h-4 text-slate-400" />
              <span>{lang === 'ar' ? 'معاينة المتجر حياً' : 'Preview Storefront'}</span>
            </button>

            <button
              type="button"
              onClick={logoutDeveloper}
              className="h-11 px-5 rounded-2xl text-xs font-bold bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Lock className="w-4 h-4 text-rose-400" />
              <span>{lang === 'ar' ? 'قفل اللوحة' : 'Lock Console'}</span>
            </button>
          </div>
        </div>

        {/* System Architecture Telemetry Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {lang === 'ar' ? 'النشاط المفعّل' : 'Active Preset'}
              </span>
              <Cpu className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-sm font-black text-white truncate">
              {currentPresetData?.nicheLabel?.[lang] || activePresetId}
            </p>
            <span className="text-[10px] text-amber-400 font-mono block">ID: {activePresetId}</span>
          </div>

          <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {lang === 'ar' ? 'الباليت النشط' : 'Active Palette'}
              </span>
              <Palette className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-sm font-black text-white truncate">{currentActivePalette.name[lang]}</p>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/20"
                style={{ backgroundColor: currentActivePalette.primary }}
              />
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/20"
                style={{ backgroundColor: currentActivePalette.accent }}
              />
              <span className="text-[10px] text-slate-400 font-mono">{currentActivePalette.primary}</span>
            </div>
          </div>

          <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {lang === 'ar' ? 'صمام الأمان الذهبي' : 'Golden Shield'}
              </span>
              <Shield className={`w-4 h-4 ${goldenSnapshot ? 'text-emerald-400' : 'text-slate-500'}`} />
            </div>
            <p className="text-sm font-black text-white">
              {goldenSnapshot ? (lang === 'ar' ? 'محمي ومحفوظ' : 'Protected') : (lang === 'ar' ? 'غير مسجل' : 'Unsaved')}
            </p>
            <span className="text-[10px] text-slate-400 font-mono block truncate">
              {goldenSnapshot
                ? new Date(goldenSnapshot.savedAt).toLocaleTimeString()
                : lang === 'ar'
                ? 'ينصح بأخذ لقطة'
                : 'Snapshot advised'}
            </span>
          </div>

          <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {lang === 'ar' ? 'بصمة التخزين' : 'Storage Size'}
              </span>
              <HardDrive className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-sm font-black text-white font-mono">~{storageSizeKb} KB</p>
            <span className="text-[10px] text-emerald-400 font-mono block">Healthy & Valid JSON</span>
          </div>
        </div>

        {/* Tab Selector - Luxe Pro Navigation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
            <span>{lang === 'ar' ? 'أركان أنظمة المتاجر الأربعة المستقلة والمتزامنة:' : 'The 4 Autonomous Store System Hubs:'}</span>
            <span className="text-[10px] text-amber-400 font-mono">Real-Time Reactive State</span>
          </div>

          {/* 4 Ecosystem Hubs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {devPresetsList.map((preset) => {
              const Icon = preset.icon;
              const isSelected = activeTab === preset.id;
              const isCurrentlyActiveStore = activePresetId === preset.id;

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setActiveTab(preset.id)}
                  className={`p-4 rounded-3xl border text-start transition-all cursor-pointer flex flex-col justify-between gap-3 min-h-[90px] relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-900 border-amber-400 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-2xl bg-gradient-to-br ${preset.color} flex items-center justify-center text-white shadow-xs shrink-0`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-black truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {preset.name[lang]}
                      </span>
                    </div>

                    {isCurrentlyActiveStore && (
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                        {lang === 'ar' ? 'مُمكّن' : 'Active'}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{preset.desc[lang]}</span>
                </button>
              );
            })}
          </div>

          {/* Master Tools Secondary Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-bold text-slate-500 px-1">
              {lang === 'ar' ? 'أدوات المطور العليا:' : 'Master Tools:'}
            </span>

            <button
              type="button"
              onClick={() => setActiveTab('golden')}
              className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'golden'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-900/80 text-emerald-400 border border-emerald-950/80 hover:bg-slate-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'درع الثبات الذهبي' : 'Golden Shield'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'templates'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'مستورد ومطوع القوالب' : 'Template Adapter'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-rose-500 text-white font-black shadow-md'
                  : 'bg-slate-900/80 text-rose-400 border border-rose-950/80 hover:bg-slate-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'الحماية والتأمين' : 'Security Guard'}</span>
            </button>
          </div>
        </div>

        {/* Active Modular Tab Views — Each Isolated with ErrorBoundary */}
        {(activeTab === 'cosmetics' ||
          activeTab === 'fashion' ||
          activeTab === 'eyewear' ||
          activeTab === 'electronics') && (
          <ErrorBoundary scope={`DevTab:PresetHub:${activeTab}`}>
            <DevPresetHubTab presetId={activeTab} onWipeCatalog={handleWipeCatalogForPreset} />
          </ErrorBoundary>
        )}

        {activeTab === 'templates' && (
          <ErrorBoundary scope="DevTab:Templates">
            <DevTemplatesTab />
          </ErrorBoundary>
        )}

        {activeTab === 'colors' && (
          <ErrorBoundary scope="DevTab:Colors">
            <DevColorsTab />
          </ErrorBoundary>
        )}

        {activeTab === 'typography' && (
          <ErrorBoundary scope="DevTab:Typography">
            <DevTypographyTab />
          </ErrorBoundary>
        )}

        {activeTab === 'sections' && (
          <ErrorBoundary scope="DevTab:Sections">
            <DevSectionsTab />
          </ErrorBoundary>
        )}

        {activeTab === 'content' && (
          <ErrorBoundary scope="DevTab:Content">
            <DevContentTab />
          </ErrorBoundary>
        )}

        {activeTab === 'golden' && (
          <ErrorBoundary scope="DevTab:GoldenShield">
            <DevGoldenSnapshotTab />
          </ErrorBoundary>
        )}

        {activeTab === 'security' && (
          <ErrorBoundary scope="DevTab:Security">
            <DevSecurityTab
              onWipeCatalog={handleWipeCatalogForPreset}
              onRestoreCatalog={handleRestoreCatalogForPreset}
              onMasterClientHandover={handleMasterClientHandover}
            />
          </ErrorBoundary>
        )}
      </div>

      <ConfirmDialogModal
        isOpen={Boolean(confirmDialog?.isOpen)}
        title={confirmDialog?.title || ''}
        message={confirmDialog?.message || ''}
        confirmLabel={confirmDialog?.confirmLabel || (lang === 'ar' ? 'تأكيد' : 'Confirm')}
        cancelLabel={lang === 'ar' ? 'إلغاء' : 'Cancel'}
        variant={confirmDialog?.variant || 'danger'}
        onConfirm={() => confirmDialog?.onConfirm()}
        onCancel={() => setConfirmDialog(null)}
      />
    </div>
  );
};
