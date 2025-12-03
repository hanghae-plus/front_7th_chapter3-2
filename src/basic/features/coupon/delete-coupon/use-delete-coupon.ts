import { ToastProps } from '../../../shared/ui/toast';

interface PropsType {
  removeCoupon: (couponCode: string) => void;
  toast: (notification: ToastProps) => void;
}

export function useDeleteCoupon({ removeCoupon, toast }: PropsType) {
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
