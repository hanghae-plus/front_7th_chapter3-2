// TODO: LocalStorage Hook
// 힌트:
// 1. localStorage와 React state 동기화
// 2. 초기값 로드 시 에러 처리
// 3. 저장 시 JSON 직렬화/역직렬화
// 4. 빈 배열이나 undefined는 삭제
//
// 반환값: [저장된 값, 값 설정 함수]

import { useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // TODO: 구현
  const [storeValue, setStoreValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("localStorage error:", error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      setStoreValue(value);
    } catch (error) {
      console.error("localStorage error:", error);
    }
  };

  useEffect(() => {
    if (
      storeValue === undefined ||
      (Array.isArray(storeValue) && storeValue.length === 0)
    ) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(storeValue));
    }
  }, [key, storeValue]);

  return [storeValue, setValue];
}
