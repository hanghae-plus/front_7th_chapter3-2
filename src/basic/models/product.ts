// TODO: 상품 비즈니스 로직 (순수 함수)
// 힌트: 모든 함수는 순수 함수로 구현
//
// 구현할 함수들:
// 1. filterProducts(products, searchTerm): 검색어로 상품 필터링
// 2. validateProduct(product): 상품 데이터 유효성 검사 (가격, 재고 등)
// 3. addProduct(products, newProduct): 상품 추가 (불변성 유지)
// 4. updateProduct(products, productId, updates): 상품 수정 (불변성 유지)
// 5. removeProduct(products, productId): 상품 삭제 (불변성 유지)
// 6. findProduct(products, productId): ID로 상품 찾기
//
// 원칙:
// - UI와 관련된 로직 없음 (예: formatPrice는 UI 로직일 수 있음, 하지만 데이터 변환으로 본다면 model도 가능. 여기서는 UI로 간주하여 제외하거나 별도 util로)
// - 외부 상태에 의존하지 않음
// - 모든 필요한 데이터는 파라미터로 전달받음

import { ProductWithUI } from "../../types";

export const filterProductsBySearchTerm = (
  products: ProductWithUI[],
  searchTerm: string
): ProductWithUI[] => {
  if (!searchTerm) return products;
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
};
export const validateProductData = () => {};
export const addProductToList = (
  products: ProductWithUI[],
  newProduct: Omit<ProductWithUI, "id">
): ProductWithUI[] => {
  return [...products, { ...newProduct, id: `p${Date.now()}` }];
};
export const updateProductInList = (
  products: ProductWithUI[],
  productId: string,
  updates: Partial<ProductWithUI>
): ProductWithUI[] => {
  return products.map((product) =>
    product.id === productId ? { ...product, ...updates } : product
  );
};
export const removeProductFromList = (
  products: ProductWithUI[],
  productId: string
): ProductWithUI[] => {
  return products.filter((p) => p.id !== productId);
};
export const findProductById = (
  products: ProductWithUI[],
  productId: string
): ProductWithUI | undefined => {
  return products.find((p) => p.id === productId);
};
