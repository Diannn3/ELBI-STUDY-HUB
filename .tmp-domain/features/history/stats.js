"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startOfLocalDay = startOfLocalDay;
exports.computeTodayStats = computeTodayStats;
exports.computeWeekBars = computeWeekBars;
function startOfLocalDay(ts) {
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}
function computeTodayStats(sessions, tasks, now = Date.now()) {
    const start = startOfLocalDay(now);
    const todays = sessions.filter(s => s.endedAt >= start && s.endedAt <= now);
    return {
        focusSeconds: todays.reduce((sum, s) => sum + s.actualSeconds, 0),
        sessions: todays.length,
        completedTasks: tasks.filter(t => t.status === 'done' && t.updatedAt >= start).length,
    };
}
function computeWeekBars(sessions, now = Date.now()) {
    const today = new Date(now);
    const day = (today.getDay() + 6) % 7;
    const monday = startOfLocalDay(now) - day * 86_400_000;
    return Array.from({ length: 7 }, (_, i) => {
        const from = monday + i * 86_400_000;
        const to = from + 86_400_000;
        const seconds = sessions.filter(s => s.endedAt >= from && s.endedAt < to).reduce((sum, s) => sum + s.actualSeconds, 0);
        return { day: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i], seconds };
    });
}
