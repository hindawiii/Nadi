import { describe, it, expect } from 'vitest';
import { formatSmartCardTitle } from '../lib/smartProductTitle';

describe('formatSmartCardTitle (Semantic Core-Preserving Card Title Engine)', () => {
  it('strips secondary trailing marketing adjectives while strictly preserving core product identity', () => {
    expect(formatSmartCardTitle('مرطب الهيالورونيك المكثف', 'ar')).toBe('مرطب الهيالورونيك');
    expect(formatSmartCardTitle('سيروم فيتامين سي النقي', 'ar')).toBe('سيروم فيتامين سي');
    expect(formatSmartCardTitle('كريم لافندر الليلي للترميم', 'ar')).toBe('كريم لافندر الليلي');
    expect(formatSmartCardTitle('بوكس العروس الملكي للنضارة', 'ar')).toBe('بوكس العروس الملكي');
    expect(formatSmartCardTitle('مجموعة التفتيح وتوحيد اللون', 'ar')).toBe('مجموعة التفتيح');
    expect(formatSmartCardTitle('غسول الشاي الأخضر المنقي', 'ar')).toBe('غسول الشاي الأخضر');
    expect(formatSmartCardTitle('كريم السيراميد المرمم للبشرة', 'ar')).toBe('كريم السيراميد');
    expect(formatSmartCardTitle('زيت الأرغان المغربي العضوي 100%', 'ar')).toBe('زيت الأرغان المغربي');
    expect(formatSmartCardTitle('مكواة فرد كلارا بالأيونات', 'ar')).toBe('مكواة فرد كلارا');
    expect(formatSmartCardTitle('مجفف أوكيما الذكي الهادئ', 'ar')).toBe('مجفف أوكيما الذكي');
  });

  it('strips technical hyphenated model codes like SLTK-12 and SLTK-10 from Arabic & English card titles', () => {
    expect(formatSmartCardTitle('جهاز تجعيد سل تيك SLTK-12', 'ar')).toBe('جهاز تجعيد سل تيك');
    expect(formatSmartCardTitle('Siltek Hair Waver SLTK-12', 'en')).toBe('Siltek Hair Waver');
    expect(formatSmartCardTitle('مصفف سل تيك 6 في 1 SLTK-10', 'ar')).toBe('مصفف سل تيك 6\u00A0في\u00A01');
    expect(formatSmartCardTitle('مجفف دايسون الاحترافي DY-450', 'ar')).toBe('مجفف دايسون');
  });

  it('preserves cosmetic actives, vitamins, SPF, karats, and barrel sizes cleanly', () => {
    expect(formatSmartCardTitle('مموج شيقلام بيتش بيب 25مم', 'ar')).toBe('مموج شيقلام بيتش بيب 25مم');
    expect(formatSmartCardTitle('سيروم الهيالورونيك 2% + B5', 'ar')).toBe('سيروم الهيالورونيك 2% + B5');
    expect(formatSmartCardTitle('واقي شمس مائي SPF 50+', 'ar')).toBe('واقي شمس مائي SPF\u00A050+');
    expect(formatSmartCardTitle('لصقات الهيدروجيل الذهبية 24K', 'ar')).toBe('لصقات الهيدروجيل الذهبية 24K');
    expect(formatSmartCardTitle('استشوار توربو احترافي 2200 واط', 'ar')).toBe('استشوار توربو احترافي 2200\u00A0واط');
  });

  it('removes redundant Latin parenthetical tags from Arabic card titles while keeping Arabic parenthetical info', () => {
    expect(formatSmartCardTitle('سترة صوفية شتوية فاخرة (Overcoat)', 'ar')).toBe('سترة صوفية شتوية');
    expect(formatSmartCardTitle('ساعة ذكية برو بمستشعر صحي متطور (Ultra)', 'ar')).toBe('ساعة ذكية برو');
    expect(formatSmartCardTitle('ماسك الشاي والسنتيلا (5 قطع)', 'ar')).toBe('ماسك الشاي والسنتيلا (5\u00A0قطع)');
  });

  it('enforces core-identity guardrail: never strips a 2-word title down to 1 word or empty string', () => {
    expect(formatSmartCardTitle('مرطب مكثف', 'ar')).toBe('مرطب مكثف');
    expect(formatSmartCardTitle('سيروم النقي', 'ar')).toBe('سيروم النقي');
    expect(formatSmartCardTitle('SLTK-12', 'ar')).toBe('SLTK-12');
    expect(formatSmartCardTitle('', 'ar')).toBe('');
  });
});
