import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PixelIcon } from './ui/PixelIcon';
import { useStudy } from '../contexts/StudyContext';

export function SessionToast() {
  const { toast, dismissToast, settings } = useStudy();
  const reduce = settings.reducedMotion;

  return (
    <AnimatePresence>
      {toast &&
      <motion.div
        className="pointer-events-none absolute bottom-24 left-1/2 z-40 -translate-x-1/2"
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.2, ease: [0.23, 1, 0.32, 1] }}>
        
          <div
          role="status"
          className="pointer-events-auto flex items-center gap-2 border-2 border-maroon-deep bg-cream px-3 py-2 shadow-board">
          
            <span className="flex h-5 w-5 items-center justify-center border border-forest bg-forest text-cream">
              <PixelIcon name="check" size={9} />
            </span>
            <span className="font-pixel text-[10px] uppercase tracking-pixelwide text-charcoal">
              {toast}
            </span>
            <button
            type="button"
            onClick={dismissToast}
            className="ml-1 text-muted transition-colors duration-150 ease-out hover:text-maroon">
            
              <PixelIcon name="close" size={9} />
              <span className="sr-only">Dismiss</span>
            </button>
          </div>
        </motion.div>
      }
    </AnimatePresence>);

}