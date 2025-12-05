import { useState, useEffect, useCallback } from 'react';

/**
 * localStorage와 동기화되는 상태를 관리하는 훅
 *
 * @param key - localStorage 키
 * @param initialValue - 초기값
 * @returns [상태값, 상태변경함수] 튜플
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // 초기값 로드 (lazy initialization)
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // localStorage 동기화
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error saving to localStorage: ${error}`);
    }
  }, [key, storedValue]);

  // 함수형 업데이트 지원
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const newValue = value instanceof Function ? value(prev) : value;
      return newValue;
    });
  }, []);

  return [storedValue, setValue];
}
