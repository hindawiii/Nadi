export type FaqCategoryId = 'all' | 'shipping' | 'warranty' | 'care';

export interface StoreFaqItem {
  id: string;
  category: Exclude<FaqCategoryId, 'all'>;
  question: { ar: string; en: string };
  answer: { ar: string; en: string };
}

export interface StoreFaqCategory {
  id: FaqCategoryId;
  label: { ar: string; en: string };
}

export const STORE_FAQ_CATEGORIES: StoreFaqCategory[] = [
  { id: 'all', label: { ar: 'الكل', en: 'All' } },
  { id: 'shipping', label: { ar: 'الشحن والدفع', en: 'Shipping & Payment' } },
  { id: 'warranty', label: { ar: 'الضمان والأصالة', en: 'Warranty & Quality' } },
  { id: 'care', label: { ar: 'العناية والروتين', en: 'Care & Routine' } },
];

export const STORE_FAQ_ITEMS: StoreFaqItem[] = [
  {
    id: 'faq-cod-payment',
    category: 'shipping',
    question: {
      ar: 'كيف أطلب وهل يتوفر الدفع عند الاستلام ومعاينة الشحنة؟',
      en: 'How do I place an order, and is Cash on Delivery with inspection available?',
    },
    answer: {
      ar: 'يمكنكِ الطلب مباشرة عبر سلة التسوق أو بنقرة واحدة عبر واتساب. نوفر خدمة الدفع عند الاستلام مع إمكانية فحص ومعاينة الشحنة بالكامل قبل الدفع، كما نتيح الدفع الإلكتروني عبر بنكك، ماي كاشي، برافو، Visa، Apple Pay، PayPal، Binance، وRedotPay.',
      en: 'You can order directly through the shopping bag or in one tap via WhatsApp. We offer Cash on Delivery with full package inspection before payment, as well as electronic payments including Bankak, MyCashi, Bravo, Visa, Apple Pay, PayPal, Binance, and RedotPay.',
    },
  },
  {
    id: 'faq-delivery-window',
    category: 'shipping',
    question: {
      ar: 'كم تستغرق مدة التوصيل وكيف أتابع حالة طلبي؟',
      en: 'How long does delivery take and how can I track my order?',
    },
    answer: {
      ar: 'يتم تجهيز الطلب وإرساله خلال 24 إلى 48 ساعة عبر مندوبين معتمدين، وتصلكِ الشحنة في تغليف محكم عازل للصدمات. يمكنكِ متابعة حالة طلبكِ لحظة بلحظة من صفحة «تتبع شحنتكِ» باستخدام رقم الطلب.',
      en: 'Orders are prepared and dispatched within 24 to 48 hours via certified couriers in protective, shock-resistant packaging. You can follow your shipment status anytime via the Order Tracker page using your order reference.',
    },
  },
  {
    id: 'faq-authenticity-warranty',
    category: 'warranty',
    question: {
      ar: 'هل المنتجات وأجهزة الشعر أصلية 100%؟ وماذا يشمل الضمان؟',
      en: 'Are all skincare items and hair devices 100% authentic, and what does the warranty cover?',
    },
    answer: {
      ar: 'جميع مستحضرات العناية وأجهزة تصفيف الشعر أصلية 100% ومختارة بعناية فائقة. تشمل جميع أجهزة الشعر ضماناً معتمداً لمدة سنتين ضد عيوب التصنيع، بالإضافة إلى سياسة الضمان الذهبي للاستبدال الميسر خلال 14 يوماً من الاستلام.',
      en: 'Every skincare formula and hair styling device is 100% authentic and carefully vetted. All hair devices include a certified 2-year warranty against manufacturing defects, alongside our hassle-free 14-day Golden Replacement guarantee.',
    },
  },
  {
    id: 'faq-sensitive-skin',
    category: 'care',
    question: {
      ar: 'هل مستحضرات العناية بالبشرة مناسبة للبشرة الحساسة؟',
      en: 'Are NADI skincare formulas suitable for sensitive skin?',
    },
    answer: {
      ar: 'نعم، تركيباتنا تعتمد على خلاصات نباتية نقية خالية من البارابين والملوّنات القاسية لتكون لطيفة على البشرة الحساسة. نوصي دائماً بتجربة كمية صغيرة أولاً، كما يسعدنا تقديم استشارة مجانية عبر واتساب لاختيار الروتين الأنسب لنوع بشرتكِ.',
      en: 'Yes, our formulations rely on pure botanical extracts free from harsh parabens and irritating dyes so they stay gentle on sensitive skin. We always recommend a quick patch test and offer free WhatsApp consultations to tailor your routine.',
    },
  },
  {
    id: 'faq-hair-temperature',
    category: 'care',
    question: {
      ar: 'كيف أختار درجة الحرارة المناسبة لجهاز تصفيف الشعر؟',
      en: 'How do I choose the right heat setting for my hair styling device?',
    },
    answer: {
      ar: 'للشعر الناعم أو المصبوغ يُنصح بدرجة حرارة بين 160°C و180°C، وللشعر المتوسط بين 180°C و200°C، وللشعر الكثيف أو المموّج بين 200°C و220°C. جميع أجهزتنا مزوّدة بطبقة سيراميك وتورمالين لتوزيع الحرارة بانتظام وحماية الشعر من الجفاف.',
      en: 'For fine or color-treated hair, use 160°C–180°C; for medium hair, 180°C–200°C; and for thick or coarse hair, 200°C–220°C. All our devices use ceramic-tourmaline coatings for even heat distribution and moisture protection.',
    },
  },
  {
    id: 'faq-exchange-policy',
    category: 'warranty',
    question: {
      ar: 'هل يمكنني استبدال أو تعديل طلبي بعد الاستلام؟',
      en: 'Can I exchange or modify my order after receiving it?',
    },
    answer: {
      ar: 'بكل سهولة؛ يمكنكِ التواصل معنا عبر واتساب خلال 14 يوماً من الاستلام لاستبدال أو استرجاع أي منتج بحالته الأصلية دون أي إجراءات معقدة، وسيتولى فريق خدمة العميلات تنسيق ذلك معكِ فوراً.',
      en: 'Easily — simply reach out to our support team on WhatsApp within 14 days of delivery to exchange or return any item in its original condition, with zero complicated paperwork.',
    },
  },
];

export function filterStoreFaqItems(category: FaqCategoryId): StoreFaqItem[] {
  if (category === 'all') return STORE_FAQ_ITEMS;
  return STORE_FAQ_ITEMS.filter((item) => item.category === category);
}
