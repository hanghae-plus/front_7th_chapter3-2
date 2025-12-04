import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import { Product } from '../../../types';

export function useSearch(products: Product[], delay: number = 300) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  // 검색어로 상품 필터링
  const filteredProducts = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return products; // 검색어가 없으면 전체 상품 반환
    }

    const lowerSearchTerm = debouncedSearchTerm.toLowerCase();

    return products.filter(product =>
      product.name.toLowerCase().includes(lowerSearchTerm)
    );
  }, [products, debouncedSearchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    filteredProducts,
  };
}
