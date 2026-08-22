import type { InputHTMLAttributes } from 'react';
export function PixelInput({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`pixel-input ${className}`} {...props} />;
}
