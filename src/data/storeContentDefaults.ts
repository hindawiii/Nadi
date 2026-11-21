import { StoreFaqItem, STORE_FAQ_ITEMS } from './storeFaqData';

export interface BilingualText {
  ar: string;
  en: string;
}

export interface EditorialHeroSlideConfig {
  id: string;
  image: string;
  collectionId?: 'skin' | 'hair' | 'box';
  sectionLabel: BilingualText;
  alt: BilingualText;
  objectPosition?: string;
}

export interface PromoBannerSlideConfig {
  id: string;
  image: string;
  badge: BilingualText;
  title: BilingualText;
  desc: BilingualText;
}

export interface PromoBannerConfig {
  badge: BilingualText;
  title: BilingualText;
  subtitle: BilingualText;
  image1: string;
  image1Badge: BilingualText;
  image2: string;
  image2Badge: BilingualText;
  ctaText: BilingualText;
  secondaryCtaText?: BilingualText;
  slides?: PromoBannerSlideConfig[];
}

export interface StoreFaqSectionConfig {
  kicker?: BilingualText;
  title?: BilingualText;
  ctaLabel?: BilingualText;
  items: StoreFaqItem[];
}

export type AboutValueIconId = 'leaf' | 'shield' | 'award' | 'heart';

export interface AboutValueItemConfig {
  id: string;
  icon: AboutValueIconId;
  title: BilingualText;
  desc: BilingualText;
}

export interface AboutStoryConfig {
  title: BilingualText;
  body: BilingualText;
  image: string;
  missionTitle?: BilingualText;
  missionBody?: BilingualText;
  visionTitle?: BilingualText;
  visionBody?: BilingualText;
  valuesHeading?: BilingualText;
  valuesSubtitle?: BilingualText;
  values?: AboutValueItemConfig[];
  ctaTitle?: BilingualText;
  ctaSubtitle?: BilingualText;
  ctaPrimary?: BilingualText;
  ctaSecondary?: BilingualText;
}

export type PrivacyHighlightIconId = 'lock' | 'shield' | 'eyeOff';
export type PrivacySectionIconId =
  | 'database'
  | 'lock'
  | 'eyeOff'
  | 'creditCard'
  | 'smartphone'
  | 'userCheck';

export interface PrivacyHighlightConfig {
  id: string;
  icon: PrivacyHighlightIconId;
  title: BilingualText;
  subtitle: BilingualText;
}

export interface PrivacyPolicySectionConfig {
  id: string;
  icon: PrivacySectionIconId;
  title: BilingualText;
  body: BilingualText;
}

export interface PrivacyPolicyConfig {
  kicker: BilingualText;
  lastUpdated: BilingualText;
  title: BilingualText;
  intro: BilingualText;
  highlights: PrivacyHighlightConfig[];
  sections: PrivacyPolicySectionConfig[];
  contactTitle: BilingualText;
  contactSubtitle: BilingualText;
}

export const DEFAULT_PROMO_SLIDES: PromoBannerSlideConfig[] = [
  {
    id: 'promo-slide-1',
    image: 'https://images.unsplash.com/photo-1608248597359-25b82877fb18?auto=format&fit=crop&w=800&q=80',
    badge: { ar: 'مكوّنات نباتية 100%', en: '100% Botanicals' },
    title: { ar: 'خلاصات نباتية نقية 100%', en: '100% Pure Botanical Extracts' },
    desc: {
      ar: 'مكوّنات معصورة على البارد تغذّي البشرة بعمق.',
      en: 'Cold-pressed extracts that nourish skin deeply.',
    },
  },
  {
    id: 'promo-slide-2',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
    badge: { ar: '4 مستحضرات متكاملة', en: '4-Piece Complete Box' },
    title: { ar: '4 مستحضرات متكاملة في بوكس واحد', en: '4 Daily Essentials in One Box' },
    desc: {
      ar: 'روتينكِ اليومي الكامل في عبوة هدايا أنيقة.',
      en: 'Your full daily routine in one gift box.',
    },
  },
  {
    id: 'promo-slide-3',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    badge: { ar: 'هدية مجانية', en: 'Complimentary Gift' },
    title: { ar: 'حقيبة مخملية + 3 عينات سفرية هدية', en: 'Velvet Pouch + 3 Travel Samples' },
    desc: {
      ar: 'مرفقة مجاناً مع البوكس لحفظ مستحضراتكِ.',
      en: 'Included free with the box for travel storage.',
    },
  },
  {
    id: 'promo-slide-4',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    badge: { ar: 'نتائج 14 يوماً', en: '14-Day Results' },
    title: { ar: 'ترطيب ونضارة ملحوظة خلال 14 يوماً', en: 'Visible Hydration & Glow in 14 Days' },
    desc: {
      ar: 'فرق واضح في نعومة وإشراقة البشرة خلال أسبوعين.',
      en: 'Noticeable glow and softness in two weeks.',
    },
  },
];

