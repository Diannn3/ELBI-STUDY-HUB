import { useState } from 'react';
import { PixelButton } from '../../components/pixel/PixelButton';
import { PixelPanel } from '../../components/pixel/PixelPanel';
import { useUIStore } from '../../app/store';
import { useActiveTimer } from '../focus/useActiveTimer';
import { deriveTimer } from '../focus/domain/deriveTimer';
import type { SessionResult } from '../../db/schema';
import { finalizeSession } from './sessionService';
import { saveTIL } from '../til/tilService';
import { usePreferences } from '../settings/usePreferences';
import { PhaserGame } from '../../game/PhaserGame';
export function WrapUpView(){
 const timer=useActiveTimer();const setView=useUIStore(s=>s.setView);const selectTask=useUIStore(s=>s.selectTask);const {prefs}=usePreferences();const[result,setResult]=useState<SessionResult>('continue');const[til,setTil]=useState('');const[saving,setSaving]=useState(false);
 if(!timer.active)return <PixelPanel><p>The session has already been filed.</p><PixelButton onClick={()=>setView('home')}>Return home</PixelButton></PixelPanel>;
 const elapsed=Math.max(1,Math.round(deriveTimer(timer.active).elapsedMs/60_000));
 async function save(){if(!timer.active||saving)return;setSaving(true);const session=await finalizeSession(timer.active,result);if(til.trim())await saveTIL({sessionId:session.id,courseId:session.courseId,content:til});if(result==='done')selectTask(undefined);setView('home');}
 return <main className="wrap-view" data-hud-theme={prefs?.hudTheme ?? 'light'}><div className="scene-layer"><PhaserGame reducedMotion={prefs?.reducedMotion ?? false} motionMode={prefs?.motionMode ?? 'subtle'} scenePreset={prefs?.scenePreset ?? 'bright'} focusCalm/></div><div className="focus-dim" aria-hidden="true"/><PixelPanel className="wrap-panel"><p className="eyebrow">SESSION COMPLETE</p><div className="completion-time"><strong>{elapsed}</strong><span>minutes focused</span></div><fieldset className="result-grid"><legend>WHAT HAPPENED?</legend>{([['done','✓','DONE'],['continue','→','CONTINUE'],['blocked','!','BLOCKED']] as const).map(([value,icon,label])=><button type="button" key={value} className={`result-card result-card--${value} ${result===value?'is-selected':''}`} onClick={()=>setResult(value)}><span>{icon}</span><strong>{label}</strong></button>)}</fieldset><label className="til-field"><span>TODAY I LEARNED</span><small>One thing worth remembering. Optional.</small><textarea value={til} onChange={e=>setTil(e.target.value)} maxLength={280} placeholder="I learned that…"/></label><div className="wrap-actions"><PixelButton variant="ghost" onClick={()=>{setTil('');void save();}}>SKIP NOTE</PixelButton><PixelButton variant="primary" disabled={saving} onClick={()=>void save()}>{saving?'SAVING…':'SAVE & RETURN'}</PixelButton></div></PixelPanel></main>;
}
