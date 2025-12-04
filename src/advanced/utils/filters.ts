import { ProductWithUI } from "../../types";

/**
 * 상품 검색 필터 함수 (순수 함수)
 * @param products 필터링할 상품 배열
 * @param searchTerm 검색어
 * @returns 필터링된 상품 배열
 */
export const filterProductsBySearchTerm = (
  products: ProductWithUI[],
  searchTerm: string
): ProductWithUI[] => {
  if (!products || !Array.isArray(products)) {
    return [];
  }

  if (!searchTerm || typeof searchTerm !== "string") {
    return products;
  }

  const trimmedSearch = searchTerm.trim();
  if (trimmedSearch.length === 0) {
    return products;
  }

  const lowerSearch = trimmedSearch.toLowerCase();

  return products.filter((product) => {
    if (!product || typeof product.name !== "string") {
      return false;
    }

    const nameMatch = product.name.toLowerCase().includes(lowerSearch);
    const descMatch =
      product.description &&
      typeof product.description === "string" &&
      product.description.toLowerCase().includes(lowerSearch);

    return nameMatch || descMatch;
  });
};

/**
 * 상품을 가격 범위로 필터링하는 순수 함수
 * @param products 필터링할 상품 배열
 * @param minPrice 최소 가격
 * @param maxPrice 최대 가격
 * @returns 필터링된 상품 배열
 */
export const filterProductsByPriceRange = (
  products: ProductWithUI[],
  minPrice?: number,
  maxPrice?: number
): ProductWithUI[] => {
  if (!products || !Array.isArray(products)) {
    return [];
  }

  return products.filter((product) => {
    if (typeof product.price !== "number" || isNaN(product.price)) {
      return false;
    }

    if (minPrice !== undefined && product.price < minPrice) {
      return false;
    }

    if (maxPrice !== undefined && product.price > maxPrice) {
      return false;
    }

    return true;
  });
};

/**
 * 상품을 재고 여부로 필터링하는 순수 함수
 * @param products 필터링할 상품 배열
 * @param inStockOnly 재고 있는 상품만 반환할지 여부
 * @returns 필터링된 상품 배열
 */
export const filterProductsByStock = (
  products: ProductWithUI[],
  inStockOnly: boolean = false
): ProductWithUI[] => {
  if (!products || !Array.isArray(products)) {
    return [];
  }

  if (!inStockOnly) {
    return products;
  }

  return products.filter((product) => {
    return (
      typeof product.stock === "number" &&
      !isNaN(product.stock) &&
      product.stock > 0
    );
  });
};


