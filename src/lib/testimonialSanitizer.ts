export interface BilingualText {
  ar: string;
  en: string;
}

export interface TestimonialItem {
  id: number;
  name: BilingualText;
  city: BilingualText;
  avatar?: string;
  purchasedProduct: BilingualText & { id: string };
  date: BilingualText;
  comment: BilingualText;
  badge: BilingualText;
  rating?: number;
  status?: string;
}

/**
 * Curated, realistic default reviews for NADI cosmetics (short, calm, zero exaggeration).
 */
export const DEFAULT_NADI_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 0,
    name: { ar: 'فاطمة عبدالله', en: 'Fatima Abdullah' },
    city: { ar: 'أم درمان', en: 'Omdurman' },
    purchasedProduct: { ar: 'مرطب الهيالورونيك المكثف', en: 'Intense Hyaluronic Moisturizer', id: 'sb-01' },
    date: { ar: 'منذ أسبوعين', en: '2 weeks ago' },
    comment: {
      ar: 'ترطيبه لطيف وملمسه خفيف على البشرة، ووصلني الطلب سريعاً.',
      en: 'Gentle hydration with a lightweight feel, and my order arrived quickly.',
    },
    badge: { ar: 'مشترية مؤكدة', en: 'Verified Buyer' },
    rating: 5,
  },
  {
    id: 1,
    name: { ar: 'ريم الصادق', en: 'Reem El Sadig' },
    city: { ar: 'الخرطوم', en: 'Khartoum' },
    purchasedProduct: { ar: 'سيروم فيتامين سي المشرق', en: 'Brightening Vitamin C Serum', id: 'sb-02' },
    date: { ar: 'منذ 3 أسابيع', en: '3 weeks ago' },
    comment: {
      ar: 'السيروم خفيف ويمتص بسرعة بدون لمعان دهني، حسّيت بنضارة هادئة.',
      en: 'Absorbs quickly without greasiness and left a soft, healthy glow.',
    },
    badge: { ar: 'مشترية مؤكدة', en: 'Verified Buyer' },
    rating: 5,
  },
  {
    id: 2,
    name: { ar: 'سارة عثمان', en: 'Sarah Osman' },
    city: { ar: 'بورتسودان', en: 'Port Sudan' },
    purchasedProduct: { ar: 'كريم الليل لتجديد الكولاجين', en: 'Collagen Renewal Night Cream', id: 'sb-03' },
    date: { ar: 'منذ شهر', en: '1 month ago' },
    comment: {
      ar: 'الكريم الليلي مريح وناعم قبل النوم، وبشرتي أصبحت أهدأ في الصباح.',
      en: 'Soothing and smooth before bed; my skin feels noticeably calmer by morning.',
    },
    badge: { ar: 'مشترية مؤكدة', en: 'Verified Buyer' },
    rating: 5,
  },
  {
    id: 3,
    name: { ar: 'مروة الطاهر', en: 'Marwa Al-Tahir' },
    city: { ar: 'الرياض', en: 'Riyadh' },
    purchasedProduct: { ar: 'مجموعة بوكس التوفير الكاملة', en: 'Natural Bloom Complete Box', id: 'sb-04' },
    date: { ar: 'منذ 3 أسابيع', en: '3 weeks ago' },
    comment: {
      ar: 'التغليف مرتب والمنتجات لطيفة على البشرة الحساسة، تجربة موفقة.',
      en: 'Thoughtful packaging and gentle on sensitive skin—a great experience overall.',
    },
    badge: { ar: 'مشترية مؤكدة', en: 'Verified Buyer' },
    rating: 5,
  },
];

// Signatures of legacy exaggerated seed reviews that may still be cached in Firestore/localStorage
const LEGACY_SEED_UPGRADES: Array<{ match: (item: TestimonialItem) => boolean; replacement: TestimonialItem }> = [
  {
    match: (item) =>
      item.name?.ar?.includes('فاطمة أم عبد الله') ||
      item.comment?.ar?.includes('أحس بالفرق من أول أسبوع'),
    replacement: DEFAULT_NADI_TESTIMONIALS[0],
  },
  {
    match: (item) =>
      item.comment?.ar?.includes('خفّف التصبغات تماماً') ||
      item.name?.ar?.includes('لولي ك.') ||
      item.comment?.ar?.includes('من أول استخدامين'),
    replacement: DEFAULT_NADI_TESTIMONIALS[1],
  },
  {
    match: (item) =>
      item.name?.ar?.includes('د. سارة عثمان') ||
      item.badge?.ar?.includes('طبيبة معتمدة') ||
      item.comment?.ar?.includes('كمتخصصة صيدلانية'),
    replacement: DEFAULT_NADI_TESTIMONIALS[2],
  },
  {
    match: (item) =>
      item.comment?.ar?.includes('أفضل منتجات عناية جربتها') ||
      item.comment?.ar?.includes('قمة في الذوق والمساعدة'),
    replacement: DEFAULT_NADI_TESTIMONIALS[3],
  },
];

/**
 * Strips literal checkmark glyphs so UI icons never render double checkmarks,
 * and harmonizes legacy masculine/awkward Arabic badges for cosmetics reviews.
 */
export function sanitizeReviewBadge(badge: BilingualText, isCosmetics: boolean): BilingualText {
  const cleanAr = (badge?.ar || '').replace(/[\u2713\u2714\u2705]/g, '').trim();
  const cleanEn = (badge?.en || '').replace(/[\u2713\u2714\u2705]/g, '').trim();

  let normalizedAr = cleanAr || (isCosmetics ? 'مشترية مؤكدة' : 'مشتري مؤكد');
  if (isCosmetics) {
    if (
      normalizedAr === 'مشتري مؤكد' ||
      normalizedAr === 'طبيبة معتمدة' ||
      normalizedAr === 'عميلة VIP دائم'
    ) {
      normalizedAr = 'مشترية مؤكدة';
    }
  }

  let normalizedEn = cleanEn || 'Verified Buyer';
  if (isCosmetics && normalizedEn === 'Verified Specialist') {
    normalizedEn = 'Verified Buyer';
  }

  return { ar: normalizedAr, en: normalizedEn };
}

/**
 * Extracts a single clean monogram initial from a customer name (ignoring titles like "د." or "Dr.").
 */
export function getReviewerInitial(rawName: string): string {
  const cleaned = (rawName || '')
    .replace(/^(د\.|أ\.|م\.|Dr\.|Ms\.|Mrs\.|Mr\.)\s*/i, '')
    .trim();
  if (!cleaned) return 'ن';
  return cleaned.charAt(0).toUpperCase();
}

/**
 * Upgrades persisted legacy seed reviews while preserving custom admin/user reviews untouched.
 */
export function normalizeTestimonialList(
  rawList: TestimonialItem[] | undefined,
  activePresetId: string
): TestimonialItem[] {
  const isCosmetics = activePresetId === 'cosmetics';
  const source = rawList && rawList.length > 0 ? rawList : DEFAULT_NADI_TESTIMONIALS;

  return source.map((item, idx) => {
    if (isCosmetics) {
      const legacyUpgrade = LEGACY_SEED_UPGRADES.find((rule) => rule.match(item));
      if (legacyUpgrade) {
        return {
          ...legacyUpgrade.replacement,
          id: item.id ?? idx,
          status: item.status,
        };
      }
    }

    return {
      ...item,
      badge: sanitizeReviewBadge(item.badge, isCosmetics),
    };
  });
}
