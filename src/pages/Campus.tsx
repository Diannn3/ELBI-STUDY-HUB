import React from 'react';
import { CampusScene } from '../components/CampusScene';
import { TodayBoard } from '../components/TodayBoard';
import { useStudy } from '../contexts/StudyContext';

export function Campus() {
  const { settings } = useStudy();

  return (
    <div className="campus-home">
      <CampusScene still={settings.reducedMotion} className="campus-home__scene" />
      <div className="campus-home__board-slot">
        <TodayBoard />
      </div>
    </div>
  );
}
