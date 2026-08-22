import { useCallback, useEffect, useState } from 'react';

export interface StorageHealth {
  supported: boolean;
  persisted: boolean;
  usage?: number;
  quota?: number;
}

export function usePersistentStorage() {
  const [health, setHealth] = useState<StorageHealth>({ supported: false, persisted: false });

  const refresh = useCallback(async () => {
    if (!('storage' in navigator)) return;
    const persisted = await navigator.storage.persisted?.().catch(() => false) ?? false;
    const estimate = await navigator.storage.estimate?.().catch(() => undefined);
    setHealth({
      supported: true,
      persisted,
      usage: estimate?.usage,
      quota: estimate?.quota,
    });
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const request = useCallback(async () => {
    if (!navigator.storage?.persist) return false;
    const granted = await navigator.storage.persist();
    await refresh();
    return granted;
  }, [refresh]);

  return { health, request, refresh };
}
