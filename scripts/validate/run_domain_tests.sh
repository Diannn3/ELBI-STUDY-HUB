#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
rm -rf /tmp/elbi-domain-test
mkdir -p /tmp/elbi-domain-test
cd "$ROOT"
tsc --target ES2022 --module commonjs --moduleResolution node --skipLibCheck --outDir /tmp/elbi-domain-test \
  src/features/focus/domain/timerTypes.ts \
  src/features/focus/domain/deriveTimer.ts \
  src/features/focus/domain/timerMachine.ts \
  src/db/schema.ts \
  src/features/history/stats.ts \
  src/sync/conflicts.ts \
  src/sync/serialize.ts
node scripts/validate/test_domain.cjs
