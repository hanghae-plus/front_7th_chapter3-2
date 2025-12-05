import { useState } from 'react';
import { LocalStorage } from '../lib/local-storage';

function isEmpty<T>(value: T): boolean {
  if (value === undefined || value === null) {
    return true;
  }
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  return false;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = LocalStorage.get<T>(key);
    return item !== null ? item : initialValue;
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;

        // 빈 값이면 제거
        if (isEmpty(valueToStore)) {
          LocalStorage.remove(key);
        } else {
          LocalStorage.set(key, valueToStore);
        }

        return valueToStore;
      });
    } catch (error) {
      console.error(`useLocalStorage 값 설정 실패 (key: "${key}"):`, error);
    }
  };

  return [storedValue, setValue];
}
