import { useState, useEffect, useCallback } from "react";

// TODO: LocalStorage Hook
// 힌트:
// 1. localStorage와 React state 동기화
// 2. 초기값 로드 시 에러 처리
// 3. 저장 시 JSON 직렬화/역직렬화
// 4. 빈 배열이나 undefined는 삭제
//
// 반환값: [저장된 값, 값 설정 함수]

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // 초기값 로드 (lazy initialization)
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return initialValue;
    } catch {
      return initialValue;
    }
  });

  // localStorage와 동기화
  useEffect(() => {
    try {
      // 빈 배열이나 undefined는 삭제
      if (
        storedValue === undefined ||
        (Array.isArray(storedValue) && storedValue.length === 0)
      ) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // 값 설정 함수 (함수형 업데이트 지원)
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue((prev) => {
      if (value instanceof Function) {
        return value(prev);
      }
      return value;
    });
  }, []);

  return [storedValue, setValue];
}
