import { Discount, Product, ProductWithUI } from '../types/products';

/**
 * 상품의 최대 할인율을 계산합니다 (백분율).
 */
export const getMaxDiscountRate = (product: Product): number => {
  if (product.discounts.length === 0) return 0;
  return Math.max(...product.discounts.map(d => d.rate)) * 100;
};

/**
 * 상품의 첫 번째 할인 정보를 반환합니다.
 */
export const getFirstDiscount = (product: Product): { quantity: number; rate: number } | null => {
  if (product.discounts.length === 0) return null;
  return product.discounts[0];
};

/**
 * 상품의 첫 번째 할인 정보를 표시용 문자열로 포맷팅합니다.
 */
export const formatFirstDiscount = (product: Product): string | null => {
  const firstDiscount = getFirstDiscount(product);
  if (!firstDiscount) return null;
  return `${firstDiscount.quantity}개 이상 구매시 할인 ${firstDiscount.rate * 100}%`;
};

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
 * 할인 정책 목록에서 특정 인덱스의 할인을 제거합니다.
 */
export const removeDiscount = (discounts: Discount[], index: number): Discount[] => {
  return discounts.filter((_, i) => i !== index);
};

/**
 * 할인 정책 목록에 기본 할인을 추가합니다.
 */
export const addDefaultDiscount = (discounts: Discount[]): Discount[] => {
  return [...discounts, { quantity: 10, rate: 0.1 }];
};

/**
 * 재고 상태에 따른 스타일 클래스를 반환합니다.
 */
export const getStockStatusStyle = (stock: number): string => {
  if (stock > 10) return 'bg-green-100 text-green-800';
  if (stock > 0) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

/**
 * 재고 상태에 따른 표시 텍스트를 반환합니다.
 */
export const getStockStatusText = (remainingStock: number): { text: string; className: string } | null => {
  if (remainingStock <= 5 && remainingStock > 0) {
    return { text: `품절임박! ${remainingStock}개 남음`, className: 'text-xs text-red-600 font-medium' };
  }
  if (remainingStock > 5) {
    return { text: `재고 ${remainingStock}개`, className: 'text-xs text-gray-500' };
  }
  return null;
};

/**
 * 장바구니 버튼 텍스트를 반환합니다.
 */
export const getCartButtonText = (remainingStock: number): string => {
  return remainingStock <= 0 ? '품절' : '장바구니 담기';
};

/**
 * 편집 모드에 따른 폼 제목을 반환합니다.
 */
export const getProductFormTitle = (editingProduct: string | null): string => {
  return editingProduct === 'new' ? '새 상품 추가' : '상품 수정';
};

/**
 * 편집 모드에 따른 제출 버튼 텍스트를 반환합니다.
 */
export const getProductFormSubmitText = (editingProduct: string | null): string => {
  return editingProduct === 'new' ? '추가' : '수정';
};

/**
 * 편집 모드인지 확인합니다.
 */
export const isNewProduct = (editingProduct: string | null): boolean => {
  return editingProduct === 'new';
};

/**
 * 편집 중인 상품인지 확인합니다.
 */
export const isEditingProduct = (editingProduct: string | null): boolean => {
  return editingProduct !== null && editingProduct !== 'new';
};

