import React from 'react';
import { Input, Select, Button } from '../primitives';
import { SelectOption } from '../primitives/Select';
import { useNotificationsContext } from '../../contexts';

interface CouponFormProps {
  couponForm: {
    name: string;
    code: string;
    discountType: 'amount' | 'percentage';
    discountValue: number;
  };
  onFormChange: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const CouponForm: React.FC<CouponFormProps> = ({
  couponForm,
  onFormChange,
  onSubmit,
  onCancel,
}) => {
  const { addNotification } = useNotificationsContext();
  const discountTypeOptions: SelectOption[] = [
    { value: 'amount', label: '정액 할인' },
    { value: 'percentage', label: '정률 할인' },
  ];

  const handleDiscountValueChange = (value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      onFormChange({
        ...couponForm,
        discountValue: value === '' ? 0 : parseInt(value),
      });
    }
  };

  const handleDiscountValueBlur = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (couponForm.discountType === 'percentage') {
      if (numValue > 100) {
        addNotification('할인율은 100%를 초과할 수 없습니다', 'error');
        onFormChange({ ...couponForm, discountValue: 100 });
      } else if (numValue < 0) {
        onFormChange({ ...couponForm, discountValue: 0 });
      }
    } else {
      if (numValue > 100000) {
        addNotification('할인 금액은 100,000원을 초과할 수 없습니다', 'error');
        onFormChange({ ...couponForm, discountValue: 100000 });
      } else if (numValue < 0) {
        onFormChange({ ...couponForm, discountValue: 0 });
      }
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={onSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="쿠폰명"
            type="text"
            value={couponForm.name}
            onChange={(e) =>
              onFormChange({ ...couponForm, name: e.target.value })
            }
            placeholder="신규 가입 쿠폰"
            className="text-sm"
            required
          />
          <Input
            label="쿠폰 코드"
            type="text"
            value={couponForm.code}
            onChange={(e) =>
              onFormChange({
                ...couponForm,
                code: e.target.value.toUpperCase(),
              })
            }
            placeholder="WELCOME2024"
            className="text-sm font-mono"
            required
          />
          <Select
            label="할인 타입"
            options={discountTypeOptions}
            value={couponForm.discountType}
            onChange={(e) =>
              onFormChange({
                ...couponForm,
                discountType: e.target.value as 'amount' | 'percentage',
              })
            }
            className="text-sm"
          />
          <Input
            label={
              couponForm.discountType === 'amount' ? '할인 금액' : '할인율(%)'
            }
            type="text"
            value={
              couponForm.discountValue === 0 ? '' : couponForm.discountValue
            }
            onChange={(e) => handleDiscountValueChange(e.target.value)}
            onBlur={(e) => handleDiscountValueBlur(e.target.value)}
            placeholder={couponForm.discountType === 'amount' ? '5000' : '10'}
            className="text-sm"
            required
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" type="button" onClick={onCancel}>
            취소
          </Button>
          <Button variant="secondary" type="submit">
            쿠폰 생성
          </Button>
        </div>
      </form>
    </div>
  );
};
