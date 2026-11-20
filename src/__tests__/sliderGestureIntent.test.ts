import { describe, it, expect } from 'vitest';
import {
  resolveBeforeAfterCopy,
  resolveSliderGestureIntent,
} from '../lib/sliderGestureIntent';

describe('sliderGestureIntent', () => {
  it('stays pending below movement threshold', () => {
    expect(resolveSliderGestureIntent(3, 2)).toBe('pending');
    expect(resolveSliderGestureIntent(-4, 4)).toBe('pending');
  });

  it('locks horizontal only when horizontal drag clearly dominates vertical movement', () => {
    expect(resolveSliderGestureIntent(18, 4)).toBe('horizontal');
    expect(resolveSliderGestureIntent(-14, 6)).toBe('horizontal');
  });

  it('yields to vertical page scroll when scrolling vertically or diagonally steep', () => {
    expect(resolveSliderGestureIntent(4, 16)).toBe('vertical');
    expect(resolveSliderGestureIntent(10, 10)).toBe('vertical');
    expect(resolveSliderGestureIntent(-5, -20)).toBe('vertical');
  });

  it('deduplicates legacy repetitive 14-day Before/After copy while preserving custom merchant edits', () => {
    expect(
      resolveBeforeAfterCopy(
        {
          badge: { ar: 'نتائج خلال أسبوعين', en: '14-Day Results' },
          title: { ar: 'قبل وبعد (14 يوماً)', en: 'Before & After (14 Days)' },
          subtitle: {
            ar: 'اسحبي المؤشر لمشاهدة الفرق خلال 14 يوماً.',
            en: 'Drag to compare 14-day results.',
          },
        },
        'ar'
      )
    ).toEqual({
      badge: 'نتائج ملموسة',
      title: 'قبل وبعد — 14 يوماً',
      subtitle: 'اسحبي المؤشر للمقارنة.',
    });

    expect(
      resolveBeforeAfterCopy(
        {
          badge: { ar: 'تجربة خاصة', en: 'Custom Tag' },
          title: { ar: 'نتيجة سيروم الورد', en: 'Rose Serum Result' },
          subtitle: { ar: 'اسحبي لمشاهدة الإشراقة', en: 'Drag to see glow' },
        },
        'ar'
      )
    ).toEqual({
      badge: 'تجربة خاصة',
      title: 'نتيجة سيروم الورد',
      subtitle: 'اسحبي لمشاهدة الإشراقة',
    });
  });
});
