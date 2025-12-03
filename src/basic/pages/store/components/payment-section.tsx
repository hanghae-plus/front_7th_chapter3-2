import { Dispatch, SetStateAction, useCallback } from 'react';
import Button from '../../../components/button';
import { AddNotification } from '../../../hooks/notifications';
import { CartItem } from '../../../types/carts';
import { Coupon } from '../../../types/coupons';

interface PaymentSectionProps {
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  addNotification: AddNotification;
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  setSelectedCoupon: Dispatch<SetStateAction<Coupon | null>>;
}

const PaymentSection = ({ totals, addNotification, setCart, setSelectedCoupon }: PaymentSectionProps) => {
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification, setCart, setSelectedCoupon]);

  return (
    <section className='bg-white rounded-lg border border-gray-200 p-4'>
      <h3 className='text-lg font-semibold mb-4'>결제 정보</h3>
      <div className='space-y-2 text-sm'>
        <div className='flex justify-between'>
          <span className='text-gray-600'>상품 금액</span>
          <span className='font-medium'>{totals.totalBeforeDiscount.toLocaleString()}원</span>
        </div>
        {totals.totalBeforeDiscount - totals.totalAfterDiscount > 0 && (
          <div className='flex justify-between text-red-500'>
            <span>할인 금액</span>
            <span>-{(totals.totalBeforeDiscount - totals.totalAfterDiscount).toLocaleString()}원</span>
          </div>
        )}
        <div className='flex justify-between py-2 border-t border-gray-200'>
          <span className='font-semibold'>결제 예정 금액</span>
          <span className='font-bold text-lg text-gray-900'>{totals.totalAfterDiscount.toLocaleString()}원</span>
        </div>
      </div>
      <Button size='xl' variant='accent' onClick={completeOrder} className='w-full mt-4'>
        {totals.totalAfterDiscount.toLocaleString()}원 결제하기
      </Button>
      <div className='mt-3 text-xs text-gray-500 text-center'>
        <p>* 실제 결제는 이루어지지 않습니다</p>
      </div>
    </section>
  );
};

export default PaymentSection;
