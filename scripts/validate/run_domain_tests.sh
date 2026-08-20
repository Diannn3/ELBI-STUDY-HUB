#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
rm -rf ./.tmp-domain
mkdir -p ./.tmp-domain
cd "$ROOT"
npx tsc --target ES2022 --module commonjs --moduleResolution node --skipLibCheck --outDir ./.tmp-domain \
  src/features/focus/domain/timerTypes.ts \
  src/features/focus/domain/deriveTimer.ts \
  src/features/focus/domain/timerMachine.ts \
  src/db/schema.ts \
  src/features/history/stats.ts \
  src/sync/conflicts.ts \
  src/sync/serialize.ts

echo '{"type":"commonjs"}' > ./.tmp-domain/package.json

node scripts/validate/test_domain.cjs
