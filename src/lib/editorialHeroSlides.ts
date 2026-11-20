export type EditorialCollectionId = 'skin' | 'hair' | 'box';

export interface EditorialHeroSlide {
  id: string;
  indexLabel: string;
  image: string;
  collectionId?: EditorialCollectionId;
  sectionLabel: { ar: string; en: string };
  alt: { ar: string; en: string };
  objectPosition: string;
}

export interface EditorialHeroAssets {
  skincare: string;
  haircare: string;
  bundles: string;
}

export interface BuildEditorialHeroSlidesParams {
  activePresetId: string;
  customHeroImage?: string;
  storeTitle: { ar: string; en: string };
  assets: EditorialHeroAssets;
}

// Legacy default Unsplash URL shipped in cosmetics preset; replaced automatically
// by our local editorial photography unless the merchant uploaded a custom photo.
export const LEGACY_DEFAULT_COSMETICS_HERO_IMAGE =
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80';

export function hasMerchantCustomHeroImage(heroImage?: string): boolean {
  const trimmed = (heroImage || '').trim();
  if (!trimmed) return false;
  return trimmed !== LEGACY_DEFAULT_COSMETICS_HERO_IMAGE;
}

export function formatHeroSlideNumber(zeroBasedIndex: number): string {
  const safeNum = Math.max(1, Math.floor(zeroBasedIndex) + 1);
  return String(safeNum).padStart(2, '0');
}

const LEGACY_COSMETICS_PRIMARY_AR = new Set(['تسوّق الآن', 'تسوق الآن']);
const LEGACY_COSMETICS_SECONDARY_AR = new Set(['شاهد العروض']);

// Smoothly upgrades legacy cached cosmetics CTA labels in localStorage/Firestore
// without overriding intentional custom text entered by the merchant.
export function resolveEditorialHeroCta(
  label: { ar: string; en: string },
  variant: 'primary' | 'secondary',
  activePresetId: string
): { ar: string; en: string } {
  if (activePresetId !== 'cosmetics') return label;

  const arTrimmed = (label?.ar || '').trim();
  const enTrimmed = (label?.en || '').trim();

  if (variant === 'primary') {
    return {
      ar: !arTrimmed || LEGACY_COSMETICS_PRIMARY_AR.has(arTrimmed) ? 'تسوّقي' : arTrimmed,
      en: enTrimmed || 'Shop Now',
    };
  }

  return {
    ar: !arTrimmed || LEGACY_COSMETICS_SECONDARY_AR.has(arTrimmed) ? 'شاهدي العروض' : arTrimmed,
    en: enTrimmed || 'View Offers',
  };
}

export function buildEditorialHeroSlides({
  activePresetId,
  customHeroImage,
  storeTitle,
  assets,
}: BuildEditorialHeroSlidesParams): EditorialHeroSlide[] {
  if (activePresetId !== 'cosmetics') {
    const fallbackSrc = (customHeroImage || '').trim() || assets.skincare;
    return [
      {
        id: `preset-${activePresetId}-01`,
        indexLabel: '01',
        image: fallbackSrc,
        sectionLabel: { ar: 'المجموعة المختارة', en: 'Featured Collection' },
        alt: storeTitle,
        objectPosition: 'object-center',
      },
    ];
  }

  const merchantHero = hasMerchantCustomHeroImage(customHeroImage)
    ? customHeroImage!.trim()
    : null;

  return [
    {
      id: 'hero-skincare',
      indexLabel: '01',
      image: merchantHero || assets.skincare,
      collectionId: 'skin',
      sectionLabel: { ar: 'العناية بالبشرة', en: 'Skincare' },
      alt: {
        ar: 'مستحضرات نَدِي للعناية الطبيعية بالبشرة',
        en: 'NADI botanical skincare essentials',
      },
      objectPosition: 'object-[50%_38%]',
    },
    {
      id: 'hero-haircare',
      indexLabel: '02',
      image: assets.haircare,
      collectionId: 'hair',
      sectionLabel: { ar: 'العناية بالشعر', en: 'Hair Care' },
      alt: {
        ar: 'أجهزة ومستحضرات نَدِي للعناية بالشعر',
        en: 'NADI hair care and styling essentials',
      },
      objectPosition: 'object-[50%_40%]',
    },
    {
      id: 'hero-bundles',
      indexLabel: '03',
      image: assets.bundles,
      collectionId: 'box',
      sectionLabel: { ar: 'البكجات والعروض', en: 'Bundles & Offers' },
      alt: {
        ar: 'بكجات وهدايا نَدِي الفاخرة للعناية المتكاملة',
        en: 'NADI luxury curated gift bundles',
      },
      objectPosition: 'object-[50%_35%]',
    },
  ];
}
