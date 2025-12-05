import { Coupon } from "../../../types";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

interface CouponFormProps {
  couponForm: Coupon;
  setCouponForm: (form: Coupon) => void;
  addNotification?: (message: string, type: 'error' | 'success' | 'warning') => void;
  onSave: () => void;
  onCancel: () => void;
}

export function CouponForm({
  couponForm,
  setCouponForm,
  addNotification,
  onSave,
  onCancel
}: CouponFormProps) {

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={handleCouponSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">
          새 쿠폰 생성
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="쿠폰명"
            type="text"
            value={couponForm.name}
            onChange={(e) =>
              setCouponForm({ ...couponForm, name: e.target.value })
            }
            placeholder="신규 가입 쿠폰"
            fullWidth
            required
          />
          <Input
            label="쿠폰 코드"
            type="text"
            value={couponForm.code}
            onChange={(e) =>
              setCouponForm({
                ...couponForm,
                code: e.target.value.toUpperCase(),
              })
            }
            className="font-mono"
            placeholder="WELCOME2024"
            fullWidth
            required
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              할인 타입
            </label>
            <select
              value={couponForm.discountType}
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  discountType: e.target.value as
                    | "amount"
                    | "percentage",
                })
              }
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
            >
              <option value="amount">정액 할인</option>
              <option value="percentage">정률 할인</option>
            </select>
          </div>
          <Input
            label={couponForm.discountType === "amount" ? "할인 금액" : "할인율(%)"}
            type="text"
            value={
              couponForm.discountValue === 0
                ? ""
                : couponForm.discountValue
            }
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || /^\d+$/.test(value)) {
                setCouponForm({
                  ...couponForm,
                  discountValue: value === "" ? 0 : parseInt(value),
                });
              }
            }}
            onBlur={(e) => {
              const value = parseInt(e.target.value) || 0;
              if (couponForm.discountType === "percentage") {
                if (value > 100) {
                  addNotification && addNotification(
                    "할인율은 100%를 초과할 수 없습니다",
                    "error"
                  );
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
                  addNotification && addNotification(
                    "할인 금액은 100,000원을 초과할 수 없습니다",
                    "error"
                  );
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
            }}
            placeholder={
              couponForm.discountType === "amount" ? "5000" : "10"
            }
            fullWidth
            required
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            쿠폰 생성
          </Button>
        </div>
      </form>
    </div>
  )
}