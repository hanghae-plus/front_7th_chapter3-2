import { Dispatch, SetStateAction, useEffect, useState } from 'react';
export const useLocalStorageState = <T>(key: string, initialValue: T) => {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state]);

  return [state, setState] as [T, Dispatch<SetStateAction<T>>];
};
