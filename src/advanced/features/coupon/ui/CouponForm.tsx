import { ChangeEvent, FormEvent, useState } from 'react';
import { useCouponList } from '../../../entities/coupon/model/useCouponList';
import { Coupon } from '../../../entities/coupon/model/types';
import { useToast } from '../../../shared/hooks/useToast';
import { isOnlyNumber } from '../../../shared/lib/validators';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';
import { Select } from '../../../shared/ui/Select';

interface CouponFormProps {
  onClose?: () => void;
}

export const CouponForm = ({ onClose }: CouponFormProps) => {
  const { addCoupon } = useCouponList();
  const { addToast } = useToast();

  const [couponForm, setCouponForm] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'amount',
    discountValue: 0,
  });

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCouponForm({ ...couponForm, name: e.target.value });
  };

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() });
  };

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCouponForm({
      ...couponForm,
      discountType: e.target.value as 'amount' | 'percentage',
    });
  };

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || isOnlyNumber(value)) {
      setCouponForm({
        ...couponForm,
        discountValue: value === '' ? 0 : Number(value),
      });
    }
  };

  const handleValueBlur = () => {
    const value = couponForm.discountValue;

    if (couponForm.discountType === 'percentage') {
      if (value > 100) {
        addToast('할인율은 100%를 초과할 수 없습니다', 'error');
        setCouponForm({ ...couponForm, discountValue: 100 });
      } else if (value < 0) {
        setCouponForm({ ...couponForm, discountValue: 0 });
      }
    } else {
      if (value > 100000) {
        addToast('할인 금액은 100,000원을 초과할 수 없습니다', 'error');
        setCouponForm({ ...couponForm, discountValue: 100000 });
      } else if (value < 0) {
        setCouponForm({ ...couponForm, discountValue: 0 });
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addCoupon(couponForm);
    addToast('쿠폰이 추가되었습니다.', 'success');
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            쿠폰명
          </label>
          <Input
            variant="text"
            value={couponForm.name}
            onChange={handleNameChange}
            placeholder="신규 가입 쿠폰"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            쿠폰 코드
          </label>
          <Input
            variant="text"
            value={couponForm.code}
            onChange={handleCodeChange}
            className="font-mono"
            placeholder="WELCOME2024"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            할인 타입
          </label>
          <Select
            variant="form"
            value={couponForm.discountType}
            onChange={handleTypeChange}
          >
            <option value="amount">정액 할인</option>
            <option value="percentage">정률 할인</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {couponForm.discountType === 'amount' ? '할인 금액' : '할인율(%)'}
          </label>
          <Input
            variant="text"
            type="text"
            value={
              couponForm.discountValue === 0 ? '' : couponForm.discountValue
            }
            onChange={handleValueChange}
            onBlur={handleValueBlur}
            placeholder={couponForm.discountType === 'amount' ? '5000' : '10'}
            required
          />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button size="sm" variant="outline" onClick={onClose} type="button">
          취소
        </Button>
        <Button size="sm" variant="primary" type="submit">
          쿠폰 생성
        </Button>
      </div>
    </form>
  );
};
