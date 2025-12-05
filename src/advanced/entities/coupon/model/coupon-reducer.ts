import { Coupon } from '../../../../types';

export const COUPON_ACTIONS = {
  ADD_COUPON: 'coupon/ADD_COUPON',
  REMOVE_COUPON: 'coupon/REMOVE_COUPON',
  SET_COUPONS: 'coupon/SET_COUPONS',
} as const;

export type CouponAction =
  | {
      type: typeof COUPON_ACTIONS.ADD_COUPON;
      payload: { coupon: Coupon };
    }
  | {
      type: typeof COUPON_ACTIONS.REMOVE_COUPON;
      payload: { couponCode: string };
    }
  | {
      type: typeof COUPON_ACTIONS.SET_COUPONS;
      payload: { coupons: Coupon[] };
    };

export interface CouponState {
  items: Coupon[];
}

export const initialCouponState: CouponState = {
  items: [],
};

/** 쿠폰 상태 관리 Reducer (순수 함수) */
export function couponReducer(
  state: CouponState,
  action: CouponAction
): CouponState {
  switch (action.type) {
    case COUPON_ACTIONS.ADD_COUPON: {
      const { coupon } = action.payload;
      return {
        ...state,
        items: [...state.items, coupon],
      };
    }

    case COUPON_ACTIONS.REMOVE_COUPON: {
      const { couponCode } = action.payload;
      return {
        ...state,
        items: state.items.filter((c) => c.code !== couponCode),
      };
    }

    case COUPON_ACTIONS.SET_COUPONS: {
      const { coupons } = action.payload;
      return {
        ...state,
        items: coupons,
      };
    }

    default:
      return state;
  }
}
