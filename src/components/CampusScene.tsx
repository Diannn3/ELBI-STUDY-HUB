import React from 'react';

export const CAMPUS_ART = "/913789bf-3de1-4658-aace-282b8a6dc90b.jpg";


interface CampusSceneProps {
  /** Focus mode drops brightness + saturation so the scene becomes background. */
  subdued?: boolean;
  /** Ambient drift off (reduced motion). */
  still?: boolean;
  className?: string;
  /** Mobile crop keeps the landmark centered in a shorter frame. */
  objectPosition?: string;
}

export function CampusScene({
  subdued = false,
  still = false,
  className = '',
  objectPosition = 'center 42%'
}: CampusSceneProps) {
  return (
    <div
      className={`relative overflow-hidden bg-scene-sky ${className}`}
      aria-hidden="true">
      
      <img
        src={CAMPUS_ART}
        alt=""
        className={`pixelated h-full w-full object-cover ${
        subdued ? 'scene-focus' : 'scene-bright'}`
        }
        style={{ objectPosition }} />
      

      {/* Two slow cloud bands over the sky only. Nothing else moves. */}
      {!still &&
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[42%] overflow-hidden">
          <div
          className="drift-slow absolute left-[-10%] top-[14%] h-6 w-[45%]"
          style={{
            background:
            'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.42) 30%, rgba(255,255,255,0.42) 70%, rgba(255,255,255,0) 100%)',
            filter: 'blur(1px)'
          }} />
        
          <div
          className="drift-slower absolute right-[-14%] top-[42%] h-4 w-[38%]"
          style={{
            background:
            'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0) 100%)',
            filter: 'blur(1px)'
          }} />
        
        </div>
      }

      {/* Warm afternoon light + gentle edge falloff so UI reads over the art. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
          'radial-gradient(120% 90% at 50% 20%, rgba(255,236,196,0.12) 0%, rgba(41,39,37,0) 55%, rgba(41,39,37,0.18) 100%)'
        }} />
      

      {subdued &&
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: 'rgba(1,68,33,0.10)' }} />

      }
    </div>);

}