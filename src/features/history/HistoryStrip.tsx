import { useHistory } from './useHistory';

export function HistoryStrip() {
  const { today, week, sessions } = useHistory();
  const max = Math.max(1, ...week.map(x => x.seconds));
  return <div className="history-strip" aria-label="Study history summary">
    <div className="history-stat"><span>TODAY</span><strong>{Math.floor(today.focusSeconds / 60)}m</strong><small>{today.sessions} session{today.sessions === 1 ? '' : 's'}</small></div>
    <div className="week-bars" aria-label="Focus time this week">
      {week.map((bar, i) => <div className="week-bar" key={`${bar.day}-${i}`}><i style={{ height: `${Math.max(3, bar.seconds / max * 24)}px` }} /><span>{bar.day}</span></div>)}
    </div>
    <div className="history-stat history-stat--right"><span>DONE</span><strong>{today.completedTasks}</strong><small>{sessions.length ? `${Math.round(sessions[0].actualSeconds / 60)}m recent` : 'No sessions yet'}</small></div>
  </div>;
}
