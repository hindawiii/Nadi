import React from 'react';

interface CustomCartIconProps {
  className?: string;
  accentColor?: string;
}

/**
 * CustomCartIcon - High-Fidelity Vector Luxe Shopping Bag & Basket Icon
 * Features:
 * - Refined curved bag handles matching luxury cosmetics boutiques
 * - Sleek structured bag trapezoid with clean lines
 * - Signature delicate ribbon accent badge
 * - Perfectly balanced stroke weights for high readability at 16px to 24px
 */
export const CustomCartIcon: React.FC<CustomCartIconProps> = ({
  className = "w-5 h-5",
  accentColor = "#E11D48",
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      stroke="currentColor"
    >
      {/* 1. Luxurious Curved Bag Handles */}
      <path
        d="M8.5 7.5V6C8.5 4.067 10.067 2.5 12 2.5C13.933 2.5 15.5 4.067 15.5 6V7.5"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 2. Structured Luxury Bag Body */}
      <path
        d="M4.5 7.5H19.5L18.2 20.5C18.1 21.3 17.4 21.9 16.6 21.9H7.4C6.6 21.9 5.9 21.3 5.8 20.5L4.5 7.5Z"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. Subtle Signature Accent Ribbon / Seal */}
      <path
        d="M10.2 11.5H13.8"
        strokeWidth="2"
        strokeLinecap="round"
        stroke={accentColor}
      />
    </svg>
  );
};

