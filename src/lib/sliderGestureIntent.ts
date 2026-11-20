export type SliderGestureMode = 'pending' | 'horizontal' | 'vertical';

export const DEFAULT_SLIDER_INTENT_THRESHOLD_PX = 8;
export const HORIZONTAL_INTENT_BIAS = 1.15;

/**
 * Resolves touch/pointer gesture intent for horizontal comparison sliders inside vertically
 * scrollable pages. Yields immediately to vertical page scrolling unless horizontal travel
 * clearly exceeds vertical travel past the movement threshold.
 */
export function resolveSliderGestureIntent(
  dx: number,
  dy: number,
  thresholdPx: number = DEFAULT_SLIDER_INTENT_THRESHOLD_PX
): SliderGestureMode {
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);

  if (Math.hypot(absX, absY) < thresholdPx) {
    return 'pending';
  }

  if (absX >= absY * HORIZONTAL_INTENT_BIAS) {
    return 'horizontal';
  }

  return 'vertical';
}

const LEGACY_BA_BADGE_AR = new Set(['نتائج خلال أسبوعين', 'نتائج واقعية ومثبتة']);
const LEGACY_BA_TITLE_AR = new Set(['قبل وبعد (14 يوماً)', 'قبل وبعد (14 يوماً من النضارة)']);
const LEGACY_BA_SUBTITLE_AR = new Set([
  'اسحبي المؤشر لمشاهدة الفرق خلال 14 يوماً.',
  'مقارنة حقيقية لنضارة وترطيب البشرة قبل وبعد 14 يوماً من الاستخدام المنتظم لمنتجات نَدِي الطبيعية. اسحبي المؤشر لمعاينة الفرق.',
]);

export function resolveBeforeAfterCopy(
  media:
    | {
        badge?: { ar: string; en: string };
        title?: { ar: string; en: string };
        subtitle?: { ar: string; en: string };
      }
    | undefined,
  lang: 'ar' | 'en'
): { badge: string; title: string; subtitle: string } {
  if (lang === 'en') {
    const rawBadge = (media?.badge?.en || '').trim();
    const rawTitle = (media?.title?.en || '').trim();
    const rawSub = (media?.subtitle?.en || '').trim();
    return {
      badge: !rawBadge || rawBadge === '14-Day Results' ? 'Visible Results' : rawBadge,
      title: !rawTitle || rawTitle === 'Before & After (14 Days)' ? 'Before & After — 14 Days' : rawTitle,
      subtitle: !rawSub || rawSub === 'Drag to compare 14-day results.' ? 'Slide to compare.' : rawSub,
    };
  }

  const rawBadge = (media?.badge?.ar || '').trim();
  const rawTitle = (media?.title?.ar || '').trim();
  const rawSub = (media?.subtitle?.ar || '').trim();

  return {
    badge: !rawBadge || LEGACY_BA_BADGE_AR.has(rawBadge) ? 'نتائج ملموسة' : rawBadge,
    title: !rawTitle || LEGACY_BA_TITLE_AR.has(rawTitle) ? 'قبل وبعد — 14 يوماً' : rawTitle,
    subtitle: !rawSub || LEGACY_BA_SUBTITLE_AR.has(rawSub) ? 'اسحبي المؤشر للمقارنة.' : rawSub,
  };
}
