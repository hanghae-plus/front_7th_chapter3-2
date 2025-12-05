import { useCallback, useSyncExternalStore } from 'react';

// 글로벌 스토어를 통해 같은 key를 사용하는 모든 훅이 동일한 상태를 공유
const subscribers = new Map<string, Set<() => void>>();
const cache = new Map<string, unknown>();

function subscribe(key: string, callback: () => void) {
  if (!subscribers.has(key)) {
    subscribers.set(key, new Set());
  }
  subscribers.get(key)!.add(callback);
  return () => {
    subscribers.get(key)?.delete(callback);
  };
}

function notifySubscribers(key: string) {
  subscribers.get(key)?.forEach((callback) => callback());
}

function getStorageValue<T>(key: string, initialValue: T): T {
  // localStorage에 값이 없으면 cache도 무효화
  const item = localStorage.getItem(key);
  if (item === null) {
    cache.delete(key);
    return initialValue;
  }
  if (cache.has(key)) {
    return cache.get(key) as T;
  }
  try {
    const value = JSON.parse(item);
    cache.set(key, value);
    return value;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    cache.set(key, initialValue);
    return initialValue;
  }
}

function setStorageValue<T>(key: string, value: T) {
  try {
    cache.set(key, value);
    if (
      value === undefined ||
      (Array.isArray(value) && value.length === 0)
    ) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
    notifySubscribers(key);
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
  const getSnapshot = useCallback(() => {
    return getStorageValue(key, initialValue);
  }, [key, initialValue]);

  const subscribeToKey = useCallback(
    (callback: () => void) => subscribe(key, callback),
    [key],
  );

  const storedValue = useSyncExternalStore(
    subscribeToKey,
    getSnapshot,
    getSnapshot,
  );

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      const currentValue = getStorageValue(key, initialValue);
      const valueToStore =
        value instanceof Function ? value(currentValue) : value;
      setStorageValue(key, valueToStore);
    },
    [key, initialValue],
  );

  return [storedValue as T, setValue];
}
