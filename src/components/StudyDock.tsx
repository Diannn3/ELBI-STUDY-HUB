import React from 'react';
import { formatClock, formatHours, useStudy } from '../contexts/StudyContext';
import { PixelIcon, type PixelIconName } from './ui/PixelIcon';

const AMBIENCE_ART = '/07d32c10-4bec-4295-be4c-6815235c9725.jpg';

function DockMetric({
  icon,
  label,
  value,
  unit,
  accent = false
}: {
  icon: PixelIconName;
  label: string;
  value: string;
  unit?: string;
  accent?: boolean;
}) {
  return (
    <div className="reference-dock__metric">
      <span className="reference-dock__metric-icon"><PixelIcon name={icon} size={22} /></span>
      <span className="reference-dock__metric-copy">
        <small>{label}</small>
        <strong className={accent ? 'is-accent' : ''}>{value}</strong>
        {unit ? <em>{unit}</em> : null}
      </span>
    </div>
  );
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
  const remaining = timer.totalSec === null
    ? timer.elapsedSec
    : Math.max(0, timer.totalSec - timer.elapsedSec);
  const displaySeconds = running ? remaining : timer.totalSec ?? 25 * 60;
  const progress = timer.totalSec === null
    ? 0
    : Math.min(100, (timer.elapsedSec / timer.totalSec) * 100);

  return (
    <section className="reference-dock" aria-label="Study status and ambience">
      <span className="reference-dock__corner reference-dock__corner--tl" aria-hidden="true" />
      <span className="reference-dock__corner reference-dock__corner--tr" aria-hidden="true" />
      <span className="reference-dock__corner reference-dock__corner--bl" aria-hidden="true" />
      <span className="reference-dock__corner reference-dock__corner--br" aria-hidden="true" />

      <div className="reference-dock__ambience">
        <img src={AMBIENCE_ART} alt="" className="reference-dock__album pixelated" />
        <div className="reference-dock__ambience-copy">
          <strong>Rainy Elbi</strong>
          <span>campus ambience</span>
          <div className="reference-dock__audio-controls">
            <button
              type="button"
              onClick={() => updateSettings({ ambienceOn: !settings.ambienceOn })}
              aria-pressed={settings.ambienceOn}
              title={settings.ambienceOn ? 'Pause ambience' : 'Play ambience'}
            >
              <PixelIcon name={settings.ambienceOn ? 'pause' : 'play'} size={11} />
            </button>
            <PixelIcon name={settings.volume === 0 ? 'mute' : 'volume'} size={13} />
            <label>
              <span className="sr-only">Ambience volume</span>
              <input
                type="range"
                min={0}
                max={100}
                value={settings.volume}
                onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
                className="dock-slider"
              />
            </label>
          </div>
        </div>
      </div>

      <span className="reference-dock__divider" aria-hidden="true" />
      <DockMetric icon="clock" label="TODAY" value={String(stats.todayMin)} unit="min" />
      <span className="reference-dock__divider" aria-hidden="true" />
      <DockMetric icon="calendar" label="THIS WEEK" value={formatHours(stats.weekMin)} />
      <span className="reference-dock__divider" aria-hidden="true" />
      <DockMetric icon="tree" label="CONSISTENCY" value={stats.studyDays} unit="days" accent />
      <span className="reference-dock__divider reference-dock__divider--current" aria-hidden="true" />

      <div className="reference-dock__current">
        <span className="reference-dock__current-icon"><PixelIcon name="note" size={20} /></span>
        <div className="reference-dock__current-copy">
          <small>{running ? 'IN SESSION' : 'CURRENT'}</small>
          <strong>
            {selectedTask ? (
              <><b>{selectedTask.course}</b><span> — {selectedTask.title}</span></>
            ) : (
              <span>No task selected</span>
            )}
          </strong>
          <div className="reference-dock__progress" aria-hidden="true">
            <i style={{ width: `${running ? progress : 48}%` }} />
          </div>
        </div>
        <time>{formatClock(displaySeconds)}</time>
        <button
          type="button"
          className="reference-dock__action"
          onClick={running ? endSession : openSetup}
          aria-label={running ? 'End session' : 'Start focus'}
        >
          <PixelIcon name={running ? 'stop' : 'play'} size={12} />
        </button>
      </div>
    </section>
  );
}
