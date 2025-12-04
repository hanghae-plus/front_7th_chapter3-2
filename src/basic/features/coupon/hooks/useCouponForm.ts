import { isNumericString } from '@/shared/utils';
import {
  Coupon,
  CouponValidation,
  validateCouponDiscount,
} from '@/features/coupon';
import { ChangeEvent, FocusEvent, FormEvent, useState } from 'react';

const initialCouponForm: Coupon = {
  name: '',
  code: '',
  discountType: 'amount',
  discountValue: 0,
};
export const useCouponForm = (
  addCoupon: (
    newCoupon: Coupon,
    options?: {
      onSuccess?: (validation: CouponValidation) => void;
      onError?: (validation: CouponValidation) => void;
    }
  ) => void,
  close: () => void
) => {
  const [form, setForm] = useState<Coupon>(initialCouponForm);

  const setValue = (field: keyof Coupon, value: Coupon[typeof field]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const normalizeValue = (
    field: keyof Coupon,
    value: Coupon[typeof field],
    form: Coupon
  ) => {
    switch (field) {
      case 'code':
        return (value as string).toUpperCase();
      case 'discountValue': {
        const rawValue = parseInt(value as string) || 0;
        const limit = form.discountType === 'percentage' ? 100 : 100000;
        return Math.max(Math.min(rawValue, limit), 0);
      }
      default:
        return value;
    }
  };

  const onBlurHandler =
    (
      field: keyof Coupon,
      options?: {
        onError?: (validation: CouponValidation) => void;
      }
    ) =>
    (e: FocusEvent<HTMLInputElement>) => {
      if (field === 'discountValue') {
        const value = parseInt(e.target.value) || 0;

        const result = validateCouponDiscount(form.discountType, value);
        setValue(field, normalizeValue(field, value, form));
        if (!result.valid) {
          options?.onError?.(result);
        }
      }
    };

  const onChangeHandler =
    (field: keyof Coupon) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (field === 'discountValue') {
        if (!isNumericString(e.target.value)) return;
        const value = parseInt(e.target.value) || 0;
        setValue(field, value);
      } else {
        let value = normalizeValue(field, e.target.value, form);
        setValue(field, value);
      }
    };

  const onSubmit = (
    e: FormEvent,
    options?: {
      onSuccess?: (validation: CouponValidation) => void;
      onError?: (validation: CouponValidation) => void;
    }
  ) => {
    e.preventDefault();

    addCoupon(form, {
      onSuccess: (validation) => {
        reset();
        close();
        options?.onSuccess?.(validation);
      },
      onError: (validation) => {
        options?.onError?.(validation);
      },
    });
  };

  const reset = () => {
    setForm(initialCouponForm);
  };

  return {
    form,
    onBlurHandler,
    onChangeHandler,
    onSubmit,
  };
};
