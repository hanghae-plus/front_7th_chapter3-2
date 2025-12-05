import { Coupon } from '../../../../types';
import { ToastProps } from '../../../shared/ui/toast';
import { useCreateCoupon } from './use-create-coupon';

interface CreateCouponFormProps {
  addCoupon: (coupon: Coupon) => void;
  onCloseCouponForm: () => void;
  toast: (notification: ToastProps) => void;
}

export function CreateCouponForm({
  addCoupon,
  onCloseCouponForm,
  toast,
}: CreateCouponFormProps) {
  const {
    couponForm,
    onCreateCoupon,
    onChangeName,
    onChangeCode,
    onChangeDiscountType,
    onChangeDiscountValue,
    onBlurDiscountValue,
  } = useCreateCoupon({ addCoupon, onCloseCouponForm, toast });

  const isAmount = couponForm.discountType === 'amount';

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={onCreateCoupon} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              쿠폰명
            </label>
            <input
              type="text"
              value={couponForm.name}
              onChange={onChangeName}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              placeholder="신규 가입 쿠폰"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              쿠폰 코드
            </label>
            <input
              type="text"
              value={couponForm.code}
              onChange={onChangeCode}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm font-mono"
              placeholder="WELCOME2024"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              할인 타입
            </label>
            <select
              value={couponForm.discountType}
              onChange={onChangeDiscountType}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
            >
              <option value="amount">정액 할인</option>
              <option value="percentage">정률 할인</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isAmount ? '할인 금액' : '할인율(%)'}
            </label>
            <input
              type="text"
              value={
                couponForm.discountValue === 0 ? '' : couponForm.discountValue
              }
              onChange={onChangeDiscountValue}
              onBlur={onBlurDiscountValue}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              placeholder={isAmount ? '5000' : '10'}
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCloseCouponForm}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            쿠폰 생성
          </button>
        </div>
      </form>
    </div>
  );
}
