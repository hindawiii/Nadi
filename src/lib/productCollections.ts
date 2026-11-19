import { Product } from '../data/siteConfig';

export type PrimaryCollectionId = 'skin' | 'box' | 'hair';
export type ProductCollectionId = PrimaryCollectionId | 'other';

export const COLLECTION_LABELS: Record<PrimaryCollectionId, { ar: string; en: string }> = {
  skin: { ar: 'عناية بالبشرة', en: 'Skincare' },
  box: { ar: 'بكجات وعروض', en: 'Gift Sets' },
  hair: { ar: 'أجهزة الشعر', en: 'Hair Devices' },
};

/**
 * Single mutually-exclusive classifier so every cosmetics product belongs
 * to strictly one collection (sum of collections === total catalog count).
 */
export function classifyProductCollection(
  p: Pick<Product, 'id' | 'category'>
): ProductCollectionId {
  const catEn = p.category.en.toLowerCase();
  const catAr = p.category.ar;

  if (
    p.id.startsWith('bundle-') ||
    catEn.includes('box') ||
    catEn.includes('gift') ||
    catAr.includes('بكج')
  ) {
    return 'box';
  }
  if (p.id.startsWith('hd-') || catEn.includes('hair') || catAr.includes('شعر')) {
    return 'hair';
  }
  if (
    p.id.startsWith('sb-') ||
    catEn.includes('skin') ||
    catAr.includes('بشرة') ||
    catAr.includes('ترميم')
  ) {
    return 'skin';
  }
  return 'other';
}

/**
 * Returns a clean single-language category label (no mixed bilingual
 * parentheticals such as "العناية بالبشرة (Skincare)").
 */
export function getCleanCategoryLabel(
  p: Pick<Product, 'id' | 'category'>,
  lang: 'ar' | 'en'
): string {
  const collection = classifyProductCollection(p);
  if (collection !== 'other') {
    return COLLECTION_LABELS[collection][lang];
  }

  const raw = p.category[lang] || p.category.ar || p.category.en || '';
  if (lang === 'ar') {
    // Strip trailing Latin parentheticals like "(Skincare)" from Arabic labels
    return raw.replace(/\s*\([A-Za-z0-9\s&/\-+]+\)\s*$/g, '').trim() || raw.trim();
  }
  // Strip trailing Arabic parentheticals if present in English labels
  return raw.replace(/\s*\([\u0600-\u06FF\s&/\-+]+\)\s*$/g, '').trim() || raw.trim();
}

export interface SearchCollectionItem {
  id: string;
  isUnifiedCollection: boolean;
  label: { ar: string; en: string };
  count: number;
}

/**
 * Builds consistent search category cards matching the storefront collection tabs.
 */
export function buildSearchCollections(
  products: Product[],
  activePresetId?: string
): SearchCollectionItem[] {
  const useUnifiedCosmetics =
    activePresetId === 'cosmetics' ||
    (products.length > 0 && products.every((p) => classifyProductCollection(p) !== 'other'));

  if (useUnifiedCosmetics) {
    const counts: Record<PrimaryCollectionId, number> = { skin: 0, box: 0, hair: 0 };
    for (const p of products) {
      const col = classifyProductCollection(p);
      if (col !== 'other') {
        counts[col] += 1;
      }
    }

    const orderedIds: PrimaryCollectionId[] = ['skin', 'box', 'hair'];
    return orderedIds
      .filter((id) => counts[id] > 0)
      .map((id) => ({
        id,
        isUnifiedCollection: true,
        label: COLLECTION_LABELS[id],
        count: counts[id],
      }));
  }

  const categoriesMap = new Map<string, SearchCollectionItem>();
  for (const p of products) {
    const key = p.category.en.trim().toLowerCase();
    const existing = categoriesMap.get(key);
    if (!existing) {
      categoriesMap.set(key, {
        id: key,
        isUnifiedCollection: false,
        label: {
          ar: getCleanCategoryLabel(p, 'ar'),
          en: getCleanCategoryLabel(p, 'en'),
        },
        count: 1,
      });
    } else {
      existing.count += 1;
    }
  }

  return Array.from(categoriesMap.values());
}

export function matchesSearchCollection(
  p: Product,
  collection: Pick<SearchCollectionItem, 'id' | 'isUnifiedCollection'>
): boolean {
  if (collection.isUnifiedCollection) {
    return classifyProductCollection(p) === collection.id;
  }
  return p.category.en.trim().toLowerCase() === collection.id;
}