export const DEFAULT_FAQ_SECTION_META: Required<Omit<StoreFaqSectionConfig, 'items'>> = {
  kicker: { ar: 'إجابات سريعة قبل الطلب', en: 'Quick Answers' },
  title: { ar: 'الأسئلة الشائعة', en: 'Frequently Asked Questions' },
  ctaLabel: { ar: 'للاستفسار تحدثي معنا', en: 'Inquire & Chat With Us' },
};

export const DEFAULT_ABOUT_VALUES: AboutValueItemConfig[] = [
  {
    id: 'val-natural',
    icon: 'leaf',
    title: { ar: 'مكوّنات طبيعية', en: 'Natural Ingredients' },
    desc: {
      ar: 'خلاصات نباتية نقية خالية من المواد القاسية، مختارة بعناية لروتينكِ اليومي.',
      en: 'Pure botanical extracts free from harsh synthetics, chosen for daily care.',
    },
  },
  {
    id: 'val-quality',
    icon: 'shield',
    title: { ar: 'جودة مضمونة', en: 'Guaranteed Quality' },
    desc: {
      ar: 'منتجات أصلية 100% من مصادر موثوقة ومختبرة لسلامة وفعالية بشرتكِ.',
      en: '100% authentic products from trusted sources, tested for safety and efficacy.',
    },
  },
  {
    id: 'val-results',
    icon: 'award',
    title: { ar: 'نتائج ملموسة', en: 'Visible Results' },
    desc: {
      ar: 'تركيبات فعالة تمنح بشرتكِ ترطيباً عميقاً وإشراقة صحية تلاحظينها سريعاً.',
      en: 'Effective formulas delivering lasting hydration and a healthy glow.',
    },
  },
  {
    id: 'val-support',
    icon: 'heart',
    title: { ar: 'استشارات مباشرة', en: 'Direct Support' },
    desc: {
      ar: 'تواصل قريب عبر واتساب لمساعدتكِ في اختيار المنتجات الأنسب لبشرتكِ.',
      en: 'Direct WhatsApp guidance to help you pick the right products for your skin.',
    },
  },
];

export const DEFAULT_ABOUT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=80';

export const DEFAULT_PRIVACY_HIGHLIGHTS: PrivacyHighlightConfig[] = [
  {
    id: 'hl-cloud-encryption',
    icon: 'lock',
    title: { ar: 'تشفير سحابي معتمد', en: 'Encrypted Cloud Storage' },
    subtitle: { ar: 'حماية صارمة لبيانات الحساب والطلبات', en: 'Strict isolation for accounts & orders' },
  },
  {
    id: 'hl-zero-sharing',
    icon: 'shield',
    title: { ar: 'صفر مشاركة تجارية', en: 'Zero Commercial Sharing' },
    subtitle: { ar: 'لا نبيع أو نشارك بياناتكِ لأي جهة خارجية', en: 'Never sold or shared with third parties' },
  },
  {
    id: 'hl-private-tracking',
    icon: 'eyeOff',
    title: { ar: 'خصوصية التتبع العام', en: 'Private Public Tracking' },
    subtitle: { ar: 'إخفاء الاسم والهاتف والعنوان في التتبع', en: 'Personal PII masked on public lookups' },
  },
];

