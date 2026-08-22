export type ScenePreset = 'bright' | 'local' | 'rainy';
export type MotionMode = 'full' | 'subtle' | 'reduced';
export type TimeOfDay = 'morning' | 'day' | 'golden' | 'night';

export interface EnvironmentPreferences {
  scenePreset: ScenePreset;
  motionMode: MotionMode;
  reducedMotion: boolean;
  focusCalm: boolean;
}

export interface MarkerRect {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  properties: Record<string, number | string | boolean>;
}

export interface SceneTuning {
  markers: Map<string, MarkerRect>;
}
