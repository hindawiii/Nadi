import { Product } from '../data/siteConfig';
import { classifyProductCollection } from './productCollections';

export type PdpProductKind = 'hair' | 'box' | 'skin';
export type QuantityUnitKind = 'bottle' | 'piece' | 'box';

export interface QuickSpecItem {
  label: string;
  value: string;
}

export interface ProductQuickSpecs {
  heading: string;
  items: QuickSpecItem[];
}

export interface PdpTrustChip {
  id: string;
  label: string;
  tone: 'purple' | 'emerald' | 'amber';
}

export interface PdpUsageStep {
  title: string;
  body: string;
}

export interface PdpComparisonRow {
  criterion: string;
  nadi: string;
  competitor: string;
}

export interface PdpContextCopy {
  trustChips: PdpTrustChip[];
  descHighlights: string[];
  usageSteps: PdpUsageStep[];
  specsHeader: {
    title: string;
    subtitle: string;
    badge: string;
    sectionTitle: string;
    chips: [string, string, string];
  };
  comparison: {
    title: string;
    subtitle: string;
    competitorHeader: string;
    rows: PdpComparisonRow[];
  };
}

/**
 * Resolves a product into one of 3 contextual PDP profiles ('hair' | 'box' | 'skin')
 * so every product card across all store pillars renders accurate specs, steps, and copy.
 */
export function resolvePdpProductKind(
  product: Pick<Product, 'id' | 'name' | 'category' | 'isTechSpecs'>
): PdpProductKind {
  const collection = classifyProductCollection(product);
  if (collection === 'hair') return 'hair';
  if (collection === 'box') return 'box';
  if (collection === 'skin') return 'skin';

  const haystack = `${product.name.ar} ${product.name.en} ${product.category.ar} ${product.category.en}`.toLowerCase();
  if (
    product.isTechSpecs ||
    /hair|waver|curler|dryer|straightener|flat iron|air brush|جهاز|مكواة|مموج|مجفف|مصفف|كيرلي/.test(haystack)
  ) {
    return 'hair';
  }
  if (/box|bundle|gift|set|بوكس|بكج|مجموعة/.test(haystack)) {
    return 'box';
  }
  return 'skin';
}

/**
 * Grammatically accurate Arabic singular/dual/plural + English singular/plural quantity labels.
 */
export function formatArabicQuantityLabel(
  count: number,
  unit: QuantityUnitKind,
  lang: 'ar' | 'en'
): string {
  const n = Math.max(1, Math.floor(count));

  if (lang === 'en') {
    if (unit === 'bottle') return n === 1 ? '1 Bottle' : `${n} Bottles`;
    if (unit === 'box') return n === 1 ? '1 Set' : `${n} Sets`;
    return n === 1 ? '1 Unit' : `${n} Units`;
  }

  if (unit === 'bottle') {
    if (n === 1) return 'عبوة واحدة';
    if (n === 2) return 'عبوتان';
    if (n >= 3 && n <= 10) return `${n} عبوات`;
    return `${n} عبوة`;
  }

  if (unit === 'box') {
    if (n === 1) return 'بكج واحد';
    if (n === 2) return 'بكجان';
    if (n >= 3 && n <= 10) return `${n} بكجات`;
    return `${n} بكج`;
  }

  // piece
  if (n === 1) return 'قطعة واحدة';
  if (n === 2) return 'قطعتان';
  if (n >= 3 && n <= 10) return `${n} قطع`;
  return `${n} قطعة`;
}

/**
 * Splits pipe-delimited spec strings (used by hair devices and gift boxes) into clean items.
 */
export function parsePipeSpecs(rawText?: string): string[] {
  if (!rawText || typeof rawText !== 'string') return [];
  return rawText
    .split('|')
    .map((part) => part.replace(/[.،؛]+$/g, '').trim())
    .filter((part) => part.length > 0);
}

