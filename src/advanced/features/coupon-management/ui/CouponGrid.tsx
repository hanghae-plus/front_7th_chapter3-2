import { useCouponStore } from '../../../entities/coupon/model/useCouponStore';
import { useNotificationStore } from '../../../shared/store/useNotificationStore';
import CouponCard from '../../../entities/coupon/ui/CouponCard';

const CouponGrid = () => {
  const coupons = useCouponStore((state) => state.coupons);
  const showCouponForm = useCouponStore((state) => state.showCouponForm);
  const setShowCouponForm = useCouponStore((state) => state.setShowCouponForm);
  const deleteCoupon = useCouponStore((state) => state.deleteCoupon);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const handleDelete = (couponCode: string) => {
    deleteCoupon(couponCode);
    addNotification('쿠폰이 삭제되었습니다.', 'success');
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {coupons.map((coupon) => (
        <CouponCard key={coupon.code} coupon={coupon} onDelete={handleDelete} />
      ))}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
        <button
          onClick={() => setShowCouponForm(!showCouponForm)}
          className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
        </button>
      </div>
    </div>
  );
};

export default CouponGrid;
