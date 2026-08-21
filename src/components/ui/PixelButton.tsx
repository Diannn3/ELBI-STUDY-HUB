import React from 'react';

type Variant = 'primary' | 'forest' | 'outline' | 'quiet' | 'sand';
type Size = 'sm' | 'md' | 'lg';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  pixelLabel?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function PixelButton({
  variant = 'primary',
  size = 'md',
  pixelLabel = false,
  fullWidth = false,
  className = '',
  children,
  ...rest
}: PixelButtonProps) {
  return (
    <button
      {...rest}
      className={`pixel-button pixel-button--${variant} pixel-button--${size} ${
        pixelLabel ? 'pixel-button--pixel-label' : ''
      } ${fullWidth ? 'pixel-button--full' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
