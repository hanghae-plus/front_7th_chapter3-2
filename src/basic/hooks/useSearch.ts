import { useState } from "react";

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // 제네릭 필터링 함수
  const filterItems = <T extends Record<string, any>>(
    items: T[],
    searchKeys: (keyof T)[]
  ): T[] => {
    if (!searchTerm.trim()) return items;

    return items.filter((item) =>
      searchKeys.some((key) =>
        String(item[key]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  return { searchTerm, setSearchTerm, filterItems };
};
