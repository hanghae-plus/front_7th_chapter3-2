import { Coupon } from "../../../../types";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";

interface CouponFormProps {
  couponForm: Coupon;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDiscountTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDiscountValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDiscountValueBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const CouponForm = ({
  couponForm,
  onSubmit,
  onCancel,
  onNameChange,
  onCodeChange,
  onDiscountTypeChange,
  onDiscountValueChange,
  onDiscountValueBlur,
}: CouponFormProps) => {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={onSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="쿠폰명"
            type="text"
            value={couponForm.name}
            onChange={onNameChange}
            placeholder="신규 가입 쿠폰"
            required
          />
          <Input
            label="쿠폰 코드"
            type="text"
            value={couponForm.code}
            onChange={onCodeChange}
            placeholder="WELCOME2024"
            required
          />
          <Select
            label="할인 타입"
            value={couponForm.discountType}
            onChange={onDiscountTypeChange}
            options={[
              { value: "amount", label: "정액 할인" },
              { value: "percentage", label: "정률 할인" },
            ]}
          />
          <Input
            label={
              couponForm.discountType === "amount" ? "할인 금액" : "할인율(%)"
            }
            type="text"
            value={
              couponForm.discountValue === 0 ? "" : couponForm.discountValue
            }
            onChange={onDiscountValueChange}
            onBlur={onDiscountValueBlur}
            placeholder={couponForm.discountType === "amount" ? "5000" : "10"}
            required
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" onClick={onCancel} variant="outline">
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
