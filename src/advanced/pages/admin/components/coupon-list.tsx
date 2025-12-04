import Button from '../../../components/button';
import { PlusIcon, TrashIcon } from '../../../components/icons';
import { formatCouponDiscount } from '../../../models/coupon';
import { couponsActions, couponsContext } from '../../../stores/coupons';
import { Coupon } from '../../../types/coupons';

interface CouponItemProps {
  coupon: Coupon;
}

interface CouponListProps {
  toggle: () => void;
}

const CouponItem = ({ coupon }: CouponItemProps) => {
  const { deleteCoupon } = couponsActions();

  return (
    <div className='relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200'>
      <div className='flex justify-between items-start'>
        <div className='flex-1'>
          <h3 className='font-semibold text-gray-900'>{coupon.name}</h3>
          <p className='text-sm text-gray-600 mt-1 font-mono'>{coupon.code}</p>
          <div className='mt-2'>
            <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700'>
              {formatCouponDiscount(coupon)}
            </span>
          </div>
        </div>
        <Button variant='delete' onClick={() => deleteCoupon(coupon.code)}>
          <TrashIcon />
        </Button>
      </div>
    </div>
  );
};

const CouponList = ({ toggle }: CouponListProps) => {
  const { coupons } = couponsContext();

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {coupons.map(coupon => (
        <CouponItem key={coupon.code} coupon={coupon} />
      ))}
      <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors'>
        <button onClick={toggle} className='text-gray-400 hover:text-gray-600 flex flex-col items-center'>
          <PlusIcon />
          <p className='mt-2 text-sm font-medium'>새 쿠폰 추가</p>
        </button>
      </div>
    </div>
  );
};

export default CouponList;
