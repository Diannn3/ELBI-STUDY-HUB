# Interaction specification

## Start focus
- A task can be selected from Today or created inline.
- Start Focus opens a modal with 25/5, 50/10, Quiet 5, Stopwatch, and Custom.
- Ambient sound is optional and requires explicit user interaction.

## Timer
- Absolute timestamps are authoritative; no `remaining--` source of truth.
- Reload/backgrounding derives remaining time from `endsAt` and pause metadata.
- Active timer is persisted locally before the focus screen opens.

## Completion
- `Done`: complete the task.
- `Continue`: retain task state for another block.
- `Blocked`: retain task state and record the session result.
- TIL is optional and intentionally lightweight.
