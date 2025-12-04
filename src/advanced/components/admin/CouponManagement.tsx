import React from 'react';
import { CouponList } from './CouponList';
import { CouponForm } from './CouponForm';
import { useCouponsContext } from '../../contexts';

interface CouponManagementProps {
  showCouponForm: boolean;
  couponForm: {
    name: string;
    code: string;
    discountType: 'amount' | 'percentage';
    discountValue: number;
  };
  onToggleCouponForm: () => void;
  onCouponFormChange: (form: any) => void;
  onCouponSubmit: (e: React.FormEvent) => void;
  onCouponFormCancel: () => void;
}

export const CouponManagement: React.FC<CouponManagementProps> = ({
  showCouponForm,
  couponForm,
  onToggleCouponForm,
  onCouponFormChange,
  onCouponSubmit,
  onCouponFormCancel,
}) => {
  const { deleteCoupon } = useCouponsContext();

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <CouponList
          onDeleteCoupon={deleteCoupon}
          onToggleCouponForm={onToggleCouponForm}
        />

        {showCouponForm && (
          <CouponForm
            couponForm={couponForm}
            onFormChange={onCouponFormChange}
            onSubmit={onCouponSubmit}
            onCancel={onCouponFormCancel}
          />
        )}
      </div>
    </section>
  );
};
