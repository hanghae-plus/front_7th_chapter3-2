import { useAtomValue } from "jotai";
import { couponsAtom } from "../../stores/atoms/couponAtoms";
import { PlusIcon } from "../icons";
import { CouponContainer } from "./CouponContainer";

// 쿠폰 목록 표시
export const CouponList = ({ setShow }: { setShow: (show: boolean) => void }) => {
  const coupons = useAtomValue(couponsAtom);

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {coupons.map((coupon) => (
        <CouponContainer key={coupon.code} coupon={coupon} />
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
