import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

function Shell() {
  const { settings, stage } = useStudy();
  const focusing = stage === 'focus';

  return (
    <div
      className={`h-full w-full bg-maroon-deep p-0 sm:p-3 lg:p-4 ${
      settings.reducedMotion ? 'reduce-motion' : ''} ${
      settings.highContrastText ? 'contrast-text' : ''}`}>
      
      <div className="relative mx-auto flex h-full w-full max-w-[1920px] flex-col overflow-hidden border-0 border-maroon bg-cream sm:border-[3px]">
        {/* Nav and dock stay mounted but recede while a session runs. */}
        <div
          className={`flex flex-col transition-opacity duration-300 ease-out ${
          focusing ? 'pointer-events-none opacity-0' : 'opacity-100'}`
          }
          aria-hidden={focusing}>
          
          <TopNav />
        </div>

        <main className="relative flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Campus />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>

        <div
          className={`transition-opacity duration-300 ease-out ${
          focusing ? 'pointer-events-none opacity-0' : 'opacity-100'}`
          }
          aria-hidden={focusing}>
          
          <StudyDock />
        </div>

        <StartFocusModal />
        <FocusMode />
        <SessionWrapUp />
        <SessionToast />
      </div>
    </div>);

}

export function App() {
  return (
    <BrowserRouter>
      <StudyProvider>
        <Shell />
      </StudyProvider>
    </BrowserRouter>);

}