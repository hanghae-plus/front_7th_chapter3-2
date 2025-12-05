import React from 'react';
import { Coupon } from '../../../types';
import { CouponList } from './CouponList';
import { CouponForm } from './CouponForm';

interface CouponManagementProps {
  coupons: Coupon[];
  showCouponForm: boolean;
  couponForm: {
    name: string;
    code: string;
    discountType: 'amount' | 'percentage';
    discountValue: number;
  };
  onDeleteCoupon: (couponCode: string) => void;
  onToggleCouponForm: () => void;
  onCouponFormChange: (form: any) => void;
  onCouponSubmit: (e: React.FormEvent) => void;
  onCouponFormCancel: () => void;
  onAddNotification: (
    message: string,
    type: 'error' | 'success' | 'warning'
  ) => void;
}

export const CouponManagement: React.FC<CouponManagementProps> = ({
  coupons,
  showCouponForm,
  couponForm,
  onDeleteCoupon,
  onToggleCouponForm,
  onCouponFormChange,
  onCouponSubmit,
  onCouponFormCancel,
  onAddNotification,
}) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <CouponList
          coupons={coupons}
          onDeleteCoupon={onDeleteCoupon}
          onToggleCouponForm={onToggleCouponForm}
        />

        {showCouponForm && (
          <CouponForm
            couponForm={couponForm}
            onFormChange={onCouponFormChange}
            onSubmit={onCouponSubmit}
            onCancel={onCouponFormCancel}
            onAddNotification={onAddNotification}
          />
        )}
      </div>
    </section>
  );
};
