import { useToast } from '../../../shared/ui/toast/toast-context';
import { useCoupons } from '../../../entities/coupon';

export function useDeleteCoupon() {
  const { removeCoupon } = useCoupons();
  const { toast } = useToast();

  const handleDeleteCoupon = (couponCode: string) => {
    removeCoupon(couponCode);

    toast({
      message: '쿠폰이 삭제되었습니다.',
      type: 'success',
    });
  };

  return {
    onDeleteCoupon: handleDeleteCoupon,
  };
}
