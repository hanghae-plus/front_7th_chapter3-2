import React from 'react';
import { CouponList } from './CouponList';
import { CouponForm } from './CouponForm';
import { useCouponsContext } from '../../contexts';
import { useCouponForm } from '../../hooks/useCouponForm';

export const CouponManagement: React.FC = () => {
  const { deleteCoupon } = useCouponsContext();
  const {
    showForm,
    formData,
    setFormData,
    handleToggleForm,
    handleSubmit,
    handleCancel,
  } = useCouponForm();

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <CouponList
          onDeleteCoupon={deleteCoupon}
          onToggleCouponForm={handleToggleForm}
        />

        {showForm && (
          <CouponForm
            couponForm={formData}
            onFormChange={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </div>
    </section>
  );
};
