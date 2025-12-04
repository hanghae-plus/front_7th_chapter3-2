import { ChangeEvent, FocusEvent, useCallback, useMemo } from 'react';
import Button from '../../../components/button';
import Input from '../../../components/input';
import Label from '../../../components/label';
import Select from '../../../components/select';
import useForm from '../../../hooks/form';
import { AddNotification } from '../../../hooks/notifications';
import { Coupon, DiscountType } from '../../../types/coupons';
import { isNumericInput, parseNumericInput, toUpperCase as toUpperCaseUtil } from '../../../utils/form';
import { validateRange } from '../../../utils/validator';
import { COUPON_VALIDATION_RULES, DISCOUNT_TYPE_LABELS, DISCOUNT_TYPE_PLACEHOLDERS, DISCOUNT_TYPES, initialForm } from '../constants/coupons';

interface CouponFormProps {
  addCoupon: (coupon: Coupon) => void;
  close: () => void;
  addNotification: AddNotification;
}

const CouponForm = ({ addCoupon, close, addNotification }: CouponFormProps) => {
  const onSubmit = useCallback(
    (data: Coupon) => {
      addCoupon(data);
      close();
    },
    [addCoupon, close]
  );

  const { form, setForm, handleSubmit } = useForm({ initialForm, onSubmit });

  const discountTypeOptions = useMemo(() => Object.values(DISCOUNT_TYPES).map(type => ({ label: DISCOUNT_TYPE_LABELS[type], value: type })), []);

  const handleChange = {
    name: (e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, name: e.target.value })),
    code: (e: ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, code: toUpperCaseUtil(e.target.value) })),
    discountType: (e: ChangeEvent<HTMLSelectElement>) => setForm(prev => ({ ...prev, discountType: e.target.value as DiscountType })),
    discountValue: (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (isNumericInput(value)) {
        setForm(prev => ({ ...prev, discountValue: parseNumericInput(value) }));
      }
    }
  };

  const handleBlur = {
    discountValue: (e: FocusEvent<HTMLInputElement>) => {
      const value = parseNumericInput(e.target.value) || 0;
      const validation = validateRange(value, COUPON_VALIDATION_RULES[form.discountType]);

      if (!validation.isValid) {
        if (validation.errorMessage) {
          addNotification(validation.errorMessage, 'error');
        }
        setForm(prev => ({ ...prev, discountValue: validation.validatedValue }));
      }
    }
  };

  return (
    <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <h3 className='text-md font-medium text-gray-900'>새 쿠폰 생성</h3>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <div>
            <Label>쿠폰명</Label>
            <Input type='text' value={form.name} onChange={handleChange.name} className='text-sm' placeholder='신규 가입 쿠폰' required />
          </div>
          <div>
            <Label>쿠폰 코드</Label>
            <Input type='text' value={form.code} onChange={handleChange.code} className='text-sm font-mono' placeholder='WELCOME2024' required />
          </div>
          <div>
            <Label>할인 타입</Label>
            <Select variant='shadow' value={form.discountType} onChange={handleChange.discountType} options={discountTypeOptions} />
          </div>
          <div>
            <Label>{DISCOUNT_TYPE_LABELS[form.discountType]}</Label>
            <Input
              type='text'
              value={form.discountValue === 0 ? '' : form.discountValue}
              onChange={handleChange.discountValue}
              onBlur={handleBlur.discountValue}
              className='text-sm'
              placeholder={DISCOUNT_TYPE_PLACEHOLDERS[form.discountType]}
              required
            />
          </div>
        </div>
        <div className='flex justify-end gap-3'>
          <Button size='md' variant='outline' type='button' onClick={close}>
            취소
          </Button>
          <Button size='md' variant='primary' type='submit'>
            쿠폰 생성
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;
