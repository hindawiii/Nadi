import React, { useEffect, useRef, useState } from 'react';
import { 
  Trash2, ArrowLeft, ArrowRight, ShieldCheck, 
  Truck, Tag, Check, AlertCircle, RotateCcw, Plus, Minus, CreditCard, 
  Banknote, PhoneCall, Copy 
} from 'lucide-react';
import { StoreCartIcon } from './common/StoreCartIcon';
import { useCommerce, OrderRecord } from '../context/CommerceContext';
import { OrderSuccessModal } from './OrderSuccessModal';
import { SmartPhoneInput } from './SmartInputField';
import {
  CITY_SHIPPING_OPTIONS,
  FREE_SHIPPING_THRESHOLD_USD,
  computeAuthoritativeOrderSummary,
  resolvePromoDiscountRate,
  resolveShippingOption,
} from '../lib/checkoutIntegrity';
import { hairStylingDevices } from './HairDevicesSpotlight';
import { getCleanCategoryLabel } from '../lib/productCollections';
import {
  clearSavedDeliveryProfile,
  loadSavedDeliveryProfile,
  pickFreeShippingUpsellProduct,
  saveDeliveryProfile,
} from '../lib/checkoutAssist';

const getDefaultCityForCurrency = (cur: string): string => {
  switch (cur) {
    case 'SAR':
      return 'الرياض وجدة (شحن دولي)';
    case 'AED':
      return 'دبي وأبوظبي';
    case 'EGP':
      return 'القاهرة';
    default:
      return 'الخرطوم';
  }
};

