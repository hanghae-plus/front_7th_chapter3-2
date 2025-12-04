import { useEffect, useState } from "react";

export const useDebounce = <T>(searchTerm: T, delay: number = 500): T => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<T>(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return debouncedSearchTerm;
};
