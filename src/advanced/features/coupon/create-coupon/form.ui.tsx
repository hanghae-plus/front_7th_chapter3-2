import { useCreateCoupon } from './use-create-coupon';
import { Button } from '../../../shared/ui/button';
import { Input } from '../../../shared/ui/input';
import { Select } from '../../../shared/ui/select';
import { Label } from '../../../shared/ui/label';

interface CreateCouponFormProps {
  onCloseCouponForm: () => void;
}

export function CreateCouponForm({ onCloseCouponForm }: CreateCouponFormProps) {
  const {
    couponForm,
    onCreateCoupon,
    onChangeName,
    onChangeCode,
    onChangeDiscountType,
    onChangeDiscountValue,
    onBlurDiscountValue,
  } = useCreateCoupon({ onCloseCouponForm });

  const isAmount = couponForm.discountType === 'amount';

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={onCreateCoupon} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label>쿠폰명</Label>
            <Input
              type="text"
              value={couponForm.name}
              onChange={onChangeName}
              placeholder="신규 가입 쿠폰"
              className="text-sm"
              required
            />
          </div>
          <div>
            <Label>쿠폰 코드</Label>
            <Input
              type="text"
              value={couponForm.code}
              onChange={onChangeCode}
              placeholder="WELCOME2024"
              className="text-sm font-mono"
              required
            />
          </div>
          <div>
            <Label>할인 타입</Label>
            <Select
              value={couponForm.discountType}
              onChange={onChangeDiscountType}
              className="text-sm"
            >
              <option value="amount">정액 할인</option>
              <option value="percentage">정률 할인</option>
            </Select>
          </div>
          <div>
            <Label>{isAmount ? '할인 금액' : '할인율(%)'}</Label>
            <Input
              type="text"
              value={
                couponForm.discountValue === 0 ? '' : couponForm.discountValue
              }
              onChange={onChangeDiscountValue}
              onBlur={onBlurDiscountValue}
              placeholder={isAmount ? '5000' : '10'}
              className="text-sm"
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onCloseCouponForm}>
            취소
          </Button>
          <Button variant="primary" type="submit">
            쿠폰 생성
          </Button>
        </div>
      </form>
    </div>
  );
}
