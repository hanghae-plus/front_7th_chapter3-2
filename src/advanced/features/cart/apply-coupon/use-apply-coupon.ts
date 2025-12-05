import { Coupon } from '../../../../types';
import { findCouponByCode } from '../../../entities/coupon';
import { useCart } from '../../../entities/cart/model/use-cart';
import { useToast } from '../../../shared/ui/toast/toast-context';

interface PropsType {
  coupons: Coupon[];
}

export function useApplyCoupon({ coupons }: PropsType) {
  const { applyCoupon } = useCart();
  const { toast } = useToast();

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
