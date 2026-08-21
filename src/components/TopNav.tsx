import React from 'react';
import { NavLink } from 'react-router-dom';
import { PixelIcon, type PixelIconName } from './ui/PixelIcon';
import { useStudy } from '../contexts/StudyContext';

const NAV: {to: string;label: string;icon: PixelIconName;}[] = [
{ to: '/', label: 'Campus', icon: 'tree' },
{ to: '/plan', label: 'Plan', icon: 'plan' },
{ to: '/learn', label: 'Learn', icon: 'learn' },
{ to: '/stats', label: 'Stats', icon: 'stats' },
{ to: '/settings', label: 'Settings', icon: 'gear' }];


export function TopNav() {
  const { todayTasks } = useStudy();
  const open = todayTasks.filter((t) => t.status !== 'done').length;

  return (
    <header className="relative z-30 flex items-stretch justify-between gap-4 border-b-[3px] border-maroon-deep bg-cream/95 paper pl-3 pr-2 sm:pl-4">
      <div className="flex min-w-0 items-center gap-3 py-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-maroon-deep bg-maroon text-gold">
          <PixelIcon name="tree" size={18} />
        </span>
        <div className="min-w-0">
          <p className="font-pixel text-[15px] uppercase leading-none tracking-pixelwide text-maroon sm:text-[17px]">
            Elbi Study
          </p>
          <p className="mt-1 truncate text-[11px] leading-none text-muted">
            quiet work, campus rhythm
          </p>
        </div>
        <p className="ml-1 hidden border-l-2 border-dashed border-sandDark pl-3 text-[12px] text-charcoal lg:block">
          Good morning.{' '}
          <span className="font-semibold text-maroon">{open} things</span> for
          today.
        </p>
      </div>

      <nav aria-label="Main" className="flex items-stretch">
        {NAV.map((item) =>
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
          `group relative flex items-center gap-2 px-2.5 text-[11px] font-semibold transition-colors duration-150 ease-out sm:px-3.5 ${
          isActive ?
          'text-maroon' :
          'text-muted hover:text-maroon-rich'}`

          }>
          
            {({ isActive }) =>
          <>
                <PixelIcon
              name={item.icon}
              size={13}
              className={isActive ? 'text-maroon' : 'text-muted'} />
            
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sr-only sm:hidden">{item.label}</span>
                <span
              aria-hidden="true"
              className={`absolute inset-x-1.5 bottom-0 h-[3px] transition-colors duration-150 ease-out ${
              isActive ?
              'bg-maroon' :
              'bg-transparent group-hover:bg-maroon/25'}`
              } />
            
                {isActive &&
            <span
              aria-hidden="true"
              className="absolute bottom-[3px] left-1/2 h-[3px] w-[3px] -translate-x-1/2 bg-gold" />

            }
              </>
          }
          </NavLink>
        )}
      </nav>
    </header>);

}