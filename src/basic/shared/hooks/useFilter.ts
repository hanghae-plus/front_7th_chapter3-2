import { useDebounce } from '@/shared/hooks';
import { useMemo, useState } from 'react';

export interface UseFilterOptions {
  debounceDelay?: number;
}

export const useFilter = <T>(
  rawList: T[],
  filterFn: (list: T[], query: string) => T[],
  options: UseFilterOptions = {}
) => {
  const { debounceDelay = 300 } = options;

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceDelay);

  const filteredList = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return rawList;
    }
    return filterFn(rawList, debouncedQuery);
  }, [rawList, debouncedQuery, filterFn]);

  return {
    query,
    setQuery,
    filteredList,
    isFiltering: query !== debouncedQuery,
  };
};
