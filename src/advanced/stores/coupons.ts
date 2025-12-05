import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialCoupons } from '../constants/coupons';
import { couponsStorage } from '../storage/coupons';
import { Coupon } from '../types/coupons';
import { useNotifications } from './notifications';

export interface CouponsContext {
  coupons: Coupon[];
}

interface CouponsActions {
  addCoupon: (newCoupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
  clearCoupons: () => void;
}

interface CouponsStore {
  context: CouponsContext;
  actions: CouponsActions;
}

const initialContext: CouponsContext = {
  coupons: initialCoupons
};

export const useCoupons = create<CouponsStore>()(
  persist(
    (set, get) => ({
      context: {
        ...initialContext
      },
      actions: {
        addCoupon: newCoupon => {
          const { addNotification } = useNotifications.getState().actions;
          const { coupons } = get().context;

          const existingCoupon = coupons.find(c => c.code === newCoupon.code);

          if (existingCoupon) {
            addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
            return;
          }

          set(({ context }) => ({
            context: {
              coupons: [...context.coupons, newCoupon]
            }
          }));

          addNotification('쿠폰이 추가되었습니다.', 'success');
        },
        deleteCoupon: couponCode => {
          const { addNotification } = useNotifications.getState().actions;

          set(({ context }) => ({
            context: {
              coupons: context.coupons.filter(c => c.code !== couponCode)
            }
          }));

          addNotification('쿠폰이 삭제되었습니다.', 'success');
        },
        clearCoupons: () => {
          set({ context: { ...initialContext } });
        }
      }
    }),
    {
      name: 'coupons',
      storage: couponsStorage,
      partialize: ({ context }) => ({ context })
    }
  )
);

export const couponsContext = () => useCoupons(({ context }) => context);
export const couponsActions = () => useCoupons(({ actions }) => actions);
