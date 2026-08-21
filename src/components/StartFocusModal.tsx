import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Board, BoardTitle, MicroLabel } from './ui/Board';
import { PixelButton } from './ui/PixelButton';
import { PixelIcon } from './ui/PixelIcon';
import { useStudy } from '../contexts/StudyContext';
import { TIMER_MODES } from '../data/seed';
import type { TimerModeId } from '../types/study';

export function StartFocusModal() {
  const {
    stage,
    closeSetup,
    beginSession,
    selectedTask,
    settings,
    updateSettings
  } = useStudy();
  const open = stage === 'setup';
  const [mode, setMode] = useState<TimerModeId>(settings.defaultMode);
  const [custom, setCustom] = useState(settings.customMinutes);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setMode(settings.defaultMode);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSetup();
    };
    window.addEventListener('keydown', onKey);
    const focusTarget = cardRef.current?.querySelector<HTMLElement>(
      'button, input'
    );
    focusTarget?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeSetup, settings.defaultMode]);

  const start = () => {
    updateSettings({ defaultMode: mode, customMinutes: custom });
    beginSession(mode, custom);
  };

  const reduce = settings.reducedMotion;

  return (
    <AnimatePresence>
      {open &&
      <motion.div
        className="absolute inset-0 z-40 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.18, ease: [0.23, 1, 0.32, 1] }}>
        
          <button
          type="button"
          aria-label="Cancel"
          onClick={closeSetup}
          className="absolute inset-0 cursor-default bg-charcoal/45" />
        
          <motion.div
          ref={cardRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="focus-setup-title"
          className="relative w-full max-w-[440px]"
          initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.97, y: 6 }}
          transition={{ duration: reduce ? 0 : 0.22, ease: [0.23, 1, 0.32, 1] }}>
          
            <Board ornaments>
              <div className="flex flex-col gap-4 p-5">
                <div>
                  <BoardTitle size="md" rule>
                    <span id="focus-setup-title">Start a focus block</span>
                  </BoardTitle>
                </div>

                <div className="border-2 border-maroon-deep bg-sand px-3 py-2">
                  <MicroLabel>Selected task</MicroLabel>
                  <p className="mt-1 font-pixel text-[12px] uppercase tracking-pixel text-maroon">
                    {selectedTask?.course ?? 'No course'}
                  </p>
                  <p className="mt-1 text-[14px] font-semibold text-charcoal">
                    {selectedTask?.title ?? 'Pick a task on the Today board'}
                  </p>
                </div>

                <fieldset>
                  <legend className="mb-2">
                    <MicroLabel>Timer</MicroLabel>
                  </legend>
                  <div
                  role="radiogroup"
                  aria-label="Timer preset"
                  className="grid grid-cols-2 gap-2">
                  
                    {TIMER_MODES.map((m) => {
                    const active = mode === m.id;
                    const wide = m.id === 'flow';
                    return (
                      <button
                        key={m.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setMode(m.id)}
                        className={`relative flex min-h-[54px] flex-col justify-center border-2 px-3 py-2 text-left transition-colors duration-150 ease-out ${
                        wide ? 'col-span-2' : ''} ${

                        active ?
                        'border-[#012C15] bg-forest text-cream' :
                        'border-sandDark bg-cream text-charcoal hover:border-maroon/45 hover:bg-sand'}`
                        }>
                        
                          {active &&
                        <span
                          aria-hidden="true"
                          className="absolute right-1 top-1 h-[5px] w-[5px] bg-gold" />

                        }
                          <span className="font-pixel text-[12px] uppercase tracking-pixel">
                            {m.label}
                          </span>
                          <span
                          className={`mt-1 text-[11px] ${
                          active ? 'text-cream/80' : 'text-muted'}`
                          }>
                          
                            {m.caption}
                          </span>
                        </button>);

                  })}
                  </div>
                </fieldset>

                {mode === 'custom' &&
              <div className="flex items-center gap-3 border-2 border-dashed border-sandDark bg-sand/60 px-3 py-2">
                    <MicroLabel>Minutes</MicroLabel>
                    <div className="ml-auto flex items-center gap-2">
                      <button
                    type="button"
                    onClick={() => setCustom((v) => Math.max(5, v - 5))}
                    className="flex h-8 w-8 items-center justify-center border-2 border-maroon-deep bg-cream font-pixel text-[12px] text-maroon hover:bg-sand">
                    
                        –<span className="sr-only">Decrease by five minutes</span>
                      </button>
                      <span className="w-10 text-center font-pixel text-[16px] text-charcoal">
                        {custom}
                      </span>
                      <button
                    type="button"
                    onClick={() => setCustom((v) => Math.min(120, v + 5))}
                    className="flex h-8 w-8 items-center justify-center border-2 border-maroon-deep bg-cream font-pixel text-[12px] text-maroon hover:bg-sand">
                    
                        +<span className="sr-only">Increase by five minutes</span>
                      </button>
                    </div>
                  </div>
              }

                <div className="flex items-center gap-3 pt-1">
                  <PixelButton
                  variant="primary"
                  size="lg"
                  pixelLabel
                  className="flex-1"
                  onClick={start}>
                  
                    <PixelIcon name="play" size={11} />
                    Start
                  </PixelButton>
                  <PixelButton variant="quiet" size="md" onClick={closeSetup}>
                    Cancel
                  </PixelButton>
                </div>
              </div>
            </Board>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}