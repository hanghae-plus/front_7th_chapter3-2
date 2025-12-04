import { validateCouponDiscount } from '@/basic/models';
import { Coupon, CouponValidation } from '@/types';
import { isNumericString } from '@/utils/validators';
import { ChangeEvent, FocusEvent, FormEvent, useState } from 'react';

const initialCouponForm: Coupon = {
  name: '',
  code: '',
  discountType: 'amount',
  discountValue: 0,
};
export const useCouponForm = (
  addCoupon: (newCoupon: Coupon) => CouponValidation,
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
    (field: keyof Coupon) => (e: FocusEvent<HTMLInputElement>) => {
      if (field === 'discountValue') {
        const value = parseInt(e.target.value) || 0;

        const result = validateCouponDiscount(form.discountType, value);
        setValue(field, normalizeValue(field, value, form));
        return result;
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

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = addCoupon(form);
    if (result.valid) {
      reset();
      close();
    }
    return result;
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
