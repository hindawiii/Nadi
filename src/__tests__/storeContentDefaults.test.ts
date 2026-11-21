import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PROMO_SLIDES,
  resolveAboutPageContent,
  resolveFaqSection,
  resolvePrivacyPolicyContent,
  resolvePromoSlides,
} from '../data/storeContentDefaults';
import { filterStoreFaqItems } from '../data/storeFaqData';
import { buildEditorialHeroSlides } from '../lib/editorialHeroSlides';

const STORE_NAME = { ar: 'نَـــــدِي', en: 'NADI' };
const MOCK_ASSETS = {
  skincare: '/assets/hero-skincare.webp',
  haircare: '/assets/hero-haircare.webp',
  bundles: '/assets/hero-bundles.webp',
};

describe('storeContentDefaults & cloud-editable content resolvers', () => {
  it('resolves all 4 Special Offer promo slides and preserves legacy image1/image2 overrides', () => {
    const legacyResolved = resolvePromoSlides({
      image1: 'https://cdn.example.com/custom-1.jpg',
      image2: 'https://cdn.example.com/custom-2.jpg',
    });
    expect(legacyResolved).toHaveLength(4);
    expect(legacyResolved[0].image).toBe('https://cdn.example.com/custom-1.jpg');
    expect(legacyResolved[1].image).toBe('https://cdn.example.com/custom-2.jpg');
    expect(legacyResolved[2].image).toBe(DEFAULT_PROMO_SLIDES[2].image);
    expect(legacyResolved[3].image).toBe(DEFAULT_PROMO_SLIDES[3].image);

    const customSlides = resolvePromoSlides({
      slides: [
        {
          id: 's-custom-3',
          image: 'https://cdn.example.com/slide-3.jpg',
          badge: { ar: 'عرض رمضان', en: 'Ramadan Offer' },
          title: { ar: 'هدية فاخرة', en: 'Luxury Gift' },
          desc: { ar: 'توصيل فوري مجاني', en: 'Free express shipping' },
        },
      ],
    });
    expect(customSlides).toHaveLength(1);
    expect(customSlides[0].title.ar).toBe('هدية فاخرة');
  });

  it('resolves custom cloud FAQ items and filters them accurately by category', () => {
    const resolved = resolveFaqSection({
      title: { ar: 'أسئلة عميلاتنا', en: 'Client Q&A' },
      items: [
        {
          id: 'custom-1',
          category: 'warranty',
          question: { ar: 'ما مدة الضمان الذهبي؟', en: 'How long is the warranty?' },
          answer: { ar: 'سنتان كاملتان مع استبدال فوري.', en: 'Full 2 years with replacement.' },
        },
      ],
    });

    expect(resolved.title.ar).toBe('أسئلة عميلاتنا');
    expect(filterStoreFaqItems('warranty', resolved.items)).toHaveLength(1);
    expect(filterStoreFaqItems('shipping', resolved.items)).toHaveLength(0);
  });

  it('merges partial About page overrides while falling back cleanly to store defaults', () => {
    const resolved = resolveAboutPageContent(
      {
        title: { ar: 'حكاية نَدِي الجديدة', en: 'New NADI Story' },
        missionBody: { ar: 'جودة أصلية دائماً', en: 'Always authentic quality' },
      },
      STORE_NAME
    );

    expect(resolved.title.ar).toBe('حكاية نَدِي الجديدة');
    expect(resolved.missionBody.ar).toBe('جودة أصلية دائماً');
    expect(resolved.visionTitle.en).toBe('Our Vision');
    expect(resolved.values.length).toBe(4);
    expect(resolved.ctaTitle.en).toContain('NADI');
  });

  it('resolves Privacy Policy defaults and applies admin clause overrides', () => {
    const defaultPolicy = resolvePrivacyPolicyContent(undefined, STORE_NAME);
    expect(defaultPolicy.highlights).toHaveLength(3);
    expect(defaultPolicy.sections).toHaveLength(6);
    expect(defaultPolicy.intro.ar).toContain(STORE_NAME.ar);

    const customPolicy = resolvePrivacyPolicyContent(
      {
        lastUpdated: { ar: 'آخر تحديث: ديسمبر 2026', en: 'Last updated: December 2026' },
        sections: [
          {
            id: 'custom-sec-1',
            icon: 'lock',
            title: { ar: '1. خصوصية مطلقة', en: '1. Strict Privacy' },
            body: { ar: 'بياناتك مشفرة بالكامل.', en: 'Your data is fully encrypted.' },
          },
        ],
      },
      STORE_NAME
    );
    expect(customPolicy.lastUpdated.en).toBe('Last updated: December 2026');
    expect(customPolicy.sections).toHaveLength(1);
    expect(customPolicy.sections[0].id).toBe('custom-sec-1');
  });

  it('supports admin-managed custom Editorial Hero slides with collection-based asset fallbacks', () => {
    const slides = buildEditorialHeroSlides({
      activePresetId: 'cosmetics',
      storeTitle: { ar: 'نضارة يومية', en: 'Daily Glow' },
      assets: MOCK_ASSETS,
      customSlides: [
        {
          id: 'custom-hero-1',
          image: 'https://cdn.example.com/banner-1.jpg',
          collectionId: 'skin',
          sectionLabel: { ar: 'روتين الشتاء', en: 'Winter Routine' },
          alt: { ar: 'روتين الشتاء', en: 'Winter Routine' },
        },
        {
          id: 'custom-hero-2',
          image: '',
          collectionId: 'hair',
          sectionLabel: { ar: 'أجهزة الشعر', en: 'Hair Devices' },
          alt: { ar: 'أجهزة الشعر', en: 'Hair Devices' },
        },
      ],
    });

    expect(slides).toHaveLength(2);
    expect(slides[0].indexLabel).toBe('01');
    expect(slides[0].image).toBe('https://cdn.example.com/banner-1.jpg');
    expect(slides[0].sectionLabel.ar).toBe('روتين الشتاء');
    expect(slides[1].indexLabel).toBe('02');
    expect(slides[1].image).toBe(MOCK_ASSETS.haircare);
  });
});
