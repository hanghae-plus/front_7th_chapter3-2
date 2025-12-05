import { useState, useEffect } from 'react';

/**
 * localStorage와 동기화되는 상태를 관리하는 hook
 * @param key - localStorage의 키
 * @param initialValue - 초기값 (localStorage에 값이 없을 때 사용)
 * @returns [state, setState] - useState와 동일한 인터페이스
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // localStorage에서 초기값 가져오기
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 값이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    try {
      // 빈 배열이면 localStorage에서 제거
      if (Array.isArray(storedValue) && storedValue.length === 0 && key === 'cart') {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Error saving localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
