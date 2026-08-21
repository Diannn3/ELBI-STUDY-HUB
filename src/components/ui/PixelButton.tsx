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

const VARIANTS: Record<Variant, string> = {
  primary:
  'bg-maroon text-cream border-maroon-deep hover:bg-maroon-rich active:translate-y-[2px] active:shadow-none shadow-raised',
  forest:
  'bg-forest text-cream border-[#012C15] hover:bg-forest-light active:translate-y-[2px] active:shadow-none shadow-raised',
  outline:
  'bg-transparent text-maroon border-maroon hover:bg-maroon/10 active:translate-y-[1px]',
  sand:
  'bg-sand text-charcoal border-maroon-deep hover:bg-sandDark active:translate-y-[2px] active:shadow-none shadow-raised',
  quiet:
  'bg-transparent text-muted border-transparent hover:text-maroon hover:border-maroon/30'
};

const SIZES: Record<Size, string> = {
  sm: 'px-2.5 py-1.5 text-[11px] min-h-[32px]',
  md: 'px-4 py-2 text-[12px] min-h-[40px]',
  lg: 'px-5 py-3 text-[15px] min-h-[48px]'
};

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
      className={`relative inline-flex items-center justify-center gap-2 border-2 transition-[background-color,transform,box-shadow,color] duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50 ${
      VARIANTS[variant]} ${
      SIZES[size]} ${fullWidth ? 'w-full' : ''} ${
      pixelLabel ?
      'font-pixel uppercase tracking-pixelwide' :
      'font-sans font-semibold'} ${
      className}`}>
      
      {(variant === 'primary' || variant === 'forest') &&
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[2px] border border-gold/35" />

      }
      {children}
    </button>);

}