import React from 'react';
import { 
  CheckCircle2, Copy, MessageSquare, ArrowLeft, ArrowRight, 
  Package, MapPin, Phone, User, Calendar, ExternalLink, Sparkles, X, ShoppingBag 
} from 'lucide-react';
import { useCommerce, OrderRecord } from '../context/CommerceContext';

interface OrderSuccessModalProps {
  order: OrderRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, isOpen, onClose }) => {
  const { lang, activeData, navigateTo, showToast } = useCommerce();
  const isRtl = lang === 'ar';

  if (!isOpen || !order) return null;

  const handleCopyTracking = () => {
    try {
      navigator.clipboard.writeText(order.trackingCode);
      showToast(lang === 'ar' ? 'تم نسخ رمز التتبع بنجاح!' : 'Tracking code copied!');
    } catch {
      showToast(lang === 'ar' ? `رمز التتبع: ${order.trackingCode}` : `Tracking: ${order.trackingCode}`);
    }
  };

  const handleWhatsAppConfirmation = () => {
    const text = lang === 'ar'
      ? `مرحباً سو بيوتي، قمت بطلب جديد عبر المتجر.\nرقم الطلب: ${order.id}\nرمز التتبع: ${order.trackingCode}\nالعميل: ${order.customerName}\nالإجمالي: ${order.totalFormatted}\nأرجو تأكيد تجهيز الشحنة!`
      : `Hello So Beauty, I just placed an order!\nOrder ID: ${order.id}\nTracking: ${order.trackingCode}\nCustomer: ${order.customerName}\nTotal: ${order.totalFormatted}\nPlease confirm shipment!`;
    window.open(`https://wa.me/${activeData.contactInfo.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 relative"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner with Close Button */}
        <div className="bg-gradient-to-r from-[#5A3E7A] via-[#483162] to-[#2E1840] text-white p-6 text-center space-y-3 relative">
          {/* Close (X) Button */}
          <button
            onClick={onClose}
            className="absolute top-4 end-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all border border-white/20 min-h-[36px] min-w-[36px]"
            title={lang === 'ar' ? 'إغلاق النافذة والعودة' : 'Close'}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center border border-white/30 text-emerald-300 shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/30 mb-1">
              <Sparkles className="w-3 h-3" />
              {lang === 'ar' ? 'تم استلام طلبكِ بنجاح' : 'Order Successfully Placed'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {lang === 'ar' ? 'شكراً لثقتكِ في سو بيوتي!' : 'Thank You for Shopping at So Beauty!'}
            </h2>
            <p className="text-xs text-purple-200/90 mt-1">
              {lang === 'ar' 
                ? 'فريقنا بدأ بتجهيز عنايتكِ الفاخرة بأعلى معايير النقاء والتغليف الآمن.' 
                : 'Our team is preparing your botanical routine with utmost purity and care.'}
            </p>
          </div>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-start text-xs text-slate-600">
          
          {/* Tracking & Order IDs Card */}
          <div className="bg-purple-50/70 rounded-2xl p-4 border border-purple-100/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {lang === 'ar' ? 'رقم الفاتورة والطلب' : 'Order ID'}
                </span>
                <span className="font-mono font-black text-sm text-[#5A3E7A]">
                  {order.id}
                </span>
              </div>
              <div className="text-end">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {lang === 'ar' ? 'تاريخ الطلب' : 'Date'}
                </span>
                <span className="font-semibold text-slate-700">
                  {order.date}
                </span>
              </div>
            </div>

            {/* Tracking Code Copy Box */}
            <div className="pt-2 border-t border-purple-100 flex items-center justify-between bg-white p-2.5 rounded-xl border">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">
                  {lang === 'ar' ? 'رمز التتبع المباشر للشحنة' : 'Live Tracking Code'}
                </span>
                <span className="font-mono font-black text-sm text-slate-900 tracking-wider">
                  {order.trackingCode}
                </span>
              </div>
              <button
                onClick={handleCopyTracking}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-[#5A3E7A] font-bold text-[11px] transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'نسخ' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Delivery & Customer Details */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5">
            <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#5A3E7A]" />
              <span>{lang === 'ar' ? 'بيانات التوصيل المستلم' : 'Recipient Details'}</span>
            </h3>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{lang === 'ar' ? 'الاسم:' : 'Name:'}</span>
                <span className="font-bold text-slate-900">{order.customerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{lang === 'ar' ? 'الهاتف:' : 'Phone:'}</span>
                <span className="font-mono font-bold text-slate-900" dir="ltr">{order.phone}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-slate-500 shrink-0">{lang === 'ar' ? 'العنوان:' : 'Address:'}</span>
                <span className="font-medium text-slate-800 text-end">{order.address}</span>
              </div>
            </div>
          </div>

          {/* Ordered Items Summary */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-[#5A3E7A]" />
              <span>{lang === 'ar' ? 'المنتجات المطلوبة' : 'Items Ordered'}</span>
            </h3>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-3 bg-slate-50/50">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block">{item.productName}</span>
                    <span className="text-[11px] text-slate-500">{lang === 'ar' ? `الكمية: ${item.quantity}` : `Qty: ${item.quantity}`}</span>
                  </div>
                  <span className="font-extrabold text-slate-900">{item.price}</span>
                </div>
              ))}
              <div className="pt-3 flex items-center justify-between text-sm font-black text-slate-900">
                <span>{lang === 'ar' ? 'الإجمالي المسدد:' : 'Total Amount:'}</span>
                <span className="text-[#5A3E7A] text-base">{order.totalFormatted}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col gap-2.5">
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={handleWhatsAppConfirmation}
              className="w-full sm:flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تأكيد الشحن فوراً على واتساب' : 'Confirm via WhatsApp'}</span>
            </button>
            
            <button
              onClick={() => {
                onClose();
                navigateTo('tracker');
              }}
              className="w-full sm:w-auto py-3 px-5 bg-purple-50 hover:bg-purple-100 text-[#5A3E7A] font-bold rounded-2xl border border-purple-200 transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <span>{lang === 'ar' ? 'تتبع الشحنة الآن' : 'Track Order'}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              navigateTo('store');
            }}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-2xl border border-slate-200 transition-colors flex items-center justify-center gap-2 min-h-[44px] text-xs sm:text-sm"
          >
            <ShoppingBag className="w-4 h-4 text-[#5A3E7A]" />
            <span>{lang === 'ar' ? 'متابعة التسوق والعودة للمتجر' : 'Continue Shopping & Back to Store'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
