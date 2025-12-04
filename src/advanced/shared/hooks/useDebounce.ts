import { useState, useEffect } from 'react';

/**
 * 값이 변경된 후 지정된 시간 동안 변경이 없을 때만 업데이트되는 Hook
 * @param value - debounce할 값
 * @param delay - 지연 시간 (밀리초)
 * @returns debounced된 값
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