function classifyHairSpecLabel(segment: string, lang: 'ar' | 'en', usedLabels: Set<string>): string {
  const lower = segment.toLowerCase();

  const tryPick = (ar: string, en: string): string | null => {
    const label = lang === 'ar' ? ar : en;
    if (usedLabels.has(label)) return null;
    usedLabels.add(label);
    return label;
  };

  if (/مم|mm|قطر|إنش|'|أسطوان|barrel|صفائح|plate|وزن|غرام|lightweight|\d+g\b|رؤوس|attachments/.test(lower)) {
    const picked = tryPick('المقاس والتصميم', 'Size & Build');
    if (picked) return picked;
  }
  if (/°c|حرارة|temp|تسخين|heat|واط|watt|rpm|محرك|motor|سرع|speed/.test(lower)) {
    const picked = tryPick('الحرارة والأداء', 'Heat & Power');
    if (picked) return picked;
  }
  if (/ضمان|warranty/.test(lower)) {
    const picked = tryPick('الضمان المعتمد', 'Warranty');
    if (picked) return picked;
  }
  if (/سلك|swivel|إيقاف|shutoff|أيونات|ion|دوران|rotation|حماية|anti|فوهة|nozzle|سيراميك|ceramic/.test(lower)) {
    const picked = tryPick('التقنية والأمان', 'Tech & Safety');
    if (picked) return picked;
  }

  return (
    tryPick('مواصفة رئيسية', 'Key Spec') ||
    tryPick('ميزة إضافية', 'Highlight') ||
    (lang === 'ar' ? 'تفصيل فني' : 'Spec Detail')
  );
}

function inferSkincareSizeAndFormat(
  product: Pick<Product, 'name' | 'tabs'>,
  lang: 'ar' | 'en'
): { size: string; format: string; suitability: string } {
  const textAr = `${product.name.ar} ${product.tabs.description.ar} ${product.tabs.ingredientsOrSpecs?.ar || ''}`;
  const textEn = `${product.name.en} ${product.tabs.description.en} ${product.tabs.ingredientsOrSpecs?.en || ''}`;
  const combined = `${textAr} ${textEn}`.toLowerCase();

  // 1. Explicit volume/weight match if written in catalog copy
  const explicitAr = textAr.match(/(\d+(?:\.\d+)?)\s*(ملل|مل|جم|غرام|لصقة|قطعة)/);
  const explicitEn = textEn.match(/(\d+(?:\.\d+)?)\s*(ml|g|oz|patches|pcs)\b/i);

  let size: string;
  if (lang === 'ar' && explicitAr) {
    size = `${explicitAr[1]} ${explicitAr[2]}`;
  } else if (lang === 'en' && explicitEn) {
    size = `${explicitEn[1]} ${explicitEn[2]}`;
  } else if (/لصقات|patch|هيدروجيل|hydrogel/.test(combined)) {
    size = lang === 'ar' ? '60 لصقة (30 زوج)' : '60 Patches (30 Pairs)';
  } else if (/سيروم|serum|قطرات|drops|أمبول|ampoule/.test(combined)) {
    size = lang === 'ar' ? '30 مل' : '30 ml';
  } else if (/عين|eye/.test(combined)) {
    size = lang === 'ar' ? '15 مل' : '15 ml';
  } else if (/غسول|cleanser|رغوة|foam|تونر|toner|ماء|water|ميست|mist|مقشر|scrub/.test(combined)) {
    size = lang === 'ar' ? '150 مل' : '150 ml';
  } else if (/ماسك|قناع|mask/.test(combined)) {
    size = lang === 'ar' ? '100 مل' : '100 ml';
  } else if (/واقي|sunscreen|spf/.test(combined)) {
    size = lang === 'ar' ? '50 مل' : '50 ml';
  } else {
    size = lang === 'ar' ? '50 مل' : '50 ml';
  }

  let format: string;
  if (/لصقات|patch|هيدروجيل|hydrogel/.test(combined)) {
    format = lang === 'ar' ? 'لصقات هيدروجيل منعشة' : 'Cooling Hydrogel Patches';
  } else if (/سيروم|serum/.test(combined)) {
    format = lang === 'ar' ? 'سيروم خفيف سريع الامتصاص' : 'Lightweight Fast-Absorb Serum';
  } else if (/غسول|cleanser|رغوة|foam/.test(combined)) {
    format = lang === 'ar' ? 'رغوة تنظيف لطيفة' : 'Gentle Purifying Foam';
  } else if (/تونر|toner/.test(combined)) {
    format = lang === 'ar' ? 'تونر مائي موازن' : 'Balancing Botanical Toner';
  } else if (/ليلي|night/.test(combined)) {
    format = lang === 'ar' ? 'كريم ليلي مرمّم' : 'Restorative Night Cream';
  } else if (/واقي|sunscreen|spf/.test(combined)) {
    format = lang === 'ar' ? 'واقي شمس غير دهني' : 'Non-Greasy UV Fluid';
  } else if (/ماسك|قناع|mask/.test(combined)) {
    format = lang === 'ar' ? 'قناع عناية مركّز' : 'Concentrated Care Mask';
  } else {
    format = lang === 'ar' ? 'كريم مرطب مخملي' : 'Velvety Daily Cream';
  }

  const suitability = /حساسة|sensitive/.test(combined)
    ? lang === 'ar'
      ? 'مثالي للبشرة الحساسة وجميع الأنواع'
      : 'Ideal for Sensitive & All Skin Types'
    : lang === 'ar'
      ? 'مناسب لجميع أنواع البشرة'
      : 'Suitable for All Skin Types';

  return { size, format, suitability };
}

