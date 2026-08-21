import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CampusScene } from './CampusScene';
import { Board, BoardTitle, MicroLabel } from './ui/Board';
import { PixelButton } from './ui/PixelButton';
import { PixelIcon, type PixelIconName } from './ui/PixelIcon';
import { useStudy } from '../contexts/StudyContext';
import type { SessionOutcome } from '../types/study';

const OUTCOMES: {
  id: SessionOutcome;
  icon: PixelIconName;
  label: string;
  description: string;
  classes: string;
  iconClasses: string;
}[] = [
{
  id: 'done',
  icon: 'check',
  label: 'Done',
  description: 'I finished what I intended.',
  classes: 'border-forest hover:bg-forest hover:text-cream',
  iconClasses: 'border-forest bg-forest text-cream'
},
{
  id: 'continue',
  icon: 'arrow',
  label: 'Continue',
  description: 'I need another focus block.',
  classes: 'border-gold-deep hover:bg-gold-pale',
  iconClasses: 'border-gold-deep bg-gold text-charcoal'
},
{
  id: 'blocked',
  icon: 'bang',
  label: 'Blocked',
  description: 'Something is stopping me.',
  classes: 'border-maroon hover:bg-maroon hover:text-cream',
  iconClasses: 'border-maroon-deep bg-maroon text-cream'
}];


export function SessionWrapUp() {
  const {
    stage,
    lastSessionMinutes,
    selectedTask,
    tasks,
    timer,
    chooseOutcome,
    saveTil,
    skipTil,
    settings
  } = useStudy();

  const [til, setTil] = useState('');
  const open = stage === 'wrap' || stage === 'til';
  const task = tasks.find((t) => t.id === timer.taskId) ?? selectedTask;
  const reduce = settings.reducedMotion;

  return (
    <AnimatePresence>
      {open &&
      <motion.div
        className="absolute inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.22, ease: [0.23, 1, 0.32, 1] }}>
        
          <CampusScene
          subdued
          still={reduce}
          className="absolute inset-0 h-full w-full" />
        
          <div aria-hidden="true" className="absolute inset-0 bg-charcoal/35" />

          <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="wrap-title"
          className="relative w-full max-w-[440px]"
          initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
          transition={{ duration: reduce ? 0 : 0.24, ease: [0.23, 1, 0.32, 1] }}>
          
            {stage === 'wrap' ?
          <Board ornaments>
                <div className="flex flex-col gap-4 p-5">
                  <BoardTitle size="md" rule>
                    <span id="wrap-title">Focus block complete</span>
                  </BoardTitle>

                  <div className="flex items-center gap-4 border-2 border-maroon-deep bg-sand px-3 py-2.5">
                    <div>
                      <MicroLabel>Focused</MicroLabel>
                      <p className="mt-1 font-pixel text-[20px] leading-none text-forest">
                        {lastSessionMinutes}
                        <span className="ml-1 text-[11px]">min</span>
                      </p>
                    </div>
                    <span
                  aria-hidden="true"
                  className="h-10 border-l-2 border-dashed border-sandDark" />
                
                    <div className="min-w-0">
                      <p className="font-pixel text-[11px] uppercase tracking-pixel text-maroon">
                        {task?.course ?? '—'}
                      </p>
                      <p className="mt-1 truncate text-[14px] font-semibold text-charcoal">
                        {task?.title ?? '—'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-[13px] font-semibold text-charcoal">
                      How did it go?
                    </p>
                    <div className="flex flex-col gap-2">
                      {OUTCOMES.map((o) =>
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => chooseOutcome(o.id)}
                    className={`group flex items-center gap-3 border-2 bg-cream px-3 py-2.5 text-left transition-colors duration-150 ease-out ${o.classes}`}>
                    
                          <span
                      aria-hidden="true"
                      className={`flex h-6 w-6 shrink-0 items-center justify-center border-2 ${o.iconClasses}`}>
                      
                            <PixelIcon name={o.icon} size={11} />
                          </span>
                          <span className="min-w-0">
                            <span className="block font-pixel text-[12px] uppercase tracking-pixelwide">
                              {o.label}
                            </span>
                            <span className="mt-1 block text-[11px] opacity-80">
                              {o.description}
                            </span>
                          </span>
                        </button>
                  )}
                    </div>
                  </div>
                </div>
              </Board> :

          <Board ornaments>
                <div className="flex flex-col gap-3 p-5">
                  <div className="flex items-center gap-2">
                    <span className="text-gold-deep">
                      <PixelIcon name="note" size={12} />
                    </span>
                    <BoardTitle size="sm">
                      <span id="wrap-title">Today I learned</span>
                    </BoardTitle>
                  </div>

                  <label
                htmlFor="til-input"
                className="text-[12px] text-muted">
                
                    What did you figure out?
                  </label>
                  <textarea
                id="til-input"
                autoFocus
                value={til}
                onChange={(e) => setTil(e.target.value)}
                rows={4}
                placeholder="Dot product distributivity follows from distributing each vector component before summing."
                className="ruled resize-none border-2 border-sandDark bg-cream px-3 py-2 text-[13px] leading-7 text-charcoal placeholder:text-muted/60 focus:border-maroon focus:outline-none" />
              
                  <p className="text-[11px] text-muted">
                    One line is enough. {task?.course ?? ''}
                    {task ? ` · ${lastSessionMinutes} min` : ''}
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <PixelButton
                  variant="primary"
                  size="md"
                  pixelLabel
                  className="flex-1"
                  disabled={!til.trim()}
                  onClick={() => saveTil(til.trim())}>
                  
                      Save TIL
                    </PixelButton>
                    <PixelButton variant="quiet" size="md" onClick={skipTil}>
                      Skip
                    </PixelButton>
                  </div>
                </div>
              </Board>
          }
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}