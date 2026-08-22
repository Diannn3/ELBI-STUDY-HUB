import type { PropsWithChildren } from 'react';
export function PixelTooltip({ label, children }: PropsWithChildren<{ label: string }>) {
  return <span className="pixel-tooltip" data-tooltip={label}>{children}</span>;
}
