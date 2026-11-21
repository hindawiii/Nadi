import React from 'react';
import {
  Award,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  FileText,
  FlaskConical,
  HelpCircle,
  Layers,
  MessageCircle,
  PenLine,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Truck,
  X as CloseIcon,
} from 'lucide-react';
import type { Product } from '../../data/siteConfig';
import type { PdpProductKind } from '../../lib/pdpProfile';

interface PdpInfoAccordionsProps {
  lang: 'ar' | 'en';
  product: Product;
  productKind: PdpProductKind;
  storeName: string;
  contextCopy: ReturnType<typeof import('../../lib/pdpProfile').getPdpContextCopy>;
  pipeSpecs: string[];
  openAccordions: Record<string, boolean>;
  toggleAccordion: (key: string) => void;
  onWhatsAppOrder: () => void;
  onOpenReviewModal: () => void;
}

export const PdpInfoAccordions: React.FC<PdpInfoAccordionsProps> = ({
  lang,
  product,
  productKind,
  storeName,
  contextCopy,
  pipeSpecs,
  openAccordions,
  toggleAccordion,
  onWhatsAppOrder,
  onOpenReviewModal,
}) => {
  return (
    <>
      {/* 5-PILLAR LUXE PRO ACCORDION SYSTEM */}
      <div className="mt-10 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-700" />
            <span>{lang === 'ar' ? 'تفاصيل ومعلومات المنتج الشاملة' : 'Complete Product Information'}</span>
          </h3>
          <span className="text-xs font-semibold text-slate-400">
            {lang === 'ar' ? 'اضغطي على أي قسم لعرض التفاصيل' : 'Click to expand / collapse'}
          </span>
        </div>

        {/* ACCORDION 1: Description & Key Highlights */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-300 hover:border-purple-200">
          <button
            type="button"
            onClick={() => toggleAccordion('desc')}
            className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-start transition-colors hover:bg-slate-50/70 min-h-[56px] cursor-pointer"
            aria-expanded={openAccordions.desc}
          >
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                    {lang === 'ar' ? 'الوصف وتفاصيل المنتج الفاخرة' : 'Description & Key Highlights'}
                  </h4>
                  <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    {lang === 'ar' ? 'نظرة شاملة' : 'Overview'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {lang === 'ar' ? 'شرح وافٍ لخصائص ومميزات المنتج ونتائجه' : 'Comprehensive overview of features and results'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 transition-transform duration-300 ${
                  openAccordions.desc ? 'rotate-180 bg-purple-100 text-purple-700' : ''
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </span>
            </div>
          </button>

          {openAccordions.desc && (
            <div className="p-4 sm:p-6 pt-0 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
              <div className="text-slate-700 leading-relaxed text-sm sm:text-base pt-4">
                <p>{product.tabs.description[lang]}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {contextCopy.descHighlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-purple-50/60 border border-purple-100 text-xs sm:text-sm text-purple-950 font-medium leading-relaxed"
                  >
                    <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ACCORDION 2: How to Use & Application Guide */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-300 hover:border-purple-200">
          <button
            type="button"
            onClick={() => toggleAccordion('usage')}
            className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-start transition-colors hover:bg-slate-50/70 min-h-[56px] cursor-pointer"
            aria-expanded={openAccordions.usage}
          >
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                    {lang === 'ar' ? 'طريقة الاستخدام والخطوات الموصى بها' : 'How to Use & Application Guide'}
                  </h4>
                  <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    {lang === 'ar' ? 'نصائح الخبراء' : 'Expert Guide'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {lang === 'ar' ? 'الخطوات السليمة لتحقيق أقصى فاعلية واستفادة' : 'Step-by-step instructions for best results'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 transition-transform duration-300 ${
                  openAccordions.usage ? 'rotate-180 bg-amber-100 text-amber-800' : ''
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </span>
            </div>
          </button>

          {openAccordions.usage && (
            <div className="p-4 sm:p-6 pt-0 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 mt-4">
                <h5 className="font-extrabold text-amber-950 text-xs sm:text-sm mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'ar' ? 'إرشادات الاستخدام المعتمدة:' : 'Recommended Usage Guidelines:'}</span>
                </h5>
                <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">{product.tabs.usage[lang]}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {contextCopy.usageSteps.map((step, idx) => {
                  const stepBg = idx === 0 ? 'bg-slate-900' : idx === 1 ? 'bg-[#5A3E7A]' : 'bg-emerald-700';
                  return (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span
                        className={`w-6 h-6 rounded-full ${stepBg} text-white font-bold text-xs flex items-center justify-center mb-2`}
                      >
                        {idx + 1}
                      </span>
                      <h6 className="font-bold text-xs text-slate-900 mb-1">{step.title}</h6>
                      <p className="text-xs text-slate-600 leading-relaxed">{step.body}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ACCORDION 3: Technical Specs, Box Contents, or Pure Formulation */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-300 hover:border-purple-200">
          <button
            type="button"
            onClick={() => toggleAccordion('specs')}
            className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-start transition-colors hover:bg-slate-50/70 min-h-[56px] cursor-pointer"
            aria-expanded={openAccordions.specs}
          >
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                    {contextCopy.specsHeader.title}
                  </h4>
                  <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {contextCopy.specsHeader.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{contextCopy.specsHeader.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 transition-transform duration-300 ${
                  openAccordions.specs ? 'rotate-180 bg-emerald-100 text-emerald-800' : ''
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </span>
            </div>
          </button>

          {openAccordions.specs && (
            <div className="p-4 sm:p-6 pt-0 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
              <div className="pt-4">
                {product.isTechSpecs && product.techSpecs && product.techSpecs.length > 0 ? (
                  <div className="overflow-hidden border border-slate-200 rounded-2xl shadow-xs">
                    <table className="w-full text-start text-xs sm:text-sm">
                      <tbody>
                        {product.techSpecs.map((spec, i) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}>
                            <td className="p-3.5 font-bold text-slate-900 w-1/3 border-b border-slate-100">
                              {spec.label[lang]}
                            </td>
                            <td className="p-3.5 text-slate-700 border-b border-slate-100 font-medium">
                              {spec.value[lang]}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (productKind === 'hair' || productKind === 'box') && pipeSpecs.length >= 2 ? (
                  <div className="space-y-3">
                    <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3">
                      <h5 className="font-extrabold text-emerald-950 text-xs sm:text-sm flex items-center gap-1.5">
                        <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                        <span>{contextCopy.specsHeader.sectionTitle}</span>
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {pipeSpecs.map((specItem, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 p-3 rounded-xl bg-white border border-emerald-100 text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{specItem}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 lg:gap-3 pt-1">
                      {contextCopy.specsHeader.chips.map((chipLabel, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs font-bold text-slate-700 ${
                            idx === 2 ? 'col-span-2 sm:col-span-1' : ''
                          }`}
                        >
                          {chipLabel}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80">
                      <h5 className="font-extrabold text-emerald-950 text-xs sm:text-sm mb-1.5 flex items-center gap-1.5">
                        <FlaskConical className="w-4 h-4 text-emerald-700" />
                        <span>{contextCopy.specsHeader.sectionTitle}</span>
                      </h5>
                      <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                        {product.tabs.ingredientsOrSpecs?.[lang] ||
                          (lang === 'ar'
                            ? 'مستخلصات نباتية طبيعية غنية بالعناصر المغذية ومضادات الأكسدة.'
                            : 'Pure natural plant extracts rich in nourishing antioxidants.')}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 lg:gap-3 pt-1">
                      {contextCopy.specsHeader.chips.map((chipLabel, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs font-bold text-slate-700 ${
                            idx === 2 ? 'col-span-2 sm:col-span-1' : ''
                          }`}
                        >
                          {chipLabel}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ACCORDION 4: Shipping, Delivery & Golden Guarantee */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-300 hover:border-purple-200">
          <button
            type="button"
            onClick={() => toggleAccordion('shipping')}
            className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-start transition-colors hover:bg-slate-50/70 min-h-[56px] cursor-pointer"
            aria-expanded={openAccordions.shipping}
          >
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                    {lang === 'ar'
                      ? 'الشحن السريع، الدفع عند الاستلام، والضمان الذهبي'
                      : 'Shipping, COD & Golden Guarantee'}
                  </h4>
                  <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                    {lang === 'ar' ? 'ضمان 100%' : '100% Guaranteed'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {lang === 'ar'
                    ? 'توصيل سريع، فحص قبل الدفع، وسياسة استبدال ميسرة'
                    : 'Fast delivery, pay on delivery, hassle-free returns'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 transition-transform duration-300 ${
                  openAccordions.shipping ? 'rotate-180 bg-blue-100 text-blue-800' : ''
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </span>
            </div>
          </button>

          {openAccordions.shipping && (
            <div className="p-4 sm:p-6 pt-0 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-2 text-blue-700 font-extrabold text-xs sm:text-sm">
                    <Truck className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'شحن فوري وسريع' : 'Express Delivery'}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {lang === 'ar'
                      ? 'يتم تجهيز الطلب وإرساله مع مندوب معتمد خلال 24 إلى 48 ساعة لباب منزلكِ.'
                      : 'Dispatched with certified express couriers within 24-48 hours.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-xs sm:text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'الدفع عند الاستلام (COD)' : 'Cash on Delivery (COD)'}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {lang === 'ar'
                      ? 'لا حاجة للدفع مسبقاً، يمكنكِ معاينة وفحص الشحنة عند الاستلام ثم الدفع بكل ثقة.'
                      : 'No upfront payment required. Inspect your order and pay with full confidence.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-2 text-purple-700 font-extrabold text-xs sm:text-sm">
                    <RotateCcw className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'الضمان الذهبي للاستبدال' : 'Golden Replacement Guarantee'}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {productKind === 'hair'
                      ? lang === 'ar'
                        ? 'ضمان سنتين معتمد ضد عيوب التصنيع + استبدال فوري خلال 14 يوماً من الاستلام.'
                        : '2-year certified warranty + easy 14-day replacement upon delivery.'
                      : lang === 'ar'
                        ? 'سياسة استبدال أو استرجاع ميسرة في حال وجود أي ملاحظة خلال 14 يوماً من الاستلام.'
                        : 'Easy 14-day replacement or return policy if you have any concerns.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-2 text-amber-700 font-extrabold text-xs sm:text-sm">
                    <Award className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'تغليف آمن وفاخر' : 'Luxury Secure Packaging'}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {productKind === 'hair'
                      ? lang === 'ar'
                        ? 'يصلكِ الجهاز في تغليف حماية عازل للصدمات يحفظ سلامة الجهاز وملحقاته.'
                        : 'Arrives securely in shock-resistant packaging protecting the device and attachments.'
                      : lang === 'ar'
                        ? 'تصلكِ المنتجات في تغليف حماية عازل للصدمات يحفظ جودة العبوات ونضارة التركيبة.'
                        : 'Items arrive safely in impact-resistant luxury packaging.'}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                <span className="font-bold text-purple-900">
                  {lang === 'ar' ? 'لديكِ استفسار حول الشحن أو التوصيل؟' : 'Have questions regarding shipping or delivery?'}
                </span>
                <button
                  type="button"
                  onClick={onWhatsAppOrder}
                  className="font-extrabold text-[#5A3E7A] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'ar' ? 'تحدثي مباشرة مع خدمة العملاء' : 'Chat with Support on WhatsApp'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ACCORDION 5: Verified Customer Reviews & Ratings */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-300 hover:border-purple-200">
          <button
            type="button"
            onClick={() => toggleAccordion('reviews')}
            className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-start transition-colors hover:bg-slate-50/70 min-h-[56px] cursor-pointer"
            aria-expanded={openAccordions.reviews}
          >
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#5A3E7A] flex items-center justify-center shrink-0">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                    {lang === 'ar'
                      ? `تقييمات وتجارب العميلات المعتمدة (${product.reviewsCount})`
                      : `Verified Customer Reviews (${product.reviewsCount})`}
                  </h4>
                  <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-purple-50 text-[#5A3E7A] border border-purple-200">
                    {product.rating} / 5
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {lang === 'ar' ? 'آراء وتجارب واقعية موثقة من عميلاتنا' : 'Verified feedback from real shoppers'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 transition-transform duration-300 ${
                  openAccordions.reviews ? 'rotate-180 bg-purple-100 text-[#5A3E7A]' : ''
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </span>
            </div>
          </button>

          {openAccordions.reviews && (
            <div className="p-4 sm:p-6 pt-0 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#5A3E7A] text-white font-black text-xl flex items-center justify-center shadow-sm">
                    {product.rating}
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-purple-50 text-[#5A3E7A] border border-purple-200/70 text-[11px] font-extrabold mb-1">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      <span>
                        {lang === 'ar'
                          ? `تقييم معتمد • ${product.rating} من 5`
                          : `Verified Score • ${product.rating} / 5`}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      {lang === 'ar' ? 'تقييمات حقيقية من طلبات مكتملة' : 'Authentic ratings from completed orders'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {lang === 'ar'
                        ? `بناءً على ${product.reviewsCount} تقييماً موثقاً`
                        : `Based on ${product.reviewsCount} verified purchases`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenReviewModal}
                  className="px-5 h-10 sm:h-11 bg-[#5A3E7A] hover:bg-[#483162] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <PenLine className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'أضيفي تقييمكِ وتجربتكِ' : 'Write a Review'}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100/80 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-purple-200 text-purple-900 font-bold text-xs flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-extrabold text-xs text-slate-900">
                      {lang === 'ar' ? 'مراجعة موثقة من عميلة حقيقية' : 'Verified Buyer Review'}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg font-bold border border-emerald-200 shrink-0">
                    <Check className="w-3 h-3" />
                    <span>{lang === 'ar' ? 'شراء مؤكد' : 'Verified Purchase'}</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{product.tabs.reviews[lang]}"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CONTEXT-AWARE COMPARISON MATRIX */}
      <div className="mt-10 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold bg-purple-100 text-[#5A3E7A] border border-purple-200">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5A3E7A]" />
            <span>{lang === 'ar' ? 'معايير الجودة والتميز' : 'Why Choose NADI'}</span>
          </span>
          <h3 className="text-fluid-h2 font-black text-slate-900 font-brand-ar leading-relaxed">
            {contextCopy.comparison.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{contextCopy.comparison.subtitle}</p>
        </div>

        <div className="overflow-x-auto scrollbar-none pt-2">
          <table className="w-full text-start border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-200 text-xs sm:text-sm font-black text-slate-500">
                <th className="py-3 px-4 text-start font-bold text-slate-600">
                  {lang === 'ar' ? 'المعيار والميزة' : 'Feature / Criterion'}
                </th>
                <th className="py-3 px-4 text-center bg-purple-50/80 text-[#5A3E7A] rounded-t-2xl font-black border-x border-t border-purple-200/80">
                  <span className="inline-flex items-center gap-1 text-sm font-black">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>{storeName}</span>
                  </span>
                </th>
                <th className="py-3 px-4 text-center font-bold text-slate-400">
                  {contextCopy.comparison.competitorHeader}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
              {contextCopy.comparison.rows.map((row, idx) => {
                const isLast = idx === contextCopy.comparison.rows.length - 1;
                return (
                  <tr key={idx}>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">{row.criterion}</td>
                    <td
                      className={`py-3.5 px-4 text-center bg-purple-50/40 border-x border-purple-200/60 font-bold text-emerald-800 ${
                        isLast ? 'border-b rounded-b-2xl' : ''
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5 justify-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{row.nadi}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-400">
                      <span className="inline-flex items-center gap-1.5 justify-center text-rose-500 font-semibold">
                        <CloseIcon className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>{row.competitor}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
