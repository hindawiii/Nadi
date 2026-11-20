import { describe, expect, it } from 'vitest';
import {
  DEFAULT_NADI_TESTIMONIALS,
  getReviewerInitial,
  normalizeTestimonialList,
  sanitizeReviewBadge,
  TestimonialItem,
} from '../lib/testimonialSanitizer';

describe('testimonialSanitizer', () => {
  it('removes duplicate checkmark symbols and harmonizes cosmetics badges to feminine Arabic', () => {
    expect(
      sanitizeReviewBadge({ ar: 'مشتري مؤكد ✓', en: 'Verified Buyer ✓' }, true)
    ).toEqual({ ar: 'مشترية مؤكدة', en: 'Verified Buyer' });

    expect(
      sanitizeReviewBadge({ ar: 'طبيبة معتمدة', en: 'Verified Specialist' }, true)
    ).toEqual({ ar: 'مشترية مؤكدة', en: 'Verified Buyer' });

    expect(
      sanitizeReviewBadge({ ar: 'عميلة VIP دائم', en: 'VIP Customer' }, true)
    ).toEqual({ ar: 'مشترية مؤكدة', en: 'VIP Customer' });
  });

  it('upgrades persisted legacy exaggerated seed reviews automatically', () => {
    const legacySeed: TestimonialItem[] = [
      {
        id: 0,
        name: { ar: 'فاطمة أم عبد الله', en: 'Fatima Um Abdallah' },
        city: { ar: 'أم درمان، السودان', en: 'Omdurman, Sudan' },
        purchasedProduct: { ar: 'مرطب', en: 'Moisturizer', id: 'sb-01' },
        date: { ar: 'منذ أسبوعين', en: '2 weeks ago' },
        comment: {
          ar: 'أحس بالفرق من أول أسبوع! أنصح به كل صديقاتي.',
          en: 'Felt the glow in the first week!',
        },
        badge: { ar: 'مشتري مؤكد ✓', en: 'Verified Buyer ✓' },
      },
      {
        id: 1,
        name: { ar: 'ريم الصادق', en: 'Reem El Sadig' },
        city: { ar: 'الخرطوم بحري', en: 'Bahri' },
        purchasedProduct: { ar: 'سيروم', en: 'Serum', id: 'sb-02' },
        date: { ar: 'منذ 3 أسابيع', en: '3 weeks ago' },
        comment: {
          ar: 'سيروم فيتامين سي خفّف التصبغات تماماً بعد رحلة البحر.',
          en: 'Cleared hyperpigmentation completely.',
        },
        badge: { ar: 'مشتري مؤكد ✓', en: 'Verified Buyer ✓' },
      },
      {
        id: 2,
        name: { ar: 'د. سارة عثمان', en: 'Dr. Sarah Osman' },
        city: { ar: 'بورتسودان', en: 'Port Sudan' },
        purchasedProduct: { ar: 'كريم الليل', en: 'Night Cream', id: 'sb-03' },
        date: { ar: 'منذ شهر', en: '1 month ago' },
        comment: {
          ar: 'كمتخصصة صيدلانية، أعجبني جداً وضوح قائمة المكونات.',
          en: 'As a pharmacist...',
        },
        badge: { ar: 'طبيبة معتمدة', en: 'Verified Specialist' },
      },
    ];

    const normalized = normalizeTestimonialList(legacySeed, 'cosmetics');
    expect(normalized[0].name.ar).toBe('فاطمة عبدالله');
    expect(normalized[1].comment.ar).not.toContain('تماماً');
    expect(normalized[2].name.ar).toBe('سارة عثمان');
    expect(normalized[2].badge.ar).toBe('مشترية مؤكدة');
    expect(normalized.every((item) => !item.badge.ar.includes('✓'))).toBe(true);
  });

  it('preserves genuine custom user-submitted reviews while cleaning checkmarks', () => {
    const customReview: TestimonialItem = {
      id: 99,
      name: { ar: 'هدى م.', en: 'Huda M.' },
      city: { ar: 'مدني', en: 'Madani' },
      purchasedProduct: { ar: 'غسول لطيف', en: 'Gentle Cleanser', id: 'sb-05' },
      date: { ar: 'اليوم', en: 'Today' },
      comment: { ar: 'غسول ناعم ومناسب للاستخدام اليومي.', en: 'Gentle cleanser for daily use.' },
      badge: { ar: 'مشتري مؤكد ✓', en: 'Verified Buyer ✓' },
    };

    const [result] = normalizeTestimonialList([customReview], 'cosmetics');
    expect(result.name.ar).toBe('هدى م.');
    expect(result.comment.ar).toBe('غسول ناعم ومناسب للاستخدام اليومي.');
    expect(result.badge.ar).toBe('مشترية مؤكدة');
  });

  it('extracts clean monogram initials ignoring honorific prefixes', () => {
    expect(getReviewerInitial('فاطمة عبدالله')).toBe('ف');
    expect(getReviewerInitial('د. سارة عثمان')).toBe('س');
    expect(getReviewerInitial('Dr. Sarah Osman')).toBe('S');
    expect(DEFAULT_NADI_TESTIMONIALS.length).toBe(4);
  });
});
