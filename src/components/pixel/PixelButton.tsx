import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type PixelButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }>;

export function PixelButton({ children, className = '', variant = 'secondary', ...rest }: PixelButtonProps) {
  return <button className={`pixel-button pixel-button--${variant} ${className}`} {...rest}>{children}</button>;
}
