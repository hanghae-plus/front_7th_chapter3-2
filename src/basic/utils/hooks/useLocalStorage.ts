import { useState, useEffect, useCallback } from 'react';

// 커스텀 이벤트 이름
const STORAGE_EVENT_NAME = 'local-storage-change';

/**
 * localStorage와 동기화되는 상태 관리 hook
 * 같은 탭 내 다른 컴포넌트 간에도 동기화됨
 * @param key - localStorage 키
 * @param initialValue - 초기값
 * @returns [저장된 값, 값 설정 함수]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // localStorage에서 값을 읽는 헬퍼 함수
  const readValue = useCallback((): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  // localStorage에서 초기값 로드
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // 값 설정 함수 (localStorage에 저장하고 커스텀 이벤트 발생)
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        // localStorage에 저장
        if (Array.isArray(valueToStore) && valueToStore.length === 0) {
          window.localStorage.removeItem(key);
        } else if (valueToStore === null || valueToStore === undefined) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }

        // 같은 탭 내 다른 컴포넌트에 알림 (커스텀 이벤트)
        window.dispatchEvent(
          new CustomEvent(STORAGE_EVENT_NAME, { detail: { key } })
        );
      } catch (error) {
        console.warn(`Error saving ${key} to localStorage:`, error);
      }
    },
    [key, storedValue]
  );

  // 다른 컴포넌트에서 localStorage 변경 시 동기화
  useEffect(() => {
    const handleStorageChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ key: string }>;
      if (customEvent.detail?.key === key) {
        setStoredValue(readValue());
      }
    };

    window.addEventListener(STORAGE_EVENT_NAME, handleStorageChange);
    return () => {
      window.removeEventListener(STORAGE_EVENT_NAME, handleStorageChange);
    };
  }, [key, readValue]);

  return [storedValue, setValue];
}

