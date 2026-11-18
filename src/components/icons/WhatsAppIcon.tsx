import React from 'react';

interface WhatsAppIconProps {
  className?: string;
  variant?: 'current' | 'gradient' | 'white';
}

/**
 * Official WhatsApp brand icon matching FloatingWhatsApp luxury styling.
 */
export const WhatsAppIcon: React.FC<WhatsAppIconProps> = ({
  className = 'w-4 h-4',
  variant = 'current',
}) => {
  const gradientId = React.useId();

  const fillValue =
    variant === 'gradient'
      ? `url(#${gradientId})`
      : variant === 'white'
      ? '#FFFFFF'
      : 'currentColor';

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={fillValue}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {variant === 'gradient' && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#25D366" />
            <stop offset="55%" stopColor="#128C7E" />
            <stop offset="100%" stopColor="#075E54" />
          </linearGradient>
        </defs>
      )}
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.05 20.16C10.57 20.16 9.12 19.76 7.85 19L7.55 18.82L4.43 19.64L5.26 16.6L5.06 16.29C4.24 14.98 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16ZM16.57 14.41C16.32 14.28 15.1 13.68 14.88 13.6C14.65 13.52 14.49 13.48 14.32 13.73C14.16 13.98 13.69 14.53 13.55 14.69C13.41 14.86 13.26 14.88 13.01 14.75C12.77 14.63 11.98 14.37 11.04 13.53C10.31 12.88 9.81 12.07 9.67 11.83C9.53 11.58 9.65 11.45 9.77 11.33C9.88 11.22 10.02 11.04 10.14 10.9C10.26 10.76 10.3 10.66 10.38 10.5C10.46 10.33 10.42 10.19 10.36 10.07C10.3 9.94 9.81 8.74 9.61 8.25C9.41 7.77 9.21 7.83 9.06 7.83C8.92 7.82 8.76 7.82 8.59 7.82C8.43 7.82 8.16 7.88 7.94 8.13C7.71 8.37 7.08 8.96 7.08 10.17C7.08 11.38 7.96 12.54 8.09 12.71C8.21 12.87 9.82 15.36 12.3 16.42C12.89 16.67 13.35 16.83 13.71 16.94C14.3 17.13 14.84 17.1 15.27 17.04C15.75 16.97 16.74 16.44 16.94 15.86C17.15 15.28 17.15 14.79 17.09 14.69C17.02 14.59 16.82 14.53 16.57 14.41Z" />
    </svg>
  );
};
