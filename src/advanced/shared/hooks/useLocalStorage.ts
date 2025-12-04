import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialValue;
      }
    }
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(
      "storage",
      (event) => {
        if (
          event.key === null &&
          event.newValue === null &&
          event.oldValue === null
        ) {
          setValue(initialValue);
        }

        if (event.key === key && event.newValue != null) {
          try {
            setValue(JSON.parse(event.newValue));
          } catch {
            // ignore parse errors
          }
        }
      },
      {
        signal: controller.signal,
      }
    );

    return () => {
      controller.abort();
    };
  }, [key, initialValue]);

  return [value, setValue];
}

