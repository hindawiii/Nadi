import React from 'react';

export interface SmartDiscountBadgeProps {
  basePriceUSD?: number;
  originalPriceUSD?: number;
  manualPercent?: number;
  lang?: 'ar' | 'en';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'rose' | 'emerald';
  className?: string;
}

/**
 * Calculates discount percentage dynamically from prices.
 * Returns null if no valid positive discount exists.
 */
export function calculateDiscountPercent(
  basePriceUSD?: number,
  originalPriceUSD?: number,
  manualPercent?: number
): number | null {
  if (manualPercent && manualPercent > 0) {
    return Math.round(manualPercent);
  }
  if (!originalPriceUSD || !basePriceUSD || originalPriceUSD <= basePriceUSD) {
    return null;
  }
  const pct = Math.round(((originalPriceUSD - basePriceUSD) / originalPriceUSD) * 100);
  return pct > 0 ? pct : null;
}

/**
 * Formats a clear, unambiguous localized discount badge label.
 */
export function formatDiscountBadgeText(percent: number, lang: 'ar' | 'en' = 'ar'): string {
  return lang === 'ar' ? `خصم ${percent}%` : `-${percent}%`;
}

/**
 * SmartDiscountBadge - Universal Single-Source-of-Truth Discount Badge.
 * High-end luxury discount styling (Rose-Red #E11D48 / Emerald #2B827A).
 */
export const SmartDiscountBadge: React.FC<SmartDiscountBadgeProps> = ({
  basePriceUSD,
  originalPriceUSD,
  manualPercent,
  lang = 'ar',
  size = 'md',
  variant = 'rose',
  className = '',
}) => {
  const percent = calculateDiscountPercent(basePriceUSD, originalPriceUSD, manualPercent);

  if (!percent || percent <= 0) {
    return null;
  }

  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5 font-extrabold',
    sm: 'text-[10.5px] sm:text-[11px] px-2.5 py-0.5 font-extrabold',
    md: 'text-[11px] sm:text-xs px-2.5 py-1 font-extrabold',
    lg: 'text-xs sm:text-sm px-3 py-1 font-extrabold',
  };

  const bgClasses = variant === 'emerald' 
    ? 'bg-[#2B827A] text-white' 
    : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs';

  const displayText = formatDiscountBadgeText(percent, lang);

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg tracking-wide select-none whitespace-nowrap tabular-nums ${bgClasses} ${sizeClasses[size]} ${className}`}
      aria-label={lang === 'ar' ? `خصم ${percent}%` : `Discount: ${percent}%`}
      title={lang === 'ar' ? `خصم ${percent}%` : `Discount: ${percent}%`}
    >
      <span>{displayText}</span>
    </span>
  );
};
