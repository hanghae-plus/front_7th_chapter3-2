import { useState, useEffect } from 'react';

/**
 * localStorage와 동기화되는 상태를 관리하는 Hook
 * @param key - localStorage 키
 * @param initialValue - 초기값
 * @returns [저장된 값, 값을 업데이트하는 함수]
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prevValue: T) => T)) => void] => {
  // 초기값 설정: localStorage에서 가져오거나 initialValue 사용
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // 값이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};
