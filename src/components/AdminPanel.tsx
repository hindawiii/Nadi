import React, { useState } from 'react';
import { 
  Lock, KeyRound, CheckCircle, Package, DollarSign, 
  TrendingUp, AlertTriangle, ArrowLeft, ArrowRight, 
  LogOut, Edit, RefreshCw, Image as ImageIcon, Sparkles, Check 
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

export const AdminPanel: React.FC = () => {
  const { 
    lang, isAdminAuthenticated, loginAdmin, logoutAdmin, 
    orders, updateOrderStatus, dynamicConfig, setDynamicConfig, 
    activePresetId, setCurrentRoute, showToast 
  } = useCommerce();

  const isRtl = lang === 'ar';
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // If not authenticated, display PIN security gate
  if (!isAdminAuthenticated) {
    const handlePinSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const success = loginAdmin(pinInput);
      if (!success) {
        setPinError(true);
        setPinInput('');
      } else {
        setPinError(false);
      }
    };

    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 text-center space-y-6">
          <div className="w-16 h-16 bg-purple-100 text-[#5A3E7A] rounded-2xl mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold text-slate-900">
              {lang === 'ar' ? 'لوحة العميل المشتري (/admin)' : 'Merchant Portal (/admin)'}
            </h2>
            <p className="text-xs text-slate-500">
              {lang === 'ar'
                ? 'أدخل رمز الدخول المكون من 4 أرقام (الافتراضي: 2026)'
                : 'Enter the 4-digit PIN (Default: 2026)'}
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="relative">
              <KeyRound className="w-5 h-5 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className={`w-full ps-11 pe-4 py-3 text-center tracking-[1em] text-lg font-mono font-bold bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5A3E7A] ${
                  pinError ? 'border-rose-400 bg-rose-50' : 'border-slate-200'
                }`}
                autoFocus
              />
            </div>

            {pinError && (
              <p className="text-xs font-semibold text-rose-500">
                {lang === 'ar' ? 'رمز الدخول غير صحيح، يرجى المحاولة ثانية.' : 'Incorrect PIN, please try again.'}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#5A3E7A] hover:bg-[#483162] text-white rounded-2xl font-bold text-sm shadow-md transition-colors min-h-[48px]"
            >
              {lang === 'ar' ? 'تسجيل الدخول للوحة' : 'Unlock Dashboard'}
            </button>
          </form>

          <button
            onClick={() => setCurrentRoute('store')}
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            {lang === 'ar' ? 'الرجوع للمتجر' : 'Return to Store'}
          </button>
        </div>
      </div>
    );
  }

  // Active products in current preset for stock control
  const activePreset = dynamicConfig.presets[activePresetId];
  const products = activePreset.products;

  const handleStockChange = (productId: string, newStock: number) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const target = clone.presets[activePresetId].products.find((p: any) => p.id === productId);
      if (target) {
        target.stock = Math.max(0, newStock);
      }
      return clone;
    });
    showToast(lang === 'ar' ? 'تم تحديث كمية المخزون' : 'Inventory updated');
  };

  const handlePriceChange = (productId: string, newUSD: number) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const target = clone.presets[activePresetId].products.find((p: any) => p.id === productId);
      if (target) {
        target.basePriceUSD = Math.max(1, newUSD);
      }
      return clone;
    });
    showToast(lang === 'ar' ? 'تم تحديث السعر الأساسي' : 'Base price updated');
  };

  const handleStoreLogoChange = (logoUrl: string) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      clone.presets[activePresetId].storeLogo = logoUrl;
      return clone;
    });
    showToast(lang === 'ar' ? 'تم تحديث شعار المتجر' : 'Store logo updated');
  };

  const handleStoreNameChange = (key: 'ar' | 'en', val: string) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      clone.presets[activePresetId].storeName[key] = val;
      return clone;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Top Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {lang === 'ar' ? 'لوحة تحكم التاجر المعتمد' : 'Verified Merchant Portal'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {activePreset.storeName[lang]} – {lang === 'ar' ? 'إدارة المبيعات والطلبات' : 'Operations Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentRoute('store')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              {lang === 'ar' ? 'معاينة المتجر' : 'View Storefront'}
            </button>
            <button
              onClick={logoutAdmin}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Lock & Exit'}</span>
            </button>
          </div>
        </div>

        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase">{lang === 'ar' ? 'عدد الطلبات الكلي' : 'Total Orders'}</span>
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{orders.length}</p>
            <span className="text-xs text-emerald-600 font-semibold">{lang === 'ar' ? 'نشط ومباشر' : 'Active & Live'}</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase">{lang === 'ar' ? 'تنبيهات انخفاض المخزون' : 'Low Stock Alerts'}</span>
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">
              {products.filter((p) => p.stock <= 3).length}
            </p>
            <span className="text-xs text-amber-600 font-semibold">{lang === 'ar' ? 'تحتاج توريد عاجل' : 'Requires Restocking'}</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase">{lang === 'ar' ? 'متوسط سرعة المعالجة' : 'Processing SLA'}</span>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">99.8%</p>
            <span className="text-xs text-slate-500">{lang === 'ar' ? 'معدل رضا العميلات' : 'Customer satisfaction'}</span>
          </div>
        </div>

        {/* Store Branding & Logo Management (نظام إدارة هوية وشعار المتجر الذكي) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#5A3E7A]" />
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {lang === 'ar' ? 'إعدادات هوية وشعار المتجر' : 'Store Identity & Brand Logo'}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'ar'
                  ? 'إذا لم يتم إدخال صورة، سيتم عرض الاسم النصي فقط (الإنجليزية بالأعلى والعربية بالأسفل). وإذا أضفت صورة، سيتم عرضها تلقائياً بدل الاسم الكتابي.'
                  : 'If no logo image is provided, only the text name is shown (English top, Arabic bottom). If a logo image is added, it is displayed automatically instead of the text name.'}
              </p>
            </div>

            {/* Current State Badge */}
            <div className="shrink-0">
              {activePreset.storeLogo ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'ar' ? 'الشعار الصوري مفعّل' : 'Image Logo Active'}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-[#5A3E7A] text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#5A3E7A]" />
                  <span>{lang === 'ar' ? 'الاسم النصي فقط مفعّل (بلا لوجو)' : 'Text Only Mode Active'}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Live Visual Preview Box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {lang === 'ar' ? 'المعاينة الحية لترويسة المتجر' : 'Live Header Preview'}
              </span>

              <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200/80 shadow-xs w-full flex items-center justify-center min-h-[72px]">
                {activePreset.storeLogo ? (
                  <img
                    src={activePreset.storeLogo}
                    alt={activePreset.storeName[lang]}
                    className="h-11 w-auto max-h-11 object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <span className="font-brand-geometric font-extrabold text-lg text-slate-950 tracking-[0.24em] uppercase leading-none">
                      {activePreset.storeName.en}
                    </span>
                    <span className="font-brand-ar font-bold text-sm text-slate-800 leading-tight tracking-wide">
                      {activePreset.storeName.ar.includes('ـ') ? activePreset.storeName.ar : (activePreset.storeName.ar === 'نَدِي' || activePreset.storeName.ar === 'ندي' ? 'نَـــــدِي' : activePreset.storeName.ar)}
                    </span>
                  </div>
                )}
              </div>

              <span className="text-[11px] text-slate-500">
                {activePreset.storeLogo
                  ? (lang === 'ar' ? 'يتم عرض الصورة تلقائياً' : 'Displaying image automatically')
                  : (lang === 'ar' ? 'الإنجليزية أكبر في الأعلى بنمط هندسي، والعربية في الأسفل' : 'English larger on top in geometric luxury, Arabic on bottom')}
              </span>
            </div>

            {/* Logo Image URL & Store Names Inputs */}
            <div className="lg:col-span-2 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {lang === 'ar' ? 'رابط صورة الشعار (Logo Image URL):' : 'Logo Image URL:'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={activePreset.storeLogo || ''}
                    onChange={(e) => handleStoreLogoChange(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E7A]"
                  />
                  {activePreset.storeLogo && (
                    <button
                      type="button"
                      onClick={() => handleStoreLogoChange('')}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold transition-colors whitespace-nowrap"
                    >
                      {lang === 'ar' ? 'إزالة الشعار' : 'Clear Logo'}
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  {lang === 'ar'
                    ? 'اتركه فارغاً ليعرض المتجر نص الاسم فقط بدون أي أيقونة أو مربع لوجو.'
                    : 'Leave blank to display the pure typography name without any logo icon or box.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {lang === 'ar' ? 'اسم المتجر بالإنجليزية (في الأعلى):' : 'English Store Name (Top):'}
                  </label>
                  <input
                    type="text"
                    value={activePreset.storeName.en}
                    onChange={(e) => handleStoreNameChange('en', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E7A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {lang === 'ar' ? 'اسم المتجر بالعربية (في الأسفل):' : 'Arabic Store Name (Bottom):'}
                  </label>
                  <input
                    type="text"
                    value={activePreset.storeName.ar}
                    onChange={(e) => handleStoreNameChange('ar', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E7A]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Pipeline Management */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              {lang === 'ar' ? 'إدارة الطلبات والشحنات الحية' : 'Live Orders Management'}
            </h2>
            <span className="text-xs text-slate-400">
              {lang === 'ar' ? 'تحديث فوري لجدول تتبع العميل' : 'Instant client tracking synchronization'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5 text-start">{lang === 'ar' ? 'رقم الطلب والتتبع' : 'Order / Tracking'}</th>
                  <th className="p-3.5 text-start">{lang === 'ar' ? 'العميل' : 'Customer'}</th>
                  <th className="p-3.5 text-start">{lang === 'ar' ? 'المنتجات' : 'Items'}</th>
                  <th className="p-3.5 text-start">{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
                  <th className="p-3.5 text-start">{lang === 'ar' ? 'حالة الشحن' : 'Dispatch Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold font-mono text-[#5A3E7A]">
                      {order.trackingCode}
                      <span className="block text-[11px] font-normal text-slate-400">{order.id}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 block">{order.customerName}</span>
                      <span className="text-slate-400 text-xs">{order.phone}</span>
                    </td>
                    <td className="p-3.5 text-slate-600 max-w-xs">
                      {order.items.map((it, idx) => (
                        <span key={idx} className="block text-xs">
                          {it.quantity}x {it.productName}
                        </span>
                      ))}
                    </td>
                    <td className="p-3.5 font-extrabold text-slate-900">
                      {order.totalFormatted}
                    </td>
                    <td className="p-3.5">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className="bg-purple-50 border border-purple-200 text-[#5A3E7A] font-bold py-1.5 px-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A3E7A] cursor-pointer"
                      >
                        <option value="received">{lang === 'ar' ? 'تم الاستلام' : 'Order Placed'}</option>
                        <option value="processing">{lang === 'ar' ? 'جاري التجهيز' : 'Processing'}</option>
                        <option value="dispatched">{lang === 'ar' ? 'مع المندوب' : 'Dispatched'}</option>
                        <option value="delivered">{lang === 'ar' ? 'تم التوصيل' : 'Delivered'}</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Inventory & Pricing Editor */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                {lang === 'ar' ? 'التحكم السريع بالمخزون والأسعار' : 'Instant Inventory & Pricing Control'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'ar'
                  ? 'يمكنك تغيير كميات المخزون مباشرة، أو جعل المخزون (0) لتجربة زر الحجز المسبق بالواتساب.'
                  : 'Adjust inventory or set stock to 0 to test automated WhatsApp pre-order override.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <img src={p.images[0]} alt={p.name[lang]} className="w-14 h-14 rounded-xl object-cover shrink-0 bg-white" />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{p.name[lang]}</h4>
                    <span className="text-xs text-purple-700 font-semibold">{p.category[lang]}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  {/* Stock control */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 block">
                      {lang === 'ar' ? 'المخزون:' : 'Stock:'}
                    </label>
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white text-xs">
                      <button
                        onClick={() => handleStockChange(p.id, p.stock - 1)}
                        className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 font-bold"
                      >
                        -
                      </button>
                      <span className={`px-3 py-1 font-bold text-center flex-1 ${p.stock === 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                        {p.stock}
                      </span>
                      <button
                        onClick={() => handleStockChange(p.id, p.stock + 1)}
                        className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price USD control */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 block">
                      {lang === 'ar' ? 'السعر (USD):' : 'Price (USD):'}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={p.basePriceUSD}
                      onChange={(e) => handlePriceChange(p.id, parseFloat(e.target.value) || 1)}
                      className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#5A3E7A]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
