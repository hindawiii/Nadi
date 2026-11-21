import React, { useState } from 'react';
import {
  MessageCircle,
  Package,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useCommerce } from '../../context/CommerceContext';

export const AdminOrdersTab: React.FC = () => {
  const {
    lang,
    orders,
    updateOrderStatus,
    dynamicConfig,
    activePresetId,
    isCloudAdminVerified,
    firebaseAdminEmail,
    cloudConfigStatus,
    publishStorefrontToCloud,
    showToast,
  } = useCommerce();

  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<
    'all' | 'received' | 'processing' | 'dispatched' | 'delivered'
  >('all');
  const [isConnectingCloudAdmin, setIsConnectingCloudAdmin] = useState(false);
  const [isPublishingConfig, setIsPublishingConfig] = useState(false);

  const activePreset = dynamicConfig.presets[activePresetId];

  const handleConnectCloudAdmin = async () => {
    setIsConnectingCloudAdmin(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const cred = await signInWithPopup(auth, provider);
      if (cred.user.emailVerified && cred.user.email === 'mohsentiben@gmail.com') {
        showToast(
          lang === 'ar'
            ? 'تم ربط جلسة الإدارة السحابية بنجاح! جاري مزامنة الطلبات والتقييمات...'
            : 'Cloud Admin connected! Syncing orders & reviews...'
        );
      } else {
        showToast(
          lang === 'ar'
            ? 'تم تسجيل الدخول، لكن هذا الحساب لا يملك صلاحية قراءة الطلبات السحابية.'
            : 'Signed in, but this account lacks admin cloud permissions.'
        );
      }
    } catch (err) {
      console.warn('Cloud admin sign-in aborted or failed:', err);
      showToast(
        lang === 'ar'
          ? 'تعذر ربط حساب Google. يرجى السماح بالنوافذ المنبثقة والمحاولة مجدداً.'
          : 'Could not link Google Admin account.'
      );
    } finally {
      setIsConnectingCloudAdmin(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch =
      !orderSearchQuery.trim() ||
      o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.phone.toLowerCase().includes(orderSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getCustomerWhatsAppUrl = (phone: string, customerName: string, orderId: string) => {
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      if (cleanPhone.startsWith('09') || cleanPhone.startsWith('01')) {
        cleanPhone = `249${cleanPhone.slice(1)}`;
      } else if (cleanPhone.startsWith('05')) {
        cleanPhone = `966${cleanPhone.slice(1)}`;
      }
    }
    const storeNameText = activePreset.storeName[lang];
    const msg =
      lang === 'ar'
        ? `مرحباً ${customerName}، نتواصل معكِ من متجر ${storeNameText} بخصوص طلبك رقم (${orderId}). يرجى تأكيد استلام تفاصيل الشحن. شكراً لثقتكِ بنا!`
        : `Hello ${customerName}, this is ${storeNameText} regarding your order (${orderId}). Please confirm your delivery details. Thank you for shopping with us!`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              <span>{lang === 'ar' ? 'سجل الطلبات وإدارة الشحن' : 'Customer Orders & Fulfillment'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'ar'
                ? 'متابعة الطلبات، تحديث حالة التسليم، والتواصل الفوري مع العميلات عبر الواتساب بنقرة واحدة.'
                : 'Track orders, update fulfillment status, and reach out to customers directly via WhatsApp.'}
            </p>
          </div>

          {/* Search in Orders */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
            <input
              type="text"
              value={orderSearchQuery}
              onChange={(e) => setOrderSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'بحث برقم الطلب، الاسم، أو الهاتف...' : 'Search ID, name, or phone...'}
              className="w-full ps-10 pe-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
            {orderSearchQuery && (
              <button
                type="button"
                onClick={() => setOrderSearchQuery('')}
                className="absolute top-1/2 -translate-y-1/2 end-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Cloud Admin Auth Verification Banner */}
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isCloudAdminVerified
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/70 border-amber-200 text-amber-950'
          }`}
        >
          <div className="flex items-start gap-2.5 text-xs">
            <ShieldCheck
              className={`w-4 h-4 mt-0.5 shrink-0 ${isCloudAdminVerified ? 'text-emerald-600' : 'text-amber-600'}`}
            />
            <div className="space-y-0.5">
              <p className="font-extrabold">
                {isCloudAdminVerified
                  ? lang === 'ar'
                    ? `المزامنة السحابية مفعّلة (${firebaseAdminEmail})`
                    : `Cloud Sync Active (${firebaseAdminEmail})`
                  : lang === 'ar'
                    ? 'توثيق الجلسة السحابية لقراءة ومزامنة الطلبات المحمية'
                    : 'Verify Admin Google Session to Sync Protected Cloud Orders'}
              </p>
              <p className="text-[11px] opacity-80">
                {isCloudAdminVerified
                  ? lang === 'ar'
                    ? 'بيانات العميلات محمية بقواعد Firestore ولا تظهر إلا بعد التوثيق.'
                    : 'Customer PII is isolated via Firestore Rules to your verified Admin account.'
                  : lang === 'ar'
                    ? 'تم قفل قائمة الطلبات العامة لحماية خصوصية العميلات. سجّلي الدخول بحساب المالك المعتمد لجلب طلبات السحابة.'
                    : 'Public order listing is locked for privacy. Sign in with the authorized owner Google account to load live cloud orders.'}
              </p>
            </div>
          </div>
          {isCloudAdminVerified ? (
            <button
              type="button"
              onClick={async () => {
                setIsPublishingConfig(true);
                try {
                  const ok = await publishStorefrontToCloud();
                  if (ok) {
                    showToast(
                      lang === 'ar'
                        ? 'تم نشر ومزامنة كتالوج وإعدادات المتجر إلى السحابة لجميع الزوار!'
                        : 'Storefront catalog & settings published to cloud!'
                    );
                  }
                } catch (err) {
                  console.error('[AdminOrdersTab] publishStorefrontToCloud failed:', err);
                  showToast(lang === 'ar' ? 'تعذر النشر السحابي، حاول مرة أخرى.' : 'Cloud publish failed.');
                } finally {
                  setIsPublishingConfig(false);
                }
              }}
              disabled={isPublishingConfig || cloudConfigStatus === 'syncing'}
              className="min-h-[44px] px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer transition-all"
            >
              <RefreshCw
                className={`w-4 h-4 ${isPublishingConfig || cloudConfigStatus === 'syncing' ? 'animate-spin' : ''}`}
              />
              <span>
                {isPublishingConfig || cloudConfigStatus === 'syncing'
                  ? lang === 'ar'
                    ? 'جاري النشر...'
                    : 'Syncing...'
                  : lang === 'ar'
                    ? 'نشر ومزامنة المتجر الآن'
                    : 'Publish Storefront Sync'}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConnectCloudAdmin}
              disabled={isConnectingCloudAdmin}
              className="min-h-[44px] px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer transition-all"
            >
              <UserCheck className="w-4 h-4 text-amber-300" />
              <span>
                {isConnectingCloudAdmin
                  ? lang === 'ar'
                    ? 'جاري التوثيق...'
                    : 'Signing in...'
                  : lang === 'ar'
                    ? 'توثيق عبر Google'
                    : 'Connect Google Admin'}
              </span>
            </button>
          )}
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          {[
            { id: 'all', label: { ar: 'كافة الطلبات', en: 'All Orders' }, count: orders.length },
            {
              id: 'received',
              label: { ar: 'جديد (مستلم)', en: 'Received' },
              count: orders.filter((o) => o.status === 'received').length,
            },
            {
              id: 'processing',
              label: { ar: 'قيد التجهيز', en: 'Processing' },
              count: orders.filter((o) => o.status === 'processing').length,
            },
            {
              id: 'dispatched',
              label: { ar: 'مع المندوب', en: 'Dispatched' },
              count: orders.filter((o) => o.status === 'dispatched').length,
            },
            {
              id: 'delivered',
              label: { ar: 'تم التوصيل', en: 'Delivered' },
              count: orders.filter((o) => o.status === 'delivered').length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setOrderStatusFilter(tab.id as any)}
              className={`min-h-[44px] px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                orderStatusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              <span>{tab.label[lang]}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  orderStatusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              {lang === 'ar' ? 'لا توجد طلبات تطابق هذا البحث' : 'No orders found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {lang === 'ar'
                ? 'يمكنك تجربة تغيير خيارات التصفية أو إدخال عبارة بحث أخرى.'
                : 'Try adjusting your status filter or clearing search keywords.'}
            </p>
            {(orderSearchQuery || orderStatusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setOrderSearchQuery('');
                  setOrderStatusFilter('all');
                }}
                className="text-xs text-purple-700 hover:underline font-bold cursor-pointer"
              >
                {lang === 'ar' ? 'إعادة ضبط التصفية' : 'Reset filters'}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((o) => (
              <div
                key={o.id}
                className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                      #{o.id}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{o.customerName}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{o.date}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span className="font-mono font-medium" dir="ltr">
                      {o.phone}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>{lang === 'ar' ? `${o.items?.length || 1} منتجات` : `${o.items?.length || 1} items`}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-black text-slate-900 text-sm">{o.totalFormatted}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <a
                    href={getCustomerWhatsAppUrl(o.phone, o.customerName, o.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title={lang === 'ar' ? 'مراسلة العميلة عبر واتساب' : 'Chat via WhatsApp'}
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                  </a>

                  <select
                    value={o.status}
                    onChange={(e) => {
                      updateOrderStatus(o.id, e.target.value as any);
                      showToast(lang === 'ar' ? `تم تحديث حالة الطلب #${o.id}` : `Order #${o.id} status updated`);
                    }}
                    className={`h-10 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer focus:outline-none ${
                      o.status === 'delivered'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : o.status === 'dispatched'
                          ? 'bg-sky-50 text-sky-800 border-sky-300'
                          : o.status === 'processing'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-purple-50 text-purple-800 border-purple-300'
                    }`}
                  >
                    <option value="received">{lang === 'ar' ? 'جديد (مستلم)' : 'Received'}</option>
                    <option value="processing">{lang === 'ar' ? 'جاري التجهيز' : 'Processing'}</option>
                    <option value="dispatched">{lang === 'ar' ? 'مع المندوب' : 'Dispatched'}</option>
                    <option value="delivered">{lang === 'ar' ? 'تم التوصيل' : 'Delivered'}</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
