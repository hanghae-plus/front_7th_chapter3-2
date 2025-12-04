import { CartItem, Product, ProductWithUI } from "../../types";

/**
 * 상품의 남은 재고를 계산합니다 (장바구니에 담긴 수량 제외)
 * @param product 상품
 * @param cart 현재 장바구니
 * @returns 남은 재고 수량
 */
export const getRemainingStock = (product: Product, cart: CartItem[]): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
};

/**
 * 검색어로 상품을 필터링합니다
 * @param products 전체 상품 목록
 * @param searchTerm 검색어
 * @returns 필터링된 상품 목록
 */
export const filterProducts = (products: ProductWithUI[], searchTerm: string): ProductWithUI[] => {
  // 검색어가 없으면 전체 상품 반환
  if (!searchTerm || searchTerm.trim() === "") {
    return products;
  }

  const lowerSearchTerm = searchTerm.toLowerCase();

  return products.filter((product) => {
    // 상품명에서 검색
    const nameMatch = product.name.toLowerCase().includes(lowerSearchTerm);

    // 상품 설명에서 검색
    const descriptionMatch =
      product.description && product.description.toLowerCase().includes(lowerSearchTerm);

    return nameMatch || descriptionMatch;
  });
};
