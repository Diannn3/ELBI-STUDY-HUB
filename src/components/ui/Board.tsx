import React from 'react';

interface BoardProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  /** cream = main surface, sand = secondary surface */
  tone?: 'cream' | 'sand';
  /** adds the notice-board corner pixels */
  ornaments?: boolean;
  as?: 'div' | 'section' | 'aside' | 'form';
}

/**
 * The single framing element of the product: a deep-maroon notice-board frame
 * with a warm paper surface inside. Every panel in the app is this.
 */
export function Board({
  children,
  className = '',
  tone = 'cream',
  ornaments = false,
  as = 'div',
  ...rest
}: BoardProps) {
  const Tag = as;
  return (
    <Tag
      {...rest}
      className={`relative border-[3px] border-maroon-deep bg-maroon-deep p-[3px] shadow-board ${className}`}>
      
      <div
        className={`relative h-full w-full paper ${
        tone === 'cream' ? 'bg-cream' : 'bg-sand'}`
        }>
        
        {ornaments &&
        <>
            <span className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l-2 border-t-2 border-maroon" />
            <span className="pointer-events-none absolute right-0 top-0 h-2 w-2 border-r-2 border-t-2 border-maroon" />
            <span className="pointer-events-none absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-maroon" />
            <span className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 border-b-2 border-r-2 border-maroon" />
          </>
        }
        {children}
      </div>
    </Tag>);

}

interface BoardTitleProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  rule?: boolean;
}

export function BoardTitle({
  children,
  className = '',
  size = 'md',
  rule = false
}: BoardTitleProps) {
  const sizes = {
    sm: 'text-[10px]',
    md: 'text-[13px]',
    lg: 'text-[20px]'
  };
  return (
    <div className={className}>
      <h2
        className={`font-pixel uppercase tracking-pixelwide text-maroon ${sizes[size]}`}>
        
        {children}
      </h2>
      {rule &&
      <div className="mt-2 flex items-center gap-1">
          <span className="h-[2px] flex-1 bg-gold" />
          <span className="h-[5px] w-[5px] rotate-45 bg-gold" />
          <span className="h-[2px] flex-1 bg-gold" />
        </div>
      }
    </div>);

}

/** Small all-caps pixel label used for metrics and section keys. */
export function MicroLabel({
  children,
  className = ''



}: {children: React.ReactNode;className?: string;}) {
  return (
    <span
      className={`font-pixel text-[9px] uppercase tracking-pixelwide text-muted ${className}`}>
      
      {children}
    </span>);

}