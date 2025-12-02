import { Coupon } from '../../../types';
import { useLocalStorage } from '../../shared/hooks/use-local-storage';
import { ToastProps } from '../../shared/ui/toast';
import { COUPON_STORAGE_KEY, INITIAL_COUPONS } from './coupon-constants.config';

interface UseCouponsProps {
  toast: (notification: ToastProps) => void;
}


// TODO: model 분리 및 features 분리 > toast는 features에서 처리
export function useCoupons({ toast }: UseCouponsProps) {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    COUPON_STORAGE_KEY,
    INITIAL_COUPONS,
  );

  /** 쿠폰 추가 */
  const addCoupon = (coupon: Coupon) => { 
    const existingCoupon = coupons.find(c => c.code === coupon.code);
    
    if (existingCoupon) {
      toast({
        message: '이미 존재하는 쿠폰 코드입니다.',
        type: 'error',
      });
      return;
    } 

    setCoupons(prev => [...prev, coupon]);

    toast({
      message: '쿠폰이 추가되었습니다.',
      type: 'success',
    });
  };
  
  /** 쿠폰 삭제 */
  const removeCoupon = (couponCode: string) => {
    setCoupons(prev => prev.filter(c => c.code !== couponCode));

    toast({
      message: '쿠폰이 삭제되었습니다.',
      type: 'success',
    });
  };
  return {
    coupons,
    addCoupon,
    removeCoupon,
  };
}
