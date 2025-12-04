import { ProductWithUI } from '../types/products';

/**
 * 상품 목록을 검색어로 필터링합니다.
 */
export const filterProductsBySearchTerm = (products: ProductWithUI[], searchTerm: string): ProductWithUI[] => {
  if (!searchTerm) return products;

  const lowerSearchTerm = searchTerm.toLowerCase();
  return products.filter(
    product =>
      product.name.toLowerCase().includes(lowerSearchTerm) ||
      (product.description && product.description.toLowerCase().includes(lowerSearchTerm))
  );
};

/**
 * 재고 상태에 따른 스타일 클래스를 반환합니다.
 */
export const getStockStatusStyle = (stock: number): string => {
  if (stock > 10) return 'bg-green-100 text-green-800';
  if (stock > 0) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

