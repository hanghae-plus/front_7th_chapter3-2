import { useEffect, useState, useCallback } from "react";

/**
 * localStorage와 동기화되는 상태를 관리하는 커스텀 훅
 * @param key localStorage 키
 * @param initialValue 초기값
 * @returns [값, 값 설정 함수]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storageValue, setStorageValue] = useState<T>(() => {
    try {
      if (typeof window === "undefined") {
        return initialValue;
      }

      const item = window.localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }

      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storageValue) : value;
        setStorageValue(valueToStore);
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storageValue]
  );

  useEffect(() => {
    try {
      if (typeof window === "undefined") {
        return;
      }

      // 빈 배열인 경우 localStorage에서 제거
      if (Array.isArray(storageValue) && storageValue.length === 0) {
        window.localStorage.removeItem(key);
        return;
      }

      window.localStorage.setItem(key, JSON.stringify(storageValue));
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  }, [key, storageValue]);

  return [storageValue, setValue];
}
