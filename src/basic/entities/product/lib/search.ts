import { Product } from '../model/types';

// 상품 검색 필터링
export const searchProducts = (
  products: Product[],
  query: string,
): Product[] => {
  if (!query) return products;
  const lowerQuery = query.toLowerCase();

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      (product.description &&
        product.description.toLowerCase().includes(lowerQuery)),
  );
};
