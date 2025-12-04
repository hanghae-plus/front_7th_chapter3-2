import { PlusIcon } from "../icons";
import type { Coupon } from "../../../types";
import { CouponContainer } from "./CouponContainer";

// 쿠폰 목록 표시
export const CouponList = ({
  coupons,
  deleteCoupon,
  setShow,
}: // selectedCoupon,
// setSelectedCoupon,
{
  coupons: Coupon[];
  deleteCoupon: (couponCode: string) => void;
  setShow: (show: boolean) => void;
  // selectedCoupon: Coupon | null;
  // setSelectedCoupon: (coupon: Coupon | null) => void;
}) => {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {coupons.map((coupon) => (
        <CouponContainer
          key={coupon.code}
          coupon={coupon}
          deleteCoupon={deleteCoupon}
          // selectedCoupon={selectedCoupon}
          // setSelectedCoupon={setSelectedCoupon}
        />
      ))}

      <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors'>
        <button
          onClick={() => setShow(true)}
          className='text-gray-400 hover:text-gray-600 flex flex-col items-center'
        >
          <PlusIcon className='w-8 h-8' />
          <p className='mt-2 text-sm font-medium'>새 쿠폰 추가</p>
        </button>
      </div>
    </div>
  );
};
