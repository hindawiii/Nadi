import React from 'react';

interface CustomCartIconProps {
  className?: string;
  accentColor?: string;
}

/**
 * CustomCartIcon - High-Fidelity Vector Reproduction of Reference Logo & Cart Icon
 * Features:
 * - Slanted top ergonomic handle
 * - Precision 2x4 grid compartment shopping basket
 * - Curved base undercarriage loop with signature red bookmark/ribbon accent
 * - Dual grounded cart wheels
 */
export const CustomCartIcon: React.FC<CustomCartIconProps> = ({
  className = "w-5 h-5",
  accentColor = "#E11D48", // Signature red accent ribbon from reference design
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      stroke="currentColor"
    >
      {/* 1. Handle on the left extending outward */}
      <path
        d="M2.5 3.75H5.6L6.6 5.75"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 2. Cart Basket - Outer Trapezoid Frame */}
      <path
        d="M6.5 5.75H20L18.5 13H7.8L6.5 5.75Z"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. Basket Grid - Horizontal Divider */}
      <path
        d="M7.15 9.35H19.25"
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      {/* 4. Basket Grid - Vertical Dividers (3 dividers forming 4 balanced columns) */}
      <path
        d="M9.8 5.75L10.3 13"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M13.25 5.75V13"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M16.7 5.75L16.2 13"
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      {/* 5. Base Undercarriage Loop / Ribbon Track */}
      <path
        d="M8 15.5H16.8C17.8 15.5 18.5 16.15 18.5 16.85C18.5 17.55 17.8 18.2 16.8 18.2H8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 6. Signature Center Accent Ribbon / Bookmark (from Reference Image) */}
      <rect
        x="12.1"
        y="14.8"
        width="1.8"
        height="3.8"
        rx="0.5"
        fill={accentColor}
        stroke="none"
      />

      {/* 7. Bottom Cart Wheels */}
      <circle cx="8.5" cy="20.3" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16.3" cy="20.3" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
};
