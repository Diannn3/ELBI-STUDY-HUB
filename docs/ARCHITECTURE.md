# Pass 1 architecture

## State ownership

| Layer | Owns |
|---|---|
| React | forms, navigation, task UI, focus/wrap UI, settings, accessibility |
| Dexie / IndexedDB | tasks, courses, sessions, TILs, active timer, preferences, sync outbox |
| Zustand | tiny ephemeral UI state only |
| Phaser | hero scene rendering and procedural ambience |
| Supabase | authenticated cloud copy and future canonical multi-device data |

The React application never reaches into arbitrary Phaser objects. `EventBridge.ts` is the narrow boundary for scene-level commands/events.

## Pass-1 data path

```text
React UI
  ↓ immediate write
Dexie / IndexedDB
  ├─ UI reacts through useLiveQuery()
  └─ syncOutbox
       ↓ when online + authenticated
     Supabase
```

## Timer

The timer's source of truth is timestamps (`startedAt`, `plannedEndAt`, pause metadata). Display values are derived from the wall clock. A 250 ms UI refresh never changes the authoritative duration.

## Scene pipeline

```text
LibreSprite-editable source layers + deterministic putPixel script
       ↓
Tiled .tmj scene composition / markers
       ↓
PNG exports + reusable props
       ↓
FastPack .fpsheet → Phaser multiatlas
       ↓
OxiPNG lossless optimization
       ↓
Phaser 4 scene
```

For Pass 1 the unique campus hero is precomposited into one 320×180 image for fewer draw calls. Tiled remains the editable composition/marker source. Reusable props are atlas-packed separately.
