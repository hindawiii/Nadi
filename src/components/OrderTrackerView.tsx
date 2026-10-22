import React, { useState } from 'react';
import { 
  Search, CheckCircle2, Clock, Truck, Package, MapPin, 
  Phone, Calendar, AlertCircle, ArrowLeft, ArrowRight, MessageSquare, Copy 
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

export const OrderTrackerView: React.FC = () => {
  const { lang, orders, setCurrentRoute, navigateTo, activeData, showToast } = useCommerce();
  const isRtl = lang === 'ar';
  
  const [searchCode, setSearchCode] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(() => {
    // Check if customer placed an order in this browser session
    try {
      const myTracking = localStorage.getItem('luxe_my_last_tracking');
      if (myTracking) {
        return orders.find(o => o.trackingCode.toLowerCase() === myTracking.toLowerCase()) || null;
      }
    } catch (_) {}
    return null;
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [searchNotFound, setSearchNotFound] = useState(false);

  // Retrieve customer's own last tracking code if available
  const myLastTracking = typeof window !== 'undefined' ? localStorage.getItem('luxe_my_last_tracking') : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const query = searchCode.trim().toLowerCase();
    if (!query) return;

    const cleanQuery = query.replace(/[^a-z0-9]/g, '');
    const cleanDigits = query.replace(/\D/g, '');
    // Extract core subscriber digits (last 7-8 digits) to match regardless of international or local prefix
    const queryCoreDigits = cleanDigits.length >= 7 ? cleanDigits.slice(-8) : cleanDigits;

    const found = orders.find((o) => {
      const matchTracking = o.trackingCode.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanQuery;
      const matchId = o.id.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanQuery;
      
      const orderDigits = o.phone.replace(/\D/g, '');
      const orderCoreDigits = orderDigits.length >= 7 ? orderDigits.slice(-8) : orderDigits;

      const matchDirectPhone = cleanDigits.length >= 6 && orderDigits.includes(cleanDigits);
      const matchReversePhone = cleanDigits.length >= 6 && cleanDigits.includes(orderDigits);
      const matchCorePhone = queryCoreDigits.length >= 7 && (orderDigits.includes(queryCoreDigits) || orderCoreDigits === queryCoreDigits);

      return matchTracking || matchId || matchDirectPhone || matchReversePhone || matchCorePhone;
    });

    if (found) {
      setSelectedOrder(found);
      setSearchNotFound(false);
      showToast(lang === 'ar' ? `تم العثور على الشحنة #${found.id}` : `Shipment #${found.id} found`);
    } else {
      setSelectedOrder(null);
      setSearchNotFound(true);
      showToast(lang === 'ar' ? 'لم يتم العثور على شحنة تطابق البحث' : 'No shipment found matching query');
    }
  };

  const steps = [
    { key: 'received', label: { ar: 'تم استلام الطلب', en: 'Order Placed' }, icon: Package },
    { key: 'processing', label: { ar: 'جاري التجهيز والتحضير', en: 'Processing & Packaged' }, icon: Clock },
    { key: 'dispatched', label: { ar: 'مع مندوب التوصيل', en: 'With Courier / Dispatched' }, icon: Truck },
    { key: 'delivered', label: { ar: 'تم التوصيل بنجاح', en: 'Delivered' }, icon: CheckCircle2 },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'received': return 0;
      case 'processing': return 1;
      case 'dispatched': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const activeIndex = selectedOrder ? getStepIndex(selectedOrder.status) : 0;

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigateTo('store')}
            className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#5A3E7A] bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm transition-all min-h-[44px] cursor-pointer active:scale-95"
          >
            {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{lang === 'ar' ? 'الرجوع للمتجر' : 'Back to Store'}</span>
          </button>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
            {lang === 'ar' ? 'نظام التتبع الحي المباشر' : 'Live Delivery Tracker'}
          </span>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {lang === 'ar' ? 'تتبع حالة شحنتك المباشرة' : 'Track Your Order In Real-Time'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            {lang === 'ar'
              ? 'أدخلي رقم التتبع الخاص بكِ (مثل TRK-98241) أو رقم الطلب أو رقم الهاتف المسجل لمعرفة خط سير شحنتكِ.'
              : 'Enter your tracking code, order ID, or registered phone number to view real-time delivery status.'}
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder={lang === 'ar' ? 'رقم التتبع (TRK-...) أو رقم الطلب أو الهاتف...' : 'Tracking code, order ID, or phone...'}
              className="w-full ps-11 pe-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5A3E7A] shadow-sm min-h-[48px]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#5A3E7A] hover:bg-[#483162] text-white rounded-2xl text-sm font-bold shadow-md transition-colors min-h-[48px] cursor-pointer active:scale-95 shrink-0"
          >
            {lang === 'ar' ? 'بحث' : 'Track'}
          </button>
        </form>

        {/* Quick Shortcut for Customer's OWN Last Order Only */}
        {myLastTracking && (
          <div className="flex items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">
              {lang === 'ar' ? 'طلبكِ المسجل بهذا الجهاز:' : 'Your recent order on this device:'}
            </span>
            <button
              type="button"
              onClick={() => {
                setSearchCode(myLastTracking);
                const found = orders.find(o => o.trackingCode.toLowerCase() === myLastTracking.toLowerCase());
                if (found) {
                  setSelectedOrder(found);
                  setSearchNotFound(false);
                }
              }}
              className="px-3 py-1 rounded-full font-bold bg-purple-50 text-[#5A3E7A] border border-purple-200 hover:bg-purple-100 transition-colors"
            >
              {myLastTracking}
            </button>
          </div>
        )}

        {/* Selected Order Card */}
        {selectedOrder ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
            
            {/* Order meta bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">{lang === 'ar' ? 'رقم التتبع السريع' : 'Tracking Code'}</span>
                <h3 className="text-xl font-extrabold text-[#5A3E7A] font-mono">{selectedOrder.trackingCode}</h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedOrder.date}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedOrder.phone}</span>
                </div>
              </div>
            </div>

            {/* ANIMATED TIMELINE */}
            <div className="relative py-4">
              {/* Progress Line */}
              <div className="absolute top-1/2 start-0 end-0 -translate-y-1/2 h-1.5 bg-slate-100 rounded-full z-0 hidden sm:block">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
                />
              </div>

              {/* Steps Nodes */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = idx <= activeIndex;
                  const isCurrent = idx === activeIndex;

                  return (
                    <div key={step.key} className="flex sm:flex-col items-center gap-3 sm:text-center">
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300 ${
                          isDone
                            ? 'bg-[#5A3E7A] border-[#5A3E7A] text-white shadow-md shadow-purple-200'
                            : 'bg-white border-slate-200 text-slate-400'
                        } ${isCurrent ? 'ring-4 ring-purple-100 scale-110' : ''}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className={`text-xs sm:text-sm font-bold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.label[lang]}
                        </h4>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {isDone ? (isCurrent ? (lang === 'ar' ? 'الحالة الحالية' : 'In Progress') : (lang === 'ar' ? 'مكتمل' : 'Completed')) : (lang === 'ar' ? 'في الانتظار' : 'Pending')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Details & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              
              {/* Delivery Details */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <span>{lang === 'ar' ? 'عنوان وتفاصيل المستلم:' : 'Recipient & Address:'}</span>
                </h4>
                <p className="text-sm font-bold text-slate-800">{selectedOrder.customerName}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedOrder.address}</p>
              </div>

              {/* Items in order */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {lang === 'ar' ? 'المنتجات المطلوبة:' : 'Ordered Items:'}
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-slate-700 font-medium">
                        {it.quantity}x {it.productName}
                      </span>
                      <span className="text-slate-900 font-bold">{it.price}</span>
                    </div>
                  ))}
                  {selectedOrder.promoCode && (
                    <div className="flex justify-between text-xs text-emerald-600 font-bold">
                      <span>{lang === 'ar' ? 'كود الخصم المطبق:' : 'Applied Promo:'}</span>
                      <span className="bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">{selectedOrder.promoCode}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
                    <span>{lang === 'ar' ? 'الإجمالي عند الاستلام:' : 'Total due on delivery:'}</span>
                    <span className="text-[#5A3E7A]">{selectedOrder.totalFormatted}</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Live Support & Contact Helper */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={`https://wa.me/${activeData.contactInfo.whatsapp}?text=${encodeURIComponent(
                    lang === 'ar'
                      ? `مرحباً ${activeData.storeName.ar}، أستفسر عن شحنتي رقم (${selectedOrder.id})، رمز التتبع: (${selectedOrder.trackingCode}). العميل: ${selectedOrder.customerName}`
                      : `Hello ${activeData.storeName.en}, I have an inquiry about my order (${selectedOrder.id}), tracking: (${selectedOrder.trackingCode}). Customer: ${selectedOrder.customerName}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md min-h-[44px] text-xs cursor-pointer active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'استفسار فوري عبر واتساب المتجر' : 'Instant Inquiry on WhatsApp'}</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    try {
                      navigator.clipboard.writeText(selectedOrder.trackingCode);
                      showToast(lang === 'ar' ? 'تم نسخ رمز التتبع بنجاح!' : 'Tracking code copied!');
                    } catch {
                      showToast(selectedOrder.trackingCode);
                    }
                  }}
                  className="w-full sm:w-auto py-3 px-4 bg-purple-50 hover:bg-purple-100 text-[#5A3E7A] font-bold rounded-2xl border border-purple-200 transition-colors flex items-center justify-center gap-1.5 min-h-[44px] text-xs cursor-pointer active:scale-95"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'نسخ رمز التتبع' : 'Copy Code'}</span>
                </button>
              </div>

            </div>

          </div>
        ) : hasSearched ? (
          <div className="py-12 text-center bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">{lang === 'ar' ? 'لم يتم العثور على شحنة تطابق البحث' : 'No shipment matches your search'}</p>
            <p className="text-xs text-slate-400">{lang === 'ar' ? 'يرجى التأكد من كتابة رمز التتبع، رقم الطلب، أو رقم هاتفكِ المسجل بدقة.' : 'Please verify the tracking code, order ID, or phone number accurately.'}</p>
          </div>
        ) : (
          <div className="py-14 text-center bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-3 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#5A3E7A] flex items-center justify-center mx-auto mb-2 border border-purple-100">
              <Package className="w-7 h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              {lang === 'ar' ? 'بانتظار استعلامكِ عن الشحنة' : 'Ready to Track Your Order'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              {lang === 'ar' 
                ? 'أدخلي رمز التتبع المستلم أو رقم الجوال في شريط البحث أعلاه لعرض الجدول الزمني للشحن وحالة التسليم الفورية.' 
                : 'Enter your tracking code or phone number above to view real-time transit timeline and courier updates.'}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
