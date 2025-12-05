import { Coupon } from '../../../../types';
import { isValidCouponCode } from '../../../shared/lib/validators';
import { COUPON_ACTIONS, CouponAction, CouponState } from './coupon-reducer';
import { isValidCoupon, isDuplicateCouponCode } from './coupon-utils';

/** Action Creators */
export const couponActions = {
  /** 새 쿠폰 추가 액션 생성 */
  addCoupon: (coupon: Coupon): CouponAction => ({
    type: COUPON_ACTIONS.ADD_COUPON,
    payload: { coupon },
  }),

  /** 쿠폰 삭제 액션 생성 */
  removeCoupon: (couponCode: string): CouponAction => ({
    type: COUPON_ACTIONS.REMOVE_COUPON,
    payload: { couponCode },
  }),

  /** 쿠폰 목록 설정 액션 생성 */
  setCoupons: (coupons: Coupon[]): CouponAction => ({
    type: COUPON_ACTIONS.SET_COUPONS,
    payload: { coupons },
  }),
};

/** 쿠폰 추가 시 유효성 검증 */
export const validateAddCoupon = (state: CouponState, coupon: Coupon): void => {
  if (!isValidCouponCode(coupon.code)) {
    throw new Error(
      '쿠폰 코드는 4-12자의 영문 대문자와 숫자로 구성되어야 합니다.'
    );
  }

  if (!isValidCoupon(coupon)) {
    throw new Error('유효하지 않은 쿠폰 정보입니다.');
  }

  if (isDuplicateCouponCode(state.items, coupon.code)) {
    throw new Error('이미 존재하는 쿠폰 코드입니다.');
  }

  if (coupon.discountType === 'percentage') {
    if (coupon.discountValue <= 0 || coupon.discountValue > 100) {
      throw new Error('할인율은 0보다 크고 100 이하여야 합니다.');
    }
  }

  if (coupon.discountType === 'amount') {
    if (coupon.discountValue <= 0) {
      throw new Error('할인 금액은 0보다 커야 합니다.');
    }
  }
};
