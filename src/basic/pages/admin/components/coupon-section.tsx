import { AddNotification } from '../../../hooks/notifications';
import useToggle from '../../../hooks/toggle';
import { Coupon } from '../../../types/coupons';
import CouponForm from './coupon-form';
import CouponList from './coupon-list';

interface CouponSectionProps {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
  addNotification: AddNotification;
}

const CouponSection = ({ coupons, addCoupon, deleteCoupon, addNotification }: CouponSectionProps) => {
  const { isOpen, close, toggle } = useToggle(false);

  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <h2 className='text-lg font-semibold'>쿠폰 관리</h2>
      </div>
      <div className='p-6'>
        <CouponList coupons={coupons} deleteCoupon={deleteCoupon} toggle={toggle} />
        {isOpen && <CouponForm addCoupon={addCoupon} close={close} addNotification={addNotification} />}
      </div>
    </section>
  );
};

export default CouponSection;
