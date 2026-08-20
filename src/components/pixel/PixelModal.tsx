import { useEffect, type PropsWithChildren } from 'react';
export function PixelModal({ open, title, onClose, children }: PropsWithChildren<{ open: boolean; title: string; onClose: () => void }>) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="pixel-modal" role="dialog" aria-modal="true" aria-labelledby="focus-modal-title">
      <header><h2 id="focus-modal-title">{title}</h2><button className="pixel-icon-button" aria-label="Close" onClick={onClose}>×</button></header>
      {children}
    </div>
  </div>;
}
