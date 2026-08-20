type Listener<T = unknown> = (payload: T) => void;
class Bridge {
  private listeners = new Map<string, Set<Listener>>();
  on<T>(event: string, fn: Listener<T>) {
    const set = this.listeners.get(event) ?? new Set();
    set.add(fn as Listener); this.listeners.set(event, set);
    return () => set.delete(fn as Listener);
  }
  emit<T>(event: string, payload: T) { this.listeners.get(event)?.forEach(fn => fn(payload)); }
}
export const sceneBridge = new Bridge();
