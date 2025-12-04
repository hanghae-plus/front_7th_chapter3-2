import { Product } from '../../types';

/**
 * 상품이 품절인지 확인
 */
export const isOutOfStock = (remainingStock: number) => {
  return remainingStock <= 0;
};

/**
 * 재고 부족 여부 확인 (5개 이하)
 */
export const isLowStock = (remainingStock: number) => {
  return remainingStock > 0 && remainingStock <= 5;
};

/**
 * 상품의 최대 할인율 가져오기
 */
export const getProductMaxDiscountRate = (product: Product) => {
  if (product.discounts.length === 0) {
    return 0;
  }

  return Math.max(...product.discounts.map((d) => d.rate));
};

/**
 * 상품 검색 필터링
 */
export const filterProducts = ({
  products,
  searchTerm,
}: {
  products: Product[];
  searchTerm: string;
}) => {
  if (!searchTerm) {
    return products;
  }

  const lowerSearchTerm = searchTerm.toLowerCase();

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerSearchTerm) ||
      (product as any).description?.toLowerCase().includes(lowerSearchTerm)
  );
};
