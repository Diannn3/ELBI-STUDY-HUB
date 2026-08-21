import React from 'react';
import { Board, BoardTitle, MicroLabel } from '../components/ui/Board';
import { PixelButton } from '../components/ui/PixelButton';
import { PixelIcon } from '../components/ui/PixelIcon';
import { useStudy } from '../contexts/StudyContext';
import { TIMER_MODES } from '../data/seed';

function Switch({
  label,
  description,
  checked,
  onChange





}: {label: string;description: string;checked: boolean;onChange: (next: boolean) => void;}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b-2 border-dashed border-sandDark py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-charcoal">{label}</p>
        <p className="mt-1 text-[12px] text-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`flex h-[28px] w-[56px] shrink-0 items-center border-2 px-[2px] transition-colors duration-150 ease-out ${
        checked ?
        'justify-end border-[#012C15] bg-forest' :
        'justify-start border-sandDark bg-sand'}`
        }>
        
        <span
          className={`flex h-[20px] w-[24px] items-center justify-center ${
          checked ? 'bg-cream text-forest' : 'bg-cream text-muted'}`
          }>
          
          <span className="font-pixel text-[8px] uppercase">
            {checked ? 'on' : 'off'}
          </span>
        </span>
      </button>
    </div>);

}

export function Settings() {
  const { settings, updateSettings } = useStudy();

  return (
    <div className="thin-scroll h-full w-full overflow-y-auto bg-sand paper">
      <div className="mx-auto flex max-w-[760px] flex-col gap-5 p-4 sm:p-6">
        <div>
          <BoardTitle size="lg" rule>
            Settings
          </BoardTitle>
          <p className="mt-2 text-[13px] text-muted">
            Everything lives on this device unless you turn on sync.
          </p>
        </div>

        <Board>
          <div className="flex flex-col gap-3 p-4">
            <BoardTitle size="sm">Timer</BoardTitle>
            <div>
              <MicroLabel>Default preset</MicroLabel>
              <div className="mt-2 flex flex-wrap gap-2">
                {TIMER_MODES.map((m) =>
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={settings.defaultMode === m.id}
                  onClick={() => updateSettings({ defaultMode: m.id })}
                  className={`min-h-[36px] border-2 px-3 font-pixel text-[10px] uppercase tracking-pixel transition-colors duration-150 ease-out ${
                  settings.defaultMode === m.id ?
                  'border-[#012C15] bg-forest text-cream' :
                  'border-sandDark bg-cream text-muted hover:border-maroon/45 hover:text-maroon'}`
                  }>
                  
                    {m.label}
                  </button>
                )}
              </div>
            </div>
            <label className="flex items-center justify-between gap-4 border-t-2 border-dashed border-sandDark pt-3">
              <span>
                <span className="block text-[13px] font-semibold text-charcoal">
                  Custom length
                </span>
                <span className="mt-1 block text-[12px] text-muted">
                  Used when you pick Custom in the start card.
                </span>
              </span>
              <span className="flex items-center gap-2">
                <input
                  type="range"
                  min={5}
                  max={120}
                  step={5}
                  value={settings.customMinutes}
                  onChange={(e) =>
                  updateSettings({ customMinutes: Number(e.target.value) })
                  }
                  className="dock-slider w-[140px]" />
                
                <span className="w-[52px] font-pixel text-[13px] text-charcoal">
                  {settings.customMinutes}m
                </span>
              </span>
            </label>
          </div>
        </Board>

        <Board>
          <div className="flex flex-col gap-1 p-4">
            <BoardTitle size="sm" className="mb-2">
              Ambience
            </BoardTitle>
            <Switch
              label="Campus ambience"
              description="Rainy Elbi loops quietly while you work."
              checked={settings.ambienceOn}
              onChange={(v) => updateSettings({ ambienceOn: v })} />
            
            <label className="flex items-center justify-between gap-4 py-3">
              <span>
                <span className="block text-[13px] font-semibold text-charcoal">
                  Volume
                </span>
                <span className="mt-1 block text-[12px] text-muted">
                  {settings.volume}% of system volume
                </span>
              </span>
              <span className="flex items-center gap-2 text-muted">
                <PixelIcon name={settings.volume === 0 ? 'mute' : 'volume'} size={12} />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.volume}
                  onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
                  className="dock-slider w-[140px]"
                  aria-label="Ambience volume" />
                
              </span>
            </label>
          </div>
        </Board>

        <Board>
          <div className="flex flex-col gap-1 p-4">
            <BoardTitle size="sm" className="mb-2">
              Accessibility
            </BoardTitle>
            <Switch
              label="Reduced motion"
              description="Stops the drifting clouds and all transitions."
              checked={settings.reducedMotion}
              onChange={(v) => updateSettings({ reducedMotion: v })} />
            
            <Switch
              label="Higher contrast text"
              description="Darkens secondary text across every surface."
              checked={settings.highContrastText}
              onChange={(v) => updateSettings({ highContrastText: v })} />
            
            <Switch
              label="Session notifications"
              description="A quiet notice when a block ends."
              checked={settings.notifications}
              onChange={(v) => updateSettings({ notifications: v })} />
            
          </div>
        </Board>

        <Board tone="sand">
          <div className="flex flex-col gap-3 p-4">
            <BoardTitle size="sm">Storage &amp; data</BoardTitle>
            <div className="flex items-center gap-2 border-2 border-forest bg-cream px-3 py-2">
              <span className="flex h-4 w-4 items-center justify-center border border-forest bg-forest text-cream">
                <PixelIcon name="check" size={8} />
              </span>
              <p className="text-[12px] text-charcoal">
                <span className="font-semibold">Local-first.</span> Tasks, sessions
                and TILs are stored on this device.
              </p>
            </div>
            <Switch
              label="Cloud sync"
              description="Mirror your data to your UP account. Off by default."
              checked={settings.cloudSync}
              onChange={(v) => updateSettings({ cloudSync: v })} />
            
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <PixelButton variant="sand" size="sm">
                Export data (.json)
              </PixelButton>
              <PixelButton variant="outline" size="sm">
                Clear session history
              </PixelButton>
              <button
                type="button"
                className="ml-auto min-h-[32px] border-2 border-maroon px-2.5 font-pixel text-[10px] uppercase tracking-pixel text-maroon transition-colors duration-150 ease-out hover:bg-maroon hover:text-cream">
                
                Delete everything
              </button>
            </div>
            <p className="text-[11px] text-muted">
              Deleting is immediate and cannot be undone.
            </p>
          </div>
        </Board>
      </div>
    </div>);

}