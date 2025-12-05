import { validateCoupon } from "../models/validateCoupon";
import { Coupon } from "../types";
import { isValidNumber } from "../utils/isValidNumber";
import { toNumber } from "../utils/toNumber";
import { useToast } from "../utils/hooks/useToast";

export function CouponForm({
  couponForm,
  onChange,
  onCancel,
  onSubmit,
}: {
  onSubmit: (e: React.FormEvent) => void;
  couponForm: Coupon;
  onChange: (couponForm: Coupon) => void;
  onCancel: (show: boolean) => void;
}) {
  const { notify } = useToast();
  const handleDiscountBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = toNumber(e.target.value);
    const error = validateCoupon(couponForm.discountType, value);
    switch (error) {
      case "DISCOUNT_RATE_OVER_100":
        notify("할인율은 100%를 초과할 수 없습니다", "error");
        onChange({ ...couponForm, discountValue: 100 });
        return;
      case "DISCOUNT_RATE_UNDER_0":
        notify("할인율은 0% 이하일 수 없습니다", "error");
        onChange({ ...couponForm, discountValue: 0 });
        return;
      case "DISCOUNT_AMOUNT_OVER_100000":
        notify("할인 금액은 100,000원을 초과할 수 없습니다", "error");
        onChange({ ...couponForm, discountValue: 100000 });
        return;
      case "DISCOUNT_AMOUNT_UNDER_0":
        notify("할인 금액은 0원 이하일 수 없습니다", "error");
        onChange({ ...couponForm, discountValue: 0 });
        return;
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={onSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              쿠폰명
            </label>
            <input
              type="text"
              value={couponForm.name}
              onChange={(e) =>
                onChange({ ...couponForm, name: e.target.value })
              }
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
              onChange={(e) =>
                onChange({
                  ...couponForm,
                  code: e.target.value.toUpperCase(),
                })
              }
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
              onChange={(e) =>
                onChange({
                  ...couponForm,
                  discountType: e.target.value as "amount" | "percentage",
                })
              }
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
            >
              <option value="amount">정액 할인</option>
              <option value="percentage">정률 할인</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {couponForm.discountType === "amount" ? "할인 금액" : "할인율(%)"}
            </label>
            <input
              type="text"
              value={
                couponForm.discountValue === 0 ? "" : couponForm.discountValue
              }
              onChange={(e) => {
                const value = e.target.value;
                if (isValidNumber(value)) {
                  onChange({
                    ...couponForm,
                    discountValue: toNumber(value),
                  });
                }
              }}
              onBlur={handleDiscountBlur}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              placeholder={couponForm.discountType === "amount" ? "5000" : "10"}
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => onCancel(false)}
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
