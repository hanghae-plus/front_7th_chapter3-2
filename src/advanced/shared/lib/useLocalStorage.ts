// TODO: LocalStorage Hook
// 힌트:
// 1. localStorage와 React state 동기화
// 2. 초기값 로드 시 에러 처리
// 3. 저장 시 JSON 직렬화/역직렬화
// 4. 빈 배열이나 undefined는 삭제
//
// 반환값: [저장된 값, 값 설정 함수]

import { useState } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // 1. localStorage와 React state 동기화
  const [storage, setStorage] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // 2. 초기값 로드 시 에러 처리
      console.error(`[localStorage 로드 에러] key: ${key}, error: ${error}`);
      return initialValue;
    }
  });
  // 3. 저장 시 JSON 직렬화/역직렬화
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 함수가 전달되면 이전 값으로 새 값 계산
      const valueToStore = value instanceof Function ? value(storage) : value;

      // React state 업데이트
      setStorage(valueToStore);

      // 4. 빈 배열이나 undefined는 삭제
      if (
        valueToStore === undefined ||
        (Array.isArray(valueToStore) && valueToStore.length === 0)
      ) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`[localStorage 저장 에러] key: ${key}, error: ${error}`);
    }
  };

  return [storage, setValue];
}
