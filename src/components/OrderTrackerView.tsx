import React, { useState } from 'react';
import { 
  Search, CheckCircle2, Clock, Truck, Package, MapPin, 
  Phone, Calendar, AlertCircle, ArrowLeft, ArrowRight 
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

export const OrderTrackerView: React.FC = () => {
  const { lang, orders, setCurrentRoute, navigateTo } = useCommerce();
  const isRtl = lang === 'ar';
  
  const [searchCode, setSearchCode] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(() => orders[0] || null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    const found = orders.find(
      (o) =>
        o.trackingCode.toLowerCase() === searchCode.trim().toLowerCase() ||
        o.id.toLowerCase() === searchCode.trim().toLowerCase()
    );
    if (found) {
      setSelectedOrder(found);
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
            onClick={() => navigateTo('store')}
            className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#5A3E7A] bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm transition-colors min-h-[44px]"
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
              ? 'أدخل رقم التتبع (مثل TRK-98241) أو رقم الطلب لمعرفة خط سير شحنتك لحظة بلحظة.'
              : 'Enter your tracking code or order ID to view current dispatch progress.'}
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
              placeholder={lang === 'ar' ? 'أدخل رقم التتبع هنا...' : 'Enter tracking code...'}
              className="w-full ps-11 pe-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5A3E7A] shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#5A3E7A] hover:bg-[#483162] text-white rounded-2xl text-sm font-bold shadow-md transition-colors min-h-[48px]"
          >
            {lang === 'ar' ? 'بحث' : 'Track'}
          </button>
        </form>

        {/* Recent Orders Pill Selector */}
        {orders.length > 0 && (
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-medium">{lang === 'ar' ? 'طلبات سريعة للتجربة:' : 'Quick demo orders:'}</span>
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => setSelectedOrder(o)}
                className={`px-3 py-1 rounded-full font-semibold border transition-all ${
                  selectedOrder?.id === o.id
                    ? 'bg-[#5A3E7A] text-white border-[#5A3E7A]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {o.trackingCode} ({o.customerName})
              </button>
            ))}
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
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
                    <span>{lang === 'ar' ? 'الإجمالي عند الاستلام:' : 'Total due on delivery:'}</span>
                    <span className="text-[#5A3E7A]">{selectedOrder.totalFormatted}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="py-12 text-center bg-white rounded-3xl border border-slate-200 p-6">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-600">{lang === 'ar' ? 'لم يتم العثور على شحنة تطابق رقم التتبع المدخل.' : 'No shipment matches this tracking code.'}</p>
          </div>
        )}

      </div>
    </div>
  );
};
