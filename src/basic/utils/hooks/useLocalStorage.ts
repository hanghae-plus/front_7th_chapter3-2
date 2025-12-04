// TODO: LocalStorage Hook
import { useState, useEffect, useCallback } from 'react';

// localStorage 접근 가능 여부 확인
const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return false;
    }
    // localStorage 접근 테스트
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // 2. 초기값 로드 시 에러 처리
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isLocalStorageAvailable()) {
      return initialValue;
    }
    try {
      const item = localStorage.getItem(key);
      if (item) {
        // 3. 저장 시 JSON 역직렬화
        return JSON.parse(item);
      }
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
    }
    return initialValue;
  });

  // 1. localStorage와 React state 동기화
  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      return;
    }
    try {
      // 4. 빈 배열이나 undefined는 삭제
      if (
        storedValue === undefined ||
        (Array.isArray(storedValue) && storedValue.length === 0)
      ) {
        localStorage.removeItem(key);
      } else {
        // 3. 저장 시 JSON 직렬화
        localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Error saving localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    },
    [storedValue]
  );

  // 반환값: [저장된 값, 값 설정 함수]
  return [storedValue, setValue];
}
