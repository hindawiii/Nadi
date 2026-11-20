import { describe, it, expect } from 'vitest';
import {
  LEGACY_DEFAULT_COSMETICS_HERO_IMAGE,
  buildEditorialHeroSlides,
  formatHeroSlideNumber,
  hasMerchantCustomHeroImage,
  resolveEditorialHeroCta,
} from '../lib/editorialHeroSlides';

const MOCK_ASSETS = {
  skincare: '/assets/hero-skincare.jpg',
  haircare: '/assets/hero-haircare.jpg',
  bundles: '/assets/hero-bundles.jpg',
};

describe('editorialHeroSlides', () => {
  it('builds 3 section-mapped slides for cosmetics using local assets when default hero URL is present', () => {
    const slides = buildEditorialHeroSlides({
      activePresetId: 'cosmetics',
      customHeroImage: LEGACY_DEFAULT_COSMETICS_HERO_IMAGE,
      storeTitle: { ar: 'عناية طبيعية، لنضارة يومية', en: 'Natural care, everyday glow' },
      assets: MOCK_ASSETS,
    });

    expect(slides).toHaveLength(3);
    expect(slides.map((s) => s.collectionId)).toEqual(['skin', 'hair', 'box']);
    expect(slides.map((s) => s.indexLabel)).toEqual(['01', '02', '03']);
    expect(slides[0].image).toBe(MOCK_ASSETS.skincare);
    expect(slides[1].image).toBe(MOCK_ASSETS.haircare);
    expect(slides[2].image).toBe(MOCK_ASSETS.bundles);
  });

  it('preserves a merchant-uploaded custom hero image on slide 01 while keeping section 02 and 03 slides', () => {
    const customUrl = 'https://cdn.example.com/my-custom-campaign.jpg';
    expect(hasMerchantCustomHeroImage(customUrl)).toBe(true);
    expect(hasMerchantCustomHeroImage(LEGACY_DEFAULT_COSMETICS_HERO_IMAGE)).toBe(false);
    expect(hasMerchantCustomHeroImage('   ')).toBe(false);

    const slides = buildEditorialHeroSlides({
      activePresetId: 'cosmetics',
      customHeroImage: customUrl,
      storeTitle: { ar: 'عناية طبيعية', en: 'Natural care' },
      assets: MOCK_ASSETS,
    });

    expect(slides).toHaveLength(3);
    expect(slides[0].image).toBe(customUrl);
    expect(slides[1].image).toBe(MOCK_ASSETS.haircare);
    expect(slides[2].image).toBe(MOCK_ASSETS.bundles);
  });

  it('returns a single clean slide for non-cosmetics presets', () => {
    const slides = buildEditorialHeroSlides({
      activePresetId: 'fashion',
      customHeroImage: 'https://cdn.example.com/fashion-hero.jpg',
      storeTitle: { ar: 'أزياء فاخرة', en: 'Luxury Fashion' },
      assets: MOCK_ASSETS,
    });

    expect(slides).toHaveLength(1);
    expect(slides[0].image).toBe('https://cdn.example.com/fashion-hero.jpg');
    expect(slides[0].indexLabel).toBe('01');
  });

  it('formats zero-based indices as zero-padded two-digit strings', () => {
    expect(formatHeroSlideNumber(0)).toBe('01');
    expect(formatHeroSlideNumber(2)).toBe('03');
    expect(formatHeroSlideNumber(-1)).toBe('01');
  });

  it('upgrades legacy cosmetics CTA copy while preserving custom merchant CTA labels', () => {
    expect(
      resolveEditorialHeroCta({ ar: 'تسوّق الآن', en: 'Shop Now' }, 'primary', 'cosmetics')
    ).toEqual({ ar: 'تسوّقي', en: 'Shop Now' });

    expect(
      resolveEditorialHeroCta({ ar: 'شاهد العروض', en: 'View Offers' }, 'secondary', 'cosmetics')
    ).toEqual({ ar: 'شاهدي العروض', en: 'View Offers' });

    expect(
      resolveEditorialHeroCta({ ar: 'اطلبي تشكيلتك', en: 'Order Now' }, 'primary', 'cosmetics')
    ).toEqual({ ar: 'اطلبي تشكيلتك', en: 'Order Now' });

    expect(
      resolveEditorialHeroCta({ ar: 'تسوّق الآن', en: 'Shop Now' }, 'primary', 'fashion')
    ).toEqual({ ar: 'تسوّق الآن', en: 'Shop Now' });
  });
});
