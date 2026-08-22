#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
rm -rf "$ROOT/.tmp-domain"
mkdir -p "$ROOT/.tmp-domain"
cd "$ROOT"
tsc --target ES2022 --module commonjs --moduleResolution node --skipLibCheck --outDir ./.tmp-domain \
  src/features/focus/domain/timerTypes.ts \
  src/features/focus/domain/deriveTimer.ts \
  src/features/focus/domain/timerMachine.ts \
  src/db/schema.ts \
  src/features/history/stats.ts \
  src/sync/conflicts.ts \
  src/sync/serialize.ts \
  src/game/environment/types.ts \
  src/game/environment/SceneDirector.ts \
  src/game/environment/tiledSceneTuning.ts \
  src/game/EventBridge.ts
printf '{"type":"commonjs"}\n' > ./.tmp-domain/package.json
node scripts/validate/test_domain.cjs
