export type FaqCategoryId = 'shipping' | 'warranty' | 'care';

export interface StoreFaqItem {
  id: string;
  category: FaqCategoryId;
  question: { ar: string; en: string };
  answer: { ar: string; en: string };
}

export interface StoreFaqCategory {
  id: FaqCategoryId;
  label: { ar: string; en: string };
}

export const STORE_FAQ_CATEGORIES: StoreFaqCategory[] = [
  { id: 'shipping', label: { ar: 'الشحن والدفع', en: 'Shipping & Pay' } },
  { id: 'warranty', label: { ar: 'الضمان', en: 'Warranty' } },
  { id: 'care', label: { ar: 'العناية', en: 'Care' } },
];

export const STORE_FAQ_ITEMS: StoreFaqItem[] = [
  {
    id: 'faq-cod-payment',
    category: 'shipping',
    question: {
      ar: 'كيف أطلب وهل يتوفر الدفع عند الاستلام؟',
      en: 'How do I order, and is Cash on Delivery available?',
    },
    answer: {
      ar: 'اطلبي عبر السلة أو واتساب مع خدمة الدفع عند الاستلام ومعاينة الشحنة، أو إلكترونياً عبر بنكك، ماي كاشي، برافو، فيزا، أبل باي، باي بال، بينانس، وريدوت باي.',
      en: 'Order via the bag or WhatsApp with Cash on Delivery and full inspection before paying, or pay online via Bankak, MyCashi, Bravo, Visa, Apple Pay, PayPal, Binance, and RedotPay.',
    },
  },
  {
    id: 'faq-delivery-window',
    category: 'shipping',
    question: {
      ar: 'كم مدة التوصيل وكيف أتابع طلبي؟',
      en: 'How long is delivery and how do I track my order?',
    },
    answer: {
      ar: 'التوصيل خلال 24 إلى 48 ساعة بتغليف محكم، ويمكنكِ متابعة طلبكِ لحظة بلحظة من صفحة «تتبع شحنتكِ» برقم الطلب.',
      en: 'Delivery takes 24 to 48 hours in protective packaging. Track your shipment anytime on the Order Tracker page with your reference number.',
    },
  },
  {
    id: 'faq-authenticity-warranty',
    category: 'warranty',
    question: {
      ar: 'هل المنتجات أصلية 100%؟ وماذا يشمل الضمان؟',
      en: 'Are all products 100% authentic, and what does the warranty cover?',
    },
    answer: {
      ar: 'جميع مستحضراتنا وأجهزتنا أصلية 100%، وتشمل أجهزة الشعر ضماناً معتمداً لمدة سنتين ضد عيوب التصنيع.',
      en: 'Every skincare item and hair device is 100% authentic. All hair devices carry a certified 2-year warranty against manufacturing defects.',
    },
  },
  {
    id: 'faq-exchange-policy',
    category: 'warranty',
    question: {
      ar: 'هل يمكنني الاستبدال أو الاسترجاع بعد الاستلام؟',
      en: 'Can I exchange or return my order after delivery?',
    },
    answer: {
      ar: 'نعم، نوفر استبدالاً واسترجاعاً ميسّراً خلال 14 يوماً من الاستلام للمنتج بحالته الأصلية عبر التواصل معنا في واتساب.',
      en: 'Yes — reach out on WhatsApp within 14 days of delivery to exchange or return any unused item in its original packaging with zero hassle.',
    },
  },
  {
    id: 'faq-sensitive-skin',
    category: 'care',
    question: {
      ar: 'هل مستحضرات العناية مناسبة للبشرة الحساسة؟',
      en: 'Are NADI skincare formulas suitable for sensitive skin?',
    },
    answer: {
      ar: 'نعم، تركيباتنا نباتية خالية من البارابين ولطيفة على البشرة الحساسة، مع استشارة مجانية عبر واتساب لاختيار روتينكِ.',
      en: 'Yes, our paraben-free botanical formulas are gentle on sensitive skin, and we offer free WhatsApp consultations to match your routine.',
    },
  },
  {
    id: 'faq-hair-temperature',
    category: 'care',
    question: {
      ar: 'ما درجة الحرارة المناسبة لجهاز تصفيف الشعر؟',
      en: 'Which heat setting should I use for my hair device?',
    },
    answer: {
      ar: 'للشعر الناعم 160°–180°، للمتوسط 180°–200°، وللكثيف 200°–220°؛ وجميع أجهزتنا بطبقة سيراميك وتورمالين لحماية الشعر.',
      en: 'Fine hair: 160°–180°C · Medium: 180°–200°C · Thick: 200°–220°C. All devices feature ceramic-tourmaline plates for heat protection.',
    },
  },
];

export function filterStoreFaqItems(category: FaqCategoryId): StoreFaqItem[] {
  return STORE_FAQ_ITEMS.filter((item) => item.category === category);
}
