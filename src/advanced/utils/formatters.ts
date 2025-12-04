/**
 * 가격을 포맷팅합니다.
 */
export const formatPrice = (price: number, isAdmin: boolean = false): string => {
  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }
  return `₩${price.toLocaleString()}`;
};

/**
 * 상품 검색 필터를 적용합니다.
 */
export const filterProducts = <T extends { name: string; description?: string }>(
  products: T[],
  searchTerm: string
): T[] => {
  if (!searchTerm.trim()) {
    return products;
  }

  const lowerSearchTerm = searchTerm.toLowerCase();
  return products.filter(
    product =>
      product.name.toLowerCase().includes(lowerSearchTerm) ||
      (product.description && product.description.toLowerCase().includes(lowerSearchTerm))
  );
};
