import { Product, Coupon } from '../../types';

/**
 * 초기 상품 데이터
 */
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.2 },
      { quantity: 30, rate: 0.25 },
    ],
  },
];

/**
 * 초기 쿠폰 데이터
 */
export const INITIAL_COUPONS: Coupon[] = [
  {
    name: '5000원 할인',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

/**
 * 재고 임계값
 */
export const STOCK_THRESHOLD = {
  LOW: 5, // 품절 임박 기준
  OUT: 0, // 품절 기준
} as const;

/**
 * 할인 설정
 */
export const DISCOUNT_CONFIG = {
  MAX_RATE: 0.5, // 최대 할인율 50%
  BULK_BONUS: 0.05, // 대량 구매 보너스 할인 5%
  BULK_QUANTITY_THRESHOLD: 10, // 대량 구매 기준 수량
} as const;

/**
 * 쿠폰 설정
 */
export const COUPON_CONFIG = {
  MIN_AMOUNT_FOR_PERCENTAGE: 10000, // percentage 쿠폰 최소 금액
  MAX_PERCENTAGE: 100, // 최대 할인율 100%
  MAX_AMOUNT: 100000, // 최대 할인 금액
} as const;

/**
 * 상품 설정
 */
export const PRODUCT_CONFIG = {
  MAX_STOCK: 9999, // 최대 재고 수량
} as const;

/**
 * 디바운스 설정
 */
export const DEBOUNCE_DELAY = 500; // 500ms

/**
 * LocalStorage 키
 */
export const STORAGE_KEYS = {
  PRODUCTS: 'products',
  CART: 'cart',
  COUPONS: 'coupons',
} as const;
