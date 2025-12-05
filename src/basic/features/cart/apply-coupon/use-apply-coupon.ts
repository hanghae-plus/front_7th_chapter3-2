import { Coupon } from '../../../../types';
import { findCouponByCode } from '../../../entities/coupon';
import { ToastProps } from '../../../shared/ui/toast';

interface PropsType {
  coupons: Coupon[];
  applyCoupon: (coupon: Coupon) => void;
  toast: (notification: ToastProps) => void;
}

export function useApplyCoupon({ coupons, applyCoupon, toast }: PropsType) {
  const handleApplyCoupon = (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const coupon = findCouponByCode(coupons, e.target.value);

      if (!coupon) return;
      applyCoupon(coupon);

      toast({
        message: '쿠폰이 적용되었습니다.',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      toast({
        message:
          error instanceof Error ? error.message : '쿠폰 적용에 실패했습니다.',
        type: 'error',
      });
    }
  };
  return {
    handleApplyCoupon,
  };
}
