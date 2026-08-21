import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CampusScene } from './CampusScene';
import { PixelIcon } from './ui/PixelIcon';
import { formatClock, useStudy } from '../contexts/StudyContext';

export function FocusMode() {
  const {
    stage,
    timer,
    pause,
    resume,
    endSession,
    selectedTask,
    tasks,
    settings,
    updateSettings
  } = useStudy();

  const open = stage === 'focus';
  const task = tasks.find((t) => t.id === timer.taskId) ?? selectedTask;
  const remaining = timer.totalSec === null
    ? timer.elapsedSec
    : Math.max(0, timer.totalSec - timer.elapsedSec);
  const progress = timer.totalSec === null
    ? Math.min(100, (timer.elapsedSec / 3600) * 100)
    : Math.min(100, (timer.elapsedSec / timer.totalSec) * 100);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        timer.running ? pause() : resume();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, timer.running, pause, resume]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.section
          aria-label="Focus session"
          className="focus-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: settings.reducedMotion ? 0 : 0.24 }}
        >
          <CampusScene subdued still={settings.reducedMotion} className="focus-screen__scene" />
          <div className="focus-screen__shade" />

          <motion.div
            className="focus-console"
            initial={settings.reducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: settings.reducedMotion ? 0 : 0.25, delay: settings.reducedMotion ? 0 : 0.06 }}
          >
            <span className="focus-console__corner focus-console__corner--tl" aria-hidden="true" />
            <span className="focus-console__corner focus-console__corner--tr" aria-hidden="true" />
            <div className="focus-console__header">
              <div>
                <small>COURSE</small>
                <strong>{task?.course ?? '—'}</strong>
              </div>
              <div className="focus-console__task">
                <small>CURRENT WORK</small>
                <strong>{task?.title ?? '—'}</strong>
              </div>
              <span>{timer.totalSec === null ? 'FLOW' : 'FOCUS'}</span>
            </div>

            <time className="focus-console__timer">{formatClock(remaining)}</time>
            <p className="sr-only" aria-live="polite">{Math.ceil(remaining / 60)} minutes remaining</p>

            <div className="focus-console__progress">
              <i style={{ width: `${progress}%` }} />
            </div>
            <div className="focus-console__progress-meta">
              <span>PROGRESS</span>
              <span>{Math.round(timer.elapsedSec / 60)} min in{timer.totalSec !== null ? ` · ${Math.round(timer.totalSec / 60)} min block` : ''}</span>
            </div>

            <div className="focus-console__actions">
              <button type="button" className="focus-console__pause" onClick={timer.running ? pause : resume}>
                <PixelIcon name={timer.running ? 'pause' : 'play'} size={10} />
                {timer.running ? 'PAUSE' : 'RESUME'}
              </button>
              <button type="button" className="focus-console__end" onClick={endSession}>
                <PixelIcon name="stop" size={10} /> END
              </button>
              <button
                type="button"
                className="focus-console__ambience"
                onClick={() => updateSettings({ ambienceOn: !settings.ambienceOn })}
                aria-pressed={settings.ambienceOn}
              >
                <PixelIcon name="music" size={11} /> Rainy Elbi
                <b>{settings.ambienceOn ? 'ON' : 'OFF'}</b>
              </button>
            </div>
          </motion.div>
          <p className="focus-screen__hint">Space pauses and resumes.</p>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