export const DEFAULT_PRIVACY_SECTIONS: PrivacyPolicySectionConfig[] = [
  {
    id: 'data-collected',
    icon: 'database',
    title: {
      ar: '1. البيانات التي نجمعها والغرض منها',
      en: '1. Information We Collect & Why',
    },
    body: {
      ar: 'نجمع فقط البيانات الأساسية اللازمة لإتمام طلبكِ وتوصيله بدقة: الاسم الكامل، رقم الهاتف للتواصل عند التوصيل، وعنوان الاستلام. وعند اختياركِ تسجيل الدخول عبر حساب Google، نستخدم معرّف حسابكِ فقط لمزامنة سلة المشتريات والمفضلة وسجل «طلباتي» بأمان بين أجهزتكِ.',
      en: 'We collect only the essential information required to process and deliver your order accurately: your name, contact phone number, and delivery address. When you choose to sign in with Google, your account identifier is used solely to sync your cart, wishlist, and order history securely across your devices.',
    },
  },
  {
    id: 'cloud-isolation',
    icon: 'lock',
    title: {
      ar: '2. حماية وتخزين بياناتكِ السحابية',
      en: '2. Cloud Security & Account Isolation',
    },
    body: {
      ar: 'تُحفظ سلة مشترياتكِ ومفضلتكِ وطلباتكِ داخل بنية سحابية مشفّرة ومقيّدة بقواعد صلاحيات صارمة، بحيث لا يمكن لأي مستخدمة أخرى الاطلاع على بياناتكِ أو سجل طلباتكِ، ويقتصر الوصول على صاحبة الحساب الموثّق وفريق إدارة المتجر لتنفيذ الشحن وخدمة الضمان فقط.',
      en: 'Your cart, wishlist, and orders are stored in encrypted cloud infrastructure protected by strict access rules. No other customer can view your personal details or order records; access is limited exclusively to your authenticated account and store fulfillment staff.',
    },
  },
  {
    id: 'public-tracking',
    icon: 'eyeOff',
    title: {
      ar: '3. حماية الخصوصية في التتبع العام للشحنات',
      en: '3. Privacy Protection on Public Order Tracking',
    },
    body: {
      ar: 'عند استخدام ميزة «تتبع شحنتكِ» برمز التتبع (TRK-...) من أي جهاز، يعرض النظام حالة التوصيل والرقم المرجعي والإجمالي المعتمد فقط، بينما يتم حجب الاسم ورقم الهاتف وعنوان التوصيل بالكامل حفاظاً على خصوصيتكِ التامة.',
      en: 'When using the public Order Tracker with a tracking code (TRK-...) from any device, only fulfillment status, order reference, and verified total are displayed. Your name, phone number, and delivery address remain completely masked.',
    },
  },
  {
    id: 'payment-safety',
    icon: 'creditCard',
    title: {
      ar: '4. أمان طرق الدفع الإلكتروني والدفع عند الاستلام',
      en: '4. Payment Safety & Zero Credential Storage',
    },
    body: {
      ar: 'لا يقوم المتجر بتخزين أرقام البطاقات البنكية أو الرموز السرية أو كلمات مرور تطبيقات الدفع الإلكتروني (بنكك، ماي كاشي، برافو، فيزا، أبل باي، باي بال، بينانس، وريدوت باي) في أي وقت، كما نوفر خيار الدفع عند الاستلام مع معاينة الشحنة لراحة وطمأنينة كاملة.',
      en: 'Our store never stores bank card numbers, PINs, or payment app credentials (Bankak, MyCashi, Bravo, Visa, Apple Pay, PayPal, Binance, or RedotPay). We also offer Cash on Delivery with full package inspection for complete peace of mind.',
    },
  },
  {
    id: 'local-cache-pwa',
    icon: 'smartphone',
    title: {
      ar: '5. الذاكرة المؤقتة وتحسين تجربة التصفح (PWA)',
      en: '5. Local Cache & App Experience (PWA)',
    },
    body: {
      ar: 'نستخدم التخزين المحلي للمتصفح والذاكرة المؤقتة لحفظ اللغة والعملة المختارة وتسريع التصفح وتوفير عمل سلس حتى عند تذبذب الإنترنت، ويمكنكِ مسح هذه البيانات في أي لحظة من إعدادات متصفحكِ.',
      en: 'We use browser local storage and offline caching to remember your preferred language and currency, speed up browsing, and maintain smooth operation during brief network drops. You may clear this cache anytime from your browser settings.',
    },
  },
  {
    id: 'customer-rights',
    icon: 'userCheck',
    title: {
      ar: '6. حقوقكِ الكاملة في الوصول والتعديل والحذف',
      en: '6. Your Full Rights (Access, Update & Deletion)',
    },
    body: {
      ar: 'لكِ الحق الكامل في طلب مراجعة بياناتكِ المسجّلة لدينا أو تحديثها أو حذفها نهائياً في أي وقت، كما يمكنكِ تسجيل الخروج من حسابكِ بضغطة واحدة. للاستفسار أو تقديم طلب حذف بيانات، تواصلي معنا مباشرة عبر قنواتنا الرسمية أدناه.',
      en: 'You retain the full right to review, update, or request permanent deletion of your stored personal data at any time, and you may sign out with a single tap. For any privacy inquiry or deletion request, contact us directly via our official channels below.',
    },
  },
];

