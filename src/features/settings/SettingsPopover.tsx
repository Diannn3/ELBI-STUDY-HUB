import { useState } from 'react';
import { usePersistentStorage } from '../../hooks/usePersistentStorage';
import { usePreferences } from './usePreferences';
import type { HudTheme, MotionMode, ScenePreset } from '../../db/schema';

export function SettingsPopover() {
  const [open,setOpen]=useState(false); const {prefs,patch}=usePreferences(); const {health,request}=usePersistentStorage();
  return <div className="settings-anchor">
    <button className="pixel-icon-button" aria-label="Settings" aria-expanded={open} onClick={()=>setOpen(v=>!v)}><span aria-hidden="true">SET</span></button>
    {open ? <div className="settings-popover" role="dialog" aria-label="Quick settings">
      <strong>QUICK SETTINGS</strong>
      <label><span>HUD</span><select value={prefs?.hudTheme ?? 'light'} onChange={e=>void patch({hudTheme:e.target.value as HudTheme})}><option value="light">Light</option><option value="dark">Dark</option><option value="auto">Auto</option></select></label>
      <label><span>Scene</span><select value={prefs?.scenePreset ?? 'bright'} onChange={e=>void patch({scenePreset:e.target.value as ScenePreset})}><option value="bright">Bright Elbi</option><option value="local">Follow local time</option><option value="rainy">Rainy Elbi</option></select></label>
      <label><span>Ambient motion</span><select value={prefs?.motionMode ?? 'subtle'} onChange={e=>void patch({motionMode:e.target.value as MotionMode})}><option value="full">Full</option><option value="subtle">Subtle</option><option value="reduced">Reduced</option></select></label>
      <label><span>Reduce motion</span><input type="checkbox" checked={prefs?.reducedMotion ?? false} onChange={e=>void patch({reducedMotion:e.target.checked,motionMode:e.target.checked?'reduced':(prefs?.motionMode==='reduced'?'subtle':prefs?.motionMode ?? 'subtle')})}/></label>
      <label><span>Ambience</span><select value={prefs?.ambience ?? 'rain'} onChange={e=>void patch({ambience:e.target.value as 'rain'|'night'|'library'|'off'})}><option value="rain">Rainy Elbi</option><option value="night">Night insects</option><option value="library">Quiet room</option><option value="off">Off</option></select></label>
      <button className="settings-link" disabled={health.persisted||!health.supported} onClick={()=>void request()}>{health.persisted?'✓ Storage protected':'Protect offline data'}</button>
    </div>:null}
  </div>;
}
