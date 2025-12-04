import { useEffect } from 'react';

/**
 * 값의 변화를 localStorage에 자동으로 동기화하는 커스텀 훅
 * @param key localStorage 키
 * @param value 저장할 값
 * @param options 옵션 (removeIfEmpty: 값이 비어있을 때 제거할지 여부)
 */
export const useLocalStorage = <T>(
  key: string,
  value: T,
  options?: { removeIfEmpty?: boolean }
) => {
  useEffect(() => {
    if (options?.removeIfEmpty && Array.isArray(value) && value.length === 0) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value, options?.removeIfEmpty]);
};

