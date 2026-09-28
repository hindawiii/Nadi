import React, { useState } from 'react';
import { 
  Lock, KeyRound, CheckCircle, Package, DollarSign, 
  TrendingUp, AlertTriangle, ArrowLeft, ArrowRight, 
  LogOut, Edit, RefreshCw, Image as ImageIcon, Sparkles, Check,
  Sliders, FileText, ShoppingBag, Plus, Trash2, Layers,
  Phone, Mail, MapPin, Eye, ExternalLink, MessageCircle
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { Product } from '../data/siteConfig';

export const AdminPanel: React.FC = () => {
  const { 
    lang, isAdminAuthenticated, loginAdmin, logoutAdmin, 
    orders, updateOrderStatus, dynamicConfig, setDynamicConfig, 
    activePresetId, setCurrentRoute, showToast 
  } = useCommerce();

  const isRtl = lang === 'ar';
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active Admin Tabs: 'orders' | 'content' | 'products' | 'branding'
  const [activeTab, setActiveTab] = useState<'orders' | 'content' | 'products' | 'branding'>('orders');

  // New product form modal state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdNameAr, setNewProdNameAr] = useState('');
  const [newProdNameEn, setNewProdNameEn] = useState('');
  const [newProdCatAr, setNewProdCatAr] = useState('');
  const [newProdCatEn, setNewProdCatEn] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(10);
  const [newProdStock, setNewProdStock] = useState(15);
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdBadge, setNewProdBadge] = useState('جديد 🌟');

  // If not authenticated, display PIN security gate (Default PIN: 2026)
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
              className="w-full py-3.5 bg-[#5A3E7A] hover:bg-[#483162] text-white rounded-2xl font-bold text-sm shadow-md transition-colors min-h-[48px] cursor-pointer"
            >
              {lang === 'ar' ? 'تسجيل الدخول للوحة' : 'Unlock Dashboard'}
            </button>
          </form>

          <button
            onClick={() => setCurrentRoute('store')}
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            {lang === 'ar' ? 'الرجوع للمتجر' : 'Return to Store'}
          </button>
        </div>
      </div>
    );
  }

  // Active preset in current view
  const activePreset = dynamicConfig.presets[activePresetId];
  const products = activePreset.products || [];

  // Update helper for active preset fields
  const updateField = (path: string, value: any) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let cur = clone.presets[activePresetId];
      for (let i = 0; i < parts.length - 1; i++) {
        if (!cur[parts[i]]) cur[parts[i]] = {};
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
      try {
        localStorage.setItem('luxe_commerce_config_v1', JSON.stringify(clone));
      } catch (e) {}
      return clone;
    });
  };

  // Stock and Price controls
  const handleStockChange = (productId: string, newStock: number) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const target = clone.presets[activePresetId].products.find((p: any) => p.id === productId);
      if (target) {
        target.stock = Math.max(0, newStock);
      }
      try {
        localStorage.setItem('luxe_commerce_config_v1', JSON.stringify(clone));
      } catch (e) {}
      return clone;
    });
    showToast(lang === 'ar' ? 'تم تحديث كمية المخزون' : 'Inventory updated');
  };

  const handlePriceChange = (productId: string, newUSD: number) => {
    setDynamicConfig((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const target = clone.presets[activePresetId].products.find((p: any) => p.id === productId);
      if (target) {
        target.basePriceUSD = Math.max(0.5, newUSD);
      }
      try {
        localStorage.setItem('luxe_commerce_config_v1', JSON.stringify(clone));
      } catch (e) {}
      return clone;
    });
    showToast(lang === 'ar' ? 'تم تحديث السعر الأساسي' : 'Base price updated');
  };

  // Add Product to Store
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdNameAr.trim()) {
      showToast(lang === 'ar' ? 'يرجى كتابة اسم المنتج بالعربية' : 'Please provide product name');
      return;
    }

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: {
        ar: newProdNameAr.trim(),
        en: newProdNameEn.trim() || newProdNameAr.trim()
      },
      category: {
        ar: newProdCatAr.trim() || 'العناية بالبشرة',
        en: newProdCatEn.trim() || 'Skincare'
      },
      basePriceUSD: Number(newProdPrice) || 10,
      stock: Number(newProdStock) || 10,
      badge: {
        ar: newProdBadge || 'جديد 🌟',
        en: 'New 🌟'
      },
      rating: 5.0,
      reviewsCount: 1,
      images: [
        newProdImage.trim() || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
      ],
      tabs: {
        description: {
          ar: `منتج عالي الجودة يقدم أفضل نتائج العناية والجمال لبشرتك بمكونات نقية وفعالة.`,
          en: `Premium formulation engineered for maximum visible radiance and skin nourishment.`
        },
        usage: {
          ar: 'يوضع بلطف على بشرة نظيفة ويدلك حتى الامتصاص التام.',
          en: 'Apply gently to clean skin and massage until fully absorbed.'
        },
        ingredientsOrSpecs: {
          ar: 'خلاصات طبيعية نباتية 100%، فيتامينات مغذية.',
          en: '100% pure botanical extracts and nourishing vitamins.'
        },
        reviews: {
          ar: 'تقييمات ممتازة من عميلات المتجر المعتمدات.',
          en: 'Highly rated by verified customers.'
        }
      }
    };

    setDynamicConfig(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      clone.presets[activePresetId].products = [newProd, ...(clone.presets[activePresetId].products || [])];
      try {
        localStorage.setItem('luxe_commerce_config_v1', JSON.stringify(clone));
      } catch (e) {}
      return clone;
    });

    setIsAddingProduct(false);
    setNewProdNameAr('');
    setNewProdNameEn('');
    setNewProdImage('');
    showToast(lang === 'ar' ? 'تمت إضافة المنتج الجديد بنجاح!' : 'New product added successfully!');
  };

  // Delete Product
  const handleDeleteProduct = (productId: string) => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
      setDynamicConfig(prev => {
        const clone = JSON.parse(JSON.stringify(prev));
        clone.presets[activePresetId].products = (clone.presets[activePresetId].products || []).filter((p: any) => p.id !== productId);
        try {
          localStorage.setItem('luxe_commerce_config_v1', JSON.stringify(clone));
        } catch (e) {}
        return clone;
      });
      showToast(lang === 'ar' ? 'تم حذف المنتج من المتجر' : 'Product removed');
    }
  };

  // Add/Remove Image for a Product
  const handleAddProductImage = (productId: string) => {
    const url = prompt(lang === 'ar' ? 'أدخل رابط الصورة الإضافية للمنتج (URL):' : 'Enter additional product image URL:');
    if (!url || !url.trim()) return;

    setDynamicConfig(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      const target = clone.presets[activePresetId].products.find((p: any) => p.id === productId);
      if (target) {
        if (!target.images) target.images = [];
        target.images.push(url.trim());
      }
      try {
        localStorage.setItem('luxe_commerce_config_v1', JSON.stringify(clone));
      } catch (e) {}
      return clone;
    });
    showToast(lang === 'ar' ? 'تمت إضافة الصورة بنجاح' : 'Image added');
  };

  const handleRemoveProductImage = (productId: string, imgIdx: number) => {
    setDynamicConfig(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      const target = clone.presets[activePresetId].products.find((p: any) => p.id === productId);
      if (target && target.images && target.images.length > 1) {
        target.images.splice(imgIdx, 1);
      }
      try {
        localStorage.setItem('luxe_commerce_config_v1', JSON.stringify(clone));
      } catch (e) {}
      return clone;
    });
    showToast(lang === 'ar' ? 'تم حذف الصورة' : 'Image removed');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
        
        {/* Top Header & Navigation */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {lang === 'ar' ? 'لوحة تحكم المتجر والعميل المشتري' : 'Store Merchant Operations'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {activePreset.storeName[lang]} – {lang === 'ar' ? 'التحكم الشامل بالمتجر' : 'Full Store Control'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'ar' ? 'تعديل كافة نصوص المتجر، الشريطين، الصور، المنتجات والطلبات بمرونة تامة.' : 'Complete management of texts, banners, images, inventory & incoming orders.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setCurrentRoute('store')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'معاينة المتجر' : 'View Storefront'}</span>
            </button>
            <button
              onClick={logoutAdmin}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'تسجيل الخروج (قفل)' : 'Lock & Exit'}</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl border border-slate-300/60 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders' 
                ? 'bg-white text-slate-950 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4 text-purple-600" />
            <span>{lang === 'ar' ? 'الطلبات والمبيعات' : 'Orders & Sales'}</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px]">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'content' 
                ? 'bg-white text-slate-950 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>{lang === 'ar' ? 'محرر النصوص والشريطين' : 'Texts & Tickers'}</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'products' 
                ? 'bg-white text-slate-950 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'ar' ? 'المنتجات والصور والمخزون' : 'Products & Images'}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'branding' 
                ? 'bg-white text-slate-950 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-amber-600" />
            <span>{lang === 'ar' ? 'الهوية والشعار والتذييل' : 'Branding & Footer'}</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: ORDERS & INCOMING SALES                           */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
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

            {/* Orders Management Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {lang === 'ar' ? 'سجل الطلبات الواردة' : 'Incoming Customer Orders'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {lang === 'ar' ? 'تحديث حالات الشحن وتأكيد طلبات العميلات مباشرة' : 'Update delivery status in real-time'}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-start border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold">
                      <th className="py-3 px-4 text-start">{lang === 'ar' ? 'رقم الطلب' : 'Order ID'}</th>
                      <th className="py-3 px-4 text-start">{lang === 'ar' ? 'العميلة' : 'Customer'}</th>
                      <th className="py-3 px-4 text-start">{lang === 'ar' ? 'الهاتف' : 'Phone'}</th>
                      <th className="py-3 px-4 text-start">{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
                      <th className="py-3 px-4 text-start">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-slate-900">{o.id}</td>
                        <td className="py-4 px-4 font-medium text-slate-800">{o.customerName}</td>
                        <td className="py-4 px-4 text-slate-600 font-mono" dir="ltr">{o.phone}</td>
                        <td className="py-4 px-4 font-bold text-slate-900">{o.totalFormatted}</td>
                        <td className="py-4 px-4">
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5A3E7A]"
                          >
                            <option value="received">{lang === 'ar' ? 'جديد (مستلم)' : 'Received'}</option>
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
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: TEXTS, TICKERS & PROMO BANNER                     */}
        {/* ======================================================== */}
        {activeTab === 'content' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                {lang === 'ar' ? 'تعديل نصوص المتجر والشريطين المتحركين' : 'Store Texts & Animated Tickers'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'ar' 
                  ? 'يمكنك هنا تغيير نصوص الشريط العلوي المتحرك، نصوص الشريط اللانهائي للبراند، ونصوص واجهة الهيرو والبنرات الترويجية.' 
                  : 'Customize top announcement ticker slides, brand infinite marquee, hero texts, and campaign banner.'}
              </p>
            </div>

            {/* 1. TOP ANNOUNCEMENT SLIDES */}
            <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#5A3E7A]">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-extrabold text-sm sm:text-base">
                    {lang === 'ar' ? '1. شرائح الشريط الإعلاني العلوي المتحرك' : '1. Top Announcement Ticker Slides'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const currentSlides = activePreset.announcementSlides || [];
                    const newSlides = [...currentSlides, { ar: 'نص إعلاني جديد هنا ✨', en: 'New announcement text here ✨' }];
                    updateField('announcementSlides', newSlides);
                    showToast(lang === 'ar' ? 'تمت إضافة شريحة إعلانية جديدة' : 'Slide added');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#5A3E7A] text-white text-xs font-bold hover:bg-[#483162] flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'إضافة شريحة' : 'Add Slide'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {(activePreset.announcementSlides || [
                  { ar: "تسوقي بذكاء: احفظي في المفضلة ❤️ • قارني المواصفات ⚖️ • اطلبي فـوراً عبر السلة أو واتساب 💬", en: "Smart Shopping: Save to Wishlist ❤️ • Compare Specs ⚖️ • Order via Cart or WhatsApp 💬" }
                ]).map((slide, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border border-purple-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-900">
                        {lang === 'ar' ? `الشريحة الإعلانية (${idx + 1}):` : `Slide (${idx + 1}):`}
                      </span>
                      {(activePreset.announcementSlides || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const currentSlides = [...(activePreset.announcementSlides || [])];
                            currentSlides.splice(idx, 1);
                            updateField('announcementSlides', currentSlides);
                            showToast(lang === 'ar' ? 'تم حذف الشريحة' : 'Slide removed');
                          }}
                          className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'حذف' : 'Delete'}</span>
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 block mb-1">
                          {lang === 'ar' ? 'النص بالعربية:' : 'Arabic Text:'}
                        </label>
                        <input
                          type="text"
                          value={slide.ar}
                          onChange={(e) => {
                            const currentSlides = [...(activePreset.announcementSlides || [])];
                            currentSlides[idx] = { ...currentSlides[idx], ar: e.target.value };
                            updateField('announcementSlides', currentSlides);
                          }}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#5A3E7A]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 block mb-1">
                          {lang === 'ar' ? 'النص بالإنجليزية:' : 'English Text:'}
                        </label>
                        <input
                          type="text"
                          value={slide.en}
                          onChange={(e) => {
                            const currentSlides = [...(activePreset.announcementSlides || [])];
                            currentSlides[idx] = { ...currentSlides[idx], en: e.target.value };
                            updateField('announcementSlides', currentSlides);
                          }}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#5A3E7A]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. INFINITE BRAND TICKER (BOTTOM TICKER) */}
            <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-800">
                  <Layers className="w-5 h-5" />
                  <h3 className="font-extrabold text-sm sm:text-base">
                    {lang === 'ar' ? '2. نصوص الشريط السفلي اللانهائي (Brand Ticker)' : '2. Infinite Brand Marquee Ticker'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const currentItems = activePreset.brandTickerItems || [];
                    const newItems = [
                      ...currentItems,
                      {
                        brandAr: activePreset.storeName.ar,
                        brandEn: activePreset.storeName.en,
                        sloganAr: 'عناية فائقة ونقاء 100%',
                        sloganEn: 'Pure Botanical Care',
                        tagAr: 'نتائج مثبتة',
                        tagEn: 'Visible Results'
                      }
                    ];
                    updateField('brandTickerItems', newItems);
                    showToast(lang === 'ar' ? 'تمت إضافة جملة للشريط اللانهائي' : 'Ticker item added');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'إضافة نص' : 'Add Item'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {(activePreset.brandTickerItems || [
                  {
                    brandAr: "نَـــــدِي",
                    brandEn: "NADI",
                    sloganAr: "إشراقة طبيعية، تليق بك.",
                    sloganEn: "Natural radiance, made for you.",
                    tagAr: "جمال ونقاء نباتي",
                    tagEn: "Pure Botanical Radiance"
                  }
                ]).map((item, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border border-amber-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900">
                        {lang === 'ar' ? `الجملة (${idx + 1}):` : `Item (${idx + 1}):`}
                      </span>
                      {(activePreset.brandTickerItems || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const currentItems = [...(activePreset.brandTickerItems || [])];
                            currentItems.splice(idx, 1);
                            updateField('brandTickerItems', currentItems);
                            showToast(lang === 'ar' ? 'تم حذف العنصر' : 'Item removed');
                          }}
                          className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'حذف' : 'Delete'}</span>
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 block mb-1">
                          {lang === 'ar' ? 'اسم المتجر في الشريط:' : 'Store Name:'}
                        </label>
                        <input
                          type="text"
                          value={item.brandAr}
                          onChange={(e) => {
                            const current = [...(activePreset.brandTickerItems || [])];
                            current[idx] = { ...current[idx], brandAr: e.target.value };
                            updateField('brandTickerItems', current);
                          }}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 block mb-1">
                          {lang === 'ar' ? 'النص / العبارة (عربي):' : 'Slogan (Arabic):'}
                        </label>
                        <input
                          type="text"
                          value={item.sloganAr}
                          onChange={(e) => {
                            const current = [...(activePreset.brandTickerItems || [])];
                            current[idx] = { ...current[idx], sloganAr: e.target.value };
                            updateField('brandTickerItems', current);
                          }}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 block mb-1">
                          {lang === 'ar' ? 'الشارة المميزة (Badge):' : 'Badge Tag:'}
                        </label>
                        <input
                          type="text"
                          value={item.tagAr}
                          onChange={(e) => {
                            const current = [...(activePreset.brandTickerItems || [])];
                            current[idx] = { ...current[idx], tagAr: e.target.value };
                            updateField('brandTickerItems', current);
                          }}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. HERO SECTION TEXTS & IMAGERY */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                {lang === 'ar' ? '3. واجهة الهيرو الرئيسية (Hero Section)' : '3. Main Hero Section'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    {lang === 'ar' ? 'العنوان الرئيسي (Hero Title بالعربية):' : 'Hero Title (Arabic):'}
                  </label>
                  <input
                    type="text"
                    value={activePreset.heroTitle?.ar || ''}
                    onChange={(e) => updateField('heroTitle.ar', e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    {lang === 'ar' ? 'العنوان الرئيسي (Hero Title بالإنجليزية):' : 'Hero Title (English):'}
                  </label>
                  <input
                    type="text"
                    value={activePreset.heroTitle?.en || ''}
                    onChange={(e) => updateField('heroTitle.en', e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    {lang === 'ar' ? 'الوصف الترحيبي (Subtitle بالعربية):' : 'Hero Subtitle (Arabic):'}
                  </label>
                  <textarea
                    rows={2}
                    value={activePreset.heroSubtitle?.ar || ''}
                    onChange={(e) => updateField('heroSubtitle.ar', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    {lang === 'ar' ? 'رابط صورة واجهة الهيرو الكبيرة (Hero Image URL):' : 'Hero Main Image URL:'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={activePreset.heroImage || ''}
                      onChange={(e) => updateField('heroImage', e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                    />
                    <img src={activePreset.heroImage} alt="Hero" className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. PROMOTIONAL BANNER & BEFORE/AFTER */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                {lang === 'ar' ? '4. البنر الترويجي وبنرات الصور (Promo Banner & Images)' : '4. Promotional Banner & Images'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    {lang === 'ar' ? 'عنوان البنر الترويجي (عربي):' : 'Promo Banner Title (Arabic):'}
                  </label>
                  <input
                    type="text"
                    value={activePreset.promoBanner?.title?.ar || ''}
                    onChange={(e) => updateField('promoBanner.title.ar', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    {lang === 'ar' ? 'شارة الخصم (Badge):' : 'Banner Badge:'}
                  </label>
                  <input
                    type="text"
                    value={activePreset.promoBanner?.badge?.ar || ''}
                    onChange={(e) => updateField('promoBanner.badge.ar', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    {lang === 'ar' ? 'رابط الصورة الترويجية الأولى (URL):' : 'Promo Image 1 URL:'}
                  </label>
                  <input
                    type="url"
                    value={activePreset.promoBanner?.image1 || ''}
                    onChange={(e) => updateField('promoBanner.image1', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    {lang === 'ar' ? 'رابط الصورة الترويجية الثانية (URL):' : 'Promo Image 2 URL:'}
                  </label>
                  <input
                    type="url"
                    value={activePreset.promoBanner?.image2 || ''}
                    onChange={(e) => updateField('promoBanner.image2', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: PRODUCTS & FULL IMAGE MANAGEMENT                  */}
        {/* ======================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {lang === 'ar' ? 'إدارة المنتجات، الصور، والأسعار' : 'Products, Gallery & Stock Management'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {lang === 'ar' ? 'يمكنك إضافة منتج جديد، حذف منتج، استبدال الصور، أو إضافة صور إضافية لمعرض المنتج.' : 'Add new items, remove products, add multiple photos, adjust prices & stock.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingProduct(true)}
                  className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}</span>
                </button>
              </div>

              {/* Add Product Modal Drawer */}
              {isAddingProduct && (
                <div className="p-6 bg-slate-50 rounded-2xl border-2 border-emerald-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="font-extrabold text-sm text-slate-900">
                      {lang === 'ar' ? 'بيانات المنتج الجديد' : 'New Product Details'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                      className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                  </div>

                  <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        {lang === 'ar' ? 'اسم المنتج بالعربية *' : 'Product Name (Arabic) *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={newProdNameAr}
                        onChange={(e) => setNewProdNameAr(e.target.value)}
                        placeholder="مثال: سيروم الورد المركز"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        {lang === 'ar' ? 'اسم المنتج بالإنجليزية:' : 'Product Name (English):'}
                      </label>
                      <input
                        type="text"
                        value={newProdNameEn}
                        onChange={(e) => setNewProdNameEn(e.target.value)}
                        placeholder="e.g. Concentrated Rose Serum"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        {lang === 'ar' ? 'التصنيف (عربي):' : 'Category (Arabic):'}
                      </label>
                      <input
                        type="text"
                        value={newProdCatAr}
                        onChange={(e) => setNewProdCatAr(e.target.value)}
                        placeholder="العناية بالبشرة"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        {lang === 'ar' ? 'شارة الخصم أو التميز:' : 'Badge Text:'}
                      </label>
                      <input
                        type="text"
                        value={newProdBadge}
                        onChange={(e) => setNewProdBadge(e.target.value)}
                        placeholder="جديد 🌟"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        {lang === 'ar' ? 'السعر بالدولار ($ USD):' : 'Price ($ USD):'}
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(parseFloat(e.target.value) || 1)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        {lang === 'ar' ? 'كمية المخزون الأولي:' : 'Initial Stock:'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        {lang === 'ar' ? 'رابط الصورة الأساسية للمنتج (Image URL):' : 'Primary Image URL:'}
                      </label>
                      <input
                        type="url"
                        value={newProdImage}
                        onChange={(e) => setNewProdImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                      />
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-md"
                      >
                        {lang === 'ar' ? 'حفظ وإضافة المنتج للمتجر' : 'Save & Publish Product'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Products List & Media Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <div key={p.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Product Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="text-sm font-extrabold text-slate-900 truncate">{p.name[lang]}</h4>
                          <span className="text-[11px] text-purple-700 font-semibold">{p.category[lang]}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
                          title={lang === 'ar' ? 'حذف المنتج' : 'Delete Product'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Image Gallery Management */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 block">
                          {lang === 'ar' ? `معرض الصور (${p.images?.length || 0} صور):` : `Gallery (${p.images?.length || 0} photos):`}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {(p.images || []).map((imgUrl, imgIdx) => (
                            <div key={imgIdx} className="relative group w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-white">
                              <img src={imgUrl} alt={`Product ${imgIdx}`} className="w-full h-full object-cover" />
                              {(p.images?.length || 0) > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveProductImage(p.id, imgIdx)}
                                  className="absolute inset-0 bg-rose-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold"
                                >
                                  {lang === 'ar' ? 'حذف' : 'Del'}
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleAddProductImage(p.id)}
                            className="w-14 h-14 rounded-xl border border-dashed border-purple-300 hover:border-[#5A3E7A] bg-purple-50 text-purple-700 flex flex-col items-center justify-center text-[10px] font-bold cursor-pointer transition-colors"
                            title={lang === 'ar' ? 'إضافة صورة للمنتج' : 'Add photo'}
                          >
                            <Plus className="w-4 h-4 mb-0.5" />
                            <span>{lang === 'ar' ? 'إضافة' : 'Add'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Stock & Price Controls */}
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500 block">
                            {lang === 'ar' ? 'المخزون:' : 'Stock:'}
                          </label>
                          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white text-xs">
                            <button
                              onClick={() => handleStockChange(p.id, p.stock - 1)}
                              className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <span className={`px-2 py-1 font-bold text-center flex-1 ${p.stock === 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                              {p.stock}
                            </span>
                            <button
                              onClick={() => handleStockChange(p.id, p.stock + 1)}
                              className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500 block">
                            {lang === 'ar' ? 'السعر ($ USD):' : 'Price ($ USD):'}
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: BRANDING, LOGO & FOOTER INFORMATION               */}
        {/* ======================================================== */}
        {activeTab === 'branding' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                {lang === 'ar' ? 'إعدادات هوية المتجر وبيانات التذييل (Footer)' : 'Brand Identity & Footer Information'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'ar' ? 'تعديل اسم المتجر، شعار المتجر، أرقام الواتساب والتواصل، وعنوان المتجر ونبذة من نحن في أسفل الصفحة.' : 'Manage store names, logo, WhatsApp hotline, address, and about story.'}
              </p>
            </div>

            {/* Store Name & Slogan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {lang === 'ar' ? 'اسم المتجر بالعربية:' : 'Store Name (Arabic):'}
                </label>
                <input
                  type="text"
                  value={activePreset.storeName.ar}
                  onChange={(e) => updateField('storeName.ar', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {lang === 'ar' ? 'اسم المتجر بالإنجليزية:' : 'Store Name (English):'}
                </label>
                <input
                  type="text"
                  value={activePreset.storeName.en}
                  onChange={(e) => updateField('storeName.en', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {lang === 'ar' ? 'شعار المتجر اللفظي (Slogan بالعربية):' : 'Slogan (Arabic):'}
                </label>
                <input
                  type="text"
                  value={activePreset.storeSlogan.ar}
                  onChange={(e) => updateField('storeSlogan.ar', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {lang === 'ar' ? 'شعار المتجر اللفظي (Slogan بالإنجليزية):' : 'Slogan (English):'}
                </label>
                <input
                  type="text"
                  value={activePreset.storeSlogan.en}
                  onChange={(e) => updateField('storeSlogan.en', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Logo Image URL */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 block">
                  {lang === 'ar' ? 'رابط صورة الشعار (Logo Image URL):' : 'Store Logo Image URL:'}
                </label>
                {activePreset.storeLogo && (
                  <button
                    type="button"
                    onClick={() => {
                      updateField('storeLogo', '');
                      showToast(lang === 'ar' ? 'تم مسح الشعار والاعتماد على الاسم النصي' : 'Reverted to text logo');
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                  >
                    {lang === 'ar' ? 'مسح الشعار والعودة للاسم النصي' : 'Clear & Revert to Pure Text'}
                  </button>
                )}
              </div>
              <input
                type="url"
                placeholder="https://... (Leave blank for text-only luxury mode)"
                value={activePreset.storeLogo || ''}
                onChange={(e) => updateField('storeLogo', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
              />
              <p className="text-[11px] text-slate-500">
                {lang === 'ar'
                  ? 'إذا تركت الحقل فارغاً، يظهر الاسم النصي المتناسق. وإذا وضعت رابط صورة، سيتم عرضها كشعار فوري.'
                  : 'Leaving this blank shows high-contrast geometric text. Adding an image URL displays it automatically.'}
              </p>
            </div>

            {/* Contact & Footer Information */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">
                {lang === 'ar' ? 'بيانات التواصل والتذييل (Contact Info & Footer)' : 'Contact Information & Footer'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    {lang === 'ar' ? 'رقم الواتساب الرسمي (بدون + وبدون أصفار):' : 'WhatsApp Number:'}
                  </label>
                  <input
                    type="text"
                    value={activePreset.contactInfo.whatsapp}
                    onChange={(e) => updateField('contactInfo.whatsapp', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    {lang === 'ar' ? 'رقم الهاتف المباشر:' : 'Direct Phone:'}
                  </label>
                  <input
                    type="text"
                    value={activePreset.contactInfo.phone}
                    onChange={(e) => updateField('contactInfo.phone', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    {lang === 'ar' ? 'البريد الإلكتروني للعملاء:' : 'Customer Email:'}
                  </label>
                  <input
                    type="email"
                    value={activePreset.contactInfo.email}
                    onChange={(e) => updateField('contactInfo.email', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    {lang === 'ar' ? 'عنوان المتجر أو المستودع:' : 'Store Address:'}
                  </label>
                  <input
                    type="text"
                    value={activePreset.contactInfo.address.ar}
                    onChange={(e) => updateField('contactInfo.address.ar', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    {lang === 'ar' ? 'نبذة عن المتجر في الفوتر (About Snippet):' : 'Footer About Snippet:'}
                  </label>
                  <textarea
                    rows={2}
                    value={activePreset.footerAbout?.description?.ar || ''}
                    onChange={(e) => updateField('footerAbout.description.ar', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
