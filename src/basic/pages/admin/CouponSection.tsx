import { useState } from 'react';
import { Coupon } from '../../../types';
import { useCoupons } from '../../hooks/useCoupons';
import CouponCard from '../../components/admin/CouponCard';
import CouponForm from '../../components/admin/CouponForm';

interface CouponSectionProps {
  addNotification: (
    message: string,
    type: 'error' | 'success' | 'warning'
  ) => void;
  couponActions: ReturnType<typeof useCoupons>;
}

const CouponSection = ({
  addNotification,
  couponActions,
}: CouponSectionProps) => {
  const { coupons } = couponActions;
  const [showCouponForm, setShowCouponForm] = useState(false);

  const handleAddCoupon = (newCoupon: Coupon) => {
    couponActions.addCoupon(newCoupon);
    setShowCouponForm(false);
  };

  const handleRemoveCoupon = (couponCode: string) => {
    couponActions.removeCoupon(couponCode);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon.code}
              coupon={coupon}
              onRemove={handleRemoveCoupon}
            />
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

        {showCouponForm && (
          <CouponForm
            onSubmit={handleAddCoupon}
            onCancel={() => setShowCouponForm(false)}
            addNotification={addNotification}
          />
        )}
      </div>
    </section>
  );
};

export default CouponSection;
