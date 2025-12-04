// TODO: 초기 데이터 상수
// 정의할 상수들:
// - initialProducts: 초기 상품 목록 (상품1, 상품2, 상품3 + 설명 필드 포함)
// - initialCoupons: 초기 쿠폰 목록 (5000원 할인, 10% 할인)
//
// 참고: origin/App.tsx의 초기 데이터 구조를 참조

// TODO: 구현

import { Product, Coupon } from "../../types";

// ============= 초기 데이터 =============
export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export const INITIAL_PRODUCTS: ProductWithUI[] = [
  {
    id: "p1",
    name: "상품1",
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
    description: "최고급 품질의 프리미엄 상품입니다.",
  },
  {
    id: "p2",
    name: "상품2",
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
    description: "다양한 기능을 갖춘 실용적인 상품입니다.",
    isRecommended: true,
  },
  {
    id: "p3",
    name: "상품3",
    price: 30000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.2 },
      { quantity: 30, rate: 0.25 },
    ],
    description: "대용량과 고성능을 자랑하는 상품입니다.",
  },
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    name: "5000원 할인",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    name: "10% 할인",
    code: "PERCENT10",
    discountType: "percentage",
    discountValue: 10,
  },
];

// ============= 폼 초기값 =============
export const EMPTY_PRODUCT_FORM = {
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [] as Array<{ quantity: number; rate: number }>,
};

export const EMPTY_COUPON_FORM = {
  name: "",
  code: "",
  discountType: "amount" as "amount" | "percentage",
  discountValue: 0,
};

// ============= 검증 관련 상수 =============
export const VALIDATION_LIMITS = {
  MAX_STOCK: 9999,
  MAX_COUPON_AMOUNT: 100000,
  MAX_DISCOUNT_PERCENTAGE: 100,
  MIN_PRICE: 0,
  MIN_STOCK: 0,
};

export const STOCK_THRESHOLDS = {
  LOW_STOCK: 5, // 품절 임박 기준
  GOOD_STOCK: 10, // 재고 충분 기준
};

// ============= 타이밍 상수 =============
export const TIMING = {
  SEARCH_DEBOUNCE_MS: 500,
  NOTIFICATION_AUTO_DISMISS_MS: 3000,
};

// ============= 비즈니스 규칙 상수 =============
export const BUSINESS_RULES = {
  MIN_PURCHASE_FOR_PERCENTAGE_COUPON: 10000, // percentage 쿠폰 최소 구매 금액
};

// ============= 메시지 상수 =============
export const MESSAGES = {
  // 검증 에러 메시지
  PRICE_VALIDATION_ERROR: "가격은 0보다 커야 합니다",
  STOCK_VALIDATION_ERROR: "재고는 0보다 커야 합니다",
  STOCK_MAX_ERROR: "재고는 9999개를 초과할 수 없습니다",
  COUPON_PERCENTAGE_MAX_ERROR: "할인율은 100%를 초과할 수 없습니다",
  COUPON_AMOUNT_MAX_ERROR: "할인 금액은 100,000원을 초과할 수 없습니다",

  // 성공 메시지
  PRODUCT_ADDED: "상품이 추가되었습니다.",
  PRODUCT_UPDATED: "상품이 수정되었습니다.",
  PRODUCT_DELETED: "상품이 삭제되었습니다.",
  COUPON_ADDED: "쿠폰이 추가되었습니다.",
  COUPON_DELETED: "쿠폰이 삭제되었습니다.",
  COUPON_APPLIED: "쿠폰이 적용되었습니다.",
  CART_ITEM_ADDED: "장바구니에 담았습니다",

  // 에러 메시지
  OUT_OF_STOCK: "재고가 부족합니다!",
  STOCK_LIMIT_EXCEEDED: (max: number) => `재고는 ${max}개까지만 있습니다.`,
  COUPON_CODE_EXISTS: "이미 존재하는 쿠폰 코드입니다.",
  PERCENTAGE_COUPON_MIN_PURCHASE:
    "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
};

// ============= LocalStorage 키 =============
export const STORAGE_KEYS = {
  PRODUCTS: "products",
  CART: "cart",
  COUPONS: "coupons",
  SELECTED_COUPON: "selectedCoupon",
};
