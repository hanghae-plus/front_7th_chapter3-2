import { useState } from 'react';
import { CouponList } from './coupon-list';
import { CreateCouponForm } from '../../../features/coupon/create-coupon';

interface CouponsSectionProps {}

export function CouponsSection({}: CouponsSectionProps) {
  const [showCouponForm, setShowCouponForm] = useState(false);

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <CouponList
          onToggleShowCouponForm={() => setShowCouponForm((prev) => !prev)}
        />
        {showCouponForm && (
          <CreateCouponForm
            onCloseCouponForm={() => setShowCouponForm(false)}
          />
        )}
      </div>
    </section>
  );
}
