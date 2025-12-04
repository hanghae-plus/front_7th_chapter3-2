// TODO: LocalStorage Hook
// 힌트:
// 1. localStorage와 React state 동기화
// 2. 초기값 로드 시 에러 처리
// 3. 저장 시 JSON 직렬화/역직렬화
// 4. 빈 배열이나 undefined는 삭제
//
// 반환값: [저장된 값, 값 설정 함수]

import { useCallback, useEffect, useState } from "react";
import { storage } from "../storage";

// loose Autocomplete pattern
// https://x.com/mattpocockuk/status/1823380970147369171
// https://lackluster.tistory.com/239
type TKey = "products" | "coupons" | "cart";

export function useLocalStorage<T>(
  key: TKey | (string & {}),
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [value, setValue] = useState<T>(() => storage.get<T>(key) ?? initialValue);

  useEffect(() => {
    return storage.subscribe<T>(key, (newValue) => {
      setValue(newValue ?? initialValue);
    });
  }, [key, initialValue]);

  const set = useCallback(
    (newValue: T | ((val: T) => T)) => {
      const valueToStore =
        newValue instanceof Function ? newValue(storage.get<T>(key) ?? initialValue) : newValue;

      // 빈 배열이나 undefined는 삭제
      if (valueToStore === undefined || (Array.isArray(valueToStore) && valueToStore.length === 0)) {
        storage.remove(key);
        return;
      }

      storage.set(key, valueToStore);
    },
    [key, initialValue]
  );

  const remove = useCallback(() => {
    storage.remove(key);
  }, [key]);

  return [value, set, remove];
}
