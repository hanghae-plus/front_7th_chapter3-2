import React from 'react';
import { CouponCard } from './CouponCard';
import { useCouponsContext } from '../../contexts';
import { getCouponDisplayText } from '../../models/coupon';

interface CouponListProps {
  onDeleteCoupon: (couponCode: string) => void;
  onToggleCouponForm: () => void;
}

export const CouponList: React.FC<CouponListProps> = ({
  onDeleteCoupon,
  onToggleCouponForm,
}) => {
  const { coupons } = useCouponsContext();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {coupons.map((coupon) => {
        return (
          <CouponCard
            key={coupon.code}
            name={coupon.name}
            code={coupon.code}
            discountText={getCouponDisplayText(coupon)}
            onDelete={() => onDeleteCoupon(coupon.code)}
          />
        );
      })}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
        <button
          onClick={onToggleCouponForm}
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
