import { CartItem, Coupon } from "../../types";
import { calculateItemTotal } from "./cart";
import { isValidCouponCode } from "../utils/validators";

/**
 * 쿠폰 적용 가능 여부를 검증하는 순수 함수
 * @param coupon 적용할 쿠폰
 * @param cartTotal 쿠폰 적용 전 장바구니 총액
 * @returns 검증 결과와 에러 메시지
 */
export const validateCoupon = (
  coupon: Coupon,
  cartTotal: number
): { isValid: boolean; errorMessage?: string } => {
  if (coupon.discountType === "percentage" && cartTotal < 10000) {
    return {
      isValid: false,
      errorMessage: "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
    };
  }

  return { isValid: true };
};

/**
 * 쿠폰을 적용한 최종 금액을 계산하는 순수 함수
 * @param totalBeforeCoupon 쿠폰 적용 전 총액
 * @param coupon 적용할 쿠폰
 * @returns 쿠폰 적용 후 총액
 */
export const applyCouponDiscount = (
  totalBeforeCoupon: number,
  coupon: Coupon | null
): number => {
  if (!coupon) {
    return totalBeforeCoupon;
  }

  if (coupon.discountType === "amount") {
    return Math.max(0, totalBeforeCoupon - coupon.discountValue);
  } else {
    return Math.round(
      totalBeforeCoupon * (1 - coupon.discountValue / 100)
    );
  }
};

/**
 * 쿠폰 적용 전 장바구니 총액을 계산하는 순수 함수
 * @param cart 장바구니 아이템 배열
 * @returns 쿠폰 적용 전 총액
 */
export const calculateTotalBeforeCoupon = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => {
    return total + calculateItemTotal(cart, item);
  }, 0);
};

/**
 * 쿠폰 생성 시 입력값 검증 결과
 */
export interface CouponValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * 쿠폰 생성 시 입력값을 검증하는 순수 함수
 * @param coupon 검증할 쿠폰 데이터
 * @returns 검증 결과
 */
export const validateCouponForm = (
  coupon: Partial<Coupon>
): CouponValidationResult => {
  if (!coupon.name || coupon.name.trim() === "") {
    return {
      isValid: false,
      errorMessage: "쿠폰명을 입력해주세요.",
    };
  }

  if (!coupon.code || coupon.code.trim() === "") {
    return {
      isValid: false,
      errorMessage: "쿠폰 코드를 입력해주세요.",
    };
  }

  // 쿠폰 코드는 영문 대문자와 숫자만 허용 (utils 함수 사용)
  if (!isValidCouponCode(coupon.code)) {
    return {
      isValid: false,
      errorMessage: "쿠폰 코드는 영문 대문자와 숫자만 사용할 수 있습니다.",
    };
  }

  if (coupon.discountValue === undefined || coupon.discountValue === null) {
    return {
      isValid: false,
      errorMessage: "할인 값을 입력해주세요.",
    };
  }

  if (coupon.discountType === "percentage") {
    if (coupon.discountValue < 0) {
      return {
        isValid: false,
        errorMessage: "할인율은 0 이상이어야 합니다.",
      };
    }
    if (coupon.discountValue > 100) {
      return {
        isValid: false,
        errorMessage: "할인율은 100%를 초과할 수 없습니다",
      };
    }
  } else if (coupon.discountType === "amount") {
    if (coupon.discountValue < 0) {
      return {
        isValid: false,
        errorMessage: "할인 금액은 0 이상이어야 합니다.",
      };
    }
    if (coupon.discountValue > 100000) {
      return {
        isValid: false,
        errorMessage: "할인 금액은 100,000원을 초과할 수 없습니다.",
      };
    }
  }

  return { isValid: true };
};

/**
 * 쿠폰 코드 중복 여부를 확인하는 순수 함수
 * @param coupons 기존 쿠폰 배열
 * @param code 확인할 쿠폰 코드
 * @returns 중복 여부
 */
export const isCouponCodeDuplicate = (
  coupons: Coupon[],
  code: string
): boolean => {
  return coupons.some((coupon) => coupon.code === code);
};

/**
 * 쿠폰을 추가하는 순수 함수
 * @param coupons 기존 쿠폰 배열
 * @param newCoupon 추가할 쿠폰
 * @returns 추가 결과와 업데이트된 쿠폰 배열
 */
export interface AddCouponResult {
  coupons: Coupon[];
  success: boolean;
  errorMessage?: string;
}

export const addCoupon = (
  coupons: Coupon[],
  newCoupon: Coupon
): AddCouponResult => {
  const validation = validateCouponForm(newCoupon);
  if (!validation.isValid) {
    return {
      coupons,
      success: false,
      errorMessage: validation.errorMessage,
    };
  }

  if (isCouponCodeDuplicate(coupons, newCoupon.code)) {
    return {
      coupons,
      success: false,
      errorMessage: "이미 존재하는 쿠폰 코드입니다.",
    };
  }

  return {
    coupons: [...coupons, newCoupon],
    success: true,
  };
};

