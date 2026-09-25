import React from 'react';

export interface SmartDiscountBadgeProps {
  basePriceUSD?: number;
  originalPriceUSD?: number;
  manualPercent?: number;
  lang?: 'ar' | 'en';
  size?: 'sm' | 'md' | 'lg';
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
 * SmartDiscountBadge - Universal Single-Source-of-Truth Discount Badge.
 * Enforces:
 * - Standard Arabic prefix 'خ%' (e.g. خ20%, خ35%)
 * - Standard English prefix '-%' (e.g. -20%, -35%)
 * - Zero occurrence of outdated words like 'وفر'
 * - High-end emerald brand styling (#2B827A)
 */
export const SmartDiscountBadge: React.FC<SmartDiscountBadgeProps> = ({
  basePriceUSD,
  originalPriceUSD,
  manualPercent,
  lang = 'ar',
  size = 'md',
  className = '',
}) => {
  const percent = calculateDiscountPercent(basePriceUSD, originalPriceUSD, manualPercent);

  if (!percent || percent <= 0) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-[10px] sm:text-[11px] px-2 py-0.5 rounded-lg',
    md: 'text-[11px] sm:text-xs px-2.5 py-1 rounded-xl',
    lg: 'text-xs sm:text-sm px-3 py-1 rounded-xl',
  };

  const displayText = lang === 'ar' ? `خ${percent}%` : `-${percent}%`;

  return (
    <span
      className={`inline-flex items-center justify-center font-black tracking-wide shadow-xs bg-[#2B827A] text-white select-none whitespace-nowrap ${sizeClasses[size]} ${className}`}
      aria-label={`Discount: ${percent}%`}
      title={`Discount: ${percent}%`}
    >
      <span>{displayText}</span>
    </span>
  );
};
