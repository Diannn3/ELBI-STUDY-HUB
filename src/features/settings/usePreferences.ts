import { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import type { UserPreferences } from '../../db/schema';
import { enqueueMutation } from '../../sync/outbox';

const ID = 'prefs-local';
const USER_ID = 'local-user';

export function usePreferences() {
  const prefs = useLiveQuery(() => db.preferences.get(ID), [], undefined);
  useEffect(() => {
    if (prefs) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const initial: UserPreferences = {
      id: ID, userId: USER_ID, ambience: 'rain', ambienceVolume: 0.45,
      reducedMotion: reduced, hudTheme: 'light', scenePreset: 'bright', motionMode: reduced ? 'reduced' : 'subtle',
      persistentStoragePrompted: false, updatedAt: Date.now(),
    };
    void db.preferences.put(initial);
  }, [prefs]);

  async function patch(patchValue: Partial<UserPreferences>) {
    const current = await db.preferences.get(ID);
    if (!current) return;
    const next = { ...current, ...patchValue, updatedAt: Date.now() };
    await db.preferences.put(next);
    await enqueueMutation({ entityType: 'preferences', entityId: next.id, operation: 'upsert', payload: next });
  }
  return { prefs, patch };
}
