import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Coupon } from '../../../../types';
import { initialCoupons } from '../../../shared/config';

export type CouponFormData = {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
};

const initialCouponForm: CouponFormData = {
  name: '',
  code: '',
  discountType: 'amount',
  discountValue: 0,
};

interface CouponState {
  // 상태
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  showCouponForm: boolean;
  couponForm: CouponFormData;

  // 액션
  setSelectedCoupon: (coupon: Coupon | null) => void;
  setShowCouponForm: (show: boolean) => void;
  setCouponForm: (form: CouponFormData) => void;
  addCoupon: (coupon: Coupon) => boolean;
  deleteCoupon: (couponCode: string) => void;
  resetForm: () => void;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      coupons: initialCoupons,
      selectedCoupon: null,
      showCouponForm: false,
      couponForm: initialCouponForm,

      // 액션
      setSelectedCoupon: (coupon) => set({ selectedCoupon: coupon }),
      setShowCouponForm: (show) => set({ showCouponForm: show }),
      setCouponForm: (form) => set({ couponForm: form }),

      addCoupon: (newCoupon) => {
        const { coupons } = get();
        const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
        if (existingCoupon) {
          return false; // 중복
        }
        set({ coupons: [...coupons, newCoupon] });
        return true;
      },

      deleteCoupon: (couponCode) =>
        set((state) => ({
          coupons: state.coupons.filter((c) => c.code !== couponCode),
          selectedCoupon:
            state.selectedCoupon?.code === couponCode
              ? null
              : state.selectedCoupon,
        })),

      resetForm: () =>
        set({
          couponForm: initialCouponForm,
          showCouponForm: false,
        }),
    }),
    {
      name: 'coupons',
      partialize: (state) => ({ coupons: state.coupons }),
    }
  )
);

// 테스트용 리셋 함수
export const resetCouponStore = () => {
  useCouponStore.setState({
    coupons: initialCoupons,
    selectedCoupon: null,
    showCouponForm: false,
    couponForm: initialCouponForm,
  });
};
