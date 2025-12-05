import { Coupon, CouponValidation, useCouponForm } from '@/features/coupon';
import { useNotification } from '@/shared/contexts';
import { Input, Button, Select } from '@/shared/ui';

interface CouponsFormProps {
  addCoupon: (
    newCoupon: Coupon,
    callbacks?: {
      onSuccess?: (validation: CouponValidation) => void;
      onError?: (validation: CouponValidation) => void;
    }
  ) => void;
  close: () => void;
}
export const CouponsForm = ({ addCoupon, close }: CouponsFormProps) => {
  const { addNotification } = useNotification();
  const { form, onBlurHandler, onChangeHandler, onSubmit } = useCouponForm(
    addCoupon,
    close
  );

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form
        onSubmit={(e) => {
          onSubmit(e, {
            onSuccess: ({ message }) => addNotification(message, 'success'),
            onError: ({ message }) => addNotification(message, 'error'),
          });
        }}
        className="space-y-4"
      >
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              쿠폰명
            </label>
            <Input
              value={form.name}
              onChange={onChangeHandler('name')}
              placeholder="신규 가입 쿠폰"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              쿠폰 코드
            </label>
            <Input
              value={form.code}
              onChange={onChangeHandler('code')}
              placeholder="WELCOME2024"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              할인 타입
            </label>
            <Select
              value={form.discountType}
              onChange={onChangeHandler('discountType')}
              required
            >
              <option value="amount">정액 할인</option>
              <option value="percentage">정률 할인</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {form.discountType === 'amount' ? '할인 금액' : '할인율(%)'}
            </label>
            <Input
              value={form.discountValue}
              onChange={onChangeHandler('discountValue')}
              onBlur={(e) => {
                onBlurHandler('discountValue', {
                  onError: ({ message }) => addNotification(message, 'error'),
                })(e);
              }}
              placeholder={form.discountType === 'amount' ? '5000' : '10'}
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => close()}>
            취소
          </Button>
          <Button type="submit" variant="primary">
            쿠폰 생성
          </Button>
        </div>
      </form>
    </div>
  );
};
