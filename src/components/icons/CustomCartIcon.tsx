import React from 'react';

interface CustomCartIconProps {
  className?: string;
  accentColor?: string;
}

/**
 * CustomCartIcon - High-Fidelity Vector Reproduction of Brand Logo & Cart Icon
 * Perfectly reproduces the brand identity from the official logo:
 * 1. Slanted top ergonomic handle extending from the left
 * 2. Precision 2x4 grid compartment shopping basket
 * 3. Curved base undercarriage loop with signature red ribbon / bookmark accent
 * 4. Dual grounded cart wheels
 */
export const CustomCartIcon: React.FC<CustomCartIconProps> = ({
  className = "w-5 h-5",
  accentColor = "#E11D48", // Signature red accent ribbon from brand logo
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      stroke="currentColor"
    >
      {/* 1. Slanted top handle extending outward to the left */}
      <path
        d="M2.5 3.8H5.6L6.6 5.8"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 2. Basket Outer Trapezoid Frame */}
      <path
        d="M6.5 5.8H20.2L18.6 13.2H7.6L6.5 5.8Z"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. Basket Grid - Horizontal Divider */}
      <path
        d="M7.1 9.5H19.4"
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      {/* 4. Basket Grid - Vertical Dividers (3 dividers creating 4 balanced columns) */}
      <path
        d="M9.8 5.8L10.3 13.2"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M13.3 5.8V13.2"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M16.8 5.8L16.3 13.2"
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      {/* 5. Base Undercarriage Loop / Curved Support Track */}
      <path
        d="M8.2 15.6H17.2C18.1 15.6 18.7 16.2 18.7 16.85C18.7 17.5 18.1 18.1 17.2 18.1H8.2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 6. Signature Red Accent Ribbon / Bookmark from the Reference Logo */}
      <rect
        x="12.2"
        y="14.9"
        width="1.8"
        height="3.8"
        rx="0.5"
        fill={accentColor}
        stroke="none"
      />

      {/* 7. Bottom Grounded Cart Wheels */}
      <circle cx="8.6" cy="20.4" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="16.4" cy="20.4" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
};
