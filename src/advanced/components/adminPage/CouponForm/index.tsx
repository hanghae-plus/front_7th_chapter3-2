import { type FC } from "react";
import Button from "../../_common/Button";
import { Coupon } from "../../../../types";
import FormInput from "../../_common/FormInput";

interface IProps {
  couponForm: Coupon;
  onNameChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onDiscountTypeChange: (type: "amount" | "percentage") => void;
  onDiscountValueChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const CouponForm: FC<IProps> = ({
  couponForm,
  onNameChange,
  onCodeChange,
  onDiscountTypeChange,
  onDiscountValueChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={onSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FormInput
            label="쿠폰명"
            value={couponForm.name}
            onValueChange={onNameChange}
            placeholder="신규 가입 쿠폰"
            required
          />
          <FormInput
            label="쿠폰 코드"
            value={couponForm.code}
            onValueChange={onCodeChange}
            placeholder="WELCOME2024"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              할인 타입
            </label>
            <select
              value={couponForm.discountType}
              onChange={(e) =>
                onDiscountTypeChange(e.target.value as "amount" | "percentage")
              }
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm">
              <option value="amount">정액 할인</option>
              <option value="percentage">정률 할인</option>
            </select>
          </div>
          <FormInput
            label={
              couponForm.discountType === "amount" ? "할인 금액" : "할인율(%)"
            }
            value={
              couponForm.discountValue === 0 ? "" : couponForm.discountValue
            }
            onValueChange={onDiscountValueChange}
            placeholder={couponForm.discountType === "amount" ? "5000" : "10"}
            required
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            color="gray"
            onClick={onCancel}>
            취소
          </Button>
          <Button type="submit" variant="solid" color="indigo">
            쿠폰 생성
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;