function resolveBilingual(value: Partial<BilingualText> | undefined, fallback: BilingualText): BilingualText {
  return {
    ar: value?.ar?.trim() ? value.ar : fallback.ar,
    en: value?.en?.trim() ? value.en : fallback.en,
  };
}

/**
 * Resolves Special Offer slides with full backward compatibility for legacy
 * `image1` / `image2` fields while supporting arbitrary admin-edited slide arrays.
 */
export function resolvePromoSlides(promoBanner?: Partial<PromoBannerConfig>): PromoBannerSlideConfig[] {
  if (Array.isArray(promoBanner?.slides) && promoBanner.slides.length > 0) {
    return promoBanner.slides.map((slide, idx) => {
      const fallback = DEFAULT_PROMO_SLIDES[idx] || DEFAULT_PROMO_SLIDES[0];
      return {
        id: slide.id || `promo-slide-${idx + 1}`,
        image: (slide.image || '').trim() || fallback.image,
        badge: resolveBilingual(slide.badge, fallback.badge),
        title: resolveBilingual(slide.title, fallback.title),
        desc: resolveBilingual(slide.desc, fallback.desc),
      };
    });
  }

  return DEFAULT_PROMO_SLIDES.map((slide, idx) => {
    if (idx === 0) {
      return {
        ...slide,
        image: (promoBanner?.image1 || '').trim() || slide.image,
        badge: resolveBilingual(promoBanner?.image1Badge, slide.badge),
      };
    }
    if (idx === 1) {
      return {
        ...slide,
        image: (promoBanner?.image2 || '').trim() || slide.image,
        badge: resolveBilingual(promoBanner?.image2Badge, slide.badge),
      };
    }
    return slide;
  });
}

export function resolveFaqSection(faqSection?: Partial<StoreFaqSectionConfig>): Required<StoreFaqSectionConfig> {
  const validItems = Array.isArray(faqSection?.items) && faqSection.items.length > 0
    ? faqSection.items
    : STORE_FAQ_ITEMS;

  return {
    kicker: resolveBilingual(faqSection?.kicker, DEFAULT_FAQ_SECTION_META.kicker),
    title: resolveBilingual(faqSection?.title, DEFAULT_FAQ_SECTION_META.title),
    ctaLabel: resolveBilingual(faqSection?.ctaLabel, DEFAULT_FAQ_SECTION_META.ctaLabel),
    items: validItems,
  };
}

