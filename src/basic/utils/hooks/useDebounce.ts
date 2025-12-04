import { useState, useEffect } from 'react';

/**
 * 값 변경을 지연시키는 디바운스 Hook
 * 지정된 시간 동안 값이 변경되지 않을 때만 업데이트됩니다.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 후에 값을 업데이트하는 타이머 설정
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 값이 변경되거나 컴포넌트가 언마운트되면 타이머 정리
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
