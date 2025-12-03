import { Dispatch, SetStateAction, useCallback } from 'react';
import Select from '../../../components/select';
import { AddNotification } from '../../../hooks/notifications';
import { Coupon } from '../../../types/coupons';

interface CouponSectionProps {
  coupons: Coupon[];
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  selectedCoupon: Coupon | null;
  setSelectedCoupon: Dispatch<SetStateAction<Coupon | null>>;
  addNotification: AddNotification;
}

const CouponSection = ({ coupons, totals, selectedCoupon, setSelectedCoupon, addNotification }: CouponSectionProps) => {
  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = totals.totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === 'percentage') {
        addNotification('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
        return;
      }

      setSelectedCoupon(coupon);
      addNotification('쿠폰이 적용되었습니다.', 'success');
    },
    [addNotification, totals, setSelectedCoupon]
  );

  return (
    <section className='bg-white rounded-lg border border-gray-200 p-4'>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-sm font-semibold text-gray-700'>쿠폰 할인</h3>
      </div>
      {coupons.length > 0 && (
        <Select
          value={selectedCoupon?.code || ''}
          onChange={e => {
            const coupon = coupons.find(c => c.code === e.target.value);
            if (coupon) applyCoupon(coupon);
            else setSelectedCoupon(null);
          }}
          options={[
            { label: '쿠폰 선택', value: '' },
            ...coupons.map(coupon => ({
              label: `${coupon.name} (${
                coupon.discountType === 'amount' ? `${coupon.discountValue.toLocaleString()}원` : `${coupon.discountValue}%`
              })`,
              value: coupon.code
            }))
          ]}
        />
      )}
    </section>
  );
};

export default CouponSection;
