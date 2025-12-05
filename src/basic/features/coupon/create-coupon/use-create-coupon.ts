import { useState } from 'react';
import { Coupon } from '../../../../types';
import { ToastProps } from '../../../shared/ui/toast';

interface PropsType {
  addCoupon: (coupon: Coupon) => void;
  onCloseCouponForm: () => void;
  toast: (notification: ToastProps) => void;
}

const initialState = {
  name: '',
  code: '',
  discountType: 'amount' as 'amount' | 'percentage',
  discountValue: 0,
};

export function useCreateCoupon({
  addCoupon,
  onCloseCouponForm,
  toast,
}: PropsType) {
  const [couponForm, setCouponForm] = useState(initialState);

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponForm({
      ...couponForm,
      name: e.target.value,
    });
  };

  const handleChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponForm({
      ...couponForm,
      code: e.target.value.toUpperCase(),
    });
  };

  const handleChangeDiscountType = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCouponForm({
      ...couponForm,
      discountType: e.target.value as 'amount' | 'percentage',
    });
  };

  const handleChangeDiscountValue = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setCouponForm({
        ...couponForm,
        discountValue: value === '' ? 0 : parseInt(value),
      });
    }
  };

  const handleBlurDiscountValue = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (couponForm.discountType === 'percentage') {
      if (value > 100) {
        toast({
          message: '할인율은 100%를 초과할 수 없습니다',
          type: 'error',
        });

        setCouponForm({
          ...couponForm,
          discountValue: 100,
        });
      } else if (value < 0) {
        setCouponForm({
          ...couponForm,
          discountValue: 0,
        });
      }
    } else {
      if (value > 100000) {
        toast({
          message: '할인 금액은 100,000원을 초과할 수 없습니다',
          type: 'error',
        });

        setCouponForm({
          ...couponForm,
          discountValue: 100000,
        });
      } else if (value < 0) {
        setCouponForm({
          ...couponForm,
          discountValue: 0,
        });
      }
    }
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault();

      addCoupon(couponForm);
      setCouponForm(initialState);

      toast({
        message: '쿠폰이 추가되었습니다.',
        type: 'success',
      });

      onCloseCouponForm();
    } catch (error) {
      toast({
        message:
          error instanceof Error ? error.message : '쿠폰 추가에 실패했습니다.',
        type: 'error',
      });
    }
  };

  return {
    couponForm,
    onCreateCoupon: handleCouponSubmit,
    onChangeName: handleChangeName,
    onChangeCode: handleChangeCode,
    onChangeDiscountType: handleChangeDiscountType,
    onChangeDiscountValue: handleChangeDiscountValue,
    onBlurDiscountValue: handleBlurDiscountValue,
  };
}
