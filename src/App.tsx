import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { StudyProvider, useStudy } from './contexts/StudyContext';
import { TopNav } from './components/TopNav';
import { StudyDock } from './components/StudyDock';
import { StartFocusModal } from './components/StartFocusModal';
import { FocusMode } from './components/FocusMode';
import { SessionWrapUp } from './components/SessionWrapUp';
import { SessionToast } from './components/SessionToast';
import { Campus } from './pages/Campus';
import { Plan } from './pages/Plan';
import { Learn } from './pages/Learn';
import { Stats } from './pages/Stats';
import { Settings } from './pages/Settings';

function useSystemDark() {
  const [dark, setDark] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false
  );

  useEffect(() => {
    if (!window.matchMedia) return;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setDark(query.matches);
    query.addEventListener?.('change', onChange);
    return () => query.removeEventListener?.('change', onChange);
  }, []);

  return dark;
}

function Shell() {
  const { settings, stage } = useStudy();
  const location = useLocation();
  const systemDark = useSystemDark();
  const focusing = stage === 'focus';
  const isCampus = location.pathname === '/';
  const effectiveTheme =
    settings.hudTheme === 'auto'
      ? systemDark
        ? 'dark'
        : 'light'
      : settings.hudTheme;

  return (
    <div
      className={`app-viewport hud-${effectiveTheme} ${
        settings.reducedMotion ? 'reduce-motion' : ''
      } ${settings.highContrastText ? 'contrast-text' : ''}`}
      data-hud-theme={effectiveTheme}
    >
      <div className="app-frame">
        <span className="frame-corner frame-corner--tl" aria-hidden="true" />
        <span className="frame-corner frame-corner--tr" aria-hidden="true" />
        <span className="frame-corner frame-corner--bl" aria-hidden="true" />
        <span className="frame-corner frame-corner--br" aria-hidden="true" />
        <span className="frame-pixels" aria-hidden="true"><i /><i /><i /></span>

        <div
          className={`app-chrome app-chrome--top ${
            focusing ? 'app-chrome--hidden' : ''
          }`}
          aria-hidden={focusing}
        >
          <TopNav />
        </div>

        <main className={`app-main ${isCampus ? 'app-main--campus' : 'app-main--page'}`}>
          <Routes>
            <Route path="/" element={<Campus />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>

        <div
          className={`app-chrome app-chrome--dock ${
            focusing ? 'app-chrome--hidden' : ''
          }`}
          aria-hidden={focusing}
        >
          <StudyDock />
        </div>

        <StartFocusModal />
        <FocusMode />
        <SessionWrapUp />
        <SessionToast />
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <StudyProvider>
        <Shell />
      </StudyProvider>
    </BrowserRouter>
  );
}
