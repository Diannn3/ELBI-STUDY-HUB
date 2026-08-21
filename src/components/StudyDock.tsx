import React from 'react';
import { formatClock, formatHours, useStudy } from '../contexts/StudyContext';
import { PixelIcon } from './ui/PixelIcon';
import { MicroLabel } from './ui/Board';

const AMBIENCE_ART = "/07d32c10-4bec-4295-be4c-6815235c9725.jpg";


function Divider() {
  return (
    <span
      aria-hidden="true"
      className="hidden w-0 self-stretch border-l-2 border-dashed border-sandDark md:block" />);


}

function Metric({
  label,
  value,
  unit,
  accent = false





}: {label: string;value: string;unit?: string;accent?: boolean;}) {
  return (
    <div className="flex min-w-[86px] flex-col justify-center">
      <MicroLabel>{label}</MicroLabel>
      <p className="mt-1 flex items-baseline gap-1 leading-none">
        <span
          className={`font-pixel text-[17px] ${
          accent ? 'text-forest' : 'text-charcoal'}`
          }>
          
          {value}
        </span>
        {unit &&
        <span className="text-[11px] font-medium text-muted">{unit}</span>
        }
      </p>
    </div>);

}

export function StudyDock() {
  const {
    settings,
    updateSettings,
    stats,
    selectedTask,
    timer,
    stage,
    openSetup,
    endSession
  } = useStudy();

  const running = stage === 'focus';
  const remaining =
  timer.totalSec === null ?
  timer.elapsedSec :
  Math.max(0, timer.totalSec - timer.elapsedSec);
  const progress =
  timer.totalSec === null ?
  0 :
  Math.min(100, timer.elapsedSec / timer.totalSec * 100);

  return (
    <div className="relative z-30 border-t-[3px] border-maroon bg-sand paper shadow-dock">
      <div className="flex items-stretch gap-4 px-3 py-2 sm:px-4">
        {/* Ambience — the campus radio */}
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={AMBIENCE_ART}
            alt=""
            className="pixelated hidden h-12 w-12 shrink-0 border-2 border-maroon-deep object-cover sm:block" />
          
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold leading-none text-charcoal">
              Rainy Elbi
            </p>
            <p className="mt-1 hidden text-[10px] leading-none text-muted sm:block">
              campus ambience
            </p>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateSettings({ ambienceOn: !settings.ambienceOn })}
                aria-pressed={settings.ambienceOn}
                className="flex h-7 w-7 items-center justify-center border-2 border-maroon-deep bg-maroon text-cream transition-colors duration-150 ease-out hover:bg-maroon-rich">
                
                <PixelIcon name={settings.ambienceOn ? 'pause' : 'play'} size={10} />
                <span className="sr-only">
                  {settings.ambienceOn ? 'Pause ambience' : 'Play ambience'}
                </span>
              </button>
              <span className="hidden text-muted sm:block">
                <PixelIcon name={settings.volume === 0 ? 'mute' : 'volume'} size={12} />
              </span>
              <label className="hidden items-center sm:flex">
                <span className="sr-only">Ambience volume</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.volume}
                  onChange={(e) =>
                  updateSettings({ volume: Number(e.target.value) })
                  }
                  className="dock-slider w-20 lg:w-28" />
                
              </label>
            </div>
          </div>
        </div>

        <Divider />

        <div className="hidden items-stretch gap-4 md:flex lg:gap-6">
          <Metric label="Today" value={String(stats.todayMin)} unit="min" />
          <Divider />
          <Metric label="This week" value={formatHours(stats.weekMin)} />
          <Divider />
          <Metric label="Consistency" value={stats.studyDays} unit="days" accent />
        </div>

        <Divider />

        {/* Current task / timer */}
        <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-3">
          <div className="min-w-0 flex-1 md:max-w-[340px]">
            <MicroLabel>{running ? 'In session' : 'Current'}</MicroLabel>
            <p className="mt-1 truncate text-[13px] font-semibold leading-none text-charcoal">
              {selectedTask ?
              <>
                  <span className="text-maroon">{selectedTask.course}</span>
                  <span className="text-muted"> — </span>
                  {selectedTask.title}
                </> :

              <span className="text-muted">No task selected</span>
              }
            </p>
            <div className="mt-2 h-[6px] w-full border border-maroon-deep/40 bg-sandDark">
              <div
                className="h-full bg-gold transition-[width] duration-300 ease-out"
                style={{ width: `${running ? progress : 0}%` }} />
              
            </div>
          </div>

          <p className="font-pixel text-[16px] leading-none text-charcoal">
            {formatClock(running ? remaining : timer.totalSec ?? 0)}
          </p>

          {running ?
          <button
            type="button"
            onClick={endSession}
            className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-maroon-deep bg-cream text-maroon transition-colors duration-150 ease-out hover:bg-maroon hover:text-cream">
            
              <PixelIcon name="stop" size={11} />
              <span className="sr-only">End session</span>
            </button> :

          <button
            type="button"
            onClick={openSetup}
            className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-maroon-deep bg-cream text-maroon transition-colors duration-150 ease-out hover:bg-maroon hover:text-cream">
            
              <PixelIcon name="play" size={11} />
              <span className="sr-only">Start a focus block</span>
            </button>
          }
        </div>
      </div>
    </div>);

}