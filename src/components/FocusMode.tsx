import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CampusScene } from './CampusScene';
import { PixelButton } from './ui/PixelButton';
import { PixelIcon } from './ui/PixelIcon';
import { formatClock, useStudy } from '../contexts/StudyContext';

function FocusMeta({ label, value }: {label: string;value: string;}) {
  return (
    <div className="min-w-0">
      <p className="font-pixel text-[9px] uppercase tracking-pixelwide text-cream/60">
        {label}
      </p>
      <p className="mt-1 truncate text-[15px] font-semibold text-cream">
        {value}
      </p>
    </div>);

}

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
  const reduce = settings.reducedMotion;

  const remaining =
  timer.totalSec === null ?
  timer.elapsedSec :
  Math.max(0, timer.totalSec - timer.elapsedSec);
  const progress =
  timer.totalSec === null ?
  Math.min(100, timer.elapsedSec / (60 * 60) * 100) :
  Math.min(100, timer.elapsedSec / timer.totalSec * 100);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (timer.running) pause();else
        resume();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, timer.running, pause, resume]);

  return (
    <AnimatePresence>
      {open &&
      <motion.section
        aria-label="Focus session"
        className="absolute inset-0 z-40 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.28, ease: [0.23, 1, 0.32, 1] }}>
        
          <CampusScene
          subdued
          still={reduce}
          className="absolute inset-0 h-full w-full" />
        

          <div className="relative flex flex-1 flex-col justify-end p-4 sm:p-6">
            <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduce ? 0 : 0.3,
              delay: reduce ? 0 : 0.08,
              ease: [0.23, 1, 0.32, 1]
            }}
            className="mx-auto w-full max-w-[720px] border-[3px] border-maroon-deep bg-charcoal/78 p-[3px] backdrop-blur-[1px]">
            
              <div className="border border-gold/25 px-5 py-5 sm:px-7 sm:py-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="flex min-w-0 gap-8">
                    <FocusMeta label="Course" value={task?.course ?? '—'} />
                    <FocusMeta label="Task" value={task?.title ?? '—'} />
                  </div>
                  <p className="font-pixel text-[9px] uppercase tracking-pixelwide text-cream/60">
                    {timer.totalSec === null ? 'Flow' : 'Focus'}
                  </p>
                </div>

                <p
                className="mt-4 font-pixel text-[56px] leading-none tracking-pixel text-cream sm:text-[76px]"
                aria-live="off">
                
                  {formatClock(remaining)}
                </p>
                <p className="sr-only" aria-live="polite">
                  {Math.ceil(remaining / 60)} minutes remaining
                </p>

                <div className="mt-4">
                  <div className="h-[10px] w-full border border-cream/30 bg-cream/10">
                    <div
                    className="h-full bg-gold transition-[width] duration-300 ease-out"
                    style={{
                      width: `${progress}%`,
                      backgroundImage:
                      'repeating-linear-gradient(90deg, #F5B335 0 6px, #C98A1E 6px 8px)'
                    }} />
                  
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="font-pixel text-[9px] uppercase tracking-pixelwide text-cream/55">
                      Progress
                    </p>
                    <p className="font-pixel text-[9px] uppercase tracking-pixelwide text-cream/55">
                      {Math.round(timer.elapsedSec / 60)} min in
                      {timer.totalSec !== null &&
                    ` · ${Math.round(timer.totalSec / 60)} min block`}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {timer.running ?
                <PixelButton variant="forest" size="md" pixelLabel onClick={pause}>
                      <PixelIcon name="pause" size={10} />
                      Pause
                    </PixelButton> :

                <PixelButton variant="forest" size="md" pixelLabel onClick={resume}>
                      <PixelIcon name="play" size={10} />
                      Resume
                    </PixelButton>
                }

                  <button
                  type="button"
                  onClick={endSession}
                  className="inline-flex min-h-[40px] items-center gap-2 border-2 border-maroon bg-transparent px-4 font-pixel text-[12px] uppercase tracking-pixelwide text-cream transition-colors duration-150 ease-out hover:bg-maroon">
                  
                    <PixelIcon name="stop" size={10} />
                    End
                  </button>

                  <button
                  type="button"
                  onClick={() =>
                  updateSettings({ ambienceOn: !settings.ambienceOn })
                  }
                  aria-pressed={settings.ambienceOn}
                  className="ml-auto inline-flex min-h-[36px] items-center gap-2 border border-cream/30 px-3 text-[12px] text-cream/80 transition-colors duration-150 ease-out hover:border-gold hover:text-cream">
                  
                    <PixelIcon name="music" size={11} />
                    Rainy Elbi
                    <span className="font-pixel text-[9px] uppercase tracking-pixel text-cream/55">
                      {settings.ambienceOn ? 'on' : 'off'}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>

            <p className="mx-auto mt-3 text-center text-[11px] text-cream/60">
              Space pauses and resumes. Nothing else is happening here.
            </p>
          </div>
        </motion.section>
      }
    </AnimatePresence>);

}