import type { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';
export function PixelPanel({ children, title, className = '', ...props }: PropsWithChildren<HTMLAttributes<HTMLElement> & { title?: ReactNode }>) {
  return <section className={`pixel-panel ${className}`} {...props}>{title ? <div className="pixel-panel__title">{title}</div> : null}{children}</section>;
}
