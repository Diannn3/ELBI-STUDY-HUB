"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.latestWriteWins = latestWriteWins;
function latestWriteWins(local, remote) {
    return remote.updatedAt > local.updatedAt ? remote : local;
}
// Focus sessions are intentionally append-only in Pass 1. Deletions are tombstones.
