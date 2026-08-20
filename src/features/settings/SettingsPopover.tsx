import { useState } from 'react';
import { usePersistentStorage } from '../../hooks/usePersistentStorage';
import { usePreferences } from './usePreferences';

export function SettingsPopover() {
  const [open, setOpen] = useState(false);
  const { prefs, patch } = usePreferences();
  const { health, request } = usePersistentStorage();
  return <div className="settings-anchor">
    <button className="pixel-icon-button" aria-label="Settings" aria-expanded={open} onClick={() => setOpen(v => !v)}><span aria-hidden="true">SET</span></button>
    {open ? <div className="settings-popover">
      <strong>QUICK SETTINGS</strong>
      <label><span>Reduced motion</span><input type="checkbox" checked={prefs?.reducedMotion ?? false} onChange={e => void patch({ reducedMotion: e.target.checked })} /></label>
      <label><span>Ambience</span><select value={prefs?.ambience ?? 'rain'} onChange={e => void patch({ ambience: e.target.value as 'rain'|'night'|'library'|'off' })}><option value="rain">Rainy Elbi</option><option value="night">Night insects</option><option value="library">Quiet room</option><option value="off">Off</option></select></label>
      <button className="settings-link" disabled={health.persisted || !health.supported} onClick={() => void request()}>{health.persisted ? '✓ Storage protected' : 'Protect offline data'}</button>
    </div> : null}
  </div>;
}
