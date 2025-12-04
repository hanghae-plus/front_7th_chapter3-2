import { useState } from "react";
import { useDebounce } from "../utils/hooks/useDebounce";

export const useSearch = (delay: number = 300) => {
  const [searchTerm, setSearchTerm] = useState("");

  // 300ms 디바운스 적용
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  // 제네릭 필터링 함수 (디바운스된 값 사용)
  const filterItems = <T extends Record<string, any>>(
    items: T[],
    searchKeys: (keyof T)[]
  ): T[] => {
    if (!debouncedSearchTerm.trim()) return items;

    return items.filter((item) =>
      searchKeys.some((key) =>
        String(item[key])
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
      )
    );
  };

  return {
    searchTerm, // 실시간 입력값 (UI 표시용)
    debouncedSearchTerm, // 디바운스된 값 (필터링용)
    setSearchTerm,
    filterItems,
  };
};
