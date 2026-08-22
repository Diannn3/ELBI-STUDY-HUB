type Listener<T = unknown> = (payload: T) => void;
class Bridge {
  private listeners = new Map<string, Set<Listener>>();
  private latest = new Map<string, unknown>();
  on<T>(event: string, fn: Listener<T>, replayLatest = true) {
    const set = this.listeners.get(event) ?? new Set();
    set.add(fn as Listener); this.listeners.set(event, set);
    if (replayLatest && this.latest.has(event)) fn(this.latest.get(event) as T);
    return () => set.delete(fn as Listener);
  }
  emit<T>(event: string, payload: T) {
    this.latest.set(event, payload);
    this.listeners.get(event)?.forEach(fn => fn(payload));
  }
  clear(event?: string) { if (event) this.latest.delete(event); else this.latest.clear(); }
}
export const sceneBridge = new Bridge();
