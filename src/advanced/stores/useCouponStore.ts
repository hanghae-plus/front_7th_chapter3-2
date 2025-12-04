import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Coupon } from '../../types';

const initialCoupons: Coupon[] = [
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

const loadFromStorage = (): Coupon[] => {
  try {
    const saved = localStorage.getItem('coupons');
    return saved ? JSON.parse(saved) : initialCoupons;
  } catch {
    return initialCoupons;
  }
};

interface CouponStore {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  addCoupon: (coupon: Coupon) => boolean;
  deleteCoupon: (couponCode: string) => void;
  selectCoupon: (coupon: Coupon | null) => void;
  _reset: () => void;
}

export const useCouponStore = create<CouponStore>()(
  subscribeWithSelector((set, get) => ({
    coupons: loadFromStorage(),
    selectedCoupon: null,

    addCoupon: (newCoupon) => {
      const exists = get().coupons.some((c) => c.code === newCoupon.code);
      if (exists) return false;

      set((state) => ({
        coupons: [...state.coupons, newCoupon],
      }));
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

    selectCoupon: (coupon) => set({ selectedCoupon: coupon }),

    _reset: () => set({ coupons: initialCoupons, selectedCoupon: null }),
  }))
);

// localStorage 동기화
useCouponStore.subscribe(
  (state) => state.coupons,
  (coupons) => {
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }
);
