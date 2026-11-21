/**
 * Smart Semantic Product Card Title Engine
 * Automatically refines product titles for compact single-line storefront cards
 * WITHOUT ever removing the core identity (product type + brand / active ingredient).
 * The full official product title remains 100% intact in PDP, Cart, Checkout, Invoices, and WhatsApp orders.
 *
 * Guardrail:
 * - Every reduction step is verified to leave at least 2 core words (or >= 8 characters)
 *   so the essence of any product is NEVER lost — even for newly added products.
 */

const ARABIC_MULTIWORD_SECONDARY_SUFFIXES: RegExp[] = [
  /\s+وتوحيد\s+اللون$/u,
  /\s+لتوحيد\s+اللون$/u,
  /\s+المرمم\s+للبشرة$/u,
  /\s+العضوي\s+100%$/u,
  /\s+النقي\s+100%$/u,
  /\s+قابل\s+للطي\s+مع\s+دفيوزر$/u,
  /\s+بشعيرات\s+طبيعية$/u,
  /\s+بمستشعر\s+صحي\s+متطور$/u,
  /\s+عازلة\s+للضوضاء$/u,
  /\s+فائق\s+الهدوء$/u,
  /\s+مع\s+دفيوزر$/u,
  /\s+للترميم\s+الليلي$/u,
  /\s+لتنقية\s+المسام$/u,
  /\s+لمحيط\s+العين$/u,
  /\s+لشد\s+الرقبة$/u,
];

const ARABIC_SINGLE_SECONDARY_SUFFIXES: RegExp[] = [
  /\s+المكثف$/u,
  /\s+النقي$/u,
  /\s+المنقي$/u,
  /\s+للترميم$/u,
  /\s+للنضارة$/u,
  /\s+المهدئ$/u,
  /\s+المرطب$/u,
  /\s+المرمم$/u,
  /\s+للبشرة$/u,
  /\s+للمسام$/u,
  /\s+للشد$/u,
  /\s+للتفتيح$/u,
  /\s+الكامل$/u,
  /\s+الهادئ$/u,
  /\s+العضوي$/u,
  /\s+بالأيونات$/u,
  /\s+احترافي$/u,
  /\s+الاحترافي$/u,
  /\s+للشعر$/u,
  /\s+المتكامل$/u,
  /\s+المتطور$/u,
  /\s+الفاخر$/u,
  /\s+فاخرة$/u,
  /\s+100%$/u,
];

const ENGLISH_SECONDARY_SUFFIXES: RegExp[] = [
  /\s+Complete$/i,
  /\s+Solution$/i,
  /\s+Recovery$/i,
  /\s+100%$/i,
];

function countMeaningfulWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 0 && !/^[-–—|+()]+$/.test(token)).length;
}

function applySafeSuffixStripping(input: string, patterns: RegExp[]): string {
  let current = input.trim();
  let changed = true;

  // Iteratively strip trailing secondary descriptors only while >= 2 core words remain
  while (changed) {
    changed = false;
    for (const pattern of patterns) {
      if (pattern.test(current)) {
        const candidate = current.replace(pattern, '').trim();
        if (countMeaningfulWords(candidate) >= 2) {
          current = candidate;
          changed = true;
          break;
        }
      }
    }
  }

  return current;
}

export function formatSmartCardTitle(rawTitle: string, lang: 'ar' | 'en' = 'ar'): string {
  const original = typeof rawTitle === 'string' ? rawTitle.trim() : '';
  if (!original) return '';

  let cleaned = original;

  // 1. In Arabic mode, strip redundant Latin-only parenthetical tags e.g. "(Overcoat)", "(Ultra)"
  if (lang === 'ar') {
    const withoutLatinParens = cleaned.replace(/\s*\([A-Za-z0-9\s\-+./]+\)/g, ' ').trim();
    if (countMeaningfulWords(withoutLatinParens) >= 2) {
      cleaned = withoutLatinParens;
    }
  }

  // 2. Strip standalone technical model/SKU codes (e.g., SLTK-12, SLTK-10, DY-450)
  //    while preserving cosmetic ingredients/metrics (SPF 50+, B5, 24K, 25مم, 32mm)
  const withoutCodes = cleaned
    .replace(/(?:^|[\s\-–—])([A-Za-z]{2,8}[-_]\d{1,5}[A-Za-z0-9]*)(?=$|[\s,.)])/g, ' ')
    .replace(/(?:^|[\s\-–—])([A-Z]{3,8}\d{2,5}[A-Z]?)(?=$|[\s,.)])/g, ' ')
    .replace(/\s*[-–—|]+\s*$/g, '')
    .replace(/^\s*[-–—|]+\s*/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  if (countMeaningfulWords(withoutCodes) >= 2) {
    cleaned = withoutCodes;
  }

  // 3. Strip secondary trailing marketing/purpose phrases ONLY when core product identity (>= 2 words) stays intact
  if (lang === 'ar') {
    cleaned = applySafeSuffixStripping(cleaned, ARABIC_MULTIWORD_SECONDARY_SUFFIXES);
    cleaned = applySafeSuffixStripping(cleaned, ARABIC_SINGLE_SECONDARY_SUFFIXES);
  } else {
    cleaned = applySafeSuffixStripping(cleaned, ENGLISH_SECONDARY_SUFFIXES);
  }

  // Normalize leftover whitespace / trailing connectors
  cleaned = cleaned
    .replace(/\s*[-–—|]+\s*$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  if (!cleaned) {
    cleaned = original;
  }

  // 4. Glue compound measurements & key tokens with non-breaking spaces so units never split awkwardly
  cleaned = cleaned
    .replace(/(\d+)\s+في\s+(\d+)/g, '$1\u00A0في\u00A0$2')
    .replace(/\bSPF\s+(\d+\+?)/gi, 'SPF\u00A0$1')
    .replace(/(\d+)\s+(مم|مل|واط|قطعة|قطع|mm|ml|W)(?=$|[\s,.)!؟])/gi, '$1\u00A0$2');

  return cleaned;
}
