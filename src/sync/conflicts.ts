export interface VersionedRecord { updatedAt: number }

export function latestWriteWins<T extends VersionedRecord>(local: T, remote: T): T {
  return remote.updatedAt > local.updatedAt ? remote : local;
}

// Focus sessions are intentionally append-only in Pass 1. Deletions are tombstones.
