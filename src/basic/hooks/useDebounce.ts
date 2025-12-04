import { useState, useEffect } from 'react';

/**
 * 입력 값에 디바운스를 적용하는 커스텀 훅
 * @param value 디바운스를 적용할 값
 * @param delay 지연 시간 (ms)
 * @returns 디바운스가 적용된 값
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

