import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import { ProductWithUI } from '../../../types';

export function useSearch(products: ProductWithUI[], delay: number = 300) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  // 검색어로 상품 필터링
  const filteredProducts = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return products;
    }

    const lowerSearchTerm = debouncedSearchTerm.toLowerCase();

    return products.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(lowerSearchTerm);
      const descriptionMatch = product.description?.toLowerCase().includes(lowerSearchTerm);
      return nameMatch || descriptionMatch;
    });
  }, [products, debouncedSearchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    filteredProducts,
  };
}
