"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimer = createTimer;
exports.pauseTimer = pauseTimer;
exports.resumeTimer = resumeTimer;
exports.finishTimer = finishTimer;
exports.endTimerEarly = endTimerEarly;
const durationByMode = {
    pomodoro25: 25,
    focus50: 50,
    quiet5: 5,
};
function createTimer(input) {
    const now = input.now ?? Date.now();
    const plannedMinutes = input.mode === 'custom'
        ? Math.max(1, Math.min(180, input.customMinutes ?? 25))
        : input.mode === 'stopwatch'
            ? undefined
            : durationByMode[input.mode];
    return {
        id: input.id,
        taskId: input.taskId,
        courseId: input.courseId,
        mode: input.mode,
        status: 'running',
        startedAt: now,
        plannedEndAt: plannedMinutes ? now + plannedMinutes * 60_000 : undefined,
        plannedMinutes,
        accumulatedPauseMs: 0,
        updatedAt: now,
    };
}
function pauseTimer(timer, now = Date.now()) {
    if (timer.status !== 'running')
        return timer;
    return { ...timer, status: 'paused', pausedAt: now, updatedAt: now };
}
function resumeTimer(timer, now = Date.now()) {
    if (timer.status !== 'paused' || !timer.pausedAt)
        return timer;
    const pauseMs = Math.max(0, now - timer.pausedAt);
    return {
        ...timer,
        status: 'running',
        pausedAt: undefined,
        accumulatedPauseMs: timer.accumulatedPauseMs + pauseMs,
        updatedAt: now,
    };
}
function finishTimer(timer, now = Date.now()) {
    return { ...timer, status: 'finished', pausedAt: undefined, updatedAt: now };
}
function endTimerEarly(timer, now = Date.now()) {
    return { ...timer, status: 'ended_early', pausedAt: undefined, updatedAt: now };
}
