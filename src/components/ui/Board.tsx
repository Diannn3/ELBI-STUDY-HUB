import React from 'react';

interface BoardProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  tone?: 'cream' | 'sand';
  ornaments?: boolean;
  as?: 'div' | 'section' | 'aside' | 'form';
}

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
      className={`secondary-board secondary-board--${tone} ${ornaments ? 'secondary-board--ornaments' : ''} ${className}`}
    >
      <div className="secondary-board__inner">
        {ornaments ? (
          <>
            <span className="secondary-board__ornament secondary-board__ornament--tl" aria-hidden="true" />
            <span className="secondary-board__ornament secondary-board__ornament--tr" aria-hidden="true" />
            <span className="secondary-board__ornament secondary-board__ornament--bl" aria-hidden="true" />
            <span className="secondary-board__ornament secondary-board__ornament--br" aria-hidden="true" />
          </>
        ) : null}
        {children}
      </div>
    </Tag>
  );
}

interface BoardTitleProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  rule?: boolean;
}

export function BoardTitle({ children, className = '', size = 'md', rule = false }: BoardTitleProps) {
  return (
    <div className={`secondary-board-title secondary-board-title--${size} ${className}`}>
      <h2>{children}</h2>
      {rule ? (
        <div className="secondary-board-title__rule" aria-hidden="true"><i /><b /><i /></div>
      ) : null}
    </div>
  );
}

export function MicroLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`micro-label ${className}`}>{children}</span>;
}
