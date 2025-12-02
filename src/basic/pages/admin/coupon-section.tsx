import { useState } from 'react';
import { Coupon } from '../../../types';
import { ToastProps } from '../../shared/ui/toast';
import { CouponList } from './coupon-list';
import { CreateCouponForm } from '../../features/coupon/create-coupon';

interface CouponsSectionProps {
  coupons: Coupon[];
  onAddCoupon: (newCoupon: Coupon) => void;
  onRemoveCoupon: (couponCode: string) => void;
  toast: (notification: ToastProps) => void;
}

export function CouponsSection({
  coupons,
  onAddCoupon,
  onRemoveCoupon,
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
          onRemoveCoupon={onRemoveCoupon}
          onToggleShowCouponForm={() => setShowCouponForm((prev) => !prev)}
        />
        {showCouponForm && (
          <CreateCouponForm
            onAddCoupon={onAddCoupon}
            onCloseCouponForm={() => setShowCouponForm(false)}
            toast={toast}
          />
        )}
      </div>
    </section>
  );
}
