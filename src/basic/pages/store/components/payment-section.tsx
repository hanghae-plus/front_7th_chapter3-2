import { Dispatch, SetStateAction } from 'react';
import Button from '../../../components/button';
import { AddNotification } from '../../../hooks/notifications';
import { Coupon } from '../../../types/coupons';
import { hasDiscount, calculateDiscountAmount } from '../../../models/cart';
import { formatCurrency } from '../../../utils/format';
import { generateOrderNumber } from '../../../utils/order';

interface PaymentSectionProps {
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  addNotification: AddNotification;
  clearCart: () => void;
  setSelectedCoupon: Dispatch<SetStateAction<Coupon | null>>;
}

const PaymentSection = ({ totals, addNotification, clearCart, setSelectedCoupon }: PaymentSectionProps) => {
  return (
    <section className='bg-white rounded-lg border border-gray-200 p-4'>
      <h3 className='text-lg font-semibold mb-4'>결제 정보</h3>
      <div className='space-y-2 text-sm'>
        <div className='flex justify-between'>
          <span className='text-gray-600'>상품 금액</span>
          <span className='font-medium'>{formatCurrency(totals.totalBeforeDiscount, { suffix: '원' })}</span>
        </div>
        {hasDiscount(totals.totalBeforeDiscount, totals.totalAfterDiscount) && (
          <div className='flex justify-between text-red-500'>
            <span>할인 금액</span>
            <span>-{formatCurrency(calculateDiscountAmount(totals.totalBeforeDiscount, totals.totalAfterDiscount), { suffix: '원' })}</span>
          </div>
        )}
        <div className='flex justify-between py-2 border-t border-gray-200'>
          <span className='font-semibold'>결제 예정 금액</span>
          <span className='font-bold text-lg text-gray-900'>{formatCurrency(totals.totalAfterDiscount, { suffix: '원' })}</span>
        </div>
      </div>
      <Button
        size='xl'
        variant='accent'
        onClick={() => {
          const orderNumber = generateOrderNumber();
          addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
          clearCart();
          setSelectedCoupon(null);
        }}
        className='w-full mt-4'
      >
        {formatCurrency(totals.totalAfterDiscount, { suffix: '원' })} 결제하기
      </Button>
      <div className='mt-3 text-xs text-gray-500 text-center'>
        <p>* 실제 결제는 이루어지지 않습니다</p>
      </div>
    </section>
  );
};

export default PaymentSection;
