import { useEffect, useState } from "react";

/**
 * 값을 디바운스하는 커스텀 훅
 * @param value 디바운스할 값
 * @param delay 디바운스 지연 시간 (밀리초)
 * @returns 디바운스된 값
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay가 유효하지 않은 경우 즉시 반환
    if (typeof delay !== "number" || delay < 0 || !isFinite(delay)) {
      setDebouncedValue(value);
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
