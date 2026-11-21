import React from 'react';

export interface SmartDiscountBadgeProps {
  basePriceUSD?: number;
  originalPriceUSD?: number;
  manualPercent?: number;
  lang?: 'ar' | 'en';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'rose' | 'emerald';
  displayStyle?: 'pill' | 'pendant';
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
 * Formats natural Arabic/English discount label ("خصم 30%" / "30% OFF").
 */
export function formatDiscountBadgeText(percent: number, lang: 'ar' | 'en' = 'ar'): string {
  return lang === 'ar' ? `خصم ${percent}%` : `${percent}% OFF`;
}

/**
 * SmartDiscountBadge - Universal Single-Source-of-Truth Discount Badge.
 * Supports:
 * - 'pendant': Sleek horizontal pointed boutique price-tag with eyelet pinhole & subtle GPU swing (Option A)
 * - 'pill': Clean inline discount pill for PDP and comparison tables
 */
export const SmartDiscountBadge: React.FC<SmartDiscountBadgeProps> = ({
  basePriceUSD,
  originalPriceUSD,
  manualPercent,
  lang = 'ar',
  size = 'md',
  variant = 'rose',
  displayStyle = 'pill',
  className = '',
}) => {
  const percent = calculateDiscountPercent(basePriceUSD, originalPriceUSD, manualPercent);

  if (!percent || percent <= 0) {
    return null;
  }

  const displayText = formatDiscountBadgeText(percent, lang);

  if (displayStyle === 'pendant') {
    const isRtl = lang === 'ar';
    const fillPrimary = variant === 'emerald' ? '#2B827A' : '#E11D48';
    const fillDeep = variant === 'emerald' ? '#1F635D' : '#BE123C';

    return (
      <div
        className={`animate-discount-pendant relative inline-flex items-center h-[21px] sm:h-[24px] select-none drop-shadow-[0_2px_4px_rgba(15,23,42,0.22)] ${className}`}
        aria-label={displayText}
        title={displayText}
      >
        {/* Compact Vector Pointed Price-Tag Silhouette (40% Slimmer without text prefix) */}
        <svg
          viewBox="0 0 74 28"
          preserveAspectRatio="none"
          className={`absolute inset-0 w-full h-full pointer-events-none ${isRtl ? '-scale-x-100' : ''}`}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`nadi-tag-grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={fillPrimary} />
              <stop offset="100%" stopColor={fillDeep} />
            </linearGradient>
          </defs>
          {/* Pointed tip pinned at edge with crisp rounded outer cap */}
          <path
            d="M 1,14 L 11,2.5 C 12.1,1.4 13.5,0.8 15.1,0.8 L 67.5,0.8 C 70.6,0.8 73.2,3.4 73.2,6.5 L 73.2,21.5 C 73.2,24.6 70.6,27.2 67.5,27.2 L 15.1,27.2 C 13.5,27.2 12.1,26.6 11,25.5 Z"
            fill={`url(#nadi-tag-grad-${variant})`}
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="1.1"
          />
          {/* Authentic Eyelet Pinhole at the Pointed Tip */}
          <circle cx="9.8" cy="14" r="2.2" fill="#FFFFFF" />
        </svg>

        {/* Pure Percentage Only: "%30" in Arabic (zero minus sign, zero word "خصم"), "30%" in English */}
        <div className="relative z-10 flex items-center ps-3.5 pe-2 sm:ps-4 sm:pe-2.5 text-white whitespace-nowrap">
          <span
            dir="ltr"
            className="text-[11px] sm:text-[12.5px] font-black leading-none tracking-tight tabular-nums"
          >
            {isRtl ? `%${percent}` : `${percent}%`}
          </span>
        </div>
      </div>
    );
  }

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 font-extrabold',
    sm: 'text-[10.5px] sm:text-[11px] px-2 py-0.5 font-extrabold',
    md: 'text-[11px] sm:text-xs px-2.5 py-1 font-extrabold',
    lg: 'text-xs sm:text-sm px-3 py-1 font-extrabold',
  };

  const bgClasses = variant === 'emerald'
    ? 'bg-[#2B827A] text-white'
    : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs';

  return (
    <span
      className={`inline-flex items-center justify-center gap-1 rounded-lg tracking-wide select-none whitespace-nowrap tabular-nums ${bgClasses} ${sizeClasses[size]} ${className}`}
      aria-label={displayText}
      title={displayText}
    >
      {lang === 'ar' ? (
        <>
          <span>خصم</span>
          <span dir="ltr">{percent}%</span>
        </>
      ) : (
        <span>{displayText}</span>
      )}
    </span>
  );
};
