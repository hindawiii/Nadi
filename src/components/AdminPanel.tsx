import React, { useState } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  DollarSign,
  ExternalLink,
  Layers,
  Layout,
  LogOut,
  Package,
  Rocket,
  ShoppingBag,
  Undo2,
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { siteConfig } from '../data/siteConfig';
import { SmartAuthPortal } from './common/SmartAuthPortal';
import { UnifiedStoreCustomizer } from './UnifiedStoreCustomizer';
import { SectionsLayoutReorder } from './common/SectionsLayoutReorder';
import { ConfirmDialogModal } from './common/ConfirmDialogModal';
import { ErrorBoundary } from './common/ErrorBoundary';
import { AdminOrdersTab } from './admin/AdminOrdersTab';
import { AdminProductsTab, AdminConfirmConfig } from './admin/AdminProductsTab';
import { AdminReviewsTab } from './admin/AdminReviewsTab';
import { AdminOnboardingTab } from './admin/AdminOnboardingTab';
import { AdminLegacyTabs, LegacyAdminTabKey } from './admin/AdminLegacyTabs';

type AdminTabKey =
  | 'customizer'
  | 'layout'
  | 'orders'
  | 'products'
  | 'reviews'
  | 'onboarding'
  | LegacyAdminTabKey;

export const AdminPanel: React.FC = () => {
  const {
    lang,
    isAdminAuthenticated,
    isCloudAdminVerified,
    loginAdmin,
    logoutAdmin,
    orders,
    dynamicConfig,
    activePresetId,
    navigateTo,
    convertPrice,
    historyStack,
    canUndo,
    undoLastChange,
  } = useCommerce();

  const [activeTab, setActiveTab] = useState<AdminTabKey>('customizer');
  const [confirmDialog, setConfirmDialog] = useState<AdminConfirmConfig | null>(null);

  // Enforce both Firebase Verified Cloud Owner identity and active Admin session unlock
  if (!isAdminAuthenticated || !isCloudAdminVerified) {
    return (
      <SmartAuthPortal
        portalType="admin"
        pinLength={4}
        defaultPin="2026"
        title={{
          ar: 'بوابة التاجر وإدارة المتجر (/admin)',
          en: 'Merchant Portal & Store Command (/admin)',
        }}
        subtitle={{
          ar: 'إدارة شاملة للمنتجات والمخزون والطلبات والأسعار والعلامة التجارية',
          en: 'Full management of products, inventory, orders, pricing, and brand identity',
        }}
        roleBadge={{
          ar: 'صلاحيات المدير الإداري (Store Admin)',
          en: 'Store Administrator Access',
        }}
        accent="purple"
        onAuthenticate={(pin) => loginAdmin(pin)}
        onReturnToStore={() => navigateTo('store')}
        savedAuthKey="luxe_admin_auth_saved"
        savedPinKey="luxe_admin_saved_pin"
      />
    );
  }

  const activePreset = dynamicConfig.presets[activePresetId];
  const products = activePreset.products || [];

  // Computed KPIs
  const totalRevenueUSD = orders.reduce((sum, o) => {
    if (typeof o.totalUSD === 'number' && !isNaN(o.totalUSD)) {
      return sum + o.totalUSD;
    }
    const num = parseFloat(o.totalFormatted?.replace(/[^0-9.]/g, '') || '0') || 0;
    const rate = siteConfig.currencies[o.currency]?.rate || 1;
    return sum + num / rate;
  }, 0);
  const totalRevenueDisplay = convertPrice(totalRevenueUSD).text;
  const lowStockProducts = products.filter((p) => p.stock <= 3);

  const allTestimonialsList =
    activePreset.testimonials && activePreset.testimonials.length > 0
      ? activePreset.testimonials
      : siteConfig.presets.cosmetics.testimonials || [];
  const pendingReviewsCount = allTestimonialsList.filter((t: any) => t.status === 'pending').length;

  const isLegacyTab =
    activeTab === 'banners' || activeTab === 'content' || activeTab === 'branding' || activeTab === 'devices';

  return (
    <div className="min-h-screen bg-slate-50/70 py-6 sm:py-10 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
        {/* Top Header & Navigation Command Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {lang === 'ar' ? 'لوحة تحكم المتجر وإدارة العمليات' : 'Store Merchant Operations'}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
                {activePreset.nicheLabel?.[lang] || activePresetId}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {activePreset.storeName[lang]}
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              {lang === 'ar'
                ? 'إدارة فورية شاملة للمنتجات، المخزون، الطلبات، البنرات التسويقية، وهوية المتجر مع حفظ تلقائي وحماية استقرار البيانات.'
                : 'Full-spectrum control of products, inventory, orders, marketing visuals, and brand assets.'}
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
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 shadow-xs'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
              }`}
            >
              <Undo2 className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تراجع (Undo)' : 'Undo'}</span>
              {historyStack.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-black">
                  {historyStack.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigateTo('store')}
              className="h-11 px-5 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              <ExternalLink className="w-4 h-4 text-slate-600" />
              <span>{lang === 'ar' ? 'معاينة المتجر' : 'View Storefront'}</span>
            </button>
            <button
              type="button"
              onClick={logoutAdmin}
              className="h-11 px-5 rounded-2xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>{lang === 'ar' ? 'قفل الخروج' : 'Lock & Exit'}</span>
            </button>
          </div>
        </div>

        {/* Global KPI Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold">{lang === 'ar' ? 'إجمالي المبيعات' : 'Total Revenue'}</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900">{totalRevenueDisplay}</p>
            <span className="text-[11px] text-emerald-600 font-bold block">
              {lang === 'ar' ? `محسوبة من ${orders.length} طلب` : `From ${orders.length} orders`}
            </span>
          </div>

          <div
            onClick={() => setActiveTab('orders')}
            className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2 cursor-pointer hover:border-purple-300 transition-colors"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold">{lang === 'ar' ? 'الطلبات الواردة' : 'Incoming Orders'}</span>
              <Package className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900">{orders.length}</p>
            <span className="text-[11px] text-purple-600 font-bold block">
              {lang === 'ar' ? 'عرض السجل وإدارته ←' : 'View order log ←'}
            </span>
          </div>

          <div
            onClick={() => setActiveTab('products')}
            className={`bg-white p-5 rounded-3xl border shadow-xs space-y-2 cursor-pointer transition-colors ${
              lowStockProducts.length > 0 ? 'border-amber-300 hover:border-amber-400' : 'border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold">{lang === 'ar' ? 'مخزون منخفض' : 'Low Stock Alert'}</span>
              <AlertTriangle
                className={`w-4 h-4 ${lowStockProducts.length > 0 ? 'text-amber-500 animate-bounce' : 'text-slate-400'}`}
              />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900">{lowStockProducts.length}</p>
            <span className={`text-[11px] font-bold block ${lowStockProducts.length > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
              {lowStockProducts.length > 0
                ? lang === 'ar'
                  ? 'منتجات تحتاج تزويد'
                  : 'Needs restock'
                : lang === 'ar'
                  ? 'المخزون ممتاز'
                  : 'Healthy inventory'}
            </span>
          </div>

          <div
            onClick={() => setActiveTab('products')}
            className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2 cursor-pointer hover:border-emerald-300 transition-colors"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold">{lang === 'ar' ? 'منتجات المتجر' : 'Active Catalog'}</span>
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900">{products.length}</p>
            <span className="text-[11px] text-slate-500 font-bold block">
              {lang === 'ar' ? 'منتج مفعل بالواجهة' : 'Visible in storefront'}
            </span>
          </div>
        </div>

        {/* Tab Switcher - Luxe Pro Navigation */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/60 rounded-2xl border border-slate-300/50 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('customizer')}
            className={`h-11 px-5 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${
              activeTab === 'customizer' || isLegacyTab
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 font-black'
                : 'text-slate-600 hover:text-slate-900 bg-white/50 hover:bg-white'
            }`}
          >
            <Layout className="w-4 h-4 text-amber-300" />
            <span>{lang === 'ar' ? 'ركن التعديل الموحد (كامل المتجر)' : 'Store Customizer (All-in-One)'}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === 'customizer' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800'
              }`}
            >
              16 {lang === 'ar' ? 'ركناً' : 'corners'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('layout')}
            className={`h-11 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'layout'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 font-black'
                : 'text-slate-600 hover:text-slate-900 bg-white/50 hover:bg-white'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-300" />
            <span>{lang === 'ar' ? 'سحب وترتيب الأقسام' : 'Layout & Reorder'}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === 'layout' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800'
              }`}
            >
              9 {lang === 'ar' ? 'أقسام' : 'sections'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`h-11 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'products' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'ar' ? 'المنتجات والمخزون' : 'Products & Stock'}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono">
              {products.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`h-11 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders' ? 'bg-white text-slate-950 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4 text-purple-600" />
            <span>{lang === 'ar' ? 'الطلبات' : 'Orders'}</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-mono">
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`h-11 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'reviews' ? 'bg-white text-slate-950 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BadgeCheck className="w-4 h-4 text-amber-500" />
            <span>{lang === 'ar' ? 'آراء وتقييمات العملاء' : 'Customer Reviews'}</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono">
              {allTestimonialsList.length}
            </span>
            {pendingReviewsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold animate-pulse">
                {pendingReviewsCount} {lang === 'ar' ? 'جديد' : 'new'}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('onboarding')}
            className={`h-11 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'onboarding'
                ? 'bg-white text-slate-950 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Rocket className="w-4 h-4 text-indigo-600" />
            <span>{lang === 'ar' ? 'تهيئة المتجر للعميل' : 'Client Handover'}</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-[10px] font-mono">
              {lang === 'ar' ? 'تجهيز' : 'Setup'}
            </span>
          </button>
        </div>

        {/* Isolated Active Tab Views */}
        {activeTab === 'customizer' && (
          <ErrorBoundary scope="AdminTab:Customizer">
            <UnifiedStoreCustomizer onNavigateToProducts={() => setActiveTab('products')} />
          </ErrorBoundary>
        )}

        {activeTab === 'layout' && (
          <ErrorBoundary scope="AdminTab:Layout">
            <SectionsLayoutReorder />
          </ErrorBoundary>
        )}

        {activeTab === 'orders' && (
          <ErrorBoundary scope="AdminTab:Orders">
            <AdminOrdersTab />
          </ErrorBoundary>
        )}

        {activeTab === 'products' && (
          <ErrorBoundary scope="AdminTab:Products">
            <AdminProductsTab onRequestConfirm={setConfirmDialog} />
          </ErrorBoundary>
        )}

        {activeTab === 'reviews' && (
          <ErrorBoundary scope="AdminTab:Reviews">
            <AdminReviewsTab onRequestConfirm={setConfirmDialog} />
          </ErrorBoundary>
        )}

        {activeTab === 'onboarding' && (
          <ErrorBoundary scope="AdminTab:Onboarding">
            <AdminOnboardingTab onRequestConfirm={setConfirmDialog} />
          </ErrorBoundary>
        )}

        {isLegacyTab && (
          <ErrorBoundary scope={`AdminTab:${activeTab}`}>
            <AdminLegacyTabs tab={activeTab} />
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
