# Pass 1 sync architecture

The UI writes to Dexie first. Every cloud-relevant mutation adds an outbox entry in the same user interaction. The app never waits for Supabase before reflecting the local change.

When online and authenticated, `replayOutbox()`:
1. obtains the authenticated Supabase user,
2. maps camelCase local records to snake_case rows,
3. replaces the local placeholder `userId` with the authenticated `auth.uid()`,
4. replays mutations in chronological order,
5. removes acknowledged operations,
6. stops on the first error so ordering remains deterministic.

Conflict policy for Pass 1:
- focus sessions: append-oriented;
- tasks/TIL/preferences: last `updatedAt` wins when a future pull/reconciliation layer is added;
- deletes: tombstones (`deleted_at`);
- realtime social state: not part of Pass 1 and never merged offline.

Cloud replay is configuration-gated; the entire task → focus → TIL loop remains usable without Supabase.
