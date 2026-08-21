import React from 'react';
import { CampusScene } from '../components/CampusScene';
import { TodayBoard } from '../components/TodayBoard';
import { useStudy } from '../contexts/StudyContext';

export function Campus() {
  const { settings } = useStudy();
  const still = settings.reducedMotion;

  return (
    <div className="h-full w-full overflow-y-auto bg-cream lg:overflow-hidden">
      {/* --- Mobile / narrow: campus art on top, Today in normal flow --- */}
      <div className="lg:hidden">
        <CampusScene
          still={still}
          className="h-[38vh] min-h-[220px] w-full border-b-[3px] border-maroon-deep"
          objectPosition="center 48%" />
        
        <div className="p-3">
          <TodayBoard />
        </div>
      </div>

      {/* --- Desktop: the scene is the page, Today sits in the right framing --- */}
      <div className="relative hidden h-full w-full lg:block">
        <CampusScene
          still={still}
          className="absolute inset-0 h-full w-full"
          objectPosition="center 45%" />
        
        <div className="relative flex h-full items-start justify-end p-5 xl:p-7">
          <TodayBoard className="max-h-full w-[336px] xl:w-[356px]" />
        </div>
      </div>
    </div>);

}