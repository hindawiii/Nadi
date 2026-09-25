import React from 'react';
import { CustomCartIcon } from '../icons/CustomCartIcon';

export interface StoreCartIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  accentColor?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

/**
 * StoreCartIcon - Centralized Single-Source-of-Truth Cart Icon Component.
 * Guarantees 100% brand visual consistency across:
 * - Header navigation
 * - Mobile drawers
 * - Product cards (Add to Bag CTAs)
 * - Product detail pages (PDP)
 * - Cart & Checkout page
 */
export const StoreCartIcon: React.FC<StoreCartIconProps> = ({
  className = '',
  size = 'md',
  accentColor = '#E11D48',
}) => {
  const hasCustomSize = /\bw-|\bh-/.test(className);
  const sizeClass = hasCustomSize ? '' : sizeMap[size || 'md'];

  return (
    <CustomCartIcon
      className={`${sizeClass} ${className} shrink-0 inline-block align-middle`.trim()}
      accentColor={accentColor}
    />
  );
};
