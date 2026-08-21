import React from 'react';

export const CAMPUS_ART = '/campus-reference-pixel.png';

interface CampusSceneProps {
  subdued?: boolean;
  still?: boolean;
  className?: string;
  objectPosition?: string;
}

export function CampusScene({
  subdued = false,
  still = false,
  className = '',
  objectPosition = 'center center'
}: CampusSceneProps) {
  return (
    <div
      className={`campus-scene ${subdued ? 'campus-scene--focus' : ''} ${
        still ? 'campus-scene--still' : ''
      } ${className}`}
      aria-hidden="true"
    >
      <img
        src={CAMPUS_ART}
        alt=""
        className="campus-scene__image pixelated"
        style={{ objectPosition }}
      />
      <div className="campus-scene__sunwash" />
      <div className="campus-scene__edge" />
      {!still && !subdued ? (
        <>
          <span className="ambient-bird ambient-bird--one" />
          <span className="ambient-bird ambient-bird--two" />
        </>
      ) : null}
      {subdued ? <div className="campus-scene__focus-tint" /> : null}
    </div>
  );
}
