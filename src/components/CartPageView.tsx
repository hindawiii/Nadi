import React, { useState } from 'react';
import { 
  ShoppingBag, Trash2, ArrowLeft, ArrowRight, ShieldCheck, 
  Truck, Tag, Check, AlertCircle, Sparkles, Plus, Minus, CreditCard, 
  Banknote, PhoneCall 
} from 'lucide-react';
import { useCommerce, OrderRecord } from '../context/CommerceContext';
import { OrderSuccessModal } from './OrderSuccessModal';

export const CartPageView: React.FC = () => {
  const { 
    lang, currency, cart, removeFromCart, updateCartQty, 
    clearCart, cartTotalUSD, convertPrice, placeOrder, 
    navigateTo, activeData, showToast 
  } = useCommerce();

  const isRtl = lang === 'ar';

  // Modal confirmation state
  const [createdOrder, setCreatedOrder] = useState<OrderRecord | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Promo code state
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscountRate, setAppliedDiscountRate] = useState(0); // 0.10 for 10%
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Delivery destination
  const [selectedCity, setSelectedCity] = useState(currency === 'SAR' ? 'الرياض' : 'الخرطوم');

  // Checkout inputs
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bankak' | 'card'>('cod');
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string; address?: string }>({});

  // Free shipping threshold: $15 USD
  const freeShippingThresholdUSD = 15;
  const isFreeShipping = cartTotalUSD >= freeShippingThresholdUSD;
  const remainingForFreeShippingUSD = Math.max(0, freeShippingThresholdUSD - cartTotalUSD);
  const remainingText = convertPrice(remainingForFreeShippingUSD).text;
  const progressPercent = Math.min(100, Math.round((cartTotalUSD / freeShippingThresholdUSD) * 100));

  // City options
  const cityOptions = [
    { name: { ar: 'الخرطوم', en: 'Khartoum' }, est: { ar: '24-48 ساعة', en: '24-48 hours' }, feeUSD: 1.5 },
    { name: { ar: 'أم درمان', en: 'Omdurman' }, est: { ar: '24-48 ساعة', en: '24-48 hours' }, feeUSD: 1.5 },
    { name: { ar: 'بحري', en: 'Bahri' }, est: { ar: '24-48 ساعة', en: '24-48 hours' }, feeUSD: 1.5 },
    { name: { ar: 'بورتسودان', en: 'Port Sudan' }, est: { ar: '2-3 أيام', en: '2-3 days' }, feeUSD: 2.5 },
    { name: { ar: 'ود مدني', en: 'Wad Madani' }, est: { ar: '2-3 أيام', en: '2-3 days' }, feeUSD: 2.0 },
    { name: { ar: 'كسلا والقضارف', en: 'Kassala & Gedaref' }, est: { ar: '3-4 أيام', en: '3-4 days' }, feeUSD: 3.0 },
    { name: { ar: 'الرياض وجدة (شحن دولي)', en: 'Riyadh & Jeddah (GCC)' }, est: { ar: '3-5 أيام عمل', en: '3-5 business days' }, feeUSD: 4.5 },
    { name: { ar: 'دبي وأبوظبي', en: 'Dubai & Abu Dhabi' }, est: { ar: '3-5 أيام عمل', en: '3-5 business days' }, feeUSD: 4.5 },
    { name: { ar: 'القاهرة', en: 'Cairo' }, est: { ar: '4-6 أيام', en: '4-6 days' }, feeUSD: 4.0 },
  ];

  const currentCityObj = cityOptions.find(c => c.name.ar === selectedCity || c.name.en === selectedCity) || cityOptions[0];
  const shippingFeeUSD = isFreeShipping ? 0 : currentCityObj.feeUSD;

  // Price calculations
  const subtotalObj = convertPrice(cartTotalUSD);
  const discountAmountUSD = cartTotalUSD * appliedDiscountRate;
  const discountObj = convertPrice(discountAmountUSD);
  const finalTotalUSD = Math.max(0, cartTotalUSD - discountAmountUSD + shippingFeeUSD);
  const finalTotalObj = convertPrice(finalTotalUSD);
  const shippingFeeObj = convertPrice(shippingFeeUSD);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoCode.trim().toUpperCase();
    if (!cleanCode) return;

    if (cleanCode === 'BEAUTY10' || cleanCode === 'SOBEAUTY10') {
      setAppliedDiscountRate(0.10);
      setPromoMessage({ text: lang === 'ar' ? 'تم تطبيق كود الخصم بنجاح (-10%) 🎉' : 'Coupon applied successfully (-10%) 🎉', isError: false });
      showToast(lang === 'ar' ? 'تم تفعيل خصم 10%!' : '10% discount applied!');
    } else if (cleanCode === 'SOBEAUTY' || cleanCode === 'VIP20') {
      setAppliedDiscountRate(0.15);
      setPromoMessage({ text: lang === 'ar' ? 'تم تطبيق كود كبار العميلات (-15%) ✨' : 'VIP Coupon applied (-15%) ✨', isError: false });
      showToast(lang === 'ar' ? 'تم تفعيل خصم كبار العميلات 15%!' : 'VIP 15% discount applied!');
    } else {
      setPromoMessage({ text: lang === 'ar' ? 'عذراً، هذا الكود غير صالح أو منتهي الصلاحية' : 'Invalid or expired promo code', isError: true });
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; phone?: string; address?: string } = {};

    if (!customerName.trim()) {
      errors.name = lang === 'ar' ? 'يرجى كتابة الاسم الكامل' : 'Please enter your full name';
    }
    if (!phone.trim()) {
      errors.phone = lang === 'ar' ? 'يرجى إدخال رقم الهاتف أو الواتساب' : 'Phone/WhatsApp number is required';
    }
    if (!address.trim()) {
      errors.address = lang === 'ar' ? 'يرجى إدخال العنوان بالتفصيل' : 'Detailed address is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Place the order
    const fullAddress = `${selectedCity} - ${address} [طريقة الدفع: ${paymentMethod.toUpperCase()}]`;
    const newPlacedOrder = placeOrder({
      name: customerName,
      phone,
      address: fullAddress
    });

    // Show luxury order confirmation modal
    setCreatedOrder(newPlacedOrder);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6">
          <button 
            onClick={() => navigateTo('store')} 
            className="hover:text-[#5A3E7A] transition-colors font-medium flex items-center gap-1"
          >
            <span>{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
            {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
          <span className="text-slate-300">/</span>
          <span className="font-bold text-[#5A3E7A]">
            {lang === 'ar' ? 'سلة المشتريات وإتمام الطلب' : 'Shopping Bag & Checkout'}
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-[#5A3E7A]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {lang === 'ar' ? 'سلة المشتريات الفاخرة' : 'My Shopping Bag'}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'ar' ? 'راجعي منتجاتك المختارة وأكملي طلبك بكل سهولة وأمان.' : 'Review your selected items and complete your order with ease.'}
              </p>
            </div>
          </div>

          {cart.length > 0 && (
            <div className="flex items-center gap-3 self-start sm:self-center">
              <button
                onClick={() => navigateTo('store')}
                className="text-xs font-bold text-[#5A3E7A] hover:text-[#483162] bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 transition-colors flex items-center gap-1.5"
              >
                {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                <span>{lang === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}</span>
              </button>

              <button
                onClick={clearCart}
                className="text-xs font-bold text-slate-500 hover:text-rose-500 transition-colors flex items-center gap-1.5 px-2 py-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إفراغ السلة' : 'Clear Bag'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Empty Bag State */}
        {cart.length === 0 ? (
          <div className="py-20 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#5A3E7A] shadow-inner mb-6">
              <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">
              {lang === 'ar' ? 'سلة التسوق فارغة حالياً' : 'Your Bag is Empty'}
            </h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              {lang === 'ar' 
                ? 'لم تقومي بإضافة أي منتج بعد. استكشفي مجموعاتنا للعناية الفائقة، وحمض الهيالورونيك والسيرومات الطبيعية.' 
                : 'You have no items in your shopping bag. Explore our natural botanicals and active skincare.'}
            </p>
            <button
              onClick={() => navigateTo('store')}
              className="px-8 py-3.5 bg-[#5A3E7A] hover:bg-[#483162] text-white text-sm font-extrabold rounded-full shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2 min-h-[48px]"
            >
              <span>{lang === 'ar' ? 'تصفح منتجات المتجر' : 'Browse Products'}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            
            {/* Free Shipping Progress Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 mb-2">
                <div className="flex items-center gap-2">
                  <Truck className={`w-4 h-4 ${isFreeShipping ? 'text-emerald-500' : 'text-[#5A3E7A]'}`} />
                  <span>
                    {isFreeShipping 
                      ? (lang === 'ar' ? '🎉 مبروك! حصلتِ على توصيل مجاني سريع لكامل طلبيتك' : '🎉 Congratulations! You unlocked Free Delivery!')
                      : (lang === 'ar' ? `أضيفي منتجات بقيمة ${remainingText} إضافية للحصول على شحن مجاني!` : `Add ${remainingText} more to unlock Free Delivery!`)}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-semibold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${isFreeShipping ? 'bg-emerald-500' : 'bg-gradient-to-r from-[#5A3E7A] to-purple-400'}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Layout: Main Items Column + Summary Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Cart Items List */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-sm space-y-4">
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-100">
                    {lang === 'ar' ? `المنتجات المختارة (${cart.length})` : `Selected Items (${cart.length})`}
                  </h2>

                  <div className="divide-y divide-slate-100">
                    {cart.map((item) => {
                      const itemTotal = convertPrice(item.product.basePriceUSD * item.quantity);
                      const unitPrice = convertPrice(item.product.basePriceUSD);

                      return (
                        <div 
                          key={item.product.id}
                          className="py-4 first:pt-2 last:pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <img 
                              src={item.product.images[0]} 
                              alt={item.product.name[lang]} 
                              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 bg-slate-50 border border-slate-100"
                            />
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-[#5A3E7A] bg-purple-50 px-2 py-0.5 rounded-full">
                                {item.product.category[lang]}
                              </span>
                              <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                                {item.product.name[lang]}
                              </h3>
                              <p className="text-xs text-slate-500">
                                {lang === 'ar' ? `سعر القطعة: ${unitPrice.text}` : `Unit: ${unitPrice.text}`}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                            {/* Quantity Stepper */}
                            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-inner">
                              <button
                                onClick={() => updateCartQty(item.product.id, -1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-600 font-bold transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-9 text-center text-xs font-bold text-slate-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartQty(item.product.id, 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-600 font-bold transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Item Total Price */}
                            <div className="text-end min-w-[90px]">
                              <p className="text-sm font-black text-slate-900">
                                {itemTotal.text}
                              </p>
                            </div>

                            {/* Delete Button */}
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-[#5A3E7A] shrink-0" />
                    <div className="text-start">
                      <p className="text-xs font-bold text-slate-900">{lang === 'ar' ? 'أصلي 100%' : '100% Authentic'}</p>
                      <p className="text-[11px] text-slate-400">{lang === 'ar' ? 'مرخص طبياً ومعتمد' : 'Medical Grade'}</p>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <Truck className="w-6 h-6 text-[#5A3E7A] shrink-0" />
                    <div className="text-start">
                      <p className="text-xs font-bold text-slate-900">{lang === 'ar' ? 'دفع عند الاستلام' : 'Cash on Delivery'}</p>
                      <p className="text-[11px] text-slate-400">{lang === 'ar' ? 'فحص قبل الدفع' : 'Inspect package'}</p>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-[#5A3E7A] shrink-0" />
                    <div className="text-start">
                      <p className="text-xs font-bold text-slate-900">{lang === 'ar' ? 'ضمان 14 يوماً' : '14 Days Guarantee'}</p>
                      <p className="text-[11px] text-slate-400">{lang === 'ar' ? 'استبدال واسترجاع ناعم' : 'Hassle-Free'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary & Checkout Form */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Summary Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-5">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
                    {lang === 'ar' ? 'ملخص الفاتورة' : 'Order Summary'}
                  </h2>

                  {/* Promo Code Input */}
                  <form onSubmit={handleApplyPromo} className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#5A3E7A]" />
                      <span>{lang === 'ar' ? 'هل لديكِ كود خصم أو قسيمة؟' : 'Have a Promo Code?'}</span>
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="BEAUTY10 أو SOBEAUTY"
                        className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-[#5A3E7A]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-slate-900 hover:bg-[#5A3E7A] text-white text-xs font-bold rounded-xl transition-colors min-h-[44px]"
                      >
                        {lang === 'ar' ? 'تطبيق' : 'Apply'}
                      </button>
                    </div>
                    {promoMessage && (
                      <p className={`text-[11px] font-bold ${promoMessage.isError ? 'text-rose-500' : 'text-emerald-600'}`}>
                        {promoMessage.text}
                      </p>
                    )}
                  </form>

                  {/* Destination City Selection */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#5A3E7A]" />
                        <span>{lang === 'ar' ? 'مدينة ومكان التوصيل:' : 'Delivery Destination:'}</span>
                      </span>
                      <span className="text-[11px] text-purple-700 font-bold">
                        {currentCityObj.est[lang]}
                      </span>
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#5A3E7A]"
                    >
                      {cityOptions.map((c) => (
                        <option key={c.name.ar} value={c.name.ar}>
                          {c.name[lang]} — ({c.est[lang]})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>{lang === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                      <span className="font-bold text-slate-900">{subtotalObj.text}</span>
                    </div>

                    {appliedDiscountRate > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>{lang === 'ar' ? `الخصم المطبق (${appliedDiscountRate * 100}%):` : `Discount (${appliedDiscountRate * 100}%):`}</span>
                        <span>-{discountObj.text}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-600">
                      <span>{lang === 'ar' ? 'رسوم التوصيل:' : 'Shipping Fee:'}</span>
                      <span className={`font-bold ${isFreeShipping ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {isFreeShipping ? (lang === 'ar' ? 'مجاني 🚚' : 'FREE') : shippingFeeObj.text}
                      </span>
                    </div>

                    <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                      <span>{lang === 'ar' ? 'الإجمالي النهائي:' : 'Grand Total:'}</span>
                      <span className="text-xl text-[#5A3E7A]">{finalTotalObj.text}</span>
                    </div>
                  </div>
                </div>

                {/* Instant Checkout Form */}
                <form 
                  onSubmit={handleCheckoutSubmit}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4"
                >
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                    {lang === 'ar' ? 'بيانات التوصيل الفوري' : 'Express Delivery Details'}
                  </h3>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      {lang === 'ar' ? 'الاسم الكامل للعميل *' : 'Full Name *'}
                    </label>
                    <input 
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={lang === 'ar' ? 'مثال: سارة محمد المنصور' : 'e.g. Sarah Miller'}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A3E7A]"
                    />
                    {formErrors.name && <p className="text-[11px] text-rose-500">{formErrors.name}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      {lang === 'ar' ? 'رقم الهاتف / الواتساب للتواصل *' : 'Phone / WhatsApp *'}
                    </label>
                    <input 
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={lang === 'ar' ? '0912345678 أو 0501234567' : '+1 234 567 8900'}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A3E7A]"
                    />
                    {formErrors.phone && <p className="text-[11px] text-rose-500">{formErrors.phone}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      {lang === 'ar' ? 'العنوان التفصيلي (الحي، الشارع، المعلم) *' : 'Detailed Address (Street, Landmark) *'}
                    </label>
                    <textarea 
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={lang === 'ar' ? 'مثال: حي الرياض، شارع الستين، قرب كافيه...' : 'e.g. Al-Riyadh district, 60th street...'}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A3E7A]"
                    />
                    {formErrors.address && <p className="text-[11px] text-rose-500">{formErrors.address}</p>}
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-slate-700">
                      {lang === 'ar' ? 'طريقة الدفع المفضلة:' : 'Payment Method:'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all min-h-[56px] ${paymentMethod === 'cod' ? 'border-[#5A3E7A] bg-purple-50 text-[#5A3E7A] shadow-xs' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                      >
                        <Banknote className="w-5 h-5" />
                        <span>{lang === 'ar' ? 'دفع عند الاستلام' : 'Cash on Delivery'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bankak')}
                        className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all min-h-[56px] ${paymentMethod === 'bankak' ? 'border-[#5A3E7A] bg-purple-50 text-[#5A3E7A] shadow-xs' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                      >
                        <CreditCard className="w-5 h-5" />
                        <span>{lang === 'ar' ? 'بنكك / تحويل فوري' : 'Bankak Transfer'}</span>
                      </button>
                    </div>
                  </div>

                  {paymentMethod === 'bankak' && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
                      <p className="font-bold">{lang === 'ar' ? `حساب بنكك المعتمد لـ ${activeData.storeName.ar}:` : `Bankak Account Details (${activeData.storeName.en}):`}</p>
                      <p className="font-mono font-black text-xs text-slate-900">2891044 ({activeData.storeName.ar} للتجارة)</p>
                      <p>{lang === 'ar' ? 'يرجى إرسال الإشعار لمندوب التوصيل أو عبر الواتساب فور إتمام الطلب.' : 'Please send the transfer receipt to our WhatsApp after placing.'}</p>
                    </div>
                  )}

                  {/* Final Submit CTA */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#5A3E7A] hover:bg-[#483162] text-white rounded-2xl font-extrabold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 min-h-[50px] mt-4"
                  >
                    <span>{lang === 'ar' ? `تأكيد وإرسال الطلب (${finalTotalObj.text})` : `Confirm & Place Order (${finalTotalObj.text})`}</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>

              </div>
            </div>
          </div>
        )}

      </div>

      {/* Luxury Order Success Modal */}
      <OrderSuccessModal
        order={createdOrder}
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
};
