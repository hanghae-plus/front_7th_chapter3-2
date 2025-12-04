type Listener<T> = (value: T | null) => void;

const listeners = new Map<string, Set<Listener<any>>>();

export const storage = {
  get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  set<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
    listeners.get(key)?.forEach((listener) => listener(value));
  },
  remove(key: string) {
    localStorage.removeItem(key);
    listeners.get(key)?.forEach((listener) => listener(null));
  },
  subscribe<T>(key: string, listener: Listener<T>) {
    if (!listeners.has(key)) {
      listeners.set(key, new Set());
    }
    listeners.get(key)?.add(listener);

    return () => {
      listeners.get(key)?.delete(listener);
      if (listeners.get(key)?.size === 0) {
        listeners.delete(key);
      }
    };
  },
};
