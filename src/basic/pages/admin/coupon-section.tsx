import { useState } from 'react';
import { Coupon } from '../../../types';
import { ToastProps } from '../../shared/ui/toast';
import { CouponList } from './coupon-list';
import { CreateCouponForm } from '../../features/coupon/create-coupon';

interface CouponsSectionProps {
  coupons: Coupon[];
  addCoupon: (newCoupon: Coupon) => void;
  removeCoupon: (couponCode: string) => void;
  toast: (notification: ToastProps) => void;
}

export function CouponsSection({
  coupons,
  addCoupon,
  removeCoupon,
  toast,
}: CouponsSectionProps) {
  const [showCouponForm, setShowCouponForm] = useState(false);

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <CouponList
          coupons={coupons}
          removeCoupon={removeCoupon}
          onToggleShowCouponForm={() => setShowCouponForm((prev) => !prev)}
          toast={toast}
        />
        {showCouponForm && (
          <CreateCouponForm
            addCoupon={addCoupon}
            onCloseCouponForm={() => setShowCouponForm(false)}
            toast={toast}
          />
        )}
      </div>
    </section>
  );
}
