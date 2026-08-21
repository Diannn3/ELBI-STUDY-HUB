import React from 'react';
import { NavLink } from 'react-router-dom';
import { PixelIcon, type PixelIconName } from './ui/PixelIcon';

const NAV: { to: string; label: string; icon: PixelIconName }[] = [
  { to: '/', label: 'Campus', icon: 'home' },
  { to: '/plan', label: 'Plan', icon: 'calendar' },
  { to: '/learn', label: 'Learn', icon: 'learn' },
  { to: '/stats', label: 'Stats', icon: 'stats' },
  { to: '/settings', label: 'Settings', icon: 'gear' }
];

export function TopNav() {
  return (
    <header className="reference-topbar">
      <div className="brand-lockup">
        <img src="/ui/tree-logo.png" alt="" className="brand-lockup__tree pixelated" />
        <div className="brand-lockup__copy">
          <p className="brand-lockup__title">ELBI STUDY</p>
          <p className="brand-lockup__tagline">quiet work, campus rhythm</p>
        </div>
      </div>

      <nav className="reference-nav" aria-label="Main">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `reference-nav__item ${isActive ? 'is-active' : ''}`
            }
          >
            <PixelIcon name={item.icon} size={16} />
            <span>{item.label}</span>
            <i aria-hidden="true" />
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
