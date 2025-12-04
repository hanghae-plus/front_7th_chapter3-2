import { useEffect, useState } from "react";

/**
 * 디바운스 Hook
 * 값이 변경되어도 지정된 시간(delay) 동안 대기 후 최종값 반환
 * 대기 시간 동안 값이 다시 변경되면 타이머 리셋
 *
 * @param value - 디바운스할 값
 * @param delay - 대기 시간 (ms)
 * @returns 디바운스된 값
 *
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 300);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 후에 값 업데이트
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 값이 변경되면 이전 타이머 취소 (cleanup)
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
