import type { MarkerRect, SceneTuning } from './types';

interface TiledProperty { name: string; value: number | string | boolean }
interface TiledObject { name?: string; x?: number; y?: number; width?: number; height?: number; properties?: TiledProperty[] }
interface TiledLayer { type?: string; objects?: TiledObject[] }
interface TiledMap { layers?: TiledLayer[] }

export function parseSceneTuning(raw: TiledMap | undefined): SceneTuning {
  const markers = new Map<string, MarkerRect>();
  for (const layer of raw?.layers ?? []) {
    if (layer.type !== 'objectgroup') continue;
    for (const object of layer.objects ?? []) {
      if (!object.name) continue;
      const properties: Record<string, number | string | boolean> = {};
      for (const p of object.properties ?? []) properties[p.name] = p.value;
      markers.set(object.name, {
        name: object.name,
        x: object.x ?? 0,
        y: object.y ?? 0,
        width: object.width ?? 0,
        height: object.height ?? 0,
        properties,
      });
    }
  }
  return { markers };
}

export function num(marker: MarkerRect | undefined, key: string, fallback: number) {
  const value = marker?.properties[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}
