import { Discount, Product } from '../../../../types';
import { ProductWithUI } from './product-interface';

export const STOCK_THRESHOLD = {
  ENOUGH: 10,
  RUNNING_OUT: 5,
  SOLD_OUT: 0,
} as const;

export const DEFAULT_DISCOUNT: Discount = {
  quantity: 10,
  rate: 0.1,
} as const;

export type StockStatus = 'sufficient' | 'low' | 'out';

/** 상품의 재고가 있는지 확인 */
export const hasStock = (product: Product): boolean => product.stock > 0;

/** 재고가 품절 상태인지 확인 */
export const isSoldOut = (stock: number): boolean =>
  stock <= STOCK_THRESHOLD.SOLD_OUT;

/** 재고가 충분한지 확인 */
export const isStockEnough = (stock: number): boolean =>
  stock > STOCK_THRESHOLD.RUNNING_OUT;

/** 재고가 부족한 상태인지 확인 */
export const isStockRunningOut = (stock: number): boolean =>
  stock <= STOCK_THRESHOLD.RUNNING_OUT && stock > STOCK_THRESHOLD.SOLD_OUT;

/** 상품에 할인이 있는지 확인 */
export const hasDiscounts = (product: Product): boolean =>
  product.discounts.length > 0;

/** 할인율 배열에서 최대값 추출 */
export const getMaxDiscountRate = (product: Product): number => {
  if (!hasDiscounts(product)) return 0;
  return Math.max(...product.discounts.map((d) => d.rate));
};

/** 첫 번째 할인 정보 가져오기 */
export const getFirstDiscountInfo = (product: Product): Discount | null => {
  if (!hasDiscounts(product)) return null;
  return product.discounts[0];
};

/** 특정 수량에 적용 가능한 최대 할인율 계산 */
export const getApplicableDiscountForQuantity = (
  product: Product,
  quantity: number
): number => {
  return product.discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);
};

/** 유효한 재고인지 검증 */
export const isValidProductStock = (stock: number): boolean =>
  typeof stock === 'number' && !isNaN(stock) && stock >= 0;

/** 유효한 가격인지 검증 */
export const isValidProductPrice = (price: number): boolean =>
  typeof price === 'number' && !isNaN(price) && price > 0;

/** 재고 상태를 3단계로 분류 */
export const getStockStatus = (stock: number): StockStatus => {
  if (stock > STOCK_THRESHOLD.ENOUGH) return 'sufficient';
  if (stock > STOCK_THRESHOLD.SOLD_OUT) return 'low';
  return 'out';
};

/** 할인 목록을 수량 기준으로 정렬 */
export const sortDiscountsByQuantity = (discounts: Discount[]): Discount[] =>
  [...discounts].sort((a, b) => a.quantity - b.quantity);

/** 기본 할인 객체 생성 */
export const createDefaultDiscount = (): Discount => ({ ...DEFAULT_DISCOUNT });

/** 상품 목록의 총 재고 수량 계산 */
export const getTotalItemCount = (products: Product[]): number =>
  products.reduce((acc, product) => acc + product.stock, 0);

/** 검색어로 상품 필터링 (이름 또는 설명) */
export const filterProductsBySearchTerm = (
  products: ProductWithUI[],
  searchTerm: string
): ProductWithUI[] => {
  if (!searchTerm) return products;

  const lowerSearchTerm = searchTerm.toLowerCase();

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerSearchTerm) ||
      (product.description &&
        product.description.toLowerCase().includes(lowerSearchTerm))
  );
};

/** 재고가 있는 상품만 필터링 */
export const filterInStockProducts = (products: Product[]): Product[] =>
  products.filter(hasStock);

/** 할인이 있는 상품만 필터링 */
export const filterDiscountedProducts = (products: Product[]): Product[] =>
  products.filter(hasDiscounts);

/** 재고 상태별로 상품 필터링 */
export const filterByStockStatus = (
  products: Product[],
  status: StockStatus
): Product[] => products.filter((p) => getStockStatus(p.stock) === status);

/** 상품 전체 검증 */
export const isValidProduct = (product: Partial<Product>): boolean => {
  return !!(
    product.name &&
    product.price !== undefined &&
    isValidProductPrice(product.price) &&
    product.stock !== undefined &&
    isValidProductStock(product.stock)
  );
};

/** 고유한 상품 ID 생성 */
export const generateProductId = (): string => `p${Date.now()}`;
