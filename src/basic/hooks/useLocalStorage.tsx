import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // 1. 초기값 로드 시 에러 처리 (try-catch)
  const [storedValue, setStoredValue] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialValue; // 파싱 실패 시 초기값 사용
      }
    }
    return initialValue;
  });

  // 2. 값 설정 함수 (함수형 업데이트 지원)
  const setValue = (value: T | ((val: T) => T)) => {
    // React의 함수형 업데이트를 그대로 전달
    setStoredValue(value);
  };

  // 3. localStorage와 React state 동기화
  useEffect(() => {
    // 4. 빈 배열이나 빈 값은 삭제
    if (Array.isArray(storedValue) && storedValue.length === 0) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(storedValue));
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}
