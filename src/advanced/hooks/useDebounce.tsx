import { useEffect, useState } from "react";

/**
 * 값의 변경을 지연시키는 커스텀 훅
 * @param value - debounce할 값
 * @param delay - 지연 시간 (밀리초)
 * @returns debounced된 값
 *
 * @example
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 후에 값 업데이트
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup: 다음 effect가 실행되기 전에 이전 timeout 취소
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