/**
 * Extracts concise, authentic Size & Quick Specs items shown near the price in PDPView.
 */
export function extractProductQuickSpecs(
  product: Pick<Product, 'id' | 'name' | 'category' | 'isTechSpecs' | 'techSpecs' | 'bundle' | 'tabs'>,
  kind: PdpProductKind,
  lang: 'ar' | 'en'
): ProductQuickSpecs {
  if (kind === 'hair') {
    if (product.techSpecs && product.techSpecs.length > 0) {
      return {
        heading: lang === 'ar' ? 'المقاس والمواصفات السريعة' : 'Size & Quick Specifications',
        items: product.techSpecs.slice(0, 4).map((spec) => ({
          label: spec.label[lang],
          value: spec.value[lang],
        })),
      };
    }

    const segments = parsePipeSpecs(product.tabs.ingredientsOrSpecs?.[lang]);
    const usedLabels = new Set<string>();
    const items: QuickSpecItem[] = segments.slice(0, 4).map((seg) => ({
      label: classifyHairSpecLabel(seg, lang, usedLabels),
      value: seg,
    }));

    if (items.length === 0) {
      items.push(
        {
          label: lang === 'ar' ? 'التقنية' : 'Technology',
          value: lang === 'ar' ? 'سيراميك بتوزيع حراري متوازن' : 'Balanced Ceramic Heat',
        },
        {
          label: lang === 'ar' ? 'الضمان المعتمد' : 'Warranty',
          value: lang === 'ar' ? 'ضمان سنتين شامل' : '2-Year Certified Warranty',
        }
      );
    }

    return {
      heading: lang === 'ar' ? 'المقاس والمواصفات السريعة' : 'Size & Quick Specifications',
      items,
    };
  }

  if (kind === 'box') {
    const rawSpecs = product.tabs.ingredientsOrSpecs?.[lang] || '';
    const segments = parsePipeSpecs(rawSpecs);
    const desc = product.tabs.description[lang];
    const countMatch = `${rawSpecs} ${desc}`.match(/(\d+)\s*(منتجات|قطع|products|essentials|items)/i);
    const derivedCount = countMatch
      ? Number(countMatch[1])
      : product.bundle?.items?.length
        ? product.bundle.items.length
        : 4;

    const piecesValue =
      lang === 'ar'
        ? `${derivedCount} مستحضرات أصلية بالحجم الكامل`
        : `${derivedCount} Full-Size Certified Essentials`;

    const packagingValue =
      segments.find((s) => /بوكس|صندوق|حقيبة|box|bag|velvet|wooden/i.test(s)) ||
      (lang === 'ar' ? 'تغليف هدايا فاخر جاهز للإهداء' : 'Luxury Ready-to-Gift Packaging');

    const extraValue =
      segments.find((s) => /هدية|بطاقة|gift|card/i.test(s)) ||
      (lang === 'ar' ? 'روتين متكامل مع دليل الاستخدام' : 'Complete Routine + Usage Guide');

    return {
      heading: lang === 'ar' ? 'حجم البكج ومحتوياته السريعة' : 'Set Size & Contents Overview',
      items: [
        {
          label: lang === 'ar' ? 'عدد القطع والحجم' : 'Set Size',
          value: piecesValue,
        },
        {
          label: lang === 'ar' ? 'التغليف' : 'Packaging',
          value: packagingValue,
        },
        {
          label: lang === 'ar' ? 'مزايا مرفقة' : 'Included Extras',
          value: extraValue,
        },
      ],
    };
  }

  // Skincare
  const { size, format, suitability } = inferSkincareSizeAndFormat(product, lang);
  return {
    heading: lang === 'ar' ? 'حجم العبوة ومواصفات التركيبة' : 'Bottle Size & Formula Profile',
    items: [
      {
        label: lang === 'ar' ? 'حجم العبوة' : 'Net Volume',
        value: size,
      },
      {
        label: lang === 'ar' ? 'القوام' : 'Texture',
        value: format,
      },
      {
        label: lang === 'ar' ? 'ملاءمة البشرة' : 'Skin Type',
        value: suitability,
      },
    ],
  };
}

