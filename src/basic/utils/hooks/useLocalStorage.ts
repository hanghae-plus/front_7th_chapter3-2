import { useState, useEffect } from 'react';

/**
 * localStorage와 React state를 동기화하는 Hook
 * JSON 직렬화/역직렬화 및 에러 처리 포함
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // State 초기화 - localStorage에서 읽기 시도
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // State가 변경되면 localStorage에 저장
  useEffect(() => {
    try {
      // 빈 배열이나 null/undefined는 삭제
      if (
        storedValue === null ||
        storedValue === undefined ||
        (Array.isArray(storedValue) && storedValue.length === 0)
      ) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // setValue 함수 - 함수형 업데이트 지원
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    } catch (error) {
      console.warn(`Error updating localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