export function resolveAboutPageContent(
  aboutStory: Partial<AboutStoryConfig> | undefined,
  storeName: BilingualText
): Required<AboutStoryConfig> {
  const defaultTitle: BilingualText = {
    ar: `قصّة ${storeName.ar}`,
    en: `The ${storeName.en} Story`,
  };
  const defaultBody: BilingualText = {
    ar: 'نختار مكوّناتنا النباتية بعناية فائقة، ونقدّم لكِ مستحضرات عناية راقية تجمع بين النقاء الطبيعي والفاعلية العلمية.',
    en: 'We carefully curate botanical ingredients blending natural purity with proven daily care.',
  };

  return {
    title: resolveBilingual(aboutStory?.title, defaultTitle),
    body: resolveBilingual(aboutStory?.body, defaultBody),
    image: (aboutStory?.image || '').trim() || DEFAULT_ABOUT_HERO_IMAGE,
    missionTitle: resolveBilingual(aboutStory?.missionTitle, { ar: 'رسالتنا', en: 'Our Mission' }),
    missionBody: resolveBilingual(aboutStory?.missionBody, {
      ar: 'توفير عناية طبيعية موثوقة بأسعار واضحة وتجربة تسوق مريحة لكل امرأة.',
      en: 'To provide trusted natural skincare at fair prices with a smooth, reliable shopping experience.',
    }),
    visionTitle: resolveBilingual(aboutStory?.visionTitle, { ar: 'رؤيتنا', en: 'Our Vision' }),
    visionBody: resolveBilingual(aboutStory?.visionBody, {
      ar: 'أن نكون الخيار الأول للعناية الطبيعية في السودان والمنطقة، بمنتجات أصلية ونتائج تدوم.',
      en: 'To be the trusted destination for natural skincare in Sudan and the region, known for authenticity and real results.',
    }),
    valuesHeading: resolveBilingual(aboutStory?.valuesHeading, { ar: 'قيمنا', en: 'Our Values' }),
    valuesSubtitle: resolveBilingual(aboutStory?.valuesSubtitle, {
      ar: 'المبادئ التي نلتزم بها في كل منتج نختاره لكِ',
      en: 'The standards behind every product we curate',
    }),
    values:
      Array.isArray(aboutStory?.values) && aboutStory.values.length > 0
        ? aboutStory.values
        : DEFAULT_ABOUT_VALUES,
    ctaTitle: resolveBilingual(aboutStory?.ctaTitle, {
      ar: `اكتشفي تشكيلة ${storeName.ar}`,
      en: `Explore ${storeName.en}`,
    }),
    ctaSubtitle: resolveBilingual(aboutStory?.ctaSubtitle, {
      ar: 'اختاري من مجموعتنا للعناية الطبيعية ما يناسب روتينكِ اليومي.',
      en: 'Choose from our natural skincare collection tailored to your daily routine.',
    }),
    ctaPrimary: resolveBilingual(aboutStory?.ctaPrimary, { ar: 'تسوّقي الآن', en: 'Shop Now' }),
    ctaSecondary: resolveBilingual(aboutStory?.ctaSecondary, { ar: 'بوكسات العناية', en: 'Routine Bundles' }),
  };
}

export function resolvePrivacyPolicyContent(
  privacyPolicy: Partial<PrivacyPolicyConfig> | undefined,
  storeName: BilingualText
): PrivacyPolicyConfig {
  return {
    kicker: resolveBilingual(privacyPolicy?.kicker, {
      ar: 'التزام رسمي بحماية خصوصيتكِ',
      en: 'Official Privacy Commitment',
    }),
    lastUpdated: resolveBilingual(privacyPolicy?.lastUpdated, {
      ar: 'آخر تحديث: نوفمبر 2026',
      en: 'Last updated: November 2026',
    }),
    title: resolveBilingual(privacyPolicy?.title, {
      ar: 'سياسة الخصوصية وحماية البيانات',
      en: 'Privacy Policy & Data Protection',
    }),
    intro: resolveBilingual(privacyPolicy?.intro, {
      ar: `في متجر ${storeName.ar} نضع ثقتكِ وخصوصية بياناتكِ في صدارة أولوياتنا. توضح هذه الصفحة بشفافية كاملة كيف نتعامل مع معلوماتكِ ونحميها أثناء التسوّق والتوصيل.`,
      en: `At ${storeName.en}, your trust and personal data privacy come first. This page transparently explains how we handle and protect your information during shopping and delivery.`,
    }),
    highlights:
      Array.isArray(privacyPolicy?.highlights) && privacyPolicy.highlights.length > 0
        ? privacyPolicy.highlights
        : DEFAULT_PRIVACY_HIGHLIGHTS,
    sections:
      Array.isArray(privacyPolicy?.sections) && privacyPolicy.sections.length > 0
        ? privacyPolicy.sections
        : DEFAULT_PRIVACY_SECTIONS,
    contactTitle: resolveBilingual(privacyPolicy?.contactTitle, {
      ar: 'هل لديكِ استفسار حول خصوصية بياناتكِ؟',
      en: 'Questions about your privacy?',
    }),
    contactSubtitle: resolveBilingual(privacyPolicy?.contactSubtitle, {
      ar: 'فريق خدمة العملاء جاهز للرد على استفساراتكِ أو تنفيذ طلب تعديل وحذف البيانات فوراً.',
      en: 'Our support team is ready to answer your questions or process any data update or deletion request.',
    }),
  };
}