/**
 * Returns tailored, non-repetitive copy for trust chips, accordions, and the comparison matrix.
 */
export function getPdpContextCopy(
  kind: PdpProductKind,
  storeName: string,
  lang: 'ar' | 'en'
): PdpContextCopy {
  if (kind === 'hair') {
    return lang === 'ar'
      ? {
          trustChips: [
            { id: 'warranty', label: 'ضمان سنتين معتمد', tone: 'purple' },
            { id: 'thermal', label: 'حماية حرارية للشعر', tone: 'emerald' },
            { id: 'cod', label: 'معاينة قبل الدفع', tone: 'amber' },
          ],
          descHighlights: [
            'تصميم هندسي مريح وخفيف الوزن لتصفيف سلس وسريع',
            'توزيع حرارة متوازن يحافظ على لمعان ورطوبة الشعر',
            'نتيجة صالون احترافية وثبات عالٍ من أول استخدام',
            'يشمل ضمان سنتين معتمد مع فحص كامل عند الاستلام',
          ],
          usageSteps: [
            {
              title: 'تجهيز الشعر',
              body: 'تأكدي من جفاف الشعر تماماً وتمشيطه لإزالة التشابك، ويُفضّل استخدام سيروم واقٍ من الحرارة.',
            },
            {
              title: 'ضبط الحرارة والتقسيم',
              body: 'اختاري الدرجة المناسبة لسمك شعركِ وقسّمي الشعر إلى خصلات متساوية لنتيجة متناسقة.',
            },
            {
              title: 'التصفيف والتثبيت',
              body: 'طبّقي الجهاز وفق الإرشادات واتركي كل خصلة تبرد لثوانٍ قبل التمشيط لثبات يدوم طويلاً.',
            },
          ],
          specsHeader: {
            title: 'المواصفات الفنية والضمان المعتمد',
            subtitle: 'المقاس، درجات الحرارة، تقنيات الحماية والضمان',
            badge: 'معتمد فنياً',
            sectionTitle: 'المواصفات التقنية للجهاز:',
            chips: ['تسخين سريع وآمن', 'حماية ضد التلف الحراري', 'ضمان سنتين معتمد'],
          },
          comparison: {
            title: `لماذا تختارين أجهزة الشعر من ${storeName}؟`,
            subtitle: 'مقارنة صريحة توضح الفارق في الأمان الحراري، جودة الألواح، والضمان الحقيقي.',
            competitorHeader: 'الأجهزة التقليدية بالسوق',
            rows: [
              {
                criterion: 'الحماية الحرارية وجودة الألواح',
                nadi: 'ألواح سيراميك وتورمالين تحمي الشعر من التقصف',
                competitor: 'ألواح رديئة تسبب جفاف وتلف ألياف الشعر',
              },
              {
                criterion: 'معاينة الجهاز عند الاستلام (COD)',
                nadi: 'فحص كامل للجهاز والتأكد قبل الدفع',
                competitor: 'دفع مسبق إجباري دون إمكانية المعاينة',
              },
              {
                criterion: 'الضمان والاستبدال المعتمد',
                nadi: 'ضمان سنتين شامل + استبدال خلال 14 يوماً',
                competitor: 'بدون ضمان حقيقي أو خدمة صيانة',
              },
              {
                criterion: 'الدعم بعد البيع',
                nadi: 'إرشاد مباشر عبر واتساب لاختيار الحرارة المثالية',
                competitor: 'انقطاع التواصل فور تسليم الشحنة',
              },
            ],
          },
        }
      : {
          trustChips: [
            { id: 'warranty', label: '2-Year Certified Warranty', tone: 'purple' },
            { id: 'thermal', label: 'Thermal Hair Protection', tone: 'emerald' },
            { id: 'cod', label: 'Inspect Before Payment', tone: 'amber' },
          ],
          descHighlights: [
            'Ergonomic, lightweight build for effortless daily styling',
            'Even heat distribution that locks in shine and moisture',
            'Long-lasting salon finish from the very first pass',
            'Backed by a 2-year certified warranty & COD inspection',
          ],
          usageSteps: [
            {
              title: 'Prep & Detangle',
              body: 'Start with completely dry, detangled hair and apply a light heat protectant if desired.',
            },
            {
              title: 'Set Heat & Section',
              body: 'Select the ideal temperature for your hair thickness and divide into even sections.',
            },
            {
              title: 'Style & Cool Lock',
              body: 'Style smoothly as directed and let each strand cool briefly before finger-combing.',
            },
          ],
          specsHeader: {
            title: 'Technical Specifications & Warranty',
            subtitle: 'Barrel size, heat levels, safety tech, and 2-year coverage',
            badge: 'Certified Tech',
            sectionTitle: 'Key Technical Specifications:',
            chips: ['Rapid Even Heating', 'Thermal Damage Shield', '2-Year Certified Warranty'],
          },
          comparison: {
            title: `Why Choose Hair Devices from ${storeName}?`,
            subtitle: 'An honest comparison of thermal safety, plate quality, and real warranty support.',
            competitorHeader: 'Generic Market Devices',
            rows: [
              {
                criterion: 'Thermal Protection & Plates',
                nadi: 'Tourmaline ceramic plates protect strands from heat damage',
                competitor: 'Uneven metal plates that scorch and dry out hair',
              },
              {
                criterion: 'Inspection on Delivery (COD)',
                nadi: 'Inspect device and authenticity before paying',
                competitor: 'Upfront payment with zero inspection guarantee',
              },
              {
                criterion: 'Certified Warranty & Swap',
                nadi: 'Full 2-year warranty + easy 14-day replacement',
                competitor: 'No real warranty or after-sales coverage',
              },
              {
                criterion: 'Post-Purchase Guidance',
                nadi: 'Direct WhatsApp guidance for your hair type',
                competitor: 'Zero support once the parcel is handed off',
              },
            ],
          },
        };
  }

  if (kind === 'box') {
    return lang === 'ar'
      ? {
          trustChips: [
            { id: 'fullsize', label: 'قطع أصلية بالحجم الكامل', tone: 'purple' },
            { id: 'gift', label: 'تغليف هدايا فاخر', tone: 'emerald' },
            { id: 'cod', label: 'فحص عند الاستلام', tone: 'amber' },
          ],
          descHighlights: [
            'روتين متكامل يضم منتجات أصلية متناغمة بالحجم الكامل',
            'تغليف فاخر جاهز للإهداء الفوري دون تكلفة إضافية',
            'توفير فعلي مقارنة بشراء كل منتج على حدة',
            'مرفق بدليل ترتيب الاستخدام الصباحي والمسائي',
          ],
          usageSteps: [
            {
              title: 'التنظيف والتهيئة',
              body: 'ابدئي بغسل البشرة وتجفيفها بلطف لتهيئتها لاستقبال خطوات البكج بأعلى فاعلية.',
            },
            {
              title: 'تطبيق الخطوات بالترتيب',
              body: 'طبّقي المستحضرات الأخف قواماً (التونر والسيروم) أولاً، ثم الكريم المرطب لحفظ النضارة.',
            },
            {
              title: 'الالتزام بالروتين',
              body: 'استمري على الروتين الصباحي والمسائي لنتائج إشراقة وترطيب متكاملة.',
            },
          ],
          specsHeader: {
            title: 'محتويات البكج وتفاصيل التغليف',
            subtitle: 'القطع المشمولة بالحجم الكامل، التغليف والهدايا المرفقة',
            badge: 'حجم كامل',
            sectionTitle: 'محتويات ومميزات البكج:',
            chips: ['منتجات أصلية بالحجم الكامل', 'تغليف فاخر جاهز للإهداء', 'توفير مضمون'],
          },
          comparison: {
            title: `لماذا تتميز بكجات ${storeName} عن بدائل السوق؟`,
            subtitle: 'مقارنة صريحة توضح القيمة الحقيقية، الأصالة، وجودة التغليف الفاخر.',
            competitorHeader: 'البكجات التقليدية بالسوق',
            rows: [
              {
                criterion: 'أصالة وحجم القطع',
                nadi: 'منتجات أصلية 100% بالحجم الكامل ومتناغمة للروتين',
                competitor: 'عينات صغيرة أو قطع غير مترابطة',
              },
              {
                criterion: 'تغليف وتجربة الإهداء',
                nadi: 'تغليف فاخر عازل للصدمات وجاهز للإهداء فوراً',
                competitor: 'تغليف عادي غير مناسب لتقديمه كهدية',
              },
              {
                criterion: 'معاينة الطلب عند الاستلام (COD)',
                nadi: 'فحص الشحنة ومحتويات البكج قبل الدفع بكل ثقة',
                competitor: 'دفع مسبق دون إمكانية المعاينة',
              },
              {
                criterion: 'الاستشارة والاستبدال الذهبي',
                nadi: 'استبدال ميسر خلال 14 يوماً + متابعة روتين عبر واتساب',
                competitor: 'انقطاع التواصل بعد التسليم',
              },
            ],
          },
        }
      : {
          trustChips: [
            { id: 'fullsize', label: 'Full-Size Authentic Items', tone: 'purple' },
            { id: 'gift', label: 'Luxury Gift Packaging', tone: 'emerald' },
            { id: 'cod', label: 'Inspect on Delivery', tone: 'amber' },
          ],
          descHighlights: [
            'Curated full-size essentials engineered to work in harmony',
            'Complimentary luxury gift box ready for instant gifting',
            'Real bundle savings compared to purchasing individually',
            'Includes a clear morning & evening step-by-step routine',
          ],
          usageSteps: [
            {
              title: 'Cleanse & Prep',
              body: 'Start by gently cleansing and patting skin dry to maximize absorption.',
            },
            {
              title: 'Layer in Order',
              body: 'Apply lighter textures (toner & serum) first, followed by moisturizer to seal hydration.',
            },
            {
              title: 'Daily Consistency',
              body: 'Follow the morning and night routine consistently for lasting radiance.',
            },
          ],
          specsHeader: {
            title: 'Set Contents & Packaging Details',
            subtitle: 'Included full-size pieces, gift box presentation & extras',
            badge: 'Full-Size Set',
            sectionTitle: 'Included in This Set:',
            chips: ['Full-Size Certified Items', 'Ready-to-Gift Luxury Box', 'Guaranteed Bundle Savings'],
          },
          comparison: {
            title: `Why ${storeName} Gift Sets Stand Apart?`,
            subtitle: 'A clear comparison of full-size authenticity, presentation, and real bundle value.',
            competitorHeader: 'Standard Market Sets',
            rows: [
              {
                criterion: 'Authenticity & Item Sizes',
                nadi: '100% authentic full-size essentials curated for one routine',
                competitor: 'Travel minis or mismatched filler items',
              },
              {
                criterion: 'Gift Presentation',
                nadi: 'Protective luxury packaging ready to gift immediately',
                competitor: 'Plain transit cartons unsuitable for gifting',
              },
              {
                criterion: 'Inspection on Delivery (COD)',
                nadi: 'Inspect every item inside before paying',
                competitor: 'Mandatory advance payment without inspection',
              },
              {
                criterion: 'Golden Swap & Routine Care',
                nadi: 'Easy 14-day swap + dedicated WhatsApp routine advice',
                competitor: 'No support after delivery',
              },
            ],
          },
        };
  }

  // Skincare default
  return lang === 'ar'
    ? {
        trustChips: [
          { id: 'botanical', label: 'نقاء نباتي 100%', tone: 'purple' },
          { id: 'sensitive', label: 'آمن للبشرة الحساسة', tone: 'emerald' },
          { id: 'cod', label: 'معاينة قبل الدفع', tone: 'amber' },
        ],
        descHighlights: [
          'تركيبة أصلية معتمدة بمستخلصات نباتية نقية',
          'قوام لطيف سريع الامتصاص يناسب الروتين اليومي',
          'خالٍ من البارابين والملوّنات القاسية على البشرة',
          'ترطيب ونضارة ملموسة مع الاستخدام المنتظم',
        ],
        usageSteps: [
          {
            title: 'التحضير والتنظيف',
            body: 'نظّفي البشرة وجفّفيها بلطف قبل البدء لضمان أعلى امتصاص.',
          },
          {
            title: 'التطبيق المتوازن',
            body: 'وزّعي كمية مناسبة بحركات دائرية هادئة حتى الامتصاص التام.',
          },
          {
            title: 'الانتظام اليومي',
            body: 'كرّري الاستخدام وفق الروتين الموصى به للحفاظ على إشراقة البشرة.',
          },
        ],
        specsHeader: {
          title: 'المكونات الفعالة والتركيبة النقية',
          subtitle: 'الخلاصات النباتية والمكونات الفعالة المختبرة',
          badge: 'تركيبة نقية',
          sectionTitle: 'المكونات الفعالة والتركيبة:',
          chips: ['مستخلصات نباتية نقية', 'خفيف سريع الامتصاص', 'لطيف على البشرة الحساسة'],
        },
        comparison: {
          title: `لماذا تتفوق مستحضرات ${storeName} على بدائل السوق؟`,
          subtitle: 'مقارنة صريحة توضح التزامنا بالنقاء النباتي، الفاعلية، والضمان الحقيقي.',
          competitorHeader: 'مستحضرات السوق العادية',
          rows: [
            {
              criterion: 'المكونات والنقاء النباتي',
              nadi: 'تركيبات نباتية نقية خالية من المواد القاسية',
              competitor: 'مركبات مجهولة المصدر ومواد حافظة قاسية',
            },
            {
              criterion: 'معاينة الطلب عند الاستلام (COD)',
              nadi: 'متاح فحص الشحنة والتأكد قبل الدفع',
              competitor: 'دفع مسبق إجباري دون ضمان المعاينة',
            },
            {
              criterion: 'الضمان والاستبدال الذهبي',
              nadi: 'أصالة مضمونة 100% واستبدال ميسر خلال 14 يوماً',
              competitor: 'بدون ضمان أو إجراءات استرجاع معقدة',
            },
            {
              criterion: 'الاستشارة والمتابعة بعد البيع',
              nadi: 'متابعة شخصية لاختيار الروتين عبر واتساب مجاناً',
              competitor: 'انقطاع التواصل فور تسليم الشحنة',
            },
          ],
        },
      }
    : {
        trustChips: [
          { id: 'botanical', label: '100% Pure Botanical', tone: 'purple' },
          { id: 'sensitive', label: 'Sensitive Skin Safe', tone: 'emerald' },
          { id: 'cod', label: 'Inspect Before Payment', tone: 'amber' },
        ],
        descHighlights: [
          'Certified authentic formula crafted with pure botanical extracts',
          'Lightweight, fast-absorbing texture designed for daily care',
          'Free from harsh parabens and irritating synthetic fillers',
          'Visible hydration and dewy radiance with consistent use',
        ],
        usageSteps: [
          {
            title: 'Cleanse & Prep',
            body: 'Ensure skin is freshly cleansed and gently patted dry before applying.',
          },
          {
            title: 'Even Application',
            body: 'Smooth an even layer with gentle upward motions until fully absorbed.',
          },
          {
            title: 'Daily Consistency',
            body: 'Repeat consistently as part of your morning and evening skincare ritual.',
          },
        ],
        specsHeader: {
          title: 'Active Ingredients & Pure Formulation',
          subtitle: 'Botanical extracts and skin-loving active ingredients',
          badge: 'Clean Formula',
          sectionTitle: 'Active Botanical Formulation:',
          chips: ['Pure Plant Extracts', 'Fast Absorbing', 'Sensitive Skin Safe'],
        },
        comparison: {
          title: `Why ${storeName} Outperforms Market Alternatives?`,
          subtitle: 'An honest comparison highlighting botanical purity, real efficacy, and our golden guarantee.',
          competitorHeader: 'Standard Market Products',
          rows: [
            {
              criterion: 'Botanical Purity & Formula',
              nadi: 'Clean botanical actives free from harsh preservatives',
              competitor: 'Synthetic fillers and harsh chemical additives',
            },
            {
              criterion: 'Inspection on Delivery (COD)',
              nadi: 'Full inspection before payment allowed',
              competitor: 'Mandatory upfront pay without inspection',
            },
            {
              criterion: 'Authenticity & Golden Swap',
              nadi: '100% authentic guarantee + easy 14-day replacement',
              competitor: 'No guarantee or restrictive return policies',
            },
            {
              criterion: 'Post-Purchase Routine Care',
              nadi: 'Complimentary WhatsApp skincare consultation',
              competitor: 'Zero support post-dispatch',
            },
          ],
        },
      };
}
