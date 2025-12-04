import { Dispatch, SetStateAction } from 'react';
import Select from '../../../components/select';
import { AddNotification } from '../../../hooks/notifications';
import { Coupon } from '../../../types/coupons';
import { convertCouponsToOptions, findCouponByCode, validateCouponApplicability } from '../../../models/coupon';

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
  return (
    <section className='bg-white rounded-lg border border-gray-200 p-4'>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-sm font-semibold text-gray-700'>쿠폰 할인</h3>
      </div>
      {coupons.length > 0 && (
        <Select
          value={selectedCoupon?.code || ''}
          onChange={e => {
            const coupon = findCouponByCode(coupons, e.target.value);
            if (coupon) {
              const currentTotal = totals.totalAfterDiscount;
              const validation = validateCouponApplicability(coupon, currentTotal);

              if (!validation.isValid) {
                addNotification(validation.errorMessage!, 'error');
                return;
              }

              setSelectedCoupon(coupon);
              addNotification('쿠폰이 적용되었습니다.', 'success');
            } else {
              setSelectedCoupon(null);
            }
          }}
          options={[{ label: '쿠폰 선택', value: '' }, ...convertCouponsToOptions(coupons)]}
        />
      )}
    </section>
  );
};

export default CouponSection;
