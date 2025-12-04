import { useState, useCallback } from 'react';
import { useCouponsContext, useNotificationsContext } from '../contexts';

export interface CouponFormData {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}

const initialFormData: CouponFormData = {
  name: '',
  code: '',
  discountType: 'amount',
  discountValue: 0,
};

export const useCouponForm = () => {
  const { coupons, addCoupon } = useCouponsContext();
  const { addNotification } = useNotificationsContext();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CouponFormData>(initialFormData);

  const handleToggleForm = useCallback(() => {
    setShowForm((prev) => !prev);
    if (!showForm) {
      setFormData(initialFormData);
    }
  }, [showForm]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const existingCoupon = coupons.find((c) => c.code === formData.code);
      if (existingCoupon) {
        addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
        return;
      }

      addCoupon(formData);
      addNotification('쿠폰이 추가되었습니다.', 'success');
      setShowForm(false);
      setFormData(initialFormData);
    },
    [formData, coupons, addCoupon, addNotification]
  );

  const handleCancel = useCallback(() => {
    setShowForm(false);
  }, []);

  return {
    showForm,
    formData,
    setFormData,
    handleToggleForm,
    handleSubmit,
    handleCancel,
  };
};
