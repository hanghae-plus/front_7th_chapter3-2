import useToggle from '../../../hooks/toggle';
import CouponForm from './coupon-form';
import CouponList from './coupon-list';

const CouponSection = () => {
  const { isOpen, close, toggle } = useToggle(false);

  return (
    <section className='bg-white rounded-lg border border-gray-200'>
      <div className='p-6 border-b border-gray-200'>
        <h2 className='text-lg font-semibold'>쿠폰 관리</h2>
      </div>
      <div className='p-6'>
        <CouponList toggle={toggle} />
        {isOpen && <CouponForm close={close} />}
      </div>
    </section>
  );
};

export default CouponSection;
