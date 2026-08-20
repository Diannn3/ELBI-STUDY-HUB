export function PixelProgress({ value, max = 100, label }: { value: number; max?: number; label?: string }) {
  const pct = Math.min(100, Math.max(0, max ? value / max * 100 : 0));
  return <div className="pixel-progress" aria-label={label} role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
    <span style={{ width: `${pct}%` }} />
  </div>;
}
