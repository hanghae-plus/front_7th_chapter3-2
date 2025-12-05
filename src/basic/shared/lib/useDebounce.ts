import { useState, useEffect } from "react";

/**
 * 값이 변경되면 지정된 시간(delay)만큼 기다렸다가 업데이트하는 훅
 * @param value 관찰할 값
 * @param delay 지연 시간 (ms)
 * @returns 디바운스된 값
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 1. 타이머 설정: delay 후에 상태 업데이트
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 2. 클린업(Cleanup): 값이 또 바뀌면 이전 타이머 취소 (핵심)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
