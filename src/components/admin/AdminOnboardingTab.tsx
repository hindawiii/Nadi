import React from 'react';
import { MessageSquare, Package, Rocket, RotateCcw, ShoppingBag, Trash2 } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { siteConfig } from '../../data/siteConfig';
import { AdminConfirmConfig } from './AdminProductsTab';

interface AdminOnboardingTabProps {
  onRequestConfirm: (config: AdminConfirmConfig) => void;
}

export const AdminOnboardingTab: React.FC<AdminOnboardingTabProps> = ({ onRequestConfirm }) => {
  const {
    lang,
    orders,
    clearAllOrders,
    restoreDefaultOrders,
    dynamicConfig,
    setDynamicConfig,
    activePresetId,
    showToast,
  } = useCommerce();

  const activePreset = dynamicConfig.presets[activePresetId];
  const products = activePreset.products || [];
  const allTestimonialsList =
    activePreset.testimonials && activePreset.testimonials.length > 0
      ? activePreset.testimonials
      : siteConfig.presets.cosmetics.testimonials || [];

  const handleWipeProducts = () => {
    onRequestConfirm({
      isOpen: true,
      title: lang === 'ar' ? 'تفريغ كافة المنتجات' : 'Wipe All Demo Products',
      message:
        lang === 'ar'
          ? 'تأكيد: هل ترغب في تفريغ كافة المنتجات التجريبية لتجهيز المتجر للعميل الجديد؟'
          : 'Confirm: Wipe all demo products to prepare store for new client?',
      confirmLabel: lang === 'ar' ? 'تفريغ المنتجات' : 'Wipe Products',
      variant: 'danger',
      onConfirm: () => {
        setDynamicConfig((prev) => {
          const clone = JSON.parse(JSON.stringify(prev));
          clone.presets[activePresetId].products = [];
          try {
            localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
          } catch {
            // Best-effort cache
          }
          return clone;
        });
        showToast(
          lang === 'ar'
            ? 'تم تفريغ كافة المنتجات بنجاح! المتجر جاهز لإضافة منتجات العميل.'
            : 'All demo products cleared! Ready for client inventory.'
        );
      },
    });
  };

  const handleWipeOrders = () => {
    onRequestConfirm({
      isOpen: true,
      title: lang === 'ar' ? 'تفريغ سجل الطلبات' : 'Clear All Demo Orders',
      message: lang === 'ar' ? 'تأكيد: هل ترغب في تفريغ سجل الطلبات التجريبية بالكامل؟' : 'Confirm: Clear all demo orders?',
      confirmLabel: lang === 'ar' ? 'مسح الطلبات' : 'Clear Orders',
      variant: 'danger',
      onConfirm: () => {
        clearAllOrders();
      },
    });
  };

  const handleWipeReviews = () => {
    onRequestConfirm({
      isOpen: true,
      title: lang === 'ar' ? 'تفريغ كافة التقييمات' : 'Clear All Demo Reviews',
      message:
        lang === 'ar'
          ? 'تأكيد: هل ترغب في تفريغ التقييمات الافتراضية للبدء بدون آراء سابقة؟'
          : 'Confirm: Clear all demo reviews?',
      confirmLabel: lang === 'ar' ? 'مسح التقييمات' : 'Clear Reviews',
      variant: 'danger',
      onConfirm: () => {
        setDynamicConfig((prev) => {
          const clone = JSON.parse(JSON.stringify(prev));
          clone.presets[activePresetId].testimonials = [];
          try {
            localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
          } catch {
            // Best-effort cache
          }
          return clone;
        });
        showToast(lang === 'ar' ? 'تم تفريغ كافة التقييمات بنجاح' : 'All demo reviews cleared');
      },
    });
  };

  const handleFullClientReset = () => {
    onRequestConfirm({
      isOpen: true,
      title: lang === 'ar' ? 'التصفير الشامل للمتجر' : 'Full Client Handover Reset',
      message:
        lang === 'ar'
          ? 'تحذير تصفير شامل: سيتم مسح المنتجات والطلبات والتقييمات التجريبية لتسليم المتجر كـ (Zero-State Clean) للعميل. هل تود المتابعة؟'
          : 'Full Reset: This will wipe demo products, orders, and reviews for clean client handover. Proceed?',
      confirmLabel: lang === 'ar' ? 'تأكيد التصفير الشامل' : 'Proceed Full Reset',
      variant: 'danger',
      onConfirm: () => {
        setDynamicConfig((prev) => {
          const clone = JSON.parse(JSON.stringify(prev));
          clone.presets[activePresetId].products = [];
          clone.presets[activePresetId].testimonials = [];
          try {
            localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
          } catch {
            // Best-effort cache
          }
          return clone;
        });
        clearAllOrders();
        showToast(
          lang === 'ar'
            ? 'تم التصفير الشامل بنجاح! المتجر مهيأ بالكامل لتسليمه للعميل.'
            : 'Store successfully reset to zero-state for client!'
        );
      },
    });
  };

  const handleRestoreDemoDefaults = () => {
    onRequestConfirm({
      isOpen: true,
      title: lang === 'ar' ? 'استعادة البيانات النموذجية' : 'Restore Demo Defaults',
      message:
        lang === 'ar'
          ? 'استعادة البيانات: هل ترغب في استرجاع المنتجات والطلبات النموذجية للمعاينة مجدداً؟'
          : 'Restore: Recover default demo products and orders?',
      confirmLabel: lang === 'ar' ? 'استعادة الآن' : 'Restore Defaults',
      variant: 'warning',
      onConfirm: () => {
        setDynamicConfig((prev) => {
          const clone = JSON.parse(JSON.stringify(prev));
          clone.presets[activePresetId].products = JSON.parse(
            JSON.stringify(siteConfig.presets[activePresetId]?.products || siteConfig.presets.cosmetics.products)
          );
          clone.presets[activePresetId].testimonials = JSON.parse(
            JSON.stringify(siteConfig.presets[activePresetId]?.testimonials || siteConfig.presets.cosmetics.testimonials)
          );
          try {
            localStorage.setItem('luxe_commerce_config_v2', JSON.stringify(clone));
          } catch {
            // Best-effort cache
          }
          return clone;
        });
        restoreDefaultOrders();
        showToast(lang === 'ar' ? 'تمت استعادة البيانات والمنتجات النموذجية بنجاح!' : 'Default demo data restored successfully!');
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-5 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-200">
              {lang === 'ar' ? 'أداة التسليم والتجهيز الاحترافية' : 'Store Handover Suite'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Rocket className="w-6 h-6 text-indigo-600" />
            <span>{lang === 'ar' ? 'مركز تهيئة وتسليم المتجر للعميل (Client Onboarding)' : 'Client Handover & Onboarding Suite'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
            {lang === 'ar'
              ? 'أدوات ذكية متقدمة لتهيئة وتصفير المتجر عند بيعه لعميل جديد بنقرة زر واحدة دون الحاجة لمسح الكروت يدوياً، مع إمكانية استعادة الكتالوج النموذجي في أي وقت.'
              : 'Smart automated zero-state tools to prepare, wipe, or initialize the store for your client with zero manual effort.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Wipe Demo Products */}
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">
                {lang === 'ar' ? '1. تفريغ المنتجات التجريبية' : '1. Wipe Demo Products'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === 'ar'
                  ? 'مسح كافة منتجات المعاينة دفعة واحدة ليصبح المتجر فارغاً ونظيفاً تماماً وجاهزاً لرفع كتالوج منتجات العميل الفعلي.'
                  : 'Clears all demo catalog products in one click so the client can start adding their actual inventory.'}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/70 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 block">
                {lang === 'ar' ? `المنتجات الحالية: ${products.length} منتج` : `Current catalog: ${products.length} products`}
              </span>
              <button
                type="button"
                onClick={handleWipeProducts}
                className="w-full h-10 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 hover:border-rose-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تفريغ المنتجات التجريبية' : 'Wipe Products'}</span>
              </button>
            </div>
          </div>

          {/* 2. Wipe Demo Orders */}
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">
                {lang === 'ar' ? '2. تفريغ سجل الطلبات التجريبية' : '2. Wipe Demo Orders'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === 'ar'
                  ? 'تصفير ومسح كافة الطلبات المسجلة أثناء تجربة المتجر، لتبدأ لوحة المبيعات والإحصائيات من الصفر مع العميل.'
                  : 'Purge test orders recorded during staging so revenue KPIs start clean for the merchant.'}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/70 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 block">
                {lang === 'ar' ? `الطلبات الحالية: ${orders.length} طلب` : `Current orders: ${orders.length}`}
              </span>
              <button
                type="button"
                onClick={handleWipeOrders}
                className="w-full h-10 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 hover:border-rose-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تفريغ سجل الطلبات' : 'Wipe Orders'}</span>
              </button>
            </div>
          </div>

          {/* 3. Wipe Demo Reviews */}
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-amber-800" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">
                {lang === 'ar' ? '3. تفريغ التقييمات الافتراضية' : '3. Wipe Demo Reviews'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === 'ar'
                  ? 'مسح التقييمات الافتراضية إذا كان العميل يفضل بدء المتجر خالياً حتى يتسنى له جمع آراء المشترين الحقيقيين.'
                  : 'Clear default testimonials if the merchant prefers launching with organic buyer reviews only.'}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/70 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 block">
                {lang === 'ar' ? `التقييمات الحالية: ${allTestimonialsList.length}` : `Current reviews: ${allTestimonialsList.length}`}
              </span>
              <button
                type="button"
                onClick={handleWipeReviews}
                className="w-full h-10 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 hover:border-rose-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تفريغ التقييمات' : 'Wipe Reviews'}</span>
              </button>
            </div>
          </div>

          {/* 4. Full Zero-State Handover */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 space-y-4 flex flex-col justify-between md:col-span-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
                  <Rocket className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {lang === 'ar' ? 'التصفير الذكي الشامل' : 'Master Zero-State Reset'}
                </span>
              </div>
              <h3 className="font-black text-base text-slate-900">
                {lang === 'ar' ? 'التصفير الشامل لتسليم المتجر للعميل (Master Zero-State Clean)' : 'Master Zero-State Clean Handover'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                {lang === 'ar'
                  ? 'يقوم بتفريغ المنتجات والطلبات والتقييمات دفعة واحدة في ثانية واحدة، مع الحفاظ الكامل على كافة إعدادات الهوية والتصميم والتنسيقات وأرقام التواصل سليمة 100% لتسليم متجر مهيأ بالكامل للعميل الجديد.'
                  : 'Purges products, orders, and reviews simultaneously in 1 click, while keeping brand identity, colors, and layout configurations completely intact.'}
              </p>
            </div>

            <div className="pt-4 border-t border-indigo-200/80 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-indigo-950 font-bold">
                {lang === 'ar' ? 'جاهز للتسليم الفوري بنقرة واحدة' : 'Instant ready for client handover'}
              </span>
              <button
                type="button"
                onClick={handleFullClientReset}
                className="h-11 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
              >
                <Rocket className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تنفيذ التصفير الشامل وتسليم المتجر' : 'Execute Master Clean Handover'}</span>
              </button>
            </div>
          </div>

          {/* 5. Restore Default Demo Catalog */}
          <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200/80 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">
                {lang === 'ar' ? 'استعادة الكتالوج النموذجي' : 'Restore Demo Catalog'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'ar'
                  ? 'هل ترغب في استرجاع المنتجات والطلبات والتقييمات النموذجية لعرض المتجر أو المعاينة مجدداً؟ يمكنك استعادتها بضغطة زر.'
                  : 'Restore default sample products, mock orders, and verified reviews anytime for demonstration.'}
              </p>
            </div>
            <div className="pt-3 border-t border-amber-200/70">
              <button
                type="button"
                onClick={handleRestoreDemoDefaults}
                className="w-full h-10 rounded-xl bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
              >
                <RotateCcw className="w-4 h-4 text-amber-700" />
                <span>{lang === 'ar' ? 'استعادة البيانات النموذجية' : 'Restore Sample Data'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