export const CartPageView: React.FC = () => {
  const { 
    lang, currency, cart, addToCart, removeFromCart, updateCartQty, 
    clearCart, convertPrice, placeOrder, 
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

  // Hydrate previously saved customer delivery profile for faster repeat checkouts
  const initialSavedProfile = useRef(loadSavedDeliveryProfile());
  const [hasSavedProfile, setHasSavedProfile] = useState<boolean>(
    Boolean(initialSavedProfile.current)
  );

  // Delivery destination matched strictly to cityOptions keys
  const [selectedCity, setSelectedCity] = useState(() => {
    const savedCity = initialSavedProfile.current?.selectedCity;
    if (savedCity && CITY_SHIPPING_OPTIONS.some((c) => c.name.ar === savedCity)) {
      return savedCity;
    }
    return getDefaultCityForCurrency(currency);
  });
  const hasManuallyPickedCityRef = useRef(
    Boolean(
      initialSavedProfile.current?.selectedCity &&
        CITY_SHIPPING_OPTIONS.some((c) => c.name.ar === initialSavedProfile.current?.selectedCity)
    )
  );

  useEffect(() => {
    if (!hasManuallyPickedCityRef.current) {
      setSelectedCity(getDefaultCityForCurrency(currency));
    }
  }, [currency]);

  // Dynamic country code calculation aligned to exact city labels
  const getCountryCodeForCity = (city: string, cur: string): string => {
    if (city.includes('الرياض') || city.includes('Riyadh') || (cur === 'SAR' && !hasManuallyPickedCityRef.current)) return '+966';
    if (city.includes('دبي') || city.includes('Dubai') || (cur === 'AED' && !hasManuallyPickedCityRef.current)) return '+971';
    if (city.includes('القاهرة') || city.includes('Cairo') || (cur === 'EGP' && !hasManuallyPickedCityRef.current)) return '+20';
    return '+249'; // Sudan
  };
  const activeCountryCode = getCountryCodeForCity(selectedCity, currency);

  // Checkout inputs (auto-hydrated from saved delivery profile when available)
  const [customerName, setCustomerName] = useState(
    () => initialSavedProfile.current?.customerName || ''
  );
  const [phone, setPhone] = useState(
    () => initialSavedProfile.current?.phone || ''
  );
  const [fullPhone, setFullPhone] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [address, setAddress] = useState(
    () => initialSavedProfile.current?.address || ''
  );
  const [paymentMethod, setPaymentMethod] = useState<'binance' | 'redotpay' | 'paypal' | 'bankak' | 'cashi' | 'bravo' | 'cod'>('binance');
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string; address?: string }>({});

  // Auto-save delivery details whenever customer updates them for seamless repeat orders
  useEffect(() => {
    if (!customerName.trim() && !phone.trim() && !address.trim()) return;
    saveDeliveryProfile({
      customerName,
      phone,
      selectedCity,
      address,
    });
    setHasSavedProfile(true);
  }, [customerName, phone, selectedCity, address]);

  const handleClearSavedProfile = () => {
    clearSavedDeliveryProfile();
    setCustomerName('');
    setPhone('');
    setFullPhone('');
    setIsPhoneValid(false);
    setAddress('');
    setHasSavedProfile(false);
    hasManuallyPickedCityRef.current = false;
    setSelectedCity(getDefaultCityForCurrency(currency));
    showToast(lang === 'ar' ? 'تم مسح بيانات التوصيل المحفوظة' : 'Saved delivery details cleared');
  };

  const handleCopyPaymentInfo = (textToCopy: string, label: string) => {
    try {
      navigator.clipboard.writeText(textToCopy);
      showToast(lang === 'ar' ? `تم نسخ ${label} بنجاح!` : `${label} copied!`);
    } catch {
      showToast(`${label}: ${textToCopy}`);
    }
  };

  // Compute authoritative live catalog summary so Cart display always matches Checkout 100%
  const liveCatalogPool = [...(activeData.products || []), ...hairStylingDevices];
  const authoritativeSummary = computeAuthoritativeOrderSummary({
    cart,
    catalogPool: liveCatalogPool,
    selectedCity,
    promoCode: appliedDiscountRate > 0 ? promoCode : undefined,
  });

  const livePriceById = new Map(
    authoritativeSummary.verifiedItems.map((vi) => [vi.product.id, vi.unitPriceUSD])
  );
  const priceChangedItems = cart.filter((item) => {
    const livePrice = livePriceById.get(item.product.id);
    return typeof livePrice === 'number' && Math.abs(livePrice - item.product.basePriceUSD) > 0.001;
  });

  // Free shipping threshold ($15 USD from canonical checkoutIntegrity rules)
  const freeShippingThresholdUSD = FREE_SHIPPING_THRESHOLD_USD;
  const authoritativeSubtotalUSD = authoritativeSummary.subtotalUSD;
  const isFreeShipping = authoritativeSummary.isFreeShipping;
  const remainingForFreeShippingUSD = Math.max(0, freeShippingThresholdUSD - authoritativeSubtotalUSD);
  const remainingText = convertPrice(remainingForFreeShippingUSD).text;
  const progressPercent = Math.min(100, Math.round((authoritativeSubtotalUSD / freeShippingThresholdUSD) * 100));

  // Pick 1-tap quick upsell product to unlock free shipping immediately
  const cartProductIds = new Set(cart.map((item) => item.product.id));
  const quickUpsellProduct = !isFreeShipping
    ? pickFreeShippingUpsellProduct(liveCatalogPool, cartProductIds, remainingForFreeShippingUSD)
    : null;
  const quickUpsellPrice = quickUpsellProduct
    ? convertPrice(quickUpsellProduct.basePriceUSD)
    : null;

  const cityOptions = CITY_SHIPPING_OPTIONS;

  const currentCityObj = resolveShippingOption(selectedCity);
  const shippingFeeUSD = authoritativeSummary.shippingFeeUSD;

  // Price calculations (strictly synchronized with live catalog prices)
  const subtotalObj = convertPrice(authoritativeSubtotalUSD);
  const discountAmountUSD = authoritativeSummary.discountAmountUSD;
  const discountObj = convertPrice(discountAmountUSD);
  const finalTotalUSD = authoritativeSummary.finalTotalUSD;
  const finalTotalObj = convertPrice(finalTotalUSD);
  const shippingFeeObj = convertPrice(shippingFeeUSD);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = resolvePromoDiscountRate(promoCode);
    if (rate === 0.10) {
      setAppliedDiscountRate(rate);
      setPromoMessage({ text: lang === 'ar' ? 'تم تطبيق كود الخصم (-10%)' : 'Coupon applied (-10%)', isError: false });
      showToast(lang === 'ar' ? 'تم تفعيل خصم 10%' : '10% discount applied');
    } else if (rate === 0.15) {
      setAppliedDiscountRate(rate);
      setPromoMessage({ text: lang === 'ar' ? 'تم تطبيق كود كبار العميلات (-15%)' : 'VIP coupon applied (-15%)', isError: false });
      showToast(lang === 'ar' ? 'تم تفعيل خصم 15%' : 'VIP 15% discount applied');
    } else {
      setAppliedDiscountRate(0);
      setPromoMessage({ text: lang === 'ar' ? 'عذراً، هذا الكود غير صالح أو منتهي الصلاحية' : 'Invalid or expired promo code', isError: true });
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; phone?: string; address?: string } = {};

    if (!customerName.trim()) {
      errors.name = lang === 'ar' ? 'يرجى كتابة الاسم الكامل' : 'Please enter your full name';
    }
    
    const cleanDigits = phone.replace(/\D/g, '');
    if (!phone.trim() || cleanDigits.length === 0) {
      errors.phone = lang === 'ar' ? 'يرجى إدخال رقم الهاتف أو الواتساب' : 'Phone/WhatsApp number is required';
    } else if (!isPhoneValid && cleanDigits.length < 8) {
      errors.phone = lang === 'ar' ? 'يرجى التأكد من كتابة رقم هاتف مكتمل وصالح' : 'Please enter a complete and valid phone number';
    }

    if (!address.trim()) {
      errors.address = lang === 'ar' ? 'يرجى إدخال العنوان بالتفصيل' : 'Detailed address is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    // Normalize phone with clean international prefix (e.g. +249912345678 or +966501234567)
    const normalizedPhone = fullPhone || `${activeCountryCode}${cleanDigits}`;

    // Place the order with accurate financial calculations
    const fullAddress = `${selectedCity} - ${address} [طريقة الدفع: ${paymentMethod.toUpperCase()}]`;
    const newPlacedOrder = placeOrder({
      name: customerName,
      phone: normalizedPhone,
      address: fullAddress,
      selectedCity,
      finalTotalUSD,
      discountAmountUSD,
      shippingFeeUSD,
      promoCode: promoCode.trim() || undefined
    });

    // Show luxury order confirmation modal
    setCreatedOrder(newPlacedOrder);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-28 sm:pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Unified Top Back Navigation Bar */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigateTo('store')}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-[#5A3E7A] bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-2xs transition-all min-h-[44px] cursor-pointer active:scale-95"
          >
            {isRtl ? <ArrowRight className="w-4 h-4 shrink-0" /> : <ArrowLeft className="w-4 h-4 shrink-0" />}
            <span className="whitespace-nowrap">{lang === 'ar' ? 'العودة للمتجر' : 'Back to Store'}</span>
          </button>

          <span className="text-xs font-bold text-[#5A3E7A] truncate">
            {lang === 'ar' ? 'سلة المشتريات وإتمام الطلب' : 'Shopping Bag & Checkout'}
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-[#5A3E7A]">
              <StoreCartIcon size="md" className="text-[#5A3E7A]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {lang === 'ar' ? 'سلة المشتريات' : 'Shopping Bag'}
              </h1>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {lang === 'ar' ? 'راجعي منتجاتكِ وأكملي بيانات التوصيل.' : 'Review your items and complete your delivery details.'}
              </p>
            </div>
          </div>

          {cart.length > 0 && (
            <div className="flex items-center gap-2.5 self-start sm:self-center">
              <button
                type="button"
                onClick={clearCart}
                className="min-h-[44px] text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5 px-3 py-2 rounded-xl cursor-pointer"
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
              <StoreCartIcon className="w-12 h-12 text-[#5A3E7A]" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">
              {lang === 'ar' ? 'سلة المشتريات فارغة' : 'Your Bag is Empty'}
            </h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              {lang === 'ar' 
                ? 'أضيفي منتجاتكِ المفضلة من المتجر للبدء في إتمام الطلب.' 
                : 'Add your favorite products from the store to get started.'}
            </p>
            <button
              onClick={() => navigateTo('store')}
              className="px-8 py-3.5 bg-[#5A3E7A] hover:bg-[#483162] text-white text-sm font-extrabold rounded-full shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2 min-h-[48px] cursor-pointer"
            >
              <span>{lang === 'ar' ? 'تصفح المتجر' : 'Browse Store'}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            
            {/* Free Shipping Progress Bar */}
            <div className="bg-gradient-to-r from-purple-50/80 via-white to-purple-50/80 p-4 sm:p-5 rounded-3xl border border-purple-200/80 shadow-sm space-y-3">
              <div className="flex items-start sm:items-center justify-between gap-2 text-xs sm:text-sm font-black text-slate-900">
                <div className="flex items-start sm:items-center gap-2 min-w-0 flex-1">
                  <Truck className={`w-4 h-4 shrink-0 mt-0.5 sm:mt-0 ${isFreeShipping ? 'text-emerald-600 animate-bounce' : 'text-[#5A3E7A]'}`} />
                  <span className="leading-relaxed">
                    {isFreeShipping 
                      ? (lang === 'ar' ? 'طلبكِ مؤهل للشحن المجاني' : 'Free shipping unlocked')
                      : (lang === 'ar' ? `أضيفي ${remainingText} للشحن المجاني` : `Add ${remainingText} for free shipping`)}
                  </span>
                </div>
                <span className="font-mono font-black text-xs text-[#5A3E7A] bg-purple-100 px-2.5 py-0.5 rounded-full shrink-0">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden p-0.5 shadow-inner">
                <div 
                  className={`h-full transition-all duration-700 rounded-full ${
                    isFreeShipping 
                      ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-sm shadow-emerald-400/50' 
                      : 'bg-gradient-to-r from-[#5A3E7A] to-purple-400'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* 1-Tap Quick Upsell Suggestion to Unlock Free Shipping */}
              {!isFreeShipping && (
                <div className="pt-2.5 border-t border-purple-100/80 space-y-2.5">
                  {quickUpsellProduct && quickUpsellPrice ? (
                    <div className="flex items-center justify-between gap-3 bg-white/90 p-2.5 rounded-2xl border border-purple-100/90">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={quickUpsellProduct.images[0]}
                          alt={quickUpsellProduct.name[lang]}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-50 border border-slate-100"
                        />
                        <div className="min-w-0 text-start">
                          <span className="text-[11px] font-bold text-[#5A3E7A] block">
                            {lang === 'ar' ? 'اقتراح سريع للشحن المجاني' : 'Quick add for free shipping'}
                          </span>
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {quickUpsellProduct.name[lang]}
                          </p>
                          <p className="text-xs font-black text-[#5A3E7A] tabular-nums">
                            {quickUpsellPrice.text}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => addToCart(quickUpsellProduct)}
                        className="px-3.5 py-2 rounded-xl bg-[#5A3E7A] hover:bg-[#483162] text-white text-xs font-bold inline-flex items-center gap-1.5 min-h-[44px] shrink-0 transition-colors cursor-pointer active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5 shrink-0" />
                        <span>{lang === 'ar' ? 'إضافة' : 'Add'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="text-[11px] sm:text-xs text-slate-600">
                        {lang === 'ar'
                          ? 'أضيفي منتجاً آخر للحصول على شحن مجاني.'
                          : 'Add one more item for free shipping.'}
                      </span>
                      <button
                        type="button"
                        onClick={() => navigateTo('store')}
                        className="text-[#5A3E7A] font-extrabold hover:underline text-[11px] whitespace-nowrap ms-2 shrink-0 cursor-pointer"
                      >
                        {lang === 'ar' ? 'تصفح المتجر' : 'Browse store'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Layout: Main Items Column + Summary Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Cart Items List */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-sm space-y-4">
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-100">
                    {lang === 'ar' ? `المنتجات المختارة (${cart.length})` : `Selected Items (${cart.length})`}
                  </h2>

                  {priceChangedItems.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-2.5 text-xs leading-relaxed">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-extrabold">
                          {lang === 'ar'
                            ? 'تم تحديث أسعار بعض المنتجات تلقائياً وفق الكتالوج الحي'
                            : 'Some item prices were refreshed to match the live catalog'}
                        </p>
                        <p className="text-amber-800 mt-0.5">
                          {lang === 'ar'
                            ? 'الإجمالي المعروض أدناه يطابق السعر النهائي المعتمد عند تأكيد الطلب.'
                            : 'The totals shown below reflect the exact verified catalog prices at checkout.'}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="divide-y divide-slate-100">
                    {cart.map((item) => {
                      const liveUnitUSD = livePriceById.get(item.product.id) ?? item.product.basePriceUSD;
                      const priceWasUpdated = Math.abs(liveUnitUSD - item.product.basePriceUSD) > 0.001;
                      const itemTotal = convertPrice(liveUnitUSD * item.quantity);
                      const unitPrice = convertPrice(liveUnitUSD);
                      const oldUnitPrice = priceWasUpdated ? convertPrice(item.product.basePriceUSD) : null;

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
                            <div className="space-y-1.5">
                              <span className="inline-block text-xs font-bold text-[#5A3E7A] bg-purple-50 px-2.5 py-0.5 rounded-full">
                                {getCleanCategoryLabel(item.product, lang)}
                              </span>
                              <h3 className="text-sm font-bold text-slate-900 leading-relaxed line-clamp-2">
                                {item.product.name[lang]}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                                <span>
                                  {lang === 'ar' ? `سعر القطعة: ${unitPrice.text}` : `Unit: ${unitPrice.text}`}
                                </span>
                                {oldUnitPrice && (
                                  <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-bold">
                                    {lang === 'ar' ? `كان ${oldUnitPrice.text}` : `Was ${oldUnitPrice.text}`}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                            {/* Quantity Stepper (Accessible 44px touch buttons) */}
                            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-inner">
                              <button
                                type="button"
                                onClick={() => updateCartQty(item.product.id, -1)}
                                className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-9 text-center text-sm font-bold text-slate-900 tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCartQty(item.product.id, 1)}
                                className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Item Total Price */}
                            <div className="text-end min-w-[90px]">
                              <p className="text-sm font-black text-slate-900 tabular-nums">
                                {itemTotal.text}
                              </p>
                            </div>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.product.id)}
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
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
                      <p className="text-xs font-bold text-slate-900">{lang === 'ar' ? 'منتجات أصلية 100%' : '100% Authentic'}</p>
                      <p className="text-[11px] text-slate-500">{lang === 'ar' ? 'مصادر موثوقة ومضمونة' : 'Trusted & verified'}</p>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <Truck className="w-6 h-6 text-[#5A3E7A] shrink-0" />
                    <div className="text-start">
                      <p className="text-xs font-bold text-slate-900">{lang === 'ar' ? 'دفع عند الاستلام' : 'Cash on Delivery'}</p>
                      <p className="text-[11px] text-slate-500">{lang === 'ar' ? 'افحصي طلبكِ قبل الدفع' : 'Inspect before paying'}</p>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <RotateCcw className="w-6 h-6 text-[#5A3E7A] shrink-0" />
                    <div className="text-start">
                      <p className="text-xs font-bold text-slate-900">{lang === 'ar' ? 'ضمان 14 يوماً' : '14-Day Guarantee'}</p>
                      <p className="text-[11px] text-slate-500">{lang === 'ar' ? 'استبدال واسترجاع مرن' : 'Flexible returns'}</p>
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
                        placeholder={lang === 'ar' ? 'BEAUTY10 أو NADI15' : 'BEAUTY10 or NADI15'}
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
                      onChange={(e) => {
                        hasManuallyPickedCityRef.current = true;
                        setSelectedCity(e.target.value);
                      }}
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
                        {isFreeShipping ? (lang === 'ar' ? 'مجاني' : 'FREE') : shippingFeeObj.text}
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
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                      {lang === 'ar' ? 'بيانات التوصيل' : 'Delivery Details'}
                    </h3>
                    {hasSavedProfile && (customerName || phone || address) && (
                      <button
                        type="button"
                        onClick={handleClearSavedProfile}
                        className="text-[11px] font-bold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        {lang === 'ar' ? 'مسح البيانات المحفوظة' : 'Clear saved'}
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      {lang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                    </label>
                    <input 
                      type="text"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (formErrors.name) setFormErrors(prev => ({ ...prev, name: undefined }));
                      }}
                      placeholder={lang === 'ar' ? 'مثال: سارة محمد المنصور' : 'e.g. Sarah Miller'}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E7A] min-h-[48px] transition-colors ${
                        formErrors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:bg-white'
                      }`}
                    />
                    {formErrors.name && <p className="text-[11px] font-bold text-rose-500 ps-1">{formErrors.name}</p>}
                  </div>

                  {/* Smart Country & Phone Input */}
                  <SmartPhoneInput
                    value={phone}
                    onChange={(val) => {
                      setPhone(val);
                      if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: undefined }));
                    }}
                    lang={lang}
                    required
                    defaultCountryCode={activeCountryCode}
                    onFullPhoneChange={(fp, valid) => {
                      setFullPhone(fp);
                      setIsPhoneValid(valid);
                    }}
                    error={formErrors.phone}
                  />

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      {lang === 'ar' ? 'العنوان التفصيلي (الحي، الشارع، المعلم) *' : 'Detailed Address (Street, Landmark) *'}
                    </label>
                    <textarea 
                      rows={2}
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (formErrors.address) setFormErrors(prev => ({ ...prev, address: undefined }));
                      }}
                      placeholder={lang === 'ar' ? 'مثال: حي الرياض، شارع الستين، قرب كافيه...' : 'e.g. Al-Riyadh district, 60th street...'}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E7A] min-h-[58px] transition-colors resize-none ${
                        formErrors.address ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:bg-white'
                      }`}
                    />
                    {formErrors.address && <p className="text-[11px] font-bold text-rose-500 ps-1">{formErrors.address}</p>}
                  </div>

                  {/* Payment Method Selector - Clean, Direct, Global First then Sudan Wallets */}
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>{lang === 'ar' ? 'طريقة الدفع:' : 'Payment Method:'}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {lang === 'ar' ? 'اختاري وسيلة الدفع المناسبة' : 'Choose your payment method'}
                      </span>
                    </label>

                    {/* Direct Wallet Grid - Global Wallets First, followed by Sudan Wallets */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {/* 1. Binance Pay */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('binance')}
                        className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all min-h-[58px] ${
                          paymentMethod === 'binance' 
                            ? 'border-[#F3BA2F] bg-amber-50/70 text-slate-900 shadow-xs ring-1 ring-[#F3BA2F]' 
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-[#F3BA2F] flex items-center justify-center text-slate-950 font-black text-[10px]">
                          B
                        </div>
                        <span>Binance Pay</span>
                      </button>

                      {/* 2. RedotPay */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('redotpay')}
                        className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all min-h-[58px] ${
                          paymentMethod === 'redotpay' 
                            ? 'border-rose-500 bg-rose-50/70 text-rose-950 shadow-xs ring-1 ring-rose-400' 
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center text-white font-black text-[10px]">
                          R
                        </div>
                        <span>RedotPay</span>
                      </button>

                      {/* 3. PayPal */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('paypal')}
                        className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all min-h-[58px] ${
                          paymentMethod === 'paypal' 
                            ? 'border-[#003087] bg-blue-50/70 text-blue-950 shadow-xs ring-1 ring-[#003087]' 
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-[#003087] flex items-center justify-center text-white font-black text-[10px]">
                          P
                        </div>
                        <span>PayPal</span>
                      </button>

                      {/* 4. Bankak (بنكك) */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bankak')}
                        className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all min-h-[58px] ${
                          paymentMethod === 'bankak' 
                            ? 'border-[#006A4E] bg-emerald-50/70 text-emerald-950 shadow-xs ring-1 ring-[#006A4E]' 
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <CreditCard className="w-5 h-5 text-[#006A4E]" />
                        <span>{lang === 'ar' ? 'بنكك' : 'Bankak'}</span>
                      </button>

                      {/* 5. My Cashi (ماي كاشي) */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cashi')}
                        className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all min-h-[58px] ${
                          paymentMethod === 'cashi' 
                            ? 'border-[#5A3E7A] bg-purple-50 text-[#5A3E7A] shadow-xs ring-1 ring-[#5A3E7A]' 
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-[#5A3E7A] flex items-center justify-center text-white font-black text-[10px]">
                          C
                        </div>
                        <span>{lang === 'ar' ? 'ماي كاشي' : 'My Cashi'}</span>
                      </button>

                      {/* 6. Bravo (برافو) */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bravo')}
                        className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all min-h-[58px] ${
                          paymentMethod === 'bravo' 
                            ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs ring-1 ring-indigo-500' 
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-[10px]">
                          B
                        </div>
                        <span>{lang === 'ar' ? 'برافو' : 'Bravo'}</span>
                      </button>

                      {/* 7. Cash On Delivery */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all min-h-[58px] col-span-2 sm:col-span-3 ${
                          paymentMethod === 'cod' 
                            ? 'border-slate-800 bg-slate-900 text-white shadow-xs' 
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Banknote className="w-5 h-5" />
                        <span>{lang === 'ar' ? 'دفع عند الاستلام' : 'Cash on Delivery'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Payment Details Drawer with One-Click Copy */}
                  {(() => {
                    const wallets = activeData?.contactInfo?.paymentWallets || {
                      binancePayId: '829104432',
                      redotPayId: '19482015',
                      paypalEmail: activeData?.contactInfo?.email || 'nadi.skincare@gmail.com',
                      bankakAccount: '2891044',
                      cashiNumber: '07040 2787 05198',
                      bravoNumber: '0900713251',
                    };

                    return (
                      <>
                        {paymentMethod === 'binance' && (
                          <div className="p-3.5 bg-amber-50/90 rounded-2xl border border-amber-200 text-[11px] text-amber-950 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold">Binance Pay ID:</span>
                              <button
                                type="button"
                                onClick={() => handleCopyPaymentInfo(wallets.binancePayId, 'Binance Pay ID')}
                                className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 font-extrabold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Copy className="w-3 h-3" />
                                <span>{lang === 'ar' ? 'نسخ' : 'Copy'}</span>
                              </button>
                            </div>
                            <p className="font-mono font-black text-sm text-slate-900 tracking-wider">{wallets.binancePayId} (USDT / Pay)</p>
                            <p className="text-amber-800/90">{lang === 'ar' ? 'يرجى إرسال إشعار العملية عبر الواتساب لتأكيد الشحن فوراً.' : 'Please send the transaction screenshot to WhatsApp to confirm.'}</p>
                          </div>
                        )}

                        {paymentMethod === 'redotpay' && (
                          <div className="p-3.5 bg-rose-50/90 rounded-2xl border border-rose-200 text-[11px] text-rose-950 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold">RedotPay ID:</span>
                              <button
                                type="button"
                                onClick={() => handleCopyPaymentInfo(wallets.redotPayId, 'RedotPay ID')}
                                className="px-2.5 py-1 bg-rose-200 hover:bg-rose-300 text-rose-900 font-extrabold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Copy className="w-3 h-3" />
                                <span>{lang === 'ar' ? 'نسخ' : 'Copy'}</span>
                              </button>
                            </div>
                            <p className="font-mono font-black text-sm text-slate-900 tracking-wider">{wallets.redotPayId}</p>
                            <p className="text-rose-800/90">{lang === 'ar' ? 'تحويل فوري بدون رسوم بين حسابات RedotPay.' : 'Instant zero-fee transfer between RedotPay accounts.'}</p>
                          </div>
                        )}

                        {paymentMethod === 'paypal' && (
                          <div className="p-3.5 bg-blue-50/90 rounded-2xl border border-blue-200 text-[11px] text-blue-950 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold">PayPal Account:</span>
                              <button
                                type="button"
                                onClick={() => handleCopyPaymentInfo(wallets.paypalEmail, 'PayPal Email')}
                                className="px-2.5 py-1 bg-blue-200 hover:bg-blue-300 text-blue-900 font-extrabold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Copy className="w-3 h-3" />
                                <span>{lang === 'ar' ? 'نسخ' : 'Copy'}</span>
                              </button>
                            </div>
                            <p className="font-mono font-black text-xs text-slate-900">{wallets.paypalEmail}</p>
                            <p className="text-blue-800/90">{lang === 'ar' ? 'دفع عالمي آمن ومحمي مع تأكيد عبر الواتساب.' : 'Secure global payment with WhatsApp confirmation.'}</p>
                          </div>
                        )}

                        {paymentMethod === 'bankak' && (
                          <div className="p-3.5 bg-emerald-50/90 rounded-2xl border border-emerald-200 text-[11px] text-emerald-950 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold">{lang === 'ar' ? 'رقم حساب بنكك المعتمد:' : 'Bankak Account Number:'}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyPaymentInfo(wallets.bankakAccount, 'رقم حساب بنكك')}
                                className="px-2.5 py-1 bg-emerald-200 hover:bg-emerald-300 text-emerald-900 font-extrabold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Copy className="w-3 h-3" />
                                <span>{lang === 'ar' ? 'نسخ' : 'Copy'}</span>
                              </button>
                            </div>
                            <p className="font-mono font-black text-sm text-slate-900 tracking-wider">{wallets.bankakAccount} ({activeData.storeName.ar})</p>
                            <p className="text-emerald-800/90">{lang === 'ar' ? 'يرجى إرسال إشعار التحويل عبر الواتساب لتأكيد الطلب فوراً.' : 'Please send the transfer receipt to our WhatsApp after placing.'}</p>
                          </div>
                        )}

                        {paymentMethod === 'cashi' && (
                          <div className="p-3.5 bg-purple-50/90 rounded-2xl border border-purple-200 text-[11px] text-purple-950 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold">{lang === 'ar' ? 'رقم محفظة ماي كاشي:' : 'My Cashi Wallet Number:'}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyPaymentInfo(wallets.cashiNumber, 'رقم محفظة ماي كاشي')}
                                className="px-2.5 py-1 bg-purple-200 hover:bg-purple-300 text-[#5A3E7A] font-extrabold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Copy className="w-3 h-3" />
                                <span>{lang === 'ar' ? 'نسخ' : 'Copy'}</span>
                              </button>
                            </div>
                            <p className="font-mono font-black text-sm text-slate-900 tracking-wider">{wallets.cashiNumber}</p>
                            <p className="text-purple-800/90">{lang === 'ar' ? 'تحويل فوري عبر تطبيق ماي كاشي مع إرفاق الإشعار عبر الواتساب.' : 'Instant transfer via My Cashi with receipt via WhatsApp.'}</p>
                          </div>
                        )}

                        {paymentMethod === 'bravo' && (
                          <div className="p-3.5 bg-indigo-50/90 rounded-2xl border border-indigo-200 text-[11px] text-indigo-950 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold">{lang === 'ar' ? 'رقم محفظة برافو:' : 'Bravo Wallet ID:'}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyPaymentInfo(wallets.bravoNumber, 'رقم محفظة برافو')}
                                className="px-2.5 py-1 bg-indigo-200 hover:bg-indigo-300 text-indigo-900 font-extrabold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Copy className="w-3 h-3" />
                                <span>{lang === 'ar' ? 'نسخ' : 'Copy'}</span>
                              </button>
                            </div>
                            <p className="font-mono font-black text-sm text-slate-900 tracking-wider">{wallets.bravoNumber}</p>
                            <p className="text-indigo-800/90">{lang === 'ar' ? 'دفع سريع ومباشر عبر تطبيق برافو السودان.' : 'Quick transfer via Bravo Sudan.'}</p>
                          </div>
                        )}
                      </>
                    );
                  })()}

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
